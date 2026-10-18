#!/usr/bin/env node
/**
 * Post-processes hand-generated course art in place.
 *
 * Gemini saves PNGs. This walks public/courses, crops the bright corner mark
 * Gemini stamps into every frame, removes letterbox bars, and rewrites each
 * file as WebP, then refreshes COURT-ART-CHECKLIST.md.
 *
 * Gemini's invisible SynthID provenance marker is not touched by any of this.
 *
 * Safe to run repeatedly.
 *
 * Usage:
 *   node scripts/process-course-art.mjs           # process, keep source PNGs
 *   node scripts/process-course-art.mjs --prune   # also delete the source PNGs
 *   node scripts/process-course-art.mjs --check   # report only, write nothing
 */

import { readdir, readFile, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";
import { writeOut } from "./lib/fs-safe.mjs";

const ROOT = process.cwd();
const argv = process.argv.slice(2);
const checkOnly = argv.includes("--check");
// Sources are kept by default. --prune deletes them once the WebP is written,
// which halves what lands in the repo but discards the original.
const prune = argv.includes("--prune");

const COURSES = path.join(ROOT, "public", "courses");
const QUALITY = 82;
const DARK = 26;
const INSET = 1;
const SAMPLES = 24;
const MIN_RATIO = 0.02;

const isDark = (r, g, b) => r <= DARK && g <= DARK && b <= DARK;

const isWebpBuffer = (buf) =>
  buf.length > 12 &&
  buf.toString("ascii", 0, 4) === "RIFF" &&
  buf.toString("ascii", 8, 12) === "WEBP";

/* ---------------------------- letterbox bars ----------------------------- */

/** Removes uniform dark bands from the edges, conservatively across samples. */
async function trimBars(buffer) {
  const { data, info } = await sharp(buffer)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const at = (x, y) => {
    const o = (y * w + x) * c;
    return [data[o], data[o + 1], data[o + 2]];
  };

  let top = Infinity;
  let bottom = Infinity;
  for (let s = 1; s <= SAMPLES; s += 1) {
    const x = Math.min(w - 1, Math.floor((s * w) / (SAMPLES + 1)));
    let t = 0;
    while (t < h && isDark(...at(x, t))) t += 1;
    let b = 0;
    while (b < h && isDark(...at(x, h - 1 - b))) b += 1;
    top = Math.min(top, t);
    bottom = Math.min(bottom, b);
  }

  let left = Infinity;
  let right = Infinity;
  for (let s = 1; s <= SAMPLES; s += 1) {
    const y = Math.min(h - 1, Math.floor((s * h) / (SAMPLES + 1)));
    let l = 0;
    while (l < w && isDark(...at(l, y))) l += 1;
    let r = 0;
    while (r < w && isDark(...at(w - 1 - r, y))) r += 1;
    left = Math.min(left, l);
    right = Math.min(right, r);
  }

  const t = top / h > MIN_RATIO ? Math.max(0, top - INSET) : 0;
  const b = bottom / h > MIN_RATIO ? Math.max(0, bottom - INSET) : 0;
  const l = left / w > MIN_RATIO ? Math.max(0, left - INSET) : 0;
  const r = right / w > MIN_RATIO ? Math.max(0, right - INSET) : 0;

  if (!t && !b && !l && !r) return { buffer, trimmed: null };

  const width = w - l - r;
  const height = h - t - b;
  const out = await sharp(buffer)
    .extract({ left: l, top: t, width, height })
    .webp({ quality: QUALITY })
    .toBuffer();

  return { buffer: out, trimmed: { from: `${w}x${h}`, to: `${width}x${height}` } };
}

/* ---------------------------- corner artefact ---------------------------- */

/**
 * Gemini stamps a small bright four-pointed mark into the bottom-right of every
 * generated frame, sitting about 65px in from each edge and spanning roughly
 * 96px. Brightness detection proved unreliable because bright artwork often
 * occupies the same corner, so we crop a fixed, generous inset instead.
 *
 * The invisible SynthID provenance marker is untouched by this.
 *
 * The resulting ratio drifts slightly from the requested one, which is fine
 * because every consumer renders with object-cover inside a fixed aspect box.
 */
async function stripCornerMark(buffer) {
  const { width: w, height: h } = await sharp(buffer).metadata();

  const right = Math.max(Math.round(w * 0.075), 180);
  const bottom = Math.max(Math.round(h * 0.115), 180);

  const width = w - right;
  const height = h - bottom;
  if (width < 64 || height < 64) {
    return { buffer, right: 0, bottom: 0, trimmed: false };
  }

  const out = await sharp(buffer).extract({ left: 0, top: 0, width, height }).toBuffer();
  return { buffer: out, right, bottom, trimmed: true };
}

/* ---------------------------- checklist refresh --------------------------- */

async function refreshChecklist() {
  const manifest = JSON.parse(
    await readFile(path.join(ROOT, "scripts", "image-manifest.json"), "utf8"),
  );

  const expected = manifest.images
    .filter((i) => i.id.startsWith("course-"))
    .map((i) => ({
      base: path.basename(i.out, path.extname(i.out)),
      slug: i.id.replace(/^course-/, "").replace(/-(hero|figure-\d)$/, ""),
    }));

  const all = [];
  for (const slug of new Set(expected.map((e) => e.slug))) {
    let entries = [];
    try {
      entries = await readdir(path.join(COURSES, slug));
    } catch {
      /* folder not created yet */
    }
    for (const e of expected.filter((x) => x.slug === slug)) {
      all.push({
        ...e,
        done: entries.some((f) => path.basename(f, path.extname(f)) === e.base),
      });
    }
  }

  const done = all.filter((a) => a.done).length;
  const body = [
    "# Course Art — Progress",
    "",
    `${done} of ${all.length} images present.`,
    "",
    ...all.map(
      (a) =>
        `- [${a.done ? "x" : " "}] ${a.slug}/${a.base}${a.done ? "" : "   <- still needed"}`,
    ),
    "",
  ].join("\n");

  await writeFile(path.join(ROOT, "COURT-ART-CHECKLIST.md"), body, "utf8");
  return { done, total: all.length };
}

/* ---------------------------------- main ---------------------------------- */

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(png|jpe?g)$/i.test(e.name)) out.push(full);
  }
  return out;
}

