import { quizCategories } from "@/data/quizzes";
import { getAnalyticsSnapshot } from "@/lib/analytics/store";
import { getCurrentSessionUser } from "@/lib/auth/context";
import { type UserRecord } from "@/lib/auth/types";
import { getDatabase, ensureDatabaseReady } from "@/lib/db/postgres";
import {
  type CertificatePdfInput,
  type ProgressReportPdfInput,
  type QuizReportPdfInput,
} from "@/lib/pdf/report-generator";
import { getLeaderboardUsers, getUserById } from "@/lib/auth/store";

type ReportMetric = CertificatePdfInput["details"][number];
type ReportBullet = QuizReportPdfInput["strengths"][number];

export type ReportCertificateKind = "quiz" | "milestone" | "training";
export type ProgressReportKind = "progress" | "engagement" | "leaderboard";

export type CompletedQuizChoice = {
  slug: string;
  title: string;
  score: number;
  completedAt: string;
};

export type MilestoneChoice = {
  key: string;
  label: string;
  description: string;
};

export type UserReportContext = {
  user: UserRecord;
  rank: number | null;
  completedQuizzes: CompletedQuizChoice[];
  milestoneChoices: MilestoneChoice[];
  categoryStats: Array<{
    category: string;
    attempts: number;
    correct: number;
    averagePoints: number;
  }>;
};

const quizTitleBySlug = new Map(quizCategories.map((quiz) => [quiz.slug, quiz.title] as const));

