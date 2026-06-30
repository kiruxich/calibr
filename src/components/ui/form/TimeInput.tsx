"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  defaultValue?: string;
  required?: boolean;
  form?: string;
  className?: string;
};

function parseTime(value?: string) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) {
    return { h: "", min: "" };
  }
  const [h, min] = value.split(":");
  return { h, min };
}

function toTime(h: string, min: string) {
  if (h.length === 2 && min.length === 2) {
    return `${h}:${min}`;
  }
  return "";
}

export function TimeInput({
  name,
  defaultValue,
  required,
  form,
  className,
}: Props) {
  const initial = parseTime(defaultValue);
  const [h, setH] = useState(initial.h);
  const [min, setMin] = useState(initial.min);
  const hRef = useRef<HTMLInputElement>(null);
  const minRef = useRef<HTMLInputElement>(null);

  const time = toTime(h, min) || defaultValue || "";

  useEffect(() => {
    const next = parseTime(defaultValue);
    setH(next.h);
    setMin(next.min);
  }, [defaultValue]);

  function focusNext(ref: React.RefObject<HTMLInputElement | null>) {
    requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.select();
    });
  }

  function handleHour(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    setH(digits);
    if (digits.length === 2) focusNext(minRef);
  }

  function handleMinute(raw: string) {
    setMin(raw.replace(/\D/g, "").slice(0, 2));
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    segment: "h" | "min",
  ) {
    if (e.key !== "Backspace" || e.currentTarget.value !== "") return;
    if (segment === "min" && e.currentTarget.selectionStart === 0) {
      e.preventDefault();
      focusNext(hRef);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").trim();
    const match = text.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return;
    e.preventDefault();
    setH(match[1].padStart(2, "0"));
    setMin(match[2]);
    focusNext(minRef);
  }

  return (
    <>
      <input type="hidden" name={name} value={time} form={form} required={required} />
      <div className={cn("field-segments", className)} onPaste={handlePaste}>
        <input
          ref={hRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="ЧЧ"
          maxLength={2}
          value={h}
          onChange={(e) => handleHour(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "h")}
          className="field-segment"
          aria-label="Часы"
        />
        <span className="field-segment-sep">:</span>
        <input
          ref={minRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="ММ"
          maxLength={2}
          value={min}
          onChange={(e) => handleMinute(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "min")}
          className="field-segment"
          aria-label="Минуты"
        />
      </div>
    </>
  );
}
