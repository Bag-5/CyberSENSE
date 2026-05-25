"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cyberButtonClasses, cyberPanelClasses, SectionHeader } from "@/components/ui/cyber";
import type { IssuedCertificateRecord } from "@/lib/certificates/store";
import type {
  CompletedQuizChoice,
  ProgressReportKind,
} from "@/lib/reports/report-data";
import { cn } from "@/utils/cn";

type SummaryMetric = {
  label: string;
  value: string;
  detail?: string;
};

type Bullet = {
  title?: string;
  text: string;
};

type ReportCenterProps = {
  currentName: string;
  currentEmail: string;
  currentUsername: string;
  currentRole: "user" | "admin" | "superadmin";
  leaderboardRank: number | null;
  summaryMetrics: SummaryMetric[];
  completedQuizzes: CompletedQuizChoice[];
  categoryMetrics: SummaryMetric[];
  issuedCertificates: IssuedCertificateRecord[];
  strengths: Bullet[];
  recommendations: Bullet[];
  achievements: Bullet[];
  superadminPreview?: {
    progress: {
      summaryMetrics: SummaryMetric[];
      trendMetrics: SummaryMetric[];
      leaderboard: SummaryMetric[];
      highlights: Bullet[];
    };
    engagement: {
      summaryMetrics: SummaryMetric[];
      trendMetrics: SummaryMetric[];
      leaderboard: SummaryMetric[];
      highlights: Bullet[];
    };
    leaderboard: {
      summaryMetrics: SummaryMetric[];
      trendMetrics: SummaryMetric[];
      leaderboard: SummaryMetric[];
      highlights: Bullet[];
    };
  };
};

const progressKinds: Array<{
  kind: ProgressReportKind;
  label: string;
  description: string;
}> = [
  {
    kind: "progress",
    label: "Progress summary",
    description: "High-level learning progress and achievement growth.",
  },
  {
    kind: "engagement",
    label: "Engagement report",
    description: "Threat, AI, and module activity across the platform.",
  },
  {
    kind: "leaderboard",
    label: "Leaderboard summary",
    description: "Ranking snapshot and performance distribution.",
  },
];

function formatDate(value?: string) {
  if (!value) {
    return "Today";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
}

function downloadPdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function InfoCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] font-semibold tracking-[0.24em] text-slate-400 uppercase">
        {label}
      </p>
      <p className="mt-2 text-xl font-black tracking-[-0.05em] text-white">{value}</p>
      {detail ? <p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p> : null}
    </div>
  );
}

function CertificateBadge({ type }: { type: IssuedCertificateRecord["certificateType"] }) {
  const label =
    type === "quiz" ? "Quiz" : type === "milestone" ? "Milestone" : "Training";
  const className =
    type === "quiz"
      ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-100"
      : type === "milestone"
        ? "border-amber-300/20 bg-amber-400/10 text-amber-100"
        : "border-emerald-300/20 bg-emerald-400/10 text-emerald-100";

  return (
    <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", className)}>
      {label}
    </span>
  );
}

