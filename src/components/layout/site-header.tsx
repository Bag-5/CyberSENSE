"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { authenticatedNavLinks } from "@/data/site";
import type { PublicSessionUser } from "@/lib/auth/types";
import { cyberButtonClasses } from "@/components/ui/cyber";
import { cn } from "@/utils/cn";
import { SiteLogo } from "@/components/layout/site-logo";

type AuthResponse = {
  user: PublicSessionUser | null;
};

export function SiteHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<PublicSessionUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });
        const payload = (await response.json()) as AuthResponse;
        if (active) {
          setUser(payload.user);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      }
    }

    void loadUser();

    return () => {
      active = false;
    };
  }, []);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const isAuthenticated = Boolean(user);
  const visibleLinks = isAuthenticated ? authenticatedNavLinks : [];

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-400/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <SiteLogo className="w-[15.5rem] sm:w-[18rem]" />

          <div className="flex items-center gap-3 lg:hidden">
            {isAuthenticated ? (
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-controls="primary-navigation"
                onClick={() => setMenuOpen((value) => !value)}
                className={cyberButtonClasses("ghost", "sm")}
              >
                {menuOpen ? "Close" : "Menu"}
              </button>
            ) : null}

            <Link
              href="/auth"
              className={cn(
                cyberButtonClasses("secondary", "sm"),
                "shadow-[0_0_28px_rgba(234,179,8,0.14)]",
              )}
            >
              {isAuthenticated ? "Open Dashboard" : "Sign in"}
            </Link>
          </div>
        </div>

        {isAuthenticated ? (
          <nav
            id="primary-navigation"
            aria-label="Primary"
            className={cn(
              "flex flex-wrap items-center gap-2 rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-2 text-sm shadow-[0_0_30px_rgba(15,23,42,0.45)] transition lg:flex-1 lg:justify-center lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none",
              menuOpen
                ? "max-h-[32rem] opacity-100 lg:max-h-none"
                : "pointer-events-none max-h-0 overflow-hidden opacity-0 lg:pointer-events-auto lg:max-h-none lg:overflow-visible lg:opacity-100",
            )}
          >
            {visibleLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 transition",
                    active
                      ? "bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/20"
                      : "text-slate-300 hover:bg-white/5 hover:text-cyan-100",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-2 flex flex-col gap-3 pt-2 lg:hidden">
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                {user?.username}
              </div>
              <SignOutButton />
            </div>
          </nav>
        ) : null}

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
                {user?.username}
              </div>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/auth"
              className={cyberButtonClasses("secondary", "sm", "shadow-[0_0_28px_rgba(234,179,8,0.14)]")}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
