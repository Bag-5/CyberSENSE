import Link from "next/link";

import { threatLevels } from "@/data/threats";
import type { ThreatDetail } from "@/types/site";
import { cn } from "@/utils/cn";

type ThreatRelatedThreatsProps = {
  relatedThreats: ThreatDetail[];
};

export function ThreatRelatedThreats({ relatedThreats }: ThreatRelatedThreatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {relatedThreats.map((threat) => (
        <Link
          key={threat.slug}
          href={`/threats/${threat.slug}`}
          className="group rounded-3xl border border-white/10 bg-slate-950/60 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-slate-950/80"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
                {threat.category}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {threat.name}
              </h3>
            </div>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                threatLevels[threat.severity],
              )}
            >
              {threat.severity}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {threat.summary}
          </p>
          <p className="mt-4 text-sm font-semibold text-cyan-100 transition group-hover:text-white">
            Continue learning
          </p>
        </Link>
      ))}
    </div>
  );
}

