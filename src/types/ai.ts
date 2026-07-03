export type ScamAnalysisRiskLevel =
  | "Low Risk"
  | "Suspicious"
  | "High Risk"
  | "Critical Threat";

export type ScamAnalysis = {
  riskLevel: ScamAnalysisRiskLevel;
  summary: string;
  redFlags: string[];
  recommendations: string[];
  explanation: string;
};

export type VirusTotalFinding = {
  type: "url" | "domain" | "ip";
  value: string;
  malicious: number;
  suspicious: number;
  total: number;
  categories?: string[];
};

