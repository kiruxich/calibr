import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, Gift, Clock } from "lucide-react";
import { SITE } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Онлайн-оплата и сертификаты",
  description:
    "Онлайн-оплата обучения и подарочные сертификаты школы «КАЛИБР». Скоро будет доступна оплата картой на сайте.",
  alternates: { canonical: "/oplata" },
};

export default function PaymentPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-page relative">
          <p className="section-label">Оплата</p>
          <h1 className="section-title mt-3">Оплата и сертификаты</h1>
          <p className="section-subtitle">
            Онлайн-оплата картой и покупка сертификатов появятся здесь. Сейчас оформление — через администратора.
          </p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card-premium card-glow">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-muted)] text-[var(--accent)]">
              <CreditCard className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-xl font-semibold text-white">Оплата картой онлайн</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Безопасная оплата обучения и аренды тира банковской картой прямо на сайте.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--bg-elevated)] px-4 py-2 text-sm text-[var(--text-muted)]">
              <Clock className="h-4 w-4 text-[var(--accent)]" />
              Скоро — модуль в разработке
            </div>
            <button
              type="button"
              disabled
              className="mt-6 w-full cursor-not-allowed rounded-xl border border-[var(--border)] bg-[var(--surface)] px-7 py-3.5 text-base font-medium text-[var(--text-muted)]"
            >
              Оплатить онлайн (скоро)
            </button>
          </div>

          <div className="card-premium card-glow">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-muted)] text-[var(--accent)]">
              <Gift className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-xl font-semibold text-white">Подарочный сертификат</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Сертификат на занятие в тире — отличный подарок. Пока оформляем по заявке или телефону.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/kontakty#zapis" className="btn-primary w-full text-center">
                Оформить по заявке
              </Link>
              <a href={`tel:${SITE.phones[0].value}`} className="btn-secondary w-full text-center">
                {SITE.phones[0].display}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
