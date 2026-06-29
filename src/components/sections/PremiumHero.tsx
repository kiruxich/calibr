import Link from "next/link";
import { SITE } from "@/lib/data/site";
import { ShopifyHeroScene } from "@/components/three/LazyThree";

export function PremiumHero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[var(--bg)] lg:min-h-screen">
      <ShopifyHeroScene />

      <div className="pointer-events-none absolute inset-0 hero-vignette-top opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 hero-vignette" />

      {/* Readability scrim behind the text block */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[460px] w-[min(92vw,880px)] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(11,11,13,0.92) 0%, rgba(11,11,13,0.7) 42%, rgba(11,11,13,0) 72%)",
        }}
      />

      <div className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center px-4 pb-16 pt-28 text-center lg:min-h-screen lg:pt-32">
        <div className="animate-fade-up mb-6 inline-block">
          <div className="group relative rounded-full">
            <div className="gradient-border-layer rounded-full">
              <div className="gradient-rotator gradient-shimmer" />
            </div>
            <div className="relative z-10 rounded-full border border-transparent bg-[var(--bg-elevated)] px-5 py-2.5">
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Московская область · Воскресенск
              </p>
            </div>
          </div>
        </div>

        <h1
          className="animate-fade-up max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
          style={{
            animationDelay: "0.1s",
            textShadow: "0 2px 30px rgba(0,0,0,0.8)",
          }}
        >
          Школа стрелковой
          <br />
          <span className="text-[var(--accent)]">подготовки «КАЛИБР»</span>
        </h1>

        <p
          className="animate-fade-up mt-6 max-w-2xl text-lg font-normal leading-relaxed text-[var(--text-secondary)] sm:text-xl"
          style={{ animationDelay: "0.2s", textShadow: "0 1px 20px rgba(0,0,0,0.9)" }}
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

        <p className="mt-8 text-sm font-medium text-[var(--text-muted)]">
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
