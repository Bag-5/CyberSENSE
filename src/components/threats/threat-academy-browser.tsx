"use client";

import { useState } from "react";

import { ThreatCard } from "@/components/threats/threat-card";
import { threatCategories } from "@/data/threats";
import type { ThreatCard as ThreatCardData } from "@/types/site";
import { cyberButtonClasses, cyberPanelClasses, SectionHeader } from "@/components/ui/cyber";
import { cn } from "@/utils/cn";

type ThreatAcademyBrowserProps = {
  threats: ThreatCardData[];
};

export function ThreatAcademyBrowser({ threats }: ThreatAcademyBrowserProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredThreats = threats.filter((threat) => {
    const matchesQuery =
      query.trim().length === 0 ||
      [threat.name, threat.summary, threat.category]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase());
    const matchesCategory =
      activeCategory === "All" || threat.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className={cyberPanelClasses("p-5 sm:p-6")}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SectionHeader
            eyebrow="Search / filter"
            title="Type to explore threats or narrow the list by category."
            description="The filter is lightweight and ready to grow into a fuller academy search."
            className="max-w-2xl"
          />

          <div className="w-full max-w-xl">
            <label className="sr-only" htmlFor="threat-search">
              Search threats
            </label>
            <input
              id="threat-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search phishing, malware, deepfakes..."
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-200/20"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {threatCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                cyberButtonClasses(
                  activeCategory === category ? "primary" : "ghost",
                  "sm",
                ),
                "rounded-full",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-1">
        <p className="text-sm text-slate-400">
          Showing <span className="text-cyan-100">{filteredThreats.length}</span>{" "}
          threat{filteredThreats.length === 1 ? "" : "s"}
        </p>
        <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
          Hover for glow
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredThreats.map((threat) => (
          <ThreatCard key={threat.slug} threat={threat} />
        ))}
      </div>
    </div>
  );
}
