"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/utils/cn";

type SafeImageProps = {
  src: string;
  alt: string;
  /** Tailwind classes for the wrapper, e.g. an aspect utility. */
  className?: string;
  /** Extra classes for the image frame, e.g. a panel border. Omit for none. */
  frameClassName?: string;
  /** Tailwind classes for the <img> itself. */
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * An <Image> that removes itself when the asset is missing.
 *
 * Course art is generated in batches, so a course can legitimately render
 * before its images exist. A plain <Image> would leave a broken-image glyph and
 * a hole in the layout; this renders nothing at all instead, so the surrounding
 * layout reflows cleanly with no empty panel left behind.
 *
 * The wrapper is always `relative` and sized by the caller, so the image always
 * uses `fill`. Next.js treats `fill` and explicit width/height as mutually
 * exclusive, and supplying neither is a runtime throw rather than a type error.
 */
export function SafeImage({
  src,
  alt,
  className,
  frameClassName,
  imgClassName,
  sizes = "(max-width: 1024px) 100vw, 1024px",
  priority = false,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null;
  }

  return (
    <div className={cn("relative w-full overflow-hidden", frameClassName)}>
      <div className={cn("relative w-full overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          className={imgClassName}
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  );
}