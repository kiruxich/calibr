"use client";

import { useState } from "react";

export function CallbackForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        phone: fd.get("phone"),
        email: "callback@local",
        service: "callback",
        slotId: "callback",
        comment: "Запрос обратного звонка",
        consent: "on",
      }),
    });
    setStatus("done");
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface mt-6 space-y-4">
      <h3 className="text-lg font-bold">Перезвоните мне</h3>
      {status === "done" ? (
        <p className="text-sm text-[var(--success)]">Заявка принята. Мы перезвоним вам.</p>
      ) : (
        <>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Имя</span>
            <input name="name" className="input-field" required />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Телефон</span>
            <input name="phone" type="tel" className="input-field" required />
          </label>
          <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
            {status === "loading" ? "Отправка…" : "Жду звонка"}
          </button>
        </>
      )}
      <p className="text-xs text-[var(--foreground)]/50">
        Нажимая кнопку, вы соглашаетесь с{" "}
        <a href="/privacy" className="text-[var(--accent)] underline">
          политикой конфиденциальности
        </a>
        .
      </p>
    </form>
  );
}
