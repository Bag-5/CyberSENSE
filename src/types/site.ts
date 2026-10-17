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

/** A jargon term worth defining before the lesson continues. */
export type ThreatTerm = {
  term: string;
  definition: string;
};

/** One beat in a narrated attack chain, in the order it actually happens. */
export type ThreatStep = {
  label: string;
  detail: string;
};

/** Generated diagram or mockup that illustrates part of the lesson. */
export type ThreatFigure = {
  src: string;
  /** Describes the scene only. Never repeats surrounding body copy. */
  alt: string;
  caption: string;
};

export type ThreatDetail = ThreatCard & {
  intro: string;
  /** Longer prose for readers who want the mechanics, not just the symptoms. */
  deepDive: string;
  attackTricks: string[];
  warningSigns: string[];
  safetyTips: string[];
  realWorldExamples: string[];
  ghanaExamples: string[];
  /** The attack chain, narrated step by step. */
  scenarioWalkthrough: ThreatStep[];
  keyTerms: ThreatTerm[];
  didYouKnow: string[];
  heroImage: string;
  heroAlt: string;
  figures: ThreatFigure[];
  quizPrompt: string;
  relatedSlugs: string[];
};