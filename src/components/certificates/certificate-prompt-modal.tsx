"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

import { cyberButtonClasses, cyberPanelClasses } from "@/components/ui/cyber";
import { cn } from "@/utils/cn";

export type CertificateType = "quiz" | "milestone" | "training";

type CertificatePromptModalProps = {
  open: boolean;
  title: string;
  description: string;
  certificateType: CertificateType;
  subjectKey?: string;
  defaultName?: string;
  ctaLabel?: string;
  onClose: () => void;
  onGenerated?: (fullName: string) => void;
};

function downloadPdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function CertificatePromptModal({
  open,
  title,
  description,
  certificateType,
  subjectKey,
  defaultName = "",
  ctaLabel = "Generate certificate",
  onClose,
  onGenerated,
}: CertificatePromptModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <CertificatePromptSheet
          key={`${defaultName}-${certificateType}-${subjectKey ?? "default"}`}
          title={title}
          description={description}
          certificateType={certificateType}
          subjectKey={subjectKey}
          defaultName={defaultName}
          ctaLabel={ctaLabel}
          onClose={onClose}
          onGenerated={onGenerated}
        />
      ) : null}
    </AnimatePresence>
  );
}

function CertificatePromptSheet({
  title,
  description,
  certificateType,
  subjectKey,
  defaultName,
  ctaLabel,
  onClose,
  onGenerated,
}: Omit<CertificatePromptModalProps, "open">) {
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  async function handleGenerate() {
    const trimmedName = inputRef.current?.value.trim() ?? "";
    if (!trimmedName) {
      setNotice({
        tone: "error",
        text: "Please enter the full name that should appear on the certificate.",
      });
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const response = await fetch("/api/reports/certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: trimmedName,
          certificateType,
          subjectKey,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Could not generate the certificate.");
      }

      const blob = await response.blob();
      const filename = `cybersense-certificate-${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
      downloadPdf(blob, filename);
      onGenerated?.(trimmedName);
      setNotice({ tone: "success", text: "Certificate download started. Check your downloads folder." });
      window.setTimeout(onClose, 1200);
    } catch (error) {
      setNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not generate the certificate.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1 }}
      exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
        animate={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
        transition={reduceMotion ? { duration: 0.01 } : { duration: 0.24, ease: "easeOut" }}
        className={cn(
          cyberPanelClasses("w-full max-w-2xl border border-cyan-300/20 p-5 sm:p-6"),
          "shadow-[0_0_50px_rgba(34,211,238,0.18)]",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.26em] text-cyan-100 uppercase">
              CyberSENSE certificate
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">{title}</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
            Full name as it should appear on the certificate
          </span>
          <input
            ref={inputRef}
            defaultValue={defaultName}
            placeholder="Enter the full name for the certificate"
            className="cyber-input w-full rounded-[1.1rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-200/20"
          />
        </label>

        {notice ? (
          <div
            className={cn(
              "mt-4 rounded-2xl border px-4 py-3 text-sm",
              notice.tone === "success"
                ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
                : "border-rose-300/20 bg-rose-400/10 text-rose-100",
            )}
          >
            {notice.text}
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className={cyberButtonClasses("primary", "md")}
          >
            {loading ? "Generating..." : ctaLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
