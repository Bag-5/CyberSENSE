"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { SectionHeader, cyberButtonClasses, cyberPanelClasses } from "@/components/ui/cyber";
import { cn } from "@/utils/cn";
import type { AnalyticsSnapshot, AnalyticsStatusCard } from "@/lib/analytics/types";
import type { PlatformSettings } from "@/lib/superadmin/settings";

type AnalyticsDashboardProps = {
  snapshot: AnalyticsSnapshot;
  platformSettings: PlatformSettings;
};

function toneClass(tone: AnalyticsStatusCard["tone"]) {
  switch (tone) {
    case "amber":
      return "border-amber-300/20 bg-amber-400/10 text-amber-100";
    case "emerald":
      return "border-emerald-300/20 bg-emerald-400/10 text-emerald-100";
    case "rose":
      return "border-rose-300/20 bg-rose-400/10 text-rose-100";
    default:
      return "border-cyan-300/20 bg-cyan-400/10 text-cyan-100";
  }
}

function useAnimatedCounter(target: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 700;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const nextValue = Math.round(target * progress);
      setValue(nextValue);

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    }

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [target]);

  return value;
}

function AnimatedNumber({ value }: { value: number }) {
  const animated = useAnimatedCounter(value);
  return <>{animated}</>;
}

function StatCard({ label, value, detail, tone }: { label: string; value: number | string; detail: string; tone: AnalyticsStatusCard["tone"]; }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-[1.5rem] border p-5 shadow-[0_0_28px_rgba(15,23,42,0.2)]",
        toneClass(tone),
      )}
    >
      <p className="text-[11px] font-semibold tracking-[0.28em] text-slate-300 uppercase">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-white">
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{detail}</p>
    </motion.div>
  );
}

function BarChart({
  title,
  items,
  accent = "cyan",
}: {
  title: string;
  items: Array<{ label: string; value: number; detail?: string }>;
  accent?: "cyan" | "amber" | "emerald" | "rose" | "fuchsia";
}) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);
  const accentClass =
    accent === "amber"
      ? "from-amber-300 to-amber-500"
      : accent === "emerald"
        ? "from-emerald-300 to-emerald-500"
        : accent === "rose"
          ? "from-rose-300 to-rose-500"
          : accent === "fuchsia"
            ? "from-fuchsia-300 to-fuchsia-500"
            : "from-cyan-300 to-cyan-500";

  return (
    <section className={cyberPanelClasses("p-5")}>
      <p className="text-sm font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
        {title}
      </p>
      <div className="mt-5 space-y-4">
        {items.length ? (
          items.map((item) => {
            const width = `${Math.max((item.value / maxValue) * 100, 6)}%`;
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-slate-200">{item.label}</span>
                  <span className="text-slate-400">{item.detail ?? item.value}</span>
                </div>
                <div className="h-3 rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={cn(
                      "h-3 rounded-full bg-gradient-to-r shadow-[0_0_20px_rgba(34,211,238,0.12)]",
                      accentClass,
                    )}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm leading-6 text-slate-400">No data has been recorded yet.</p>
        )}
      </div>
    </section>
  );
}

