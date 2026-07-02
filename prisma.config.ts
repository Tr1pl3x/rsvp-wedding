import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// The Prisma 7 CLI no longer auto-loads env files, and this project keeps its
// env in .env.local (Next.js convention).
config({ path: ".env.local" });
config(); // fallback: .env

export default defineConfig({
  schema: "prisma/schema.prisma",
  // CLI-only (migrate/db). Must be the DIRECT string — PgBouncer on the
  // pooled endpoint blocks the DDL that migrations need. The runtime app uses
  // the pooled DATABASE_URL via the Neon adapter (src/lib/prisma.ts).
  // Conditional because env() throws when unset, which would break
  // `npm install` (postinstall -> prisma generate) on a fresh clone/CI that
  // has no DIRECT_URL — generate never touches the datasource.
  ...(process.env.DIRECT_URL
    ? { datasource: { url: env("DIRECT_URL") } }
    : {}),
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
