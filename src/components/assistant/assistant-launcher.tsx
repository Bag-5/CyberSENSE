"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { AssistantChat } from "@/components/assistant/assistant-chat";
import { cyberButtonClasses } from "@/components/ui/cyber";
import { readStoredSessionUser, subscribeToAuthSessionChanges } from "@/lib/auth/session-client";
import type { PublicSessionUser } from "@/lib/auth/types";
import { cn } from "@/utils/cn";

type AssistantLauncherProps = {
  initialUser?: PublicSessionUser | null;
};

function AssistantGlyph() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8">
      <defs>
        <linearGradient id="assistant-glyph" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#f5d98b" />
          <stop offset="100%" stopColor="#006b3f" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="rgba(8,16,32,0.88)" stroke="url(#assistant-glyph)" strokeWidth="1.4" />
      <path
        d="M14 18.75C14 15.57 16.57 13 19.75 13h8.5C31.43 13 34 15.57 34 18.75v6.5C34 28.43 31.43 31 28.25 31H23.5l-5.4 4.1c-.5.38-1.24.02-1.24-.62V31h-1.1C15.57 31 13 28.43 13 25.25v-6.5c0-.17.01-.33.03-.5"
        fill="none"
        stroke="url(#assistant-glyph)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 20.5h9M19.5 24h5.5"
        stroke="#fef3c7"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="34.5" cy="15.5" r="2.4" fill="#ce1126" />
    </svg>
  );
}

const COMPACT_ASSISTANT_TIP_KEY = "cybersense.assistant.compact-tip.seen";

export function AssistantLauncher({ initialUser = null }: AssistantLauncherProps) {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const [user, setUser] = useState<PublicSessionUser | null>(initialUser);
  const [open, setOpen] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const cachedUser = readStoredSessionUser();
      if (cachedUser && active) {
        setUser(cachedUser);
      }

      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const payload = (await response.json()) as { user: PublicSessionUser | null };
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

    const unsubscribe = subscribeToAuthSessionChanges(() => {
      void loadUser();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!open || typeof window === "undefined") {
      return;
    }

    if (window.sessionStorage.getItem(COMPACT_ASSISTANT_TIP_KEY) === "seen") {
      return;
    }

    const frame = window.requestAnimationFrame(() => setShowTip(true));
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!showTip || typeof window === "undefined") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowTip(false);
      window.sessionStorage.setItem(COMPACT_ASSISTANT_TIP_KEY, "seen");
    }, 7000);

    return () => window.clearTimeout(timeout);
  }, [showTip]);

  const launcherLabel = useMemo(
    () => (user ? `CyberSENSE Assistant · ${user.username}` : "CyberSENSE Assistant"),
    [user],
  );

  if (!user || pathname?.startsWith("/assistant")) {
    return null;
  }

  return (
    <>
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.08}
        onDragEnd={(_, info) => {
          x.set(x.get() + info.offset.x);
          y.set(y.get() + info.offset.y);
        }}
        style={{
          x,
          y,
        }}
        className="fixed bottom-6 right-6 z-[70] select-none"
      >
        <button
          type="button"
          aria-label={launcherLabel}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "group flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-cyan-300/20 bg-slate-950/80 shadow-[0_0_30px_rgba(34,211,238,0.2)] backdrop-blur-xl transition hover:scale-105",
            "focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
          )}
          title="Open CyberSENSE Assistant"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,rgba(206,17,38,0.7),rgba(252,209,22,0.8),rgba(0,107,63,0.7),rgba(206,17,38,0.7))] opacity-55 blur-md transition group-hover:opacity-75"
          />
          <span className="relative z-10">
            <AssistantGlyph />
          </span>
          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border border-slate-950 bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.75)]" />
        </button>
      </motion.div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={reduceMotion ? { duration: 0.01 } : { duration: 0.28, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-[65] w-[min(30rem,calc(100vw-1.25rem))]"
          >
            <AnimatePresence>
              {showTip ? (
                <motion.div
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  transition={reduceMotion ? { duration: 0.01 } : { duration: 0.22, ease: "easeOut" }}
                  className="mb-3 rounded-[1.35rem] border border-cyan-300/20 bg-slate-950/90 px-4 py-3 text-sm leading-6 text-slate-200 shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p>
                      Quick tip: this mini assistant is for fast questions. Use the main Assistant
                      page if you want more room for a longer chat.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTip(false);
                        if (typeof window !== "undefined") {
                          window.sessionStorage.setItem(COMPACT_ASSISTANT_TIP_KEY, "seen");
                        }
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AssistantChat compact currentName={user.username} className="overflow-hidden" />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={cyberButtonClasses("ghost", "sm")}
              >
                Close assistant
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
