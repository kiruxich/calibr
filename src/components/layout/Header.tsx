"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV, SITE } from "@/lib/data/site";
import { A11yToggle } from "@/components/a11y/A11yProvider";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full pt-3 pb-3 sm:pt-4">
      <div className="container-page">
        <div className="flex h-14 items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg)]/85 px-4 backdrop-blur-xl sm:h-16 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-wide text-white sm:text-xl">
              {SITE.shortName}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Основное меню">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-4 py-2 text-base font-medium transition",
                    active
                      ? "bg-[var(--surface)] text-white"
                      : "text-[var(--text-secondary)] hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <A11yToggle />
            <Link href="/kontakty#zapis" className="btn-primary px-5 py-2.5 text-sm">
              Записаться
            </Link>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-white lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="container-page mt-2 lg:hidden">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="mb-4 flex justify-end">
              <A11yToggle />
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/kontakty#zapis" className="btn-primary mt-3 text-center" onClick={() => setOpen(false)}>
                Записаться
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
