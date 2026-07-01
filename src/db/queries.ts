import { asc, desc, eq, gte, lt, sql } from "drizzle-orm";
import { getDb, hasDb } from "./index";
import { bookings, clients, otpCodes, scheduleSlots, weeklySchedule } from "./schema";
import { normalizePhone } from "@/lib/client-auth";
import {
  generateUpcomingSlots,
  WEEKLY_SCHEDULE,
  type ScheduleDirection,
  type ScheduleSlot,
} from "@/lib/data/schedule";

export interface WeeklyRow {
  id?: string;
  position: number;
  day: string;
  time: string;
  event: string;
  direction: ScheduleDirection;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function toSlot(row: typeof scheduleSlots.$inferSelect): ScheduleSlot {
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    title: row.title,
    direction: row.direction as ScheduleDirection,
    spotsLeft: row.spotsLeft,
    spotsTotal: row.spotsTotal,
  };
}

// ── Public reads (fall back to static seed data when no DB is configured) ──

/** Upcoming bookable slots (today and later), ordered chronologically. */
export async function getUpcomingSlots(): Promise<ScheduleSlot[]> {
  if (!hasDb()) return generateUpcomingSlots();
  const rows = await getDb()
    .select()
    .from(scheduleSlots)
    .where(gte(scheduleSlots.date, todayISO()))
    .orderBy(asc(scheduleSlots.date), asc(scheduleSlots.time));
  return rows.map(toSlot);
}

/** Recurring weekly grid. */
export async function getWeeklySchedule(): Promise<WeeklyRow[]> {
  if (!hasDb()) {
    return WEEKLY_SCHEDULE.map((r, i) => ({ position: i, ...r }));
  }
  const rows = await getDb()
    .select()
    .from(weeklySchedule)
    .orderBy(asc(weeklySchedule.position));
  return rows.map((r) => ({
    id: r.id,
    position: r.position,
    day: r.day,
    time: r.time,
    event: r.event,
    direction: r.direction as ScheduleDirection,
  }));
}

// ── Admin reads (include past slots) ──

export async function getAllSlots(): Promise<ScheduleSlot[]> {
  if (!hasDb()) return generateUpcomingSlots();
  const rows = await getDb()
    .select()
    .from(scheduleSlots)
    .orderBy(asc(scheduleSlots.date), asc(scheduleSlots.time));
  return rows.map(toSlot);
}

export async function getBookings() {
  if (!hasDb()) return [];
  return getDb().select().from(bookings).orderBy(desc(bookings.createdAt));
}

// ── Slot mutations ──

export interface SlotInput {
  date: string;
  time: string;
  title: string;
  direction: string;
  spotsTotal: number;
  spotsLeft: number;
}

export async function createSlot(input: SlotInput) {
  return getDb().insert(scheduleSlots).values(input);
}

export async function updateSlot(id: string, input: SlotInput) {
  return getDb().update(scheduleSlots).set(input).where(eq(scheduleSlots.id, id));
}

export async function deleteSlot(id: string) {
  return getDb().delete(scheduleSlots).where(eq(scheduleSlots.id, id));
}

// ── Weekly mutations ──

export interface WeeklyInput {
  position: number;
  day: string;
  time: string;
  event: string;
  direction: string;
}

export async function createWeekly(input: WeeklyInput) {
  return getDb().insert(weeklySchedule).values(input);
}

export async function updateWeekly(id: string, input: WeeklyInput) {
  return getDb().update(weeklySchedule).set(input).where(eq(weeklySchedule.id, id));
}

export async function deleteWeekly(id: string) {
  return getDb().delete(weeklySchedule).where(eq(weeklySchedule.id, id));
}

// ── Bookings ──

export interface BookingInput {
  type: "booking" | "callback";
  name: string;
  phone: string;
  email: string | null;
  service: string | null;
  serviceLabel: string | null;
  slotId: string | null;
  slotTitle: string | null;
  slotDate: string | null;
  comment: string;
}

/**
 * Persists a lead and, for real bookings tied to a DB slot, atomically
 * decrements the slot's remaining spots (never below zero).
 */
