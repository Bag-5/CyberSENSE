"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

import { cyberButtonClasses } from "@/components/ui/cyber";
import { galleryImages } from "@/data/gallery";

const featured = galleryImages.slice(0, 4);

export function HomeGalleryPreview() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
       <Link href="/gallery" className="group relative block overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(15,23,42,0.35)] sm:rounded-[2rem]">
        <div className="relative aspect-[21/9] w-full overflow-hidden sm:aspect-[3/1]">
          <AnimatePresence mode="wait">
            <motion.div
              key={featured[index].src}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${featured[index].src})` }}
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-950/20" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(217,70,239,0.08),transparent_50%)]" />

          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8 lg:p-10">
            <div className="max-w-xl space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
                <p className="text-xs font-semibold tracking-[0.24em] text-cyan-200 uppercase">
                  Awareness Gallery
                </p>
              </div>
              <h2 className="text-xl font-semibold tracking-[-0.04em] text-white sm:text-2xl lg:text-3xl">
                We took CyberSENSE to campus.
              </h2>
              <p className="max-w-lg text-sm leading-6 text-slate-200 sm:text-base">
                Photos from our awareness campaign — talking phishing, safe browsing,
                and why cybersecurity matters to everyday students.
              </p>
              <div className="pt-2">
                <span
                  className={cyberButtonClasses(
                    "primary",
                    "md",
                    "inline-flex transition duration-300 group-hover:brightness-110",
                  )}
                >
                  Explore Gallery
                </span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-3 right-4 flex gap-1.5 sm:bottom-4 sm:right-6">
            {featured.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index
                    ? "w-5 bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.6)]"
                    : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </Link>
    </section>
  );
}
