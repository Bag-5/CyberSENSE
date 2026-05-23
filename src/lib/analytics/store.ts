import { generateId } from "@/lib/auth/crypto";
import { getCurrentSessionUser } from "@/lib/auth/context";
import { ensureDatabaseReady, getDatabase } from "@/lib/db/postgres";
import { extractPatternKeywords } from "@/lib/analytics/classify";
import type {
  AnalyticsEventPayload,
  AnalyticsSnapshot,
  AnalyticsStatusCard,
  AnalyticsCounterPoint,
} from "@/lib/analytics/types";
import { quizCategories } from "@/data/quizzes";

type UserRow = {
  id: string;
  username: string;
  email: string;
  role: string;
  last_login_at: string;
  total_score: number;
  quizzes_completed: number;
  streak: number;
  longest_streak: number;
  quiz_scores: Record<string, number> | null;
  achievements: string[] | null;
};

type AnalyticsEventRow = {
  id: string;
  event_type: string;
  module: string;
  slug: string | null;
  category: string | null;
  user_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

type QuizAttemptRow = {
  id: string;
  user_id: string;
  quiz_slug: string;
  quiz_title: string;
  question_id: string;
  question_text: string;
  category: string;
  difficulty: string;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
  points: number;
  created_at: string;
};

function normalizeDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function toBarPoints(entries: Array<{ label: string; value: number }>) {
  return entries
    .sort((left, right) => right.value - left.value)
    .slice(0, 6)
    .map((entry) => ({
      label: entry.label,
      value: entry.value,
      detail: `${entry.value}`,
    }));
}

function percentage(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function countBy<T>(items: T[], keyGetter: (item: T) => string) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyGetter(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
}

function buildEngagementTrend(events: AnalyticsEventRow[]) {
  const recentEvents = events.filter((event) => event.created_at);
  const counts = new Map<string, number>();
  for (const event of recentEvents) {
    const day = event.created_at.slice(0, 10);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-7)
    .map(([day, value]) => ({ label: normalizeDateLabel(day), value }));
}

function buildCompletionLevels(users: UserRow[]): AnalyticsCounterPoint[] {
  const bands = [
    { label: "Just started", min: 0, max: 0 },
    { label: "Getting warmer", min: 1, max: 2 },
    { label: "Steady learner", min: 3, max: 4 },
    { label: "Frequent trainee", min: 5, max: 7 },
    { label: "Power user", min: 8, max: Number.POSITIVE_INFINITY },
  ];

  return bands.map((band) => ({
    label: band.label,
    value: users.filter((user) => user.quizzes_completed >= band.min && user.quizzes_completed <= band.max).length,
  }));
}

function buildStreakDistribution(users: UserRow[]) {
  const bands = [
    { label: "0", min: 0, max: 0 },
    { label: "1-2", min: 1, max: 2 },
    { label: "3-5", min: 3, max: 5 },
    { label: "6-9", min: 6, max: 9 },
    { label: "10+", min: 10, max: Number.POSITIVE_INFINITY },
  ];

  return bands.map((band) => ({
    label: band.label,
    value: users.filter((user) => user.streak >= band.min && user.streak <= band.max).length,
  }));
}

function formatLabel(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function fetchAnalyticsRows() {
  await ensureDatabaseReady();
  const db = getDatabase();

  const [users, events, attempts] = await Promise.all([
    db<UserRow[]>`
      select
        id,
        username,
        email,
        role,
        last_login_at,
        total_score,
        quizzes_completed,
        streak,
        longest_streak,
        quiz_scores,
        achievements
      from cybersense_users
    `,
    db<AnalyticsEventRow[]>`
      select
        id,
        event_type,
        module,
        slug,
        category,
        user_id,
        metadata,
        created_at
      from cybersense_analytics_events
      order by created_at desc
      limit 1500
    `,
    db<QuizAttemptRow[]>`
      select
        id,
        user_id,
        quiz_slug,
        quiz_title,
        question_id,
        question_text,
        category,
        difficulty,
        selected_answer,
        correct_answer,
        is_correct,
        points,
        created_at
      from cybersense_quiz_attempts
      order by created_at desc
      limit 4000
    `,
  ]);

  return { users, events, attempts };
}

export async function recordAnalyticsEvent(payload: AnalyticsEventPayload) {
  await ensureDatabaseReady();
  const db = getDatabase();
  const user = payload.portal ? await getCurrentSessionUser(payload.portal) : null;

  await db`
    insert into cybersense_analytics_events (
      id,
      event_type,
      module,
      slug,
      category,
      user_id,
      metadata,
      created_at
    ) values (
      ${generateId()},
      ${payload.eventType},
      ${payload.module},
      ${payload.slug ?? null},
      ${payload.category ?? null},
      ${user?.id ?? payload.userId ?? null},
      ${JSON.stringify(payload.metadata ?? {})}::jsonb,
      ${new Date().toISOString()}
    )
  `;
}

export async function recordQuizAttempt(payload: {
  quizSlug: string;
  quizTitle: string;
  questionId: string;
  questionText: string;
  category: string;
  difficulty: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
  portal?: "user" | "superadmin";
}) {
  const user = await getCurrentSessionUser(payload.portal ?? "user");
  if (!user) {
    return;
  }

  await ensureDatabaseReady();
  const db = getDatabase();

  await db`
    insert into cybersense_quiz_attempts (
      id,
      user_id,
      quiz_slug,
      quiz_title,
      question_id,
      question_text,
      category,
      difficulty,
      selected_answer,
      correct_answer,
      is_correct,
      points,
      created_at
    ) values (
      ${generateId()},
      ${user.id},
      ${payload.quizSlug},
      ${payload.quizTitle},
      ${payload.questionId},
      ${payload.questionText},
      ${payload.category},
      ${payload.difficulty},
      ${payload.selectedAnswer},
      ${payload.correctAnswer},
      ${payload.isCorrect},
      ${payload.points},
      ${new Date().toISOString()}
    )
  `;
}

export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const { users, events, attempts } = await fetchAnalyticsRows();
  const now = new Date();
  const activeCutoff = new Date(now.getTime() - 15 * 60 * 1000).toISOString();

  const totalQuizCompletions = users.reduce((sum, user) => sum + user.quizzes_completed, 0);
  const quizScoreValues = users.flatMap((user) => Object.values(user.quiz_scores ?? {}));
  const averageQuizScore = average(quizScoreValues);
  const scamAnalyses = events.filter((event) => event.event_type === "scam_analysis_completed");
  const threatViews = events.filter((event) => event.event_type === "threat_viewed");
  const moduleEvents = events.filter((event) =>
    ["threat_viewed", "page_view", "simulation_selected", "quiz_viewed", "quiz_hub_viewed", "scam_analysis_completed", "quiz_completed"].includes(
      event.event_type,
    ),
  );

  const threatCategoryCounts = countBy(threatViews, (event) => event.category ?? event.slug ?? "Unknown");
  const topThreatCategories = toBarPoints(
    threatCategoryCounts.map((entry) => ({
      label: entry.label,
      value: entry.value,
    })),
  );

  const challengeCounts = countBy(
    events.filter((event) => event.module === "lab" && event.event_type === "simulation_selected"),
    (event) => event.slug ?? "Unknown",
  );

  const aiRiskCounts = countBy(
    scamAnalyses,
    (event) => String((event.metadata?.riskLevel as string | undefined) ?? "Suspicious"),
  );

  const scamFamilies = countBy(
    scamAnalyses,
    (event) => String((event.metadata?.scamFamily as string | undefined) ?? "General scam"),
  );

  const patterns = countBy(
    scamAnalyses.flatMap((event) => {
      const flags = Array.isArray(event.metadata?.redFlags)
        ? ((event.metadata?.redFlags as string[]) ?? [])
        : [];
      return extractPatternKeywords(flags);
    }),
    (pattern) => pattern,
  );

  const aiUsage = countBy(events.filter((event) => event.module === "analyzer"), (event) => event.event_type);

  const quizCompletions = events.filter((event) => event.event_type === "quiz_completed");
  const quizTrend = buildEngagementTrend(quizCompletions);

  const categoryScores = quizCategories.map((quiz) => {
    const scores = users
      .map((user) => user.quiz_scores?.[quiz.slug])
      .filter((value): value is number => typeof value === "number");
    return {
      label: quiz.title,
      value: average(scores),
    };
  });

  const categoryCompletionRates = quizCategories.map((quiz) => {
    const completedUsers = users.filter((user) => typeof user.quiz_scores?.[quiz.slug] === "number").length;
    return {
      label: quiz.title,
      value: percentage(completedUsers, users.length),
      detail: `${completedUsers}/${users.length || 0}`,
    };
  });

  const failedCategories = countBy(
    attempts.filter((attempt) => !attempt.is_correct),
    (attempt) => attempt.category,
  );
  const totalAttemptsByCategory = countBy(attempts, (attempt) => attempt.category);
  const failedCategoryRates = totalAttemptsByCategory.map((entry) => {
    const wrongCount = failedCategories.find((failed) => failed.label === entry.label)?.value ?? 0;
    return {
      label: entry.label,
      value: percentage(wrongCount, entry.value),
      detail: `${wrongCount}/${entry.value}`,
    };
  });

  const questionPerformance = attempts.reduce((map, attempt) => {
    const existing = map.get(attempt.question_id) ?? {
      label: attempt.question_text,
      value: 0,
      wrong: 0,
      attempts: 0,
      category: attempt.category,
    };

    existing.attempts += 1;
    if (!attempt.is_correct) {
      existing.wrong += 1;
    }
    existing.value = percentage(existing.wrong, existing.attempts);
    map.set(attempt.question_id, existing);
    return map;
  }, new Map<string, { label: string; value: number; wrong: number; attempts: number; category: string }>());

  const hardestQuestions = Array.from(questionPerformance.values())
    .sort((left, right) => right.value - left.value || right.attempts - left.attempts)
    .slice(0, 5)
    .map((item) => ({
      label: item.label,
      value: item.value,
      detail: item.category,
    }));

  const leaderboard = users
    .slice()
    .sort((left, right) => right.total_score - left.total_score || right.streak - left.streak)
    .slice(0, 5)
    .map((user) => ({
      label: user.username,
      value: user.total_score,
      detail: `${user.quizzes_completed} quizzes`,
    }));

  const streakBands = buildStreakDistribution(users);
  const progressionBands = buildCompletionLevels(users);
  const achievementCounts = countBy(
    users.flatMap((user) => user.achievements ?? []),
    (achievement) => achievement,
  ).map((entry) => ({ ...entry, label: formatLabel(entry.label) }));

  const system: AnalyticsStatusCard[] = [
    {
      label: "AI service status",
      value: scamAnalyses.length ? "Active" : "Idle",
      detail: scamAnalyses.length
        ? "OpenRouter analyses are being recorded"
        : "No completed AI analyses yet",
      tone: scamAnalyses.length ? "emerald" : "amber",
    },
    {
      label: "Threat feed status",
      value: threatViews.length ? "Tracking" : "Quiet",
      detail: threatViews.length ? "Threat content is being viewed" : "No view events recorded yet",
      tone: threatViews.length ? "cyan" : "amber",
    },
    {
      label: "Quiz engine status",
      value: attempts.length ? "Instrumented" : "Awaiting",
      detail: attempts.length ? "Question attempts are stored" : "No quiz attempts recorded yet",
      tone: attempts.length ? "emerald" : "rose",
    },
    {
      label: "Database status",
      value: "Online",
      detail: `${users.length} users and ${events.length} events loaded`,
      tone: "cyan",
    },
  ];

  const recentActivity = events.slice(0, 5).map((event) => {
    const tone: AnalyticsStatusCard["tone"] =
      event.event_type === "scam_analysis_completed"
        ? "emerald"
        : event.event_type === "quiz_completed"
          ? "cyan"
          : event.event_type === "threat_viewed"
            ? "amber"
            : "rose";

    return {
      label: event.module,
      value: event.event_type.replaceAll("_", " "),
      detail: [
        event.slug ? `Slug: ${event.slug}` : null,
        event.category ? `Category: ${event.category}` : null,
      ]
        .filter(Boolean)
        .join(" • ") || "Tracked event",
      tone,
    };
  });

  const moduleUsage = countBy(moduleEvents, (event) => event.module);

  const topUsers = users
    .slice()
    .sort((left, right) => right.total_score - left.total_score || right.quizzes_completed - left.quizzes_completed)
    .slice(0, 5)
    .map((user) => ({
      label: user.username,
      value: user.total_score,
      detail: `${user.quizzes_completed} completed`,
    }));

  const mostViewedThreatCategories = topThreatCategories.length
    ? topThreatCategories
    : [{ label: "No view data yet", value: 0, detail: "Track threat page views to populate this chart." }];

  return {
    generatedAt: now.toISOString(),
    overview: {
      totalUsers: users.length,
      activeSessions: users.filter((user) => user.last_login_at >= activeCutoff).length,
      totalQuizCompletions,
      averageQuizScore,
      totalScamAnalyses: scamAnalyses.length,
      mostViewedThreatCategories,
      engagementTrend: buildEngagementTrend(moduleEvents),
      progressionBands,
    },
    quizzes: {
      categoryPerformance: categoryScores.map((entry, index) => ({
        label: entry.label,
        value: entry.value,
        detail: categoryCompletionRates[index]?.detail ?? "0/0",
      })),
      mostFailedCategories: failedCategoryRates.length
        ? failedCategoryRates.sort((left, right) => right.value - left.value)
        : [{ label: "No failed attempts yet", value: 0, detail: "Wrong answers will appear here." }],
      hardestQuestions,
      leaderboard,
      improvementTrend: quizTrend,
    },
    threats: {
      topThreats: mostViewedThreatCategories,
      moduleEngagement: moduleUsage.length
        ? moduleUsage
        : [{ label: "No activity yet", value: 0, detail: "Module views will appear here." }],
      phishingPopularity: threatCategoryCounts.length
        ? toBarPoints(
            threatCategoryCounts.filter((entry) => entry.label.toLowerCase().includes("phishing")),
          )
        : [{ label: "No phishing activity", value: 0, detail: "Track phishing views to populate this section." }],
      simulationUsage: challengeCounts.length
        ? challengeCounts
        : [{ label: "No simulation picks", value: 0, detail: "Simulation selections will appear here." }],
    },
    ai: {
      riskDistribution: aiRiskCounts.length
        ? aiRiskCounts
        : [{ label: "No AI results yet", value: 0, detail: "Run the analyzer to populate risk distribution." }],
      commonScamTypes: scamFamilies.length
        ? scamFamilies
        : [{ label: "No scam classifications yet", value: 0, detail: "Scam family classification will appear here." }],
      aiUsage: aiUsage.length
        ? aiUsage
        : [{ label: "Analyzer idle", value: 0, detail: "Open the analyzer to generate activity." }],
      flaggedPatterns: patterns.length
        ? patterns
        : [{ label: "No patterns recorded", value: 0, detail: "Tracked red flags will appear here." }],
      recentActivity,
    },
    progression: {
      achievementCounts: achievementCounts.length
        ? achievementCounts
        : [{ label: "No achievements yet", value: 0, detail: "Achievements will appear after quiz completions." }],
      streakDistribution: streakBands,
      completionLevels: progressionBands,
      topUsers,
    },
    system,
  };
}
