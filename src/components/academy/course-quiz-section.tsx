import { QuizEngine } from "@/components/quiz/quiz-engine";
import { SectionHeader, cyberPanelClasses } from "@/components/ui/cyber";
import { getAcademyQuizByThreatSlug } from "@/data/academy";

type AcademyCourseQuizSectionProps = {
  threatSlug: string;
  title: string;
};

export function AcademyCourseQuizSection({ threatSlug, title }: AcademyCourseQuizSectionProps) {
  const quiz = getAcademyQuizByThreatSlug(threatSlug);

  if (!quiz) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className={cyberPanelClasses("border border-cyan-300/15 p-5 sm:p-6")}>
        <SectionHeader
          eyebrow="Course checkpoint"
          title={`${title} quiz`}
          description="Complete the course checkpoint, then enter your full name to generate the certificate for this Academy course."
        />

        <div className="mt-5">
          <QuizEngine
            quiz={quiz}
            certificateFlow={{
              title: `${title} certificate`,
              description:
                "Enter your full name exactly as it should appear on the certificate.",
              certificateType: "quiz",
              subjectKey: quiz.slug,
              ctaLabel: "Generate course certificate",
            }}
          />
        </div>
      </div>
    </section>
  );
}
