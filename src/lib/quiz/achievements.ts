import { quizAchievementPreview } from "@/data/quizzes";
import type {
  QuizAchievement,
  QuizAchievementId,
  QuizCategory,
  QuizCompletionRecord,
  QuizProgressState,
  QuizResultSummary,
} from "@/types/quiz";

export const quizAchievements = quizAchievementPreview;

const achievementMap = new Map<QuizAchievementId, QuizAchievement>(
  quizAchievementPreview.map((achievement) => [achievement.id, achievement]),
);

export function getQuizAchievement(id: QuizAchievementId) {
  return achievementMap.get(id);
}

export function evaluateQuizAchievements(
  quiz: QuizCategory,
  summary: QuizResultSummary,
  progress: QuizProgressState,
  record: QuizCompletionRecord,
) {
  const unlocked: QuizAchievement[] = [];
  const existing = new Set(progress.achievements);
  const uniqueCompleted = Object.keys(progress.completedQuizzes).length;

  const pushIfNew = (id: QuizAchievementId) => {
    if (!existing.has(id)) {
      const achievement = getQuizAchievement(id);
      if (achievement) {
        unlocked.push(achievement);
        existing.add(id);
      }
    }
  };

  pushIfNew("first-quiz");

  if (summary.percentage >= 90) {
    pushIfNew("scam-spotter");
  }

  if (quiz.slug === "phishing" && summary.percentage >= 80) {
    pushIfNew("phishing-expert");
  }

  if (quiz.slug === "password-security" && summary.percentage >= 80) {
    pushIfNew("password-guardian");
  }

  if (quiz.slug === "ai-threats" && summary.percentage >= 80) {
    pushIfNew("ai-threat-detective");
  }

  if (uniqueCompleted >= 5 || (uniqueCompleted >= 4 && record.score >= 90)) {
    pushIfNew("cyber-defender");
  }

  return unlocked;
}
