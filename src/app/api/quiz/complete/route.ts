import { NextResponse } from "next/server";

import { verifySessionToken } from "@/lib/auth/crypto";
import { sessionCookieName } from "@/lib/auth/constants";
import { updateQuizCompletion } from "@/lib/auth/store";

function getTokenFromCookie(header: string | null) {
  if (!header) {
    return null;
  }

  const match = header.match(new RegExp(`${sessionCookieName}=([^;]+)`));
  return match?.[1] ?? null;
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      quizSlug?: string;
      score?: number;
    };

    if (typeof body.quizSlug !== "string" || typeof body.score !== "number") {
      return NextResponse.json(
        { error: "quizSlug and score are required." },
        { status: 400 },
      );
    }

    const updatedUser = await updateQuizCompletion(session.userId, body.quizSlug, body.score);
    if (!updatedUser) {
      return NextResponse.json(
        { error: "Could not update the quiz score." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not save the quiz score.",
      },
      { status: 500 },
    );
  }
}
