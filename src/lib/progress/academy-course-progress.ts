import type { QuizAchievement, QuizResultSummary } from "@/types/quiz";

const PROGRESS_PREFIX = "cybersense.academy.course.progress";
const PROGRESS_EVENT = "cybersense:academy-course-progress";

export type AcademyCourseStage = "lesson" | "quiz" | "lab" | "certificate" | "complete";

export type AcademyCourseQuizState = {
  currentIndex: number;
  selectedAnswer: string | null;
  submittedAnswers: Record<string, string>;
  showFeedback: boolean;
  summary: QuizResultSummary | null;
  unlockedAchievements: QuizAchievement[];
};

export type AcademyCourseProgress = {
  stage: AcademyCourseStage;
  quiz: AcademyCourseQuizState;
  updatedAt: string;
};

export const defaultAcademyCourseQuizState: AcademyCourseQuizState = {
  currentIndex: 0,
  selectedAnswer: null,
  submittedAnswers: {},
  showFeedback: false,
  summary: null,
  unlockedAchievements: [],
};

function isBrowser() {
  return typeof window !== "undefined";
}

function progressKey(threatSlug: string) {
  return `${PROGRESS_PREFIX}:${threatSlug}`;
}

function defaultProgress(): AcademyCourseProgress {
  return {
    stage: "lesson",
    quiz: { ...defaultAcademyCourseQuizState },
    updatedAt: new Date().toISOString(),
  };
}

function sanitizeQuizState(value: Partial<AcademyCourseQuizState> | undefined | null): AcademyCourseQuizState {
  return {
    currentIndex: typeof value?.currentIndex === "number" && Number.isFinite(value.currentIndex) ? value.currentIndex : 0,
    selectedAnswer: typeof value?.selectedAnswer === "string" ? value.selectedAnswer : null,
    submittedAnswers:
      value?.submittedAnswers && typeof value.submittedAnswers === "object"
        ? Object.fromEntries(
            Object.entries(value.submittedAnswers).filter(
              (entry): entry is [string, string] => typeof entry[0] === "string" && typeof entry[1] === "string",
            ),
        )
      : {},
    showFeedback: Boolean(value?.showFeedback),
    summary: value?.summary ?? null,
    unlockedAchievements: Array.isArray(value?.unlockedAchievements)
      ? (value.unlockedAchievements.filter((achievement) =>
          Boolean(
            achievement &&
              typeof achievement.id === "string" &&
              typeof achievement.title === "string" &&
              typeof achievement.description === "string" &&
              typeof achievement.icon === "string",
          ),
        ) as QuizAchievement[])
      : [],
  };
}

function sanitizeStage(value: unknown): AcademyCourseStage {
  return value === "quiz" || value === "lab" || value === "certificate" || value === "complete"
    ? value
    : "lesson";
}

export function loadAcademyCourseProgress(threatSlug: string): AcademyCourseProgress {
  if (!isBrowser()) {
    return defaultProgress();
  }

  try {
    const raw = window.localStorage.getItem(progressKey(threatSlug));
    if (!raw) {
      return defaultProgress();
    }

    const parsed = JSON.parse(raw) as Partial<AcademyCourseProgress>;
    return {
      stage: sanitizeStage(parsed.stage),
      quiz: sanitizeQuizState(parsed.quiz),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return defaultProgress();
  }
}

export function saveAcademyCourseProgress(threatSlug: string, progress: AcademyCourseProgress) {
  if (!isBrowser()) {
    return;
  }

  const serialized = JSON.stringify(progress);
  window.localStorage.setItem(progressKey(threatSlug), serialized);
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function clearAcademyCourseProgress(threatSlug: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(progressKey(threatSlug));
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function subscribeAcademyCourseProgress(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handler = () => callback();
  window.addEventListener(PROGRESS_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(PROGRESS_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
