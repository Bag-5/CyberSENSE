#!/usr/bin/env node
/**
 * Batch image generation via the OpenRouter dedicated Image API.
 *
 * Reads a manifest of image specs, calls POST /api/v1/images, and writes the
 * returned bytes to disk. The output format is detected from the magic bytes
 * rather than trusted from the request, because providers clamp output_format.
 *
 * Usage:
 *   node scripts/generate-images.mjs                  # generate everything pending
 *   node scripts/generate-images.mjs --only=id,id2    # generate specific ids
 *   node scripts/generate-images.mjs --force          # regenerate even if file exists
 *   node scripts/generate-images.mjs --dry-run        # list work, make no API calls
 */

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, "scripts", "image-manifest.json");
const API_URL = "https://openrouter.ai/api/v1/images";

const DEFAULT_MODEL = "google/gemini-2.5-flash-image";
const CONCURRENCY = 3;
const MAX_RETRIES = 4;

/* ------------------------------ arg parsing ------------------------------ */

const args = process.argv.slice(2);
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");
const only = args
  .filter((a) => a.startsWith("--only="))
  .flatMap((a) => a.slice("--only=".length).split(","))
  .map((s) => s.trim())
  .filter(Boolean);

/* ------------------------------- env loading ----------------------------- */

async function loadApiKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  const raw = await readFile(path.join(ROOT, ".env"), "utf8");
  const match = raw.match(/^\s*OPENROUTER_API_KEY\s*=\s*(.+)\s*$/m);
  if (!match) throw new Error("OPENROUTER_API_KEY not found in .env or process.env");
  return match[1].trim().replace(/^["']|["']$/g, "");
}

/* --------------------------- format detection ---------------------------- */

/** Returns the extension for a detected image format, or null if unrecognised. */
function detectExtension(buffer) {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return "png";
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }
  // RIFF....WEBP
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  return null;
}

/** Reads intrinsic pixel dimensions for PNG / JPEG / WebP headers. */
function readDimensions(buffer, ext) {
  try {
    if (ext === "png") {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }
    if (ext === "jpg") {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) {
          offset += 1;
          continue;
        }
        const marker = buffer[offset + 1];
        // SOF0..SOF15, excluding DHT/JPG/DAC
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
        }
        offset += 2 + buffer.readUInt16BE(offset + 2);
      }
    }
    if (ext === "webp") {
      const fmt = buffer.toString("ascii", 12, 16);
      if (fmt === "VP8X") {
        return {
          width: 1 + (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16)),
          height: 1 + (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16)),
        };
      }
      if (fmt === "VP8 ") {
        return {
          width: buffer.readUInt16LE(26) & 0x3fff,
          height: buffer.readUInt16LE(28) & 0x3fff,
        };
      }
      if (fmt === "VP8L") {
        const bits = buffer.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
    }
  } catch {
    /* fall through */
  }
  return { width: null, height: null };
}

/* ------------------------------ api helpers ------------------------------ */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generateImage(spec, apiKey) {
  const model = spec.model || DEFAULT_MODEL;

  const requestBody = {
    model,
    prompt: spec.prompt,
    n: 1,
  };
  if (spec.style) requestBody.prompt = [spec.style, spec.prompt].join("\n\n");
  if (spec.aspectRatio) requestBody.aspect_ratio = spec.aspectRatio;
  if (spec.resolution) requestBody.resolution = spec.resolution;
  if (spec.seed !== undefined) requestBody.seed = spec.seed;

  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/Bag-5/CyberSENSE",
          "X-Title": "CyberSENSE asset generation",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`HTTP ${res.status}: ${detail.slice(0, 400)}`);
      }

      const data = await res.json();
      const entry = Array.isArray(data?.data) ? data.data[0] : null;
      const base64 = entry?.b64_json ?? entry?.url;

      if (typeof base64 !== "string" || base64.length === 0) {
        throw new Error("No image in response (expected data[0].b64_json)");
      }

      const buffer = base64.startsWith("data:")
        ? Buffer.from(base64.slice(base64.indexOf(",") + 1), "base64")
        : Buffer.from(base64, "base64");

      return { buffer, usage: data?.usage ?? null };
    } catch (error) {
      lastError = error;
      if (attempt === MAX_RETRIES) break;
      const backoff = 1500 * 2 ** (attempt - 1);
      const msg = error instanceof Error ? error.message : String(error);
      process.stderr.write(
        `    retry ${attempt}/${MAX_RETRIES - 1} in ${backoff}ms (${msg.slice(0, 140)})\n`,
      );
      await sleep(backoff);
    }
  }

  throw lastError;
}

