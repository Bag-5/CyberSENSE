import Link from "next/link";

import { getCurrentSessionUser } from "@/lib/auth/context";
import { authenticatedNavLinks, publicNavLinks, siteName } from "@/data/site";

export async function SiteFooter() {
  const user = await getCurrentSessionUser();
  const currentYear = new Date().getFullYear();
  const navItems = user ? authenticatedNavLinks : [...publicNavLinks, { label: "Sign in", href: "/auth" }];

  return (
    <footer className="border-t border-cyan-400/10 bg-slate-950/80">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold tracking-[0.2em] text-cyan-200 uppercase">
            {siteName}
          </p>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            CyberSENSE turns everyday cyber safety into a guided practice
            arena, with playful missions, sharp visuals, and beginner-friendly
            training.
          </p>
          <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
            © {currentYear} {siteName}. Built for cyber awareness.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium text-slate-200">
              {user ? "Quick links" : "Get started"}
            </p>
            <ul className="space-y-2 text-sm text-slate-400">
              {navItems.map((link) => (
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
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-slate-200">Focus</p>
            <p className="text-sm leading-6 text-slate-400">
              Dark mode, neon glow, responsive layout, and modular components
              ready for future simulations and games.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
