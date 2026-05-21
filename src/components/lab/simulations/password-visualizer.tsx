"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

function scorePassword(password: string) {
  let score = 0;
  const factors: string[] = [];

  if (password.length >= 12) {
    score += 25;
  } else if (password.length >= 8) {
    score += 15;
  } else if (password.length > 0) {
    score += 5;
    factors.push("Too short for comfort");
  }

  if (/[A-Z]/.test(password)) score += 15;
  else factors.push("Missing uppercase letters");

  if (/[a-z]/.test(password)) score += 10;
  else factors.push("Missing lowercase letters");

  if (/[0-9]/.test(password)) score += 15;
  else factors.push("No numbers");

  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  else factors.push("No special characters");

  if (/(1234|password|qwerty|letmein|admin)/i.test(password)) {
    score -= 25;
    factors.push("Common dictionary pattern");
  }

  const reuseRisk = password.length > 0 && password.length < 14 ? "Higher" : "Lower";
  const bruteForceEstimate =
    score >= 70 ? "Very slow" : score >= 45 ? "Moderate" : "Fast";

  return {
    score: Math.max(0, Math.min(100, score)),
    factors,
    reuseRisk,
    bruteForceEstimate,
  };
}

export function PasswordVisualizer() {
  const [password, setPassword] = useState("");

  const analysis = useMemo(() => scorePassword(password), [password]);

  const feedback =
    analysis.score >= 80
      ? "Nice. This one go make hacker sweat small."
      : analysis.score >= 55
      ? "Decent, but there is still room for stronger defense."
      : "Hacker go crack this password before waakye finish 😭";

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-5"
        >
          <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200 uppercase">
            Password strength visualizer
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Everything stays local. No password is stored or sent anywhere.
          </p>

          <label className="mt-5 block text-sm font-semibold text-slate-200" htmlFor="lab-password">
            Enter a sample password
          </label>
          <input
            id="lab-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-3 w-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-200/20"
            placeholder="Type a sample password..."
          />

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Strength score</p>
              <p className="text-sm font-semibold text-cyan-100">{analysis.score}/100</p>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-900">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-cyan-300"
                initial={{ width: 0 }}
                animate={{ width: `${analysis.score}%` }}
                transition={{ duration: 0.45 }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <p className="text-sm font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
            Risk insights
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-rose-300/15 bg-rose-400/10 p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-rose-100 uppercase">
                Brute force
              </p>
              <p className="mt-2 text-sm text-slate-200">{analysis.bruteForceEstimate}</p>
            </div>
            <div className="rounded-2xl border border-amber-300/15 bg-amber-400/10 p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-amber-100 uppercase">
                Reuse risk
              </p>
              <p className="mt-2 text-sm text-slate-200">{analysis.reuseRisk}</p>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-cyan-300/15 bg-cyan-400/8 p-4">
            <p className="text-sm font-semibold text-white">{feedback}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Strong passwords are long, unique, and hard to guess. Avoid names,
              dates, and common keyboard patterns.
            </p>
          </div>

          <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-200 uppercase">
              Weakness factors
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
              {analysis.factors.length ? (
                analysis.factors.map((factor) => <li key={factor}>• {factor}</li>)
              ) : (
                <li>Looks balanced so far.</li>
              )}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

