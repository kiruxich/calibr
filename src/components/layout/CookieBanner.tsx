"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "calibr-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== "accepted" && saved !== "rejected") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Уведомление о файлах cookies"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-[80] mx-auto max-w-md rounded-2xl border border-[var(--border-light)] bg-[var(--bg)]/90 p-4 shadow-2xl backdrop-blur-md sm:left-5 sm:right-auto sm:bottom-5 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)]">
          <Cookie className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Мы используем файлы cookies для работы сайта и аналитики. Продолжая
            пользоваться сайтом, вы соглашаетесь с{" "}
            <Link
              href="/privacy"
              className="font-medium text-[var(--text)] underline underline-offset-2 transition hover:text-[var(--accent)]"
            >
              политикой конфиденциальности
            </Link>
            .
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => decide("accepted")}
              className="btn-primary px-4 py-2 text-sm"
            >
              Принять
            </button>
            <button
              type="button"
              onClick={() => decide("rejected")}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Только необходимые
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
