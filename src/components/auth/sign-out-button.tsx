"use client";

import { useRouter } from "next/navigation";

import type { AuthPortal } from "@/lib/auth/constants";
import { cn } from "@/utils/cn";
import {
  clearStoredSessionUser,
  notifyAuthSessionChanged,
} from "@/lib/auth/session-client";

type SignOutButtonProps = {
  className?: string;
  portal?: AuthPortal;
  redirectTo?: string;
};

export function SignOutButton({
  className,
  portal = "user",
  redirectTo = "/auth",
}: SignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    await fetch(`/api/auth/logout?portal=${portal}`, { method: "POST" });
    clearStoredSessionUser(portal);
    notifyAuthSessionChanged(portal);
    router.replace(redirectTo);
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
