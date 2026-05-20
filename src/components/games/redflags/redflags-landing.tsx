"use client";

import { motion } from "framer-motion";

import { redFlagDifficultyLevels } from "@/data/redFlags";
import type { RedFlagDifficulty } from "@/types/redflags";

type RedFlagsLandingProps = {
  difficulty: RedFlagDifficulty;
  onDifficultyChange: (difficulty: RedFlagDifficulty) => void;
  onStart: () => void;
};

export function RedFlagsLanding({
  difficulty,
  onDifficultyChange,
  onStart,
}: RedFlagsLandingProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="cyber-panel overflow-hidden rounded-[2rem] p-6 sm:p-8"
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
              Cyber awareness mini-game
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
                Spot the Red Flags
              </p>
              <h1 className="text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
                Spot the Red Flags
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Inspect simulated messages, emails, login pages, and scams.
                Click the suspicious parts before the hacker chops your account
                like banku.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onStart}
                className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Start Game
              </button>
              <div className="inline-flex items-center justify-center rounded-full border border-fuchsia-300/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white">
                Difficulty placeholder
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
              Choose difficulty
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {redFlagDifficultyLevels.map((level) => {
                const isActive = level === difficulty;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onDifficultyChange(level)}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm transition ${
                      isActive
                        ? "border-cyan-300/40 bg-cyan-400/15 text-white shadow-[0_0_22px_rgba(34,211,238,0.18)]"
                        : "border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <span className="block font-semibold">{level}</span>
                    <span className="mt-1 block text-xs text-slate-400">
                      Placeholder mode
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300">
              Users will be shown one simulated attack at a time and must tap or
              highlight suspicious parts before checking the answer.
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

