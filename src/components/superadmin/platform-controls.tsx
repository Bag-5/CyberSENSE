"use client";

import { useMemo, useState, useTransition } from "react";

import { cyberButtonClasses, cyberPanelClasses } from "@/components/ui/cyber";
import type { PlatformSettings } from "@/lib/superadmin/settings";
import { cn } from "@/utils/cn";

type PlatformControlsProps = {
  initialSettings: PlatformSettings;
};

type ToggleKey = keyof PlatformSettings["modules"];

const controlLabels: Record<ToggleKey, { title: string; description: string }> = {
  threatAcademy: {
    title: "Threat Academy",
    description: "Show or hide the threat learning catalog.",
  },
  aiAnalyzer: {
    title: "AI Analyzer",
    description: "Allow the scam analyzer to stay publicly available.",
  },
  quizzes: {
    title: "Quizzes",
    description: "Keep the quiz engine visible and interactive.",
  },
  attackLab: {
    title: "Attack Lab",
    description: "Expose the simulation lab to learners.",
  },
  redFlags: {
    title: "Red Flags Game",
    description: "Keep the spotting game active for practice.",
  },
  simulations: {
    title: "Simulations",
    description: "Surface the scenario-driven training modules.",
  },
};

export function PlatformControls({ initialSettings }: PlatformControlsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeModuleCount = useMemo(
    () => Object.values(settings.modules).filter(Boolean).length,
    [settings.modules],
  );

  async function saveSettings(nextSettings: PlatformSettings) {
    setError(null);
    setStatus(null);

    const response = await fetch("/api/superadmin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextSettings),
    });

    const payload = (await response.json()) as { settings?: PlatformSettings; error?: string };

    if (!response.ok) {
      throw new Error(payload.error || "Unable to save platform settings.");
    }

    if (payload.settings) {
      setSettings(payload.settings);
    }

    setStatus("Settings saved successfully.");
  }

  function toggleModule(key: ToggleKey) {
    const nextSettings: PlatformSettings = {
      ...settings,
      modules: {
        ...settings.modules,
        [key]: !settings.modules[key],
      },
      updatedAt: new Date().toISOString(),
    };

    setSettings(nextSettings);
    startTransition(() => {
      void saveSettings(nextSettings).catch((saveError) => {
        setError(saveError instanceof Error ? saveError.message : "Unable to save platform settings.");
      });
    });
  }

  function updateAnnouncement(value: string) {
    setSettings((current) => ({
      ...current,
      announcement: value,
      updatedAt: current.updatedAt,
    }));
  }

  function persistAnnouncement() {
    const nextSettings: PlatformSettings = {
      ...settings,
      announcement: settings.announcement.trim(),
      updatedAt: new Date().toISOString(),
    };

    setSettings(nextSettings);
    startTransition(() => {
      void saveSettings(nextSettings).catch((saveError) => {
        setError(saveError instanceof Error ? saveError.message : "Unable to save platform settings.");
      });
    });
  }

  return (
    <section className={cyberPanelClasses("p-5 sm:p-6")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-100 uppercase">
            Live controls
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white">
            Platform switches
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            These are the first real superadmin controls. They persist in Postgres and can be used
            to throttle visibility or maintenance state without redeploying the app.
          </p>
        </div>

        <div className="rounded-[1.25rem] border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-50">
          Active modules: {activeModuleCount}/{Object.keys(settings.modules).length}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
        <div>
          <p className="text-sm font-semibold text-white">Maintenance mode</p>
          <p className="mt-1 text-sm leading-6 text-slate-300">
            Pause the public learning shell and show a maintenance notice while you make changes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const nextSettings: PlatformSettings = {
              ...settings,
              maintenanceMode: !settings.maintenanceMode,
              updatedAt: new Date().toISOString(),
            };

            setSettings(nextSettings);
            startTransition(() => {
              void saveSettings(nextSettings).catch((saveError) => {
                setError(
                  saveError instanceof Error
                    ? saveError.message
                    : "Unable to save platform settings.",
                );
              });
            });
          }}
          disabled={isPending}
          className={cn(
            cyberButtonClasses(settings.maintenanceMode ? "danger" : "secondary", "md"),
            settings.maintenanceMode &&
              "border-rose-300/25 bg-rose-400/15 text-rose-50 hover:bg-rose-400/20",
          )}
        >
          {settings.maintenanceMode ? "Disable maintenance" : "Enable maintenance"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {(Object.keys(controlLabels) as ToggleKey[]).map((key) => {
          const enabled = settings.modules[key];
          const meta = controlLabels[key];

          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleModule(key)}
              disabled={isPending}
              className={cn(
                "rounded-[1.5rem] border p-5 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70",
                enabled
                  ? "border-emerald-300/20 bg-emerald-400/10"
                  : "border-white/10 bg-white/5",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{meta.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{meta.description}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    enabled
                      ? "bg-emerald-400/15 text-emerald-100"
                      : "bg-rose-400/15 text-rose-100",
                  )}
                >
                  {enabled ? "On" : "Off"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-200">Homepage announcement</span>
          <textarea
            value={settings.announcement}
            onChange={(event) => updateAnnouncement(event.target.value)}
            rows={4}
            className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-200/20"
            placeholder="Write a short homepage banner or maintenance note."
          />
        </label>

        <button
          type="button"
          onClick={persistAnnouncement}
          disabled={isPending}
          className={cyberButtonClasses("primary", "md")}
        >
          {isPending ? "Saving..." : "Save banner"}
        </button>
      </div>

      {status ? (
        <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
          {status}
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-100">
          {error}
        </div>
      ) : null}
    </section>
  );
}
