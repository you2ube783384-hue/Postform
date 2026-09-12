import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });

  // Match the login route's protocol-aware Secure flag so the cookie
  // clears reliably on both HTTPS and HTTP (tunneled) deployments.
  const isHttps =
    req.nextUrl.protocol === "https:" ||
    req.headers.get("x-forwarded-proto") === "https";

  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    maxAge: 0,
    path: "/",
  });
  return res;
}