/* -------------------------------- runner --------------------------------- */

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function runOne(spec, apiKey, costs) {
  // Honour an explicit out path, but correct the extension if the provider
  // returned a different format than requested.
  const declaredExt = path.extname(spec.out);
  let outPath = path.join(ROOT, spec.out);

  if (!force && (await exists(outPath))) {
    process.stdout.write(`  skip  ${spec.id} (already exists)\n`);
    return { id: spec.id, status: "skipped" };
  }

  const { buffer, usage } = await generateImage(spec, apiKey);

  const ext = detectExtension(buffer);
  if (!ext) {
    throw new Error("Returned bytes were not a recognised image (png/jpg/webp)");
  }
  if (declaredExt && declaredExt.toLowerCase() !== `.${ext}`) {
    outPath = outPath.slice(0, -declaredExt.length) + `.${ext}`;
  }

  const { width, height } = readDimensions(buffer, ext);
  const ratio = width && height ? (width / height).toFixed(3) : "?";

  const wanted = spec.aspectRatio ?? "auto";
  const drift =
    width && wanted !== "auto" ? ratioOff(Number(wanted), width / height) : "";

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, buffer);

  if (usage?.cost != null) costs.total += Number(usage.cost) || 0;

  const kb = (buffer.length / 1024).toFixed(0);
  process.stdout.write(
    `  ok    ${spec.id}  ${width}x${height} ${ratio}  ${kb} KB  -> ${path.relative(ROOT, outPath)}${drift}\n`,
  );
  return { id: spec.id, status: "generated", bytes: buffer.length, width, height, out: outPath };
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  const specs = manifest.images.filter((img) => !only.length || only.includes(img.id));

  if (!specs.length) {
    process.stdout.write("Nothing to do — no ids matched.\n");
    return;
  }

  process.stdout.write(
    `Manifest: ${manifest.images.length} total, ${specs.length} selected` +
      `${force ? ", FORCE" : ""}${dryRun ? ", DRY RUN" : ""}\n\n`,
  );

  if (dryRun) {
    for (const spec of specs) {
      const found = await exists(path.join(ROOT, spec.out));
      process.stdout.write(
        `  [${found ? "exists" : "pending"}] ${spec.id.padEnd(28)} ${(spec.aspectRatio || "auto").padEnd(6)} -> ${spec.out}\n`,
      );
    }
    return;
  }

  const apiKey = await loadApiKey();
  process.stdout.write(`Endpoint: ${API_URL}\n\n`);

  const costs = { total: 0 };
  const results = [];
  const queue = [...specs];

  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length) {
      const spec = queue.shift();
      try {
        results.push(await runOne(spec, apiKey, costs));
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        process.stdout.write(`  FAIL  ${spec.id}: ${msg.slice(0, 240)}\n`);
        results.push({ id: spec.id, status: "failed", error: msg });
      }
    }
  });

  await Promise.all(workers);

  const failed = results.filter((r) => r.status === "failed");
  const generated = results.filter((r) => r.status === "generated").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const mismatched = results.filter((r) => r.status === "generated" && !r.width);

  process.stdout.write(
    `\nDone. ${generated} generated, ${skipped} skipped, ${failed.length} failed.` +
      `${mismatched.length ? ` ${mismatched.length} with unreadable dimensions.` : ""}\n`,
  );
  if (costs.total > 0) {
    process.stdout.write(`Reported cost: $${costs.total.toFixed(4)}\n`);
  }
  if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`Fatal: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});