"use client";

import { useEffect, useState } from "react";
import { DIRECTION_OPTIONS, PRICE_SERVICES } from "@/lib/data/prices";
import type { ScheduleSlot } from "@/lib/data/schedule";
import {
  Checkbox,
  FieldLabel,
  PhoneInput,
  Select,
  TextArea,
  TextInput,
} from "@/components/ui/form";

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
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    const qsService = params.get("service");
    const qsProgram = params.get("program");

    if (qsService && DIRECTION_OPTIONS.some((o) => o.value === qsService)) {
      setService(qsService);
    }
    if (qsProgram) {
      const program = PRICE_SERVICES.find((p) => p.id === qsProgram);
      if (program) setComment(`Интересует программа: ${program.name}`);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/slots")
      .then((r) => r.json())
      .then((data: { slots?: ScheduleSlot[] }) => {
        if (!active) return;
        const list = data.slots ?? [];
        setSlots(list);
        const qsSlot =
          new URLSearchParams(window.location.search).get("slot") ??
          new URLSearchParams(window.location.search).get("slotId");
        if (qsSlot && list.some((s) => s.id === qsSlot)) setSlotId(qsSlot);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
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
      setService("");
      setSlotId("");
      setComment("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Не удалось отправить заявку");
    }
  }

  const slotOptions = slots.map((s) => ({
    value: s.id,
    label: `${new Date(s.date).toLocaleDateString("ru-RU")} ${s.time} — ${s.title}${
      s.spotsLeft <= 3 ? ` (осталось ${s.spotsLeft})` : ""
    }`,
  }));

  const directionOptions = DIRECTION_OPTIONS.map((o) => ({
    value: o.value,
    label: o.label,
  }));

  return (
    <form
      id="zapis"
      onSubmit={handleSubmit}
      className={`card-surface space-y-4 ${compact ? "" : "max-w-xl"}`}
    >
      {!compact && <h3 className="text-xl font-bold">Онлайн-запись</h3>}

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldLabel label="ФИО" required className="sm:col-span-2">
          <TextInput name="name" required placeholder="Иванов Иван Иванович" />
        </FieldLabel>

        <FieldLabel label="Телефон" required>
          <PhoneInput name="phone" required value={phone} onChange={setPhone} />
        </FieldLabel>

        <FieldLabel label="Email" required>
          <TextInput
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="email@example.com"
          />
        </FieldLabel>

        <FieldLabel label="Направление" required className="sm:col-span-2">
          <Select
            name="service"
            value={service}
            onChange={setService}
            options={directionOptions}
            placeholder="Выберите направление"
            required
          />
        </FieldLabel>

        <FieldLabel label="Дата и время" required className="sm:col-span-2">
          <Select
            name="slotId"
            value={slotId}
            onChange={setSlotId}
            options={slotOptions}
            placeholder="Выберите слот"
            required
          />
        </FieldLabel>

        <FieldLabel label="Комментарий" className="sm:col-span-2">
          <TextArea
            name="comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Дополнительная информация"
          />
        </FieldLabel>

        <Checkbox name="consent" required className="sm:col-span-2">
          Согласен на{" "}
          <a href="/privacy" className="text-[var(--accent)] underline">
            обработку персональных данных
          </a>
        </Checkbox>
      </div>

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full sm:w-auto">
        {status === "loading" ? "Отправка…" : "Отправить заявку"}
      </button>

      {status === "success" && (
        <p className="rounded-lg border border-[var(--success)]/40 bg-[var(--success)]/10 p-3 text-sm text-[var(--success)]">
          {message}
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
          {message}
        </p>
      )}
    </form>
  );
}
