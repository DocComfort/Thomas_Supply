# Thomas Supply Dealer Portal

Production-oriented MVP scaffold for a secure dealer portal that sits in front
of Odoo. Odoo remains the source of truth for product, pricing, inventory,
invoice, and order data. This app is the dealer-facing portal and integration
layer.

## What Is Included

- Next.js 14 App Router app in `apps/web`
- Strict TypeScript, Tailwind CSS, shadcn-style local UI primitives
- Prisma PostgreSQL schema in `packages/db/schema.prisma`
- In-memory demo repository for local MVP use without a database
- Mock Odoo adapter in `packages/odoo`
- Shared Zod validation, roles, permissions, and constants in `packages/shared`
- Dealer login abstraction with demo users
- Dealer dashboard, product search, product detail, inventory, cart, and order request flow
- Admin dashboards for dealer accounts, dealer users, product cache, order requests, sync logs, audit logs, and integration settings
- Sync job entrypoints in `jobs`
- API route examples that validate session through server-side services

## Project Structure

```text
apps/web
  app
    (dealer)
    (admin)
    api
  components
  lib

packages/odoo
  client.ts
  products.ts
  pricing.ts
  inventory.ts
  orders.ts
  invoices.ts
  types.ts

packages/db
  prisma
  schema.prisma
  migrations

packages/shared
  validation
  permissions
  constants

jobs
  sync-products.ts
  sync-inventory.ts
  sync-pricing.ts
  sync-orders.ts
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Demo users:

- `owner@acme.test`
- `purchaser@acme.test`
- `tech@acme.test`
- `admin@thomassupply.test`
- `sales@thomassupply.test`

## Environment Variables

Copy `.env.example` to `apps/web/.env.local`.

```bash
ODOO_BASE_URL=
ODOO_DATABASE=
ODOO_USERNAME=
ODOO_API_KEY=
DATABASE_URL=
AUTH_SECRET=
REDIS_URL=
ALLOW_DEMO_AUTH=false
ODOO_ALLOW_MOCK=false
```

When Odoo variables are blank, the app uses mock responses from
`packages/odoo/mock-data.ts` in local development. Production fails closed unless
`ODOO_ALLOW_MOCK=true` is explicitly set for a mocked preview environment.

## PostgreSQL / Prisma

The UI currently uses in-memory demo data so the MVP can run immediately. The
production schema is ready in `packages/db/schema.prisma`.

After provisioning PostgreSQL:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

For production change management, replace `db:push` with Prisma migrations:

```bash
npx prisma migrate dev --schema packages/db/schema.prisma
```

## Connecting Real Odoo

Add credentials in Vercel or `apps/web/.env.local`:

- `ODOO_BASE_URL`
- `ODOO_DATABASE`
- `ODOO_USERNAME`
- `ODOO_API_KEY`

Then replace the `throw new Error("Real Odoo ... is not implemented")` blocks in
`packages/odoo/*.ts` with JSON-RPC or XML-RPC calls through
`packages/odoo/client.ts`.

Frontend code does not call Odoo directly. Dealer and admin UI calls server
services or API routes, and those services call the Odoo adapter.

## Security Notes

- Odoo credentials are server-only environment variables.
- Dealer account access is resolved from the authenticated user's membership.
- Client-provided dealer account IDs are never trusted without membership checks.
- Dealer-facing services validate permissions before returning pricing, inventory, cart, or order data.
- Pricing views, cart changes, order submissions, and Odoo failures write audit logs.
- `apps/web/lib/rate-limit.ts` is a Redis-ready placeholder for rate limiting.
- `apps/web/app/error.tsx` provides centralized user-facing error handling.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run db:generate
npm run db:push
npm run db:seed
```

## Known MVP Gaps

- Demo auth uses an HTTP-only cookie and seeded users; replace with Clerk, Auth0,
  or Supabase Auth before production.
- Demo auth is signed and disabled in production unless `ALLOW_DEMO_AUTH=true`,
  but it is still not a replacement for a real identity provider.
- In-memory data resets when the server restarts; connect PostgreSQL for durable
  carts, orders, logs, and cache records.
- Real Odoo RPC calls are intentionally stubbed behind the adapter.
- Redis rate limiting and cache persistence are placeholders.
- Admin mutation screens are read-only in this MVP.
- Sentry is ready to add at the error boundary/service layer, but not installed.
