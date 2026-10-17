import Image from "next/image";
import Link from "next/link";

import { storyRatioClass } from "@/components/stories/story-card";
import { SectionHeader, cyberButtonClasses, cyberPanelClasses } from "@/components/ui/cyber";
import { threatsBySlug } from "@/data/threats";
import type { Story } from "@/types/story";

export function StoryReader({ story }: { story: Story }) {
  const threat = threatsBySlug[story.threatSlug];

  return (
    <article className="space-y-8 pb-10">
      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className={cyberPanelClasses("overflow-hidden p-0")}>
          <div
            className={
              "relative w-full overflow-hidden sm:max-h-[46vh] " +
              storyRatioClass(story.coverRatio)
            }
          >
            <Image
              src={story.cover}
              alt={story.coverAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
          </div>

          <div className="space-y-4 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              {threat ? (
                <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-cyan-100 uppercase">
                  {threat.icon} {threat.name}
                </span>
              ) : null}
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-slate-300 uppercase">
                Story Mission
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-slate-300 uppercase">
                {story.minutes} min read
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              {story.title}
            </h1>
            <p className="text-lg leading-8 text-slate-200">{story.logline}</p>

            <dl className="grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-3">
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.18em] text-cyan-200 uppercase">
                  Setting
                </dt>
                <dd className="mt-1 text-sm text-slate-300">{story.setting}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.18em] text-cyan-200 uppercase">
                  Protagonist
                </dt>
                <dd className="mt-1 text-sm text-slate-300">{story.protagonist}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.18em] text-cyan-200 uppercase">
                  Covers
                </dt>
                <dd className="mt-1 text-sm text-slate-300">{threat?.name ?? "Cyber safety"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Beats */}
      {story.beats.map((beat, index) => (
        <section
          key={beat.heading}
          className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8"
        >
          <div className="space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-amber-200 uppercase">
              Beat {index + 1} of {story.beats.length}
            </p>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
              {beat.heading}
            </h2>

            <div
              className={
                "relative w-full overflow-hidden rounded-2xl border border-white/10 " +
                storyRatioClass(beat.imageRatio)
              }
            >
              <Image
                src={beat.image}
                alt={beat.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>

            <div className={cyberPanelClasses("p-5 sm:p-6")}>
              <p className="text-base leading-8 text-slate-200">{beat.body}</p>
            </div>
          </div>
        </section>
      ))}

      {/* Takeaway */}
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className={cyberPanelClasses(
            "border-amber-300/20 bg-gradient-to-br from-amber-400/10 via-slate-950 to-cyan-400/5 p-6 sm:p-8",
          )}
        >
          <SectionHeader
            eyebrow="The lesson"
            title="What to remember"
            className="max-w-2xl"
          />
          <p className="mt-4 text-lg leading-8 font-medium text-white">{story.takeaway}</p>

          <h3 className="mt-8 text-[11px] font-semibold tracking-[0.22em] text-emerald-200 uppercase">
            Habits to keep
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {story.habits.map((habit) => (
              <li
                key={habit}
                className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm leading-6 text-slate-300"
              >
                {habit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer nav */}
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className={cyberPanelClasses(
            "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <div className="max-w-xl space-y-1">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-cyan-200 uppercase">
              Keep going
            </p>
            <p className="text-sm leading-6 text-slate-300">
              Read another story, or pick up the matching Threat Academy course.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/stories" className={cyberButtonClasses("secondary", "md")}>
              All stories
            </Link>
            {threat ? (
              <Link
                href={`/threats/${threat.slug}`}
                className={cyberButtonClasses("primary", "md")}
              >
                Study {threat.name}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </article>
  );
}