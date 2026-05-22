"use client";

import Link from "next/link";
import { useReducedMotion, motion } from "framer-motion";

import { AnimatedSection } from "@/components/animated-section";
import { AnimatedBackground } from "@/components/home/animated-background";
import { FloatingAlertCards } from "@/components/home/floating-alert-cards";
import { siteName } from "@/data/site";
import { cyberButtonClasses } from "@/components/ui/cyber";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatedSection className="relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8 lg:py-28">
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/18 bg-[linear-gradient(135deg,rgba(239,68,68,0.08),rgba(234,179,8,0.08),rgba(16,185,129,0.08))] px-4 py-2 text-xs font-medium text-amber-100">
            <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(234,179,8,0.8)]" />
            Cyberpunk training lab
          </div>

          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-[0.28em] text-amber-100 uppercase">
              {siteName}
            </p>
            <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400" />
            <h1 className="max-w-3xl text-5xl font-black tracking-[-0.08em] text-white drop-shadow-[0_0_28px_rgba(34,211,238,0.14)] sm:text-6xl lg:text-7xl">
              CyberSENSE
            </h1>
            <p className="max-w-2xl text-xl font-medium tracking-[-0.03em] text-cyan-100 sm:text-2xl">
              Learn Cybersecurity Before Hackers Learn You
            </p>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Step into an interactive training space where simulations, games,
              storytelling, and quizzes turn everyday cyber safety into a vivid,
              beginner-friendly experience.
            </p>
          </div>

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

        <div className="relative z-10">
          <div className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-fuchsia-500/14 to-transparent blur-3xl" />
          <motion.div
            animate={
              prefersReducedMotion ? undefined : { y: [0, -4, 0] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <FloatingAlertCards />
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
