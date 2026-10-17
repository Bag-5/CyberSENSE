/**
 * Verifies that every image path referenced in a data file resolves to a real
 * file under public/, and that no orphan assets are sitting unused.
 *
 * Usage: node scripts/check-story-assets.mjs
 */

import { readFile, readdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();

const source = await readFile(path.join(ROOT, "src", "data", "stories.ts"), "utf8");
const referenced = [...source.matchAll(/"\/stories\/[^"]+"/g)].map((m) => m[0].slice(1, -1));

const storiesRoot = path.join(ROOT, "public", "stories");
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
    else out.push(full);
  }
  return out;
}

const onDisk = await walk(storiesRoot);
const missing = [];
for (const ref of new Set(referenced)) {
  const full = path.join(ROOT, "public", ref.replace(/^\//, ""));
  try {
    await access(full, constants.F_OK);
  } catch {
    missing.push(ref);
  }
}

const referencedSet = new Set(referenced.map((r) => path.resolve(ROOT, "public", r.replace(/^\//, ""))));
const orphans = onDisk.filter((f) => !referencedSet.has(path.resolve(f)));

process.stdout.write(`Referenced paths : ${new Set(referenced).size}\n`);
process.stdout.write(`Files on disk     : ${onDisk.length}\n`);
process.stdout.write(`Missing           : ${missing.length}\n`);
process.stdout.write(`Orphans           : ${orphans.length}\n`);

for (const m of missing) process.stdout.write(`  MISSING  ${m}\n`);
for (const o of orphans) process.stdout.write(`  ORPHAN   ${path.relative(ROOT, o)}\n`);

if (missing.length || orphans.length) process.exitCode = 1;
else process.stdout.write("\nAll story assets resolve and nothing is orphaned.\n");