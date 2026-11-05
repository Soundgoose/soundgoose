import { NextResponse, type NextRequest } from "next/server";

function isStudioHost(host: string): boolean {
  if (!host) return false;
  const cleanHost =
    host.split(",")[0]?.trim().split(":")[0]?.toLowerCase() || "";
  return (
    cleanHost === "studio.soundgoose.com" ||
    cleanHost === "studio.localhost" ||
    cleanHost.startsWith("studio.")
  );
}

export function middleware(request: NextRequest) {
  const rawHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  const host = rawHost.split(",")[0]?.trim() || "";
  const { pathname } = request.nextUrl;
  const isStudio = isStudioHost(host);

  // Studio Subdomain Routing (without browser pop-up auth or redirect)
  if (isStudio) {
    // API endpoints (e.g. /api/studio/auth) should never be rewritten
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // If redundant /studio requested on studio subdomain, normalize to /
    if (pathname === "/studio" || pathname.startsWith("/studio/")) {
      const cleanPath = pathname.replace(/^\/studio/, "") || "/";
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = cleanPath;
      if (host) {
        redirectUrl.host = host;
      }
      const proto = request.headers.get("x-forwarded-proto");
      if (proto) {
        redirectUrl.protocol = proto.endsWith(":") ? proto : `${proto}:`;
      }
      return NextResponse.redirect(redirectUrl, 307);
    }

    // Rewrite internal request to app/studio catch-all route preserving search params
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/studio${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
