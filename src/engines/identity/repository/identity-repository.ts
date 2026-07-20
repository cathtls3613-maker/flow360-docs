import type { SupabaseClient } from "@supabase/supabase-js";

import { AppError } from "@/lib/errors";
import type { UUID } from "@/types";

import type { Company, CompanyRole, UserProfile } from "../domain/types";

/**
 * Data access for the Identity Engine. The ONLY place identity tables
 * are queried. Row Level Security applies to every query here — a user
 * can only ever read rows their policies allow.
 */

interface MembershipRow {
  company_id: string;
  role: CompanyRole;
  companies: {
    id: string;
    name: string;
    is_active: boolean;
  } | null;
}

interface ProfileRow {
  id: string;
  full_name: string;
}

/** The user's profile, or null when it doesn't exist yet. */
export async function findProfile(
  client: SupabaseClient,
  userId: UUID,
): Promise<UserProfile | null> {
  const { data, error } = await client
    .from("user_profiles")
    .select("id, full_name")
    .eq("id", userId)
    .maybeSingle<ProfileRow>();

  if (error) {
    throw new AppError("Failed to load user profile.", { cause: error });
  }
  if (!data) {
    return null;
  }
  return { id: data.id, fullName: data.full_name };
}

/**
 * The user's active company membership (company + role), or null when
 * they belong to no active company. Single-membership for now; the
 * schema already supports several.
 */
export async function findActiveMembership(
  client: SupabaseClient,
  userId: UUID,
): Promise<{ company: Company; role: CompanyRole } | null> {
  const { data, error } = await client
    .from("company_members")
    .select("company_id, role, companies (id, name, is_active)")
    .eq("user_id", userId)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle<MembershipRow>();

  if (error) {
    throw new AppError("Failed to load company membership.", { cause: error });
  }
  if (!data || !data.companies || !data.companies.is_active) {
    return null;
  }

  return {
    company: {
      id: data.companies.id,
      name: data.companies.name,
      isActive: data.companies.is_active,
    },
    role: data.role,
  };
}
