"use client";

import { motion } from "framer-motion";
import type { RedFlagRoundResult, RedFlagScenario } from "@/types/redflags";

type RedFlagsFeedbackProps = {
  scenario: RedFlagScenario;
  result: RedFlagRoundResult;
  onNext: () => void;
  isLastRound: boolean;
  totalScore: number;
};

export function RedFlagsFeedback({
  scenario,
  result,
  onNext,
  isLastRound,
  totalScore,
}: RedFlagsFeedbackProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-6"
      >
        <div className="cyber-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
            Round review
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white">
            {scenario.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            {scenario.explanation}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[1.75rem] border border-emerald-300/20 bg-emerald-400/10 p-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-emerald-100 uppercase">
              Correct
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.correct.length ? (
                result.correct.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-emerald-300/20 bg-slate-950/50 px-3 py-2 text-sm text-emerald-100"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-300">No correct clicks.</span>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-amber-300/20 bg-amber-400/10 p-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-amber-100 uppercase">
              Missed
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.missed.length ? (
                result.missed.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-amber-300/20 bg-slate-950/50 px-3 py-2 text-sm text-amber-100"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-300">Perfect catch.</span>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-rose-300/20 bg-rose-400/10 p-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-rose-100 uppercase">
              Incorrect
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.incorrect.length ? (
                result.incorrect.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-rose-300/20 bg-slate-950/50 px-3 py-2 text-sm text-rose-100"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-300">No false alarms.</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
              Safe habits
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
              {scenario.safeAdvice.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-cyan-300/15 bg-cyan-400/8 p-5">
            <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200 uppercase">
              Score update
            </p>
            <div className="mt-4 space-y-3">
              <p className="text-3xl font-black tracking-[-0.04em] text-white">
                +{result.points} points
              </p>
              <p className="text-sm text-slate-300">
                Total score is now <span className="text-cyan-100">{totalScore}</span>.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          {isLastRound ? "See Results" : "Next Scenario"}
        </button>

        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5">
          <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200 uppercase">
            Ghanaian-style reminder
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Hacker nearly get your account like fresh banku. Small pause and
            verification would have saved the day.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
