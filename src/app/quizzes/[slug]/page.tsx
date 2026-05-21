import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuizPageShell } from "@/components/quiz/quiz-page-shell";
import { getQuizBySlug } from "@/data/quizzes";

export const dynamic = "force-dynamic";

type QuizPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { slug } = await params;
  const quiz = getQuizBySlug(slug);

  if (!quiz) {
    return {
      title: "Quiz",
    };
  }

  return {
    title: quiz.title,
    description: quiz.description,
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { slug } = await params;
  const quiz = getQuizBySlug(slug);

  if (!quiz) {
    notFound();
  }

  return <QuizPageShell quiz={quiz} />;
}
