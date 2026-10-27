"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/utils/cn";

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
};

/**
 * Reveal timing is deliberately tight: a long delay makes the page feel
 * unresponsive because the content is already on screen but still invisible.
 * Call sites can ask for a stagger, but it is capped so no section can ever
 * wait more than MAX_REVEAL_DELAY seconds before it starts moving in.
 */
const MAX_REVEAL_DELAY = 0.06;
const REVEAL_DURATION = 0.4;
const REVEAL_DISTANCE = 12;

/** Start the reveal slightly before the section edge enters the viewport. */
const REVEAL_VIEW_OPTIONS = {
  once: true,
  amount: 0.06,
  margin: "0px 0px 120px 0px",
} as const;

export function AnimatedSection({
  children,
  className,
  delay = 0,
  id,
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, REVEAL_VIEW_OPTIONS);

  /**
   * Content must never be hidden on the server. Anything already sitting in
   * the first viewport renders visible on the first paint, and only sections
   * that start below the fold get "armed" into the hidden state in order to
   * play the reveal when they scroll in.
   */
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (element.getBoundingClientRect().top >= window.innerHeight) {
      setIsArmed(true);
    }
  }, []);

  const revealDelay = Math.min(Math.max(delay, 0), MAX_REVEAL_DELAY);
  const hidden = isArmed && !prefersReducedMotion;

  return (
    <motion.section
      ref={ref}
      id={id}
      className={cn(id && "scroll-mt-24", className)}
      initial={false}
      animate={
        hidden && !isInView
          ? { opacity: 0, y: REVEAL_DISTANCE }
          : { opacity: 1, y: 0 }
      }
      transition={{
        duration: prefersReducedMotion ? 0.2 : REVEAL_DURATION,
        ease: "easeOut",
        delay: revealDelay,
      }}
    >
      {children}
    </motion.section>
  );
}
