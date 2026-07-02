export type AppEnv = "production" | "preview" | "development";

// Which deployment environment we're running in. Server-side only —
// VERCEL_ENV is set by Vercel per deployment; locally we fall back to
// NODE_ENV (next dev -> development, next start -> production).
export function getAppEnv(): AppEnv {
  const vercel = process.env.VERCEL_ENV;
  if (vercel === "production" || vercel === "preview") return vercel;
  return process.env.NODE_ENV === "production" ? "production" : "development";
}
