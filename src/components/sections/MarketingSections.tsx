import Link from "next/link";
import { Star, Camera, User, Gift, Quote } from "lucide-react";
import { REVIEWS, INSTRUCTORS, GALLERY, PROMOS } from "@/lib/data/marketing";
import { SITE } from "@/lib/data/site";

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < n ? "fill-[var(--accent)] text-[var(--accent)]" : "text-[var(--border-light)]"}`}
        />
      ))}
    </span>
  );
}

export function ReviewsSection() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)] py-20 sm:py-24">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-label">Отзывы</p>
            <h2 className="section-title mt-2">Нам доверяют</h2>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
            <span className="text-3xl font-bold text-[var(--accent)]">{SITE.rating.value}</span>
            <div>
              <Stars n={5} />
              <p className="mt-1 text-xs text-[var(--text-muted)]">{SITE.rating.count} отзывов · Яндекс, 2ГИС</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.id} className="card-premium flex flex-col">
              <Quote className="h-6 w-6 text-[var(--accent)]/40" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                {r.text}
              </blockquote>
              <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
                <figcaption className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-muted)] text-sm font-semibold text-[var(--accent)]">
                    {r.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-white">{r.author}</span>
                    <span className="block text-xs text-[var(--text-muted)]">{r.source} · {r.date}</span>
                  </span>
                </figcaption>
                <Stars n={r.rating} />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstructorsSection() {
  return (
    <section className="container-page py-20 sm:py-24">
      <p className="section-label">Команда</p>
      <h2 className="section-title mt-2">Инструкторы</h2>
      <p className="section-subtitle">Опытные преподаватели с практической и спортивной подготовкой.</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {INSTRUCTORS.map((p) => (
          <div key={p.id} className="card-premium">
            {/* photo placeholder */}
            <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-[var(--border-light)] bg-[var(--bg-elevated)]">
              <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
                <User className="h-10 w-10" />
                <span className="text-xs">Фото скоро</span>
              </div>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">{p.name}</h3>
            <p className="mt-1 text-sm font-medium text-[var(--accent)]">{p.role}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-[var(--text-muted)]">{p.experience}</p>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">{p.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function GallerySection() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--bg-elevated)] py-20 sm:py-24">
      <div className="container-page">
        <p className="section-label">Галерея</p>
        <h2 className="section-title mt-2">Наш тир и занятия</h2>
        <p className="section-subtitle">Фотографии стрелковой галереи, классов и тренировок появятся здесь.</p>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {GALLERY.map((g) => (
            <div
              key={g.id}
              className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-xl border border-dashed border-[var(--border-light)] bg-[var(--surface)]"
            >
              <Camera className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <span className="relative w-full bg-gradient-to-t from-black/70 to-transparent p-3 text-xs font-medium text-white">
                {g.caption}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PromoSection() {
  return (
    <section className="container-page py-20 sm:py-24">
      <div className="grid gap-4 md:grid-cols-2">
        {PROMOS.map((p) => (
          <div key={p.id} className="card-premium card-glow flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-muted)] text-[var(--accent)]">
                <Gift className="h-6 w-6" />
              </span>
              <div>
                <div className="mb-2 inline-block rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent-foreground)]">
                  {p.badge}
                </div>
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{p.text}</p>
              </div>
            </div>
            <Link href="/oplata" className="btn-secondary shrink-0 text-sm">
              Оформить
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
