"use client";

import { useEffect, useCallback, useRef, useState } from "react";
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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 60;

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
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) next();
      else prev();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/95 px-3 py-4 backdrop-blur-xl sm:px-6 sm:py-6"
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 shadow-[0_0_20px_rgba(15,23,42,0.4)] backdrop-blur-xl transition hover:bg-slate-800 hover:text-cyan-100 sm:right-6 sm:top-6"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="absolute left-2 top-1/2 -translate-y-1/2 sm:left-4">
        {images.length > 1 ? (
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-2 text-sm text-slate-300 shadow-[0_0_20px_rgba(15,23,42,0.4)] backdrop-blur-xl transition hover:bg-slate-800 hover:text-cyan-100 sm:px-3"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : null}
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-4">
        {images.length > 1 ? (
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-2 text-sm text-slate-300 shadow-[0_0_20px_rgba(15,23,42,0.4)] backdrop-blur-xl transition hover:bg-slate-800 hover:text-cyan-100 sm:px-3"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : null}
      </div>

      <div className="flex h-full w-full items-center justify-center px-12 sm:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex h-full w-full max-w-[min(96vw,78rem)] items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="max-h-[calc(100vh-10rem)] w-auto max-w-full rounded-[1.5rem] object-contain shadow-[0_0_50px_rgba(15,23,42,0.55)] sm:max-h-[calc(100vh-8rem)]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 sm:bottom-6">
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
    </motion.div>
  );
}
