"use client";

import { useReducedMotion } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  sensitivity?: number;
  as?: "article" | "div" | "section";
};

const tags = { div: "div", article: "article", section: "section" } as const;

function applyTilt(el: HTMLElement, e: MouseEvent, sens: number) {
  const rect = el.getBoundingClientRect();
  const cx = (e.clientX - rect.left) / rect.width - 0.5;
  const cy = (e.clientY - rect.top) / rect.height - 0.5;
  el.style.transform = `perspective(800px) rotateX(${-cy * sens}deg) rotateY(${cx * sens}deg)`;
}

function resetTilt(el: HTMLElement) {
  el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
}

export function TiltCard({
  children,
  className,
  sensitivity = 4,
  as = "div",
}: TiltCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const Tag = tags[as];

  if (prefersReducedMotion) {
    return (
      <Tag ref={ref as never} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as never}
      className={className}
      onMouseMove={(e: MouseEvent) => {
        if (ref.current) applyTilt(ref.current, e, sensitivity);
      }}
      onMouseLeave={() => {
        if (ref.current) resetTilt(ref.current);
      }}
      style={{ transition: "transform 0.12s ease-out" }}
    >
      {children}
    </Tag>
  );
}
