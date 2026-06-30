"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasDb } from "@/db";
import { createOtp, verifyOtp } from "@/db/queries";
import {
  CLIENT_COOKIE,
  CLIENT_SESSION_MAX_AGE,
  createClientToken,
  normalizePhone,
} from "@/lib/client-auth";
import { sendSmsCode } from "@/lib/sms";

function genCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/** Step 1: send a one-time code to the phone. */
export async function requestCodeAction(formData: FormData) {
  const phoneRaw = String(formData.get("phone") ?? "");
  const norm = normalizePhone(phoneRaw);

  if (norm.length !== 11) {
    redirect(`/cabinet/login?error=phone`);
  }
  if (!hasDb()) {
    redirect(`/cabinet/login?error=nodb`);
  }

  const code = genCode();
  await createOtp(norm, code);
  await sendSmsCode(norm, code);

  redirect(`/cabinet/login?step=code&phone=${encodeURIComponent(norm)}`);
}

/** Step 2: verify the code and start a session. */
export async function verifyCodeAction(formData: FormData) {
  const phoneRaw = String(formData.get("phone") ?? "");
  const code = String(formData.get("code") ?? "").trim();
  const norm = normalizePhone(phoneRaw);

  const result = await verifyOtp(norm, code);

  if (result !== "ok") {
    redirect(
      `/cabinet/login?step=code&phone=${encodeURIComponent(norm)}&error=${result}`,
    );
  }

  const token = await createClientToken(norm);
  const store = await cookies();
  store.set(CLIENT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CLIENT_SESSION_MAX_AGE,
  });

  redirect("/cabinet");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(CLIENT_COOKIE);
  redirect("/cabinet/login");
}
