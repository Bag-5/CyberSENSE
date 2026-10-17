/**
 * Imports hand-generated art from inbox/ into the project.
 *
 * Files are matched to targets by the numeric prefix in their name, which
 * Gemini's downloads happen to carry, and otherwise by position (mtime order)
 * so that numbered downloads such as "image (1).png" work with no renaming.
 * Each imported file is trimmed of letterbox bars and converted to WebP.
 *
 * Usage:
 *   node scripts/import-art.mjs --dry-run   # show the plan, move nothing
 *   node scripts/import-art.mjs             # place, trim, convert
 */

import { readFile, readdir, mkdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";
import { writeOut } from "./lib/fs-safe.mjs";

const ROOT = process.cwd();
const INBOX = path.join(ROOT, "inbox");
const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");

const IMAGE_RE = /\.(png|jpe?g|webp)$/i;

const QUALITY = 82;
const DARK = 26;
const INSET = 1;

/* ------------------------------ letterbox trim ---------------------------- */

const isDark = (r, g, b) => r <= DARK && g <= DARK && b <= DARK;

/** Removes uniform dark bands from the edges, conservatively across samples. */
async function trimBars(buffer) {
  const { data, info } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const at = (x, y) => {
    const o = (y * w + x) * c;
    return [data[o], data[o + 1], data[o + 2]];
  };

  const SAMPLES = 24;
  const MIN_RATIO = 0.02;

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

  if (!t && !b && !l && !r) return { buffer, trimmed: false, from: `${w}x${h}` };

  const width = w - l - r;
  const height = h - t - b;
  const pipeline = sharp(buffer).extract({ left: l, top: t, width, height });
  const out = await pipeline.webp({ quality: QUALITY }).toBuffer();
  return { buffer: out, trimmed: true, from: `${w}x${h}`, to: `${width}x${height}` };
}

/* -------------------------------- matching ------------------------------- */

/** Reads the expected targets in prompt order. */
async function loadTargets() {
  const csv = await readFile(path.join(ROOT, "scripts", "course-art-manifest.csv"), "utf8");
  return csv
    .split("\n")
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [order, id, saveAs, ratio, target] = line.split(",");
      return { order: Number(order), id, saveAs, ratio, target };
    })
    .sort((a, b) => a.order - b.order);
}

async function collectInbox() {
  let entries;
  try {
    entries = await readdir(INBOX, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const e of entries) {
    if (!e.isFile() || !IMAGE_RE.test(e.name)) continue;
    const full = path.join(INBOX, e.name);
    const info = await stat(full);
    files.push({ name: e.name, path: full, mtime: info.mtimeMs });
  }
  return files.sort((a, b) => a.mtime - b.mtime);
}

/**
 * Pairs files to targets. An explicit numeric prefix in the filename wins;
 * otherwise fall back to positional order. The target's own filename counts as
 * an explicit prefix, so re-importing a corrected single image works.
 */
function pair(files, targets) {
  const pairs = [];
  const used = new Set();

  const leadingNumber = (name) => {
    const m = name.match(/(?:^|[^0-9])(\d{1,3})(?=[^0-9]|$)/);
    return m ? Number(m[1]) : null;
  };

  // Pass 1 — filename says exactly which target this is.
  for (const file of files) {
    const stem = path.basename(file.name, path.extname(file.name));
    const byName = targets.find((t) => {
      const tStem = path.basename(t.saveAs, path.extname(t.saveAs));
      return !used.has(t) && (stem === tStem || stem.startsWith(`${tStem}-`));
    });
    if (byName) {
      pairs.push({ file, target: byName });
      used.add(byName);
      continue;
    }
    const n = leadingNumber(file.name);
    if (n !== null && targets[n - 1] && !used.has(targets[n - 1])) {
      pairs.push({ file, target: targets[n - 1] });
      used.add(targets[n - 1]);
    }
  }

  // Pass 2 — anything left over falls into the next unclaimed slot in order.
  for (const file of files) {
    if (pairs.some((p) => p.file.path === file.path)) continue;
    const next = targets.find((t) => !used.has(t));
    if (!next) break;
    pairs.push({ file, target: next });
    used.add(next);
  }

  return pairs.sort((a, b) => a.target.order - b.target.order);
}

/* ---------------------------------- main ---------------------------------- */

async function main() {
  const targets = await loadTargets();
  const files = await collectInbox();

  if (!files.length) {
    process.stdout.write(
      `inbox/ is empty. Drop downloaded images into:\n  ${INBOX}\n\n` +
        `Expected ${targets.length} in total. See scripts/course-art-prompts.md.\n`,
    );
    return;
  }

  const pairs = pair(files, targets);

  if (pairs.length < targets.length) {
    process.stdout.write(
      `Note: ${pairs.length} of ${targets.length} present. ` +
        `Missing ${targets.length - pairs.length} will fall back to placeholder-free gaps.\n\n`,
    );
  }

  let before = 0;
  let after = 0;

  for (const { file, target } of pairs) {
    const raw = await readFile(file.path);
    before += raw.length;

    const dest = path.join(ROOT, target.target);
    const ext = path.extname(dest);

    let buffer = raw;
    let note = "";
    try {
      const trimmed = await trimBars(raw);
      buffer = trimmed.buffer;
      note = trimmed.trimmed ? ` trimmed ${trimmed.from}->${trimmed.to}` : "";
    } catch (error) {
      note = ` (trim skipped: ${error instanceof Error ? error.message : "unknown"})`;
    }

    let outPath = dest;
    let outBuf = buffer;
    if (ext.toLowerCase() === ".webp") {
      outBuf = await sharp(buffer).webp({ quality: QUALITY }).toBuffer();
    }

    const { width, height } = await sharp(outBuf).metadata();

    process.stdout.write(
      `  ${String(target.order).padStart(2)}  ${path.basename(dest).padEnd(16)} ` +
        `${file.name.slice(0, 34).padEnd(34)} -> ${width}x${height}` +
        ` ${(raw.length / 1024).toFixed(0)}KB->${(outBuf.length / 1024).toFixed(0)}KB${note}\n`,
    );

    if (!dryRun) {
      await mkdir(path.dirname(outPath), { recursive: true });
      await writeOut(outPath, outBuf);
    }
    after += outBuf.length;
  }

  const saved = ((1 - after / before) * 100).toFixed(0);
  process.stdout.write(
    `\n${dryRun ? "[dry run] " : ""}${pairs.length} files. ` +
      `${(before / 1024 / 1024).toFixed(1)} MB -> ${(after / 1024 / 1024).toFixed(1)} MB (-${saved}%).\n`,
  );

  if (dryRun) {
    process.stdout.write("Nothing written. Drop the files in place and re-run without --dry-run.\n");
  } else {
    // Clear the inbox only after a clean pass so nothing is lost on failure.
    let cleared = 0;
    for (const { file } of pairs) {
      await unlink(file.path).then(() => { cleared += 1; }).catch(() => {});
    }
    process.stdout.write(`Cleared ${cleared} file(s) from inbox/.\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`Fatal: ${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});