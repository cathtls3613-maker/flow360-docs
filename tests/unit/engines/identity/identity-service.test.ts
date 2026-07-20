import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";

import {
  getCurrentUser,
  signIn,
  signOut,
  signUpWithWorkspace,
} from "@/engines/identity";
import { AppError, UnauthorizedError, ValidationError } from "@/lib/errors";

/**
 * Builds a simulated Supabase client. Tables are provided as
 * `tableName -> row` results for the `.maybeSingle()` terminal call.
 */
function fakeClient({
  user = null,
  tables = {},
  auth = {},
}: {
  user?: { id: string; email?: string } | null;
  tables?: Record<string, unknown>;
  auth?: Partial<Record<"signUp" | "signInWithPassword" | "signOut", unknown>>;
} = {}): SupabaseClient {
  const from = vi.fn((table: string) => {
    const result = { data: tables[table] ?? null, error: null };
    const builder = {
      select: vi.fn(() => builder),
      eq: vi.fn(() => builder),
      limit: vi.fn(() => builder),
      maybeSingle: vi.fn(async () => result),
    };
    return builder;
  });

  return {
    from,
    auth: {
      getUser: vi.fn(async () => ({ data: { user } })),
      signUp: vi.fn(async () => ({
        data: { user, session: null },
        error: null,
      })),
      signInWithPassword: vi.fn(async () => ({ data: {}, error: null })),
      signOut: vi.fn(async () => ({ error: null })),
      ...auth,
    },
  } as unknown as SupabaseClient;
}

const validSignUp = {
  fullName: "Sara Pumpexpert",
  companyName: "Gulf Flow Equipment",
  email: "sara@gulfflow.example",
  password: "correct-horse-battery",
};

describe("signUpWithWorkspace", () => {
  it("passes company and person names to Supabase as metadata", async () => {
    const client = fakeClient({ user: { id: "u-1" } });
    await signUpWithWorkspace(client, validSignUp);

    expect(client.auth.signUp).toHaveBeenCalledWith({
      email: validSignUp.email,
      password: validSignUp.password,
      options: {
        data: {
          full_name: "Sara Pumpexpert",
          company_name: "Gulf Flow Equipment",
        },
      },
    });
  });

  it("reports when email confirmation is required (no session yet)", async () => {
    const client = fakeClient({ user: { id: "u-1" } });
    const result = await signUpWithWorkspace(client, validSignUp);
    expect(result.requiresEmailConfirmation).toBe(true);
  });

  it("rejects invalid input before contacting Supabase", async () => {
    const client = fakeClient();
    await expect(
      signUpWithWorkspace(client, { ...validSignUp, password: "short" }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(client.auth.signUp).not.toHaveBeenCalled();
  });

  it("surfaces Supabase sign-up failures as operational errors", async () => {
    const client = fakeClient({
      auth: {
        signUp: vi.fn(async () => ({
          data: { user: null, session: null },
          error: { message: "User already registered" },
        })),
      },
    });

    await expect(
      signUpWithWorkspace(client, validSignUp),
    ).rejects.toMatchObject({
      code: "SIGN_UP_FAILED",
      isOperational: true,
      message: "User already registered",
    });
  });
});

describe("signIn", () => {
  it("signs in with valid credentials", async () => {
    const client = fakeClient();
    await signIn(client, { email: "a@b.example", password: "secret123" });
    expect(client.auth.signInWithPassword).toHaveBeenCalled();
  });

  it("maps failed credentials to one generic Unauthorized message", async () => {
    const client = fakeClient({
      auth: {
        signInWithPassword: vi.fn(async () => ({
          data: {},
          error: { message: "Invalid login credentials" },
        })),
      },
    });

    await expect(
      signIn(client, { email: "a@b.example", password: "wrong" }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});

describe("signOut", () => {
  it("wraps sign-out failures in AppError", async () => {
    const client = fakeClient({
      auth: { signOut: vi.fn(async () => ({ error: { message: "boom" } })) },
    });
    await expect(signOut(client)).rejects.toBeInstanceOf(AppError);
  });
});

describe("getCurrentUser", () => {
  it("returns null when nobody is signed in", async () => {
    const client = fakeClient({ user: null });
    expect(await getCurrentUser(client)).toBeNull();
  });

  it("returns null when the user has no active membership", async () => {
    const client = fakeClient({
      user: { id: "u-1", email: "sara@gulfflow.example" },
      tables: { user_profiles: { id: "u-1", full_name: "Sara" } },
    });
    expect(await getCurrentUser(client)).toBeNull();
  });

  it("assembles the full user context from profile and membership", async () => {
    const client = fakeClient({
      user: { id: "u-1", email: "sara@gulfflow.example" },
      tables: {
        user_profiles: { id: "u-1", full_name: "Sara Pumpexpert" },
        company_members: {
          company_id: "c-1",
          role: "owner",
          companies: {
            id: "c-1",
            name: "Gulf Flow Equipment",
            is_active: true,
          },
        },
      },
    });

    expect(await getCurrentUser(client)).toEqual({
      userId: "u-1",
      email: "sara@gulfflow.example",
      fullName: "Sara Pumpexpert",
      company: { id: "c-1", name: "Gulf Flow Equipment", isActive: true },
      role: "owner",
    });
  });

  it("hides users whose company has been deactivated", async () => {
    const client = fakeClient({
      user: { id: "u-1" },
      tables: {
        company_members: {
          company_id: "c-1",
          role: "member",
          companies: { id: "c-1", name: "Closed Co", is_active: false },
        },
      },
    });
    expect(await getCurrentUser(client)).toBeNull();
  });
});
