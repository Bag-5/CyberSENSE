import { AnimatedSection } from "@/components/animated-section";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

type ThreatSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function ThreatSection({
  eyebrow,
  title,
  description,
  children,
  className,
}: ThreatSectionProps) {
  return (
    <AnimatedSection className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
        {eyebrow ? (
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            {description}
          </p>
        ) : null}
        <div className="mt-6">{children}</div>
      </section>
    </AnimatedSection>
  );
}

