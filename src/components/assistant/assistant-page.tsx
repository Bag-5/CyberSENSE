"use client";

import { motion, useReducedMotion } from "framer-motion";

import { AssistantChat } from "@/components/assistant/assistant-chat";
import { AnimatedSection } from "@/components/animated-section";
import { assistantCapabilities, assistantSafetyNotes } from "@/data/assistant";
import { cyberPanelClasses, SectionHeader } from "@/components/ui/cyber";
import { cn } from "@/utils/cn";

type AssistantPageProps = {
  currentName?: string | null;
  currentEmail?: string | null;
  currentRole?: "user" | "admin" | "superadmin" | null;
};

export function AssistantPage({ currentName, currentEmail, currentRole }: AssistantPageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatedSection className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(245,217,139,0.12),transparent_22%),linear-gradient(180deg,rgba(2,6,23,0.75),rgba(2,6,23,0.95))]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0.01 } : { duration: 0.45, ease: "easeOut" }}
          className={cyberPanelClasses("border border-cyan-300/15 p-5 sm:p-6 lg:p-8")}
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-5 xl:max-w-2xl">
              <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.26em] text-cyan-100 uppercase">
                CyberSENSE Assistant
              </div>
              <SectionHeader
                eyebrow="AI learning companion"
                title="Ask about cyber safety, scams, and defense"
                description="Use the assistant to understand phishing, AI scams, passwords, ransomware, and suspicious messages in simple language."
              />

              <div className="flex flex-wrap gap-2">
                {assistantSafetyNotes.map((note) => (
                  <span
                    key={note}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase",
                      note === "Educational only"
                        ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
                        : note === "Defensive focus"
                          ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-100"
                          : "border-amber-300/20 bg-amber-400/10 text-amber-100",
                    )}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[34rem]">
              {assistantCapabilities.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0.01 }
                      : { delay: 0.05 * index, duration: 0.45, ease: "easeOut" }
                  }
                  className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_24px_rgba(15,23,42,0.12)]"
                >
                  <p className="text-xs font-semibold tracking-[0.2em] text-cyan-100 uppercase">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <motion.aside
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0.01 } : { duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className={cyberPanelClasses("border border-white/10 p-5 sm:p-6")}>
              <SectionHeader
                eyebrow="Why use it"
                title="Ask, learn, and stay safe"
                description="The assistant translates cyber jargon into simple lessons and keeps the advice defensive."
              />
              <div className="mt-5 space-y-3">
                {[
                  "Explain phishing emails and fake SMS alerts in plain language.",
                  "Break down AI scams, fake videos, and voice cloning tricks.",
                  "Turn suspicious messages into safe learning moments.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className={cyberPanelClasses("border border-white/10 p-5 sm:p-6")}>
              <SectionHeader
                eyebrow="Quick tips"
                title="How to get the best answer"
                description="Ask in a normal sentence. You can paste suspicious text, and the assistant will explain what to watch for."
              />
              <div className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                <p className="rounded-2xl border border-cyan-300/15 bg-cyan-400/10 p-3">
                  Ask questions like: “How do phishing scams work?” or “Is this message
                  suspicious?”
                </p>
                <p className="rounded-2xl border border-amber-300/15 bg-amber-400/10 p-3">
                  If the question becomes risky, the assistant will refuse the harmful part and
                  keep the guidance defensive.
                </p>
              </div>
            </div>

            {currentName ? (
              <div className={cyberPanelClasses("border border-white/10 p-5 sm:p-6")}>
                <SectionHeader
                  eyebrow="Personalized"
                  title={`Ready for ${currentName}`}
                  description={currentEmail ? `Signed in as ${currentEmail}.` : "Personalized learning mode is on."}
                />
                {currentRole ? (
                  <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                    Role: {currentRole}
                  </p>
                ) : null}
              </div>
            ) : null}
          </motion.aside>

          <motion.section
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0.01 } : { delay: 0.08, duration: 0.5, ease: "easeOut" }}
          >
            <AssistantChat currentName={currentName} className="min-h-[42rem]" />
          </motion.section>
        </div>
      </div>
    </AnimatedSection>
  );
}
