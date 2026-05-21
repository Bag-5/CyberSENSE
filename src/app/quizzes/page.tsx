import type { Metadata } from "next";

import { QuizPageShell } from "@/components/quiz/quiz-page-shell";

export const metadata: Metadata = {
  title: "Quizzes",
  description:
    "Take modular cyber awareness quizzes in CyberSENSE and unlock achievements, streaks, and leaderboard-ready progress.",
};

export default function QuizzesPage() {
  return <QuizPageShell />;
}
