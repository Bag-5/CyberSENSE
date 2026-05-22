export type AuthRole = "user" | "admin" | "superadmin";

export type PublicSessionUser = {
  id: string;
  username: string;
  email: string;
  role: AuthRole;
};

export type UserRecord = PublicSessionUser & {
  createdAt: string;
  lastLoginAt: string;
  totalScore: number;
  quizzesCompleted: number;
  streak: number;
  longestStreak: number;
  quizScores: Record<string, number>;
  achievements: string[];
};

export type PendingOtpRecord = {
  email: string;
  username: string;
  codeHash: string;
  expiresAt: string;
  attempts: number;
};

export type AuthStore = {
  users: Record<string, UserRecord>;
  usersByEmail: Record<string, string>;
  pendingOtps: Record<string, PendingOtpRecord>;
};

export type LeaderboardUser = {
  id: string;
  username: string;
  email: string;
  score: number;
  quizzesCompleted: number;
  streak: number;
  badge: string;
  rank: number;
};
