"use client";

import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/auth");
  }

  return (
    <button
      type="button"
      onClick={() => {
        void handleSignOut();
      }}
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
    >
      Sign out
    </button>
  );
}
