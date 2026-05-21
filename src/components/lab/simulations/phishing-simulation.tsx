"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { phishingSimulationContent } from "@/data/simulations";
import { cn } from "@/utils/cn";

export function PhishingSimulation() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);

  const redFlags = phishingSimulationContent.redFlags;

  const result = useMemo(() => {
    const correct = selectedIds.filter((id) => redFlags.some((flag) => flag.id === id));
    const missed = redFlags.filter((flag) => !selectedIds.includes(flag.id));
    return { correct, missed };
  }, [redFlags, selectedIds]);

  function toggleFlag(flagId: string) {
    if (revealed) {
      return;
    }

    setSelectedIds((current) =>
      current.includes(flagId)
        ? current.filter((id) => id !== flagId)
        : [...current, flagId],
    );
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-5"
        >
          <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200 uppercase">
            {phishingSimulationContent.title}
          </p>
          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-200 uppercase">
                  From
                </p>
                <p className="mt-1 text-sm text-white">
                  {phishingSimulationContent.sender}
                </p>
              </div>
              <span className="rounded-full border border-rose-300/20 bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-100">
                Urgent
              </span>
            </div>

            <p className="mt-4 text-lg font-semibold text-white">
              {phishingSimulationContent.subject}
            </p>

            <div className="mt-4 space-y-3">
              {phishingSimulationContent.bodyLines.map((line) => {
                const clickableFlag = redFlags.find((item) => {
                  if (item.id === "sender-domain") {
                    return line.includes(phishingSimulationContent.sender);
                  }
                  if (item.id === "urgency-language") {
                    return /urgent|suspended|15 minutes/i.test(line);
                  }
                  if (item.id === "password-request") {
                    return /password/i.test(line);
                  }
                  if (item.id === "fake-url") {
                    return /https:\/\//i.test(line);
                  }
                  return false;
                });

                return (
                  <button
                    key={line}
                    type="button"
                    onClick={() => clickableFlag && toggleFlag(clickableFlag.id)}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 text-left text-sm leading-6 transition",
                      clickableFlag
                        ? "border-cyan-300/30 bg-cyan-400/8 text-white hover:bg-cyan-400/14"
                        : "border-white/10 bg-slate-950/70 text-slate-300",
                    )}
                  >
                    {line}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <p className="text-sm font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
            Red flags
          </p>
          <div className="mt-4 grid gap-3">
            {redFlags.map((flag) => {
              const isActive = selectedIds.includes(flag.id);
              return (
                <button
                  key={flag.id}
                  type="button"
                  onClick={() => toggleFlag(flag.id)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left transition duration-300",
                    isActive
                      ? "border-cyan-300/40 bg-cyan-400/15 text-white shadow-[0_0_22px_rgba(34,211,238,0.12)]"
                      : "border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <span className="block text-sm font-semibold">{flag.label}</span>
                  <span className="mt-1 block text-xs text-slate-400">
                    Click to mark as suspicious
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.28)] transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              Reveal Answer
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedIds([]);
                setRevealed(false);
              }}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Reset
            </button>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-emerald-300/15 bg-emerald-400/10 p-5">
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-100 uppercase">
            Correct detections
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
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
              <span className="text-sm text-slate-300">Nothing selected yet.</span>
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-amber-300/15 bg-amber-400/10 p-5">
          <p className="text-xs font-semibold tracking-[0.2em] text-amber-100 uppercase">
            Missed indicators
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {revealed && result.missed.length ? (
              result.missed.map((item) => (
                <span
                  key={item.id}
                  className="rounded-full border border-amber-300/20 bg-slate-950/50 px-3 py-2 text-sm text-amber-100"
                >
                  {item.label}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-300">
                Reveal the answer to see the missed ones.
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
