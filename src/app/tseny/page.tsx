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
          <h1 className="section-title">Цены и калькулятор</h1>
          <p className="section-subtitle">Актуальные прейскуранты и расчёт стоимости онлайн</p>
        </div>
      </section>

      <section className="container-page py-10">
        <PriceCalculator />

        <div className="mt-12">
          <h2 className="section-title mb-6">Прейскуранты (PDF)</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRICE_TABLES.map((t) => (
              <a
                key={t.title}
                href={t.file}
                className="card-surface flex items-center gap-3 transition hover:shadow-md"
              >
                <Download className="h-5 w-5 shrink-0 text-[var(--accent)]" />
                <span className="font-medium">{t.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
