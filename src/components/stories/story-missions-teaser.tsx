import Image from "next/image";
import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";
import { SectionHeader, cyberButtonClasses, cyberPanelClasses } from "@/components/ui/cyber";
import { stories } from "@/data/stories";
import { threatsBySlug } from "@/data/threats";

/** Three featured missions — enough to signal the section without a wall of cards. */
const FEATURED = ["momo-message", "helpful-stranger", "brothers-voice"];

export function StoryMissionsTeaser() {
  const featured = FEATURED.map((slug) => stories.find((s) => s.slug === slug)).filter(
    (story): story is NonNullable<typeof story> => Boolean(story),
  );

  if (!featured.length) return null;

  return (
    <AnimatedSection id="stories" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        className={cyberPanelClasses(
          "relative overflow-hidden border-amber-300/15 p-6 sm:p-8",
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.10),transparent_30%)]" />

        <div className="relative">
          <SectionHeader
            eyebrow="Story mode"
            title="Story Missions"
            description="Ghanaian-inspired stories that make cyber lessons memorable, playful, and local. Follow one person through a real situation, and leave with the habit that would have protected them."
            className="max-w-3xl"
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((story) => {
              const threat = threatsBySlug[story.threatSlug];
              return (
                <Link
                  key={story.slug}
                  href={`/stories/${story.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-white/10 transition duration-300 hover:border-cyan-300/30 hover:shadow-[0_0_28px_rgba(34,211,238,0.16)]"
                >
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <Image
                      src={story.cover}
                      alt={story.coverAlt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 space-y-1.5 p-4">
                    {threat ? (
                      <span className="inline-block rounded-full border border-cyan-300/25 bg-slate-950/80 px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.14em] text-cyan-100 uppercase">
                        {threat.icon} {threat.name}
                      </span>
                    ) : null}
                    <h3 className="text-base font-semibold text-white">{story.title}</h3>
                    <p className="line-clamp-2 text-sm leading-6 text-slate-300">
                      {story.logline}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <Link href="/stories" className={cyberButtonClasses("primary", "lg")}>
              Browse all {stories.length} missions
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}