import { NextResponse } from "next/server";

import { getCurrentSessionUser } from "@/lib/auth/context";

export async function GET() {
  const user = await getCurrentSessionUser();
  return NextResponse.json({ user });
}
