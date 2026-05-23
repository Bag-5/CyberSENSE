import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-cybersense-shell", "public");

  if (request.nextUrl.pathname.startsWith("/superadmin")) {
    headers.set("x-cybersense-shell", "superadmin");
  }

  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: ["/superadmin", "/superadmin/:path*"],
};
