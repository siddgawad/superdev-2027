I will thoroughly explain how I am setting up the app and what goes on in my head as I implement it with step by step.

---

## PHASE 1 - Think of it like your mech control loop: quick sensors (unit tests, lint), a system ping (smoke test), and a gate (hooks/CI) that won’t let garbage through.

1. Unit Test (VITEST) : These act as seatbelts for logic. Tiny, fast checks for rules you don’t want to break later (e.g., “priceInCents must be > 0”, “slug is unique-ish”). You’ll lean on these when you refactor CRUD and Stripe.

2. E2E smoke (Playwright) = “does the app even boot & render?”. We keep only 1–2 of these fast smokes in CI; heavier flows stay local or nightly.

3. Lint + Typecheck = catch mistakes before running code (unused vars, wrong types).

4. Hooks (husky + lint-staged + commitlint) = block bad commits before they hit main and give you a readable history for changelogs.

---
