"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { wifiDemo } from "@/data/simulations";
import { cn } from "@/utils/cn";

function Node({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm font-semibold transition",
        active
          ? "border-cyan-300/40 bg-cyan-400/15 text-white shadow-[0_0_24px_rgba(34,211,238,0.12)]"
          : "border-white/10 bg-slate-950/60 text-slate-300",
      )}
    >
      {label}
    </div>
  );
}

export function PublicWifiVisualizer() {
  const [secure, setSecure] = useState(false);

  const path = secure ? wifiDemo.securePath : wifiDemo.unsafePath;

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-5"
        >
          <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200 uppercase">
            Public Wi-Fi / MITM visualization
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Animated traffic path showing the difference between a risky public
            network and a more secure connection.
          </p>

          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  {secure ? "Secure connection" : "Unsafe public Wi-Fi"}
                </p>
                <p className="text-xs text-slate-400">
                  {secure ? "HTTPS + cautious habits" : "Open network risk"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSecure((current) => !current)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  secure
                    ? "bg-emerald-400 text-slate-950"
                    : "bg-rose-400 text-slate-950",
                )}
              >
                {secure ? "Show unsafe path" : "Show secure path"}
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Node label={path[0]} active />
              <div className="relative flex items-center justify-center">
                <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-cyan-400/0 via-cyan-300/70 to-fuchsia-400/0" />
                <motion.div
                  animate={{ x: [0, 26, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className={cn(
                    "relative z-10 h-3 w-3 rounded-full",
                    secure ? "bg-emerald-300" : "bg-rose-300",
                  )}
                />
              </div>
              <Node label={path[1]} active={!secure} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {wifiDemo.notes.map((note) => (
                <div
                  key={note}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm leading-6 text-slate-300"
                >
                  {note}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <p className="text-sm font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
            Traffic flow
          </p>
          <div className="mt-4 space-y-3">
            {secure ? (
              <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
                Encrypted traffic moves from your device to the service without
                sitting openly on the network.
              </div>
            ) : (
              <div className="rounded-3xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm leading-6 text-rose-100">
                In an open network, an attacker may observe or tamper with
                traffic that is not protected.
              </div>
            )}

            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-sm font-semibold tracking-[0.2em] text-cyan-200 uppercase">
                Safe habits
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                <li>• Use trusted networks or a hotspot you control</li>
                <li>• Avoid sensitive logins on unknown Wi-Fi when possible</li>
                <li>• Check for HTTPS and think before sharing secrets</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

