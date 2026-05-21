import type { QuizCategory, QuizResultSummary } from "@/types/quiz";

export function scoreQuiz(
  quiz: QuizCategory,
  answers: Record<string, string>,
): QuizResultSummary {
  const totalQuestions = quiz.questions.length;
  const correctCount = quiz.questions.filter(
    (question) => answers[question.id] === question.correctAnswer,
  ).length;
  const incorrectCount = totalQuestions - correctCount;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const missedQuestionIds = quiz.questions
    .filter((question) => answers[question.id] !== question.correctAnswer)
    .map((question) => question.id);

  return {
    correctCount,
    incorrectCount,
    totalQuestions,
    score,
    percentage: score,
    missedQuestionIds,
  };
}

export function getCyberRankLabel(percentage: number) {
  if (percentage >= 90) {
    return "Digital Defender";
  }
  if (percentage >= 75) {
    return "Firewall Master";
  }
  if (percentage >= 55) {
    return "Threat Hunter";
  }
  return "Cyber Rookie";
}

export function getCyberFeedback(percentage: number) {
  if (percentage >= 90) {
    return "Ei! You move like a security captain. The hackers go sweat small.";
  }
  if (percentage >= 75) {
    return "Solid work. Your instincts are sharp and the red flags are shaking.";
  }
  if (percentage >= 55) {
    return "Good progress. Small small, the cyber muscles are building.";
  }
  return "Ei! Hacker nearly chop your score like waakye. Keep training and return stronger.";
}

export function getQuizStrengths(summary: QuizResultSummary) {
  if (summary.percentage >= 90) {
    return [
      "Excellent spotting of suspicious cues",
      "Strong safety instincts under pressure",
      "Great habit of verifying before trusting",
    ];
  }

  if (summary.percentage >= 70) {
    return [
      "Good recognition of common scam tactics",
      "You are learning to pause before clicking",
      "Nice progress on safer online decisions",
    ];
  }

  return [
    "You are starting to notice cyber clues",
    "Your awareness is improving with practice",
    "Keep building the habit of checking first",
  ];
}

export function getQuizSuggestions(quiz: QuizCategory, summary: QuizResultSummary) {
  const suggestions = new Set<string>();

  if (summary.percentage < 90) {
    suggestions.add("Re-read the explanation for every missed question.");
  }

  if (summary.percentage < 75) {
    suggestions.add("Slow down when urgency language appears.");
  }

  if (quiz.slug === "phishing" || quiz.slug === "social-engineering") {
    suggestions.add("Check sender identity and verify requests using a trusted channel.");
  }

  if (quiz.slug === "password-security") {
    suggestions.add("Use unique passphrases and a password manager for repeat protection.");
  }

  if (quiz.slug === "public-wi-fi-safety") {
    suggestions.add("Treat public networks as risky and prefer trusted connections.");
  }

  if (quiz.slug === "ai-threats" || quiz.slug === "deepfakes" || quiz.slug === "voice-cloning-scams") {
    suggestions.add("Cross-check surprising media with trusted sources before sharing.");
  }

  return Array.from(suggestions);
}
