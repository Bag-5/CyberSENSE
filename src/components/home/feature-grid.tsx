import { AnimatedSection } from "@/components/animated-section";
import { featureCards, missionCards } from "@/data/site";

export function FeatureGrid() {
  return (
    <div className="space-y-16">
      <AnimatedSection id="threats">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
              Threat intelligence
            </p>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
              Train your instincts before the bad actors get comfortable.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(15,23,42,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/10"
              >
                <p className="text-xs font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
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
            <article className="rounded-[2rem] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-fuchsia-500/10 p-8">
              <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
                Training loop
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
                A simple path that keeps beginners moving.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                CyberSENSE stays approachable: one lesson, one challenge, one
                reward at a time. That keeps the experience friendly without
                watering down the security lessons.
              </p>
            </article>

            <div className="grid gap-4 sm:grid-cols-3" id="simulations">
              {missionCards.map((mission) => (
                <article
                  key={mission.title}
                  className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-6"
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
          <div className="rounded-[2rem] border border-fuchsia-400/15 bg-white/5 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-sm font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
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