export async function createBooking(input: BookingInput) {
  const db = getDb();
  const [row] = await db.insert(bookings).values(input).returning();

  if (input.type === "booking" && input.slotId) {
    await db
      .update(scheduleSlots)
      .set({ spotsLeft: sql`GREATEST(${scheduleSlots.spotsLeft} - 1, 0)` })
      .where(eq(scheduleSlots.id, input.slotId));
  }

  return row;
}

/** Look up a slot by id (for enriching booking records). */
export async function getSlotById(id: string): Promise<ScheduleSlot | null> {
  if (!hasDb()) return null;
  const [row] = await getDb()
    .select()
    .from(scheduleSlots)
    .where(eq(scheduleSlots.id, id))
    .limit(1);
  return row ? toSlot(row) : null;
}

// ── Client cabinet ──

/** All bookings/callbacks left from a given phone (newest first). */
export async function getBookingsByPhone(phone: string) {
  if (!hasDb()) return [];
  const norm = normalizePhone(phone);
  const rows = await getDb().select().from(bookings).orderBy(desc(bookings.createdAt));
  // Phones are stored as the user typed them; match on normalised digits.
  return rows.filter((b) => normalizePhone(b.phone) === norm);
}

// ── Client accounts (login/password) ──

/** Finds a registered client by phone (normalised). */
export async function getClientByPhone(phone: string) {
  if (!hasDb()) return null;
  const norm = normalizePhone(phone);
  const [row] = await getDb()
    .select()
    .from(clients)
    .where(eq(clients.phone, norm))
    .limit(1);
  return row ?? null;
}

/** Registers a new client. Returns null if the phone is already taken. */
export async function createClient(input: {
  phone: string;
  name: string;
  passwordHash: string;
}) {
  const db = getDb();
  const norm = normalizePhone(input.phone);
  const existing = await db
    .select({ id: clients.id })
    .from(clients)
    .where(eq(clients.phone, norm))
    .limit(1);
  if (existing.length > 0) return null;
  const [row] = await db
    .insert(clients)
    .values({ phone: norm, name: input.name, passwordHash: input.passwordHash })
    .returning();
  return row;
}

/** Updates a client's password (used by password recovery). */
export async function updateClientPassword(phone: string, passwordHash: string) {
  const db = getDb();
  const norm = normalizePhone(phone);
  await db.update(clients).set({ passwordHash }).where(eq(clients.phone, norm));
}

/** Creates (or replaces) a one-time login code for a phone, valid 5 minutes. */
export async function createOtp(phone: string, code: string) {
  const db = getDb();
  const norm = normalizePhone(phone);
  await db.delete(otpCodes).where(eq(otpCodes.phone, norm));
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await db.insert(otpCodes).values({ phone: norm, code, expiresAt });
}

type OtpResult = "ok" | "invalid" | "expired" | "too_many";

/** Verifies a login code; consumes it on success. */
export async function verifyOtp(phone: string, code: string): Promise<OtpResult> {
  const db = getDb();
  const norm = normalizePhone(phone);
  const [row] = await db
    .select()
    .from(otpCodes)
    .where(eq(otpCodes.phone, norm))
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  if (!row) return "invalid";
  if (row.expiresAt.getTime() < Date.now()) {
    await db.delete(otpCodes).where(eq(otpCodes.id, row.id));
    return "expired";
  }
  if (row.attempts >= 5) {
    await db.delete(otpCodes).where(eq(otpCodes.id, row.id));
    return "too_many";
  }
  if (row.code !== code) {
    await db
      .update(otpCodes)
      .set({ attempts: row.attempts + 1 })
      .where(eq(otpCodes.id, row.id));
    return "invalid";
  }
  await db.delete(otpCodes).where(eq(otpCodes.id, row.id));
  return "ok";
}

/** Housekeeping: drop expired codes (best-effort). */
export async function purgeExpiredOtp() {
  if (!hasDb()) return;
  await getDb()
    .delete(otpCodes)
    .where(lt(otpCodes.expiresAt, new Date()))
    .catch(() => {});
}
