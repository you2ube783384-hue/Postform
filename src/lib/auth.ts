// POSTFORM admin auth — HMAC-signed session tokens
// Works in both Node runtime (API routes) and Edge runtime (middleware) via Web Crypto.

const COOKIE_NAME = "pf_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "pf_dev_secret_change_me";
}

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return b64urlEncode(new Uint8Array(sig));
}

/** Create a signed session token valid for 7 days */
export async function createSessionToken(): Promise<{ token: string; maxAge: number }> {
  const payload = b64urlEncode(
    new TextEncoder().encode(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS }))
  );
  const sig = await hmac(payload);
  return { token: `${payload}.${sig}`, maxAge: Math.floor(SESSION_TTL_MS / 1000) };
}

/** Verify a session token; returns true when valid and unexpired */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  try {
    const expected = await hmac(payload);
    if (expected !== sig) return false;
    const json = JSON.parse(new TextDecoder().decode(b64urlDecode(payload)));
    return typeof json.exp === "number" && json.exp > Date.now();
  } catch {
    return false;
  }
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "postform-admin-2026";
}

export const ADMIN_COOKIE = COOKIE_NAME;
