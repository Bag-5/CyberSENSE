import type { Metadata } from "next";

import { AnimatedSection } from "@/components/animated-section";
import { RedFlagsGame } from "@/components/games/redflags/redflags-game";
import { siteName } from "@/data/site";

export const metadata: Metadata = {
  title: "Spot the Red Flags",
  description:
    "Play CyberSENSE's interactive mini-game and learn to spot suspicious elements in simulated scams.",
};

export default function RedFlagsPage() {
  return (
    <div className="space-y-8 pb-10 pt-10">
      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="cyber-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
            {siteName}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
            Spot the Red Flags
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Click the suspicious bits in messages, emails, login pages, and
            scams before the trick gets you. Each round teaches a small habit
            that helps you stay safe online.
          </p>
        </div>
      </AnimatedSection>

      <RedFlagsGame />
    </div>
  );
}

