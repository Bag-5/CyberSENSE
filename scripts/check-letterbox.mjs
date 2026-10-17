/**
 * Detects baked-in letterbox bars in generated art.
 *
 * The image provider honours aspect_ratio by letterboxing rather than
 * re-framing, so wide or tall content can arrive padded with black bands.
 * This samples the outer rows/columns and reports how much dead space each
 * edge carries, so we know whether to re-prompt or crop.
 *
 * Usage: node scripts/check-letterbox.mjs public/stories
 */

import { readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const ROOT = process.cwd();
const argv = process.argv.slice(2);
const scanRoots = argv.length ? argv.map((a) => path.resolve(ROOT, a)) : [path.join(ROOT, "public", "stories")];

const DARK = 26; // 0-255; anything at or below this on all channels counts as bar

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
    else if (/\.(png|webp|jpe?g)$/i.test(e.name)) out.push(full);
  }
  return out;
}

/** Fraction of consecutive fully-dark rows starting from an edge. */
function darkRun(getPixel, length, count, fromEnd) {
  let run = 0;
  for (let i = 0; i < count; i += 1) {
    const idx = fromEnd ? (length - 1 - i) : i;
    const [r, g, b] = getPixel(idx);
    if (r <= DARK && g <= DARK && b <= DARK) run += 1;
    else break;
  }
  return run;
}

async function analyse(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const at = (x, y) => {
    const o = (y * w + x) * c;
    return [data[o], data[o + 1], data[o + 2]];
  };
  // Sample a column through the horizontal centre for top/bottom runs.
  const midX = Math.floor(w / 2);
  const top = darkRun((y) => at(midX, y), h, h, false);
  const bottom = darkRun((y) => at(midX, y), h, h, true);
  // Sample a row through the vertical centre for left/right runs.
  const midY = Math.floor(h / 2);
  const left = darkRun((x) => at(x, midY), w, w, false);
  const right = darkRun((x) => at(x, midY), w, w, true);
  return { w, h, top, bottom, left, right };
}

async function main() {
  const files = (await Promise.all(scanRoots.map(walk))).flat();
  if (!files.length) {
    process.stdout.write("No images found.\n");
    return;
  }

  const flagged = [];
  for (const file of files) {
    let r;
    try {
      r = await analyse(file);
    } catch {
      process.stdout.write(`  error  ${path.relative(ROOT, file)}\n`);
      continue;
    }
    const vt = r.top / r.h;
    const vb = r.bottom / r.h;
    const hl = r.left / r.w;
    const hr = r.right / r.w;
    const worst = Math.max(vt, vb, hl, hr);
    if (worst > 0.02) {
      flagged.push({ file, ...r, vt, vb, hl, hr, worst });
    }
  }

  if (!flagged.length) {
    process.stdout.write(`Clean: none of the ${files.length} images carry letterbox bars.\n`);
    return;
  }

  flagged.sort((a, b) => b.worst - a.worst);
  for (const f of flagged) {
    process.stdout.write(
      `  ${(f.worst * 100).toFixed(1).padStart(5)}%  ${path.relative(ROOT, f.file)}  ` +
        `[top ${f.top}px bottom ${f.bottom}px left ${f.left}px right ${f.right}px of ${f.w}x${f.h}]\n`,
    );
  }
  process.stdout.write(`\n${flagged.length} of ${files.length} images have bars.\n`);
}

main().catch((error) => {
  process.stderr.write(`Fatal: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});