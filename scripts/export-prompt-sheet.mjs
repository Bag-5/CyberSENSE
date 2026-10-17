#!/usr/bin/env node
/**
 * Emits a copy-paste prompt sheet for generating course art by hand.
 *
 * OpenRouter credits are not the right tool for bulk art, so this renders the
 * manifest into a markdown document you can work through in Gemini. Each entry
 * is fully self-contained — art direction is baked into the prompt — so order
 * does not matter and any single image can be regenerated on its own.
 *
 * Also emits a CSV of the target filenames so downloads can be placed and then
 * sorted automatically by scripts/import-art.mjs.
 *
 * Usage: node scripts/export-prompt-sheet.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const manifest = JSON.parse(
  await readFile(path.join(ROOT, "scripts", "image-manifest.json"), "utf8"),
);

const SELECT = manifest.images.filter((i) => i.id.startsWith("course-"));

/** 1-indexed human-friendly number, zero padded for stable sorting. */
const num = (i) => String(i + 1).padStart(2, "0");

const md = [
  `# Course Art — Prompt Sheet (${SELECT.length} images)`,
  "",
  "Paste each prompt into Gemini image generation, one at a time. Save the",
  "download to the `inbox/` folder in this repo (any filename), then run:",
  "",
  "```",
  "node scripts/import-art.mjs",
  "```",
  "",
  "The importer matches files to these prompts by order and filename, moves them",
  "into `public/courses/`, trims letterbox bars, and converts to WebP.",
  "",
  "## Notes for the generator",
  "",
  `- **Aspect ratio:** heroes are 16:9, figures are 4:3. Ask Gemini for the ratio explicitly.`,
  "- **Resolution:** 1K is plenty. These display at most ~1000px wide.",
  "- **No lettering:** the models cannot render text reliably. The prompts below",
  "  demand abstract placeholder bars instead, and all real labels are drawn in",
  "  the page component afterwards. Reject any image containing invented words.",
  "- **Letterbox bars:** ask for full-bleed. If black bands appear, the importer",
  "  trims them automatically.",
  "- Blank output is fine to skip — just leave that file out of `inbox/`.",
  "",
  "---",
  "",
];

SELECT.forEach((img, i) => {
  const n = num(i);
  md.push(`## ${n}. \`${img.id}\``);
  md.push("");
  md.push(`- **Save as:** \`${path.basename(img.out)}\``);
  md.push(`- **Ratio:** ${img.aspectRatio}`);
  md.push(`- **Where:** \`${img.out}\``);
  md.push("");
  md.push("```");
  md.push(img.prompt);
  md.push("```");
  md.push("");
  md.push("---");
  md.push("");
});

await writeFile(path.join(ROOT, "scripts", "course-art-prompts.md"), `${md.join("\n")}\n`, "utf8");

const csv = [
  "order,id,save_as,ratio,target",
  ...SELECT.map(
    (img, i) =>
      `${i + 1},${img.id},${path.basename(img.out)},${img.aspectRatio},${img.out}`,
  ),
].join("\n");

await writeFile(path.join(ROOT, "scripts", "course-art-manifest.csv"), `${csv}\n`, "utf8");

process.stdout.write(
  `Wrote scripts/course-art-prompts.md (${SELECT.length} prompts)\n` +
    `Wrote scripts/course-art-manifest.csv\n\n` +
    `Drop downloaded images into ${path.join(ROOT, "inbox")} then run: node scripts/import-art.mjs\n`,
);