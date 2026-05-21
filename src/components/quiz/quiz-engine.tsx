"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import Link from "next/link";

import { QuizResults } from "@/components/quiz/quiz-results";
import { recordQuizCompletion } from "@/lib/progress/quiz-progress";
import { scoreQuiz } from "@/lib/quiz/scoring";
import type { QuizAchievement, QuizCategory } from "@/types/quiz";
import { cn } from "@/utils/cn";

type QuizEngineProps = {
  quiz: QuizCategory;
};

export function QuizEngine({ quiz }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [summary, setSummary] = useState<ReturnType<typeof scoreQuiz> | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<QuizAchievement[]>([]);

  const currentQuestion = quiz.questions[currentIndex] ?? quiz.questions[0];
  const isFinalQuestion = currentIndex === quiz.questions.length - 1;
  const isFinished = summary !== null;

  const currentEvaluation = useMemo(() => {
    if (!currentQuestion) {
      return null;
    }
    const chosen = selectedAnswer ?? submittedAnswers[currentQuestion.id];
    const isCorrect = chosen === currentQuestion.correctAnswer;
    return { chosen, isCorrect };
  }, [currentQuestion, selectedAnswer, submittedAnswers]);

  function handleSubmitAnswer() {
    if (!currentQuestion || !selectedAnswer) {
      return;
    }

    const nextAnswers = {
      ...submittedAnswers,
      [currentQuestion.id]: selectedAnswer,
    };
    setSubmittedAnswers(nextAnswers);
    setShowFeedback(true);

    if (isFinalQuestion) {
      const nextSummary = scoreQuiz(quiz, nextAnswers);
      const { newAchievements } = recordQuizCompletion(quiz, nextSummary);
      setSummary(nextSummary);
      setUnlockedAchievements(newAchievements);
    }
  }

  function handleNextQuestion() {
    if (isFinalQuestion) {
      return;
    }

    setCurrentIndex((value) => value + 1);
    setSelectedAnswer(submittedAnswers[quiz.questions[currentIndex + 1]?.id] ?? null);
    setShowFeedback(false);
  }

  function handleRetry() {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setSubmittedAnswers({});
    setShowFeedback(false);
    setSummary(null);
    setUnlockedAchievements([]);
  }

  function handlePickAnotherQuiz() {
    window.location.href = "/quizzes";
  }

  if (!currentQuestion) {
    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
        This quiz does not have any questions yet.
      </div>
    );
  }

  if (isFinished && summary) {
    return (
      <QuizResults
        quiz={quiz}
        summary={summary}
        unlockedAchievements={unlockedAchievements}
        onRetry={handleRetry}
        onPickAnotherQuiz={handlePickAnotherQuiz}
      />
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
            Question {currentIndex + 1} of {quiz.questions.length}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            {quiz.title} quiz
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1">
            {currentQuestion.difficulty}
          </span>
          <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-cyan-100">
            {quiz.accent}
          </span>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200 uppercase">
            Cyber question
          </p>
          <Link
            href="/quizzes"
            className="text-sm font-semibold text-slate-400 transition hover:text-cyan-100"
          >
            Back to quizzes
          </Link>
        </div>

        <p className="mt-4 text-xl font-semibold leading-8 text-white sm:text-2xl">
          {currentQuestion.question}
        </p>

        <div className="mt-5 grid gap-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = showFeedback && option === currentQuestion.correctAnswer;
            const isWrongSelection =
              showFeedback && isSelected && option !== currentQuestion.correctAnswer;

            return (
              <button
                key={option}
                type="button"
                onClick={() => !showFeedback && setSelectedAnswer(option)}
                aria-pressed={isSelected}
                className={cn(
                  "rounded-2xl border px-4 py-4 text-left text-sm transition duration-300",
                  isCorrect
                    ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-100"
                    : isWrongSelection
                    ? "border-rose-300/30 bg-rose-400/15 text-rose-100"
                    : isSelected
                    ? "border-cyan-300/40 bg-cyan-400/15 text-white"
                    : "border-white/10 bg-white/5 text-slate-300 hover:-translate-y-0.5 hover:border-fuchsia-300/25 hover:bg-white/8 hover:text-white",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showFeedback ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-3xl border border-cyan-300/15 bg-cyan-400/8 p-5 text-sm leading-6 text-slate-200"
          >
            <p className="font-semibold text-white">
              {currentEvaluation?.isCorrect ? "Correct hit." : "Not quite."}
            </p>
            <p className="mt-2">{currentQuestion.explanation}</p>
          </motion.div>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          {!showFeedback ? (
            <button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Check answer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              {isFinalQuestion ? "Finish quiz" : "Next question"}
            </button>
          )}

          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            Restart
          </button>
        </div>
      </div>
    </section>
  );
}
