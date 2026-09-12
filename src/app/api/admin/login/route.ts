import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, adminPassword, ADMIN_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Malformed request body (missing / non-string / empty password field)
    // is a client error -> 400. A well-formed but WRONG password is an
    // authentication failure -> 401.
    if (typeof body.password !== "string" || body.password.length === 0) {
      return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
    }

    if (body.password !== adminPassword()) {
      return NextResponse.json({ error: "INVALID_PASSWORD" }, { status: 401 });
    }

    const { token, maxAge } = await createSessionToken();
    const res = NextResponse.json({ ok: true });

    // Only mark the cookie Secure when the request actually arrived over
    // HTTPS (directly or behind a TLS-terminating proxy). A hardcoded
    // `secure: NODE_ENV === "production"` breaks session cookies on
    // HTTP deployments and HTTP-tunneled test runs.
    const isHttps =
      req.nextUrl.protocol === "https:" ||
      req.headers.get("x-forwarded-proto") === "https";

    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isHttps,
      maxAge,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }
}
