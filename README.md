# Wedding RSVP

This is a project for my friend's wedding. The project is a small RSVP service targeting around 50 people and fully vibecoded with Claude.

**Stack:** Next.js 16 (App Router) · Tailwind v4 · Framer Motion · Prisma 7 · Neon Postgres · Vercel

## Local development

```bash
npm install            # postinstall generates the Prisma client
npm run dev            # http://localhost:3000
npm run db:seed        # reset the dev database to the 6 test guests
```

Requires `.env.local` with:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon **dev** branch, pooled (`-pooler`) string — app runtime |
| `DIRECT_URL` | Neon **dev** branch, direct string — migrations/CLI only |
| `ADMIN_PASSWORD` | Admin dashboard login |
| `SESSION_SECRET` | Signs the admin session cookie (32+ random bytes, base64) |

## Deployment workflow

Two long-lived git branches map to two Vercel environments, each with its own
Neon database branch:

```
git branch     Vercel environment          Neon branch
──────────     ─────────────────────       ─────────────────────────
main       ──► Production                  production  (real guests)
dev        ──► Preview (stable alias)      dev         (test data)
```

- **All work happens on `dev`.** Every push deploys to the stable preview
  URL — the playground for testing and design review.
- **`main` is a promotion gate.** When a batch is approved on the preview,
  merge `dev → main`; Vercel deploys production. Production points at the
  (initially empty) `production` Neon branch, so test data never leaks in.
- Environment separation is done with **scoped env vars** in Vercel
  (Production vs Preview values for `DATABASE_URL`, `ADMIN_PASSWORD`,
  `SESSION_SECRET`, `SITE_URL`). Same code, different config.

### Schema migrations

Migrations are applied per Neon branch, explicitly (they need the **direct**
connection string — the pooled endpoint blocks DDL):

```bash
# dev branch (DIRECT_URL from .env.local)
npx prisma migrate dev --name <change>

# production branch
DIRECT_URL=<production direct string> npx prisma migrate deploy
```

### Post-deploy smoke test

After any promote (or env-var change in Vercel), verify both deployed
environments:

```bash
node scripts/verify-deployed.mjs
```

Checks landing/invite/not-found/admin-gate/robots/OG on the playground and
production, asserting status codes as well as content. With
`PREVIEW_ADMIN_PASSWORD` / `PROD_ADMIN_PASSWORD` in `.env.local` it also logs
into each admin and verifies the dashboard renders (skipped otherwise).

### Go-live checklist

1. Rotate the Neon `production` role password; update Vercel's Production
   `DATABASE_URL`.
2. Strong `ADMIN_PASSWORD` + fresh `SESSION_SECRET` in Production scope.
3. Apply migrations to the production Neon branch (`prisma migrate deploy`).
4. Set `SITE_URL` to the final domain (custom domain optional).
5. Merge `dev → main`, verify production end-to-end.
6. Enter the real guest list in the production admin; send each guest their
   personal link via the invite-message modal.
