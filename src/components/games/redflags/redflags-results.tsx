"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { redFlagDifficultyConfig, redFlagScenarios } from "@/data/redFlags";
import type { RedFlagDifficulty, RedFlagRoundResult } from "@/types/redflags";

type RoundOutcome = {
  scenarioSlug: string;
  result: RedFlagRoundResult;
};

type RedFlagsResultsProps = {
  score: number;
  maxScore: number;
  rating: string;
  message: string;
  difficulty: RedFlagDifficulty;
  history: RoundOutcome[];
  onRestart: () => void;
};

const scenarioBySlug = new Map(
  redFlagScenarios.map((scenario) => [scenario.slug, scenario] as const),
);

export function RedFlagsResults({
  score,
  maxScore,
  rating,
  message,
  difficulty,
  history,
  onRestart,
}: RedFlagsResultsProps) {
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const config = redFlagDifficultyConfig[difficulty];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="grid gap-6 lg:grid-cols-[1fr_0.8fr]"
      >
        <div className="cyber-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
            Results · {difficulty} mode
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white">
            Final Score: {score}/{maxScore}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {percentage}% of the available points · ×{config.scoreMultiplier}{" "}
            multiplier applied
          </p>
          <p className="mt-4 text-lg font-semibold text-fuchsia-100">{rating}</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            {message}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              Play Again
            </button>
            <Link
              href="/threats"
              className="inline-flex items-center justify-center rounded-full border border-fuchsia-300/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
            >
              Continue Learning
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-sm font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
            Quick takeaway
          </p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
            <p>
              The best defense is slowing down when a message pushes urgency,
              secrecy, or reward.
            </p>
            <p>
              Keep checking domains, sender names, PIN requests, and payment
              pressure before you tap.
            </p>
            <p className="rounded-3xl border border-cyan-300/15 bg-cyan-400/8 p-4 text-cyan-100">
              Ei! You dey move like cyber detective now.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl sm:p-8">
        <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
          Every tell from this run
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          These are the signals hiding in each scenario, whether you caught them
          or not.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {history.map(({ scenarioSlug }) => {
            const scenario = scenarioBySlug.get(scenarioSlug);
            if (!scenario) {
              return null;
            }

            const suspicious = scenario.elements.filter(
              (element) => element.suspicious,
            );

            return (
              <div
                key={scenarioSlug}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm font-semibold text-white">
                  {scenario.title}
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  {suspicious.map((element) => (
                    <li key={element.id}>
                      <span className="font-semibold text-white">
                        {element.label}
                      </span>
                      <span className="block text-xs leading-5 text-slate-400">
                        {element.reason}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
