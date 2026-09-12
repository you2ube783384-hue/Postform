import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE } from "@/lib/auth";

// Server-side protection for all admin routes — hiding links is not security.
// (Next.js 16: `middleware.ts` convention is deprecated — this is the `proxy.ts` replacement.)
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login endpoint/page handle their own credentials
  if (pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const valid = await verifySessionToken(token);

  if (pathname === "/admin/login") {
    if (valid) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (!valid) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
