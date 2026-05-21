export type LabSimulationId =
  | "phishing"
  | "fake-login"
  | "password-cracking"
  | "ransomware-awareness"
  | "public-wifi"
  | "app-permissions";

export type LabSimulationCard = {
  id: LabSimulationId;
  title: string;
  description: string;
  icon: string;
  accent: string;
  time: string;
};

export type PhishingRedFlag = {
  id: string;
  label: string;
  explanation: string;
};

export type LabSimulationData = {
  id: LabSimulationId;
  title: string;
  subtitle: string;
  description: string;
};

