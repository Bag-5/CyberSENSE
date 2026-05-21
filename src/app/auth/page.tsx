import type { Metadata } from "next";

import { AuthPanel } from "@/components/auth/auth-panel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Create a CyberSENSE account with a username, email, and OTP verification.",
};

export default async function AuthPage() {
  return <AuthPanel />;
}
