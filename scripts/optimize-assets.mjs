/**
 * Converts generated PNG assets to WebP in place.
 *
 * The image provider returns PNG regardless of the requested output_format,
 * and these are flat illustrations — PNG is the wrong container for them.
 * Rewrites each file as .webp and removes the .png when the saving is real.
 *
 * Usage:
 *   node scripts/optimize-assets.mjs                    # whole public/stories tree
 *   node scripts/optimize-assets.mjs public/courses     # another subtree
 *   node scripts/optimize-assets.mjs --check             # report only, change nothing
 */

import { readdir, readFile, unlink } from "node:fs/promises";
import { writeOut } from "./lib/fs-safe.mjs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const ROOT = process.cwd();
const argv = process.argv.slice(2);
const checkOnly = argv.includes("--check");
const targets = argv
  .filter((a) => !a.startsWith("--"))
  .map((a) => path.resolve(ROOT, a));
const scanRoots = targets.length ? targets : [path.join(ROOT, "public", "stories")];

/** Set a floor so we never trade real bytes for a negligible gain. */
const MIN_SAVING_RATIO = 0.1;
const QUALITY = 82;

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.png$/i.test(entry.name)) out.push(full);
  }
  return out;
}

async function main() {
  const files = (await Promise.all(scanRoots.map(walk))).flat();
  if (!files.length) {
    process.stdout.write("No PNG files found to convert.\n");
    return;
  }

  let before = 0;
  let after = 0;
  let converted = 0;
  let skipped = 0;

  for (const file of files) {
    const original = await readFile(file);
    const originalBytes = original.length;

    // Already-optimised images get a second pass through sharp, so they may
    // come out slightly larger than the file on disk. Guard against churn.
    let buf;
    try {
      buf = await sharp(original).webp({ quality: QUALITY }).toBuffer();
    } catch {
      process.stdout.write(`  skip   ${path.relative(ROOT, file)} (encode failed)\n`);
      skipped += 1;
      continue;
    }

    before += originalBytes;
    after += buf.length;

    const gain = (originalBytes - buf.length) / originalBytes;
    const target = file.replace(/\.png$/i, ".webp");

    if (gain < MIN_SAVING_RATIO) {
      process.stdout.write(
        `  skip   ${path.relative(ROOT, file)} — only ${(gain * 100).toFixed(1)}% smaller\n`,
      );
      skipped += 1;
      after -= buf.length;
      before -= originalBytes;
      continue;
    }

    if (!checkOnly) {
      await writeOut(target, buf);
      await unlink(file).catch(() => {});
    }

    converted += 1;
    process.stdout.write(
      `  webp   ${path.relative(ROOT, target)}  ` +
        `${(originalBytes / 1024).toFixed(0)} KB -> ${(buf.length / 1024).toFixed(0)} KB  ` +
        `(-${(gain * 100).toFixed(0)}%)\n`,
    );
  }

  const pct = before ? ((1 - after / before) * 100).toFixed(1) : "0.0";
  process.stdout.write(
    `\n${checkOnly ? "[check] " : ""}${converted} converted, ${skipped} kept as PNG. ` +
      `${(before / 1024 / 1024).toFixed(1)} MB -> ${(after / 1024 / 1024).toFixed(1)} MB (-${pct}%).\n`,
  );
  if (checkOnly) process.stdout.write("No files were modified.\n");
}

main().catch((error) => {
  process.stderr.write(`Fatal: ${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});