export function ReportCenter({
  currentName,
  currentEmail,
  currentUsername,
  currentRole,
  leaderboardRank,
  summaryMetrics,
  completedQuizzes,
  categoryMetrics,
  issuedCertificates,
  strengths,
  recommendations,
  achievements,
  superadminPreview,
}: ReportCenterProps) {
  const reduceMotion = useReducedMotion();
  const [notice, setNotice] = useState<{ tone: "success" | "error" | "info"; text: string } | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [certificateFilter, setCertificateFilter] = useState<"all" | "quiz" | "milestone" | "training">("all");

  const filteredCertificates = useMemo(() => {
    if (certificateFilter === "all") {
      return issuedCertificates;
    }

    return issuedCertificates.filter((item) => item.certificateType === certificateFilter);
  }, [certificateFilter, issuedCertificates]);

  async function downloadQuizReport() {
    setLoadingKey("quiz-report");
    setNotice(null);

    try {
      const response = await fetch("/api/reports/quiz", {
        method: "POST",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Could not generate the quiz report.");
      }

      const blob = await response.blob();
      const filename = `cybersense-quiz-report-${currentUsername.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
      downloadPdf(blob, filename);
      setNotice({ tone: "success", text: "Quiz report download started." });
    } catch (error) {
      setNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not generate the quiz report.",
      });
    } finally {
      setLoadingKey(null);
    }
  }

  async function downloadProgressReport(kind: ProgressReportKind) {
    setLoadingKey(`progress-${kind}`);
    setNotice(null);

    try {
      const response = await fetch("/api/reports/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kind }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Could not generate the progress report.");
      }

      const blob = await response.blob();
      const filename = `cybersense-${kind}-report.pdf`;
      downloadPdf(blob, filename);
      setNotice({ tone: "success", text: `${kind[0].toUpperCase() + kind.slice(1)} report download started.` });
    } catch (error) {
      setNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not generate the progress report.",
      });
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cyberPanelClasses(
          "border border-cyan-300/15 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 sm:p-6",
        )}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.26em] text-cyan-100 uppercase">
              Report center
            </div>
            <SectionHeader
              eyebrow="Reports and issued certificates"
              title="Generate downloadable PDFs"
              description="Superadmins can export live reports, and the issued certificate archive only shows learners who have already earned a certificate."
            />
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Signed in as {currentName}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {currentEmail}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {currentRole === "superadmin"
                  ? "Super Admin"
                  : currentRole === "admin"
                    ? "Admin"
                    : "Learner"}{" "}
                · Rank {leaderboardRank ? `#${leaderboardRank}` : "pending"}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[30rem]">
            {summaryMetrics.map((metric) => (
              <InfoCard key={metric.label} {...metric} />
            ))}
          </div>
        </div>

        {notice ? (
          <div
            className={cn(
              "mt-5 rounded-2xl border px-4 py-3 text-sm",
              notice.tone === "success"
                ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-50"
                : notice.tone === "error"
                  ? "border-rose-300/20 bg-rose-400/10 text-rose-50"
                  : "border-cyan-300/20 bg-cyan-400/10 text-cyan-50",
            )}
          >
            {notice.text}
          </div>
        ) : null}
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={cyberPanelClasses("border border-white/10 p-5 sm:p-6")}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <SectionHeader
                eyebrow="Issued certificates"
                title="Learners who already earned a certificate"
                description="This archive only shows users who have been issued a certificate, so the superadmin view stays clean and audit-friendly."
              />
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "All" },
                  { value: "quiz", label: "Quiz" },
                  { value: "milestone", label: "Milestone" },
                  { value: "training", label: "Training" },
                ].map((option) => {
                  const active = certificateFilter === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setCertificateFilter(option.value as typeof certificateFilter)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                        active
                          ? "border-cyan-300/30 bg-cyan-400/15 text-cyan-50"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10",
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {filteredCertificates.length ? (
                filteredCertificates.map((certificate) => (
                  <motion.div
                    key={certificate.id}
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    whileHover={reduceMotion ? undefined : { y: -2 }}
                    className="rounded-[1.35rem] border border-white/10 bg-slate-950/55 p-4"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-white">{certificate.fullName}</p>
                          <CertificateBadge type={certificate.certificateType} />
                        </div>
                        <p className="text-sm text-slate-400">
                          {certificate.subjectTitle} · {formatDate(certificate.issuedAt)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Issued to {certificate.username} · {certificate.email}
                        </p>
                      </div>
                      <div className="text-left lg:text-right">
                        <p className="text-xs font-semibold tracking-[0.22em] text-slate-400 uppercase">
                          Certificate file
                        </p>
                        <p className="mt-1 text-sm text-cyan-100">
                          {certificate.certificateType === "quiz"
                            ? "Quiz completion PDF"
                            : certificate.certificateType === "milestone"
                              ? "Milestone certificate PDF"
                              : "Training completion PDF"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-400">
                  No issued certificates match this filter yet.
                </div>
              )}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={cyberPanelClasses("border border-white/10 p-5 sm:p-6")}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <SectionHeader
                eyebrow="Quiz report"
                title="Download your learning report"
                description="This PDF includes your completed categories, strengths, recommendations, and achievement summary."
              />
              <button
                type="button"
                onClick={() => void downloadQuizReport()}
                disabled={loadingKey === "quiz-report"}
                className={cyberButtonClasses("secondary", "md", "justify-center")}
              >
                {loadingKey === "quiz-report" ? "Preparing report..." : "Download quiz report"}
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryMetrics.map((metric) => (
                <InfoCard key={metric.label} {...metric} />
              ))}
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold tracking-[0.2em] text-cyan-100 uppercase">
                  Completed categories
                </p>
                <div className="mt-4 grid gap-3">
                  {completedQuizzes.length ? (
                    completedQuizzes.map((quiz) => (
                      <div
                        key={quiz.slug}
                        className="rounded-2xl border border-white/10 bg-slate-950/55 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white">{quiz.title}</p>
                            <p className="mt-1 text-sm text-slate-400">
                              Completed {formatDate(quiz.completedAt)}
                            </p>
                          </div>
                          <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                            {quiz.score}%
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-400">
                      Complete a quiz to populate your downloadable report.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-400/10 p-4">
                  <p className="text-sm font-semibold tracking-[0.2em] text-cyan-100 uppercase">
                    Category performance
                  </p>
                  <div className="mt-3 grid gap-3">
                    {categoryMetrics.length ? (
                      categoryMetrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-2xl border border-white/10 bg-slate-950/35 p-3"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="font-semibold text-white">{metric.label}</p>
                            <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-100">
                              {metric.value}
                            </span>
                          </div>
                          {metric.detail ? (
                            <p className="mt-1 text-xs text-slate-400">{metric.detail}</p>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-400">
                        Category stats will appear after quiz attempts are recorded.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-emerald-300/15 bg-emerald-400/10 p-4">
                  <p className="text-sm font-semibold tracking-[0.2em] text-emerald-100 uppercase">
                    Strengths
                  </p>
                  <ul className="mt-3 space-y-3 text-sm leading-6 text-emerald-50/90">
                    {strengths.map((item) => (
                      <li
                        key={`${item.title ?? item.text}`}
                        className="rounded-2xl border border-white/10 bg-slate-950/35 p-3"
                      >
                        {item.title ? <p className="font-semibold text-white">{item.title}</p> : null}
                        <p className={cn("text-slate-300", item.title ? "mt-1" : "")}>{item.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.5rem] border border-amber-300/15 bg-amber-400/10 p-4">
                  <p className="text-sm font-semibold tracking-[0.2em] text-amber-100 uppercase">
                    Recommendations
                  </p>
                  <ul className="mt-3 space-y-3 text-sm leading-6 text-amber-50/90">
                    {recommendations.map((item) => (
                      <li
                        key={`${item.title ?? item.text}`}
                        className="rounded-2xl border border-white/10 bg-slate-950/35 p-3"
                      >
                        {item.title ? <p className="font-semibold text-white">{item.title}</p> : null}
                        <p className={cn("text-slate-300", item.title ? "mt-1" : "")}>{item.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cyberPanelClasses("border border-white/10 p-5 sm:p-6")}
          >
            <SectionHeader
              eyebrow="Achievement summary"
              title="Unlocked milestones"
              description="Your achievements are carried into the PDF so the report feels like a real training record."
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {achievements.map((item) => (
                <div
                  key={`${item.title ?? item.text}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  {item.title ? <p className="font-semibold text-white">{item.title}</p> : null}
                  <p className={cn("text-sm leading-6 text-slate-300", item.title ? "mt-1" : "")}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        </section>

        {currentRole === "superadmin" && superadminPreview ? (
          <aside className="space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={cyberPanelClasses("border border-amber-300/15 p-5 sm:p-6")}
            >
              <div className="flex items-center justify-between gap-4">
                <SectionHeader
                  eyebrow="Superadmin reports"
                  title="Operational PDF exports"
                  description="Generate live progress, engagement, and leaderboard reports directly from PostgreSQL."
                />
                <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-amber-100 uppercase">
                  Live data
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {progressKinds.map((item) => (
                  <div
                    key={item.kind}
                    className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-white">{item.label}</p>
                        <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void downloadProgressReport(item.kind)}
                        disabled={loadingKey === `progress-${item.kind}`}
                        className={cyberButtonClasses("primary", "sm")}
                      >
                        {loadingKey === `progress-${item.kind}` ? "Generating..." : "Download PDF"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className={cyberPanelClasses("border border-white/10 p-5 sm:p-6")}
            >
              <SectionHeader
                eyebrow="Preview feed"
                title="What the superadmin reports show"
                description="These cards reflect the exact live aggregates that will be written into the downloaded PDF exports."
              />

              <div className="mt-5 grid gap-4">
                <div className="rounded-[1.35rem] border border-cyan-300/15 bg-cyan-400/10 p-4">
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-cyan-100 uppercase">
                    Progress snapshot
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {superadminPreview.progress.summaryMetrics.slice(0, 4).map((metric) => (
                      <InfoCard key={metric.label} {...metric} />
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-emerald-300/15 bg-emerald-400/10 p-4">
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-emerald-100 uppercase">
                    Engagement snapshot
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {superadminPreview.engagement.summaryMetrics.slice(0, 4).map((metric) => (
                      <InfoCard key={metric.label} {...metric} />
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-fuchsia-300/15 bg-fuchsia-400/10 p-4">
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-fuchsia-100 uppercase">
                    Leaderboard snapshot
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {superadminPreview.leaderboard.leaderboard.slice(0, 4).map((metric) => (
                      <InfoCard key={metric.label} {...metric} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
