"use client";

import { motion } from "framer-motion";

import { cn } from "@/utils/cn";
import type { RedFlagScenario } from "@/types/redflags";
import { RedFlagsScenarioPreview } from "@/components/games/redflags/redflags-scenario-preview";

type RedFlagsPlayProps = {
  scenario: RedFlagScenario;
  selectedIds: string[];
  onToggleChoice: (choiceId: string) => void;
  onSubmit: () => void;
  onBackToLanding: () => void;
  roundNumber: number;
  totalRounds: number;
};

export function RedFlagsPlay({
  scenario,
  selectedIds,
  onToggleChoice,
  onSubmit,
  onBackToLanding,
  roundNumber,
  totalRounds,
}: RedFlagsPlayProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between gap-4 text-sm text-slate-400">
        <p>
          Round <span className="text-cyan-100">{roundNumber}</span> of{" "}
          <span className="text-cyan-100">{totalRounds}</span>
        </p>
        <button
          type="button"
          onClick={onBackToLanding}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          Back to start
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <p className="text-sm font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
            {scenario.title}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
            {scenario.teaser}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {scenario.intro}
          </p>

          <div className="mt-6">
            <RedFlagsScenarioPreview scenario={scenario} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
                Red flags
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Tap the suspicious parts
              </h3>
            </div>
            <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
              {selectedIds.length} selected
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {scenario.elements.map((element) => {
              const isSelected = selectedIds.includes(element.id);
              return (
                <button
                  key={element.id}
                  type="button"
                  onClick={() => onToggleChoice(element.id)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left text-sm transition duration-300",
                    isSelected
                      ? "border-cyan-300/40 bg-cyan-400/15 text-white shadow-[0_0_22px_rgba(34,211,238,0.12)]"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-fuchsia-300/30 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <span className="block font-semibold">{element.label}</span>
                  <span className="mt-1 block text-xs text-slate-400">
                    Tap to mark as suspicious
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-200 uppercase">
              Scoring
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
              <li>+20 points for each correct detection</li>
              <li>-10 points for each incorrect click</li>
              <li>+15 bonus for a perfect round</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Check Answer
          </button>
        </motion.div>
      </div>
    </section>
  );
}

