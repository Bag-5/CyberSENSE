import { AnimatedSection } from "@/components/animated-section";
import { SectionHeader, cyberPanelClasses } from "@/components/ui/cyber";
import { featureCards, missionCards } from "@/data/site";

export function FeatureGrid() {
  return (
    <div className="space-y-16">
      <AnimatedSection id="threats">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Threat intelligence"
            title="Train your instincts before the bad actors get comfortable."
            className="max-w-2xl"
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className={cyberPanelClasses(
                  "p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-300/25 hover:bg-white/10",
                )}
              >
                <p className="text-xs font-semibold tracking-[0.22em] text-amber-100 uppercase">
                  {card.accent}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="training" delay={0.08}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <article className={cyberPanelClasses("border-amber-300/15 bg-gradient-to-br from-rose-400/10 via-slate-900 to-emerald-400/10 p-8")}>
              <SectionHeader
                eyebrow="Training loop"
                title="A simple path that keeps beginners moving."
                description="CyberSENSE stays approachable: one lesson, one challenge, one reward at a time. That keeps the experience friendly without watering down the security lessons."
              />
            </article>

            <div className="grid gap-4 sm:grid-cols-3" id="simulations">
              {missionCards.map((mission) => (
                <article
                  key={mission.title}
                  className={cyberPanelClasses("p-6")}
                >
                  <p className="text-xs font-semibold tracking-[0.22em] text-emerald-200 uppercase">
                    {mission.tag}
                  </p>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {mission.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {mission.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="games" delay={0.16}>
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className={cyberPanelClasses("border-amber-300/15 bg-white/5 px-6 py-8 sm:px-8")}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-sm font-semibold tracking-[0.24em] text-amber-100 uppercase">
                  Gameplay-ready foundation
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                  Built to expand into quizzes, simulations, and story-driven
                  challenges.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-slate-300">
                The folders for games, simulations, hooks, data, utilities, and
                types are ready for the next phase of development.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
