"use client";

import { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

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
      className="fixed inset-0 z-[200] backdrop-blur-xl"
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="grid h-full w-full grid-rows-[1fr_auto]">
        <div className="relative flex items-center justify-center overflow-hidden px-16 sm:px-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex max-h-[85vh] items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="max-h-[82vh] w-auto max-w-[calc(100vw-8rem)] rounded-xl object-contain sm:max-w-[calc(100vw-12rem)]"
              />
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 shadow-lg backdrop-blur-xl transition hover:bg-slate-800 hover:text-cyan-100 sm:right-6 sm:top-6"
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
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-2 text-sm text-slate-300 shadow-lg backdrop-blur-xl transition hover:bg-slate-800 hover:text-cyan-100 sm:left-5 sm:px-3"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-2 text-sm text-slate-300 shadow-lg backdrop-blur-xl transition hover:bg-slate-800 hover:text-cyan-100 sm:right-5 sm:px-3"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          ) : null}
        </div>

        <div className="flex items-center justify-center gap-3 py-4">
          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onNavigate(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-5 bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.6)]"
                    : "w-2 bg-white/25 hover:bg-white/50"
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
