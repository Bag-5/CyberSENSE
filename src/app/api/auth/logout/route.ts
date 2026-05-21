import { NextResponse } from "next/server";

import { sessionCookieName } from "@/lib/auth/constants";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/auth", request.url));
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