function getQuizTitle(slug: string) {
  return quizTitleBySlug.get(slug as (typeof quizCategories)[number]["slug"]) ?? formatLabel(slug);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function toPercent(score: number, total: number) {
  if (!total) {
    return 0;
  }

  return Math.round((score / total) * 100);
}

function formatLabel(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function friendlyAchievementLabel(key: string) {
  const map: Record<string, string> = {
    "first-quiz": "First Quiz Completed",
    "cyber-defender": "Cyber Defender",
    "quiz-streak": "Quiz Streak",
    "awareness-milestone": "Awareness Milestone",
    "training-complete": "Training Complete",
    "phishing-expert": "Phishing Expert",
    "scam-spotter": "Scam Spotter",
  };

  return map[key] ?? formatLabel(key);
}

function buildMilestones(user: UserRecord): MilestoneChoice[] {
  const milestones: MilestoneChoice[] = [
    {
      key: "training-complete",
      label: "Training Completion",
      description: "Celebrate a complete pass through the CyberSENSE learning journey.",
    },
  ];

  if (user.quizzesCompleted >= 1) {
    milestones.push({
      key: "first-quiz",
      label: "First Quiz Completed",
      description: "For taking the first step and completing your first cyber awareness quiz.",
    });
  }

  if (user.totalScore >= 300) {
    milestones.push({
      key: "awareness-milestone",
      label: "Awareness Milestone",
      description: "For reaching a meaningful level of cyber awareness progress.",
    });
  }

  if (user.totalScore >= 700) {
    milestones.push({
      key: "scam-spotter",
      label: "Scam Spotter",
      description: "For consistently identifying suspicious links, messages, and tactics.",
    });
  }

  if (user.totalScore >= 900) {
    milestones.push({
      key: "cyber-defender",
      label: "Cyber Defender",
      description: "For elite defensive instincts and strong platform performance.",
    });
  }

  return milestones;
}

export async function getReportSessionUser() {
  const [superadmin, user] = await Promise.all([
    getCurrentSessionUser("superadmin"),
    getCurrentSessionUser(),
  ]);

  return superadmin ? { user: superadmin, portal: "superadmin" as const } : user ? { user, portal: "user" as const } : null;
}

export async function getUserReportContext(userId: string): Promise<UserReportContext> {
  await ensureDatabaseReady();
  const db = getDatabase();

  const [user, leaderboardUsers, completionRows, categoryRows] = await Promise.all([
    getUserById(userId),
    getLeaderboardUsers(),
    db<{ quiz_slug: string; completed_at: string }[]>`
      select
        slug as quiz_slug,
        max(created_at) as completed_at
      from cybersense_analytics_events
      where user_id = ${userId}
        and event_type = 'quiz_completed'
        and slug is not null
      group by slug
    `,
    db<{
      category: string;
      attempts: number;
      correct: number;
      average_points: number;
    }[]>`
      select
        category,
        count(*)::int as attempts,
        sum(case when is_correct then 1 else 0 end)::int as correct,
        coalesce(round(avg(points))::int, 0) as average_points
      from cybersense_quiz_attempts
      where user_id = ${userId}
      group by category
      order by attempts desc, category asc
    `,
  ]);

  if (!user) {
    throw new Error("User record not found.");
  }

  const completionDates = new Map(completionRows.map((row) => [row.quiz_slug, row.completed_at]));
  const completedQuizzes = Object.entries(user.quizScores)
    .map(([slug, score]) => ({
      slug,
      title: getQuizTitle(slug),
      score,
      completedAt: completionDates.get(slug) ?? user.lastLoginAt,
    }))
    .sort((left, right) => right.score - left.score || right.completedAt.localeCompare(left.completedAt));

  const categoryStats = categoryRows.map((row) => ({
    category: row.category,
    attempts: row.attempts,
    correct: row.correct,
    averagePoints: row.average_points,
  }));

  const rank = leaderboardUsers.findIndex((entry) => entry.id === user.id);

  return {
    user,
    rank: rank >= 0 ? rank + 1 : null,
    completedQuizzes,
    milestoneChoices: buildMilestones(user),
    categoryStats,
  };
}

export function buildQuizReportPdfInput(
  context: UserReportContext,
  displayName?: string,
): QuizReportPdfInput {
  const user = context.user;
  const scoreEntries = Object.entries(user.quizScores)
    .map(([slug, score]) => ({
      slug,
      title: getQuizTitle(slug),
      score,
    }))
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title));

  const summaryMetrics: ReportMetric[] = [
    { label: "Quizzes completed", value: `${user.quizzesCompleted}` },
    { label: "Average score", value: `${Math.round(user.totalScore / Math.max(user.quizzesCompleted, 1))}%` },
    { label: "Achievements", value: `${user.achievements.length}` },
    { label: "Current streak", value: `${user.streak}` },
  ];

  const completedCategories: ReportMetric[] = context.completedQuizzes.map((quiz) => ({
    label: quiz.title,
    value: `${quiz.score}%`,
    detail: `Completed ${formatDate(quiz.completedAt)}`,
  }));

  const categoryScores: ReportMetric[] = scoreEntries.map((entry) => ({
    label: entry.title,
    value: `${entry.score}%`,
    detail: entry.score >= 80 ? "Strong" : entry.score >= 60 ? "Developing" : "Revisit",
  }));

  const strengthsSource = context.categoryStats
    .map((row) => ({
      ...row,
      accuracy: toPercent(row.correct, row.attempts),
    }))
    .filter((row) => row.attempts > 0)
    .sort((left, right) => right.accuracy - left.accuracy)
    .slice(0, 3);

  const strengths: ReportBullet[] = strengthsSource.length
    ? strengthsSource.map((row) => ({
        title: `${formatLabel(row.category)} confidence`,
        text: `${row.accuracy}% accuracy across ${row.attempts} attempt${row.attempts === 1 ? "" : "s"} with ${row.averagePoints} average points.`,
      }))
    : [
        {
          title: "Consistent progress",
          text: "Your completed quizzes already show a healthy start to the CyberSENSE learning journey.",
        },
      ];

  const recommendationsSource = context.categoryStats
    .map((row) => ({
      ...row,
      accuracy: toPercent(row.correct, row.attempts),
    }))
    .filter((row) => row.attempts > 0 && row.accuracy < 75)
    .sort((left, right) => left.accuracy - right.accuracy)
    .slice(0, 3);

  const recommendations: ReportBullet[] = recommendationsSource.length
    ? recommendationsSource.map((row) => ({
        title: `Revisit ${formatLabel(row.category)}`,
        text: `A ${row.accuracy}% accuracy rate suggests another pass through the ${formatLabel(row.category).toLowerCase()} lessons will strengthen your instincts.`,
      }))
    : [
        {
          title: "Keep the momentum",
          text: "Continue taking mixed difficulty quizzes to keep your awareness sharp.",
        },
      ];

  const achievements: ReportBullet[] = user.achievements.length
    ? user.achievements.map((achievement) => ({
        title: friendlyAchievementLabel(achievement),
        text: "Unlocked through your CyberSENSE training progress and challenge completions.",
      }))
    : [
        {
          title: "No achievements yet",
          text: "Complete a few quizzes to unlock the first badge and milestone set.",
        },
      ];

  return {
    fullName: displayName?.trim() || user.username,
    email: user.email,
    generatedAt: formatDate(user.lastLoginAt),
    summaryMetrics,
    completedCategories,
    strengths,
    recommendations,
    achievements,
    categoryScores,
  };
}

