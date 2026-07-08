"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

type GalleryImage = {
  src: string;
  alt: string;
};

type GallerySlideshowProps = {
  images: GalleryImage[];
  autoPlayInterval?: number;
  className?: string;
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -320 : 320, opacity: 0 }),
};

export function GallerySlideshow({
  images,
  autoPlayInterval = 5000,
  className,
}: GallerySlideshowProps) {
  const prefersReducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused || prefersReducedMotion || images.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, prefersReducedMotion, images.length, autoPlayInterval]);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current],
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_0_40px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={prefersReducedMotion ? undefined : slideVariants}
              initial={prefersReducedMotion ? { opacity: 0 } : "enter"}
              animate={prefersReducedMotion ? { opacity: 1 } : "center"}
              exit={prefersReducedMotion ? { opacity: 0 } : "exit"}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.35, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[current].src}
                alt={images[current].alt}
                fill
                className="object-contain p-2 sm:p-3"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                priority={current === 0}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-slate-300 shadow-[0_0_20px_rgba(15,23,42,0.4)] backdrop-blur-xl transition hover:bg-slate-800 hover:text-cyan-100 hover:shadow-[0_0_24px_rgba(34,211,238,0.15)]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-slate-300 shadow-[0_0_20px_rgba(15,23,42,0.4)] backdrop-blur-xl transition hover:bg-slate-800 hover:text-cyan-100 hover:shadow-[0_0_24px_rgba(34,211,238,0.15)]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.7)]"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
          <span className="ml-3 text-xs text-slate-500">
            {current + 1} / {images.length}
          </span>
        </div>
      ) : null}
    </div>
  );
}
