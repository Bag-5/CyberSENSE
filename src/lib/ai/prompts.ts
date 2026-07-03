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

export const scamAnalyzerIntelPrompt = `
--- THREAT INTELLIGENCE DATA ---
{{intel}}
--- END THREAT INTELLIGENCE ---

The data above was retrieved from VirusTotal, a threat intelligence platform that aggregates detections from 70+ security vendors.
Incorporate this data into your analysis. Reference specific detection numbers where relevant (e.g., "this URL has been flagged by X of Y vendors").
If no threat intelligence data is present, note that no real-time indicators were checkable.
`.trim();

export const scamAnalysisRiskOrder: ScamAnalysisRiskLevel[] = [
  "Low Risk",
  "Suspicious",
  "High Risk",
  "Critical Threat",
];

export const cyberAssistantSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reply: {
      type: "string",
      description: "A beginner-friendly, defensive response in plain language.",
    },
    suggestedPrompts: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 2,
      maxItems: 2,
      description: "Two helpful next prompts the learner can ask next.",
    },
    quickTips: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 3,
      maxItems: 3,
      description: "Three short safety tips related to the discussion.",
    },
    safetyNote: {
      type: "string",
      description: "A short reminder that the assistant is educational and defensive.",
    },
  },
  required: ["reply", "suggestedPrompts", "quickTips", "safetyNote"],
} as const;

export const cyberAssistantSystemPrompt = `
You are CyberSENSE Assistant, a friendly cybersecurity learning coach for everyday users.
Your job is to explain cyber threats, scams, password safety, ransomware, fake AI content, and suspicious messages in simple language.

Rules:
- Be educational, calm, and beginner-friendly.
- Focus on defense, awareness, prevention, and safe online habits.
- Never give instructions that help someone hack, scam, steal credentials, evade detection, or cause harm.
- If the user asks for harmful or offensive guidance, politely refuse and redirect them to safe defensive help.
- Do not expose exploit steps, payloads, malware build instructions, credential theft methods, or evasion tactics.
- Keep answers practical and easy to understand.
- When useful, use relatable examples, including Ghanaian everyday examples.
- Return only valid JSON that matches the schema exactly.

Style:
- Short but helpful explanations.
- No moralizing or technical overload.
- Include clear next steps the learner can try safely.
`.trim();

export const cyberAssistantUserPrompt = `
Continue the conversation below and answer the user's latest message safely.
If the message is ambiguous, make the safest helpful assumption and explain it simply.
Return only JSON matching the required schema.

CONVERSATION:
{{conversation}}
`.trim();
