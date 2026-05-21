import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";
import { cyberButtonClasses, cyberPanelClasses, SectionHeader } from "@/components/ui/cyber";

export function CyberCTA() {
  return (
    <AnimatedSection delay={0.14} className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className={cyberPanelClasses("relative overflow-hidden px-6 py-8 sm:px-8 sm:py-10")}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.14),transparent_32%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <SectionHeader
            eyebrow="Training ready"
            title="Turn suspicious clicks into confident decisions."
            description="Jump into the training loop, explore threats, and build better instincts through interactive cyber experiences that feel sharp on desktop and mobile."
            className="max-w-2xl"
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="#training"
              className={cyberButtonClasses("primary", "lg")}
            >
              Start Training
            </Link>
            <Link
              href="/threats"
              className={cyberButtonClasses("secondary", "lg")}
            >
              Explore Threats
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
