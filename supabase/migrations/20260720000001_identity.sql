-- ============================================================================
-- FLOW360 Migration 0001: Identity foundation
-- Companies (tenants), user profiles, memberships, Row Level Security.
--
-- Multi-tenant rules enforced here for every business table:
--   * UUID primary keys
--   * company_id on tenant-scoped tables
--   * created_at / updated_at / created_by / updated_by audit columns
--   * is_active soft-delete flag (records are deactivated, never erased)
--   * Row Level Security ON — the database itself refuses cross-company reads
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Shared helpers
-- ---------------------------------------------------------------------------

-- Keeps updated_at correct automatically on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 1. Roles
-- ---------------------------------------------------------------------------

-- Sprint 2 roles. Fine-grained configurable permissions arrive with the
-- Rule/Approval engines; these three cover workspace administration.
create type public.company_role as enum ('owner', 'admin', 'member');

-- ---------------------------------------------------------------------------
-- 2. Tables
-- ---------------------------------------------------------------------------

-- The tenant. Every business record in FLOW360 hangs off a company.
create table public.companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(trim(name)) between 1 and 200),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id),
  updated_by  uuid references auth.users (id),
  is_active   boolean not null default true
);

-- One profile per authenticated user (1:1 with auth.users).
create table public.user_profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '' check (char_length(full_name) <= 200),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  is_active   boolean not null default true
);

-- Which users belong to which company, and with what role.
-- A user has one membership per company; the design already supports a
-- user belonging to several companies later.
create table public.company_members (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.companies (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  role        public.company_role not null default 'member',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id),
  updated_by  uuid references auth.users (id),
  is_active   boolean not null default true,
  unique (company_id, user_id)
);

create index company_members_user_id_idx on public.company_members (user_id);
create index company_members_company_id_idx on public.company_members (company_id);

-- updated_at maintenance
create trigger set_companies_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

create trigger set_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

create trigger set_company_members_updated_at
  before update on public.company_members
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Security helper functions
-- ---------------------------------------------------------------------------

-- Companies the signed-in user belongs to. SECURITY DEFINER so RLS
-- policies can call it without recursing into company_members policies.
create or replace function public.user_company_ids()
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select company_id
  from public.company_members
  where user_id = auth.uid()
    and is_active = true;
$$;

-- True when the signed-in user holds one of the given roles in a company.
create or replace function public.user_has_role(
  target_company_id uuid,
  roles public.company_role[]
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.company_members
    where company_id = target_company_id
      and user_id = auth.uid()
      and role = any (roles)
      and is_active = true
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------

alter table public.companies enable row level security;
alter table public.user_profiles enable row level security;
alter table public.company_members enable row level security;

-- companies: members can see their company; owners/admins can update it.
create policy "members read own company"
  on public.companies for select
  using (id in (select public.user_company_ids()));

create policy "owners and admins update own company"
  on public.companies for update
  using (public.user_has_role(id, array['owner','admin']::public.company_role[]))
  with check (public.user_has_role(id, array['owner','admin']::public.company_role[]));

-- user_profiles: users manage their own profile and can see profiles of
-- colleagues in the same company.
create policy "users read own profile"
  on public.user_profiles for select
  using (id = auth.uid());

create policy "users read colleague profiles"
  on public.user_profiles for select
  using (
    id in (
      select user_id from public.company_members
      where company_id in (select public.user_company_ids())
        and is_active = true
    )
  );

create policy "users update own profile"
  on public.user_profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- company_members: members see their company's roster; owners/admins
-- manage it (invitation flows arrive in a later sprint).
create policy "members read own company roster"
  on public.company_members for select
  using (company_id in (select public.user_company_ids()));

create policy "owners and admins manage roster"
  on public.company_members for all
  using (public.user_has_role(company_id, array['owner','admin']::public.company_role[]))
  with check (public.user_has_role(company_id, array['owner','admin']::public.company_role[]));

-- Note: there is intentionally NO insert policy on companies for normal
-- users. Workspace creation happens exactly once per sign-up, inside the
-- trigger below, which runs with definer privileges.

-- ---------------------------------------------------------------------------
-- 5. Sign-up bootstrap
-- ---------------------------------------------------------------------------

-- When a new user signs up, atomically create their company workspace,
-- profile, and owner membership. The sign-up form passes company_name
-- and full_name in the auth metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_company_id uuid;
  company_name text;
  person_name text;
begin
  company_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'company_name'), ''),
    'My Company'
  );
  person_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    ''
  );

  insert into public.companies (name, created_by, updated_by)
  values (company_name, new.id, new.id)
  returning id into new_company_id;

  insert into public.user_profiles (id, full_name)
  values (new.id, person_name);

  insert into public.company_members (company_id, user_id, role, created_by, updated_by)
  values (new_company_id, new.id, 'owner', new.id, new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
