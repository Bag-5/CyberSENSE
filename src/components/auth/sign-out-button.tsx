"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/utils/cn";
import {
  clearStoredSessionUser,
  notifyAuthSessionChanged,
} from "@/lib/auth/session-client";

type SignOutButtonProps = {
  className?: string;
};

export function SignOutButton({ className }: SignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    clearStoredSessionUser();
    notifyAuthSessionChanged();
    router.refresh();
    router.push("/auth");
  }

  return (
    <button
      type="button"
      onClick={() => {
        void handleSignOut();
      }}
      className={cn(
        "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white",
        className,
      )}
    >
      Sign out
    </button>
  );
}
