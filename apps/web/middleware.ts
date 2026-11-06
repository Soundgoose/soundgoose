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

  // 1. Studio Subdomain Operations Portal
  if (isStudio) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-is-studio", "true");

    // API endpoints (e.g. /api/studio/auth) should never be rewritten
    if (pathname.startsWith("/api/")) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // Allow public content views (/blog, /newsletter) to render directly on any host
    if (pathname.startsWith("/blog") || pathname.startsWith("/newsletter")) {
      return NextResponse.next();
    }

    // Normalize redundant /studio requested on studio subdomain
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

    const session = request.cookies.get("sg_studio_session")?.value;
    const isAuthenticated = session === "authenticated";

    // Unauthenticated: rewrite all paths to internal passcode gate (/studio/login)
    if (!isAuthenticated) {
      const loginRewrite = request.nextUrl.clone();
      loginRewrite.pathname = "/studio/login";
      return NextResponse.rewrite(loginRewrite, {
        request: {
          headers: requestHeaders,
        },
      });
    }

    // Authenticated visiting /login -> redirect to overview (/)
    if (pathname === "/login") {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";
      if (host) {
        homeUrl.host = host;
      }
      return NextResponse.redirect(homeUrl, 307);
    }

    // Authenticated -> rewrite to internal /studio route group
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/studio${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 2. Public Site: Block any access to /studio with 404
  if (
    !isStudio &&
    (pathname === "/studio" || pathname.startsWith("/studio/"))
  ) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