function TrendChart({
  title,
  points,
}: {
  title: string;
  points: Array<{ label: string; value: number }>;
}) {
  if (!points.length) {
    return (
      <section className={cyberPanelClasses("p-5")}>
        <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
          {title}
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-400">No trend data has been recorded yet.</p>
      </section>
    );
  }

  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const width = 560;
  const height = 180;
  const padding = 24;
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
  const path = points
    .map((point, index) => {
      const x = padding + index * step;
      const y = height - padding - (point.value / maxValue) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <section className={cyberPanelClasses("p-5")}>
      <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
        {title}
      </p>
      <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-950/40">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full">
          <defs>
            <linearGradient id="trendStroke" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
            <linearGradient id="trendFill" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(34,211,238,0.24)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0)" />
            </linearGradient>
          </defs>
          <path d={`${path} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`} fill="url(#trendFill)" />
          <path d={path} fill="none" stroke="url(#trendStroke)" strokeWidth="4" strokeLinecap="round" />
          {points.map((point, index) => {
            const x = padding + index * step;
            const y = height - padding - (point.value / maxValue) * (height - padding * 2);
            return <circle key={point.label} cx={x} cy={y} r="4.5" fill="#f8fafc" />;
          })}
        </svg>
        <div className="grid grid-cols-2 gap-2 border-t border-white/10 px-4 py-3 text-xs text-slate-400 sm:grid-cols-4">
          {points.map((point) => (
            <div key={point.label} className="flex items-center justify-between gap-2">
              <span>{point.label}</span>
              <span className="text-slate-200">{point.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DonutChart({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; value: number }>;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  const colors = ["#22d3ee", "#d946ef", "#f59e0b", "#10b981", "#fb7185", "#818cf8"];
  if (!items.length) {
    return (
      <section className={cyberPanelClasses("p-5")}>
        <p className="text-sm font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
          {title}
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-400">No pie chart data has been recorded yet.</p>
      </section>
    );
  }

  const gradient = items
    .reduce(
      (segments, item, index) => {
        const start = segments.cursor;
        const fraction = (item.value / total) * 100;
        const end = start + fraction;
        return {
          cursor: end,
          segments: [...segments.segments, `${colors[index % colors.length]} ${start}% ${end}%`],
        };
      },
      { cursor: 0, segments: [] as string[] },
    )
    .segments.join(", ");

  return (
    <section className={cyberPanelClasses("p-5")}>
      <p className="text-sm font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
        {title}
      </p>
      <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row">
        <div
          className="flex h-44 w-44 items-center justify-center rounded-full border border-white/10"
          style={{
            background: `conic-gradient(${gradient})`,
          }}
        >
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-white/10 bg-slate-950/95 text-center">
            <p className="text-xs tracking-[0.2em] text-slate-400 uppercase">Total</p>
            <p className="mt-1 text-2xl font-black text-white">{total}</p>
          </div>
        </div>
        <div className="grid flex-1 gap-3">
          {items.length ? (
            items.map((item, index) => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm text-slate-200">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-white">{item.value}</span>
              </div>
            ))
          ) : (
            <p className="text-sm leading-6 text-slate-400">No risk data recorded yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function FeedList({
  title,
  items,
}: {
  title: string;
  items: AnalyticsStatusCard[];
}) {
  return (
    <section className={cyberPanelClasses("p-5")}>
      <p className="text-sm font-semibold tracking-[0.24em] text-amber-100 uppercase">
        {title}
      </p>
      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={`${item.label}-${item.value}`} className={cn("rounded-2xl border p-4", toneClass(item.tone))}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="mt-1 text-xs tracking-[0.18em] text-slate-300 uppercase">{item.value}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-slate-950/40 px-2.5 py-1 text-[11px] font-semibold text-slate-200">
                  Live
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
            </div>
          ))
        ) : (
          <p className="text-sm leading-6 text-slate-400">Nothing to show yet.</p>
        )}
      </div>
    </section>
  );
}

export function AnalyticsDashboard({ snapshot, platformSettings }: AnalyticsDashboardProps) {
  const moduleCount = Object.values(platformSettings.modules).filter(Boolean).length;
  const statusCards: AnalyticsStatusCard[] = [
    {
      label: "Maintenance",
      value: platformSettings.maintenanceMode ? "On" : "Off",
      detail: platformSettings.maintenanceMode
        ? "Public shell is throttled by superadmin control."
        : "Public shell is available to learners.",
      tone: platformSettings.maintenanceMode ? "rose" : "emerald",
    },
    {
      label: "Enabled modules",
      value: `${moduleCount}/6`,
      detail: "Current feature flags from the control plane.",
      tone: "cyan",
    },
    {
      label: "Announcement",
      value: platformSettings.announcement ? "Custom" : "Default",
      detail: "Homepage notice buffer is live from Postgres.",
      tone: "amber",
    },
    {
      label: "Last update",
      value: new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(platformSettings.updatedAt)),
      detail: "Settings heartbeat from the control plane.",
      tone: "emerald",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cyberPanelClasses("border border-amber-300/15 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8")}
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.28em] text-cyan-100 uppercase">
              Analytics / control room
            </div>
            <SectionHeader
              eyebrow="CyberSENSE insights"
              title="Superadmin analytics dashboard"
              description="Track learning momentum, scam analysis demand, threat engagement, and system health using real platform data from PostgreSQL."
            />
            <div className="flex flex-wrap gap-3">
              <Link href="/superadmin" className={cyberButtonClasses("secondary", "sm")}>
                Back to control room
              </Link>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100">
                Live data
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[28rem]">
            {statusCards.map((card) => (
              <StatCard
                key={card.label}
                label={card.label}
                value={card.value}
                detail={card.detail}
                tone={card.tone}
              />
            ))}
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={snapshot.overview.totalUsers} detail="Signed-in learner accounts in Postgres." tone="cyan" />
        <StatCard label="Active sessions" value={snapshot.overview.activeSessions} detail="Users seen recently in the session table." tone="emerald" />
        <StatCard label="Quiz completions" value={snapshot.overview.totalQuizCompletions} detail="Sum of completed quiz records." tone="amber" />
        <StatCard label="Average quiz score" value={snapshot.overview.averageQuizScore} detail="Mean of stored quiz scores across users." tone="rose" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <TrendChart title="Engagement trend" points={snapshot.overview.engagementTrend} />
        <DonutChart title="AI risk distribution" items={snapshot.ai.riskDistribution} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <BarChart
          title="Most viewed threat categories"
          items={snapshot.overview.mostViewedThreatCategories}
          accent="cyan"
        />
        <BarChart
          title="Threat module engagement"
          items={snapshot.threats.moduleEngagement}
          accent="fuchsia"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <BarChart
          title="Quiz category performance"
          items={snapshot.quizzes.categoryPerformance}
          accent="emerald"
        />
        <BarChart
          title="Completion bands"
          items={snapshot.overview.progressionBands}
          accent="amber"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <BarChart
          title="Most failed quiz categories"
          items={snapshot.quizzes.mostFailedCategories}
          accent="rose"
        />
        <BarChart
          title="Learning progression"
          items={snapshot.progression.completionLevels}
          accent="cyan"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <BarChart
          title="Hardest quiz questions"
          items={snapshot.quizzes.hardestQuestions}
          accent="rose"
        />
        <BarChart
          title="Top users"
          items={snapshot.progression.topUsers}
          accent="fuchsia"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <FeedList title="AI activity feed" items={snapshot.ai.recentActivity} />
        <TrendChart title="Quiz improvement trend" points={snapshot.quizzes.improvementTrend} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <BarChart title="AI scam types" items={snapshot.ai.commonScamTypes} accent="amber" />
        <BarChart title="Flagged content patterns" items={snapshot.ai.flaggedPatterns} accent="cyan" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <BarChart title="Simulation usage" items={snapshot.threats.simulationUsage} accent="emerald" />
        <BarChart title="Achievement unlocks" items={snapshot.progression.achievementCounts} accent="fuchsia" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <BarChart title="AI usage events" items={snapshot.ai.aiUsage} accent="cyan" />
        <BarChart title="Streak distribution" items={snapshot.progression.streakDistribution} accent="amber" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <FeedList title="System health" items={snapshot.system} />
        <div className={cyberPanelClasses("p-5")}>
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
            Snapshot metadata
          </p>
          <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-slate-950/55 p-5">
            <p className="text-sm leading-6 text-slate-300">
              This dashboard is built from live PostgreSQL data and analytics event tables.
              As users move through Threat Academy, AI analysis, lab simulations, and quizzes,
              the graphs update from tracked events rather than fixed demo values.
            </p>
            <p className="mt-4 text-xs tracking-[0.2em] text-slate-500 uppercase">
              Generated at {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(snapshot.generatedAt))}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
