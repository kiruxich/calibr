import Link from "next/link";
import { SITE } from "@/lib/data/site";
import { ShopifyHeroScene } from "@/components/three/LazyThree";

export function PremiumHero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[var(--bg)] lg:min-h-screen">
      <ShopifyHeroScene />

      <div className="pointer-events-none absolute inset-0 hero-vignette-top opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 hero-vignette" />

      <div className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center px-4 pb-16 pt-28 text-center lg:min-h-screen lg:pt-32">
        <div className="animate-fade-up mb-6 inline-block">
          <div className="group relative rounded-full">
            <div className="gradient-border-layer rounded-full">
              <div className="gradient-rotator gradient-shimmer" />
            </div>
            <div className="relative z-10 rounded-full border border-transparent bg-[var(--bg-elevated)] px-4 py-2 sm:px-5 sm:py-2.5">
              <p className="text-xs font-extralight text-[var(--text)] sm:text-sm">
                Московская область · Воскресенск
              </p>
            </div>
          </div>
        </div>

        <h1
          className="animate-fade-up max-w-4xl text-3xl font-extralight leading-[1.15] text-white sm:text-4xl lg:text-5xl xl:text-6xl"
          style={{ animationDelay: "0.1s" }}
        >
          Школа стрелковой
          <br />
          <span className="font-light text-[var(--accent)]">подготовки «КАЛИБР»</span>
        </h1>

        <p
          className="animate-fade-up mt-5 max-w-xl text-sm font-light leading-relaxed text-[var(--text-secondary)] sm:text-base lg:text-lg"
          style={{ animationDelay: "0.2s" }}
        >
          {SITE.tagline}. Обучение, аттестация, спортивные секции и тир 25 метров.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "0.3s" }}
        >
          <Link href="/kontakty#zapis" className="btn-primary">
            Записаться на занятие
          </Link>
          <Link href="/trenazhyor" className="btn-secondary">
            Тренажёр-тест
          </Link>
        </div>

        <p className="mt-8 text-xs font-extralight text-[var(--text-muted)]">
          {SITE.phones[0].display} · {SITE.email}
        </p>
      </div>
    </section>
  );
}

export function StatsMarquee() {
  const items = [
    "Тир 25 м",
    "Лицензия Рособрнадзора",
    "IPSC / Action Air",
    "Обучение граждан",
    "Подготовка охранников",
    "Детская секция",
    "Единственные в Воскресенске",
  ];

  return (
    <section className="overflow-hidden border-y border-[var(--border)] bg-[var(--bg-elevated)] py-4">
      <div className="animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="mx-8 text-sm font-extralight text-[var(--text-secondary)]">
            <span className="mr-3 text-[var(--accent)]">◆</span>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
