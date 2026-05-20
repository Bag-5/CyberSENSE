import type { Metadata } from "next";

import { ThreatAcademyBrowser } from "@/components/threats/threat-academy-browser";
import { AnimatedSection } from "@/components/animated-section";
import { threats } from "@/data/threats";
import { siteDescription, siteName } from "@/data/site";
import Link from "next/link";

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

      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="cyber-panel rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-sm font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
                AI-powered help
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                Want real-time scam analysis?
              </h2>
              <p className="text-sm leading-6 text-slate-300 sm:text-base">
                Paste suspicious text into the CyberSENSE AI Scam Analyzer and
                get a structured explanation with clear red flags and safe next
                steps.
              </p>
            </div>
            <Link
              href="/threats/analyzer"
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Open AI Analyzer
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
