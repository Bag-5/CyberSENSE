"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { quizAchievementPreview, quizCategories } from "@/data/quizzes";
import {
  getDefaultQuizProgress,
  loadQuizProgress,
  subscribeQuizProgress,
} from "@/lib/progress/quiz-progress";
import { AchievementBadge } from "@/components/achievements/achievement-badge";

export function QuizProgressSummary() {
  const [progress, setProgress] = useState(getDefaultQuizProgress());

  useEffect(() => {
    const syncProgress = () => {
      setProgress(loadQuizProgress());
    };

    const timer = window.setTimeout(syncProgress, 0);
    const unsubscribe = subscribeQuizProgress(syncProgress);

    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const completedCount = Object.keys(progress.completedQuizzes).length;
  const averageScore = progress.averageScore;
  const currentStreak = progress.currentStreak;
  const longestStreak = progress.longestStreak;
  const achievementIds = progress.achievements;

  const completionPercent = useMemo(() => {
    return Math.round((completedCount / quizCategories.length) * 100);
  }, [completedCount]);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200 uppercase">
            Progress
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Local learning tracker
          </h2>
        </div>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
          Synced
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
            Completed
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {completedCount}/{quizCategories.length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
            Average score
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">{averageScore}%</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
            Current streak
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {currentStreak} day{currentStreak === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-300/15 bg-cyan-400/8 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">Completion progress</span>
          <span className="font-semibold text-cyan-100">{completionPercent}%</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-900">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-300"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.55 }}
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <p className="text-xs tracking-[0.18em] text-fuchsia-200 uppercase">
          Longest streak
        </p>
        <p className="mt-2 text-lg font-semibold text-white">
          {longestStreak} day{longestStreak === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-xs tracking-[0.18em] text-fuchsia-200 uppercase">
          Unlocked achievements
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {quizAchievementPreview.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              unlocked={achievementIds.includes(achievement.id)}
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
}
