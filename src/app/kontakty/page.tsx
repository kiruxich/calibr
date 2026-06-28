import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/BookingForm";
import { CallbackForm } from "@/components/booking/CallbackForm";
import { FAQ_ITEMS } from "@/lib/data/docs";
import { SITE, WORK_HOURS } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Адрес, телефоны, график работы и форма записи школы «КАЛИБР».",
};

export default function ContactsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-page relative">
          <h1 className="section-title">Контакты</h1>
          <p className="section-subtitle">{SITE.address}</p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card-surface">
            <h2 className="text-lg font-bold">Телефоны</h2>
            <ul className="mt-3 space-y-2">
              {SITE.phones.map((p) => (
                <li key={p.value}>
                  <span className="text-sm text-[var(--foreground)]/60">{p.label}: </span>
                  <a href={`tel:${p.value}`} className="font-medium text-[var(--accent)]">
                    {p.display}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Email:{" "}
              <a href={`mailto:${SITE.email}`} className="text-[var(--accent)]">
                {SITE.email}
              </a>
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="card-surface">
            <h2 className="text-lg font-bold">График работы</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {WORK_HOURS.map((w) => (
                <li key={w.day} className="flex justify-between gap-4">
                  <span>{w.day}</span>
                  <span className="text-[var(--foreground)]/70">{w.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="aspect-video overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--muted)]">
            <iframe
              src="https://yandex.ru/map-widget/v1/?text=Воскресенск+Московская+23&z=16"
              title="Карта — школа КАЛИБР"
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        </div>

        <div>
          <BookingForm />
          <CallbackForm />
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-elevated)] py-16">
        <div className="container-page">
          <h2 className="section-title mb-8">Частые вопросы</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="card-premium">
                <p className="text-xs uppercase tracking-wider text-[var(--accent)]">{item.category}</p>
                <h3 className="mt-2 font-light text-white">{item.q}</h3>
                <p className="mt-2 text-sm font-extralight text-[var(--text-muted)]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
