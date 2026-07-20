# Supabase database

This folder holds the database migrations — versioned SQL scripts that
build the FLOW360 database. They run **in filename order**, and each one
runs exactly once per environment.

## Applying migrations

**Option A — Supabase dashboard (no tooling needed):**
Open your project → SQL Editor → paste the contents of each file in
`migrations/` (in order) → Run. Full walkthrough:
[docs/guides/SUPABASE_SETUP.md](../docs/guides/SUPABASE_SETUP.md).

**Option B — Supabase CLI (for engineers):**

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

## Rules

- Never edit a migration that has already been applied anywhere —
  write a new one.
- Every new business table must follow the multi-tenant standard (see
  `docs/technical/DATABASE.md`) and enable Row Level Security before
  it holds any data.
