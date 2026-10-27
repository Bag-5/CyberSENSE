"use client";

import { motion } from "framer-motion";
import type { RedFlagRoundResult, RedFlagScenario } from "@/types/redflags";

type RedFlagsFeedbackProps = {
  scenario: RedFlagScenario;
  result: RedFlagRoundResult;
  onNext: () => void;
  isLastRound: boolean;
  totalScore: number;
  revealReasons: boolean;
};

type FlagListProps = {
  items: string[];
  reasons: Map<string, string>;
  revealReasons: boolean;
  emptyLabel: string;
  tone: "emerald" | "amber" | "rose";
};

const toneClasses = {
  emerald: {
    panel: "border-emerald-300/20 bg-emerald-400/10",
    label: "text-emerald-100",
    chip: "border-emerald-300/20 text-emerald-100",
  },
  amber: {
    panel: "border-amber-300/20 bg-amber-400/10",
    label: "text-amber-100",
    chip: "border-amber-300/20 text-amber-100",
  },
  rose: {
    panel: "border-rose-300/20 bg-rose-400/10",
    label: "text-rose-100",
    chip: "border-rose-300/20 text-rose-100",
  },
} as const;

function FlagList({
  items,
  reasons,
  revealReasons,
  emptyLabel,
  tone,
}: FlagListProps) {
  const classes = toneClasses[tone];

  if (!items.length) {
    return <p className="mt-4 text-sm text-slate-300">{emptyLabel}</p>;
  }

  return (
    <ul className="mt-4 space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className={`rounded-2xl border bg-slate-950/50 px-3 py-2 text-sm ${classes.chip}`}
        >
          <span className="font-semibold">{item}</span>
          {revealReasons && reasons.get(item) ? (
            <span className="mt-1 block text-xs leading-5 text-slate-400">
              {reasons.get(item)}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function RedFlagsFeedback({
  scenario,
  result,
  onNext,
  isLastRound,
  totalScore,
  revealReasons,
}: RedFlagsFeedbackProps) {
  const reasons = new Map(
    scenario.elements.map((element) => [element.label, element.reason] as const),
  );

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

        {revealReasons ? null : (
          <div className="rounded-[1.5rem] border border-amber-300/25 bg-amber-400/10 px-5 py-4 text-sm leading-6 text-amber-100">
            Hard mode hides the explanations. Replay on Easy or Medium to see
            what gave each flag away — or check the full tell list on the
            results screen.
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          <div className={`rounded-[1.75rem] border p-5 ${toneClasses.emerald.panel}`}>
            <p
              className={`text-xs font-semibold tracking-[0.2em] uppercase ${toneClasses.emerald.label}`}
            >
              Correct
            </p>
            <FlagList
              items={result.correct}
              reasons={reasons}
              revealReasons={revealReasons}
              emptyLabel="No correct clicks."
              tone="emerald"
            />
          </div>

          <div className={`rounded-[1.75rem] border p-5 ${toneClasses.amber.panel}`}>
            <p
              className={`text-xs font-semibold tracking-[0.2em] uppercase ${toneClasses.amber.label}`}
            >
              Missed
            </p>
            <FlagList
              items={result.missed}
              reasons={reasons}
              revealReasons={revealReasons}
              emptyLabel="Perfect catch."
              tone="amber"
            />
          </div>

          <div className={`rounded-[1.75rem] border p-5 ${toneClasses.rose.panel}`}>
            <p
              className={`text-xs font-semibold tracking-[0.2em] uppercase ${toneClasses.rose.label}`}
            >
              Incorrect
            </p>
            <FlagList
              items={result.incorrect}
              reasons={reasons}
              revealReasons={revealReasons}
              emptyLabel="No false alarms."
              tone="rose"
            />
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
