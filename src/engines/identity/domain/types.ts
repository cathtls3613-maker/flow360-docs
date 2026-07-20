import type { ISODateTime, UUID } from "@/types";

/** Role a user holds within one company workspace. */
export type CompanyRole = "owner" | "admin" | "member";

/** A tenant: one distributor company using FLOW360. */
export interface Company {
  id: UUID;
  name: string;
  isActive: boolean;
}

/** A person's profile (1:1 with their login account). */
export interface UserProfile {
  id: UUID;
  fullName: string;
}

/**
 * Everything the application needs to know about the signed-in user:
 * who they are, which company they act for, and with what role.
 */
export interface CurrentUser {
  userId: UUID;
  email: string;
  fullName: string;
  company: Company;
  role: CompanyRole;
}

/** Input for creating a company workspace (sign-up). */
export interface SignUpInput {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
}

/** Input for signing in. */
export interface SignInInput {
  email: string;
  password: string;
}

/** Result of a sign-up attempt. */
export interface SignUpResult {
  /**
   * True when Supabase requires the user to confirm their email before
   * the first sign-in (the default for new Supabase projects).
   */
  requiresEmailConfirmation: boolean;
}

/** Kept for future audit displays. */
export interface Membership {
  companyId: UUID;
  role: CompanyRole;
  createdAt: ISODateTime;
}
