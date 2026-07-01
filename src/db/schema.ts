import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

/**
 * Dated, bookable slots shown in the booking calendar and forms.
 * `direction` mirrors ScheduleDirection ("obuchenie-grazhdan" | "okhranniki" | "sektsii" | "arenda").
 */
export const scheduleSlots = pgTable("schedule_slots", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: date("date").notNull(),
  time: text("time").notNull(),
  title: text("title").notNull(),
  direction: text("direction").notNull(),
  spotsTotal: integer("spots_total").notNull().default(0),
  spotsLeft: integer("spots_left").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Recurring weekly grid shown as the "Еженедельное расписание" table. */
export const weeklySchedule = pgTable("weekly_schedule", {
  id: uuid("id").defaultRandom().primaryKey(),
  position: integer("position").notNull().default(0),
  day: text("day").notNull(),
  time: text("time").notNull(),
  event: text("event").notNull(),
  direction: text("direction").notNull(),
});

/** Leads from the booking and callback forms. */
export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type").notNull().default("booking"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  service: text("service"),
  serviceLabel: text("service_label"),
  slotId: text("slot_id"),
  slotTitle: text("slot_title"),
  slotDate: text("slot_date"),
  comment: text("comment").default(""),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Registered client accounts (login by phone + password). */
export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: text("phone").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** One-time codes for client cabinet login (SMS). */
export const otpCodes = pgTable("otp_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: text("phone").notNull(),
  code: text("code").notNull(),
  attempts: integer("attempts").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ScheduleSlotRow = typeof scheduleSlots.$inferSelect;
export type WeeklyScheduleRow = typeof weeklySchedule.$inferSelect;
export type BookingRow = typeof bookings.$inferSelect;
export type OtpCodeRow = typeof otpCodes.$inferSelect;
export type ClientRow = typeof clients.$inferSelect;
