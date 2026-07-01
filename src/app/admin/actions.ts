"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_ROLES,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  canManageAdmins,
  canManageSchedule,
  createSessionToken,
  verifyPassword,
  type AdminRole,
  type AdminSession,
} from "@/lib/auth";
import { getAdminSession } from "@/lib/admin-session";
import { hashPassword, verifyPasswordHash } from "@/lib/client-auth";
import { hasDb } from "@/db";
import {
  countAdmins,
  countOwners,
  createAdmin,
  createSlot,
  createWeekly,
  deleteAdmin,
  deleteSlot,
  deleteWeekly,
  getAdminById,
  getAdminByLogin,
  updateAdminPassword,
  updateAdminRole,
  updateSlot,
  updateWeekly,
  type SlotInput,
  type WeeklyInput,
} from "@/db/queries";

/** Requires a valid session; returns it. Redirects to login otherwise. */
async function requireAuth(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Requires the schedule-management permission. */
async function requireSchedule(): Promise<AdminSession> {
  const session = await requireAuth();
  if (!canManageSchedule(session.role)) redirect("/admin?error=forbidden");
  return session;
}

/** Requires the admin-management permission (owner only). */
async function requireOwner(): Promise<AdminSession> {
  const session = await requireAuth();
  if (!canManageAdmins(session.role)) redirect("/admin?error=forbidden");
  return session;
}

function revalidateAll() {
  revalidatePath("/admin");
  revalidatePath("/raspisanie");
  revalidatePath("/");
}

async function startSession(sub: string, role: AdminRole, from: string) {
  const token = await createSessionToken(sub, role);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect(from.startsWith("/admin") ? from : "/admin");
}

/**
 * Seeds the first owner from env (ADMIN_LOGIN / ADMIN_PASSWORD) when the
 * admins table is empty, so the panel is reachable right after deploy.
 */
async function ensureOwnerSeed() {
  if (!hasDb()) return;
  if ((await countAdmins()) > 0) return;
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return;
  const login = (process.env.ADMIN_LOGIN || "admin").trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  await createAdmin({ login, name: "Владелец", passwordHash, role: "owner" });
}

// ── Auth ──

export async function loginAction(formData: FormData) {
  const login = String(formData.get("login") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  if (hasDb()) {
    await ensureOwnerSeed();
    const admin = login ? await getAdminByLogin(login) : null;
    if (!admin || !(await verifyPasswordHash(password, admin.passwordHash))) {
      redirect("/admin/login?error=1");
    }
    await startSession(admin.id, admin.role as AdminRole, from);
    return;
  }

  // Fallback without a database: single shared password → owner.
  if (!verifyPassword(password)) {
    redirect("/admin/login?error=1");
  }
  await startSession("legacy", "owner", from);
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ── Administrator accounts (owner only) ──

function parseRole(value: FormDataEntryValue | null): AdminRole {
  const v = String(value ?? "");
  return (ADMIN_ROLES as string[]).includes(v) ? (v as AdminRole) : "manager";
}

export async function createAdminAction(formData: FormData) {
  await requireOwner();
  const login = String(formData.get("login") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = parseRole(formData.get("role"));

  if (login.length < 3 || name.length < 2 || password.length < 6) {
    redirect("/admin?error=admin_input");
  }
  const passwordHash = await hashPassword(password);
  const created = await createAdmin({ login, name, passwordHash, role });
  if (!created) redirect("/admin?error=admin_exists");
  revalidatePath("/admin");
}

export async function updateAdminRoleAction(formData: FormData) {
  const session = await requireOwner();
  const id = String(formData.get("id") ?? "");
  const role = parseRole(formData.get("role"));
  if (!id) redirect("/admin");

  const target = await getAdminById(id);
  if (!target) redirect("/admin");

  // Don't allow demoting the last remaining owner.
  if (target.role === "owner" && role !== "owner" && (await countOwners()) <= 1) {
    redirect("/admin?error=last_owner");
  }
  // Prevent locking yourself out of admin management.
  if (id === session.sub && role !== "owner") {
    redirect("/admin?error=self_demote");
  }
  await updateAdminRole(id, role);
  revalidatePath("/admin");
}

export async function resetAdminPasswordAction(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("id") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!id || password.length < 6) redirect("/admin?error=admin_input");
  const passwordHash = await hashPassword(password);
  await updateAdminPassword(id, passwordHash);
  revalidatePath("/admin");
}

export async function deleteAdminAction(formData: FormData) {
  const session = await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin");
  if (id === session.sub) redirect("/admin?error=self_delete");

  const target = await getAdminById(id);
  if (target?.role === "owner" && (await countOwners()) <= 1) {
    redirect("/admin?error=last_owner");
  }
  await deleteAdmin(id);
  revalidatePath("/admin");
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
  await requireSchedule();
  await createSlot(parseSlot(formData));
  revalidateAll();
}

export async function updateSlotAction(formData: FormData) {
  await requireSchedule();
  const id = String(formData.get("id") ?? "");
  if (id) await updateSlot(id, parseSlot(formData));
  revalidateAll();
}

export async function deleteSlotAction(formData: FormData) {
  await requireSchedule();
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
  await requireSchedule();
  await createWeekly(parseWeekly(formData));
  revalidateAll();
}

export async function updateWeeklyAction(formData: FormData) {
  await requireSchedule();
  const id = String(formData.get("id") ?? "");
  if (id) await updateWeekly(id, parseWeekly(formData));
  revalidateAll();
}

export async function deleteWeeklyAction(formData: FormData) {
  await requireSchedule();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteWeekly(id);
  revalidateAll();
}
