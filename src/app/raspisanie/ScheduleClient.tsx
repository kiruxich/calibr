"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DIRECTION_LABELS,
  UPCOMING_SLOTS,
  WEEKLY_SCHEDULE,
  type ScheduleDirection,
} from "@/lib/data/schedule";

export default function ScheduleClient() {
  const [filter, setFilter] = useState<ScheduleDirection | "all">("all");

  const filteredWeekly =
    filter === "all" ? WEEKLY_SCHEDULE : WEEKLY_SCHEDULE.filter((r) => r.direction === filter);

  const filteredSlots =
    filter === "all" ? UPCOMING_SLOTS : UPCOMING_SLOTS.filter((s) => s.direction === filter);

  return (
    <>
      <section className="page-hero">
        <div className="container-page relative">
          <h1 className="section-title">Расписание</h1>
          <p className="section-subtitle">Занятия по дням недели и ближайшие слоты для записи</p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="mb-6 flex flex-wrap gap-2">
          <FilterBtn active={filter === "all"} onClick={() => setFilter("all")} label="Все" />
          {(Object.keys(DIRECTION_LABELS) as ScheduleDirection[]).map((key) => (
            <FilterBtn
              key={key}
              active={filter === key}
              onClick={() => setFilter(key)}
              label={DIRECTION_LABELS[key]}
            />
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-bold">Еженедельное расписание</h2>
            <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[480px] text-sm">
                <thead className="bg-[var(--surface)]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">День</th>
                    <th className="px-4 py-3 text-left font-semibold">Время</th>
                    <th className="px-4 py-3 text-left font-semibold">Мероприятие</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWeekly.map((row) => (
                    <tr key={row.day} className="border-t border-[var(--border)]">
                      <td className="px-4 py-3 font-medium">{row.day}</td>
                      <td className="px-4 py-3">{row.time}</td>
                      <td className="px-4 py-3">{row.event}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <a href="/docs/raspisanie.pdf" className="btn-secondary mt-4 inline-block text-sm">
              Скачать PDF
            </a>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold">Ближайшие слоты</h2>
            <div className="space-y-3">
              {filteredSlots.map((slot) => (
                <div key={slot.id} className="card-surface flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{slot.title}</p>
                    <p className="text-sm text-[var(--foreground)]/70">
                      {new Date(slot.date).toLocaleDateString("ru-RU")} · {slot.time}
                    </p>
                    <p className="text-xs text-[var(--foreground)]/50">
                      {DIRECTION_LABELS[slot.direction]} · мест: {slot.spotsLeft}/{slot.spotsTotal}
                    </p>
                  </div>
                  <Link href={`/kontakty?slot=${slot.id}#zapis`} className="btn-primary text-sm">
                    Записаться
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FilterBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-white text-[var(--bg)]"
          : "border border-[var(--border-light)] text-[var(--text-secondary)] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
