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

function parseISO(iso?: string) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return { d: "", m: "", y: "" };
  }
  const [y, m, d] = iso.split("-");
  return { d, m, y };
}

function toISO(d: string, m: string, y: string) {
  if (d.length === 2 && m.length === 2 && y.length === 4) {
    return `${y}-${m}-${d}`;
  }
  return "";
}

export function DateInput({
  name,
  defaultValue,
  required,
  form,
  className,
}: Props) {
  const initial = parseISO(defaultValue);
  const [d, setD] = useState(initial.d);
  const [m, setM] = useState(initial.m);
  const [y, setY] = useState(initial.y);
  const dRef = useRef<HTMLInputElement>(null);
  const mRef = useRef<HTMLInputElement>(null);
  const yRef = useRef<HTMLInputElement>(null);

  const iso = toISO(d, m, y) || defaultValue || "";

  useEffect(() => {
    const next = parseISO(defaultValue);
    setD(next.d);
    setM(next.m);
    setY(next.y);
  }, [defaultValue]);

  function focusNext(ref: React.RefObject<HTMLInputElement | null>) {
    requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.select();
    });
  }

  function handleDay(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    setD(digits);
    if (digits.length === 2) focusNext(mRef);
  }

  function handleMonth(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    setM(digits);
    if (digits.length === 2) focusNext(yRef);
  }

  function handleYear(raw: string) {
    setY(raw.replace(/\D/g, "").slice(0, 4));
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    segment: "d" | "m" | "y",
  ) {
    if (e.key !== "Backspace" || e.currentTarget.value !== "") return;
    if (e.currentTarget.selectionStart !== 0) return;
    if (segment === "m") {
      e.preventDefault();
      focusNext(dRef);
    } else if (segment === "y") {
      e.preventDefault();
      focusNext(mRef);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").trim();
    const match = text.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
    if (!match) return;
    e.preventDefault();
    setD(match[1].padStart(2, "0"));
    setM(match[2].padStart(2, "0"));
    setY(match[3]);
    focusNext(yRef);
  }

  return (
    <>
      <input type="hidden" name={name} value={iso} form={form} required={required} />
      <div className={cn("field-segments", className)} onPaste={handlePaste}>
        <input
          ref={dRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="ДД"
          maxLength={2}
          value={d}
          onChange={(e) => handleDay(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "d")}
          className="field-segment"
          aria-label="День"
        />
        <span className="field-segment-sep">.</span>
        <input
          ref={mRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="ММ"
          maxLength={2}
          value={m}
          onChange={(e) => handleMonth(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "m")}
          className="field-segment"
          aria-label="Месяц"
        />
        <span className="field-segment-sep">.</span>
        <input
          ref={yRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="ГГГГ"
          maxLength={4}
          value={y}
          onChange={(e) => handleYear(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "y")}
          className="field-segment field-segment--wide"
          aria-label="Год"
        />
      </div>
    </>
  );
}
