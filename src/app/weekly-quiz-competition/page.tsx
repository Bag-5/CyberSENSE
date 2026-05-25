import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { WeeklyCompetitionPage } from "@/components/weekly-competition/weekly-competition-page";
import { getCurrentSessionUser } from "@/lib/auth/context";
import { loadWeeklyCompetitionEntries } from "@/lib/competition/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Weekly Quiz Competition",
  description:
    "Take the CyberSENSE weekly 100-question academy competition and climb the live leaderboard.",
};

export default async function WeeklyQuizCompetitionRoute() {
  const session = await getCurrentSessionUser().catch(() => null);
  if (!session) {
    redirect("/auth?returnTo=%2Fweekly-quiz-competition");
  }

  const leaderboardEntries = await loadWeeklyCompetitionEntries();

  return <WeeklyCompetitionPage leaderboardEntries={leaderboardEntries} />;
}
