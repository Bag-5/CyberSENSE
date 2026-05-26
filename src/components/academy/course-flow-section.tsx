"use client";

import { useMemo, useState } from "react";

import { AcademyCourseAttackLab } from "@/components/academy/course-attack-lab";
import { CertificatePromptModal } from "@/components/certificates/certificate-prompt-modal";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import { SectionHeader, cyberPanelClasses } from "@/components/ui/cyber";
import { getAcademyCourseByThreatSlug, getAcademyQuizByThreatSlug } from "@/data/academy";
import { recordCertificateProgress } from "@/lib/progress/certificate-progress";
import type { QuizAchievement, QuizResultSummary } from "@/types/quiz";

type AcademyCourseFlowSectionProps = {
  threatSlug: string;
  title: string;
};

export function AcademyCourseFlowSection({ threatSlug, title }: AcademyCourseFlowSectionProps) {
  const quiz = getAcademyQuizByThreatSlug(threatSlug);
  const course = getAcademyCourseByThreatSlug(threatSlug);
  const [quizSummary, setQuizSummary] = useState<QuizResultSummary | null>(null);
  const [quizAchievements, setQuizAchievements] = useState<QuizAchievement[]>([]);
  const [attackLabComplete, setAttackLabComplete] = useState(false);
  const [showCertificatePrompt, setShowCertificatePrompt] = useState(false);

  const certificateDescription = useMemo(
    () =>
      `You have finished the ${title} course quiz and attack lab. Enter your full name exactly as it should appear on the certificate.`,
    [title],
  );

  if (!quiz || !course) {
    return null;
  }

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Course checkpoint"
        title={`${title} quiz`}
        description="Complete the course quiz, review the attack lab, then generate the certificate for this Academy course."
      />

      <div className={cyberPanelClasses("border border-cyan-300/15 p-5 sm:p-6")}>
        <QuizEngine
          quiz={quiz}
          onComplete={(summary, achievements) => {
            setQuizSummary(summary);
            setQuizAchievements(achievements);
          }}
        />
      </div>

      {quizSummary ? (
        <div className="space-y-4">
          <AcademyCourseAttackLab
            threatSlug={threatSlug}
            title={course.title}
            onComplete={() => {
              setAttackLabComplete(true);
              setShowCertificatePrompt(true);
            }}
          />
          {!attackLabComplete ? (
            <p className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-50">
              Finish the attack lab above to unlock the certificate download step.
            </p>
          ) : null}
        </div>
      ) : null}

      <CertificatePromptModal
        open={showCertificatePrompt}
        title={`${title} certificate`}
        description={certificateDescription}
        certificateType="quiz"
        subjectKey={quiz.slug}
        ctaLabel="Generate course certificate"
        onClose={() => setShowCertificatePrompt(false)}
        onGenerated={() => {
          recordCertificateProgress({ certificateType: "quiz", subjectKey: quiz.slug });
          setShowCertificatePrompt(false);
        }}
      />

      {quizSummary ? (
        <div className={cyberPanelClasses("border border-white/10 p-5")}>
          <p className="text-xs font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
            Course score
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {quizSummary.correctCount}/{quizSummary.totalQuestions} correct. {quizAchievements.length
              ? "You unlocked new achievements on the way."
              : "Keep sharpening your instincts as you move through the academy."}
          </p>
        </div>
      ) : null}
    </section>
  );
}
