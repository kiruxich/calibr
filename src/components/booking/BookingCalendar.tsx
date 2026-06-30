"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Users } from "lucide-react";
import { DIRECTION_LABELS, type ScheduleSlot } from "@/lib/data/schedule";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function isoOf(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function BookingCalendar({ slots }: { slots: ScheduleSlot[] }) {
  const slotsByDate = useMemo(() => {
    const map = new Map<string, ScheduleSlot[]>();
    for (const s of slots) {
      const arr = map.get(s.date) ?? [];
      arr.push(s);
      map.set(s.date, arr);
    }
    return map;
  }, [slots]);

  const sortedDates = useMemo(() => [...slotsByDate.keys()].sort(), [slotsByDate]);
  const firstSlotDate = sortedDates[0] ? new Date(sortedDates[0]) : new Date();

  const [view, setView] = useState(() => new Date(firstSlotDate.getFullYear(), firstSlotDate.getMonth(), 1));
  const [selected, setSelected] = useState<string>(sortedDates[0] ?? isoOf(new Date()));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const grid = useMemo(() => {
    const year = view.getFullYear();
    const month = view.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [view]);

  const selectedSlots = slotsByDate.get(selected) ?? [];

  function shiftMonth(delta: number) {
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,360px)_1fr]">
      {/* calendar */}
      <div className="card-premium">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-light)] text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            aria-label="Предыдущий месяц"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-base font-semibold text-white">
            {MONTHS[view.getMonth()]} {view.getFullYear()}
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-light)] text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            aria-label="Следующий месяц"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-xs text-[var(--text-muted)]">
          {WEEKDAYS.map((w) => (
            <span key={w} className="py-1">{w}</span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {grid.map((date, i) => {
            if (!date) return <span key={`e-${i}`} />;
            const iso = isoOf(date);
            const has = slotsByDate.has(iso);
            const isSelected = iso === selected;
            const isPast = date < today;
            return (
              <button
                key={iso}
                type="button"
                disabled={!has || isPast}
                onClick={() => setSelected(iso)}
                className={cn(
                  "relative flex h-10 items-center justify-center rounded-lg text-sm transition",
                  isSelected && "bg-[var(--accent)] font-semibold text-[var(--accent-foreground)]",
                  !isSelected && has && !isPast && "bg-[var(--bg-elevated)] text-white hover:bg-[var(--surface-hover)]",
                  !has && "text-[var(--text-muted)]",
                  isPast && "opacity-40",
                  (!has || isPast) && "cursor-default",
                )}
              >
                {date.getDate()}
                {has && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--accent)]" />
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          есть свободные занятия
        </p>
      </div>

      {/* slots for selected day */}
      <div>
        <h3 className="text-lg font-semibold text-white">
          {selectedSlots.length > 0
            ? `Занятия на ${new Date(selected).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}`
            : "Выберите день с занятиями"}
        </h3>

        <div className="mt-4 space-y-3">
          {selectedSlots.length === 0 && (
            <div className="card-surface text-sm text-[var(--text-secondary)]">
              На эту дату занятий нет. Отметьте день с золотой точкой в календаре.
            </div>
          )}
          {selectedSlots.map((slot) => (
            <div
              key={slot.id}
              className="card-premium flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--accent)]">
                  {DIRECTION_LABELS[slot.direction]}
                </p>
                <p className="mt-1 font-medium text-white">{slot.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {slot.time}
                  </span>
                  <span className={cn("flex items-center gap-1.5", slot.spotsLeft <= 3 && "text-[var(--error)]")}>
                    <Users className="h-4 w-4" />
                    {slot.spotsLeft <= 3 ? `осталось ${slot.spotsLeft}` : `${slot.spotsLeft}/${slot.spotsTotal} мест`}
                  </span>
                </div>
              </div>
              <Link
                href={`/kontakty?slot=${slot.id}&service=${slot.direction}#zapis`}
                className="btn-primary text-sm"
              >
                Записаться
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
