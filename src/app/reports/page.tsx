import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ReportCenter } from "@/components/reports/report-center";
import { getCurrentSessionUser } from "@/lib/auth/context";
import { getAnalyticsSnapshot } from "@/lib/analytics/store";
import { buildQuizReportPdfInput, getUserReportContext } from "@/lib/reports/report-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Generate CyberSENSE certificates, quiz reports, and superadmin progress reports from live platform data.",
};

export default async function ReportsPage() {
  const [superadminSession, userSession] = await Promise.all([
    getCurrentSessionUser("superadmin"),
    getCurrentSessionUser(),
  ]);

  const session = superadminSession ?? userSession;
  if (!session) {
    redirect("/auth?returnTo=%2Freports");
  }

  const context = await getUserReportContext(session.id);
  const quizReport = buildQuizReportPdfInput(context, session.username);

  const superadminPreview = session.role === "superadmin" ? await buildSuperAdminPreview() : undefined;
  const averageScore = Math.round(context.user.totalScore / Math.max(context.user.quizzesCompleted, 1));

  const summaryMetrics = [
    { label: "Average score", value: `${averageScore}%`, detail: "Stored in PostgreSQL" },
    { label: "Completed quizzes", value: `${context.user.quizzesCompleted}`, detail: "Stored in PostgreSQL" },
    { label: "Achievements", value: `${context.user.achievements.length}`, detail: "Unlockable badges" },
    {
      label: "Rank",
      value: context.rank ? `#${context.rank}` : "Unranked",
      detail: "Leaderboard ready",
    },
  ];

  return (
    <ReportCenter
      currentName={session.username}
      currentEmail={session.email}
      currentUsername={session.username}
      currentRole={session.role}
      leaderboardRank={context.rank}
      summaryMetrics={summaryMetrics}
      completedQuizzes={context.completedQuizzes}
      milestoneChoices={context.milestoneChoices}
      categoryMetrics={context.categoryStats.map((item) => ({
        label: item.category,
        value: `${Math.round((item.correct / Math.max(item.attempts, 1)) * 100)}%`,
        detail: `${item.correct}/${item.attempts} attempts`,
      }))}
      strengths={quizReport.strengths}
      recommendations={quizReport.recommendations}
      achievements={quizReport.achievements}
      superadminPreview={superadminPreview}
    />
  );
}

async function buildSuperAdminPreview() {
  const snapshot = await getAnalyticsSnapshot();
  const buildMetrics = (items: Array<{ label: string; value: number; detail?: string }>) =>
    items.slice(0, 4).map((item) => ({
      label: item.label,
      value: `${item.value}`,
      detail: item.detail,
    }));

  return {
    progress: {
      summaryMetrics: [
        { label: "Total users", value: `${snapshot.overview.totalUsers}` },
        { label: "Active sessions", value: `${snapshot.overview.activeSessions}` },
        { label: "Quiz completions", value: `${snapshot.overview.totalQuizCompletions}` },
        { label: "Average score", value: `${snapshot.overview.averageQuizScore}%` },
      ],
      trendMetrics: buildMetrics(snapshot.progression.completionLevels),
      leaderboard: buildMetrics(snapshot.progression.topUsers),
      highlights: snapshot.progression.achievementCounts.slice(0, 3).map((entry) => ({
        title: entry.label,
        text: `${entry.value} unlock${entry.value === 1 ? "" : "s"} recorded.`,
      })),
    },
    engagement: {
      summaryMetrics: [
        { label: "Threat views", value: `${snapshot.overview.mostViewedThreatCategories.reduce((sum, item) => sum + item.value, 0)}` },
        { label: "Scam analyses", value: `${snapshot.overview.totalScamAnalyses}` },
        { label: "AI usage", value: `${snapshot.ai.aiUsage.reduce((sum, item) => sum + item.value, 0)}` },
        { label: "Module events", value: `${snapshot.threats.moduleEngagement.reduce((sum, item) => sum + item.value, 0)}` },
      ],
      trendMetrics: buildMetrics(snapshot.overview.engagementTrend),
      leaderboard: buildMetrics(snapshot.threats.topThreats),
      highlights: snapshot.ai.flaggedPatterns.slice(0, 3).map((entry) => ({
        title: entry.label,
        text: `${entry.value} occurrences tracked in analyzer output.`,
      })),
    },
    leaderboard: {
      summaryMetrics: [
        { label: "Top score", value: `${snapshot.progression.topUsers[0]?.value ?? 0}` },
        { label: "Average score", value: `${snapshot.overview.averageQuizScore}%` },
        { label: "Quiz completions", value: `${snapshot.overview.totalQuizCompletions}` },
        { label: "Achievements", value: `${snapshot.progression.achievementCounts.reduce((sum, item) => sum + item.value, 0)}` },
      ],
      trendMetrics: buildMetrics(snapshot.progression.streakDistribution),
      leaderboard: buildMetrics(snapshot.progression.topUsers),
      highlights: snapshot.progression.achievementCounts.slice(0, 3).map((entry) => ({
        title: entry.label,
        text: `${entry.value} total unlock${entry.value === 1 ? "" : "s"} across the platform.`,
      })),
    },
  };
}
