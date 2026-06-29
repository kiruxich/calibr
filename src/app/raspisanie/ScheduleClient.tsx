"use client";

import { useState } from "react";
import {
  DIRECTION_LABELS,
  type ScheduleDirection,
  type ScheduleSlot,
} from "@/lib/data/schedule";
import type { WeeklyRow } from "@/db/queries";
import { BookingCalendar } from "@/components/booking/BookingCalendar";

export default function ScheduleClient({
  slots,
  weekly,
}: {
  slots: ScheduleSlot[];
  weekly: WeeklyRow[];
}) {
  const [filter, setFilter] = useState<ScheduleDirection | "all">("all");

  const filteredWeekly =
    filter === "all" ? weekly : weekly.filter((r) => r.direction === filter);

  const filteredSlots =
    filter === "all" ? slots : slots.filter((s) => s.direction === filter);

  return (
    <>
      <section className="page-hero">
        <div className="container-page relative">
          <p className="section-label">Расписание</p>
          <h1 className="section-title mt-3">Выберите дату и запишитесь</h1>
          <p className="section-subtitle">
            Календарь свободных занятий и еженедельное расписание школы «КАЛИБР».
          </p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
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

        <BookingCalendar key={filter} slots={filteredSlots} />

        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Еженедельное расписание</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[480px] text-sm">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-white">День</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Время</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Мероприятие</th>
                </tr>
              </thead>
              <tbody>
                {filteredWeekly.map((row) => (
                  <tr key={row.day} className="border-t border-[var(--border)]">
                    <td className="px-4 py-3 font-medium text-white">{row.day}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{row.time}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{row.event}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <a href="/docs/raspisanie.pdf" className="btn-secondary mt-4 inline-block text-sm">
            Скачать PDF
          </a>
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
