# FLOW360

**The AI Operating System for Industrial Equipment Distributors.**

One platform for costing, pricing, quoting, selling, purchasing,
stocking, and servicing industrial equipment — pumps, valves,
mechanical seals, heat exchangers, compressors, motors, bearings,
instrumentation, and engineering services.

> Sprint 2 status: identity foundation. Companies can create a
> workspace, sign in, and reach a private dashboard. The database
> enforces multi-tenant isolation with Row Level Security. Business
> modules (costing, pricing, CRM, …) arrive in the coming sprints.

## Technology

| Layer      | Technology                                            |
| ---------- | ----------------------------------------------------- |
| Frontend   | Next.js (App Router), React, TypeScript, Tailwind CSS |
| UI kit     | shadcn/ui (components live in `src/components/ui`)    |
| Backend    | Supabase (PostgreSQL, Auth, Storage)                  |
| Testing    | Vitest (unit), Playwright (end-to-end)                |
| Deployment | Vercel via GitHub Actions CI                          |

## Getting started

Prerequisites: [Node.js 22+](https://nodejs.org) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Create your local settings file
cp .env.example .env.local

# 3. Start the development server
npm run dev
```

Open <http://localhost:3000> — you should see the FLOW360 landing page.

To enable sign-up, sign-in, and the dashboard, connect a (free)
Supabase project: follow
[docs/guides/SUPABASE_SETUP.md](docs/guides/SUPABASE_SETUP.md)
(~10 minutes, one time). Without it the public pages still work.

## Everyday commands

| Command              | What it does                               |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Start the app locally with live reload     |
| `npm run build`      | Compile the production build               |
| `npm run test`       | Run unit tests once                        |
| `npm run test:watch` | Run unit tests continuously while you code |
| `npm run test:e2e`   | Run browser tests against the real app     |
| `npm run lint`       | Check code quality                         |
| `npm run format`     | Auto-format the whole codebase             |
| `npm run typecheck`  | Verify all TypeScript types                |

## Project structure

```
├── docs/               Product Bible: business rules, standards, guides
├── supabase/           Database migrations (versioned SQL)
├── src/
│   ├── app/            Pages and screens (what users see)
│   ├── components/     Reusable UI building blocks
│   │   └── ui/         shadcn/ui primitives
│   ├── engines/        Business logic engines (see src/engines/README.md)
│   ├── features/       User-facing modules (see src/features/README.md)
│   ├── lib/            Shared plumbing: env, logger, errors, utils
│   └── types/          Shared type definitions
├── tests/
│   ├── unit/           Fast tests for logic and components
│   └── e2e/            Browser tests that drive the real app
└── .github/workflows/  CI pipeline
```

**The one architecture rule to remember:** business logic lives in
`src/engines`, never inside React components. Screens ask engines for
answers; they never compute business answers themselves.

## Quality gates

Every commit passes through automatic checks:

1. **Pre-commit** — staged files are linted and formatted (Husky + lint-staged).
2. **Commit message** — must follow [Conventional Commits](https://www.conventionalcommits.org)
   (e.g. `feat(pricing): add cost-plus method`), enforced by commitlint.
3. **CI** — GitHub Actions runs formatting, lint, type check, unit
   tests, build, and end-to-end tests on every push and pull request.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow and
[docs/technical/CODING_STANDARD.md](docs/technical/CODING_STANDARD.md)
for the coding rules.

## Deployment

The app deploys to [Vercel](https://vercel.com). Connect the GitHub
repository to a Vercel project once (Vercel dashboard → Add New →
Project → import this repo); after that every merge to `main` deploys
automatically and every pull request gets its own preview URL.

## License

Proprietary. © FLOW360. All rights reserved.
