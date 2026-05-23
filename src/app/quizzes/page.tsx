import type { Metadata } from "next";

import { AnalyticsBeacon } from "@/components/admin/analytics/analytics-beacon";
import { QuizPageShell } from "@/components/quiz/quiz-page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quizzes",
  description:
    "Take modular cyber awareness quizzes in CyberSENSE and unlock achievements, streaks, and leaderboard-ready progress.",
};

export default function QuizzesPage() {
  return (
    <>
      <AnalyticsBeacon
        eventType="quiz_hub_viewed"
        module="quizzes"
        slug="quiz-hub"
        category="Quiz Hub"
        portal="user"
        dedupeKey="quiz-hub"
      />
      <QuizPageShell />
    </>
  );
}
