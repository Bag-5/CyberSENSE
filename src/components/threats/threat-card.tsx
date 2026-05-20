"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { cn } from "@/utils/cn";
import type { ThreatCard as ThreatCardData } from "@/types/site";
import { threatLevels } from "@/data/threats";

type ThreatCardProps = {
  threat: ThreatCardData;
};

export function ThreatCard({ threat }: ThreatCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(15,23,42,0.35)] backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(217,70,239,0.12),transparent_30%)] opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-slate-950/70 text-xl shadow-[0_0_20px_rgba(34,211,238,0.12)]">
              {threat.icon}
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
                {threat.category}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                {threat.name}
              </h3>
            </div>
          </div>
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
              threatLevels[threat.severity],
            )}
          >
            {threat.severity}
          </span>
        </div>

        <p className="relative mt-4 text-sm leading-6 text-slate-300">
          {threat.summary}
        </p>

        <div className="relative mt-6 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-400">{threat.accent}</span>
          <Link
            href={`/threats/${threat.slug}`}
            className="inline-flex items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition duration-300 hover:bg-cyan-400/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Learn More
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

