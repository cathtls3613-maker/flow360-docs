"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps the application with theme support (light / dark / system).
 * Backed by next-themes, which persists the user's choice and avoids
 * a flash of the wrong theme on page load.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
