"use client";

import { useEffect, useMemo, useState } from "react";

import { AcademyCourseAttackLab } from "@/components/academy/course-attack-lab";
import { CertificatePromptModal } from "@/components/certificates/certificate-prompt-modal";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import { SectionHeader, cyberButtonClasses, cyberPanelClasses } from "@/components/ui/cyber";
import { getAcademyCourseByThreatSlug, getAcademyQuizByThreatSlug } from "@/data/academy";
import {
  clearAcademyCourseProgress,
  defaultAcademyCourseQuizState,
  loadAcademyCourseProgress,
  saveAcademyCourseProgress,
  subscribeAcademyCourseProgress,
  type AcademyCourseProgress,
} from "@/lib/progress/academy-course-progress";
import { recordCertificateProgress } from "@/lib/progress/certificate-progress";

type AcademyCourseFlowSectionProps = {
  threatSlug: string;
  title: string;
};

export function AcademyCourseFlowSection({ threatSlug, title }: AcademyCourseFlowSectionProps) {
  const quiz = getAcademyQuizByThreatSlug(threatSlug);
  const course = getAcademyCourseByThreatSlug(threatSlug);
  const [courseProgress, setCourseProgress] = useState<AcademyCourseProgress>(() =>
    loadAcademyCourseProgress(threatSlug),
  );
  const [showCertificatePrompt, setShowCertificatePrompt] = useState(
    courseProgress.stage === "certificate",
  );

  const certificateDescription = useMemo(
    () =>
      `You have finished the ${title} course quiz and attack lab. Enter your full name exactly as it should appear on the certificate.`,
    [title],
  );

  const quizSummary = courseProgress.quiz.summary;
  const quizAchievements = courseProgress.quiz.unlockedAchievements;
  const hasSavedQuizProgress = Boolean(
    courseProgress.quiz.summary ||
      courseProgress.quiz.currentIndex > 0 ||
      courseProgress.quiz.selectedAnswer ||
      courseProgress.quiz.showFeedback ||
      Object.keys(courseProgress.quiz.submittedAnswers).length,
  );
  const [showQuiz, setShowQuiz] = useState(
    courseProgress.stage !== "quiz" || !hasSavedQuizProgress,
  );
  const attackLabComplete =
    courseProgress.stage === "lab" ||
    courseProgress.stage === "certificate" ||
    courseProgress.stage === "complete";
  const hasResumeCheckpoint = courseProgress.stage === "quiz" && hasSavedQuizProgress;
  const showResumeCard = hasResumeCheckpoint && !showQuiz;

  useEffect(() => {
    const syncProgress = () => {
      setCourseProgress(loadAcademyCourseProgress(threatSlug));
    };

    syncProgress();
    return subscribeAcademyCourseProgress(syncProgress);
  }, [threatSlug]);

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

      {showResumeCard ? (
        <div className={cyberPanelClasses("border border-fuchsia-300/15 p-5 sm:p-6")}>
          <p className="text-xs font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
            Course progress saved
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">
            You can continue from where you stopped
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Your last checkpoint for this course is saved on this device, so you can continue the
            quiz without starting over.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowQuiz(true)}
              className={cyberButtonClasses("primary", "md")}
            >
              Continue course
            </button>
            <button
              type="button"
              onClick={() => {
                clearAcademyCourseProgress(threatSlug);
                setCourseProgress({
                  stage: "lesson",
                  quiz: { ...defaultAcademyCourseQuizState },
                  updatedAt: new Date().toISOString(),
                });
                setShowQuiz(true);
                setShowCertificatePrompt(false);
              }}
              className={cyberButtonClasses("ghost", "md")}
            >
              Restart course
            </button>
          </div>
        </div>
      ) : null}

      {showQuiz ? (
        <div className={cyberPanelClasses("border border-cyan-300/15 p-5 sm:p-6")}>
          <QuizEngine
            quiz={quiz}
            initialState={courseProgress.quiz}
            onStateChange={(state) => {
              if (state.summary) {
                return;
              }

              const nextProgress: AcademyCourseProgress = {
                stage: "quiz",
                quiz: {
                  currentIndex: state.currentIndex,
                  selectedAnswer: state.selectedAnswer,
                  submittedAnswers: state.submittedAnswers,
                  showFeedback: state.showFeedback,
                  summary: null,
                  unlockedAchievements: [],
                },
                updatedAt: new Date().toISOString(),
              };

              setCourseProgress(nextProgress);
              saveAcademyCourseProgress(threatSlug, nextProgress);
            }}
            onComplete={(summary, achievements) => {
              const nextProgress: AcademyCourseProgress = {
                stage: "lab",
                quiz: {
                  currentIndex: courseProgress.quiz.currentIndex,
                  selectedAnswer: courseProgress.quiz.selectedAnswer,
                  submittedAnswers: courseProgress.quiz.submittedAnswers,
                  showFeedback: courseProgress.quiz.showFeedback,
                  summary,
                  unlockedAchievements: achievements,
                },
                updatedAt: new Date().toISOString(),
              };

              setCourseProgress(nextProgress);
              saveAcademyCourseProgress(threatSlug, nextProgress);
            }}
          />
        </div>
      ) : null}

      {quizSummary ? (
        <div className="space-y-4">
          <AcademyCourseAttackLab
            threatSlug={threatSlug}
            title={course.title}
            onComplete={() => {
              const nextProgress: AcademyCourseProgress = {
                ...courseProgress,
                stage: "certificate",
                updatedAt: new Date().toISOString(),
              };
              setCourseProgress(nextProgress);
              saveAcademyCourseProgress(threatSlug, nextProgress);
              setShowQuiz(true);
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
        onClose={() => {
          setShowCertificatePrompt(false);
        }}
        onGenerated={() => {
          recordCertificateProgress({ certificateType: "quiz", subjectKey: quiz.slug });
          const nextProgress: AcademyCourseProgress = {
            ...courseProgress,
            stage: "complete",
            updatedAt: new Date().toISOString(),
          };
          setCourseProgress(nextProgress);
          saveAcademyCourseProgress(threatSlug, nextProgress);
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

      {attackLabComplete && courseProgress.stage !== "complete" && !showCertificatePrompt ? (
        <div className={cyberPanelClasses("border border-emerald-300/15 p-5")}>
          <p className="text-xs font-semibold tracking-[0.24em] text-emerald-200 uppercase">
            Course checkpoint
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Your quiz is complete and the attack lab has been marked done. Open the certificate
            prompt to finish this course and issue the PDF.
          </p>
        </div>
      ) : null}
    </section>
  );
}
