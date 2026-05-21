import { AnimatedSection } from "@/components/animated-section";
import { SectionHeader, cyberPanelClasses } from "@/components/ui/cyber";
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
      <section className={cyberPanelClasses("p-6 backdrop-blur-xl sm:p-8")}>
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-6">{children}</div>
      </section>
    </AnimatedSection>
  );
}
