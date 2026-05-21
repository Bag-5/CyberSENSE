import { AnimatedSection } from "@/components/animated-section";
import { siteName } from "@/data/site";
import { LabDashboard } from "@/components/lab/lab-dashboard";
import { SectionHeader, cyberPanelClasses } from "@/components/ui/cyber";

export function LabPageShell() {
  return (
    <div className="space-y-8 pb-10 pt-10">
      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cyberPanelClasses("p-6 sm:p-8")}>
          <SectionHeader
            eyebrow={siteName}
            title="Simulated Attack Lab"
            description="Step into a safe cyber simulation zone where each attack is only a visual lesson. Learn how phishing, spoofed pages, weak passwords, ransomware, unsafe Wi-Fi, and permission abuse work without any real harm."
          />
        </div>
      </AnimatedSection>

      <LabDashboard />
    </div>
  );
}
