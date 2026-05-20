import type { Metadata } from "next";

import { AnimatedSection } from "@/components/animated-section";
import { AiScamAnalyzer } from "@/components/threats/ai-scam-analyzer";
import { siteName } from "@/data/site";

export const metadata: Metadata = {
  title: "AI Scam Analyzer",
  description:
    "Paste suspicious content into CyberSENSE and get a safe, structured AI explanation with OpenRouter.",
};

export default function AiAnalyzerPage() {
  return (
    <div className="space-y-8 pb-10 pt-10">
      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="cyber-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
            {siteName}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
            AI Scam Analyzer
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Paste a suspicious message, email, link, or fake offer and let the
            CyberSENSE AI explain what looks dangerous, why it matters, and how
            to stay safe.
          </p>
        </div>
      </AnimatedSection>

      <AiScamAnalyzer />
    </div>
  );
}

