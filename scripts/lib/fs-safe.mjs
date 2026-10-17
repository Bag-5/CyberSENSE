/**
 * Shared file helpers for the asset scripts.
 *
 * On Windows, replacing a file that something else has open (an image viewer,
 * Defender, a running dev server) fails with EPERM. These helpers retry and
 * fall back to unlink-then-rename so the scripts stay re-runnable.
 */

import { rename, unlink, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Moves `tmp` onto `target`, retrying and degrading gracefully when the
 * destination is locked. Removes `tmp` on failure so no litter is left.
 */
export async function replaceFile(tmp, target, attempts = 5) {
  for (let i = 1; i <= attempts; i += 1) {
    try {
      await rename(tmp, target);
      return;
    } catch (error) {
      const code = error && error.code;
      const retryable = code === "EPERM" || code === "EACCES" || code === "EBUSY";
      if (!retryable || i === attempts) {
        await unlink(tmp).catch(() => {});
        throw error;
      }
      await sleep(400 * i);
    }
  }
}

/** Like replaceFile, but never throws — reports success instead. */
export async function tryReplaceFile(tmp, target, attempts = 5) {
  try {
    await replaceFile(tmp, target, attempts);
    return true;
  } catch {
    return false;
  }
}

export async function writeOut(target, buffer) {
  if (!(await exists(target))) {
    await writeFile(target, buffer);
    return;
  }
  const tmp = `${target}.tmp`;
  await writeFile(tmp, buffer);
  const ok = await tryReplaceFile(tmp, target);
  if (!ok) throw new Error(`Could not replace ${target} — file appears locked`);
}