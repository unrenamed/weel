import { type NextFetchEvent, type NextRequest } from "next/server";
import { AppMiddleware, LinkMiddleware } from "./lib/middleware";
import { parse } from "./lib/utils";

const DASHBOARD_HOSTNAMES = new Set(process.env.DASHBOARD_HOSTNAMES.split(","));

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { domain } = parse(req);

  if (DASHBOARD_HOSTNAMES.has(domain)) {
    return AppMiddleware(req, ev);
  }

  return LinkMiddleware(req, ev);
}
