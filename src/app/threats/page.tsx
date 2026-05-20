import type { Metadata } from "next";

import { ThreatAcademyBrowser } from "@/components/threats/threat-academy-browser";
import { AnimatedSection } from "@/components/animated-section";
import { threats } from "@/data/threats";
import { siteDescription, siteName } from "@/data/site";

export const metadata: Metadata = {
  title: "Threat Academy",
  description:
    "Explore cyber threats through interactive cards, filters, and detailed explanations.",
};

export default function ThreatAcademyPage() {
  return (
    <div className="space-y-8 pb-10 pt-10">
      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="cyber-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
            {siteName}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
            Threat Academy
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            {siteDescription} In this academy, each threat gets a clean breakdown
            so users can learn what it looks like, how it works, and how to stay
            safe.
          </p>
        </div>
      </AnimatedSection>

      <ThreatAcademyBrowser threats={threats} />
    </div>
  );
}

