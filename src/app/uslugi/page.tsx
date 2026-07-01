import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Info } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CourseJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Обучение граждан, практическая стрельба IPSC, детская секция «Меткий выстрел», подготовка охранников и руководителей ЧОП, аренда 25-метрового тира в Воскресенске.",
  alternates: { canonical: "/uslugi" },
};

interface Service {
  id: string;
  title: string;
  lead: string;
  priceFrom?: number;
  detailHref: string;
  direction: string;
}

interface ServiceCategory {
  id: string;
  label: string;
  title: string;
  description: string;
  services: Service[];
}

const CATEGORIES: ServiceCategory[] = [
  {
    id: "grazhdane",
    label: "Обучение граждан",
    title: "Обучение граждан",
    description:
      "Подготовка и проверка знаний для владельцев гражданского оружия, практические занятия по стрельбе.",
    services: [
      {
        id: "obuchenie-grazhdan",
        title: "Обучение граждан безопасному обращению с оружием",
        lead: "Первоначальное обучение и периодическая проверка. Документы установленного образца для Росгвардии — оформляем в день занятия.",
        priceFrom: 6500,
        detailHref: "/obuchenie-grazhdan",
        direction: "obuchenie-grazhdan",
      },
      {
        id: "practical",
        title: "Практическая стрельба",
        lead: "Практические занятия по стрельбе в 25-метровой галерее под контролем инструктора. Для владельцев оружия и гостей школы.",
        priceFrom: 2000,
        detailHref: "/arenda-tira",
        direction: "arenda",
      },
      {
        id: "ipsc",
        title: "Практическая стрельба I.P.S.C.",
        lead: "Обучение граждан практической стрельбе по правилам IPSC. Индивидуальные и групповые занятия, подготовка к разрядам.",
        priceFrom: 2500,
        detailHref: "/sektsii",
        direction: "sektsii",
      },
    ],
  },
  {
    id: "deti-sport",
    label: "Дети и спорт",
    title: "Секции для детей и взрослых",
    description:
      "Спортивные секции школы «Калибр»: детская программа и практическая стрельба для взрослых.",
    services: [
      {
        id: "metkiy-vystrel",
        title: "Обучение детей «Меткий выстрел»",
        lead: "Программа для детей 8–17 лет: только пневматическое оружие, дисциплина и техника безопасности на первом месте.",
        priceFrom: 2500,
        detailHref: "/sektsii",
        direction: "sektsii",
      },
      {
        id: "sektsiya-kalibr",
        title: "Стрелково-спортивная секция «КАЛИБР»",
        lead: "Спортивная секция для всех желающих 18+: практическая стрельба, регулярные тренировки, участие в соревнованиях.",
        priceFrom: 2500,
        detailHref: "/sektsii",
        direction: "sektsii",
      },
    ],
  },
  {
    id: "ohrana",
    label: "Охранная деятельность",
    title: "Подготовка охранников и руководителей ЧОП",
    description:
      "Профессиональная подготовка, переподготовка и повышение квалификации сотрудников охранных предприятий.",
    services: [
      {
        id: "okhranniki",
        title: "Обучение частных охранников",
        lead: "Профессиональная подготовка охранников 4, 5 и 6 разрядов с практикой в тире и итоговой аттестацией.",
        priceFrom: 12000,
        detailHref: "/okhranniki",
        direction: "okhranniki",
      },
      {
        id: "povyshenie-ohrana",
        title: "Повышение квалификации охранников",
        lead: "Периодическая проверка и повышение квалификации для действующих частных охранников.",
        detailHref: "/okhranniki",
        direction: "okhranniki",
      },
      {
        id: "ruk-chop",
        title: "Обучение руководителей ЧОП",
        lead: "Обучение и повышение квалификации руководителей частных охранных предприятий.",
        detailHref: "/okhranniki",
        direction: "okhranniki",
      },
    ],
  },
  {
    id: "tir",
    label: "Тир",
    title: "Аренда тира",
    description:
      "25-метровая стрелковая галерея для частных лиц, спортсменов и корпоративных мероприятий.",
    services: [
      {
        id: "arenda",
        title: "Аренда 25-метровой стрелковой галереи",
        lead: "Оборудованная галерея с мишенными установками. Аренда для тренировок, проверки боя и подарочных сертификатов.",
        priceFrom: 5000,
        detailHref: "/arenda-tira",
        direction: "arenda",
      },
    ],
  },
];

const ALL_SERVICES = CATEGORIES.flatMap((c) => c.services);

const CONDITIONS = [
  "Дети занимаются только с пневматическим оружием, взрослые — с огнестрельным.",
  "Для практических занятий при себе: справка 002-о/у, разрешение на владение оружием и паспорт — либо удостоверение IPSC.",
  "Для членов секции «Калибр» и спортсменов IPSC действует система скидок.",
  "Приём ведётся строго по предварительной записи.",
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
      {ALL_SERVICES.map((s) => (
        <CourseJsonLd
          key={s.id}
          name={s.title}
          description={s.lead}
          slug={s.detailHref}
          price={s.priceFrom ?? 0}
        />
      ))}

      <section className="page-hero">
        <div className="container-page relative">
          <p className="section-label">Услуги</p>
          <h1 className="section-title mt-3 max-w-3xl">Программы и направления</h1>
          <p className="section-subtitle">
            Школа стрелковой подготовки «КАЛИБР» — обучение граждан и охранников,
            детская и спортивная секции, аренда тира. Выберите направление и
            запишитесь онлайн.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="rounded-full border border-[var(--border-light)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-white"
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page space-y-16 py-16 sm:space-y-20 sm:py-20">
        {CATEGORIES.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-28">
            <div className="max-w-2xl">
              <p className="section-label">{cat.label}</p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                {cat.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
                {cat.description}
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cat.services.map((s) => (
                <Link
                  key={s.id}
                  href={s.detailHref}
                  className="card-premium card-glow group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold leading-snug text-white group-hover:text-[var(--accent)]">
                        {s.title}
                      </h3>
                      <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--text-muted)] transition group-hover:text-[var(--accent)]" />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {s.lead}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
                    {s.priceFrom ? (
                      <span className="text-sm text-white">
                        от{" "}
                        <span className="font-semibold text-[var(--accent)]">
                          {formatPrice(s.priceFrom)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-sm text-[var(--text-muted)]">
                        Стоимость по запросу
                      </span>
                    )}
                    <span className="text-sm font-medium text-[var(--accent)]">
                      Подробнее
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Тир и условия — как на живом сайте */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="card-surface">
            <p className="section-label">О тире</p>
            <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
              Стрелковая галерея «КАЛИБР»
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
              «Калибр» — школа стрелковой подготовки детей и взрослых, оборудованная
              в соответствии с требованиями безопасности при практических занятиях
              стрельбой. Стрелковая галерея оснащена{" "}
              <span className="text-white">
                антирикошетным и шумоулавливающим покрытием
              </span>
              , имеет специальную систему освещения и{" "}
              <span className="text-white">пылеулавливающее устройство</span>.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
              Одно из направлений — стрелковая подготовка детей (только пневматическое
              оружие) и взрослых (огнестрельное оружие). И теоретические, и
              практические навыки стрельбы можно получить в удобном формате.
            </p>
          </div>

          <div className="card-surface">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-[var(--accent)]" />
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Условия посещения
              </h2>
            </div>
            <ul className="mt-5 space-y-3">
              {CONDITIONS.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                  {c}
                </li>
              ))}
            </ul>
            <Link href="/kontakty#zapis" className="btn-primary mt-6 inline-flex">
              Записаться
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
