import { cookies } from "next/headers";
import { SESSION_COOKIE, readAdminSession, type AdminSession } from "./auth";

/** Reads the current admin session from the request cookie (server-side). */
export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return readAdminSession(token);
}
