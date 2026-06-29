import Link from "next/link";
import { FOOTER_NAV, SITE } from "@/lib/data/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-light text-white">{SITE.shortName}</p>
          <p className="mt-3 text-sm font-light text-[var(--text-muted)]">{SITE.tagline}</p>
          <p className="mt-4 text-sm font-light text-[var(--text-secondary)]">{SITE.address}</p>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-wider text-[var(--text-muted)]">Навигация</p>
          <ul className="space-y-2.5">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm font-light text-[var(--text-secondary)] transition hover:text-[var(--accent)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-wider text-[var(--text-muted)]">Контакты</p>
          <ul className="space-y-2.5 text-sm font-light">
            {SITE.phones.map((p) => (
              <li key={p.value}>
                <a href={`tel:${p.value}`} className="text-[var(--text-secondary)] hover:text-[var(--accent)]">
                  {p.display}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${SITE.email}`} className="text-[var(--text-secondary)] hover:text-[var(--accent)]">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-wider text-[var(--text-muted)]">Документы</p>
          <ul className="space-y-2.5 text-sm font-light">
            <li>
              <Link href="/docs" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">
                Сведения об организации
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">
                Политика конфиденциальности
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border)] py-6 text-center text-xs font-extralight text-[var(--text-muted)]">
        © {new Date().getFullYear()} {SITE.name}
      </div>
    </footer>
  );
}
