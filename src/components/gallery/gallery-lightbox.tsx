"use client";

import { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type GalleryImage = {
  src: string;
  alt: string;
};

type GalleryLightboxProps = {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function GalleryLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const next = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape": onClose(); break;
        case "ArrowLeft": prev(); break;
        case "ArrowRight": next(); break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(diff) > 60) {
      if (diff > 0) next();
      else prev();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return createPortal(
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ backgroundColor: "rgba(2, 6, 23, 0.95)" }}
      className="fixed inset-0 z-[200]"
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex h-full w-full flex-col">
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-1 sm:px-8 md:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="relative flex h-full w-full items-center justify-center"
            >
              <div className="relative h-[80vh] w-full max-w-full sm:h-[85vh] sm:w-auto sm:max-w-[80vw]">
                <Image
                  src={images[currentIndex].src}
                  alt={images[currentIndex].alt}
                  fill
                  className="rounded-xl object-contain"
                  sizes="(max-width: 640px) 100vw, 80vw"
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="absolute right-1 top-1 z-10 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-sm text-slate-300 shadow-lg backdrop-blur-xl transition hover:bg-slate-800 hover:text-cyan-100 sm:right-6 sm:top-6 sm:px-3 sm:py-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-0 top-1/2 z-10 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-sm text-slate-300 shadow-lg backdrop-blur-xl transition hover:bg-slate-800 hover:text-cyan-100 sm:left-5 sm:px-3 sm:py-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-0 top-1/2 z-10 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-sm text-slate-300 shadow-lg backdrop-blur-xl transition hover:bg-slate-800 hover:text-cyan-100 sm:right-5 sm:px-3 sm:py-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center justify-center gap-3 py-3 sm:py-4">
          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onNavigate(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "h-3 w-6 bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.6)]"
                    : "h-3 w-3 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}
