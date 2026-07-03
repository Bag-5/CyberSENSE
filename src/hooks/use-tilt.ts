"use client";

import { useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent } from "react";
import { useCallback } from "react";

const springConfig = { stiffness: 280, damping: 28 };
const perspective = 800;

export function useTilt(sensitivity: number = 4) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothX = useSpring(rotateX, springConfig);
  const smoothY = useSpring(rotateY, springConfig);

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY.set(cx * sensitivity);
      rotateX.set(-cy * sensitivity);
    },
    [sensitivity, rotateX, rotateY],
  );

  const onMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return {
    rotateX: smoothX,
    rotateY: smoothY,
    perspective,
    onMouseMove,
    onMouseLeave,
  };
}
