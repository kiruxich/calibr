"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Eye, RotateCcw, X } from "lucide-react";

type FontSize = "normal" | "large" | "xlarge";
type Scheme = "normal" | "wb" | "bw" | "blue";
type Spacing = "normal" | "wide";
type FontFamily = "normal" | "readable";

interface A11ySettings {
  enabled: boolean;
  fontSize: FontSize;
  scheme: Scheme;
  spacing: Spacing;
  fontFamily: FontFamily;
  images: boolean;
}

const DEFAULTS: A11ySettings = {
  enabled: false,
  fontSize: "normal",
  scheme: "normal",
  spacing: "normal",
  fontFamily: "normal",
  images: true,
};

const STORAGE_KEY = "kalibr-a11y-v2";

interface A11yContextValue {
  settings: A11ySettings;
  update: (patch: Partial<A11ySettings>) => void;
  reset: () => void;
  enable: () => void;
}

const A11yContext = createContext<A11yContextValue | null>(null);

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y must be used within A11yProvider");
  return ctx;
}

function applySettings(s: A11ySettings) {
  const html = document.documentElement;
  const classes = [
    "vi",
    "vi-fs-large",
    "vi-fs-xlarge",
    "vi-scheme-wb",
    "vi-scheme-bw",
    "vi-scheme-blue",
    "vi-spacing-wide",
    "vi-font-readable",
    "vi-images-off",
  ];
  html.classList.remove(...classes);

  if (!s.enabled) return;

  html.classList.add("vi");
  if (s.fontSize === "large") html.classList.add("vi-fs-large");
  if (s.fontSize === "xlarge") html.classList.add("vi-fs-xlarge");
  if (s.scheme === "wb") html.classList.add("vi-scheme-wb");
  if (s.scheme === "bw") html.classList.add("vi-scheme-bw");
  if (s.scheme === "blue") html.classList.add("vi-scheme-blue");
  if (s.spacing === "wide") html.classList.add("vi-spacing-wide");
  if (s.fontFamily === "readable") html.classList.add("vi-font-readable");
  if (!s.images) html.classList.add("vi-images-off");
}

export function A11yProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<A11ySettings>(DEFAULTS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSettings({ ...DEFAULTS, ...JSON.parse(saved) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    applySettings(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  function update(patch: Partial<A11ySettings>) {
    setSettings((s) => ({ ...s, ...patch, enabled: true }));
  }
  function reset() {
    setSettings({ ...DEFAULTS, enabled: true });
  }
  function enable() {
    setSettings((s) => ({ ...s, enabled: true }));
  }

  return (
    <A11yContext.Provider value={{ settings, update, reset, enable }}>
      {children}
    </A11yContext.Provider>
  );
}

function OptionRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-[var(--text-muted)]">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={`rounded-lg border px-2.5 py-1.5 text-sm transition ${
              value === o.value
                ? "border-[var(--accent)] bg-[var(--accent-muted)] text-white"
                : "border-[var(--border-light)] text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Кнопка + выезжающая панель «Версия для слабовидящих». */
export function A11yToggle() {
  const { settings, update, reset } = useA11y();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Версия для слабовидящих"
        aria-expanded={open}
        title="Версия для слабовидящих"
        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
          settings.enabled
            ? "border-[var(--accent)] text-[var(--accent)]"
            : "border-[var(--border-light)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-white"
        }`}
      >
        <Eye className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Настройки версии для слабовидящих"
          className="absolute right-0 top-[calc(100%+8px)] z-[200] w-72 space-y-4 rounded-2xl border border-[var(--border-light)] bg-[var(--surface)] p-4 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Версия для слабовидящих</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
              className="text-[var(--text-muted)] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <OptionRow
            label="Размер шрифта"
            value={settings.fontSize}
            onChange={(v) => update({ fontSize: v })}
            options={[
              { value: "normal", label: "A" },
              { value: "large", label: "A+" },
              { value: "xlarge", label: "A++" },
            ]}
          />

          <OptionRow
            label="Цветовая схема"
            value={settings.scheme}
            onChange={(v) => update({ scheme: v })}
            options={[
              { value: "normal", label: "Обычная" },
              { value: "wb", label: "Ч/Б" },
              { value: "bw", label: "Б/Ч" },
              { value: "blue", label: "Синяя" },
            ]}
          />

          <OptionRow
            label="Интервал"
            value={settings.spacing}
            onChange={(v) => update({ spacing: v })}
            options={[
              { value: "normal", label: "Обычный" },
              { value: "wide", label: "Увеличенный" },
            ]}
          />

          <OptionRow
            label="Шрифт"
            value={settings.fontFamily}
            onChange={(v) => update({ fontFamily: v })}
            options={[
              { value: "normal", label: "Стандартный" },
              { value: "readable", label: "Без засечек" },
            ]}
          />

          <OptionRow
            label="Изображения"
            value={settings.images ? "on" : "off"}
            onChange={(v) => update({ images: v === "on" })}
            options={[
              { value: "on", label: "Показывать" },
              { value: "off", label: "Отключить" },
            ]}
          />

          <button
            type="button"
            onClick={reset}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-light)] py-2 text-sm text-[var(--text-secondary)] transition hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Сбросить настройки
          </button>
        </div>
      )}
    </div>
  );
}
