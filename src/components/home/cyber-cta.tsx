import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";

export function CyberCTA() {
  return (
    <AnimatedSection delay={0.14} className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="cyber-panel relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.14),transparent_32%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
              Training ready
            </p>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
              Turn suspicious clicks into confident decisions.
            </h2>
            <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Jump into the training loop, explore threats, and build better
              instincts through interactive cyber experiences that feel sharp
              on desktop and mobile.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="#training"
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Start Training
            </Link>
            <Link
              href="/threats"
              className="inline-flex items-center justify-center rounded-full border border-fuchsia-300/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Explore Threats
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
