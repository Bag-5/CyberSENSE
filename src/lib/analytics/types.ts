export type AnalyticsEventModule =
  | "auth"
  | "threats"
  | "analyzer"
  | "lab"
  | "quizzes"
  | "quiz"
  | "superadmin";

export type AnalyticsEventType =
  | "page_view"
  | "module_select"
  | "threat_viewed"
  | "scam_analysis_completed"
  | "scam_analysis_failed"
  | "simulation_selected"
  | "quiz_hub_viewed"
  | "quiz_viewed"
  | "quiz_attempted"
  | "quiz_completed";

export type AnalyticsEventPayload = {
  eventType: AnalyticsEventType;
  module: AnalyticsEventModule;
  slug?: string;
  category?: string;
  portal?: "user" | "superadmin";
  userId?: string | null;
  metadata?: Record<string, unknown>;
};

export type AnalyticsCounterPoint = {
  label: string;
  value: number;
  detail?: string;
};

export type AnalyticsTrendPoint = {
  label: string;
  value: number;
};

export type AnalyticsRankedItem = {
  label: string;
  value: number;
  detail?: string;
};

export type AnalyticsStatusTone = "cyan" | "amber" | "emerald" | "rose";

export type AnalyticsStatusCard = {
  label: string;
  value: string;
  detail: string;
  tone: AnalyticsStatusTone;
};

export type AnalyticsSnapshot = {
  generatedAt: string;
  overview: {
    totalUsers: number;
    activeSessions: number;
    totalQuizCompletions: number;
    averageQuizScore: number;
    totalScamAnalyses: number;
    mostViewedThreatCategories: AnalyticsCounterPoint[];
    engagementTrend: AnalyticsTrendPoint[];
    progressionBands: AnalyticsCounterPoint[];
  };
  quizzes: {
    categoryPerformance: AnalyticsCounterPoint[];
    mostFailedCategories: AnalyticsCounterPoint[];
    hardestQuestions: AnalyticsRankedItem[];
    leaderboard: AnalyticsRankedItem[];
    improvementTrend: AnalyticsTrendPoint[];
  };
  threats: {
    topThreats: AnalyticsCounterPoint[];
    moduleEngagement: AnalyticsCounterPoint[];
    phishingPopularity: AnalyticsCounterPoint[];
    simulationUsage: AnalyticsCounterPoint[];
  };
  ai: {
    riskDistribution: AnalyticsCounterPoint[];
    commonScamTypes: AnalyticsCounterPoint[];
    aiUsage: AnalyticsCounterPoint[];
    flaggedPatterns: AnalyticsCounterPoint[];
    recentActivity: AnalyticsStatusCard[];
  };
  progression: {
    achievementCounts: AnalyticsCounterPoint[];
    streakDistribution: AnalyticsCounterPoint[];
    completionLevels: AnalyticsCounterPoint[];
    topUsers: AnalyticsRankedItem[];
  };
  system: AnalyticsStatusCard[];
};
