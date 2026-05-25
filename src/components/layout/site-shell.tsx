import type { ReactNode } from "react";

import { AssistantLauncher } from "@/components/assistant/assistant-launcher";
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
      <SiteHeader platformSettings={platformSettings} initialUser={currentUser} />
      <main id="main-content" className="relative flex-1 focus:outline-none">
        {children}
      </main>
      <AssistantLauncher initialUser={currentUser} />
      <SiteFooter />
    </div>
  );
}