export async function buildCertificatePdfInput(
  context: UserReportContext,
  fullName: string,
  certificateType: ReportCertificateKind,
  subjectKey?: string,
  fallbackQuiz?: {
    title?: string;
    score?: number;
    completedAt?: string;
  },
): Promise<CertificatePdfInput> {
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  });

  const selectedFullName = fullName.trim();
  if (!selectedFullName) {
    throw new Error("Full name is required.");
  }

  const currentDate = dateFormatter.format(new Date());
  const selectedQuiz =
    certificateType === "quiz"
      ? context.completedQuizzes.find((quiz) => quiz.slug === subjectKey) ?? context.completedQuizzes[0]
      : null;

  const quizFallback =
    certificateType === "quiz" && subjectKey
      ? {
          slug: subjectKey,
          title: fallbackQuiz?.title ?? getQuizTitle(subjectKey),
          score: typeof fallbackQuiz?.score === "number" ? fallbackQuiz.score : 100,
          completedAt: fallbackQuiz?.completedAt ?? currentDate,
        }
      : null;

  const resolvedQuiz = selectedQuiz ?? quizFallback;

  if (certificateType === "quiz" && !resolvedQuiz) {
    throw new Error("Complete at least one quiz before requesting a quiz certificate.");
  }

  const milestone =
    certificateType === "milestone"
      ? context.milestoneChoices.find((choice) => choice.key === subjectKey) ?? context.milestoneChoices[0]
      : null;

  const details: ReportMetric[] =
    certificateType === "quiz" && resolvedQuiz
      ? [
          { label: "Quiz", value: resolvedQuiz.title },
          { label: "Score", value: `${resolvedQuiz.score}%` },
          { label: "Issued to", value: selectedFullName },
        ]
      : certificateType === "milestone" && milestone
        ? [
            { label: "Milestone", value: milestone.label },
            { label: "Progress", value: `${context.user.quizzesCompleted} quizzes` },
            { label: "Issued to", value: selectedFullName },
          ]
        : [
            { label: "Training", value: "CyberSENSE Awareness Program" },
            { label: "Progress", value: `${context.user.quizzesCompleted} quizzes` },
            { label: "Issued to", value: selectedFullName },
          ];

  if (certificateType === "quiz" && resolvedQuiz) {
    const completionDate = resolvedQuiz.completedAt
      ? dateFormatter.format(new Date(resolvedQuiz.completedAt))
      : currentDate;

    return {
      fullName: selectedFullName,
      certificateTitle: "Certificate of Quiz Completion",
      achievementTitle: `${resolvedQuiz.title} Completed`,
      completionDate,
      description:
        "This certifies that the recipient has successfully completed a CyberSENSE quiz and demonstrated stronger cyber awareness instincts.",
      details,
    };
  }

  if (certificateType === "milestone" && milestone) {
    return {
      fullName: selectedFullName,
      certificateTitle: "Awareness Milestone Certificate",
      achievementTitle: milestone.label,
      completionDate: currentDate,
      description:
        "This certificate recognizes a CyberSENSE awareness milestone and consistent progress toward safer online habits.",
      details,
    };
  }

  return {
    fullName: selectedFullName,
    certificateTitle: "Training Completion Certificate",
    achievementTitle: "CyberSENSE Training Complete",
    completionDate: currentDate,
    description:
      "This certifies completion of the CyberSENSE awareness training journey and the learner's commitment to safer digital behavior.",
    details,
  };
}

