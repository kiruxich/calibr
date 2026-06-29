"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, Minus, Plus } from "lucide-react";
import {
  DIRECTION_OPTIONS,
  PRICE_EXTRAS,
  PRICE_SERVICES,
} from "@/lib/data/prices";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const UNIT_LABEL: Record<string, string> = {
  course: "курс",
  hour: "час",
  session: "занятие",
  exam: "проверка",
};

function useCountUp(value: number, duration = 450) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return display;
}

export function PriceCalculator() {
  const [direction, setDirection] = useState("obuchenie-grazhdan");
  const [serviceId, setServiceId] = useState("primary-training");
  const [hours, setHours] = useState(1);
  const [extras, setExtras] = useState<string[]>([]);

  const services = useMemo(
    () => PRICE_SERVICES.filter((s) => s.direction === direction),
    [direction],
  );

  const selected = PRICE_SERVICES.find((s) => s.id === serviceId);

  const baseSum = useMemo(() => {
    if (!selected) return 0;
    return selected.unit === "hour" ? selected.basePrice * hours : selected.basePrice;
  }, [selected, hours]);

  const extrasList = useMemo(
    () => PRICE_EXTRAS.filter((e) => extras.includes(e.id)),
    [extras],
  );

  const total = baseSum + extrasList.reduce((acc, e) => acc + e.price, 0);
  const animatedTotal = useCountUp(total);

  function selectDirection(value: string) {
    setDirection(value);
    const first = PRICE_SERVICES.find((s) => s.direction === value);
    setServiceId(first?.id ?? "");
    setHours(1);
  }

  function toggleExtra(id: string) {
    setExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
      {/* ── Configurator ── */}
      <div className="card-premium card-glow space-y-7 p-6 sm:p-8">
        <div>
          <p className="section-label">Шаг 1</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Направление</h3>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DIRECTION_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => selectDirection(o.value)}
                className={cn(
                  "rounded-xl border px-3 py-3 text-sm font-medium transition",
                  direction === o.value
                    ? "border-[var(--accent)] bg-[var(--accent-muted)] text-white"
                    : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-light)] hover:text-white",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="section-label">Шаг 2</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Программа</h3>
          <div className="mt-4 space-y-2">
            {services.map((s) => {
              const active = s.id === serviceId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setServiceId(s.id);
                    setHours(1);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition",
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                      : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-light)]",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                        active ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border-light)]",
                      )}
                    >
                      {active && <Check className="h-3 w-3 text-[#1a1206]" strokeWidth={3} />}
                    </span>
                    <span className="text-sm font-medium text-white">{s.name}</span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-[var(--accent)]">
                    {formatPrice(s.basePrice)}
                    <span className="text-[var(--text-muted)]">/{UNIT_LABEL[s.unit]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {selected?.unit === "hour" && (
          <div>
            <p className="section-label">Шаг 3</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Количество часов</h3>
            <div className="mt-4 inline-flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2">
              <button
                type="button"
                onClick={() => setHours((h) => Math.max(1, h - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-light)] text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                aria-label="Меньше часов"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-xl font-semibold text-white">{hours}</span>
              <button
                type="button"
                onClick={() => setHours((h) => Math.min(8, h + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-light)] text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                aria-label="Больше часов"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div>
          <p className="section-label">Дополнительно</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Доп. услуги</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {PRICE_EXTRAS.map((e) => {
              const active = extras.includes(e.id);
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => toggleExtra(e.id)}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm transition",
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-muted)] text-white"
                      : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-light)]",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                        active ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border-light)]",
                      )}
                    >
                      {active && <Check className="h-3 w-3 text-[#1a1206]" strokeWidth={3} />}
                    </span>
                    {e.name}
                  </span>
                  <span className="shrink-0 font-medium text-[var(--accent)]">+{formatPrice(e.price)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Total ── */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="group relative rounded-2xl">
          <div className="gradient-border-layer rounded-2xl">
            <div className="gradient-rotator gradient-shimmer" />
          </div>
          <div className="relative rounded-2xl border border-transparent bg-[var(--surface)] p-6 sm:p-8">
            <p className="section-label">Итоговая сумма</p>
            <p className="mt-3 text-5xl font-bold tracking-tight text-white">
              {formatPrice(animatedTotal)}
            </p>

            {selected ? (
              <>
                <div className="mt-6 space-y-3 border-t border-[var(--border)] pt-5 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[var(--text-secondary)]">
                      {selected.name}
                      {selected.unit === "hour" && (
                        <span className="text-[var(--text-muted)]"> × {hours} ч</span>
                      )}
                    </span>
                    <span className="shrink-0 font-medium text-white">{formatPrice(baseSum)}</span>
                  </div>
                  {extrasList.map((e) => (
                    <div key={e.id} className="flex items-start justify-between gap-3">
                      <span className="text-[var(--text-secondary)]">{e.name}</span>
                      <span className="shrink-0 font-medium text-white">+{formatPrice(e.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl bg-[var(--bg-elevated)] p-4">
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Что входит</p>
                  <ul className="mt-2 space-y-1.5">
                    {selected.includes.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/kontakty?service=${direction}&program=${serviceId}#zapis`}
                  className="btn-primary mt-6 w-full text-center"
                >
                  Записаться с этой программой
                </Link>
                <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
                  Предварительный расчёт. Точную стоимость подтвердит администратор.
                </p>
              </>
            ) : (
              <p className="mt-6 text-sm text-[var(--text-muted)]">Выберите программу для расчёта.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
