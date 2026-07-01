/**
 * Session signing secret — resolved automatically, no manual setup required.
 *
 * Priority:
 *   1. ADMIN_SESSION_SECRET env (explicit override, if you want to pin it)
 *   2. A random secret auto-generated once and stored in the DB (app_settings)
 *   3. ADMIN_PASSWORD env (last-resort fallback when there is no DB)
 *
 * The DB-backed secret means you never have to generate/enter a secret by hand:
 * it is created on first use and reused across deploys. Cached in memory so it
 * costs at most one query per cold start.
 */

import { eq } from "drizzle-orm";
import { getDb, hasDb } from "@/db";
import { appSettings } from "@/db/schema";

const SETTING_KEY = "session_secret";
let cached: string | null = null;

function randomSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(48));
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function getSessionSecret(): Promise<string> {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  if (cached) return cached;

  if (hasDb()) {
    try {
      const db = getDb();
      // Insert a fresh secret if none exists yet (races resolve to one row).
      await db
        .insert(appSettings)
        .values({ key: SETTING_KEY, value: randomSecret() })
        .onConflictDoNothing();
      const [row] = await db
        .select()
        .from(appSettings)
        .where(eq(appSettings.key, SETTING_KEY))
        .limit(1);
      if (row?.value) {
        cached = row.value;
        return cached;
      }
    } catch {
      // fall through to env fallback
    }
  }

  return process.env.ADMIN_PASSWORD || "calibr-fallback-secret";
}
