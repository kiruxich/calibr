"use client";

import { useEffect, useState } from "react";
import { DIRECTION_OPTIONS, PRICE_SERVICES } from "@/lib/data/prices";
import { UPCOMING_SLOTS } from "@/lib/data/schedule";
import { maskPhone } from "@/lib/utils";

export interface BookingFormProps {
  defaultService?: string;
  defaultSlotId?: string;
  compact?: boolean;
}

export function BookingForm({
  defaultService = "",
  defaultSlotId = "",
  compact = false,
}: BookingFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(defaultService);
  const [slotId, setSlotId] = useState(defaultSlotId);
  const [comment, setComment] = useState("");

  // Prefill from query params (e.g. links from /raspisanie, /uslugi, calculator):
  // ?service=<direction>&slot=<slotId>&program=<priceServiceId>
  // Read from window so the contacts page can stay statically rendered.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    const qsService = params.get("service");
    const qsSlot = params.get("slot") ?? params.get("slotId");
    const qsProgram = params.get("program");

    if (qsService && DIRECTION_OPTIONS.some((o) => o.value === qsService)) {
      setService(qsService);
    }
    if (qsSlot && UPCOMING_SLOTS.some((s) => s.id === qsSlot)) {
      setSlotId(qsSlot);
    }
    if (qsProgram) {
      const program = PRICE_SERVICES.find((p) => p.id === qsProgram);
      if (program) setComment(`Интересует программа: ${program.name}`);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "booking" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Ошибка отправки");
      setStatus("success");
      setMessage("Заявка принята! Мы свяжемся с вами для подтверждения записи.");
      form.reset();
      setPhone("");
      setComment("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Не удалось отправить заявку");
    }
  }

  return (
    <form
      id="zapis"
      onSubmit={handleSubmit}
      className={`card-surface space-y-4 ${compact ? "" : "max-w-xl"}`}
    >
      {!compact && <h3 className="text-xl font-bold">Онлайн-запись</h3>}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">ФИО *</span>
          <input name="name" required className="input-field" placeholder="Иванов Иван Иванович" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Телефон *</span>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            required
            value={phone}
            onChange={(e) => setPhone(maskPhone(e.target.value))}
            className="input-field"
            placeholder="+7 (___) ___-__-__"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email *</span>
          <input name="email" type="email" required className="input-field" placeholder="email@example.com" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">Направление *</span>
          <select
            name="service"
            required
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="input-field"
          >
            <option value="">Выберите направление</option>
            {DIRECTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">Дата и время *</span>
          <select
            name="slotId"
            required
            value={slotId}
            onChange={(e) => setSlotId(e.target.value)}
            className="input-field"
          >
            <option value="">Выберите слот</option>
            {UPCOMING_SLOTS.map((s) => (
              <option key={s.id} value={s.id}>
                {new Date(s.date).toLocaleDateString("ru-RU")} {s.time} — {s.title}
                {s.spotsLeft <= 3 ? ` (осталось ${s.spotsLeft})` : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">Комментарий</span>
          <textarea
            name="comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="input-field"
            placeholder="Дополнительная информация"
          />
        </label>
        <label className="flex items-start gap-2 sm:col-span-2">
          <input name="consent" type="checkbox" required className="mt-1" />
          <span className="text-sm text-[var(--foreground)]/80">
            Согласен на{" "}
            <a href="/privacy" className="text-[var(--accent)] underline">
              обработку персональных данных
            </a>
          </span>
        </label>
      </div>

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full sm:w-auto">
        {status === "loading" ? "Отправка…" : "Отправить заявку"}
      </button>

      {status === "success" && (
        <p className="rounded-lg border border-[var(--success)]/40 bg-[var(--success)]/10 p-3 text-sm text-[var(--success)]">{message}</p>
      )}
      {status === "error" && (
        <p className="rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">{message}</p>
      )}
    </form>
  );
}
