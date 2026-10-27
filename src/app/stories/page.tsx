import type { Metadata } from "next";

import { AnimatedSection } from "@/components/animated-section";
import { AnalyticsBeacon } from "@/components/admin/analytics/analytics-beacon";
import { StoryCard } from "@/components/stories/story-card";
import { SectionHeader, cyberPanelClasses } from "@/components/ui/cyber";
import { stories } from "@/data/stories";
import { threatsBySlug } from "@/data/threats";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Story Missions",
  description:
    "Follow Ghanaian-inspired stories that make cyber lessons memorable, playful, and local.",
};

export default function StoriesPage() {
  return (
    <div className="space-y-8 pb-10 pt-10">
      <AnalyticsBeacon
        eventType="page_view"
        module="stories"
        slug="index"
        category="Story Missions"
        portal="user"
        dedupeKey="stories-index"
      />

      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cyberPanelClasses(
            "relative overflow-hidden border-amber-300/15 p-6 sm:p-8",
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_32%)]" />
          <div className="relative">
            <SectionHeader
              eyebrow="Story mode"
              title="Story Missions"
              description="Follow Ghanaian-inspired stories that make cyber lessons memorable, playful, and local. Each mission follows one person through a real situation and lands on the habit that would have protected them."
              className="max-w-3xl"
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" delay={0.03}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" delay={0.05}>
        <div className={cyberPanelClasses("border-cyan-300/15 p-6 sm:p-8")}>
          <SectionHeader
            eyebrow="Keep learning"
            title="Every story maps to an Academy course."
            description="Finish a mission, then take the matching Threat Academy course for the full breakdown, the attack lab, and the course quiz."
            className="max-w-3xl"
          />
          <ul className="mt-6 flex flex-wrap gap-2">
            {Array.from(
              new Set(stories.map((story) => threatsBySlug[story.threatSlug]?.name).filter(Boolean)),
            ).map((name) => (
              <li
                key={name as string}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200"
              >
                {name as string}
              </li>
            ))}
          </ul>
        </div>
      </AnimatedSection>
    </div>
  );
}