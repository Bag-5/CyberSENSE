import Link from "next/link";

import { navLinks, siteName } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-400/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.18)] transition duration-300 group-hover:scale-105 group-hover:border-cyan-300/60">
              CS
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-[0.22em] text-cyan-100 uppercase">
                {siteName}
              </p>
              <p className="text-xs text-slate-400">
                Cyber awareness, but make it vivid.
              </p>
            </div>
          </Link>

          <Link
            href="/quizzes"
            className="inline-flex items-center justify-center rounded-full border border-fuchsia-400/40 bg-fuchsia-500/15 px-4 py-2 text-sm font-medium text-fuchsia-100 shadow-[0_0_28px_rgba(217,70,239,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-fuchsia-500/25 hover:shadow-[0_0_34px_rgba(217,70,239,0.28)] lg:hidden"
          >
            Take a Quiz
          </Link>
        </div>

        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center gap-2 text-sm lg:justify-center"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-cyan-100 sm:px-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/quizzes"
          className="hidden items-center justify-center rounded-full border border-fuchsia-400/40 bg-fuchsia-500/15 px-4 py-2 text-sm font-medium text-fuchsia-100 shadow-[0_0_28px_rgba(217,70,239,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-fuchsia-500/25 hover:shadow-[0_0_34px_rgba(217,70,239,0.28)] lg:inline-flex"
        >
          Take a Quiz
        </Link>
      </div>
    </header>
  );
}
