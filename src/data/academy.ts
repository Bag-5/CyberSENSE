import { quizCategories } from "@/data/quizzes";
import type { QuizCategory, QuizCategorySlug } from "@/types/quiz";

export type AcademyCourse = {
  threatSlug: string;
  quizSlug: QuizCategorySlug;
  title: string;
  description: string;
  order: number;
};

export const academyCourses: AcademyCourse[] = [
  {
    threatSlug: "phishing",
    quizSlug: "phishing",
    title: "Phishing",
    description: "Spot fake links, MoMo alerts, and verification traps.",
    order: 1,
  },
  {
    threatSlug: "social-engineering",
    quizSlug: "social-engineering",
    title: "Social Engineering",
    description: "Recognize pressure tactics, fake authority, and emotional manipulation.",
    order: 2,
  },
  {
    threatSlug: "malware",
    quizSlug: "malware",
    title: "Malware",
    description: "Learn how harmful downloads, attachments, and fake updates spread.",
    order: 3,
  },
  {
    threatSlug: "password-attacks",
    quizSlug: "password-security",
    title: "Password Security",
    description: "Build stronger logins and defend against stolen credentials.",
    order: 4,
  },
  {
    threatSlug: "public-wi-fi-attacks",
    quizSlug: "public-wi-fi-safety",
    title: "Public Wi-Fi Safety",
    description: "Understand hotspot risks and safer browsing habits.",
    order: 5,
  },
  {
    threatSlug: "ransomware",
    quizSlug: "ransomware",
    title: "Ransomware",
    description: "See how file-locking attacks work and why backups matter.",
    order: 6,
  },
  {
    threatSlug: "fake-apps-scams",
    quizSlug: "fake-apps",
    title: "Fake Apps",
    description: "Review suspicious mobile apps and permission abuse.",
    order: 7,
  },
  {
    threatSlug: "deepfakes",
    quizSlug: "deepfakes",
    title: "Deepfakes",
    description: "Identify manipulated videos and fake visual authority.",
    order: 8,
  },
  {
    threatSlug: "voice-cloning-scams",
    quizSlug: "voice-cloning-scams",
    title: "Voice Cloning Scams",
    description: "Check calls, voice notes, and urgent money requests carefully.",
    order: 9,
  },
  {
    threatSlug: "ai-misinformation",
    quizSlug: "ai-threats",
    title: "AI Misinformation",
    description: "Verify AI-generated claims and misleading content before sharing.",
    order: 10,
  },
];

const quizBySlug = new Map(quizCategories.map((quiz) => [quiz.slug, quiz] as const));

export const academyQuizSlugs = academyCourses.map((course) => course.quizSlug);

export function getAcademyCourseByThreatSlug(threatSlug: string) {
  return academyCourses.find((course) => course.threatSlug === threatSlug) ?? null;
}

export function getAcademyQuizByThreatSlug(threatSlug: string): QuizCategory | null {
  const course = getAcademyCourseByThreatSlug(threatSlug);
  if (!course) {
    return null;
  }

  return quizBySlug.get(course.quizSlug) ?? null;
}

export function isAcademyComplete(completedQuizSlugs: Iterable<string>) {
  const completed = new Set(completedQuizSlugs);
  return academyCourses.every((course) => completed.has(course.quizSlug));
}
