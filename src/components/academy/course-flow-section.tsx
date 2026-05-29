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

function hasQuizCheckpoint(progress: AcademyCourseProgress) {
  return Boolean(
    progress.quiz.summary ||
      progress.quiz.currentIndex > 0 ||
      progress.quiz.selectedAnswer ||
      progress.quiz.showFeedback ||
      Object.keys(progress.quiz.submittedAnswers).length,
  );
}

export function AcademyCourseFlowSection({ threatSlug, title }: AcademyCourseFlowSectionProps) {
  const quiz = getAcademyQuizByThreatSlug(threatSlug);
  const course = getAcademyCourseByThreatSlug(threatSlug);
  const [courseProgress, setCourseProgress] = useState<AcademyCourseProgress>(() =>
    loadAcademyCourseProgress(threatSlug),
  );

  const [showQuiz, setShowQuiz] = useState(() => {
    const initialProgress = loadAcademyCourseProgress(threatSlug);
    return initialProgress.stage !== "quiz" || !hasQuizCheckpoint(initialProgress);
  });

  const [showCertificatePrompt, setShowCertificatePrompt] = useState(
    () => loadAcademyCourseProgress(threatSlug).stage === "certificate",
  );

  const certificateDescription = useMemo(
    () =>
      `You have finished the ${title} course quiz and attack lab. Enter your full name exactly as it should appear on the certificate.`,
    [title],
  );

  const quizSummary = courseProgress.quiz.summary;
  const quizAchievements = courseProgress.quiz.unlockedAchievements;
  const hasSavedQuizProgress = hasQuizCheckpoint(courseProgress);
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
              setShowQuiz(false);
              setShowCertificatePrompt(false);
            }}
          />
        </div>
      ) : null}

      {quizSummary ? (
        <div className={cyberPanelClasses("space-y-4 border border-cyan-300/15 p-5 sm:p-6")}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-xs font-semibold tracking-[0.24em] text-fuchsia-200 uppercase">
                Quiz complete
              </p>
              <h3 className="text-2xl font-black tracking-[-0.05em] text-white sm:text-3xl">
                You’ve cleared the quiz. Next comes the attack lab.
              </h3>
              <p className="text-sm leading-6 text-slate-300">
                Work through the safe simulation below, then enter your full name in the
                certificate popup to finish this course and download the PDF.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[22rem]">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
                  Score
                </p>
                <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">
                  {quizSummary.correctCount}/{quizSummary.totalQuestions}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
                  Achievements
                </p>
                <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">
                  {quizAchievements.length}
                </p>
              </div>
            </div>
          </div>

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
              setShowQuiz(false);
              setShowCertificatePrompt(true);
            }}
          />

          {courseProgress.stage === "certificate" && !showCertificatePrompt ? (
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm leading-6 text-emerald-50">
              The attack lab is complete. Open the certificate prompt to enter your full name and
              download the course certificate.
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setShowCertificatePrompt(true)}
                  className={cyberButtonClasses("primary", "md")}
                >
                  Open certificate form
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <CertificatePromptModal
        open={showCertificatePrompt}
        title={`${title} certificate`}
        description={certificateDescription}
        certificateType="quiz"
        subjectKey={quiz.slug}
        quizTitle={quiz.title}
        quizScore={quizSummary?.score}
        quizCompletedAt={quizSummary ? new Date().toISOString() : undefined}
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
          setShowQuiz(false);
        }}
      />
    </section>
  );
}
