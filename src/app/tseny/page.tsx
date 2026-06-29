import type { Metadata } from "next";
import { PriceCalculator } from "@/components/calculator/PriceCalculator";
import { PRICE_TABLES } from "@/lib/data/prices";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Цены и калькулятор",
  description: "Прейскуранты и интерактивный калькулятор стоимости обучения в школе «КАЛИБР».",
};

export default function PricesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-page relative">
          <p className="section-label">Цены</p>
          <h1 className="section-title mt-3">Калькулятор стоимости</h1>
          <p className="section-subtitle">
            Соберите программу под себя и узнайте цену сразу — без звонков и ожидания.
          </p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <PriceCalculator />

        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Прейскуранты (PDF)</h2>
          <p className="mt-2 text-base text-[var(--text-secondary)]">
            Полные тарифы по каждому направлению для скачивания.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRICE_TABLES.map((t) => (
              <a
                key={t.title}
                href={t.file}
                className="card-premium flex items-center gap-3 py-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-muted)]">
                  <Download className="h-5 w-5 text-[var(--accent)]" />
                </span>
                <span className="font-medium text-white">{t.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
