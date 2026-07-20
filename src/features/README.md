# Features

Features are the user-facing modules of FLOW360 — what a user would call
"the CPQ module" or "the CRM module". Each feature folder contains the
screens, forms, and UI state for one module, and calls engines for all
business logic.

## Rules

1. A feature may import from `@/engines/*`, `@/components/*`, `@/lib/*`,
   and `@/types` — never from another feature's internals.
2. No business logic here: if you're writing a calculation or a business
   decision inside a feature, it belongs in an engine.
3. Each feature follows the same layout:

```
features/<name>/
├── components/     # Screens and UI pieces for this module
├── hooks/          # UI state and data-fetching hooks (TanStack Query)
└── index.ts        # Public API
```

Planned features (built in later sprints): smart-costing, smart-pricing,
cpq, crm, purchasing, inventory, warehouse, service, installed-base,
warranty, customer-portal, supplier-portal, ai-copilot, dashboard.
