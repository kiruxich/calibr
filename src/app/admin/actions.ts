"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  verifyPassword,
  verifySessionToken,
} from "@/lib/auth";
import {
  createSlot,
  updateSlot,
  deleteSlot,
  createWeekly,
  updateWeekly,
  deleteWeekly,
  type SlotInput,
  type WeeklyInput,
} from "@/db/queries";

async function requireAuth() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    redirect("/admin/login");
  }
}

function revalidateAll() {
  revalidatePath("/admin");
  revalidatePath("/raspisanie");
  revalidatePath("/");
}

// ── Auth ──

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  if (!verifyPassword(password)) {
    redirect("/admin/login?error=1");
  }

  const token = await createSessionToken();
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ── Slots ──

function parseSlot(formData: FormData): SlotInput {
  const total = Number(formData.get("spotsTotal") ?? 0);
  const left = Number(formData.get("spotsLeft") ?? 0);
  return {
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    title: String(formData.get("title") ?? ""),
    direction: String(formData.get("direction") ?? ""),
    spotsTotal: Number.isFinite(total) ? total : 0,
    spotsLeft: Number.isFinite(left) ? left : 0,
  };
}

export async function createSlotAction(formData: FormData) {
  await requireAuth();
  await createSlot(parseSlot(formData));
  revalidateAll();
}

export async function updateSlotAction(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  if (id) await updateSlot(id, parseSlot(formData));
  revalidateAll();
}

export async function deleteSlotAction(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteSlot(id);
  revalidateAll();
}

// ── Weekly ──

function parseWeekly(formData: FormData): WeeklyInput {
  const position = Number(formData.get("position") ?? 0);
  return {
    position: Number.isFinite(position) ? position : 0,
    day: String(formData.get("day") ?? ""),
    time: String(formData.get("time") ?? ""),
    event: String(formData.get("event") ?? ""),
    direction: String(formData.get("direction") ?? ""),
  };
}

export async function createWeeklyAction(formData: FormData) {
  await requireAuth();
  await createWeekly(parseWeekly(formData));
  revalidateAll();
}

export async function updateWeeklyAction(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  if (id) await updateWeekly(id, parseWeekly(formData));
  revalidateAll();
}

export async function deleteWeeklyAction(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteWeekly(id);
  revalidateAll();
}
