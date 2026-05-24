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

const heroItemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} as const;

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
    ? "/threats"
    : "/auth?returnTo=%2Fthreats";

  return (
    <AnimatedSection className="relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8 lg:py-28">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.08,
              },
            },
          }}
          className="relative z-10 space-y-8"
        >
          <div className="space-y-5">
            <motion.div
              variants={heroItemVariants}
              className="h-1.5 w-36 rounded-full bg-gradient-to-r from-[#ce1126] via-[#fcd116] to-[#006b3f] shadow-[0_0_16px_rgba(252,209,22,0.35)]"
            />
            <h1 className="sr-only">Learn Cybersecurity Before Hackers Learn You</h1>
            <motion.div
              variants={heroItemVariants}
              initial={false}
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: [0, -6, 0],
                      rotate: [0, -0.1, 0.1, 0],
                    }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: 11,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }
              }
              whileHover={prefersReducedMotion ? undefined : { scale: 1.012, y: -3 }}
              className="group relative aspect-[11/6] w-full max-w-[42rem] will-change-transform"
            >
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[2.25rem] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(206,17,38,0.9),rgba(252,209,22,0.95),rgba(0,107,63,0.9),rgba(206,17,38,0.9))] opacity-35 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute inset-[-3px] rounded-[2.15rem] bg-[conic-gradient(from_0deg,rgba(206,17,38,0.9),rgba(252,209,22,0.95),rgba(0,107,63,0.9),rgba(206,17,38,0.9))] opacity-28 blur-2xl"
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,transparent_18%,transparent_82%,rgba(255,255,255,0.12)_100%)] opacity-60 mix-blend-screen"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        x: ["-12%", "12%", "-12%"],
                        opacity: [0.45, 0.85, 0.45],
                      }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        duration: 12,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                }
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-[2rem] border border-white/10 bg-slate-950/60 shadow-[0_0_40px_rgba(15,23,42,0.35)]"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        boxShadow: [
                          "0 0 26px rgba(206,17,38,0.08)",
                          "0 0 32px rgba(252,209,22,0.12)",
                          "0 0 26px rgba(0,107,63,0.08)",
                        ],
                      }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        duration: 7.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                }
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-x-6 top-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        opacity: [0.35, 0.85, 0.35],
                        scaleX: [0.92, 1, 0.92],
                      }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                }
              />
              <div
                aria-hidden="true"
                className="absolute left-5 top-5 rounded-full border border-cyan-300/30 bg-slate-950/40 px-3 py-1 text-[10px] font-semibold tracking-[0.22em] text-cyan-100 uppercase backdrop-blur-sm"
              >
                Live training asset
              </div>
              <motion.div
                aria-hidden="true"
                className="absolute bottom-5 left-5 right-5 h-10 rounded-full bg-gradient-to-r from-[#ce1126]/15 via-[#fcd116]/15 to-[#006b3f]/15 blur-2xl"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        opacity: [0.38, 0.72, 0.38],
                        scaleX: [0.98, 1.02, 0.98],
                      }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : {
                        duration: 9,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                }
              />
              <Image
                src={heroImage}
                alt="CyberSENSE hero visual"
                priority
                fill
                className="rounded-[2rem] object-contain p-2 drop-shadow-[0_0_24px_rgba(252,209,22,0.12)]"
                sizes="(max-width: 1024px) 100vw, 42rem"
              />
            </motion.div>
            <motion.p
              variants={heroItemVariants}
              className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
            >
              Step into an interactive training space where simulations, games,
              storytelling, and quizzes turn everyday cyber safety into a vivid,
              beginner-friendly experience.
            </motion.p>
          </div>

          <motion.div
            variants={heroItemVariants}
            className="flex flex-col gap-3 sm:flex-row"
          >
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
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0.01 }
              : { duration: 0.8, delay: 0.2, ease: "easeOut" }
          }
          className="relative z-10"
        >
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
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
