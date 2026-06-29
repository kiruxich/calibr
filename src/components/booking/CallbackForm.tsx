"use client";

import { useState } from "react";
import { maskPhone } from "@/lib/utils";

export function CallbackForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [phone, setPhone] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "callback",
          name: fd.get("name"),
          phone: fd.get("phone"),
          consent: fd.get("consent") ? "on" : "",
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface mt-6 space-y-4">
      <h3 className="text-lg font-bold">Перезвоните мне</h3>
      {status === "done" ? (
        <p className="rounded-lg border border-[var(--success)]/40 bg-[var(--success)]/10 p-3 text-sm text-[var(--success)]">
          Заявка принята. Мы перезвоним вам.
        </p>
      ) : (
        <>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Имя</span>
            <input name="name" className="input-field" required />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Телефон</span>
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              className="input-field"
              required
              value={phone}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
              placeholder="+7 (___) ___-__-__"
            />
          </label>
          <label className="flex items-start gap-2">
            <input name="consent" type="checkbox" required className="mt-1" />
            <span className="text-sm text-[var(--text-secondary)]">
              Согласен на{" "}
              <a href="/privacy" className="text-[var(--accent)] underline">
                обработку персональных данных
              </a>
            </span>
          </label>
          <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
            {status === "loading" ? "Отправка…" : "Жду звонка"}
          </button>
          {status === "error" && (
            <p className="rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
              Не удалось отправить. Попробуйте позвонить нам напрямую.
            </p>
          )}
        </>
      )}
    </form>
  );
}
