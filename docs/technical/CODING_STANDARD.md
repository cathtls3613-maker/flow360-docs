# FLOW360 Coding Standard

The rules below are enforced by tooling wherever possible (ESLint,
Prettier, TypeScript strict mode, Husky). Reviewers enforce the rest.

## TypeScript

- **Strict mode always.** `tsconfig.json` has `strict: true`; never
  weaken it.
- **No `any`.** Use precise types, or `unknown` plus narrowing when the
  shape genuinely isn't known yet.
- **Model the domain.** Business concepts get named types/interfaces in
  the owning engine's `domain` folder; shared primitives live in
  `src/types`.
- **`const` by default**, `let` only when reassignment is required,
  `var` never.
- **Strict equality** (`===` / `!==`) always.

## Architecture

- **Modular monolith.** One deployable application, internally split
  into engines. No microservices.
- **Engines own business logic** (`src/engines/<name>`), structured as
  `domain` (pure logic, no I/O), `repository` (all data access),
  `service` (use-cases), and `index.ts` (the only public entry point).
- **Features own screens** (`src/features/<name>`) and call engines.
  Never import another module's internals.
- **React components are presentation only.** If a function decides
  something the business cares about, it does not live in a component.
- **Repository pattern.** Database queries appear only inside an
  engine's `repository` layer — never in components, hooks, or pages.
- **No duplicated business logic.** One rule, one owner, one
  implementation.

## Multi-tenancy and audit

- Every business table carries `id` (UUID), `company_id`, `created_at`,
  `updated_at`, `created_by`, `updated_by`, `is_active`.
- Row Level Security is mandatory on every business table. Application
  code never relies on "remembering to filter" by company.
- Records are deactivated (`is_active = false`), not deleted, unless a
  law requires true deletion.
- Calculated values (costs, prices) are versioned, never overwritten.

## Errors and logging

- Raise errors from the `AppError` hierarchy (`src/lib/errors.ts`).
  Expected business failures are operational errors with a stable code;
  everything else stays non-operational and users see a generic message.
- Log through `src/lib/logger.ts` with structured context objects.
  Direct `console.log` is a lint error.
- Never log secrets, tokens, or personal data.

## Configuration

- Environment variables are declared and validated in `src/lib/env.ts`
  and documented in `.env.example`. Direct `process.env` reads anywhere
  else are forbidden.
- Only `NEXT_PUBLIC_`-prefixed variables may reach the browser, and
  they must never contain secrets.

## Naming and style

- Files and folders: `kebab-case` (`cost-component.ts`).
- Types and components: `PascalCase`. Variables and functions:
  `camelCase`. Constants: `UPPER_SNAKE_CASE`.
- Names say what something is for, not how it works
  (`landedCostTotal`, not `sum2`).
- Comments explain **why**, not what. Delete commented-out code.
- Formatting is Prettier's job — never argue with it.

## Dependencies

- Prefer the platform and existing dependencies over new packages.
- Adding a dependency requires a reason a reviewer accepts: actively
  maintained, widely used, licence-compatible.
