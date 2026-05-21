"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { cyberButtonClasses, cyberPanelClasses, LoadingSkeleton, SectionHeader } from "@/components/ui/cyber";
import { cn } from "@/utils/cn";
import type { ScamAnalysis, ScamAnalysisRiskLevel } from "@/types/ai";

type AnalyzerResponse = {
  success: boolean;
  modelUsed?: string;
  analysis?: ScamAnalysis;
  error?: string;
};

const samplePrompts = [
  {
    label: "MoMo scam",
    text: "Your MoMo account is frozen. Click this link and send your PIN to unlock it.",
  },
  {
    label: "Job scam",
    text: "HR says you need to confirm your salary update by opening this zip file now.",
  },
  {
    label: "Fake login",
    text: "Sign in here to verify your bank account: https://secure-login-check.com",
  },
];

const riskClasses: Record<ScamAnalysisRiskLevel, string> = {
  "Low Risk": "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
  Suspicious: "border-amber-300/20 bg-amber-400/10 text-amber-100",
  "High Risk": "border-orange-300/20 bg-orange-400/10 text-orange-100",
  "Critical Threat": "border-rose-300/20 bg-rose-400/10 text-rose-100",
};

function AnalysisList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
      <p className="text-sm font-semibold tracking-[0.2em] text-cyan-200 uppercase">
        {title}
      </p>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
        {items.length ? (
          items.map((item) => <li key={item}>• {item}</li>)
        ) : (
          <li>No items returned.</li>
        )}
      </ul>
    </div>
  );
}

export function AiScamAnalyzer() {
  const [content, setContent] = useState(samplePrompts[0].text);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ScamAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [lastSubmitted, setLastSubmitted] = useState("");

  const hasResults = Boolean(analysis);

  const riskLabel = useMemo(() => analysis?.riskLevel ?? "Suspicious", [analysis]);

  async function handleAnalyze(input: string = content) {
    const trimmed = input.trim();
    if (trimmed.length < 12) {
      setError("Please paste a bit more suspicious content to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setModelUsed(null);
    setLastSubmitted(trimmed);

    try {
      const response = await fetch("/api/analyze-scam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: trimmed }),
      });

      const payload = (await response.json()) as AnalyzerResponse;

      if (!response.ok || !payload.success || !payload.analysis) {
        throw new Error(payload.error ?? "Analysis failed. Please try again.");
      }

      setAnalysis(payload.analysis);
      setModelUsed(payload.modelUsed ?? null);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "The AI scam analyzer could not complete the request.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={cyberPanelClasses("p-6 sm:p-8")}
        >
          <SectionHeader
            eyebrow="AI Scam Analyzer"
            title="Paste suspicious content and get a safe explanation."
            description="The analyzer looks for phishing, impersonation, urgency traps, fake links, and other scam signals. It stays educational and beginner-friendly."
          />

          <form
            className="mt-6 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void handleAnalyze();
            }}
          >
            <label className="text-sm font-semibold text-slate-200" htmlFor="scam-content">
              Paste a message, email, or link
            </label>
            <textarea
              id="scam-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={9}
              className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-200/20"
              placeholder="Paste the suspicious text here..."
            />
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                onClick={() => setContent(prompt.text)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => handleAnalyze()}
              disabled={loading}
              className={cyberButtonClasses("primary", "lg", "disabled:translate-y-0")}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
            {error ? (
              <button
                type="button"
                onClick={() => handleAnalyze(lastSubmitted || content)}
                className={cyberButtonClasses("secondary", "lg")}
              >
                Retry
              </button>
            ) : null}
          </div>

          {error ? (
            <div className="mt-6 rounded-3xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm leading-6 text-rose-100">
              {error}
            </div>
          ) : null}

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 rounded-3xl border border-cyan-300/15 bg-cyan-400/8 p-5"
            >
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-300" />
                <p className="text-sm font-semibold text-cyan-100">
                  Running AI analysis...
                </p>
              </div>
              <LoadingSkeleton className="mt-4" lines={3} />
            </motion.div>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className={cyberPanelClasses("p-6 backdrop-blur-xl")}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
                  Risk score
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {analysis ? analysis.riskLevel : "Waiting for analysis"}
                </h3>
              </div>
              <span
                className={cn(
                  "inline-flex rounded-full border px-4 py-2 text-sm font-semibold",
                  riskClasses[riskLabel],
                )}
              >
                {analysis ? analysis.riskLevel : "Suspicious"}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              {analysis
                ? analysis.summary
                : "Your result summary will appear here after the analyzer runs."}
            </p>
            {modelUsed ? (
              <p className="mt-4 text-xs tracking-[0.18em] text-slate-500 uppercase">
                Model used: {modelUsed}
              </p>
            ) : null}
          </div>

          {hasResults && analysis ? (
            <div className="grid gap-4" aria-live="polite">
              <AnalysisList title="Red flags" items={analysis.redFlags} />
              <AnalysisList
                title="Recommendations"
                items={analysis.recommendations}
              />
              <div className="rounded-3xl border border-fuchsia-300/15 bg-fuchsia-400/8 p-5">
                <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-200 uppercase">
                  Explanation
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {analysis.explanation}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 text-sm leading-6 text-slate-300">
                The analyzer will return structured cards for red flags,
                recommendations, and a clear explanation.
              </div>
              <div className="rounded-3xl border border-cyan-300/15 bg-cyan-400/8 p-5 text-sm leading-6 text-slate-300">
                Example output: suspicious link, urgent language, unknown sender,
                and a safe next step to verify through the official channel.
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
