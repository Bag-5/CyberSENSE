import { NextResponse } from "next/server";

import {
  deletePendingOtp,
  getPendingOtp,
  maskEmail,
  setPendingOtp,
} from "@/lib/auth/store";
import { generateOtpCode, hashOtpCode } from "@/lib/auth/crypto";
import { sendOtpEmail } from "@/lib/email";

export const runtime = "nodejs";

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeUsername(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, 32) : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUsername(username: string) {
  return username.length >= 2 && username.length <= 32;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: unknown;
      username?: unknown;
    };

    const email = normalizeEmail(body.email);
    const username = normalizeUsername(body.username);

    if (!isValidEmail(email) || !isValidUsername(username)) {
      return NextResponse.json(
        { error: "Enter a valid username and email address." },
        { status: 400 },
      );
    }

    const code = generateOtpCode();
    const now = Date.now();
    const expiresAt = new Date(now + 10 * 60 * 1000).toISOString();
    const existing = await getPendingOtp(email);

    await setPendingOtp({
      email,
      username,
      codeHash: hashOtpCode(code, email),
      expiresAt,
      attempts: existing?.attempts ?? 0,
    });

    try {
      await sendOtpEmail({
        to: email,
        username,
        otp: code,
        expiresInMinutes: 10,
      });
    } catch (mailError) {
      console.error("OTP email send failed:", mailError);
      const allowDevFallback =
        process.env.NODE_ENV !== "production" &&
        process.env.CYBERSENSE_DEV_REVEAL_OTP !== "false";

      if (allowDevFallback) {
        return NextResponse.json({
          ok: true,
          email: maskEmail(email),
          expiresAt,
          devOtp: code,
          message: "OTP prepared. Use the code to complete signup or sign-in.",
        });
      }

      await deletePendingOtp(email);
      const message =
        mailError instanceof Error && mailError.message.trim()
          ? mailError.message
          : "OTP email could not be sent. Please check the mail configuration.";
      return NextResponse.json(
        {
          error: message,
        },
        { status: 500 },
      );
    }

    const devRevealOtp =
      process.env.NODE_ENV !== "production" &&
      process.env.CYBERSENSE_DEV_REVEAL_OTP !== "false"
        ? code
        : undefined;

    return NextResponse.json({
      ok: true,
      email: maskEmail(email),
      expiresAt,
      devOtp: devRevealOtp,
      message: "OTP prepared. Use the code to complete signup or sign-in.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not create the OTP right now.",
      },
      { status: 500 },
    );
  }
}
