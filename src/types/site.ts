export type NavLink = {
  label: string;
  href: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  accent: string;
};

export type MissionCard = {
  title: string;
  description: string;
  tag: string;
};

export type ThreatLevel = "Low" | "Medium" | "High" | "Critical";

export type ThreatCard = {
  name: string;
  slug: string;
  category: string;
  severity: ThreatLevel;
  summary: string;
  icon: string;
  accent: string;
};

export type ThreatDetail = ThreatCard & {
  intro: string;
  attackTricks: string[];
  warningSigns: string[];
  safetyTips: string[];
  realWorldExamples: string[];
  ghanaExamples: string[];
  quizPrompt: string;
  relatedSlugs: string[];
};
