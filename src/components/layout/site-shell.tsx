import type { ReactNode } from "react";

import { getCurrentSessionUser } from "@/lib/auth/context";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPlatformSettings } from "@/lib/superadmin/settings";

type SiteShellProps = {
  children: ReactNode;
};

export async function SiteShell({ children }: SiteShellProps) {
  let platformSettings = null;
  let currentUser = null;

  try {
    [platformSettings, currentUser] = await Promise.all([
      getPlatformSettings(),
      getCurrentSessionUser(),
    ]);
  } catch {
    platformSettings = null;
    currentUser = null;
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <a
        href="#main-content"
        className="sr-only rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
      >
        Skip to content
      </a>
      {platformSettings ? (
        <div
          className={[
            "border-b px-4 py-2 text-sm backdrop-blur-xl sm:px-6 lg:px-8",
            platformSettings.maintenanceMode
              ? "border-rose-400/20 bg-rose-400/10 text-rose-50"
              : "border-amber-300/15 bg-amber-400/8 text-amber-50",
          ].join(" ")}
        >
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
            <p className="font-medium">
              {platformSettings.maintenanceMode
                ? "CyberSENSE is in maintenance mode for privileged work."
                : platformSettings.announcement}
            </p>
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100 sm:inline-flex">
              Superadmin controlled
            </span>
          </div>
        </div>
      ) : null}
      <SiteHeader platformSettings={platformSettings} initialUser={currentUser} />
      <main id="main-content" className="relative flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
