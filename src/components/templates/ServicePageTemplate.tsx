import Link from "next/link";
import { BookingForm } from "@/components/booking/BookingForm";
import { Download } from "lucide-react";
import { DIRECTION_LABELS, type ScheduleDirection } from "@/lib/data/schedule";

export interface ServicePageProps {
  title: string;
  subtitle: string;
  description: string[];
  programs: { title: string; items: string[] }[];
  documents: { name: string; href: string }[];
  checklist: string[];
  direction: string;
}

export function ServicePageTemplate({
  title,
  subtitle,
  description,
  programs,
  documents,
  checklist,
  direction,
}: ServicePageProps) {
  return (
    <>
      <section className="page-hero">
        <div className="container-page relative">
          <p className="section-label">
            {DIRECTION_LABELS[direction as ScheduleDirection] ?? "Направление"}
          </p>
          <h1 className="section-title mt-3 max-w-3xl">{title}</h1>
          <p className="section-subtitle">{subtitle}</p>
          <Link href={`/kontakty?service=${direction}#zapis`} className="btn-primary mt-8 inline-flex">
            Записаться
          </Link>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="prose-content lg:col-span-2">
            {description.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}

            {programs.map((block) => (
              <div key={block.title} className="mt-10">
                <h2 className="text-xl font-light text-white">{block.title}</h2>
                <ul className="mt-4 space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-extralight text-[var(--text-secondary)]">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="mt-10 card-premium">
              <h2 className="text-xl font-light text-white">Необходимые документы</h2>
              <ul className="mt-4 space-y-2">
                {checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-extralight text-[var(--text-secondary)]">
                    <span className="text-[var(--accent)]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                {documents.map((d) => (
                  <a key={d.href} href={d.href} className="btn-secondary inline-flex items-center gap-2 text-sm">
                    <Download className="h-4 w-4" />
                    {d.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <BookingForm defaultService={direction} />
            <div className="card-premium text-sm font-extralight">
              <p className="font-light text-white">Полезные ссылки</p>
              <ul className="mt-4 space-y-2 text-[var(--text-secondary)]">
                <li><Link href="/raspisanie" className="hover:text-[var(--accent)]">Расписание</Link></li>
                <li><Link href="/tseny" className="hover:text-[var(--accent)]">Цены и калькулятор</Link></li>
                <li><Link href="/trenazhyor" className="hover:text-[var(--accent)]">Тренажёр-тест</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
