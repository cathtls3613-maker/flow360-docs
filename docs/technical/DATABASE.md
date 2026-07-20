# FLOW360 Database Standard

PostgreSQL on Supabase. Schema changes happen only through migration
files in `supabase/migrations/` — never by hand-editing a live database.

## The multi-tenant standard (non-negotiable)

Every business table carries:

| Column       | Type          | Purpose                                     |
| ------------ | ------------- | ------------------------------------------- |
| `id`         | `uuid` PK     | Identity (`gen_random_uuid()`)              |
| `company_id` | `uuid` FK     | The tenant that owns the row                |
| `created_at` | `timestamptz` | When the row was created                    |
| `updated_at` | `timestamptz` | Maintained by the `set_updated_at` trigger  |
| `created_by` | `uuid` FK     | User who created the row (audit trail)      |
| `updated_by` | `uuid` FK     | User who last changed the row (audit trail) |
| `is_active`  | `boolean`     | Soft delete — deactivate, never erase       |

Exceptions: `companies` itself (it _is_ the tenant) and `user_profiles`
(1:1 with a person, who may belong to several companies).

## Row Level Security (RLS)

- **Enabled on every table before it holds data.** The database refuses
  cross-company access even if application code has a bug.
- Policies express membership through the `SECURITY DEFINER` helpers
  `user_company_ids()` and `user_has_role(company_id, roles[])` — never
  by trusting a `company_id` value sent from the client.
- The service-role key bypasses RLS. It exists for server-side
  administrative jobs only and never reaches a browser.

## Conventions

- Table names: plural `snake_case` (`cost_components`).
- Versioned values (costs, prices) get new rows, never `UPDATE`s that
  overwrite history.
- Enums for closed sets (`company_role`); reference tables for sets an
  administrator can extend (cost component types, later).
- Migrations are append-only: a shipped migration is never edited — a
  new migration corrects it.
- Every migration is one transaction-safe script with a header comment
  explaining its business purpose.

## Current schema (after migration 0001)

- `companies` — the tenants.
- `user_profiles` — one per person, keyed to `auth.users`.
- `company_members` — who belongs to which company with which role
  (`owner` / `admin` / `member`); unique per (company, user).
- Sign-up trigger `handle_new_user` — atomically creates the company,
  profile, and owner membership when a user registers.
