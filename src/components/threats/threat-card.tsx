"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/utils/cn";
import type { ThreatCard as ThreatCardData } from "@/types/site";
import { threatLevels } from "@/data/threats";
import { cyberButtonClasses, cyberPanelClasses } from "@/components/ui/cyber";
import { useTilt } from "@/hooks/use-tilt";

type ThreatCardProps = {
  threat: ThreatCardData;
};

export function ThreatCard({ threat }: ThreatCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const tilt = useTilt(5);

  if (prefersReducedMotion) {
    return (
      <article className={cyberPanelClasses("group relative overflow-hidden p-6 shadow-[0_0_40px_rgba(15,23,42,0.35)]")}>
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
              className={cyberButtonClasses("primary", "sm")}
            >
              Learn More
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cyberPanelClasses("group relative overflow-hidden p-6 shadow-[0_0_40px_rgba(15,23,42,0.35)]")}
      style={{ perspective: tilt.perspective, transformStyle: "preserve-3d", transition: "transform 0.12s ease-out" }}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
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
            className={cyberButtonClasses("primary", "sm")}
          >
            Learn More
          </Link>
        </div>
      </div>
    </article>
  );
}
