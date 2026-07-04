"use client";

import { useRef, useEffect, type ReactNode } from "react";

export function PerspectiveShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!ref.current) return;
        const cx = ((e.clientX / window.innerWidth) - 0.5) * 2;
        const cy = ((e.clientY / window.innerHeight) - 0.5) * 2;
        ref.current.style.transform = `perspective(2000px) rotateX(${-cy * 0.8}deg) rotateY(${cx * 0.8}deg)`;
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="transition-[transform] duration-500 ease-out"
    >
      {children}
    </div>
  );
}
