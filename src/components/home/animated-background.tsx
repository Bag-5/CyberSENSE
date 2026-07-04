"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_50%_110%,rgba(59,130,246,0.12),transparent_34%)]" />

      <motion.div
        className="absolute left-[-8rem] top-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
        style={{ z: -40 }}
        animate={prefersReducedMotion ? undefined : { x: [0, 24, 0], y: [0, 18, 0] }}
        transition={
          prefersReducedMotion ? undefined : { duration: 12, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        className="absolute right-[-6rem] top-32 h-80 w-80 rounded-full bg-fuchsia-500/18 blur-3xl"
        style={{ z: -80 }}
        animate={prefersReducedMotion ? undefined : { x: [0, -18, 0], y: [0, 14, 0] }}
        transition={
          prefersReducedMotion ? undefined : { duration: 14, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        className="absolute bottom-[-8rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl"
        style={{ z: -120 }}
        animate={
          prefersReducedMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.55, 0.82, 0.55] }
        }
        transition={
          prefersReducedMotion ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </div>
  );
}
