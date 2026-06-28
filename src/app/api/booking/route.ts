import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { UPCOMING_SLOTS } from "@/lib/data/schedule";

const DATA_DIR = path.join(process.cwd(), "data");

interface BookingPayload {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  slotId?: string;
  comment?: string;
  consent?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingPayload;

    if (!body.name?.trim() || !body.phone?.trim() || !body.email?.trim()) {
      return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 });
    }
    if (!body.service || !body.slotId) {
      return NextResponse.json({ error: "Выберите направление и слот" }, { status: 400 });
    }
    if (!body.consent) {
      return NextResponse.json({ error: "Необходимо согласие на обработку ПДн" }, { status: 400 });
    }

    const slot = UPCOMING_SLOTS.find((s) => s.id === body.slotId);

    const record = {
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email.trim(),
      service: body.service,
      slotId: body.slotId,
      slotTitle: slot?.title ?? body.slotId,
      slotDate: slot?.date ?? null,
      comment: body.comment?.trim() ?? "",
      status: "new",
    };

    await fs.mkdir(DATA_DIR, { recursive: true });
    const file = path.join(DATA_DIR, "bookings.json");

    let existing: unknown[] = [];
    try {
      const raw = await fs.readFile(file, "utf-8");
      existing = JSON.parse(raw) as unknown[];
    } catch {
      existing = [];
    }

    existing.push(record);
    await fs.writeFile(file, JSON.stringify(existing, null, 2), "utf-8");

    return NextResponse.json({ ok: true, id: record.id });
  } catch {
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
