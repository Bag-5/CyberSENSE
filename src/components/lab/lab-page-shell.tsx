import { AnimatedSection } from "@/components/animated-section";
import { siteName } from "@/data/site";
import { LabDashboard } from "@/components/lab/lab-dashboard";

export function LabPageShell() {
  return (
    <div className="space-y-8 pb-10 pt-10">
      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="cyber-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
            {siteName}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
            Simulated Attack Lab
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Step into a safe cyber simulation zone where each attack is only a
            visual lesson. Learn how phishing, spoofed pages, weak passwords,
            ransomware, unsafe Wi-Fi, and permission abuse work without any real
            harm.
          </p>
        </div>
      </AnimatedSection>

      <LabDashboard />
    </div>
  );
}

