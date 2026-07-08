"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";

import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import { cyberPanelClasses } from "@/components/ui/cyber";

type GalleryImage = {
  src: string;
  alt: string;
};

type GalleryClientProps = {
  images: GalleryImage[];
};

export function GalleryClient({ images }: GalleryClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className={cyberPanelClasses(
              "group relative aspect-[4/3] w-full overflow-hidden p-0 transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200",
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null ? (
          <GalleryLightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
