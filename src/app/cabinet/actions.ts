"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasDb } from "@/db";
import {
  createClient,
  createOtp,
  getClientByPhone,
  updateClientPassword,
  verifyOtp,
} from "@/db/queries";
import {
  CLIENT_COOKIE,
  CLIENT_SESSION_MAX_AGE,
  createClientToken,
  hashPassword,
  normalizePhone,
  verifyPasswordHash,
} from "@/lib/client-auth";
import { sendSmsCode } from "@/lib/sms";

function genCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function startSession(phone: string) {
  const token = await createClientToken(phone);
  const store = await cookies();
  store.set(CLIENT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CLIENT_SESSION_MAX_AGE,
  });
}

// ── Вход по СМС ──────────────────────────────────────────────────────────

/** Шаг 1: отправить одноразовый код на телефон. */
export async function requestCodeAction(formData: FormData) {
  const norm = normalizePhone(String(formData.get("phone") ?? ""));

  if (norm.length !== 11) {
    redirect(`/cabinet/login?method=sms&error=phone`);
  }
  if (!hasDb()) {
    redirect(`/cabinet/login?method=sms&error=nodb`);
  }

  const code = genCode();
  await createOtp(norm, code);
  await sendSmsCode(norm, code);

  redirect(`/cabinet/login?method=sms&step=code&phone=${encodeURIComponent(norm)}`);
}

/** Шаг 2: проверить код и открыть сессию. */
export async function verifyCodeAction(formData: FormData) {
  const norm = normalizePhone(String(formData.get("phone") ?? ""));
  const code = String(formData.get("code") ?? "").trim();

  const result = await verifyOtp(norm, code);
  if (result !== "ok") {
    redirect(
      `/cabinet/login?method=sms&step=code&phone=${encodeURIComponent(norm)}&error=${result}`,
    );
  }

  await startSession(norm);
  redirect("/cabinet");
}

// ── Вход по логину (телефон) и паролю ──────────────────────────────────────

export async function passwordLoginAction(formData: FormData) {
  const norm = normalizePhone(String(formData.get("phone") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (norm.length !== 11 || password.length < 1) {
    redirect(`/cabinet/login?method=password&error=creds`);
  }
  if (!hasDb()) {
    redirect(`/cabinet/login?method=password&error=nodb`);
  }

  const client = await getClientByPhone(norm);
  if (!client || !(await verifyPasswordHash(password, client.passwordHash))) {
    redirect(`/cabinet/login?method=password&error=creds`);
  }

  await startSession(norm);
  redirect("/cabinet");
}

// ── Регистрация ────────────────────────────────────────────────────────────

export async function registerAction(formData: FormData) {
  const norm = normalizePhone(String(formData.get("phone") ?? ""));
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const password2 = String(formData.get("password2") ?? "");

  if (name.length < 2) redirect(`/cabinet/register?error=name`);
  if (norm.length !== 11) redirect(`/cabinet/register?error=phone`);
  if (password.length < 6) redirect(`/cabinet/register?error=weak`);
  if (password !== password2) redirect(`/cabinet/register?error=match`);
  if (!hasDb()) redirect(`/cabinet/register?error=nodb`);

  const passwordHash = await hashPassword(password);
  const created = await createClient({ phone: norm, name, passwordHash });
  if (!created) redirect(`/cabinet/register?error=exists`);

  await startSession(norm);
  redirect("/cabinet");
}

// ── Восстановление пароля ──────────────────────────────────────────────────

/** Шаг 1: отправить код для сброса пароля. */
export async function forgotRequestAction(formData: FormData) {
  const norm = normalizePhone(String(formData.get("phone") ?? ""));

  if (norm.length !== 11) redirect(`/cabinet/forgot?error=phone`);
  if (!hasDb()) redirect(`/cabinet/forgot?error=nodb`);

  // Не раскрываем, зарегистрирован ли номер: код шлём только если аккаунт есть,
  // но пользователю всегда показываем шаг ввода кода.
  const client = await getClientByPhone(norm);
  if (client) {
    const code = genCode();
    await createOtp(norm, code);
    await sendSmsCode(norm, code);
  }

  redirect(`/cabinet/forgot?step=reset&phone=${encodeURIComponent(norm)}`);
}

/** Шаг 2: проверить код и установить новый пароль. */
export async function resetPasswordAction(formData: FormData) {
  const norm = normalizePhone(String(formData.get("phone") ?? ""));
  const code = String(formData.get("code") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const password2 = String(formData.get("password2") ?? "");

  const back = `/cabinet/forgot?step=reset&phone=${encodeURIComponent(norm)}`;
  if (password.length < 6) redirect(`${back}&error=weak`);
  if (password !== password2) redirect(`${back}&error=match`);

  const result = await verifyOtp(norm, code);
  if (result !== "ok") redirect(`${back}&error=${result}`);

  const passwordHash = await hashPassword(password);
  await updateClientPassword(norm, passwordHash);

  await startSession(norm);
  redirect("/cabinet");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(CLIENT_COOKIE);
  redirect("/cabinet/login");
}
