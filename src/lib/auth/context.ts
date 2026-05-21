import { cookies } from "next/headers";

import { verifySessionToken } from "@/lib/auth/crypto";
import { sessionCookieName } from "@/lib/auth/constants";
import type { PublicSessionUser } from "@/lib/auth/types";

export async function getCurrentSessionUser(): Promise<PublicSessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) {
    return null;
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return null;
  }

  return {
    id: payload.userId,
    username: payload.username,
    email: payload.email,
    role: payload.role,
  };
}
