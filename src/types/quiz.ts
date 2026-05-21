export type QuizCategorySlug =
  | "phishing"
  | "malware"
  | "password-security"
  | "social-engineering"
  | "public-wi-fi-safety"
  | "ai-threats"
  | "deepfakes"
  | "voice-cloning-scams"
  | "fake-apps"
  | "ransomware";

export type QuizDifficulty = "Easy" | "Medium" | "Hard";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: QuizDifficulty;
  category: QuizCategorySlug;
};

export type QuizCategory = {
  slug: QuizCategorySlug;
  title: string;
  description: string;
  icon: string;
  accent: string;
  questions: QuizQuestion[];
};

export type QuizResultSummary = {
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  score: number;
  percentage: number;
  missedQuestionIds: string[];
};

export type QuizAchievementId =
  | "first-quiz"
  | "phishing-expert"
  | "password-guardian"
  | "ai-threat-detective"
  | "scam-spotter"
  | "cyber-defender";

export type QuizAchievement = {
  id: QuizAchievementId;
  title: string;
  description: string;
  icon: string;
};

export type QuizCompletionRecord = {
  slug: QuizCategorySlug;
  title: string;
  score: number;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  completedAt: string;
};

export type QuizProgressState = {
  completedQuizzes: Partial<Record<QuizCategorySlug, QuizCompletionRecord>>;
  achievements: QuizAchievementId[];
  totalAttempts: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt?: string;
  averageScore: number;
};

export type LeaderboardEntry = {
  name: string;
  score: number;
  streak: number;
  badge: string;
};
