import { NextResponse } from "next/server";

import { verifySessionToken } from "@/lib/auth/crypto";
import { sessionCookieName } from "@/lib/auth/constants";
import { updateQuizCompletion } from "@/lib/auth/store";
import { recordAnalyticsEvent } from "@/lib/analytics/store";
import { recordWeeklyCompetitionResult } from "@/lib/competition/store";
import { getCurrentWeeklyCompetitionKey } from "@/lib/competition/utils";
import { getPlatformSettings } from "@/lib/superadmin/settings";

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
      correctCount?: number;
      totalQuestions?: number;
    };

    if (typeof body.quizSlug !== "string" || typeof body.score !== "number") {
      return NextResponse.json(
        { error: "quizSlug and score are required." },
        { status: 400 },
      );
    }

    if (body.quizSlug === "weekly-competition") {
      const platformSettings = await getPlatformSettings().catch(() => null);
      const weeklyCompetition = platformSettings?.weeklyCompetition ?? null;
      const currentCompetitionKey = getCurrentWeeklyCompetitionKey();
      const isPublished =
        Boolean(weeklyCompetition?.published) &&
        weeklyCompetition?.competitionKey === currentCompetitionKey;

      if (!isPublished) {
        return NextResponse.json(
          { error: "The weekly competition is not published yet." },
          { status: 403 },
        );
      }

      if (typeof body.correctCount !== "number" || typeof body.totalQuestions !== "number") {
        return NextResponse.json(
          { error: "correctCount and totalQuestions are required for the weekly competition." },
          { status: 400 },
        );
      }

      await recordWeeklyCompetitionResult({
        userId: session.userId,
        username: session.username,
        email: session.email,
        score: body.score,
        correctCount: body.correctCount,
        totalQuestions: body.totalQuestions,
      });

      void recordAnalyticsEvent({
        eventType: "weekly_competition_completed",
        module: "quiz",
        slug: body.quizSlug,
        portal: "user",
        userId: session.userId,
        metadata: {
          score: body.score,
          correctCount: body.correctCount,
          totalQuestions: body.totalQuestions,
        },
      });

      return NextResponse.json({ ok: true });
    }

    const updatedUser = await updateQuizCompletion(session.userId, body.quizSlug, body.score);
    if (!updatedUser) {
      return NextResponse.json(
        { error: "Could not update the quiz score." },
        { status: 500 },
      );
    }

    void recordAnalyticsEvent({
      eventType: "quiz_completed",
      module: "quiz",
      slug: body.quizSlug,
      portal: "user",
      userId: session.userId,
      metadata: {
        score: body.score,
      },
    });

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
