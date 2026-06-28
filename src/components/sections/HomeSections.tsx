import { ADVANTAGES, POPULAR_COURSES, SITE } from "@/lib/data/site";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export function AdvantagesSection() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)] py-20 sm:py-28">
      <div className="container-page">
        <p className="section-label">Преимущества</p>
        <h2 className="section-title mt-2">Почему «КАЛИБР»</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {ADVANTAGES.map((a, i) => (
            <div key={a.title} className="card-premium relative overflow-hidden">
              <span className="text-4xl font-extralight text-[var(--border-light)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-light text-white">{a.title}</h3>
              <p className="mt-2 text-sm font-extralight leading-relaxed text-[var(--text-muted)]">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PopularCourses() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <p className="section-label">Курсы</p>
        <h2 className="section-title mt-2">Популярные программы</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_COURSES.map((c) => (
            <div key={c.title} className="card-premium card-glow flex flex-col">
              <h3 className="font-light text-white">{c.title}</h3>
              <p className="mt-4 text-2xl font-extralight text-[var(--accent)]">
                от {formatPrice(c.priceFrom)}
              </p>
              <Link href={`/kontakty?service=${c.direction}#zapis`} className="btn-primary mt-auto pt-6 text-center text-sm">
                Записаться
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VideoSection() {
  return (
    <section className="container-page py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="section-label">О школе</p>
          <h2 className="section-title mt-2">Профессиональная подготовка</h2>
          <div className="prose-content mt-6">
            <p>
              «КАЛИБР» — {SITE.tagline.toLowerCase()}. Обучение граждан, подготовка охранников,
              секции IPSC и Action Air, аренда 25-метровой галереи.
            </p>
            <p>
              Документы установленного образца, современный тир и опытные инструкторы.
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border-light)] bg-black">
          <div className="gradient-border-layer rounded-2xl">
            <div className="gradient-rotator gradient-shimmer" />
          </div>
          <div className="relative aspect-video">
            <iframe
              src={SITE.youtube}
              title="Видео о школе КАЛИБР"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
