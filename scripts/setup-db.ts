/**
 * Runs on every Vercel build when DATABASE_URL is set:
 * 1. Applies Drizzle migrations
 * 2. Seeds schedule data if tables are empty
 *
 * Skipped silently when no DB URL (local build without .env.local).
 */
import path from "path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as schema from "../src/db/schema";
import { seedIfEmpty } from "../src/db/seed";

function resolveDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

async function main() {
  const url = resolveDatabaseUrl();
  if (!url) {
    console.log("[db] No DATABASE_URL — skipping migrate/seed (demo data mode).");
    return;
  }

  console.log("[db] Connecting…");
  const db = drizzle(neon(url), { schema });

  console.log("[db] Running migrations…");
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });

  console.log("[db] Checking seed…");
  await seedIfEmpty(db);

  if (!process.env.ADMIN_PASSWORD) {
    console.warn(
      "[db] ⚠ ADMIN_PASSWORD is not set — /admin login will be disabled until you add it in Vercel → Settings → Environment Variables.",
    );
  } else {
    console.log("[db] ADMIN_PASSWORD is configured.");
  }

  console.log("[db] Setup complete.");
}

main().catch((err) => {
  console.error("[db] Setup failed:", err);
  process.exit(1);
});
