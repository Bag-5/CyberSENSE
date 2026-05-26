"use client";

import { useMemo } from "react";
import type { ComponentType } from "react";

import { FakeAppPermissions } from "@/components/lab/simulations/fake-app-permissions";
import { FakeLoginDemo } from "@/components/lab/simulations/fake-login-demo";
import { PasswordVisualizer } from "@/components/lab/simulations/password-visualizer";
import { PhishingSimulation } from "@/components/lab/simulations/phishing-simulation";
import { PublicWifiVisualizer } from "@/components/lab/simulations/public-wifi-visualizer";
import { RansomwareAwareness } from "@/components/lab/simulations/ransomware-awareness";
import { cyberButtonClasses, cyberPanelClasses, SectionHeader } from "@/components/ui/cyber";
import { getAcademyAttackLabByThreatSlug } from "@/data/academy";
import type { LabSimulationId } from "@/types/lab";

type CourseAttackLabProps = {
  threatSlug: string;
  title: string;
  onComplete: () => void;
};

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
    description: "Inspect fake sender domains, urgency language, and suspicious links.",
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

export function AcademyCourseAttackLab({ threatSlug, title, onComplete }: CourseAttackLabProps) {
  const simulationId = getAcademyAttackLabByThreatSlug(threatSlug);

  const activeSimulation = useMemo(() => {
    if (!simulationId) {
      return null;
    }

    return simulationMap[simulationId] ?? null;
  }, [simulationId]);

  const ActiveComponent = activeSimulation?.component;

  return (
    <section className="space-y-5">
      <div className={cyberPanelClasses("border border-fuchsia-300/15 p-5 sm:p-6")}>
        <SectionHeader
          eyebrow="Attack lab"
          title={`${title} attack lab`}
          description="Practice the same ideas in a safe scenario, then mark the lab complete to unlock the certificate step."
        />

        <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-slate-950/65 p-4">
          <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200 uppercase">
            Course simulation
          </p>
          <h3 className="mt-2 text-xl font-black tracking-[-0.04em] text-white">
            {activeSimulation?.title ?? "Course attack lab"}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            {activeSimulation?.description ??
              "Review the attack pattern and rehearse the defensive mindset before moving on."}
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-4 sm:p-5">
          {ActiveComponent ? (
            <ActiveComponent />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              This course uses a guided attack lab review instead of a dedicated simulator.
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-300">
            Once you are comfortable with the scenario, finish the lab to unlock the certificate
            prompt.
          </p>
          <button
            type="button"
            onClick={onComplete}
            className={cyberButtonClasses("primary", "md")}
          >
            Complete attack lab
          </button>
        </div>
      </div>
    </section>
  );
}
