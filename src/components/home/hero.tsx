"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { AnimatedSection } from "@/components/animated-section";
import { AnimatedBackground } from "@/components/home/animated-background";
import { FloatingAlertCards } from "@/components/home/floating-alert-cards";
import { cyberButtonClasses } from "@/components/ui/cyber";
import heroImage from "../../../Logo/CyberSENSE-image.png";

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
            <h1 className="sr-only">Learn Cybersecurity Before Hackers Learn You</h1>
            <div className="relative max-w-[42rem] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 p-4 shadow-[0_0_40px_rgba(15,23,42,0.35)] sm:p-5">
              <Image
                src={heroImage}
                alt="CyberSENSE hero visual"
                priority
                className="h-auto w-full rounded-[1.25rem] object-cover"
                sizes="(max-width: 1024px) 100vw, 42rem"
              />
            </div>
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
