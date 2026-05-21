"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { fakeLoginDemo } from "@/data/simulations";
import { cn } from "@/utils/cn";

export function FakeLoginDemo() {
  const [mode, setMode] = useState<"fake" | "legit">("fake");

  const isFake = mode === "fake";

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200 uppercase">
                Fake login page demo
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Compare spoofed branding against safe indicators.
              </p>
            </div>
            <div className="rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
              Visual deception
            </div>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-950 to-cyan-950/40 p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-lg">
                  🛡️
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {isFake ? "CyberSENSE Secure Portal" : "CyberSENSE Official Portal"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {isFake ? fakeLoginDemo.fakeUrl : fakeLoginDemo.legitimateUrl}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold",
                  isFake
                    ? "border-rose-300/20 bg-rose-400/10 text-rose-100"
                    : "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
                )}
              >
                {isFake ? "Spoofed" : "Legitimate"}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div className="h-11 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-400">
                Email address
              </div>
              <div className="h-11 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-400">
                Password
              </div>
              <div className="rounded-2xl bg-cyan-400/90 px-4 py-3 text-center text-sm font-semibold text-slate-950">
                Sign in
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <p className="text-sm font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
            Compare indicators
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("fake")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                isFake
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-white/10 bg-white/5 text-slate-300",
              )}
            >
              Fake
            </button>
            <button
              type="button"
              onClick={() => setMode("legit")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                !isFake
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-white/10 bg-white/5 text-slate-300",
              )}
            >
              Legitimate
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {(isFake ? fakeLoginDemo.fakeBranding : fakeLoginDemo.realBranding).map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </div>
              ),
            )}
          </div>

          <div className="mt-5 rounded-3xl border border-cyan-300/15 bg-cyan-400/8 p-4 text-sm leading-6 text-slate-300">
            Educate users to compare the URL, logo quality, and support path
            before typing credentials.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

