# FLOW360 Testing Standard

Testing is not a phase; it ships with the code. CI blocks any merge
with failing tests.

## Test types

| Type | Tool       | Location      | Speed        | What it proves                            |
| ---- | ---------- | ------------- | ------------ | ----------------------------------------- |
| Unit | Vitest     | `tests/unit/` | Milliseconds | Logic and components behave correctly     |
| E2E  | Playwright | `tests/e2e/`  | Seconds      | Real user journeys work in a real browser |

## What must be tested

1. **Engine logic: always.** Every calculation, validation, and business
   decision gets unit tests, including edge cases (zero quantities,
   negative margins, missing components, rounding).
2. **Money math: exhaustively.** Costing and pricing bugs destroy trust
   in the product. Test rounding behavior explicitly.
3. **Screens: the happy path.** Each feature gets at least one e2e test
   walking through its primary user journey.
4. **Multi-tenancy: by design.** Whenever data access is involved, tests
   must cover that company A can never read company B's records.

## Writing good tests

- Test **behavior through public APIs** (an engine's `index.ts`, a
  component's rendered output) — not internal implementation details.
- One logical assertion per test; the test name states the expected
  behavior in plain language:
  `it("applies freight as a percentage of supplier cost")`.
- Use realistic business data in examples (pumps, seals, quotations),
  not `foo`/`bar`.
- Tests are deterministic: no real network, no real clock dependence,
  no ordering dependence.
- Prefer accessible queries in UI tests (`getByRole`, `getByLabelText`)
  — they double as an accessibility check.

## Commands

```bash
npm run test            # all unit tests once
npm run test:watch      # unit tests re-run as you code
npm run test:coverage   # unit tests + coverage report
npm run test:e2e        # end-to-end suite (builds and runs the app)
```

## Coverage

Coverage is a signal, not a target to game. Engines should sit near
full coverage because they are pure logic; UI plumbing may be lower.
Reviewers judge whether the _risky_ code is tested, not the percentage.
