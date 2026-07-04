"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
};

export function AnimatedSection({
  children,
  className,
  delay = 0,
  id,
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={className}
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 18, rotateX: 1.5, z: -30 }
      }
      whileInView={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, rotateX: 0, z: 0 }
      }
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, ease: "easeOut", delay }}
      style={
        prefersReducedMotion
          ? undefined
          : { transformStyle: "preserve-3d", perspective: "1200px" }
      }
    >
      {children}
    </motion.section>
  );
}
