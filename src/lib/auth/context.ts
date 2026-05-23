import { cookies } from "next/headers";

import { verifySessionToken } from "@/lib/auth/crypto";
import { getSessionCookieName, type AuthPortal } from "@/lib/auth/constants";
import type { PublicSessionUser } from "@/lib/auth/types";

export async function getCurrentSessionUser(
  portal: AuthPortal = "user",
): Promise<PublicSessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName(portal))?.value;
  if (!token) {
    return null;
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return null;
  }

  if (portal === "superadmin" && payload.role !== "superadmin") {
    return null;
  }

  if (portal === "user" && payload.role === "superadmin") {
    return null;
  }

  return {
    id: payload.userId,
    username: payload.username,
    email: payload.email,
    role: payload.role,
  };
}

export async function getAnySessionUser(): Promise<
  | {
      user: PublicSessionUser;
      portal: AuthPortal;
    }
  | null
> {
  const user = await getCurrentSessionUser();
  if (user) {
    return { user, portal: "user" };
  }

  const superadmin = await getCurrentSessionUser("superadmin");
  if (superadmin) {
    return { user: superadmin, portal: "superadmin" };
  }

  return null;
}
