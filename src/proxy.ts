import { NextResponse, type NextRequest } from "next/server";

// Optimistic only — redirects unauthenticated /admin/* to the login page for a
// nicer UX. It checks cookie PRESENCE, not validity; the real gate is
// requireAdmin() in the admin layout and isAdmin() in every admin action/route.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  if (!request.cookies.has("admin_session")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: "/admin/:path*" };
