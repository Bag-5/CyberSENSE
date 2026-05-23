"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cyberButtonClasses, cyberPanelClasses, SectionHeader } from "@/components/ui/cyber";
import type {
  CompletedQuizChoice,
  MilestoneChoice,
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
  milestoneChoices: MilestoneChoice[];
  categoryMetrics: SummaryMetric[];
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

const certificateKinds = [
  { value: "quiz", label: "Quiz completion" },
  { value: "milestone", label: "Awareness milestone" },
  { value: "training", label: "Training completion" },
] as const;

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

function ButtonGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition",
              active
                ? "border-cyan-300/30 bg-cyan-400/15 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.18)]"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
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

export function ReportCenter({
  currentName,
  currentEmail,
  currentUsername,
  currentRole,
  leaderboardRank,
  summaryMetrics,
  completedQuizzes,
  milestoneChoices,
  categoryMetrics,
  strengths,
  recommendations,
  achievements,
  superadminPreview,
}: ReportCenterProps) {
  const reduceMotion = useReducedMotion();
  const [fullName, setFullName] = useState("");
  const [certificateKind, setCertificateKind] = useState<(typeof certificateKinds)[number]["value"]>(
    completedQuizzes.length ? "quiz" : "training",
  );
  const [selectedQuiz, setSelectedQuiz] = useState(completedQuizzes[0]?.slug ?? "");
  const [selectedMilestone, setSelectedMilestone] = useState(milestoneChoices[0]?.key ?? "training-complete");
  const [notice, setNotice] = useState<{ tone: "success" | "error" | "info"; text: string } | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const certificatePreview = useMemo(() => {
    const selectedQuizItem = completedQuizzes.find((item) => item.slug === selectedQuiz);
    const selectedMilestoneItem = milestoneChoices.find((item) => item.key === selectedMilestone);
    const previewName = fullName.trim() || currentName;

    if (certificateKind === "quiz") {
      return {
        title: selectedQuizItem?.title ?? "Quiz completion certificate",
        subtitle: selectedQuizItem
          ? `${selectedQuizItem.score}% score · ${formatDate(selectedQuizItem.completedAt)}`
          : "Select a completed quiz to preview the certificate",
        badge: "Quiz cert",
        name: previewName,
      };
    }

    if (certificateKind === "milestone") {
      return {
        title: selectedMilestoneItem?.label ?? "Awareness milestone",
        subtitle: selectedMilestoneItem?.description ?? "Choose a milestone to continue",
        badge: "Milestone",
        name: previewName,
      };
    }

    return {
      title: "CyberSENSE Training Completion",
      subtitle: "Full awareness journey certificate",
      badge: "Training",
      name: previewName,
    };
  }, [certificateKind, completedQuizzes, currentName, fullName, selectedMilestone, selectedQuiz, milestoneChoices]);

  async function downloadCertificate() {
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setNotice({ tone: "error", text: "Please enter the full name that should appear on the certificate." });
      return;
    }

    if (certificateKind === "quiz" && !selectedQuiz) {
      setNotice({ tone: "error", text: "Choose a completed quiz before downloading a quiz certificate." });
      return;
    }

    setLoadingKey("certificate");
    setNotice(null);

    try {
      const response = await fetch("/api/reports/certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: trimmedName,
          certificateType: certificateKind,
          subjectKey: certificateKind === "quiz" ? selectedQuiz : selectedMilestone,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Could not generate the certificate.");
      }

      const blob = await response.blob();
      const filename = `cybersense-certificate-${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
      downloadPdf(blob, filename);
      setNotice({ tone: "success", text: "Certificate download started. Check your downloads folder." });
    } catch (error) {
      setNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not generate the certificate.",
      });
    } finally {
      setLoadingKey(null);
    }
  }

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
              eyebrow="Certificates and reports"
              title="Generate downloadable PDFs"
              description="Ask for the full name you want on the certificate, pick the report type, and download a polished CyberSENSE PDF with live data."
            />
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
                eyebrow="Certificate studio"
                title="Enter the certificate name first"
                description="The full name field is required before any certificate can be generated."
              />
              <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-amber-100 uppercase">
                Name required
              </span>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-200">
                    Full name
                  </span>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Enter the full name for the certificate"
                    className="cyber-input w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-200/20"
                  />
                </label>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-200">Certificate type</p>
                  <ButtonGroup
                    value={certificateKind}
                    onChange={(value) => setCertificateKind(value as (typeof certificateKinds)[number]["value"])}
                    options={certificateKinds.map((kind) => ({ value: kind.value, label: kind.label }))}
                  />
                </div>

                {certificateKind === "quiz" ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-200">Completed quiz</p>
                    {completedQuizzes.length ? (
                      <select
                        value={selectedQuiz}
                        onChange={(event) => setSelectedQuiz(event.target.value)}
                        className="cyber-input w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-200/20"
                      >
                        {completedQuizzes.map((quiz) => (
                          <option key={quiz.slug} value={quiz.slug}>
                            {quiz.title} · {quiz.score}%
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-50">
                        Complete at least one quiz before generating a quiz certificate.
                      </div>
                    )}
                  </div>
                ) : certificateKind === "milestone" ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-200">Awareness milestone</p>
                    <select
                      value={selectedMilestone}
                      onChange={(event) => setSelectedMilestone(event.target.value)}
                      className="cyber-input w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-200/20"
                    >
                      {milestoneChoices.map((milestone) => (
                        <option key={milestone.key} value={milestone.key}>
                          {milestone.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => void downloadCertificate()}
                  disabled={
                    loadingKey === "certificate" ||
                    (!fullName.trim() && certificateKind !== "training") ||
                    (certificateKind === "quiz" && !completedQuizzes.length)
                  }
                  className={cyberButtonClasses(
                    "primary",
                    "lg",
                    "w-full justify-center disabled:opacity-50",
                  )}
                >
                  {loadingKey === "certificate" ? "Generating certificate..." : "Download certificate"}
                </button>

                <p className="text-xs leading-6 text-slate-400">
                  Your name is used exactly as entered to personalize the certificate header and
                  recipient line.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  reduceMotion
                    ? { duration: 0.01 }
                    : {
                        duration: 0.8,
                        ease: "easeOut",
                      }
                }
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
                className="relative overflow-hidden rounded-[2rem] border border-amber-300/20 bg-[radial-gradient(circle_at_top_left,rgba(206,17,38,0.22),transparent_32%),radial-gradient(circle_at_top_right,rgba(0,107,63,0.18),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.95),rgba(15,23,42,0.95))] p-5 shadow-[0_0_30px_rgba(245,158,11,0.12)]"
              >
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-[-3px] rounded-[2.1rem] bg-[conic-gradient(from_0deg,rgba(206,17,38,0.9),rgba(252,209,22,0.95),rgba(0,107,63,0.9),rgba(206,17,38,0.9))] opacity-45 blur-xl"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          rotate: 360,
                        }
                  }
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 16,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }
                  }
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.08)_100%)] opacity-70"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          x: ["-10%", "10%", "-10%"],
                          opacity: [0.55, 0.85, 0.55],
                        }
                  }
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 12,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }
                  }
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute left-8 top-8 h-20 w-20 rounded-full bg-[#ce1126]/25 blur-3xl"
                  animate={reduceMotion ? undefined : { scale: [1, 1.18, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 8,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }
                  }
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute right-8 bottom-8 h-24 w-24 rounded-full bg-[#006b3f]/20 blur-3xl"
                  animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.35, 0.68, 0.35] }}
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 10,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }
                  }
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-x-10 top-10 h-24 rounded-full bg-[linear-gradient(90deg,rgba(206,17,38,0.22),rgba(252,209,22,0.22),rgba(0,107,63,0.22))] blur-2xl"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          x: ["-2%", "2%", "-2%"],
                          opacity: [0.55, 0.9, 0.55],
                        }
                  }
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 9,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }
                  }
                />
                <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.26em] text-amber-100 uppercase">
                        Certificate preview
                      </p>
                      <p className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
                        {certificatePreview.title}
                      </p>
                    </div>
                    <span className="rounded-full border border-amber-300/30 bg-amber-400/15 px-3 py-1 text-[11px] font-semibold text-amber-100">
                      {certificatePreview.badge}
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${certificatePreview.badge}-${certificatePreview.title}-${certificatePreview.name}-${certificatePreview.subtitle}`}
                      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.985 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                      exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.985 }}
                      transition={
                        reduceMotion
                          ? { duration: 0.01 }
                          : {
                              duration: 0.45,
                              ease: "easeOut",
                            }
                      }
                      className="rounded-[1.6rem] border border-white/10 bg-slate-950/55 p-5 shadow-[0_0_28px_rgba(245,158,11,0.08)]"
                    >
                      <p className="text-xs font-semibold tracking-[0.24em] text-slate-400 uppercase">
                        Presented to
                      </p>
                      <p className="mt-2 text-3xl font-black tracking-[-0.06em] text-fuchsia-100">
                        {certificatePreview.name || "Your full name"}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {certificatePreview.subtitle}
                      </p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <motion.div
                          whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
                          className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-3"
                        >
                          <p className="text-[11px] font-semibold tracking-[0.2em] text-cyan-100 uppercase">
                            Account
                          </p>
                          <p className="mt-2 text-sm font-semibold text-cyan-50">{currentUsername}</p>
                          <p className="mt-1 text-xs text-cyan-100/80">{currentEmail}</p>
                        </motion.div>
                        <motion.div
                          whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
                          className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-3"
                        >
                          <p className="text-[11px] font-semibold tracking-[0.2em] text-amber-100 uppercase">
                            Role
                          </p>
                          <p className="mt-2 text-sm font-semibold text-amber-50">
                            {currentRole === "superadmin"
                              ? "Super Admin"
                              : currentRole === "admin"
                                ? "Admin"
                                : "Learner"}
                          </p>
                          <p className="mt-1 text-xs text-amber-100/80">
                            Rank {leaderboardRank ? `#${leaderboardRank}` : "pending"}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
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
                      <li key={`${item.title ?? item.text}`} className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
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
                      <li key={`${item.title ?? item.text}`} className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
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
                <div key={`${item.title ?? item.text}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  {item.title ? <p className="font-semibold text-white">{item.title}</p> : null}
                  <p className={cn("text-sm leading-6 text-slate-300", item.title ? "mt-1" : "")}>{item.text}</p>
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
                        {loadingKey === `progress-${item.kind}`
                          ? "Generating..."
                          : "Download PDF"}
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
