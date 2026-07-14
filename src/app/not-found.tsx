import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Shown for any URL that doesn't exist. */
export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm font-medium">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground max-w-md text-sm">
          The page you are looking for doesn&apos;t exist or may have moved.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  );
}
