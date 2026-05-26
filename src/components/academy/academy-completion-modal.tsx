"use client";

import { useEffect, useState } from "react";

import { CertificatePromptModal } from "@/components/certificates/certificate-prompt-modal";
import { academyQuizSlugs, isAcademyComplete } from "@/data/academy";
import { recordCertificateProgress } from "@/lib/progress/certificate-progress";
import { loadQuizProgress, subscribeQuizProgress } from "@/lib/progress/quiz-progress";
import {
  hasCertificateIssued,
  subscribeCertificateProgress,
} from "@/lib/progress/certificate-progress";

const DISMISSED_KEY = "cybersense.academy.completion.dismissed";

export function AcademyCompletionModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;

    function checkCompletion() {
      if (!active || typeof window === "undefined") {
        return;
      }

      const dismissed = window.sessionStorage.getItem(DISMISSED_KEY) === "true";
      const progress = loadQuizProgress();
      const completed = isAcademyComplete(Object.keys(progress.completedQuizzes));
      const certificatesIssued = academyQuizSlugs.every((slug) =>
        hasCertificateIssued("quiz", slug),
      );
      setOpen(completed && certificatesIssued && !dismissed);
    }

    checkCompletion();
    const unsubscribe = subscribeQuizProgress(() => {
      checkCompletion();
    });
    const unsubscribeCertificates = subscribeCertificateProgress(() => {
      checkCompletion();
    });

    return () => {
      active = false;
      unsubscribe();
      unsubscribeCertificates();
    };
  }, []);

  return (
    <CertificatePromptModal
      open={open}
      title="Congratulations, Academy graduate"
      description={`You have completed every Threat Academy course (${academyQuizSlugs.length} modules). Enter your full name to generate your CyberSENSE training completion certificate.`}
      certificateType="training"
      ctaLabel="Generate training certificate"
      onClose={() => {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(DISMISSED_KEY, "true");
        }
        setOpen(false);
      }}
      onGenerated={() => {
        recordCertificateProgress({ certificateType: "training" });
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(DISMISSED_KEY, "true");
        }
        setOpen(false);
      }}
    />
  );
}
