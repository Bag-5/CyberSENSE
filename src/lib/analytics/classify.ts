import type { ScamAnalysisRiskLevel } from "@/types/ai";

export type ScamFamily =
  | "MoMo scam"
  | "Fake login"
  | "Job scam"
  | "Delivery scam"
  | "Investment scam"
  | "Prize scam"
  | "Malware lure"
  | "General scam";

export function classifyScamContent(content: string): ScamFamily {
  const normalized = content.toLowerCase();

  if (
    normalized.includes("momo") ||
    normalized.includes("mobile money") ||
    normalized.includes("otp") ||
    normalized.includes("pin")
  ) {
    return "MoMo scam";
  }

  if (
    normalized.includes("login") ||
    normalized.includes("password") ||
    normalized.includes("bank") ||
    normalized.includes("verify")
  ) {
    return "Fake login";
  }

  if (
    normalized.includes("job") ||
    normalized.includes("hr") ||
    normalized.includes("salary") ||
    normalized.includes("cv") ||
    normalized.includes("interview")
  ) {
    return "Job scam";
  }

  if (
    normalized.includes("delivery") ||
    normalized.includes("courier") ||
    normalized.includes("parcel") ||
    normalized.includes("tracking")
  ) {
    return "Delivery scam";
  }

  if (
    normalized.includes("investment") ||
    normalized.includes("crypto") ||
    normalized.includes("double your money") ||
    normalized.includes("roi")
  ) {
    return "Investment scam";
  }

  if (
    normalized.includes("winner") ||
    normalized.includes("prize") ||
    normalized.includes("lottery") ||
    normalized.includes("claim now")
  ) {
    return "Prize scam";
  }

  if (
    normalized.includes("apk") ||
    normalized.includes("download") ||
    normalized.includes("update") ||
    normalized.includes("install")
  ) {
    return "Malware lure";
  }

  return "General scam";
}

export function extractPatternKeywords(redFlags: string[]) {
  const patterns = new Set<string>();

  for (const redFlag of redFlags) {
    const normalized = redFlag.toLowerCase();
    if (normalized.includes("urgency") || normalized.includes("suspend")) {
      patterns.add("Urgency pressure");
    }
    if (normalized.includes("link") || normalized.includes("url")) {
      patterns.add("Suspicious links");
    }
    if (normalized.includes("otp") || normalized.includes("pin")) {
      patterns.add("Secret code harvest");
    }
    if (normalized.includes("sender") || normalized.includes("identity")) {
      patterns.add("Spoofed identity");
    }
    if (normalized.includes("spelling") || normalized.includes("grammar")) {
      patterns.add("Language mistakes");
    }
  }

  return Array.from(patterns);
}

export function normalizeRiskLevel(value: string): ScamAnalysisRiskLevel {
  if (
    value === "Low Risk" ||
    value === "Suspicious" ||
    value === "High Risk" ||
    value === "Critical Threat"
  ) {
    return value;
  }

  return "Suspicious";
}
