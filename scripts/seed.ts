/**
 * Seeds the database with the initial schedule data.
 * Run after provisioning the DB and pushing the schema:
 *   npm run db:seed
 *
 * Locally this clears and re-inserts. On Vercel, setup-db.ts uses seedIfEmpty instead.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { seedForce } from "../src/db/seed";

async function main() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Run with: npm run db:seed (uses .env.local via dotenv-cli)",
    );
  }

  const db = drizzle(neon(url), { schema });
  console.log("Force-seeding schedule tables…");
  await seedForce(db);
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
