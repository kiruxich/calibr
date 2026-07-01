import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { CLIENT_COOKIE, readClientToken } from "@/lib/client-auth";

/**
 * Protects /admin and /cabinet (Next.js 16 renamed Middleware → Proxy).
 * Unauthenticated requests are redirected to the matching login page.
 * The login pages and their auth actions are always reachable.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Client cabinet ──
  if (pathname.startsWith("/cabinet")) {
    const publicCabinet = ["/cabinet/login", "/cabinet/register", "/cabinet/forgot"];
    if (publicCabinet.includes(pathname)) return NextResponse.next();
    const phone = await readClientToken(request.cookies.get(CLIENT_COOKIE)?.value);
    if (!phone) {
      const url = request.nextUrl.clone();
      url.pathname = "/cabinet/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ── Admin ──
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cabinet/:path*"],
};
