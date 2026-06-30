import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Lazy Drizzle/Neon client.
 *
 * Lazy init keeps `next build` safe when DATABASE_URL is not yet set (e.g. the
 * first deploy before the Neon Marketplace integration provisions env vars).
 * We intentionally avoid a Proxy wrapper (it breaks libraries that introspect
 * the client) — a plain memoised getter is enough.
 */
type Db = ReturnType<typeof createDb>;

function createDb() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = neon(url);
  return drizzle(sql, { schema });
}

let _db: Db | null = null;

export function getDb(): Db {
  if (!_db) _db = createDb();
  return _db;
}

/** True when a database connection string is configured. */
export function hasDb() {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}
