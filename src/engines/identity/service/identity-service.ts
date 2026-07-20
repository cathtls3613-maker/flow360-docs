import type { SupabaseClient } from "@supabase/supabase-js";

import { AppError, UnauthorizedError } from "@/lib/errors";
import { logger } from "@/lib/logger";

import type {
  CurrentUser,
  SignInInput,
  SignUpInput,
  SignUpResult,
} from "../domain/types";
import { parseOrThrow, signInSchema, signUpSchema } from "../domain/validation";
import {
  findActiveMembership,
  findProfile,
} from "../repository/identity-repository";

const log = logger.child({ engine: "identity" });

/**
 * Creates a user account and their company workspace. The database
 * trigger `handle_new_user` atomically creates the company, profile,
 * and owner membership from the metadata passed here.
 */
export async function signUpWithWorkspace(
  client: SupabaseClient,
  input: SignUpInput,
): Promise<SignUpResult> {
  const parsed = parseOrThrow(signUpSchema, input);

  const { data, error } = await client.auth.signUp({
    email: parsed.email,
    password: parsed.password,
    options: {
      data: {
        full_name: parsed.fullName,
        company_name: parsed.companyName,
      },
    },
  });

  if (error) {
    // Supabase returns 422/400 for accounts that already exist or weak
    // passwords — expected business situations, safe to show.
    throw new AppError(error.message, {
      code: "SIGN_UP_FAILED",
      statusCode: 400,
      isOperational: true,
      cause: error,
    });
  }

  log.info("workspace sign-up completed", {
    userId: data.user?.id,
    requiresEmailConfirmation: !data.session,
  });

  return { requiresEmailConfirmation: !data.session };
}

/** Signs a user in with email and password. */
export async function signIn(
  client: SupabaseClient,
  input: SignInInput,
): Promise<void> {
  const parsed = parseOrThrow(signInSchema, input);

  const { error } = await client.auth.signInWithPassword({
    email: parsed.email,
    password: parsed.password,
  });

  if (error) {
    // Never reveal whether the email exists — one generic message.
    throw new UnauthorizedError(
      "Incorrect email or password. Please try again.",
    );
  }
}

/** Ends the current session. */
export async function signOut(client: SupabaseClient): Promise<void> {
  const { error } = await client.auth.signOut();
  if (error) {
    throw new AppError("Failed to sign out.", { cause: error });
  }
}

/**
 * The signed-in user with their company context, or null when nobody
 * is signed in. Every screen behind the login uses this.
 */
export async function getCurrentUser(
  client: SupabaseClient,
): Promise<CurrentUser | null> {
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return null;
  }

  const [profile, membership] = await Promise.all([
    findProfile(client, user.id),
    findActiveMembership(client, user.id),
  ]);

  if (!membership) {
    // Signed in but no active company — deactivated membership or a
    // sign-up whose bootstrap failed. Treat as not signed in for the
    // app's purposes; log it for investigation.
    log.warn("signed-in user has no active membership", { userId: user.id });
    return null;
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    fullName: profile?.fullName ?? "",
    company: membership.company,
    role: membership.role,
  };
}
