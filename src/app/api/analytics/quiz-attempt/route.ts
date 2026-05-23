import { NextResponse } from "next/server";

import { recordQuizAttempt } from "@/lib/analytics/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      quizSlug?: string;
      quizTitle?: string;
      questionId?: string;
      questionText?: string;
      category?: string;
      difficulty?: string;
      selectedAnswer?: string;
      correctAnswer?: string;
      isCorrect?: boolean;
      points?: number;
    };

    if (
      typeof body.quizSlug !== "string" ||
      typeof body.quizTitle !== "string" ||
      typeof body.questionId !== "string" ||
      typeof body.questionText !== "string" ||
      typeof body.category !== "string" ||
      typeof body.difficulty !== "string" ||
      typeof body.selectedAnswer !== "string" ||
      typeof body.correctAnswer !== "string" ||
      typeof body.isCorrect !== "boolean" ||
      typeof body.points !== "number"
    ) {
      return NextResponse.json(
        { error: "Incomplete quiz attempt payload." },
        { status: 400 },
      );
    }

    await recordQuizAttempt({
      quizSlug: body.quizSlug,
      quizTitle: body.quizTitle,
      questionId: body.questionId,
      questionText: body.questionText,
      category: body.category,
      difficulty: body.difficulty,
      selectedAnswer: body.selectedAnswer,
      correctAnswer: body.correctAnswer,
      isCorrect: body.isCorrect,
      points: body.points,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not record quiz attempt.",
      },
      { status: 500 },
    );
  }
}
