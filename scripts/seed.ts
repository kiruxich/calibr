/**
 * Seeds the database with the initial schedule data.
 * Run after provisioning the DB and pushing the schema:
 *   npx dotenv -e .env.local -- npx tsx scripts/seed.ts
 *
 * Idempotent-ish: clears the schedule tables first, then inserts fresh rows.
 * Does NOT touch the bookings table.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { generateUpcomingSlots, WEEKLY_SCHEDULE } from "../src/lib/data/schedule";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Run with: npx dotenv -e .env.local -- npx tsx scripts/seed.ts");
  }

  const db = drizzle(neon(url), { schema });

  console.log("Clearing schedule tables…");
  await db.delete(schema.scheduleSlots);
  await db.delete(schema.weeklySchedule);

  const slots = generateUpcomingSlots(8).map((s) => ({
    date: s.date,
    time: s.time,
    title: s.title,
    direction: s.direction,
    spotsTotal: s.spotsTotal,
    spotsLeft: s.spotsLeft,
  }));
  await db.insert(schema.scheduleSlots).values(slots);
  console.log(`Inserted ${slots.length} schedule slots.`);

  const weekly = WEEKLY_SCHEDULE.map((w, i) => ({
    position: i,
    day: w.day,
    time: w.time,
    event: w.event,
    direction: w.direction,
  }));
  await db.insert(schema.weeklySchedule).values(weekly);
  console.log(`Inserted ${weekly.length} weekly rows.`);

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
