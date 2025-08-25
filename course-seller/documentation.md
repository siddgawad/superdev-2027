I will thoroughly explain how I am setting up the app and what goes on in my head as I implement it with step by step.

---

## PHASE 1 - Think of it like your mech control loop: quick sensors (unit tests, lint), a system ping (smoke test), and a gate (hooks/CI) that won’t let garbage through.

1. Unit Test (VITEST) : These act as seatbelts for logic. Tiny, fast checks for rules you don’t want to break later (e.g., “priceInCents must be > 0”, “slug is unique-ish”). You’ll lean on these when you refactor CRUD and Stripe.

2. E2E smoke (Playwright) = “does the app even boot & render?”. We keep only 1–2 of these fast smokes in CI; heavier flows stay local or nightly.

3. Lint + Typecheck = catch mistakes before running code (unused vars, wrong types).

4. Hooks (husky + lint-staged + commitlint) = block bad commits before they hit main and give you a readable history for changelogs.

---

##PHASE 2

---

Prisma is your database toolkit for TypeScript. It gives you:

Schema as code: one file (schema.prisma) that declares your tables and relations.

Migrations: turns that schema into real SQL that creates/updates your DB tables.

Type-safe client: an auto-generated TS client (Prisma Client) you import to read/write rows with autocompletion and types.

Think: instead of hand-writing SQL everywhere, you keep one source of truth (the schema). Prisma creates the tables and gives you a typed API to use in Next.js.

What Docker + Postgres is doing

Docker Compose starts a local Postgres server on your machine for development.

In the compose file we set POSTGRES_DB=app. That means the container boots with a database named app already created.

Data is kept in a Docker volume so it persists across restarts.

You don’t manually click around to “make a DB.” You run docker compose up -d, and the container provides a running Postgres server with a DB called app.

Next API route ➜ lib/db.ts (Prisma Client) ➜ DATABASE_URL ➜ Docker Postgres (tables created by migrations).
Goal: put the database plumbing in place so tomorrow’s Auth + Products CRUD + Stripe can “just work”.

Start Postgres (Docker)
So you have a real DB to talk to locally.

Define Prisma schema
So your tables (User, Product, Order) exist and are versioned.

Run migration
So Prisma actually creates those tables inside Postgres.

Seed a couple rows
So your UI/tests don’t start empty.

Health endpoint pings DB
So you can see { ok: true, db: "ok" } and know the connection works.

(CI later) In CI we only run prisma generate for types; we don’t spin a DB during build. That’s why we architect code so it doesn’t connect during build, only at request time.
