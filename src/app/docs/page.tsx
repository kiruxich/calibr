import type { Metadata } from "next";
import Link from "next/link";
import { DOC_SECTIONS } from "@/lib/data/docs";

export const metadata: Metadata = {
  title: "Сведения об образовательной организации",
  description: "Обязательная информация об образовательной организации по требованиям законодательства.",
};

export default function DocsIndexPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-page relative">
          <h1 className="section-title">Сведения об образовательной организации</h1>
          <p className="section-subtitle">
            Раздел размещён в соответствии со ст. 29 ФЗ «Об образовании в Российской
            Федерации», Постановлением Правительства РФ от 20.10.2021 № 1802 и Приказом
            Рособрнадзора от 14.08.2020 № 831.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOC_SECTIONS.map((section, i) => (
            <Link
              key={section.slug}
              href={`/docs/${section.slug}`}
              className="card-premium card-glow block transition hover:border-[var(--accent)]/30"
            >
              <span className="text-sm font-extralight text-[var(--accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 font-light text-white">{section.title}</h2>
              <p className="mt-2 text-sm font-extralight text-[var(--text-muted)]">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
