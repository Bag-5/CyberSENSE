"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { cyberButtonClasses } from "@/components/ui/cyber";

type SuperAdminShellProps = {
  children: ReactNode;
};

export function SuperAdminShell({ children }: SuperAdminShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_24%),linear-gradient(180deg,#04050a_0%,#030408_44%,#020306_100%)] text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(234,179,8,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] [background-size:88px_88px]" />

      <header className="relative z-10 border-b border-amber-300/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ boxShadow: ["0 0 0 rgba(234,179,8,0.0)", "0 0 28px rgba(234,179,8,0.18)", "0 0 0 rgba(234,179,8,0.0)"] }}
              transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="rounded-[1.2rem] border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-center"
            >
              <p className="text-xs font-semibold tracking-[0.32em] text-amber-100 uppercase">
                Super Admin
              </p>
              <p className="mt-1 text-sm font-semibold tracking-[0.2em] text-amber-50 uppercase">
                Control Deck
              </p>
            </motion.div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-[0.22em] text-slate-300 uppercase">
                CyberSENSE Operations
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Privileged platform controls and emergency governance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100">
              Allowlisted
            </span>
            <SignOutButton className={cyberButtonClasses("secondary", "sm")} />
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
