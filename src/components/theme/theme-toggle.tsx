"use client";

import { useMemo } from "react";

import { useThemeMode } from "@/components/theme/theme-provider";
import { cn } from "@/utils/cn";

const themeModes = [
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
] as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { mode, setThemeMode } = useThemeMode();

  const modeLabel = useMemo(
    () => themeModes.find((entry) => entry.value === mode)?.label ?? "System",
    [mode],
  );

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 shadow-[0_0_24px_rgba(15,23,42,0.2)] backdrop-blur-xl",
        className,
      )}
      role="group"
      aria-label="Theme mode"
    >
      {themeModes.map((entry) => {
        const active = mode === entry.value;
        return (
          <button
            key={entry.value}
            type="button"
            aria-pressed={active}
            onClick={() => setThemeMode(entry.value)}
            className={cn(
              "rounded-full px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
              active
                ? "bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/20"
                : "text-slate-300 hover:bg-white/5 hover:text-white",
            )}
          >
            <span className="hidden sm:inline">{entry.label}</span>
            <span className="sm:hidden">{entry.label.slice(0, 1)}</span>
          </button>
        );
      })}
      <span className="sr-only">Current theme {modeLabel}</span>
    </div>
  );
}
