export const OPENROUTER_MODELS = {
  primary: "mistralai/mistral-small-3.2-24b-instruct",
  fallback: "google/gemma-4-26b-a4b-it:free",
} as const;

export const OPENROUTER_AI_ANALYZER_MODELS = [
  OPENROUTER_MODELS.primary,
  OPENROUTER_MODELS.fallback,
] as const;

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

