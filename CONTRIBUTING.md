# Contributing to FLOW360

FLOW360 is commercial enterprise software. Every change — no matter how
small — follows the same workflow so quality stays consistent as the
team grows.

## Workflow

1. **Branch** off `main`:

   ```bash
   git checkout main && git pull
   git checkout -b feat/short-description
   ```

   Branch prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`,
   `test/`.

2. **Develop.** Keep commits small and focused. The pre-commit hook
   formats and lints staged files automatically.

3. **Commit** using [Conventional Commits](https://www.conventionalcommits.org):

   ```
   <type>(<optional scope>): <description>
   ```

   Examples:
   - `feat(costing): add landed cost calculation`
   - `fix(crm): prevent duplicate customer creation`
   - `docs: explain approval matrix configuration`

   Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`,
   `test`, `build`, `ci`, `chore`, `revert`. The commit-msg hook
   rejects anything else.

4. **Verify locally** before pushing:

   ```bash
   npm run lint && npm run typecheck && npm run test && npm run build
   ```

5. **Open a pull request.** CI must be green before merge. Keep PRs
   reviewable — under ~400 changed lines where possible.

## Rules that are never negotiable

- **No business logic in React components.** It belongs in `src/engines`.
- **No `any` types.** Model the data properly or use `unknown` + narrowing.
- **No direct `console.log`.** Use the logger (`@/lib/logger`).
- **No direct `process.env` reads.** Declare variables in `src/lib/env.ts`.
- **No secrets in git.** Local secrets go in `.env.local` (ignored);
  new variables are documented in `.env.example` without values.
- **Every business table is multi-tenant** (see `TenantEntity` in
  `src/types`): `id`, `company_id`, `created_at`, `updated_at`,
  `created_by`, `updated_by`, `is_active`.
- **Tests accompany logic.** New engine code ships with unit tests;
  new screens with at least one e2e happy path.

## Adding UI components

Use shadcn/ui first — don't hand-build what the kit provides:

```bash
npx shadcn@latest add <component>
```

Components land in `src/components/ui` and belong to us; adjust them
there when the design requires it.

## Questions

Read `src/engines/README.md` and `src/features/README.md` first — they
define where code goes. If it's still unclear, ask before writing code.
