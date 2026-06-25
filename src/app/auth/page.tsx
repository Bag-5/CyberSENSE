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

type AuthPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const returnToParam = resolvedSearchParams.returnTo;
  const returnTo = Array.isArray(returnToParam)
    ? returnToParam[0] ?? "/threats"
    : returnToParam ?? "/threats";
  const normalizedReturnTo = typeof returnTo === "string" ? returnTo : "/";
  const safeReturnTo =
    normalizedReturnTo.startsWith("/") && !normalizedReturnTo.startsWith("//")
      ? normalizedReturnTo
      : "/threats";
  const wantsSuperAdmin = safeReturnTo.startsWith("/superadmin");

  const [user, superAdmin] = await Promise.all([
    getCurrentSessionUser(),
    getCurrentSessionUser("superadmin"),
  ]);

  if (wantsSuperAdmin) {
    if (superAdmin) {
      redirect("/superadmin");
    }

    return <AuthPanel />;
  }

  if (user) {
    redirect(safeReturnTo === "/superadmin" ? "/threats" : safeReturnTo);
  }

  if (superAdmin) {
    redirect(safeReturnTo === "/superadmin" ? "/superadmin" : safeReturnTo);
  }

  return <AuthPanel />;
}
