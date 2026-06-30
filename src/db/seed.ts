import { count } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { generateUpcomingSlots, WEEKLY_SCHEDULE } from "@/lib/data/schedule";

type Db = NeonHttpDatabase<typeof schema>;

/** Insert initial schedule data only when tables are empty (safe on every deploy). */
export async function seedIfEmpty(db: Db) {
  const [{ value: slotCount }] = await db
    .select({ value: count() })
    .from(schema.scheduleSlots);

  if (slotCount > 0) {
    console.log(`[db] schedule_slots already has ${slotCount} rows — seed skipped.`);
    return;
  }

  const slots = generateUpcomingSlots(8).map((s) => ({
    date: s.date,
    time: s.time,
    title: s.title,
    direction: s.direction,
    spotsTotal: s.spotsTotal,
    spotsLeft: s.spotsLeft,
  }));
  await db.insert(schema.scheduleSlots).values(slots);
  console.log(`[db] Seeded ${slots.length} schedule slots.`);

  const weekly = WEEKLY_SCHEDULE.map((w, i) => ({
    position: i,
    day: w.day,
    time: w.time,
    event: w.event,
    direction: w.direction,
  }));
  await db.insert(schema.weeklySchedule).values(weekly);
  console.log(`[db] Seeded ${weekly.length} weekly rows.`);
}

/** Force re-seed (clears schedule tables). Used by npm run db:seed locally. */
export async function seedForce(db: Db) {
  await db.delete(schema.scheduleSlots);
  await db.delete(schema.weeklySchedule);
  await seedIfEmpty(db);
}
