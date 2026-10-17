#!/usr/bin/env node
/**
 * Emits a copy-paste prompt sheet for generating course art by hand.
 *
 * OpenRouter credits are spent, so this renders the manifest into a document
 * grouped by destination folder: work one course at a time, paste each prompt
 * into Gemini, and save the result into the folder named in the heading.
 *
 * Each prompt is fully self-contained (art direction baked in), so order within
 * a course does not matter and any single image can be regenerated alone.
 *
 * Usage: node scripts/export-prompt-sheet.mjs
 */

import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const manifest = JSON.parse(
  await readFile(path.join(ROOT, "scripts", "image-manifest.json"), "utf8"),
);

const SELECT = manifest.images.filter((i) => i.id.startsWith("course-"));

/* Group by the course slug encoded in the id. */
const byCourse = new Map();
for (const img of SELECT) {
  const slug = img.id.replace(/^course-/, "").replace(/-(hero|figure-\d)$/, "");
  if (!byCourse.has(slug)) byCourse.set(slug, []);
  byCourse.get(slug).push(img);
}

/** Sort heroes first, then figures in order. */
const order = (img) => (img.id.endsWith("-hero") ? 0 : Number(img.id.match(/figure-(\d)/)[1]));

const TITLE = {
  phishing: "Phishing",
  "social-engineering": "Social Engineering",
  malware: "Malware",
  "password-attacks": "Password Attacks",
  "public-wi-fi-attacks": "Public Wi-Fi Attacks",
  ransomware: "Ransomware",
  "fake-apps-scams": "Fake Apps & Scams",
  deepfakes: "Deepfakes",
  "voice-cloning-scams": "Voice Cloning Scams",
  "ai-misinformation": "AI Misinformation",
};

const md = [
  `# Course Art — Prompt Sheet (${SELECT.length} images across ${byCourse.size} courses)`,
  "",
  "Work one course at a time. For each entry: paste the prompt into Gemini",
  "image generation, then save the download into the folder shown, using the",
  "filename shown.",
  "",
  "When a course folder has all three images, run:",
  "",
  "```",
  "npm run art:process",
  "```",
  "",
  "That walks `public/courses/`, trims any black letterbox bars, and converts",
  "every PNG to WebP in place. Skip any course you don't want and it simply",
  "renders without art.",
  "",
  "## Rules that matter",
  "",
  "- **Ratio:** heroes are **16:9**, figures are **4:3**. Set it in the generator.",
  "- **Resolution:** 1K is enough. These display at most ~1000px wide.",
  "- **Reject anything containing invented words.** The models cannot render",
  "  text. The prompts ask for abstract grey placeholder bars instead, and all",
  "  real labels are drawn in the page component afterwards.",
  "- **Ask for full-bleed.** If black bars appear anyway, `art:process` trims them.",
  "- **Save as `.png`.** The processor converts to `.webp` and removes the PNG.",
  "",
  "---",
  "",
];

let n = 0;
for (const [slug, imgs] of byCourse) {
  const folder = `public/courses/${slug}/`;
  md.push(`## ${TITLE[slug] ?? slug}`);
  md.push("");
  md.push(`**Folder:** \`${folder}\``);
  md.push("");
  imgs.sort((a, b) => order(a) - order(b));

  for (const img of imgs) {
    n += 1;
    const base = path.basename(img.out, path.extname(img.out));
    md.push(`### ${String(n).padStart(2, "0")} — \`${folder}${base}.png\` (${img.aspectRatio})`);
    md.push("");
    md.push("```");
    md.push(img.prompt);
    md.push("```");
    md.push("");
  }
  md.push("---");
  md.push("");
}

await writeFile(
  path.join(ROOT, "COURT-ART-PROMPTS.md"),
  `${md.join("\n")}\n`,
  "utf8",
);

/* ---------------------------- progress tracker --------------------------- */

const present = [];
for (const [slug, imgs] of byCourse) {
  let entries = [];
  try {
    entries = await readdir(path.join(ROOT, "public", "courses", slug));
  } catch {
    /* folder missing */
  }
  for (const img of imgs) {
    const base = path.basename(img.out, path.extname(img.out));
    const hit = entries.find((f) => path.basename(f, path.extname(f)) === base);
    present.push({ slug, base, done: Boolean(hit) });
  }
}

const doneCount = present.filter((p) => p.done).length;
const checklist = [
  `# Course Art — Progress`,
  "",
  `${doneCount} of ${present.length} images present.`,
  "",
  ...present.map(
    (p) => `- [${p.done ? "x" : " "}] ${p.slug}/${p.base}${p.done ? "" : "   <- still needed"}`,
  ),
  "",
].join("\n");

await writeFile(path.join(ROOT, "COURT-ART-CHECKLIST.md"), checklist, "utf8");

process.stdout.write(
  `Wrote COURT-ART-PROMPTS.md (${SELECT.length} prompts in ${byCourse.size} course folders)\n` +
    `Wrote COURT-ART-CHECKLIST.md (${doneCount}/${present.length} present)\n`,
);