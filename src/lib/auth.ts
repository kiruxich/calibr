/**
 * Lightweight admin session: an HMAC-signed cookie (no external deps).
 * Uses Web Crypto so it works in both the Edge (proxy.ts) and Node runtimes.
 *
 * Env (all optional):
 *   ADMIN_PASSWORD        — bootstrap owner password / no-DB fallback login
 *   ADMIN_SESSION_SECRET  — pin the cookie-signing secret (otherwise it is
 *                           auto-generated and stored in the DB — see secret.ts)
 */

import { getSessionSecret } from "./secret";

export const SESSION_COOKIE = "calibr_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

// ── Roles & permissions (pure — safe to import from Edge proxy) ──

export type AdminRole = "owner" | "admin" | "manager";

export interface AdminSession {
  /** admin id (or "legacy" when running on the single-password fallback) */
  sub: string;
  role: AdminRole;
}

export const ADMIN_ROLES: AdminRole[] = ["owner", "admin", "manager"];

export const ROLE_LABELS: Record<AdminRole, string> = {
  owner: "Владелец",
  admin: "Администратор",
  manager: "Менеджер",
};

export const ROLE_HINTS: Record<AdminRole, string> = {
  owner: "Полный доступ, управление администраторами",
  admin: "Расписание и заявки",
  manager: "Просмотр заявок",
};

function isAdminRole(value: unknown): value is AdminRole {
  return value === "owner" || value === "admin" || value === "manager";
}

/** Can edit slots and the weekly grid. */
export function canManageSchedule(role: AdminRole) {
  return role === "owner" || role === "admin";
}

/** Can create/edit/remove administrator accounts. */
export function canManageAdmins(role: AdminRole) {
  return role === "owner";
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

async function hmac(data: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
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

/** Creates a signed session token (carrying admin id + role) valid for the TTL. */
export async function createSessionToken(sub: string, role: AdminRole) {
  const payload = {
    sub,
    role,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const data = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmac(data, await getSessionSecret());
  return `${data}.${sig}`;
}

/** Verifies a token and returns its session (id + role), or null if invalid. */
export async function readAdminSession(
  token: string | undefined | null,
): Promise<AdminSession | null> {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = await hmac(data, await getSessionSecret());
  if (!timingSafeEqual(sig, expected)) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(data))) as {
      sub?: string;
      role?: unknown;
      exp?: number;
    };
    if (typeof payload.exp !== "number" || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    if (typeof payload.sub !== "string" || !isAdminRole(payload.role)) return null;
    return { sub: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

/** Boolean session check (used by the Edge proxy). */
export async function verifySessionToken(token: string | undefined | null) {
  return (await readAdminSession(token)) !== null;
}

/** Checks the submitted password against ADMIN_PASSWORD. */
export function verifyPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  return timingSafeEqual(input, expected);
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;
