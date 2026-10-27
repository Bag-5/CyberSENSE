export type RedFlagDifficulty = "Easy" | "Medium" | "Hard";

export type RedFlagDifficultyConfig = {
  /** One-line explanation of what this level changes. */
  blurb: string;
  /** Seconds allowed per scenario, or null for an untimed round. */
  roundSeconds: number | null;
  /** Whether the per-flag reasoning is shown in the round review. */
  revealReasons: boolean;
  /** Applied to the round score, so harder runs are worth more. */
  scoreMultiplier: number;
};

export type RedFlagSurface =
  | "whatsapp"
  | "email"
  | "login"
  | "momo"
  | "job";

export type RedFlagElement = {
  id: string;
  label: string;
  suspicious: boolean;
  reason: string;
  type: "sender" | "link" | "text" | "url" | "field" | "button" | "banner";
};

export type RedFlagScenario = {
  slug: string;
  title: string;
  surface: RedFlagSurface;
  teaser: string;
  intro: string;
  contentTitle: string;
  contentLines: string[];
  elements: RedFlagElement[];
  explanation: string;
  safeAdvice: string[];
  realWorldExamples: string[];
  ghanaExamples: string[];
};

export type RedFlagRoundResult = {
  correct: string[];
  missed: string[];
  incorrect: string[];
  points: number;
};

