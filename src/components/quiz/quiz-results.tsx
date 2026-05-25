"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { AchievementBadge } from "@/components/achievements/achievement-badge";
import { CertificatePromptModal } from "@/components/certificates/certificate-prompt-modal";
import type { QuizAchievement, QuizCategory, QuizResultSummary } from "@/types/quiz";
import { getCyberFeedback, getCyberRankLabel, getQuizSuggestions, getQuizStrengths } from "@/lib/quiz/scoring";
import { cyberButtonClasses, cyberPanelClasses } from "@/components/ui/cyber";

type QuizResultsProps = {
  quiz: QuizCategory;
  summary: QuizResultSummary;
  unlockedAchievements: QuizAchievement[];
  onRetry: () => void;
  onPickAnotherQuiz: () => void;
  onPickAnotherQuizLabel?: string;
  certificateFlow?: {
    title: string;
    description: string;
    ctaLabel?: string;
    certificateType: "quiz" | "milestone" | "training";
    subjectKey?: string;
  };
};

export function QuizResults({
  quiz,
  summary,
  unlockedAchievements,
  onRetry,
  onPickAnotherQuiz,
  onPickAnotherQuizLabel = "Pick another quiz",
  certificateFlow,
}: QuizResultsProps) {
  const [showCertificatePrompt, setShowCertificatePrompt] = useState(Boolean(certificateFlow));
  const performanceLabel = getCyberRankLabel(summary.percentage);
  const feedback = getCyberFeedback(summary.percentage);
  const strengths = getQuizStrengths(summary);
  const suggestions = getQuizSuggestions(quiz, summary);
  const perfectRun = summary.percentage === 100;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {certificateFlow ? (
        <CertificatePromptModal
          open={showCertificatePrompt}
          title={certificateFlow.title}
          description={certificateFlow.description}
          certificateType={certificateFlow.certificateType}
          subjectKey={certificateFlow.subjectKey}
          ctaLabel={certificateFlow.ctaLabel ?? "Generate certificate"}
          onClose={() => setShowCertificatePrompt(false)}
          onGenerated={() => setShowCertificatePrompt(false)}
        />
      ) : null}

      <div className={cyberPanelClasses("border-cyan-300/20 bg-cyan-400/10 p-5")}>
        <p className="text-xs font-semibold tracking-[0.24em] text-cyan-100 uppercase">
          Final score
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <p className="text-4xl font-black tracking-[-0.06em] text-white">
            {summary.score}%
          </p>
          <p className="pb-1 text-sm text-slate-300">
            {summary.correctCount}/{summary.totalQuestions} correct
          </p>
          <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
            {performanceLabel}
          </span>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
          {feedback}
        </p>
        {perfectRun ? (
          <p className="mt-3 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100">
            Perfect score. Cyber chairman status unlocked.
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={cyberPanelClasses("p-5")}>
          <p className="text-xs font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
            Strengths
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
            {strengths.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className={cyberPanelClasses("p-5")}>
          <p className="text-xs font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
            Improve next
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
            {suggestions.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={cyberPanelClasses("p-5")}>
        <p className="text-xs font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
          Unlocks
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {unlockedAchievements.length ? (
            unlockedAchievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                unlocked
              />
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
              No new achievements yet. Try again and push for a cleaner run.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className={cyberButtonClasses("primary", "md", "flex-1")}
        >
          Retry quiz
        </button>
        <button
          type="button"
          onClick={onPickAnotherQuiz}
          className={cyberButtonClasses("ghost", "md", "flex-1")}
        >
          {onPickAnotherQuizLabel}
        </button>
      </div>
    </motion.section>
  );
}
