"use client";

import { useState } from "react";
import { Checkbox, FieldLabel, PhoneInput, TextInput } from "@/components/ui/form";

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
          <FieldLabel label="Имя" required>
            <TextInput name="name" required />
          </FieldLabel>
          <FieldLabel label="Телефон" required>
            <PhoneInput name="phone" required value={phone} onChange={setPhone} />
          </FieldLabel>
          <Checkbox name="consent" required>
            Согласен на{" "}
            <a href="/privacy" className="text-[var(--accent)] underline">
              обработку персональных данных
            </a>
          </Checkbox>
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
