"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";

import { labSimulationCards } from "@/data/simulations";
import type { LabSimulationId } from "@/types/lab";
import { cn } from "@/utils/cn";
import { PhishingSimulation } from "@/components/lab/simulations/phishing-simulation";
import { FakeLoginDemo } from "@/components/lab/simulations/fake-login-demo";
import { PasswordVisualizer } from "@/components/lab/simulations/password-visualizer";
import { RansomwareAwareness } from "@/components/lab/simulations/ransomware-awareness";
import { PublicWifiVisualizer } from "@/components/lab/simulations/public-wifi-visualizer";
import { FakeAppPermissions } from "@/components/lab/simulations/fake-app-permissions";
import { cyberPanelClasses } from "@/components/ui/cyber";

const simulationMap: Record<
  LabSimulationId,
  {
    title: string;
    description: string;
    component: ComponentType;
  }
> = {
  phishing: {
    title: "Phishing Simulation",
    description: "Spot fake sender domains, urgency language, and suspicious links.",
    component: () => <PhishingSimulation />,
  },
  "fake-login": {
    title: "Fake Login Page Demo",
    description: "Compare spoofed branding and legitimate login cues.",
    component: () => <FakeLoginDemo />,
  },
  "password-cracking": {
    title: "Password Cracking Visualizer",
    description: "See how password length, patterns, and reuse affect risk.",
    component: () => <PasswordVisualizer />,
  },
  "ransomware-awareness": {
    title: "Ransomware Awareness Demo",
    description: "Visualize how file lockdowns happen and how backups help.",
    component: () => <RansomwareAwareness />,
  },
  "public-wifi": {
    title: "Public Wi-Fi MITM Visualization",
    description: "Compare risky traffic flow with safer encrypted paths.",
    component: () => <PublicWifiVisualizer />,
  },
  "app-permissions": {
    title: "Fake App Permission Abuse Demo",
    description: "Inspect how suspicious apps request far too much access.",
    component: () => <FakeAppPermissions />,
  },
};

export function LabDashboard() {
  const [activeId, setActiveId] = useState<LabSimulationId>("phishing");

  const activeSimulation = simulationMap[activeId];

  const metrics = useMemo(
    () => [
      { label: "Simulations online", value: labSimulationCards.length },
      { label: "Safe mode", value: "Enabled" },
      { label: "Dangerous actions", value: "Blocked" },
    ],
    [],
  );

  const ActiveComponent = activeSimulation.component;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <section className="space-y-6">
          <div className={cyberPanelClasses("p-5 sm:p-6")}>
            <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
              Lab console
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className={cyberPanelClasses("p-4")}
                >
                  <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {labSimulationCards.map((simulation) => {
              const isActive = simulation.id === activeId;
              return (
                <button
                  key={simulation.id}
                  type="button"
                  onClick={() => setActiveId(simulation.id)}
                  className={cn(
                    "group w-full rounded-[1.75rem] border p-5 text-left transition duration-300",
                    isActive
                      ? "border-cyan-300/35 bg-cyan-400/10 shadow-[0_0_28px_rgba(34,211,238,0.12)]"
                      : "border-white/10 bg-white/5 hover:-translate-y-0.5 hover:border-fuchsia-300/25 hover:bg-white/10",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-lg">
                        {simulation.icon}
                      </span>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-fuchsia-200 uppercase">
                          {simulation.accent}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-white">
                          {simulation.title}
                        </h3>
                      </div>
                    </div>
                    <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-400">
                      {simulation.time}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {simulation.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className={cyberPanelClasses("p-5 sm:p-6")}>
          <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
                Active simulation
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                {activeSimulation.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {activeSimulation.description}
              </p>
            </div>
            <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              Educational demo only
            </div>
          </div>

          <div className="mt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
