import Link from "next/link";

import { AnalyticsBeacon } from "@/components/admin/analytics/analytics-beacon";
import { AcademyCourseQuizSection } from "@/components/academy/course-quiz-section";
import { ThreatSection } from "@/components/threats/threat-section";
import { ThreatRelatedThreats } from "@/components/threats/threat-related-threats";
import { threatLevels } from "@/data/threats";
import type { ThreatDetail } from "@/types/site";
import { cyberButtonClasses, cyberPanelClasses } from "@/components/ui/cyber";
import { cn } from "@/utils/cn";

type ThreatDetailViewProps = {
  threat: ThreatDetail;
  relatedThreats: ThreatDetail[];
};

function ThreatList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm leading-6 text-slate-300"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ThreatDetailView({ threat, relatedThreats }: ThreatDetailViewProps) {
  return (
    <div className="space-y-8 pb-10">
      <AnalyticsBeacon
        eventType="threat_viewed"
        module="threats"
        slug={threat.slug}
        category={threat.category}
        portal="user"
        dedupeKey={`threat-${threat.slug}`}
        metadata={{
          severity: threat.severity,
        }}
      />
      <section className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className={cyberPanelClasses("relative overflow-hidden p-6 sm:p-8")}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(217,70,239,0.14),transparent_30%)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-slate-950/70 text-2xl">
                  {threat.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
                    {threat.category}
                  </p>
                  <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
                    {threat.name}
                  </h1>
                </div>
              </div>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">
                {threat.intro}
              </p>
            </div>

            <div className={cyberPanelClasses("p-5")}>
              <p className="text-xs font-semibold tracking-[0.24em] text-cyan-200 uppercase">
                Severity
              </p>
              <div
                className={cn(
                  "mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em]",
                  threatLevels[threat.severity],
                )}
              >
                {threat.severity}
              </div>
              <p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">
                {threat.summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ThreatSection
        eyebrow="How attackers trick people"
        title="How attackers trick people"
        description="The pattern is almost always the same: build trust, create pressure, and move the target toward a quick mistake."
      >
        <ThreatList items={threat.attackTricks} />
      </ThreatSection>

      <ThreatSection
        eyebrow="Warning signs"
        title="Warning signs"
        description="These are the little tells that should make you pause before clicking, paying, or replying."
      >
        <ThreatList items={threat.warningSigns} />
      </ThreatSection>

      <ThreatSection
        eyebrow="How to stay safe"
        title="How to stay safe"
        description="Small habits make a big difference. These are the routines that keep the attack from landing."
      >
        <ThreatList items={threat.safetyTips} />
      </ThreatSection>

      <ThreatSection
        eyebrow="Real-world examples"
        title="Real-world examples"
        description="These examples show how the same attack pattern appears in everyday life."
      >
        <ThreatList items={threat.realWorldExamples} />
      </ThreatSection>

      <ThreatSection
        eyebrow="Ghanaian-inspired examples"
        title="Local context"
        description="Cyber safety lands better when the examples feel familiar to the way people actually use apps, money, and chat in Ghana."
      >
        <ThreatList items={threat.ghanaExamples} />
      </ThreatSection>

      <ThreatSection
        eyebrow="Quiz"
        title="Course checkpoint"
        description="Finish the lesson, then take the course quiz and generate the certificate for this Academy module."
      >
        <AcademyCourseQuizSection threatSlug={threat.slug} title={threat.name} />
      </ThreatSection>

      <ThreatSection
        eyebrow="Related threats"
        title="Related threats"
        description="If you understand this one, these are the next threats worth studying."
      >
        <ThreatRelatedThreats relatedThreats={relatedThreats} />
      </ThreatSection>

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className={cyberPanelClasses("border-fuchsia-400/15 px-6 py-8 sm:px-8")}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-sm font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
                Keep learning
              </p>
              <p className="text-sm leading-6 text-slate-300 sm:text-base">
                Continue through the academy and build your defenses one threat
                at a time.
              </p>
            </div>
            <Link
              href="/threats"
              className={cyberButtonClasses("primary", "lg")}
            >
              Back to Threat Academy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
