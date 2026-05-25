import { quizCategories } from "@/data/quizzes";
import type { QuizCategory, QuizQuestion } from "@/types/quiz";

function buildWeeklyQuestions(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  for (const quiz of quizCategories) {
    questions.push(
      ...quiz.questions.slice(0, 10).map((question, index) => ({
        ...question,
        id: `weekly-${quiz.slug}-${index + 1}`,
      })),
    );
  }

  return questions.slice(0, 100);
}

export const weeklyCompetitionQuiz: QuizCategory = {
  slug: "weekly-competition",
  title: "Weekly Quiz Competition",
  description:
    "A 100-question academy-wide competition curated from every Threat Academy course.",
  icon: "🏆",
  accent: "Gold circuit",
  questions: buildWeeklyQuestions(),
};

export const weeklyCompetitionSummary = {
  totalQuestions: weeklyCompetitionQuiz.questions.length,
  courseCount: quizCategories.length,
  questionCountPerCourse: 10,
};
