# Prisma Migrations

Run migrations from the repository root with:

```bash
npm run db:generate
npm run db:push
```

When the production PostgreSQL database is provisioned, replace `db:push` with
Prisma migration generation:

```bash
npx prisma migrate dev --schema packages/db/schema.prisma
```
