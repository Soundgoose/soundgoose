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

function parseBasicAuth(
  header: string | null,
): { user: string; pass: string } | null {
  if (!header || !header.toLowerCase().startsWith("basic ")) return null;
  try {
    const base64 = header.slice(6).trim();
    const decoded = atob(base64);
    const colonIndex = decoded.indexOf(":");
    if (colonIndex === -1) return null;
    return {
      user: decoded.slice(0, colonIndex),
      pass: decoded.slice(colonIndex + 1),
    };
  } catch {
    return null;
  }
}

function safeCompare(a: string, b: string): boolean {
  const lenA = a.length;
  const lenB = b.length;
  let result = lenA ^ lenB;
  const maxLen = Math.max(lenA, lenB);
  for (let i = 0; i < maxLen; i++) {
    const charA = i < lenA ? a.charCodeAt(i) : 0;
    const charB = i < lenB ? b.charCodeAt(i) : 0;
    result |= charA ^ charB;
  }
  return result === 0;
}

export function middleware(request: NextRequest) {
  const rawHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  const host = rawHost.split(",")[0]?.trim() || "";
  const { pathname, search } = request.nextUrl;
  const isStudio = isStudioHost(host);

  // 1. Studio Subdomain Handling
  if (isStudio) {
    const authHeader = request.headers.get("authorization");
    const expectedUser = process.env.STUDIO_AUTH_USER?.trim() || "soundgoose";
    const expectedPass =
      process.env.STUDIO_AUTH_PASSWORD?.trim() || "soundgoose-studio-access";

    const creds = parseBasicAuth(authHeader);
    const isAuthenticated =
      creds !== null &&
      safeCompare(creds.user, expectedUser) &&
      safeCompare(creds.pass, expectedPass);

    if (!isAuthenticated) {
      return new NextResponse("Authentication Required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Soundgoose Studio"',
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    // Clean up redundant /studio prefix if requested on studio subdomain
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

  // 2. Redirect legacy /studio access on main domain to studio subdomain
  if (pathname === "/studio" || pathname.startsWith("/studio/")) {
    const [hostname, port] = host.split(":");
    const isLocal =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      (hostname !== undefined && hostname.endsWith(".localhost"));

    const targetProtocol = isLocal ? "http" : "https";
    const targetHost = isLocal
      ? `studio.localhost${port ? `:${port}` : ""}`
      : "studio.soundgoose.com";

    const remainder = pathname.replace(/^\/studio/, "") || "/";
    const targetUrl = `${targetProtocol}://${targetHost}${remainder}${search || ""}`;
    return NextResponse.redirect(targetUrl, 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets with extensions (svg, png, jpg, jpeg, gif, webp, ico)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
