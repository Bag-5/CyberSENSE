import { NextResponse } from "next/server";

import { createSessionToken, hashOtpCode } from "@/lib/auth/crypto";
import { resolveAuthRole } from "@/lib/auth/roles";
import {
  buildSessionUser,
  consumePendingOtp,
  getPendingOtp,
  setPendingOtp,
  upsertUserFromSession,
} from "@/lib/auth/store";
import { sessionCookieName } from "@/lib/auth/constants";
function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeUsername(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, 32) : "";
}

function isValidOtp(value: unknown) {
  return typeof value === "string" && /^\d{6}$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: unknown;
      username?: unknown;
      otp?: unknown;
    };

    const email = normalizeEmail(body.email);
    const username = normalizeUsername(body.username);
    const otp = typeof body.otp === "string" ? body.otp.trim() : "";

    if (!email || !username || !isValidOtp(otp)) {
      return NextResponse.json(
        { error: "Provide your email, username, and the 6-digit OTP." },
        { status: 400 },
      );
    }

    const pending = await getPendingOtp(email);
    if (!pending) {
      return NextResponse.json(
        { error: "No pending OTP found for that email." },
        { status: 400 },
      );
    }

    if (new Date(pending.expiresAt).getTime() < Date.now()) {
      await consumePendingOtp(email);
      return NextResponse.json(
        { error: "That OTP expired. Please request a fresh code." },
        { status: 400 },
      );
    }

    if (pending.attempts >= 5) {
      await consumePendingOtp(email);
      return NextResponse.json(
        { error: "Too many attempts. Request a new OTP." },
        { status: 429 },
      );
    }

    const hashed = hashOtpCode(otp, email);
    if (hashed !== pending.codeHash) {
      const current = await getPendingOtp(email);
      if (current) {
        await setPendingOtp({
          ...current,
          attempts: current.attempts + 1,
        });
      }
      return NextResponse.json(
        { error: "That OTP is not correct." },
        { status: 400 },
      );
    }

    await consumePendingOtp(email);

    const role = resolveAuthRole(email);

    const existingUser = await upsertUserFromSession({
      id: "",
      username,
      email,
      role,
    });

    const sessionToken = createSessionToken({
      userId: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
      role: existingUser.role,
    });

    const response = NextResponse.json({
      ok: true,
      user: buildSessionUser(existingUser),
      message: "Signed in successfully.",
    });

    response.cookies.set(sessionCookieName, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not verify the OTP right now.",
      },
      { status: 500 },
    );
  }
}
