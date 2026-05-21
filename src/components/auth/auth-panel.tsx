"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { cyberButtonClasses, cyberPanelClasses } from "@/components/ui/cyber";
import { cn } from "@/utils/cn";

export function AuthPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("redirect") || searchParams.get("returnTo") || "/";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function requestOtp() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to request OTP.");
      }
      setStep("verify");
      setMessage(payload.message || "OTP sent.");
      setDevOtp(payload.devOtp ?? null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to request OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, otp }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to verify OTP.");
      }
      setMessage(payload.message || "Signed in.");
      router.refresh();
      router.replace(returnTo);
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "Unable to verify OTP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cyberPanelClasses("p-6 sm:p-8")}
      >
        <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
          Sign in or sign up
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
          Secure access for CyberSENSE
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
          Create your profile with a username and email, then verify a one-time
          code to unlock the full platform, progress tracking, and non-demo rankings.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
              What you get
            </p>
            <p className="mt-2 text-sm text-slate-200">
              Real saved account state, quiz progress, and ranking access.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
              Admin dashboard
            </p>
            <p className="mt-2 text-sm text-slate-200">
              Hidden for now and reserved for later expansion.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className={cyberPanelClasses("p-6 sm:p-8")}
      >
        <p className="text-sm font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
          Account panel
        </p>

        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (step === "request") {
              void requestOtp();
              return;
            }

            void verifyOtp();
          }}
        >
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">
              Username
            </span>
            <input
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-200/20"
              placeholder="Enter a username"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">
              Email
            </span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-200/20"
              placeholder="you@example.com"
            />
          </label>

          {step === "verify" ? (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-200">
                OTP
              </span>
              <input
                autoComplete="one-time-code"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                inputMode="numeric"
                maxLength={6}
                className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 px-4 py-3 text-sm tracking-[0.3em] text-white outline-none transition placeholder:tracking-normal placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-200/20"
                placeholder="123456"
              />
            </label>
          ) : null}
        {message ? (
          <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        {devOtp ? (
          <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
            Development OTP: <span className="font-semibold tracking-[0.3em]">{devOtp}</span>
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          {step === "request" ? (
            <button
              type="submit"
              disabled={loading}
              className={cn(
                cyberButtonClasses("primary", "md", "flex-1"),
                loading && "cursor-not-allowed opacity-70",
              )}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={cn(
                cyberButtonClasses("primary", "md", "flex-1"),
                loading && "cursor-not-allowed opacity-70",
              )}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          )}

          {step === "verify" ? (
            <button
              type="button"
              onClick={() => {
                setStep("request");
                setOtp("");
                setMessage(null);
                setError(null);
              }}
              className={cyberButtonClasses("ghost", "md", "flex-1")}
            >
              Edit details
            </button>
          ) : null}
        </div>
        </form>
      </motion.section>
    </div>
  );
}
