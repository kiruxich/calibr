import type { Metadata } from "next";
import Link from "next/link";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Секции и Action Air",
  description: "Детская секция «Меткий выстрел», IPSC для взрослых, практическая стрельба.",
};

export default function Page() {
  return (
    <>
      <ServicePageTemplate
        title="Action Air / Стрелковые секции"
        subtitle="Спортивная подготовка для детей и взрослых"
        direction="sektsii"
        description={[
          "Детская секция «Меткий выстрел» — пневматика и Action Air для детей 8–17 лет.",
          "Спортивная секция «Калибр» — практическая стрельба IPSC для лиц 18+ по предварительной записи.",
        ]}
        programs={[
          {
            title: "Секции",
            items: [
              "«Меткий выстрел» — пневматика, Action Air (8–17 лет)",
              "«Калибр» — IPSC, практическая стрельба (18+)",
              "Практические занятия для физлиц",
            ],
          },
          {
            title: "Допуск",
            items: [
              "Справка 002-О/у",
              "Разрешение РОХа (для огнестрела)",
              "Удостоверение IPSC (при наличии)",
            ],
          },
        ]}
        checklist={[
          "Паспорт / свидетельство о рождении (для детей)",
          "Справка 002-О/у",
          "Согласие родителей (для несовершеннолетних)",
        ]}
        documents={[
          { name: "Заявление в секцию", href: "/docs/zayavlenie-sektsiya.docx" },
        ]}
      />
      <section className="container-page pb-12">
        <div className="card-surface">
          <h2 className="text-xl font-bold">3D-тур тира</h2>
          <p className="mt-2 text-sm text-[var(--foreground)]/70">
            25-метровая стрелковая галерея с современным оборудованием.{" "}
            <Link href="/arenda-tira" className="text-[var(--accent)] hover:underline">
              Подробнее об аренде →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
