/**
 * Trims baked-in letterbox bars from generated art.
 *
 * The provider honours aspect_ratio by padding with black rather than
 * re-framing, so some images arrive with uniform dead bands. This measures
 * each edge across many sample lines and removes only the depth that is dark
 * on *every* sample line — the minimum run. That conservative rule keeps
 * genuinely dark scenes (night dorm rooms, evening interiors) intact instead
 * of eating into their shadows.
 *
 * Usage:
 *   node scripts/trim-bars.mjs                     # report only
 *   node scripts/trim-bars.mjs --fix               # crop in place
 *   node scripts/trim-bars.mjs --min 0.02          # only trim bars >= 2% of the axis
 */

import { readdir } from "node:fs/promises";
import { writeOut } from "./lib/fs-safe.mjs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const ROOT = process.cwd();
const argv = process.argv.slice(2);
const fix = argv.includes("--fix");

const minIdx = argv.indexOf("--min");
const MIN_RATIO = minIdx >= 0 ? Number(argv[minIdx + 1]) : 0.02;

// Indices consumed by flags (the flag itself and any value it takes).
const flagIdx = new Set();
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i].startsWith("--")) {
    flagIdx.add(i);
    if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) flagIdx.add(i + 1);
  }
}

const scanRoots = argv
  .filter((a, i) => !a.startsWith("--") && !flagIdx.has(i))
  .map((a) => path.resolve(ROOT, a));

const DARK = 26;
const SAMPLES = 24; // sample lines per axis
const INSET = 1; // px of slack left at each trimmed edge, to avoid hard seams

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
    else if (/\.(png|webp)$/i.test(e.name)) out.push(full);
  }
  return out;
}

const isDark = (r, g, b) => r <= DARK && g <= DARK && b <= DARK;

/** Measures how far a uniformly dark band extends inward from each edge. */
async function measure(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
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

  return { w, h, top, bottom, left, right };
}

async function main() {
  const files = (await Promise.all(scanRoots.map(walk))).flat();
  if (!files.length) {
    process.stdout.write("No images found.\n");
    return;
  }

  let trimmed = 0;

  for (const file of files) {
    const m = await measure(file);

    const trimTop = m.top / m.h > MIN_RATIO ? Math.max(0, m.top - INSET) : 0;
    const trimBottom = m.bottom / m.h > MIN_RATIO ? Math.max(0, m.bottom - INSET) : 0;
    const trimLeft = m.left / m.w > MIN_RATIO ? Math.max(0, m.left - INSET) : 0;
    const trimRight = m.right / m.w > MIN_RATIO ? Math.max(0, m.right - INSET) : 0;

    if (!trimTop && !trimBottom && !trimLeft && !trimRight) continue;

    const width = m.w - trimLeft - trimRight;
    const height = m.h - trimTop - trimBottom;
    if (width < 32 || height < 32) continue;

    process.stdout.write(
      `  trim   ${path.relative(ROOT, file)}  ${m.w}x${m.h} -> ${width}x${height}  ` +
        `(t${trimTop} b${trimBottom} l${trimLeft} r${trimRight})\n`,
    );

    if (fix) {
      const pipeline = sharp(file).extract({
        left: trimLeft,
        top: trimTop,
        width,
        height,
      });
      const buf = /\.webp$/i.test(file)
        ? await pipeline.webp({ quality: 82 }).toBuffer()
        : await pipeline.png({ compressionLevel: 9 }).toBuffer();
      await writeOut(file, buf);
    }
    trimmed += 1;
  }

  process.stdout.write(
    `\n${trimmed} of ${files.length} images need trimming (threshold ${(MIN_RATIO * 100).toFixed(0)}%).` +
      `${fix ? " Cropped in place." : " Nothing written — pass --fix to apply."}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`Fatal: ${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});