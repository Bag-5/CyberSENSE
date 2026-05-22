import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthPanel } from "@/components/auth/auth-panel";
import { getCurrentSessionUser } from "@/lib/auth/context";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Create a CyberSENSE account with a username, email, and OTP verification.",
};

export default async function AuthPage() {
  const user = await getCurrentSessionUser();

  if (user) {
    redirect(user.role === "superadmin" ? "/superadmin" : "/");
  }

  return <AuthPanel />;
}
