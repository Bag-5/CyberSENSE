import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";
import { AchievementBadge } from "@/components/achievements/achievement-badge";
import { LeaderboardBoard } from "@/components/leaderboard/leaderboard-board";
import { QuizCategoryGrid } from "@/components/quiz/quiz-category-grid";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import { QuizProgressSummary } from "@/components/quiz/quiz-progress-summary";
import { quizAchievementPreview, quizCategories } from "@/data/quizzes";
import type { LeaderboardEntry, QuizCategory } from "@/types/quiz";
import { SectionHeader, cyberPanelClasses } from "@/components/ui/cyber";

type QuizPageShellProps = {
  quiz?: QuizCategory;
};

export function QuizPageShell({ quiz }: QuizPageShellProps) {
  const leaderboardEntries: LeaderboardEntry[] = [];

  if (quiz) {
    const related = quizCategories.filter((item) => item.slug !== quiz.slug).slice(0, 3);

    return (
      <div className="space-y-8 pb-10 pt-10">
        <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={cyberPanelClasses("p-6 sm:p-8")}>
            <SectionHeader
              eyebrow="Quiz Engine"
              title={quiz.title}
              description={quiz.description}
            />
          </div>
        </AnimatedSection>

        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <QuizEngine quiz={quiz} />

          <div className="space-y-6">
            <QuizProgressSummary />
            <LeaderboardBoard entries={leaderboardEntries} />
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className={cyberPanelClasses("p-5 backdrop-blur-xl")}>
            <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
                  Related quizzes
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Keep your momentum going
                </h2>
              </div>
              <Link href="/quizzes" className="text-sm font-semibold text-cyan-100">
                Back to quiz hub
              </Link>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/quizzes/${item.slug}`}
                  className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-slate-950/80"
                >
                  <p className="text-2xl">{item.icon}</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                </Link>
              ))}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {quizAchievementPreview.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  compact
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 pt-10">
      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="cyber-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
            Cyber quiz hub
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
            Quiz Engine and Gamification
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Test your cyber instincts, build streaks, and unlock achievements as
            you train against phishing, malware, AI scams, fake apps, and more.
          </p>
        </div>
      </AnimatedSection>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 lg:grid-cols-[1fr_0.92fr] lg:px-8">
        <div className="space-y-6">
          <section className={cyberPanelClasses("p-5 backdrop-blur-xl")}>
            <p className="text-sm font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
              Select a quiz
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Every quiz is single-answer, fast to replay, and designed to keep
              the learning loop tight and motivating.
            </p>
            <div className="mt-5">
              <QuizCategoryGrid />
            </div>
          </section>

          <QuizProgressSummary />
        </div>

        <div className="space-y-6">
          <LeaderboardBoard entries={leaderboardEntries} />
          <section className={cyberPanelClasses("p-5 backdrop-blur-xl")}>
            <p className="text-sm font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
              Achievement roadmap
            </p>
            <div className="mt-4 grid gap-3">
              {quizAchievementPreview.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
