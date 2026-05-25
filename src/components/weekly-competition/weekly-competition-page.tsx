import { AnalyticsBeacon } from "@/components/admin/analytics/analytics-beacon";
import { AnimatedSection } from "@/components/animated-section";
import { LeaderboardBoard } from "@/components/leaderboard/leaderboard-board";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import { SectionHeader, cyberPanelClasses } from "@/components/ui/cyber";
import { weeklyCompetitionQuiz, weeklyCompetitionSummary } from "@/data/weeklyCompetition";
import type { LeaderboardEntry } from "@/types/quiz";

type WeeklyCompetitionPageProps = {
  leaderboardEntries: LeaderboardEntry[];
};

export function WeeklyCompetitionPage({ leaderboardEntries }: WeeklyCompetitionPageProps) {
  return (
    <div className="space-y-8 pb-10 pt-10">
      <AnalyticsBeacon
        eventType="page_view"
        module="quizzes"
        slug="weekly-competition"
        category="Weekly Quiz Competition"
        portal="user"
        dedupeKey="weekly-competition"
      />

      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cyberPanelClasses("p-6 sm:p-8")}>
          <SectionHeader
            eyebrow="Weekly challenge"
            title="Weekly Quiz Competition"
            description="A 100-question academy-wide competition built from the full Threat Academy curriculum. Your score feeds the live leaderboard."
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/10 p-4">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-cyan-100 uppercase">
                Questions
              </p>
              <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">
                {weeklyCompetitionSummary.totalQuestions}
              </p>
              <p className="mt-1 text-sm text-cyan-50/80">Generated from all academy courses.</p>
            </div>
            <div className="rounded-2xl border border-amber-300/15 bg-amber-400/10 p-4">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-amber-100 uppercase">
                Courses covered
              </p>
              <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">
                {weeklyCompetitionSummary.courseCount}
              </p>
              <p className="mt-1 text-sm text-amber-50/80">Every Threat Academy course counts.</p>
            </div>
            <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-emerald-100 uppercase">
                Questions per course
              </p>
              <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">
                {weeklyCompetitionSummary.questionCountPerCourse}
              </p>
              <p className="mt-1 text-sm text-emerald-50/80">Balanced across the full academy.</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <QuizEngine quiz={weeklyCompetitionQuiz} />

        <div className="space-y-6">
          <LeaderboardBoard entries={leaderboardEntries} title="Weekly competition leaderboard" />
          <section className={cyberPanelClasses("p-5 backdrop-blur-xl")}>
            <p className="text-sm font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
              Competition rules
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-3">
                One score for the week. Aim for a clean run through all 100 questions.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-3">
                Rankings are based on your competition score and broader training streaks.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-3">
                Superadmins publish the weekly set and monitor the live leaderboard from the
                control room.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
