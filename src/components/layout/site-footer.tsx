import Link from "next/link";

import { getCurrentSessionUser } from "@/lib/auth/context";
import { authenticatedNavLinks } from "@/data/site";
import { SiteLogo } from "@/components/layout/site-logo";
import { getPlatformSettings } from "@/lib/superadmin/settings";

function isLinkEnabled(href: string, platformSettings: Awaited<ReturnType<typeof getPlatformSettings>> | null) {
  if (!platformSettings) {
    return true;
  }

  if (href === "/threats" || href.startsWith("/threats/")) {
    return platformSettings.modules.threatAcademy;
  }

  if (href === "/quizzes" || href.startsWith("/quizzes/")) {
    return platformSettings.modules.quizzes;
  }

  if (href === "/weekly-quiz-competition") {
    return platformSettings.modules.quizzes;
  }

  if (href === "/lab") {
    return platformSettings.modules.attackLab;
  }

  if (href === "/games/red-flags") {
    return platformSettings.modules.redFlags;
  }

  if (href === "/#simulations") {
    return platformSettings.modules.simulations;
  }

  if (href === "/threats/analyzer") {
    return platformSettings.modules.aiAnalyzer;
  }

  return true;
}

export async function SiteFooter() {
  const user = await getCurrentSessionUser();
  const platformSettings = await getPlatformSettings().catch(() => null);
  const currentYear = new Date().getFullYear();
  const isSuperAdmin = user?.role === "superadmin";

  return (
    <footer className="border-t border-cyan-400/10 bg-slate-950/80">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-4">
          <SiteLogo className="w-[15.5rem]" />
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            An interactive cybersecurity awareness platform with playful
            missions, sharp visuals, and beginner-friendly training.
          </p>
          <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
            © {currentYear}. Built for cyber awareness.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="mb-3 text-sm font-medium text-slate-200">
              {user ? "Quick links" : "Access"}
            </p>
            {user ? (
              <ul className="space-y-2 text-sm text-slate-400">
                {isSuperAdmin ? (
                  <li>
                    <Link
                      href="/superadmin"
                      className="transition hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                      Super Admin
                    </Link>
                  </li>
                ) : null}
                {authenticatedNavLinks.filter((link) => isLinkEnabled(link.href, platformSettings)).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-4">
                <p className="text-sm leading-6 text-slate-400">
                  Sign in to unlock the academy and the weekly competition route.
                </p>
                <Link
                  href="/auth"
                  className="inline-flex rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-400/15 hover:text-amber-50"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="mb-3 text-sm font-medium text-slate-200">Focus</p>
              <p className="text-sm leading-6 text-slate-400">
              Dark mode, neon glow, subtle Ghana-inspired accent tones, and
              modular learning flows ready for course checkpoints and weekly
              competitions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
