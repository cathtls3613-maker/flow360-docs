"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { GENERIC_ERROR_MESSAGE } from "@/lib/errors";
import { logger } from "@/lib/logger";

/**
 * Catches unexpected errors inside the app and shows a friendly recovery
 * screen instead of a blank page. Next.js renders this automatically.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled error in app router", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-muted-foreground max-w-md text-sm">
          {GENERIC_ERROR_MESSAGE}
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
