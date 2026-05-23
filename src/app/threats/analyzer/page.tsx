import type { Metadata } from "next";

import { AnimatedSection } from "@/components/animated-section";
import { AiScamAnalyzer } from "@/components/threats/ai-scam-analyzer";
import { SectionHeader, cyberPanelClasses } from "@/components/ui/cyber";
import { AnalyticsBeacon } from "@/components/admin/analytics/analytics-beacon";
import { siteName } from "@/data/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Scam Analyzer",
  description:
    "Paste suspicious content into CyberSENSE and get a safe, structured AI explanation with OpenRouter.",
};

export default function AiAnalyzerPage() {
  return (
    <div className="space-y-8 pb-10 pt-10">
      <AnalyticsBeacon
        eventType="page_view"
        module="analyzer"
        slug="scam-analyzer"
        category="AI Scam Analyzer"
        portal="user"
        dedupeKey="ai-scam-analyzer"
      />
      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cyberPanelClasses("p-6 sm:p-8")}>
          <SectionHeader
            eyebrow={siteName}
            title="AI Scam Analyzer"
            description="Paste a suspicious message, email, link, or fake offer and let the CyberSENSE AI explain what looks dangerous, why it matters, and how to stay safe."
          />
        </div>
      </AnimatedSection>

      <AiScamAnalyzer />
    </div>
  );
}
