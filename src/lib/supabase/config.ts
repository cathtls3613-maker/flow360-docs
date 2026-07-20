import { env } from "@/lib/env";

/**
 * True when the Supabase connection settings are present.
 *
 * The app is designed to build and serve its public pages without a
 * database; anything that needs Supabase checks this first and fails
 * with a clear, friendly message instead of crashing.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  "The database connection is not configured yet. " +
  "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local " +
  "(see docs/guides/SUPABASE_SETUP.md).";
