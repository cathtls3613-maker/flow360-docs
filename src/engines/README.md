# Engines

Engines are the business brains of FLOW360. Each engine owns one area of
business logic and exposes it as plain TypeScript services — **never**
inside React components. Screens call engines; engines never depend on
screens.

## Rules

1. **No business logic in components.** If a calculation, validation, or
   decision matters to the business, it lives in an engine.
2. **Engines are reusable.** The Costing Engine serves CPQ today and the
   Supplier Portal tomorrow without modification.
3. **No duplicated logic.** If two engines need the same rule, it moves
   to the engine that owns it and the other calls it.
4. **Configuration before customization.** Behavior differences between
   customers are data (rules, components, settings), not code forks.
5. **Every business action is auditable.** Engines record who did what,
   when, and why.

## Engine map

| Engine         | Owns                                                         |
| -------------- | ------------------------------------------------------------ |
| `identity`     | Companies (tenants), users, roles, permissions, sessions     |
| `master-data`  | Products, customers, suppliers, currencies, units of measure |
| `costing`      | Supplier cost → landed cost → company cost, cost components  |
| `pricing`      | Pricing methods, price lists, discounts, margin calculation  |
| `rules`        | Configurable business rules evaluated by other engines       |
| `approval`     | Approval matrices, approval requests, escalation             |
| `workflow`     | Multi-step business processes and their state                |
| `document`     | Generated documents (quotes, POs), templates, storage        |
| `notification` | In-app, email, and future channel notifications              |
| `ai`           | Document extraction, price suggestions, predictions          |

## Internal structure of an engine

As engines gain real code (starting Sprint 2), each follows the same
layout:

```
engines/<name>/
├── domain/         # Types and pure business rules (no I/O)
├── repository/     # Data access (Supabase queries live here only)
├── service/        # Use-cases that orchestrate domain + repository
└── index.ts        # Public API — the ONLY thing other code imports
```

Other code imports from `@/engines/<name>` — never from an engine's
internal folders.
