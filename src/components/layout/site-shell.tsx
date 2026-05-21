import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <a
        href="#main-content"
        className="sr-only rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="relative flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
