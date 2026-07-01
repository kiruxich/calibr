/**
 * Client cabinet session: an HMAC-signed cookie storing the verified phone.
 * Mirrors the admin auth approach (Web Crypto, Edge + Node safe).
 *
 * Env:
 *   CLIENT_SESSION_SECRET — secret for signing (falls back to
 *                           ADMIN_SESSION_SECRET, then ADMIN_PASSWORD)
 */

export const CLIENT_COOKIE = "calibr_client";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecret() {
  return (
    process.env.CLIENT_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "calibr-client-fallback-secret"
  );
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

export async function createClientToken(phone: string) {
  const payload = {
    phone,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const data = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmac(data);
  return `${data}.${sig}`;
}

/** Returns the verified phone if the token is valid and unexpired, else null. */
export async function readClientToken(token: string | undefined | null) {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = await hmac(data);
  if (!timingSafeEqual(sig, expected)) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(data))) as {
      phone?: string;
      exp?: number;
    };
    if (typeof payload.exp !== "number" || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return typeof payload.phone === "string" ? payload.phone : null;
  } catch {
    return null;
  }
}

export const CLIENT_SESSION_MAX_AGE = SESSION_TTL_SECONDS;

/** Normalises a phone to digits with a leading 7 (RU), for matching. */
export function normalizePhone(input: string) {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (digits.length === 10) digits = "7" + digits;
  return digits;
}

// ── Password hashing (PBKDF2-SHA256 via Web Crypto, no external deps) ──

const PBKDF2_ITERATIONS = 100_000;

/** Hashes a password. Returns `iterations$saltB64u$hashB64u`. */
export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await deriveBits(password, salt);
  return `${PBKDF2_ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(new Uint8Array(bits))}`;
}

/** Verifies a password against a stored `iterations$salt$hash` string. */
export async function verifyPasswordHash(password: string, stored: string) {
  const [iterStr, saltStr, hashStr] = stored.split("$");
  if (!iterStr || !saltStr || !hashStr) return false;
  const iterations = Number(iterStr);
  if (!Number.isFinite(iterations)) return false;
  const salt = fromBase64Url(saltStr);
  const bits = await deriveBits(password, salt, iterations);
  return timingSafeEqual(toBase64Url(new Uint8Array(bits)), hashStr);
}

async function deriveBits(
  password: string,
  salt: BufferSource,
  iterations = PBKDF2_ITERATIONS,
) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256,
  );
}
