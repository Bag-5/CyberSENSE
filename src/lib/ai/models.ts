function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function readBooleanEnv(name: string, defaultValue = false) {
  const value = process.env[name];
  if (value == null || value.trim() === "") {
    return defaultValue;
  }

  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

export const OPENROUTER_MODELS = {
  primary: requireEnv("OPENROUTER_MODEL"),
  fallback: requireEnv("OPENROUTER_FALLBACK_MODEL"),
} as const;

export const OPENROUTER_FAILOVER_ENABLED = readBooleanEnv(
  "OPENROUTER_FAILOVER_ENABLED",
  true,
);

export const OPENROUTER_AI_ANALYZER_MODELS = OPENROUTER_FAILOVER_ENABLED
  ? ([OPENROUTER_MODELS.primary, OPENROUTER_MODELS.fallback] as const)
  : ([OPENROUTER_MODELS.primary] as const);

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
