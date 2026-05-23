"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { cyberButtonClasses, cyberPanelClasses, SectionHeader } from "@/components/ui/cyber";
import type { PublicSessionUser } from "@/lib/auth/types";
import {
  buildSuperAdminGreeting,
  superAdminAuditTrail,
  superAdminCallouts,
  superAdminMetrics,
  superAdminRoster,
  superAdminSections,
  type SuperAdminSectionKey,
} from "@/data/superadmin";
import { PlatformControls } from "@/components/superadmin/platform-controls";
import type { PlatformSettings } from "@/lib/superadmin/settings";
import { cn } from "@/utils/cn";

type SuperAdminDashboardProps = {
  user: PublicSessionUser;
  initialSettings: PlatformSettings;
};

const sectionOrder: SuperAdminSectionKey[] = ["overview", "access", "content", "security"];

function metricToneClass(tone: string) {
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

export function SuperAdminDashboard({ user, initialSettings }: SuperAdminDashboardProps) {
  const greeting = buildSuperAdminGreeting(user);
  const [activeSection, setActiveSection] = useState<SuperAdminSectionKey>("overview");

  const activeSectionData = useMemo(() => superAdminSections[activeSection], [activeSection]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className={cyberPanelClasses(
            "overflow-hidden border border-amber-300/15 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 sm:p-8",
          )}
        >
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-amber-100 uppercase">
                Super Admin Control Room
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
                  {greeting.title}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  {greeting.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveSection("access")}
                  className={cyberButtonClasses("primary", "md")}
                >
                  Review access
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("security")}
                  className={cyberButtonClasses("secondary", "md")}
                >
                  Inspect security
                </button>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-300">
                {[
                  "OTP protected",
                  "Email allowlisted",
                  "Audit-first",
                  "Ghana-tuned palette",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className={cyberPanelClasses("space-y-4 border border-white/10 bg-black/20 p-5")}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.28em] text-amber-100 uppercase">
                    Current seat
                  </p>
                  <p className="mt-2 text-2xl font-bold text-white">{user.username}</p>
                  <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                </div>
                <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-right">
                  <p className="text-xs font-semibold tracking-[0.24em] text-amber-100 uppercase">
                    Role
                  </p>
                  <p className="mt-1 text-sm font-semibold text-amber-50">Super Admin</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {superAdminRoster.map((entry) => (
                  <div
                    key={`${entry.email}-${entry.name}`}
                    className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{entry.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{entry.email}</p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          entry.status === "Active"
                            ? "bg-emerald-400/15 text-emerald-100"
                            : "bg-white/5 text-slate-300",
                        )}
                      >
                        {entry.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{entry.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {superAdminMetrics.map((metric) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={cyberPanelClasses(
                cn("border p-5 shadow-[0_0_30px_rgba(15,23,42,0.35)]", metricToneClass(metric.tone)),
              )}
            >
              <p className="text-sm font-medium text-slate-300">{metric.label}</p>
              <p className="mt-3 text-3xl font-black tracking-[-0.06em]">{metric.value}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{metric.detail}</p>
            </motion.div>
          ))}
        </section>

        <section className={cyberPanelClasses("p-5 sm:p-6")}>
          <div className="flex flex-wrap gap-2">
            {sectionOrder.map((sectionKey) => {
              const section = superAdminSections[sectionKey];
              const isActive = activeSection === sectionKey;

              return (
                <button
                  key={sectionKey}
                  type="button"
                  onClick={() => setActiveSection(sectionKey)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/20"
                      : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {section.title}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <SectionHeader
                eyebrow="Active panel"
                title={activeSectionData.title}
                description={activeSectionData.description}
              />

              <div className="grid gap-4">
                {activeSectionData.actionCards.map((card) => (
                  <motion.article
                    key={card.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "rounded-[1.5rem] border border-white/10 bg-gradient-to-br p-5",
                      card.accent,
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{card.description}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1 text-[11px] font-semibold text-slate-200">
                        {card.status}
                      </span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold tracking-[0.24em] text-amber-100 uppercase">
                  Audit trail
                </p>
                <div className="mt-4 space-y-4">
                  {superAdminAuditTrail.map((entry) => (
                    <div
                      key={entry.title}
                      className="rounded-[1.2rem] border border-white/10 bg-slate-950/50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white">{entry.title}</p>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                            entry.severity === "High"
                              ? "bg-rose-400/15 text-rose-100"
                              : entry.severity === "Medium"
                                ? "bg-amber-400/15 text-amber-100"
                                : "bg-emerald-400/15 text-emerald-100",
                          )}
                        >
                          {entry.severity}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{entry.detail}</p>
                      <p className="mt-3 text-xs tracking-[0.18em] text-slate-500 uppercase">
                        {entry.when}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-emerald-300/15 bg-emerald-400/10 p-5">
                <p className="text-sm font-semibold tracking-[0.24em] text-emerald-100 uppercase">
                  Guardrails
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-emerald-50/90">
                  {superAdminCallouts.map((callout) => (
                    <li key={callout} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-300" />
                      <span>{callout}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <PlatformControls initialSettings={initialSettings} />
      </div>
    </div>
  );
}
