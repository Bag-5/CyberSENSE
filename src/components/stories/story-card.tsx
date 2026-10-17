import Image from "next/image";
import Link from "next/link";

import { threatsBySlug } from "@/data/threats";
import { cyberPanelClasses } from "@/components/ui/cyber";
import { cn } from "@/utils/cn";
import type { Story, StoryRatio } from "@/types/story";

/** Tailwind aspect-ratio utilities for the ratios our art is generated at. */
const ratioClasses: Record<StoryRatio, string> = {
  "3:2": "aspect-[3/2]",
  "4:3": "aspect-[4/3]",
  "16:9": "aspect-video",
  "1:1": "aspect-square",
};

export function storyRatioClass(ratio: StoryRatio) {
  return ratioClasses[ratio] ?? "aspect-[3/2]";
}

export function StoryCard({ story }: { story: Story }) {
  const threat = threatsBySlug[story.threatSlug];

  return (
    <Link
      href={`/stories/${story.slug}`}
      className={cn(
        cyberPanelClasses(
          "group relative block overflow-hidden p-0 transition duration-300 hover:scale-[1.02] hover:border-cyan-300/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)] focus-visible:ring-2 focus-visible:ring-cyan-200",
        ),
      )}
    >
      <div className={cn("relative w-full overflow-hidden", storyRatioClass(story.coverRatio))}>
        <Image
          src={story.cover}
          alt={story.coverAlt}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            {threat ? (
              <span className="rounded-full border border-cyan-300/25 bg-slate-950/80 px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-cyan-100 uppercase">
                {threat.icon} {threat.name}
              </span>
            ) : null}
            <span className="rounded-full border border-white/15 bg-slate-950/80 px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-slate-300 uppercase">
              {story.minutes} min read
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-white sm:text-xl">
            {story.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-300">
            {story.logline}
          </p>
        </div>
      </div>
    </Link>
  );
}