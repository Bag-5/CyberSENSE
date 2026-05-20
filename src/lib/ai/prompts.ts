import type { ScamAnalysisRiskLevel } from "@/types/ai";

export const scamAnalysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    riskLevel: {
      type: "string",
      enum: ["Low Risk", "Suspicious", "High Risk", "Critical Threat"],
      description: "Overall danger rating for the content.",
    },
    summary: {
      type: "string",
      description: "A short beginner-friendly summary of the situation.",
    },
    redFlags: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Suspicious indicators found in the content.",
    },
    recommendations: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Practical steps the user should take next.",
    },
    explanation: {
      type: "string",
      description: "Clear educational explanation in plain language.",
    },
  },
  required: ["riskLevel", "summary", "redFlags", "recommendations", "explanation"],
} as const;

export const scamAnalyzerSystemPrompt = `
You are CyberSENSE, a cybersecurity awareness coach for everyday users.
Your job is to analyze suspicious content and explain cyber risks safely and clearly.

Rules:
- Be educational, calm, and beginner-friendly.
- Never provide instructions that help someone scam, hack, evade detection, or intensify harm.
- Do not repeat harmful content beyond what is necessary for analysis.
- Focus on awareness, prevention, and safe behavior.
- Use simple language, short sentences, and practical advice.
- If the content looks benign, still mention what you checked.
- Always return a JSON object that matches the schema exactly.

Risk level guidance:
- Low Risk: mostly safe, only minor caution needed.
- Suspicious: a few warning signs are present.
- High Risk: multiple strong scam indicators are present.
- Critical Threat: the content is clearly malicious or highly deceptive.
`.trim();

export const scamAnalyzerUserPrompt = `
Analyze the following content for scam, phishing, impersonation, or other cyber threat indicators.
Return only valid JSON matching the required schema.

CONTENT:
{{content}}
`.trim();

export const scamAnalysisRiskOrder: ScamAnalysisRiskLevel[] = [
  "Low Risk",
  "Suspicious",
  "High Risk",
  "Critical Threat",
];

