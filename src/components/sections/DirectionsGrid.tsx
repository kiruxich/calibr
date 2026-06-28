import Link from "next/link";
import { Shield, BadgeCheck, Target, Building2, ArrowUpRight } from "lucide-react";
import { DIRECTIONS } from "@/lib/data/site";

const icons = { shield: Shield, badge: BadgeCheck, target: Target, building: Building2 } as const;

export function DirectionsGrid() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <p className="section-label text-center">Направления</p>
        <h2 className="section-title mt-2 text-center">Выберите программу</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIRECTIONS.map((d) => {
            const Icon = icons[d.icon as keyof typeof icons] ?? Target;
            return (
              <Link key={d.href} href={d.href} className="card-premium card-glow group block">
                <div className="flex items-start justify-between">
                  <Icon className="h-8 w-8 text-[var(--accent)]" strokeWidth={1.25} />
                  <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] transition group-hover:text-[var(--accent)]" />
                </div>
                <h3 className="mt-6 text-lg font-light text-white group-hover:text-[var(--accent)]">
                  {d.title}
                </h3>
                <p className="mt-2 text-sm font-extralight leading-relaxed text-[var(--text-muted)]">
                  {d.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
