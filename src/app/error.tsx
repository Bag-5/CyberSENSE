"use client";

import { useEffect } from "react";

import { ErrorSurface } from "@/components/ui/cyber";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorSurface
      title="CyberSENSE hit a temporary snag."
      description="The app could not finish loading that screen. You can retry now or navigate back to a stable section."
      onRetry={reset}
    />
  );
}
