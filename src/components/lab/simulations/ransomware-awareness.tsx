"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { ransomwareDemo } from "@/data/simulations";
import { cn } from "@/utils/cn";

export function RansomwareAwareness() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phase = ransomwareDemo.phases[phaseIndex];

  const fileState = useMemo(() => {
    if (phaseIndex < 2) return "safe";
    if (phaseIndex === 2) return "locked";
    return "recovering";
  }, [phaseIndex]);

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-5"
        >
          <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200 uppercase">
            Ransomware awareness demo
          </p>
          <p className="mt-2 text-sm text-slate-400">
            No files are encrypted. This is only a visual lesson about how the
            attack can progress.
          </p>

          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">{phase}</p>
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold uppercase",
                  fileState === "safe"
                    ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
                    : fileState === "locked"
                    ? "border-rose-300/20 bg-rose-400/10 text-rose-100"
                    : "border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
                )}
              >
                {fileState}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ransomwareDemo.files.map((file) => (
                <div
                  key={file}
                  className={cn(
                    "rounded-2xl border px-4 py-4 text-sm transition",
                    fileState === "safe"
                      ? "border-white/10 bg-slate-950/60 text-slate-300"
                      : fileState === "locked"
                      ? "border-rose-300/20 bg-rose-400/10 text-rose-100"
                      : "border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
                  )}
                >
                  {file}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <p className="text-sm font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
            Attack progression
          </p>
          <div className="mt-4 space-y-3">
            {ransomwareDemo.phases.map((item, index) => (
              <button
                key={item}
                type="button"
                onClick={() => setPhaseIndex(index)}
                className={cn(
                  "w-full rounded-2xl border px-4 py-3 text-left text-sm transition",
                  phaseIndex === index
                    ? "border-cyan-300/40 bg-cyan-400/15 text-white"
                    : "border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/10 hover:text-white",
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-3xl border border-cyan-300/15 bg-cyan-400/8 p-4 text-sm leading-6 text-slate-300">
            Prevention wins the day: keep backups, update regularly, and treat
            unknown attachments carefully.
          </div>

          <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-200 uppercase">
              Prevention techniques
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
              {ransomwareDemo.preventionTips.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

