/**
 * Lightweight admin session: an HMAC-signed cookie (no external deps).
 * Uses Web Crypto so it works in both the Edge (proxy.ts) and Node runtimes.
 *
 * Env:
 *   ADMIN_PASSWORD        — the admin login password (required for /admin)
 *   ADMIN_SESSION_SECRET  — secret for signing the session cookie
 *                           (falls back to ADMIN_PASSWORD if unset)
 */

export const SESSION_COOKIE = "calibr_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string) {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toBase64Url(new Uint8Array(sig));
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Creates a signed session token valid for SESSION_TTL_SECONDS. */
export async function createSessionToken() {
  const payload = { exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const data = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmac(data);
  return `${data}.${sig}`;
}

/** Verifies a session token's signature and expiry. */
export async function verifySessionToken(token: string | undefined | null) {
  if (!token || !getSecret()) return false;
  const [data, sig] = token.split(".");
  if (!data || !sig) return false;

  const expected = await hmac(data);
  if (!timingSafeEqual(sig, expected)) return false;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(data))) as {
      exp?: number;
    };
    return typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

/** Checks the submitted password against ADMIN_PASSWORD. */
export function verifyPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  return timingSafeEqual(input, expected);
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;
