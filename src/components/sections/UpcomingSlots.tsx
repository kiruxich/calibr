"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { DIRECTION_LABELS, type ScheduleSlot } from "@/lib/data/schedule";

export function UpcomingSlots() {
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/slots")
      .then((r) => r.json())
      .then((data: { slots?: ScheduleSlot[] }) => {
        if (active) setSlots(data.slots ?? []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (slots.length === 0) return null;

  return (
    <section className="border-b border-[var(--border)] py-20 sm:py-28">
      <div className="container-page">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label">Расписание</p>
            <h2 className="section-title mt-2 flex items-center gap-3">
              <Calendar className="h-7 w-7 text-[var(--accent)]" />
              Ближайшие занятия
            </h2>
          </div>
          <Link href="/raspisanie" className="text-sm font-light text-[var(--accent)] hover:underline">
            Полное расписание →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.slice(0, 6).map((slot) => (
            <div key={slot.id} className="card-premium card-glow group flex flex-col justify-between">
              <div>
                <p className="text-xs font-normal uppercase tracking-wider text-[var(--accent)]">
                  {DIRECTION_LABELS[slot.direction]}
                </p>
                <p className="mt-2 font-light text-white">{slot.title}</p>
                <p className="mt-2 text-sm font-extralight text-[var(--text-muted)]">
                  {new Date(slot.date).toLocaleDateString("ru-RU", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  · {slot.time}
                </p>
                {slot.spotsLeft <= 3 && (
                  <p className="mt-2 text-xs text-[var(--error)]">Осталось {slot.spotsLeft} мест</p>
                )}
              </div>
              <Link
                href={`/kontakty?slot=${slot.id}#zapis`}
                className="btn-secondary mt-5 inline-flex items-center gap-1 text-sm group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
              >
                Записаться <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
