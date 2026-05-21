function readBooleanEnv(name: string, defaultValue = false) {
  const value = process.env[name];
  if (value == null || value.trim() === "") {
    return defaultValue;
  }

  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

export function getOpenRouterModels() {
  const primary = process.env.OPENROUTER_MODEL?.trim();
  const fallback = process.env.OPENROUTER_FALLBACK_MODEL?.trim();

  if (!primary) {
    throw new Error("OPENROUTER_MODEL is not configured");
  }

  if (!fallback) {
    throw new Error("OPENROUTER_FALLBACK_MODEL is not configured");
  }

  return { primary, fallback } as const;
}

export function isOpenRouterFailoverEnabled() {
  return readBooleanEnv("OPENROUTER_FAILOVER_ENABLED", true);
}

export const OPENROUTER_API_URL =
  "https://openrouter.ai/api/v1/chat/completions";

export const OPENROUTER_REQUEST_TIMEOUT_MS = 20000;
export const OPENROUTER_MAX_TOKENS = 450;

export const OPENROUTER_RETRYABLE_STATUSES = new Set([
  408,
  429,
  500,
  502,
  503,
]);
