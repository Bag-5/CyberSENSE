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