export async function buildProgressReportPdfInput(
  kind: ProgressReportKind,
): Promise<ProgressReportPdfInput> {
  const snapshot = await getAnalyticsSnapshot();
  const generatedAt = formatDate(snapshot.generatedAt);

  const kindCopy: Record<ProgressReportKind, { title: string; subtitle: string }> = {
    progress: {
      title: "CyberSENSE Progress Report",
      subtitle: "Learning progress, achievement growth, and training momentum across the platform.",
    },
    engagement: {
      title: "CyberSENSE Engagement Report",
      subtitle: "Module activity, threat interest, and AI usage patterns across the training stack.",
    },
    leaderboard: {
      title: "CyberSENSE Leaderboard Summary",
      subtitle: "Ranking snapshots, streaks, and the strongest learner signals across the platform.",
    },
  };

  if (kind === "progress") {
    return {
      title: kindCopy[kind].title,
      generatedAt,
      summaryMetrics: [
        { label: "Total users", value: `${snapshot.overview.totalUsers}` },
        { label: "Active sessions", value: `${snapshot.overview.activeSessions}` },
        { label: "Quiz completions", value: `${snapshot.overview.totalQuizCompletions}` },
        { label: "Average quiz score", value: `${snapshot.overview.averageQuizScore}%` },
      ],
      trendMetrics: snapshot.progression.completionLevels.map((item) => ({
        label: item.label,
        value: `${item.value}`,
      })),
      leaderboard: snapshot.progression.topUsers.map((item) => ({
        label: item.label,
        value: `${item.value}`,
        detail: item.detail,
      })),
      highlights: [
        {
          title: "Top streak band",
          text: snapshot.progression.streakDistribution
            .slice()
            .sort((left, right) => right.value - left.value)[0]
            ?.label
            ? `${snapshot.progression.streakDistribution.slice().sort((left, right) => right.value - left.value)[0].label} streaks remain the strongest active band.`
            : "Streak data is still too small to summarize confidently.",
        },
        ...snapshot.progression.achievementCounts.slice(0, 3).map((entry) => ({
          title: entry.label,
          text: `${entry.value} unlock${entry.value === 1 ? "" : "s"} recorded in PostgreSQL.`,
        })),
      ],
    };
  }

  if (kind === "engagement") {
    return {
      title: kindCopy[kind].title,
      generatedAt,
      summaryMetrics: [
        { label: "Threat views", value: `${snapshot.overview.mostViewedThreatCategories.reduce((sum, item) => sum + item.value, 0)}` },
        { label: "Scam analyses", value: `${snapshot.overview.totalScamAnalyses}` },
        { label: "AI usage", value: `${snapshot.ai.aiUsage.reduce((sum, item) => sum + item.value, 0)}` },
        { label: "Module events", value: `${snapshot.threats.moduleEngagement.reduce((sum, item) => sum + item.value, 0)}` },
      ],
      trendMetrics: snapshot.overview.engagementTrend.map((item) => ({
        label: item.label,
        value: `${item.value}`,
      })),
      leaderboard: snapshot.threats.topThreats.map((item) => ({
        label: item.label,
        value: `${item.value}`,
        detail: item.detail,
      })),
      highlights: [
        {
          title: "Common scam family",
          text:
            snapshot.ai.commonScamTypes.slice().sort((left, right) => right.value - left.value)[0]?.label ??
            "No scam family data has been recorded yet.",
        },
        ...snapshot.ai.flaggedPatterns.slice(0, 3).map((entry) => ({
          title: entry.label,
          text: `${entry.value} tracked occurrence${entry.value === 1 ? "" : "s"} in analyzer output.`,
        })),
      ],
    };
  }

  return {
    title: kindCopy[kind].title,
    generatedAt,
    summaryMetrics: [
      { label: "Top score", value: `${snapshot.progression.topUsers[0]?.value ?? 0}` },
      { label: "Average score", value: `${snapshot.overview.averageQuizScore}%` },
      { label: "Quiz completions", value: `${snapshot.overview.totalQuizCompletions}` },
      { label: "Achievements", value: `${snapshot.progression.achievementCounts.reduce((sum, item) => sum + item.value, 0)}` },
    ],
    trendMetrics: snapshot.progression.streakDistribution.map((item) => ({
      label: item.label,
      value: `${item.value}`,
    })),
    leaderboard: snapshot.progression.topUsers.map((item) => ({
      label: item.label,
      value: `${item.value}`,
      detail: item.detail,
    })),
    highlights: [
      {
        title: "Most viewed threat",
        text:
          snapshot.overview.mostViewedThreatCategories.slice().sort((left, right) => right.value - left.value)[0]?.label ??
          "No threat views recorded yet.",
      },
      ...snapshot.progression.achievementCounts.slice(0, 3).map((entry) => ({
        title: entry.label,
        text: `${entry.value} total unlock${entry.value === 1 ? "" : "s"} across the platform.`,
      })),
    ],
  };
}
