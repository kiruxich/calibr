"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DIRECTION_OPTIONS,
  PRICE_EXTRAS,
  PRICE_SERVICES,
} from "@/lib/data/prices";
import { formatPrice } from "@/lib/utils";

export function PriceCalculator() {
  const [direction, setDirection] = useState("obuchenie-grazhdan");
  const [serviceId, setServiceId] = useState("");
  const [hours, setHours] = useState(1);
  const [extras, setExtras] = useState<string[]>([]);

  const services = useMemo(
    () => PRICE_SERVICES.filter((s) => s.direction === direction),
    [direction],
  );

  const selected = PRICE_SERVICES.find((s) => s.id === serviceId);

  const total = useMemo(() => {
    if (!selected) return 0;
    let sum = selected.basePrice;
    if (selected.unit === "hour") sum *= hours;
    for (const id of extras) {
      const extra = PRICE_EXTRAS.find((e) => e.id === id);
      if (extra) sum += extra.price;
    }
    return sum;
  }, [selected, hours, extras]);

  function toggleExtra(id: string) {
    setExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="card-surface grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Калькулятор стоимости</h3>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Направление</span>
          <select
            value={direction}
            onChange={(e) => {
              setDirection(e.target.value);
              setServiceId("");
            }}
            className="input-field"
          >
            {DIRECTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Программа</span>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="input-field"
          >
            <option value="">Выберите программу</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — от {formatPrice(s.basePrice)}
              </option>
            ))}
          </select>
        </label>

        {selected?.unit === "hour" && (
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Количество часов</span>
            <input
              type="number"
              min={1}
              max={8}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="input-field"
            />
          </label>
        )}

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Дополнительные услуги</legend>
          <div className="space-y-2">
            {PRICE_EXTRAS.map((e) => (
              <label key={e.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={extras.includes(e.id)}
                  onChange={() => toggleExtra(e.id)}
                />
                {e.name} (+{formatPrice(e.price)})
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col justify-between rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-6">
        <div>
          <p className="text-sm text-[var(--text-muted)]">Итоговая сумма</p>
          <p className="mt-2 text-4xl font-bold text-[var(--accent)]">
            {selected ? formatPrice(total) : "—"}
          </p>
          {selected && (
            <ul className="mt-4 space-y-1 text-sm text-[var(--foreground)]/80">
              <li className="font-medium">{selected.name}</li>
              {selected.includes.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          )}
        </div>
        {selected && (
          <Link
            href={`/kontakty?service=${direction}&program=${serviceId}#zapis`}
            className="btn-primary mt-6 text-center"
          >
            Записаться с этой программой
          </Link>
        )}
      </div>
    </div>
  );
}
