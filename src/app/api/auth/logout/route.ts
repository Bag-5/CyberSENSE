import { NextResponse } from "next/server";

import {
  getSessionCookieName,
  getSessionCookiePath,
  type AuthPortal,
} from "@/lib/auth/constants";

function normalizePortal(value: string | null): AuthPortal {
  return value === "superadmin" ? "superadmin" : "user";
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const portal = normalizePortal(url.searchParams.get("portal"));
  const response = NextResponse.redirect(
    new URL(portal === "superadmin" ? "/auth?returnTo=%2Fsuperadmin" : "/auth", request.url),
  );
  response.cookies.set(getSessionCookieName(portal), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: getSessionCookiePath(portal),
    maxAge: 0,
  });
  return response;
}
