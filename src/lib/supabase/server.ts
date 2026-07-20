import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";
import { AppError } from "@/lib/errors";

import {
  SUPABASE_NOT_CONFIGURED_MESSAGE,
  isSupabaseConfigured,
} from "./config";

/**
 * Supabase client for Server Components, Server Actions, and Route
 * Handlers. The user's session travels in cookies; Row Level Security
 * applies exactly as it does in the browser.
 */
export async function createClient() {
  if (!isSupabaseConfigured()) {
    throw new AppError(SUPABASE_NOT_CONFIGURED_MESSAGE, {
      code: "SUPABASE_NOT_CONFIGURED",
      isOperational: true,
    });
  }

  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, where cookies are
            // read-only. Safe to ignore: the proxy refreshes sessions.
          }
        },
      },
    },
  );
}
