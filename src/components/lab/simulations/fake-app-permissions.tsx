"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { appPermissionDemo } from "@/data/simulations";
import { cn } from "@/utils/cn";

export function FakeAppPermissions() {
  const [selected, setSelected] = useState<string[]>([
    "Camera",
    "Contacts",
  ]);

  const riskScore = useMemo(() => {
    return selected.reduce((total, permission) => {
      const item = appPermissionDemo.permissions.find((entry) => entry.name === permission);
      if (!item) return total;
      return total + (item.risk === "High" ? 30 : 15);
    }, 0);
  }, [selected]);

  const warning =
    riskScore >= 60
      ? "This flashlight app is asking for bank-account-level access."
      : riskScore >= 30
      ? "Still suspicious. A flashlight app should stay in its lane."
      : "Much better. The app is asking for less than a hungry data goblin.";

  function togglePermission(permission: string) {
    setSelected((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission],
    );
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-5"
        >
          <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200 uppercase">
            Fake app permission abuse demo
          </p>
          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-slate-900/95 to-fuchsia-950/50 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-xl">
                🔦
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  {appPermissionDemo.appName}
                </p>
                <p className="text-xs text-slate-400">
                  A harmless-looking flashlight app
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <p className="text-sm font-semibold text-white">
                Requested permissions
              </p>
              {appPermissionDemo.permissions.map((permission) => {
                const active = selected.includes(permission.name);
                return (
                  <button
                    key={permission.name}
                    type="button"
                    onClick={() => togglePermission(permission.name)}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 text-left transition",
                      active
                        ? "border-cyan-300/40 bg-cyan-400/15 text-white"
                        : "border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <span className="block text-sm font-semibold">
                      {permission.name}
                    </span>
                    <span className="mt-1 block text-xs text-slate-400">
                      Tap to toggle
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <p className="text-sm font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
            Access warning
          </p>
          <div className="mt-4 rounded-3xl border border-rose-300/20 bg-rose-400/10 p-4">
            <p className="text-lg font-semibold text-rose-100">
              Permission risk: {riskScore}
            </p>
            <p className="mt-2 text-sm leading-6 text-rose-50/90">{warning}</p>
          </div>

          <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-200 uppercase">
              Why this is a problem
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
              {appPermissionDemo.permissions.map((permission) => (
                <li key={permission.name}>
                  • {permission.name}: {permission.reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-3xl border border-cyan-300/15 bg-cyan-400/8 p-4 text-sm leading-6 text-slate-300">
            Teach users to inspect app permissions before installing, especially
            when a flashlight app wants contacts, camera, or files.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