async function main() {
  const files = await walk(COURSES);

  if (!files.length) {
    process.stdout.write(
      "No PNG/JPG files under public/courses yet.\n" +
        "Save generated images into public/courses/<course>/ using the names in\n" +
        "COURT-ART-PROMPTS.md, then run this again.\n",
    );
    const { done, total } = await refreshChecklist();
    process.stdout.write(`\nProgress: ${done}/${total} images present.\n`);
    return;
  }

  let before = 0;
  let after = 0;

  for (const file of files) {
    const raw = await readFile(file);
    before += raw.length;

    const target = file.replace(/\.(png|jpe?g)$/i, ".webp");
    let buffer = raw;
    const notes = [];

    // Corner mark first, on the original pixels.
    if (!isWebpBuffer(buffer)) {
      const corner = await stripCornerMark(buffer);
      buffer = corner.buffer;
      if (corner.trimmed) notes.push(`corner -r${corner.right} -b${corner.bottom}`);
    }

    // Then letterbox bars.
    try {
      const result = await trimBars(buffer);
      buffer = result.buffer;
      if (result.trimmed) {
        notes.push(`trimmed ${result.trimmed.from} -> ${result.trimmed.to}`);
      }
    } catch (error) {
      notes.push(`(trim skipped: ${error instanceof Error ? error.message : "unknown"})`);
    }

    const outBuf = isWebpBuffer(buffer)
      ? buffer
      : await sharp(buffer).webp({ quality: QUALITY }).toBuffer();

    const { width, height } = await sharp(outBuf).metadata();
    const note = notes.length ? `  ${notes.join("  ")}` : "";

    process.stdout.write(
      `  ${path.relative(ROOT, target).padEnd(44)} ${width}x${height}  ` +
        `${(raw.length / 1024).toFixed(0)}KB -> ${(outBuf.length / 1024).toFixed(0)}KB${note}\n`,
    );

    if (!checkOnly) {
      await writeOut(target, outBuf);
      if (prune && path.resolve(target) !== path.resolve(file)) {
        await unlink(file).catch(() => {});
      }
    }
    after += outBuf.length;
  }

  const pct = before ? ((1 - after / before) * 100).toFixed(0) : "0";
  process.stdout.write(
    `\n${files.length} file(s). ${(before / 1024 / 1024).toFixed(1)} MB -> ` +
      `${(after / 1024 / 1024).toFixed(1)} MB (-${pct}%).\n`,
  );
  if (checkOnly) process.stdout.write("[check] Nothing written.\n");

  const { done, total } = await refreshChecklist();
  process.stdout.write(`Progress: ${done}/${total} images present.\n`);
}

main().catch((error) => {
  process.stderr.write(`Fatal: ${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});