import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CourseJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Обучение граждан, подготовка охранников, спортивные секции IPSC и Action Air, аренда тира 25 метров в Воскресенске.",
  alternates: { canonical: "/uslugi" },
};

interface ServiceBlock {
  id: string;
  title: string;
  lead: string;
  items: string[];
  priceFrom: number;
  detailHref: string;
  direction: string;
}

const SERVICES: ServiceBlock[] = [
  {
    id: "obuchenie-grazhdan",
    title: "Обучение граждан",
    lead: "Первоначальное обучение и периодическая проверка правил безопасного обращения с оружием. Документы установленного образца для Росгвардии.",
    items: [
      "Первоначальное обучение для получения разрешения",
      "Периодическая проверка знаний",
      "Итоговая аттестация",
    ],
    priceFrom: 6500,
    detailHref: "/obuchenie-grazhdan",
    direction: "obuchenie-grazhdan",
  },
  {
    id: "okhranniki",
    title: "Подготовка охранников",
    lead: "Профессиональная подготовка и переподготовка сотрудников ЧОО и ЧОП с практикой в тире.",
    items: [
      "Разряды 4 / 5 / 6",
      "Повышение квалификации охранников",
      "Повышение квалификации руководителей ЧОО",
    ],
    priceFrom: 12000,
    detailHref: "/okhranniki",
    direction: "okhranniki",
  },
  {
    id: "sektsii",
    title: "Секции и Action Air",
    lead: "Детская секция «Меткий выстрел» (пневматика, Action Air) и спортивная секция «Калибр» — практическая стрельба IPSC для взрослых.",
    items: [
      "«Меткий выстрел» — дети 8–17 лет",
      "«Калибр» — IPSC, 18+",
      "Практические занятия для физлиц",
    ],
    priceFrom: 2500,
    detailHref: "/sektsii",
    direction: "sektsii",
  },
  {
    id: "arenda",
    title: "Аренда тира",
    lead: "25-метровая стрелковая галерея и мишенные установки для частных лиц, спортсменов и корпоративных мероприятий.",
    items: [
      "Аренда галереи 25 м",
      "Мишенные установки",
      "Подарочные сертификаты, проверка боя",
    ],
    priceFrom: 5000,
    detailHref: "/arenda-tira",
    direction: "arenda",
  },
];

export default function UslugiPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "Услуги", path: "/uslugi" },
        ]}
      />
      {SERVICES.map((s) => (
        <CourseJsonLd
          key={s.id}
          name={s.title}
          description={s.lead}
          slug={s.detailHref}
          price={s.priceFrom}
        />
      ))}

      <section className="page-hero">
        <div className="container-page relative">
          <p className="section-label">Услуги</p>
          <h1 className="section-title mt-3 max-w-3xl">Программы и направления</h1>
          <p className="section-subtitle">
            Четыре направления школы «КАЛИБР» — выберите подходящее и запишитесь онлайн.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-[var(--border-light)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-white"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page divide-y divide-[var(--border)]">
        {SERVICES.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-28 py-16 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <p className="section-label">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{s.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
                  {s.lead}
                </p>
                <ul className="mt-6 space-y-3">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base text-[var(--text-secondary)]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-lg text-white">
                  Стоимость <span className="font-semibold text-[var(--accent)]">от {formatPrice(s.priceFrom)}</span>
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/kontakty?service=${s.direction}#zapis`} className="btn-primary">
                    Записаться
                  </Link>
                  <Link href={s.detailHref} className="btn-secondary inline-flex items-center gap-1">
                    Подробнее <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <Link
                  href={s.detailHref}
                  className="card-premium card-glow group block aspect-[4/3] overflow-hidden"
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <span className="text-6xl font-bold text-[var(--border-light)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <ArrowUpRight className="h-6 w-6 text-[var(--text-muted)] transition group-hover:text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-white group-hover:text-[var(--accent)]">
                        {s.title}
                      </p>
                      <p className="mt-2 text-sm text-[var(--text-muted)]">Открыть страницу направления</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
