"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type A11yMode = "normal" | "large" | "high-contrast";

interface A11yContextValue {
  mode: A11yMode;
  setMode: (mode: A11yMode) => void;
}

const A11yContext = createContext<A11yContextValue | null>(null);

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y must be used within A11yProvider");
  return ctx;
}

export function A11yProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<A11yMode>("normal");

  useEffect(() => {
    const saved = localStorage.getItem("kalibr-a11y") as A11yMode | null;
    if (saved) setModeState(saved);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("a11y", "a11y-high-contrast");
    if (mode === "large") html.classList.add("a11y");
    if (mode === "high-contrast") html.classList.add("a11y", "a11y-high-contrast");
    localStorage.setItem("kalibr-a11y", mode);
  }, [mode]);

  return (
    <A11yContext.Provider value={{ mode, setMode: setModeState }}>
      {children}
    </A11yContext.Provider>
  );
}

export function A11yToggle() {
  const { mode, setMode } = useA11y();

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-[var(--border-light)] p-0.5 text-xs">
      {(["normal", "large", "high-contrast"] as const).map((m, i) => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          className={`rounded px-2 py-1 font-light transition ${
            mode === m ? "bg-white text-[var(--bg)]" : "text-[var(--text-muted)] hover:text-white"
          } ${i === 1 ? "text-sm" : ""}`}
          aria-pressed={mode === m}
          title={m === "normal" ? "Обычная" : m === "large" ? "Крупный текст" : "Контраст"}
        >
          {m === "high-contrast" ? "◐" : i === 0 ? "A" : "A+"}
        </button>
      ))}
    </div>
  );
}
