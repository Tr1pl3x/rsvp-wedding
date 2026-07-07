# Operations runbook

Working notes for running and promoting this project. Portfolio readers can safely skip this; it exists so future-me does not have to rediscover any of it.

## Environment variables

`.env.local` (gitignored) needs:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon **dev** branch, pooled (`-pooler`) string, used by the app at runtime |
| `DIRECT_URL` | Neon **dev** branch, direct string, migrations and CLI only |
| `ADMIN_PASSWORD` | Admin dashboard login |
| `SESSION_SECRET` | Signs the admin session cookie (32+ random bytes, base64) |
| `PROD_DIRECT_URL` | Storage convention only, nothing reads it: a safe place to keep the production direct string. Copy its value into `DIRECT_URL` when running an explicit prod migration |
| `PREVIEW_ADMIN_PASSWORD` | (optional) arms the deployed smoke test's playground admin-login check |
| `PROD_ADMIN_PASSWORD` | (optional) arms the deployed smoke test's production admin-login check |

In Vercel, `DATABASE_URL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` carry different values in the Production and Preview scopes. `SITE_URL` is an optional override for link-preview URLs once a custom domain exists; without it, `metadataBase` derives from Vercel's own environment.

## Schema migrations

Migrations are applied per Neon branch, explicitly. They need the **direct**
connection string, since the pooled endpoint blocks DDL:

```bash
# dev branch (DIRECT_URL from .env.local)
npx prisma migrate dev --name <change>

# production branch
DIRECT_URL=<production direct string> npx prisma migrate deploy
```

Production migrations are a deliberate, manual act. The Vercel build only runs
`next build` and `prisma generate`, so deploys never touch the schema.

## Post-deploy smoke test

After any promote (or env-var change in Vercel), verify both deployed
environments:

```bash
node scripts/verify-deployed.mjs
```

Checks landing, invite, not-found, admin gate, robots, and the OG image on the
playground and production, asserting status codes as well as content. With
`PREVIEW_ADMIN_PASSWORD` / `PROD_ADMIN_PASSWORD` in `.env.local` it also logs
into each admin and verifies the dashboard renders (skipped otherwise). It
asserts the amber Dev badge is present on the playground dashboard and absent
on production.

## Go-live checklist

1. Rotate the Neon `production` role password; update Vercel's Production
   `DATABASE_URL`.
2. Strong `ADMIN_PASSWORD` + fresh `SESSION_SECRET` in Production scope.
3. Apply migrations to the production Neon branch (`prisma migrate deploy`).
4. (Optional) set `SITE_URL` if a custom domain is added.
5. Merge `dev → main`, verify production end to end.
6. Enter the real guest list in the production admin; send each guest their
   personal link via the invite-message modal.
