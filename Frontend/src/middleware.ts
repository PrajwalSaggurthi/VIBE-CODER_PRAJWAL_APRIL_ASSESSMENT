import { NextRequest, NextResponse } from "next/server";

/**
 * Multi-tenant subdomain routing middleware.
 *
 * Supports two modes:
 * 1. Subdomain mode: tenant.yourdomain.com → /site/[tenant]
 * 2. Path mode (dev/Vercel preview): yourdomain.com/site/[tenant]
 *
 * Static assets, API routes, and Next.js internals are passed through.
 */

const PUBLIC_PATHS = [
  "/api",
  "/_next",
  "/favicon.ico",
  "/fonts",
  "/images",
  "/site",
  "/login",
  "/register",
  "/dashboard",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Skip static assets and known paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Skip root path (landing page)
  if (pathname === "/") {
    return NextResponse.next();
  }

  // ── Subdomain Detection ────────────────────────
  // Extract subdomain from hostname (e.g., "prajwal.linkhub.vercel.app")
  const appDomain = process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname
    : "localhost";

  // Remove port for comparison
  const currentHost = hostname.split(":")[0];

  // Check if request is on a subdomain
  if (currentHost !== appDomain && currentHost.endsWith(appDomain)) {
    const subdomain = currentHost.replace(`.${appDomain}`, "");

    // Rewrite to /site/[subdomain] without changing the URL
    const url = request.nextUrl.clone();
    url.pathname = `/site/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
