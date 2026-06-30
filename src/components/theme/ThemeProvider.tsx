"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Palette } from "lucide-react";

export type Theme = "dark" | "blue";

const STORAGE_KEY = "kalibr-theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  if (theme === "blue") html.setAttribute("data-theme", "blue");
  else html.removeAttribute("data-theme");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === "blue" || saved === "dark") setThemeState(saved);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function setTheme(next: Theme) {
    setThemeState(next);
  }

  function toggle() {
    setThemeState((t) => (t === "dark" ? "blue" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const label = theme === "dark" ? "Включить синюю тему" : "Включить классическую тему";

  return (
    <button
      type="button"
      onClick={toggle}
      title={label}
      aria-label={label}
      className={
        "flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-light)] text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-white " +
        (className ?? "")
      }
    >
      <Palette className="h-4 w-4" />
    </button>
  );
}

/**
 * Inline script injected before hydration to apply the saved theme and avoid
 * a flash of the default (gold) palette on first paint.
 */
export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='blue'){document.documentElement.setAttribute('data-theme','blue');}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
