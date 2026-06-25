import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SectionHeader, cyberButtonClasses, cyberPanelClasses } from "@/components/ui/cyber";
import { ThreatAcademyBrowser } from "@/components/threats/threat-academy-browser";
import { AnimatedSection } from "@/components/animated-section";
import { AcademyCompletionModal } from "@/components/academy/academy-completion-modal";
import { AnalyticsBeacon } from "@/components/admin/analytics/analytics-beacon";
import { threats } from "@/data/threats";
import { siteDescription, siteName } from "@/data/site";
import { getCurrentSessionUser } from "@/lib/auth/context";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Threat Academy",
  description:
    "Explore cyber threats through interactive cards, filters, and detailed explanations.",
};

export default async function ThreatAcademyPage() {
  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    redirect("/auth?returnTo=%2Fthreats");
  }

  return (
    <div className="space-y-8 pb-10 pt-10">
      <AnalyticsBeacon
        eventType="page_view"
        module="threats"
        slug="academy"
        category="Threat Academy"
        portal="user"
        dedupeKey="threats-academy"
      />
      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cyberPanelClasses("p-6 sm:p-8")}>
          <SectionHeader
            eyebrow={siteName}
            title="Threat Academy"
            description={`${siteDescription} In this academy, each threat gets a clean breakdown so users can learn what it looks like, how it works, and how to stay safe.`}
          />
        </div>
      </AnimatedSection>

      <ThreatAcademyBrowser threats={threats} />

      <AcademyCompletionModal />

      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cyberPanelClasses("p-6 sm:p-8")}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <SectionHeader
              eyebrow="AI-powered help"
              title="Want real-time scam analysis?"
              description="Paste suspicious text into the CyberSENSE AI Scam Analyzer and get a structured explanation with clear red flags and safe next steps."
              className="max-w-3xl"
            />
            <Link
              href="/threats/analyzer"
              className={cyberButtonClasses("primary", "lg")}
            >
              Open AI Analyzer
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
