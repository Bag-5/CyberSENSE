"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { cyberButtonClasses, cyberPanelClasses, SectionHeader } from "@/components/ui/cyber";
import type { PublicSessionUser } from "@/lib/auth/types";
import {
  buildSuperAdminGreeting,
  superAdminAuditTrail,
  superAdminCallouts,
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

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function SuperAdminDashboard({ user, initialSettings }: SuperAdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<SuperAdminSectionKey>("overview");

  const activeSectionData = useMemo(() => superAdminSections[activeSection], [activeSection]);
  const greeting = buildSuperAdminGreeting(user);
  const enabledModuleCount = useMemo(
    () => Object.values(initialSettings.modules).filter(Boolean).length,
    [initialSettings.modules],
  );
  const consoleStats = useMemo(
    () => [
      {
        label: "Mode",
        value: initialSettings.maintenanceMode ? "Maintenance" : "Live",
        detail: initialSettings.maintenanceMode
          ? "Public shell throttled"
          : "Public shell available",
        tone: initialSettings.maintenanceMode ? "rose" : "emerald",
      },
      {
        label: "Modules",
        value: `${enabledModuleCount}/6`,
        detail: "Feature visibility toggles",
        tone: "cyan",
      },
      {
        label: "Banner",
        value: initialSettings.announcement.length > 24 ? "Custom" : "Default",
        detail: "Homepage notice buffer",
        tone: "amber",
      },
      {
        label: "Updated",
        value: formatTimestamp(initialSettings.updatedAt),
        detail: "Last settings write",
        tone: "emerald",
      },
    ],
    [enabledModuleCount, initialSettings],
  );

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cyberPanelClasses(
          "border border-amber-300/15 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 sm:p-6",
        )}
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.3em] text-amber-100 uppercase">
              Control plane / privileged
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">
                Superadmin operations console
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                {greeting.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-300">
              {[
                "OTP protected",
                "Email allowlisted",
                "Audit first",
                "Cross-device aware",
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

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[26rem]">
            {consoleStats.map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "rounded-[1.35rem] border p-4 shadow-[0_0_20px_rgba(15,23,42,0.25)]",
                  metricToneClass(stat.tone),
                )}
              >
                <p className="text-[11px] font-semibold tracking-[0.28em] text-slate-300 uppercase">
                  {stat.label}
                </p>
                <p className="mt-2 text-xl font-black tracking-[-0.05em] text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-300">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[0.32fr_0.68fr]">
        <aside className="space-y-6">
          <motion.section
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className={cyberPanelClasses("border border-white/10 p-5")}
          >
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-100 uppercase">
              Seat status
            </p>
            <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-slate-950/55 p-4">
              <p className="text-xs font-semibold tracking-[0.24em] text-slate-400 uppercase">
                Current operator
              </p>
              <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">
                {user.username}
              </p>
              <p className="mt-1 text-sm text-slate-400">{user.email}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-100">
                  Super Admin
                </span>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                  Online
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <button
                type="button"
                onClick={() => setActiveSection("access")}
                className={cyberButtonClasses("primary", "sm", "w-full")}
              >
                Jump to access
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("security")}
                className={cyberButtonClasses("secondary", "sm", "w-full")}
              >
                Jump to security
              </button>
              <Link
                href="/superadmin/analytics"
                className={cyberButtonClasses("ghost", "sm", "w-full")}
              >
                Open analytics
              </Link>
              <Link href="/reports" className={cyberButtonClasses("ghost", "sm", "w-full")}>
                Open reports
              </Link>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className={cyberPanelClasses("border border-white/10 p-5")}
          >
            <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
              Command rail
            </p>
            <div className="mt-4 space-y-2">
              {sectionOrder.map((sectionKey) => {
                const section = superAdminSections[sectionKey];
                const isActive = activeSection === sectionKey;

                return (
                  <button
                    key={sectionKey}
                    type="button"
                    onClick={() => setActiveSection(sectionKey)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-[1.1rem] border px-4 py-3 text-left transition",
                      isActive
                        ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-50"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <span className="font-semibold">{section.title}</span>
                    <span className="text-[11px] tracking-[0.24em] uppercase">
                      {isActive ? "Active" : "Open"}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={cyberPanelClasses("border border-white/10 p-5")}
          >
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-100 uppercase">
              Trusted seats
            </p>
            <div className="mt-4 space-y-3">
              {superAdminRoster.map((entry) => (
                <div
                  key={`${entry.email}-${entry.name}`}
                  className="rounded-[1.2rem] border border-white/10 bg-slate-950/55 p-4"
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
          </motion.section>
        </aside>

        <section className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={cyberPanelClasses("border border-white/10 p-5 sm:p-6")}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <SectionHeader
                eyebrow="Active panel"
                title={activeSectionData.title}
                description={activeSectionData.description}
              />
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-amber-100 uppercase">
                  Live
                </span>
                <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-cyan-100 uppercase">
                  Audit ready
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {activeSectionData.actionCards.map((card) => (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-[1.35rem] border border-white/10 bg-gradient-to-br p-5",
                    card.accent,
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-white">{card.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{card.description}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1 text-[11px] font-semibold text-slate-200">
                      {card.status}
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={cyberPanelClasses("border border-white/10 p-5")}
            >
              <p className="text-sm font-semibold tracking-[0.24em] text-amber-100 uppercase">
                Audit trail
              </p>
              <div className="mt-4 space-y-4">
                {superAdminAuditTrail.map((entry) => (
                  <div
                    key={entry.title}
                    className="rounded-[1.2rem] border border-white/10 bg-slate-950/55 p-4"
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className={cyberPanelClasses("border border-emerald-300/15 bg-emerald-400/10 p-5")}
            >
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
              <div className="mt-5 rounded-[1.2rem] border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs font-semibold tracking-[0.24em] text-slate-300 uppercase">
                  Console note
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Keep the public shell separate. Use this view for approvals, visibility toggles,
                  and incident-grade oversight only.
                </p>
              </div>
            </motion.div>
          </section>

          <PlatformControls initialSettings={initialSettings} />
        </section>
      </div>
    </div>
  );
}
