"use server";

import { redirect } from "next/navigation";

import { signIn, signOut, signUpWithWorkspace } from "@/engines/identity";
import { getUserFacingMessage, normalizeError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

/**
 * Server actions for authentication. Deliberately thin: they collect
 * form input, call the Identity Engine, and translate outcomes into
 * screen state. All business logic lives in the engine.
 */

export interface AuthFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  /** Set when sign-up succeeded but the user must confirm their email. */
  confirmEmail?: boolean;
}

function toFormState(error: unknown): AuthFormState {
  const normalized = normalizeError(error);
  if (!normalized.isOperational) {
    logger.error("auth action failed unexpectedly", {
      code: normalized.code,
      message: normalized.message,
    });
  }
  const fieldErrors = normalized.details?.fieldErrors as
    Record<string, string> | undefined;
  return { error: getUserFacingMessage(error), fieldErrors };
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  let result;
  try {
    const client = await createClient();
    result = await signUpWithWorkspace(client, {
      fullName: String(formData.get("fullName") ?? ""),
      companyName: String(formData.get("companyName") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
  } catch (error) {
    return toFormState(error);
  }

  if (result.requiresEmailConfirmation) {
    return { confirmEmail: true };
  }
  redirect("/dashboard");
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  try {
    const client = await createClient();
    await signIn(client, {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
  } catch (error) {
    return toFormState(error);
  }
  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  try {
    const client = await createClient();
    await signOut(client);
  } catch (error) {
    // Failing to sign out should never strand the user; log and move on.
    const normalized = normalizeError(error);
    logger.error("sign-out failed", { code: normalized.code });
  }
  redirect("/login");
}
