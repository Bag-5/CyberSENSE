"use client";

import { motion } from "framer-motion";

import type { RedFlagScenario } from "@/types/redflags";

type RedFlagsScenarioPreviewProps = {
  scenario: RedFlagScenario;
};

export function RedFlagsScenarioPreview({
  scenario,
}: RedFlagsScenarioPreviewProps) {
  if (scenario.surface === "login") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/80 shadow-[0_0_40px_rgba(15,23,42,0.35)]"
      >
        <div className="border-b border-white/10 bg-white/5 px-5 py-3">
          <p className="text-xs font-semibold tracking-[0.22em] text-cyan-200 uppercase">
            {scenario.contentTitle}
          </p>
          <p className="mt-1 text-xs text-slate-400">{scenario.teaser}</p>
        </div>
        <div className="space-y-4 p-5">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-xs text-slate-400">
            {scenario.contentLines[0]}
          </div>
          <div className="grid gap-3">
            {scenario.contentLines.slice(1).map((line) => (
              <div
                key={line}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                {line}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/8 px-4 py-3">
            <p className="text-sm font-semibold text-white">Sign in</p>
            <div className="mt-3 space-y-3">
              <div className="h-11 rounded-xl border border-white/10 bg-slate-950/70" />
              <div className="h-11 rounded-xl border border-white/10 bg-slate-950/70" />
              <div className="h-11 rounded-xl bg-cyan-400/90" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (scenario.surface === "momo") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/80 shadow-[0_0_40px_rgba(15,23,42,0.35)]"
      >
        <div className="border-b border-white/10 bg-fuchsia-400/10 px-5 py-3">
          <p className="text-xs font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
            {scenario.contentTitle}
          </p>
          <p className="mt-1 text-xs text-slate-400">{scenario.teaser}</p>
        </div>
        <div className="space-y-4 p-5">
          <div className="rounded-[1.5rem] border border-fuchsia-300/15 bg-gradient-to-br from-fuchsia-500/15 to-cyan-500/10 p-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-fuchsia-100 uppercase">
              MOMO ALERT
            </p>
            <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-200">
              {scenario.contentLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/80 shadow-[0_0_40px_rgba(15,23,42,0.35)]"
    >
      <div className="border-b border-white/10 bg-white/5 px-5 py-3">
        <p className="text-xs font-semibold tracking-[0.22em] text-cyan-200 uppercase">
          {scenario.contentTitle}
        </p>
        <p className="mt-1 text-xs text-slate-400">{scenario.teaser}</p>
      </div>
      <div className="space-y-4 p-5">
        <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-950 to-cyan-950/50 p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <p className="text-sm font-semibold text-white">
              {scenario.surface === "email" ? "Inbox preview" : "Message preview"}
            </p>
            <p className="text-xs text-slate-400">{scenario.teaser}</p>
          </div>
          <div className="mt-4 space-y-3">
            {scenario.contentLines.map((line) => (
              <div
                key={line}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

