"use client";

import { useState } from "react";
import { DIRECTION_OPTIONS } from "@/lib/data/prices";
import { UPCOMING_SLOTS } from "@/lib/data/schedule";

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Ошибка отправки");
      setStatus("success");
      setMessage("Заявка принята! Мы свяжемся с вами для подтверждения записи.");
      form.reset();
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
          <input name="phone" type="tel" required className="input-field" placeholder="+7 (___) ___-__-__" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email *</span>
          <input name="email" type="email" required className="input-field" placeholder="email@example.com" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">Направление *</span>
          <select name="service" required defaultValue={defaultService} className="input-field">
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
          <select name="slotId" required defaultValue={defaultSlotId} className="input-field">
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
          <textarea name="comment" rows={3} className="input-field" placeholder="Дополнительная информация" />
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
        <p className="rounded-lg bg-green-50 p-3 text-sm text-[var(--success)]">{message}</p>
      )}
      {status === "error" && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-[var(--error)]">{message}</p>
      )}
    </form>
  );
}
