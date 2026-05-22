"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { AnimatedSection } from "@/components/animated-section";
import { AnimatedBackground } from "@/components/home/animated-background";
import { FloatingAlertCards } from "@/components/home/floating-alert-cards";
import { cyberButtonClasses } from "@/components/ui/cyber";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const payload = (await response.json()) as { user: unknown };
        if (active) {
          setIsAuthenticated(Boolean(payload.user));
        }
      } catch {
        if (active) {
          setIsAuthenticated(false);
        }
      }
    }

    void loadUser();

    return () => {
      active = false;
    };
  }, []);

  const trainingHref = isAuthenticated
    ? "#training"
    : "/auth?returnTo=%2F%23training";

  return (
    <AnimatedSection className="relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8 lg:py-28">
        <div className="relative z-10 space-y-8">
          <div className="space-y-5">
            <div className="h-1.5 w-36 rounded-full bg-gradient-to-r from-rose-500 via-amber-300 to-emerald-500" />
            <h1 className="max-w-3xl text-5xl font-black tracking-[-0.08em] text-white drop-shadow-[0_0_28px_rgba(34,211,238,0.14)] sm:text-6xl lg:text-7xl">
              Learn Cybersecurity Before Hackers Learn You
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Step into an interactive training space where simulations, games,
              storytelling, and quizzes turn everyday cyber safety into a vivid,
              beginner-friendly experience.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={trainingHref}
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
