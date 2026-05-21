import {
  OPENROUTER_API_URL,
  OPENROUTER_MAX_TOKENS,
  OPENROUTER_REQUEST_TIMEOUT_MS,
  OPENROUTER_RETRYABLE_STATUSES,
  getOpenRouterModels,
  isOpenRouterFailoverEnabled,
} from "@/lib/ai/models";
import {
  scamAnalysisSchema,
  scamAnalyzerSystemPrompt,
  scamAnalyzerUserPrompt,
} from "@/lib/ai/prompts";
import type { ScamAnalysis } from "@/types/ai";

type OpenRouterMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    code?: number | string;
    message?: string;
  };
};

const ALLOWED_RISK_LEVELS = new Set([
  "Low Risk",
  "Suspicious",
  "High Risk",
  "Critical Threat",
]);

function sanitizeContent(input: string) {
  return input
    .replace(/\u0000/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 5000);
}

function buildMessages(content: string): OpenRouterMessage[] {
  return [
    { role: "system", content: scamAnalyzerSystemPrompt },
    {
      role: "user",
      content: scamAnalyzerUserPrompt.replace("{{content}}", sanitizeContent(content)),
    },
  ];
}

function parseAnalysis(raw: string): ScamAnalysis {
  const parsed = JSON.parse(raw) as Partial<ScamAnalysis>;

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid analysis payload");
  }

  const riskLevel = parsed.riskLevel;
  const summary = parsed.summary;
  const redFlags = parsed.redFlags;
  const recommendations = parsed.recommendations;
  const explanation = parsed.explanation;

  if (
    typeof riskLevel !== "string" ||
    !ALLOWED_RISK_LEVELS.has(riskLevel) ||
    typeof summary !== "string" ||
    typeof explanation !== "string" ||
    !Array.isArray(redFlags) ||
    !Array.isArray(recommendations) ||
    redFlags.some((item) => typeof item !== "string") ||
    recommendations.some((item) => typeof item !== "string")
  ) {
    throw new Error("Analysis response failed validation");
  }

  return {
    riskLevel,
    summary,
    redFlags,
    recommendations,
    explanation,
  };
}

async function waitForRetryAfter(response: Response) {
  const retryAfter = Number(response.headers.get("Retry-After"));
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
  }
}

async function requestOpenRouter(
  model: string,
  content: string,
): Promise<ScamAnalysis> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OPENROUTER_REQUEST_TIMEOUT_MS);

  try {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: buildMessages(content),
          temperature: 0.2,
          max_tokens: OPENROUTER_MAX_TOKENS,
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "scam_analysis",
              strict: true,
              schema: scamAnalysisSchema,
            },
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as OpenRouterResponse | null;
        console.warn("[openrouter] request failed", {
          model,
          status: response.status,
          attempt,
          error: errorPayload?.error?.message ?? response.statusText,
        });
        if (OPENROUTER_RETRYABLE_STATUSES.has(response.status) && attempt === 0) {
          await waitForRetryAfter(response);
          continue;
        }
        throw new Error(
          errorPayload?.error?.message ?? `OpenRouter request failed with ${response.status}`,
        );
      }

      const payload = (await response.json()) as OpenRouterResponse;
      const contentText = payload.choices?.[0]?.message?.content;

      if (!contentText || typeof contentText !== "string") {
        if (attempt === 0) {
          console.warn("[openrouter] empty analysis payload", { model, attempt });
          continue;
        }
        throw new Error("OpenRouter returned an empty analysis");
      }

      try {
        return parseAnalysis(contentText);
      } catch (error) {
        console.warn("[openrouter] invalid structured output", {
          model,
          attempt,
          error: error instanceof Error ? error.message : "Unknown parse error",
        });
        if (attempt === 0) {
          continue;
        }
        throw error;
      }
    }

    throw new Error("OpenRouter analysis could not be completed.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown OpenRouter error";
    console.warn("[openrouter] model analysis failed", { model, message });
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function analyzeScamContent(content: string) {
  const sanitizedContent = sanitizeContent(content);
  if (!sanitizedContent) {
    throw new Error("Please paste a message, email, or link to analyze.");
  }

  let lastError: unknown = null;
  const { primary, fallback } = getOpenRouterModels();
  const models = isOpenRouterFailoverEnabled()
    ? [primary, fallback]
    : [primary];

  for (const model of models) {
    try {
      const analysis = await requestOpenRouter(model, sanitizedContent);
      return {
        analysis,
        modelUsed: model,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Unable to analyze the content right now.");
}
