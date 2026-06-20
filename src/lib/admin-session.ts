import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

// Cookie writes are only allowed inside a Server Action / Route Handler.
export async function createAdminSession() {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key());
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroyAdminSession() {
  const jar = await cookies();
  // Match the path the cookie was set with so logout reliably clears it.
  jar.delete({ name: COOKIE, path: "/" });
}

// The real gate. cache() dedupes within a request. No redirect — returns a
// boolean so it's safe to use from Route Handlers too.
export const isAdmin = cache(async (): Promise<boolean> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
});

// For pages/layouts: redirect to login when not authenticated.
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
