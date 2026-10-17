import Link from "next/link";

import { SafeImage } from "@/components/threats/safe-image";
import { SectionHeader, cyberPanelClasses } from "@/components/ui/cyber";
import type { ThreatDetail } from "@/types/site";
import { cn } from "@/utils/cn";

/* ------------------------------ presentational ---------------------------- */

function KeyTerms({ terms }: { terms: ThreatDetail["keyTerms"] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {terms.map((item) => (
        <div
          key={item.term}
          className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3"
        >
          <dt className="text-sm font-semibold text-cyan-100">{item.term}</dt>
          <dd className="mt-1.5 text-sm leading-6 text-slate-300">{item.definition}</dd>
        </div>
      ))}
    </dl>
  );
}

function AttackChain({ steps }: { steps: ThreatDetail["scenarioWalkthrough"] }) {
  return (
    <ol className="relative space-y-3 border-l border-cyan-300/20 pl-6">
      {steps.map((step, i) => (
        <li key={step.label} className="relative">
          <span
            className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/30 bg-slate-950 text-[11px] font-semibold text-cyan-100"
            aria-hidden
          >
            {i + 1}
          </span>
          <div className={cyberPanelClasses("p-4")}>
            <p className="text-sm font-semibold tracking-[-0.01em] text-white">{step.label}</p>
            <p className="mt-1.5 text-sm leading-6 text-slate-300">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function DidYouKnow({ facts }: { facts: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {facts.map((fact) => (
        <li
          key={fact}
          className="rounded-2xl border border-amber-300/15 bg-amber-400/5 px-4 py-3 text-sm leading-6 text-slate-200"
        >
          {fact}
        </li>
      ))}
    </ul>
  );
}

/* --------------------------------- content -------------------------------- */

export function CourseContent({ threat }: { threat: ThreatDetail }) {
  return (
    <div className="space-y-8">
      {/* Hero banner */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SafeImage
          src={threat.heroImage}
          alt={threat.heroAlt}
          frameClassName={cyberPanelClasses("overflow-hidden p-0")}
          className="aspect-[16/9] w-full sm:max-h-[38vh]"
          imgClassName="object-cover"
          priority
        />
      </section>

      {/* Deep dive */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cyberPanelClasses("p-6 sm:p-8")}>
          <SectionHeader
            eyebrow="Under the hood"
            title="How it actually works"
            className="max-w-2xl"
          />
          <div className="mt-5 max-w-3xl space-y-4">
            {threat.deepDive.split("\n\n").map((para) => (
              <p key={para.slice(0, 40)} className="text-base leading-8 text-slate-200">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Attack chain */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Attack chain"
          title="How it plays out, step by step"
          description="Almost every incident in this category follows the same sequence. Recognising the order is what lets you interrupt it early."
        />
        <div className="mt-6 max-w-3xl">
          <AttackChain steps={threat.scenarioWalkthrough} />
        </div>
      </section>

      {/* Key terms */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Vocabulary"
          title="Key terms"
          description="The words you will hear in news reports and support conversations. Knowing them makes it easier to ask the right questions."
        />
        <div className="mt-6 max-w-4xl">
          <KeyTerms terms={threat.keyTerms} />
        </div>
      </section>

      {/* Figures */}
      {threat.figures.length ? (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Visual guide" title="What to look for" />
          <div
            className={cn(
              "mt-6 grid gap-4",
              threat.figures.length > 1 && "sm:grid-cols-2",
            )}
          >
            {threat.figures.map((figure) => (
              <figure key={figure.src}>
                <SafeImage
                  src={figure.src}
                  alt={figure.alt}
                  frameClassName={cyberPanelClasses("overflow-hidden p-0")}
                  className="aspect-[4/3] w-full"
                  imgClassName="object-contain"
                />
                <figcaption className="mt-3 text-sm leading-6 text-slate-400">
                  {figure.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {/* Facts */}
      {threat.didYouKnow.length ? (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Worth knowing" title="Did you know?" />
          <div className="mt-6 max-w-4xl">
            <DidYouKnow facts={threat.didYouKnow} />
          </div>
        </section>
      ) : null}
    </div>
  );
}

/** Compact course card used on the academy grid. */
export function CourseCard({ threat }: { threat: ThreatDetail }) {
  return (
    <Link
      href={`/threats/${threat.slug}`}
      className={cyberPanelClasses(
        "group block transition duration-300 hover:border-cyan-300/30 hover:shadow-[0_0_28px_rgba(34,211,238,0.16)]",
      )}
    >
      <SafeImage
        src={threat.heroImage}
        alt={threat.heroAlt}
        className="aspect-[16/9] w-full rounded-t-2xl"
        imgClassName="object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="space-y-2 p-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-cyan-200 uppercase">
          {threat.category}
        </p>
        <h3 className="text-lg font-semibold text-white">{threat.name}</h3>
        <p className="text-sm leading-6 text-slate-300">{threat.summary}</p>
      </div>
    </Link>
  );
}