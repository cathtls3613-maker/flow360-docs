import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";
import { AppError } from "@/lib/errors";

import {
  SUPABASE_NOT_CONFIGURED_MESSAGE,
  isSupabaseConfigured,
} from "./config";

/**
 * Supabase client for Client Components (code running in the browser).
 * Uses the public anon key; Row Level Security governs what it can see.
 */
export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new AppError(SUPABASE_NOT_CONFIGURED_MESSAGE, {
      code: "SUPABASE_NOT_CONFIGURED",
      isOperational: true,
    });
  }
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
