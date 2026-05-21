import type {
  QuizCategory,
  QuizCompletionRecord,
  QuizProgressState,
  QuizResultSummary,
} from "@/types/quiz";
import { evaluateQuizAchievements } from "@/lib/quiz/achievements";

const PROGRESS_KEY = "cybersense.quiz.progress";
const QUIZ_PROGRESS_EVENT = "cybersense:quiz-progress";

function defaultProgress(): QuizProgressState {
  return {
    completedQuizzes: {},
    achievements: [],
    totalAttempts: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageScore: 0,
  };
}

const defaultProgressState = defaultProgress();
let cachedProgress = defaultProgressState;
let cachedSerialized = JSON.stringify(defaultProgressState);

export function getDefaultQuizProgress() {
  return defaultProgressState;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDateKey(dateKey: string, offset: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + offset);
  return getDateKey(date);
}

function computeAverageScore(progress: QuizProgressState) {
  const scores = Object.values(progress.completedQuizzes)
    .filter(Boolean)
    .map((record) => record!.score);
  if (!scores.length) {
    return 0;
  }
  return Math.round(scores.reduce((total, score) => total + score, 0) / scores.length);
}

export function loadQuizProgress(): QuizProgressState {
  if (!isBrowser()) {
    return defaultProgressState;
  }

  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      cachedProgress = defaultProgressState;
      cachedSerialized = JSON.stringify(defaultProgressState);
      return defaultProgressState;
    }

    if (raw === cachedSerialized) {
      return cachedProgress;
    }

    const parsed = JSON.parse(raw) as Partial<QuizProgressState>;
    cachedProgress = {
      ...defaultProgressState,
      ...parsed,
      completedQuizzes: parsed.completedQuizzes ?? {},
      achievements: parsed.achievements ?? [],
      totalAttempts: parsed.totalAttempts ?? 0,
      currentStreak: parsed.currentStreak ?? 0,
      longestStreak: parsed.longestStreak ?? 0,
      averageScore: parsed.averageScore ?? 0,
    };
    cachedSerialized = raw;
    return cachedProgress;
  } catch {
    cachedProgress = defaultProgressState;
    cachedSerialized = JSON.stringify(defaultProgressState);
    return defaultProgressState;
  }
}

export function saveQuizProgress(progress: QuizProgressState) {
  if (!isBrowser()) {
    return;
  }

  cachedProgress = progress;
  cachedSerialized = JSON.stringify(progress);
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event(QUIZ_PROGRESS_EVENT));
}

export function subscribeQuizProgress(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handler = () => callback();
  window.addEventListener(QUIZ_PROGRESS_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(QUIZ_PROGRESS_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function recordQuizCompletion(
  quiz: QuizCategory,
  summary: QuizResultSummary,
): { progress: QuizProgressState; newAchievements: ReturnType<typeof evaluateQuizAchievements> } {
  const previousProgress = loadQuizProgress();
  const todayKey = getDateKey();
  const yesterdayKey = shiftDateKey(todayKey, -1);
  const lastCompletedAt = previousProgress.lastCompletedAt;
  let currentStreak = previousProgress.currentStreak;

  if (lastCompletedAt === todayKey) {
    currentStreak = previousProgress.currentStreak;
  } else if (lastCompletedAt === yesterdayKey) {
    currentStreak = previousProgress.currentStreak + 1;
  } else {
    currentStreak = 1;
  }

  const record: QuizCompletionRecord = {
    slug: quiz.slug,
    title: quiz.title,
    score: summary.score,
    percentage: summary.percentage,
    correctCount: summary.correctCount,
    totalQuestions: summary.totalQuestions,
    completedAt: new Date().toISOString(),
  };

  const nextProgress: QuizProgressState = {
    ...previousProgress,
    completedQuizzes: {
      ...previousProgress.completedQuizzes,
      [quiz.slug]: record,
    },
    totalAttempts: previousProgress.totalAttempts + 1,
    currentStreak,
    longestStreak: Math.max(previousProgress.longestStreak, currentStreak),
    lastCompletedAt: todayKey,
    averageScore: 0,
  };

  nextProgress.averageScore = computeAverageScore(nextProgress);

  const newAchievements = evaluateQuizAchievements(
    quiz,
    summary,
    previousProgress,
    record,
  );
  nextProgress.achievements = Array.from(
    new Set([
      ...previousProgress.achievements,
      ...newAchievements.map((achievement) => achievement.id),
    ]),
  );

  saveQuizProgress(nextProgress);

  return { progress: nextProgress, newAchievements };
}
