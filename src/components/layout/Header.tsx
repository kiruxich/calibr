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
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full pt-4 pb-4 sm:pt-5">
      <div className="container-page">
        <div className="flex h-14 items-center justify-between rounded-2xl border border-[var(--border-light)] bg-[var(--bg)]/70 px-4 backdrop-blur-xl sm:h-[60px] sm:px-5 lg:border-0 lg:bg-transparent lg:backdrop-blur-none">
          <Link href="/" className="flex flex-col">
            <span className="text-base font-light tracking-wide text-white sm:text-lg">
              {SITE.shortName}
            </span>
            <span className="hidden text-[10px] font-extralight text-[var(--text-muted)] sm:block">
              Стрелковая подготовка
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Основное меню">
            {NAV.map((item) =>
              "children" in item && item.children ? (
                <div key={item.label} className="group relative">
                  <button
                    type="button"
                    className="rounded-lg px-3 py-2 text-sm font-light text-[var(--text-secondary)] transition hover:text-white"
                  >
                    {item.label}
                  </button>
                  <div className="invisible absolute left-0 top-full z-50 mt-2 min-w-[220px] rounded-xl border border-[var(--border-light)] bg-[var(--surface)] py-2 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm font-light text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-light transition",
                    pathname === item.href
                      ? "bg-[var(--surface)] text-white"
                      : "text-[var(--text-secondary)] hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
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
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="container-page mt-2 lg:hidden">
          <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--surface)] p-4">
            <div className="mb-4 flex justify-end">
              <A11yToggle />
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) =>
                "children" in item && item.children ? (
                  <div key={item.label}>
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-light text-[var(--text-secondary)]"
                      onClick={() => setServicesOpen(!servicesOpen)}
                    >
                      {item.label}
                    </button>
                    {servicesOpen &&
                      item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg py-2 pl-6 text-sm font-light text-[var(--text-muted)] hover:text-white"
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-light text-[var(--text-secondary)] hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ),
              )}
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
