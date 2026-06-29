import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { UPCOMING_SLOTS } from "@/lib/data/schedule";
import { DIRECTION_OPTIONS } from "@/lib/data/prices";
import { hasDb } from "@/db";
import { createBooking, getSlotById, type BookingInput } from "@/db/queries";

const DATA_DIR = path.join(process.cwd(), "data");

type RequestType = "booking" | "callback";

interface RequestPayload {
  type?: RequestType;
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  slotId?: string;
  comment?: string;
  consent?: string | boolean;
}

const isFilled = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const isConsented = (v: unknown) => v === true || v === "on" || v === "true";

/** Persist to data/bookings.json — fallback when no DB is configured. */
async function persistToFile(record: Record<string, unknown>) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const file = path.join(DATA_DIR, "bookings.json");
    let existing: unknown[] = [];
    try {
      existing = JSON.parse(await fs.readFile(file, "utf-8")) as unknown[];
    } catch {
      existing = [];
    }
    existing.push(record);
    await fs.writeFile(file, JSON.stringify(existing, null, 2), "utf-8");
  } catch (err) {
    console.error("[booking] file persist failed:", err);
  }
}

interface NotifyRecord {
  type: RequestType;
  name: string;
  phone: string;
  email: string | null;
  serviceLabel: string | null;
  slotTitle: string | null;
  slotDate: string | null;
  comment: string;
}

/** Send notifications via Telegram bot and/or a generic webhook (if configured). */
async function notify(record: NotifyRecord) {
  const tasks: Promise<unknown>[] = [];

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    const heading = record.type === "callback" ? "Обратный звонок" : "Новая заявка";
    const lines = [
      `<b>${heading}</b>`,
      `Имя: ${record.name}`,
      `Телефон: ${record.phone}`,
      record.email ? `Email: ${record.email}` : null,
      record.serviceLabel ? `Направление: ${record.serviceLabel}` : null,
      record.slotTitle ? `Слот: ${record.slotTitle} (${record.slotDate ?? "—"})` : null,
      record.comment ? `Комментарий: ${record.comment}` : null,
    ].filter(Boolean);

    tasks.push(
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }).catch((e) => console.error("[booking] telegram failed:", e)),
    );
  }

  const webhook = process.env.BOOKING_WEBHOOK_URL;
  if (webhook) {
    tasks.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      }).catch((e) => console.error("[booking] webhook failed:", e)),
    );
  }

  await Promise.allSettled(tasks);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestPayload;
    const type: RequestType = body.type === "callback" ? "callback" : "booking";

    if (!isFilled(body.name) || !isFilled(body.phone)) {
      return NextResponse.json({ error: "Укажите имя и телефон" }, { status: 400 });
    }
    if (!isConsented(body.consent)) {
      return NextResponse.json(
        { error: "Необходимо согласие на обработку персональных данных" },
        { status: 400 },
      );
    }
    if (type === "booking") {
      if (!isFilled(body.email)) {
        return NextResponse.json({ error: "Укажите email" }, { status: 400 });
      }
      if (!isFilled(body.service) || !isFilled(body.slotId)) {
        return NextResponse.json({ error: "Выберите направление и слот" }, { status: 400 });
      }
    }

    // Resolve slot/direction (from DB when available, else static seed data).
    const slot = isFilled(body.slotId)
      ? hasDb()
        ? await getSlotById(body.slotId)
        : (UPCOMING_SLOTS.find((s) => s.id === body.slotId) ?? null)
      : null;
    const direction = isFilled(body.service)
      ? DIRECTION_OPTIONS.find((o) => o.value === body.service)
      : undefined;

    const input: BookingInput = {
      type,
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: isFilled(body.email) ? body.email.trim() : null,
      service: isFilled(body.service) ? body.service : null,
      serviceLabel: direction?.label ?? null,
      slotId: isFilled(body.slotId) ? body.slotId : null,
      slotTitle: slot?.title ?? null,
      slotDate: slot?.date ?? null,
      comment: isFilled(body.comment)
        ? body.comment.trim()
        : type === "callback"
          ? "Запрос обратного звонка"
          : "",
    };

    if (hasDb()) {
      await createBooking(input);
    } else {
      await persistToFile({
        id: `${type}-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "new",
        ...input,
      });
    }

    await notify({
      type: input.type,
      name: input.name,
      phone: input.phone,
      email: input.email,
      serviceLabel: input.serviceLabel,
      slotTitle: input.slotTitle,
      slotDate: input.slotDate,
      comment: input.comment,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[booking] error:", err);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
