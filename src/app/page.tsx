import Link from "next/link";
import { PremiumHero, StatsMarquee } from "@/components/sections/PremiumHero";
import { ScrollScene3D } from "@/components/three/LazyThree";
import { UpcomingSlots } from "@/components/sections/UpcomingSlots";
import { DirectionsGrid } from "@/components/sections/DirectionsGrid";
import { AdvantagesSection, PopularCourses, VideoSection } from "@/components/sections/HomeSections";

export default function HomePage() {
  return (
    <>
      <PremiumHero />
      <StatsMarquee />
      <UpcomingSlots />
      <DirectionsGrid />

      <section className="container-page py-20 sm:py-28">
        <p className="section-label">Интерактив</p>
        <h2 className="section-title mt-2">Профессиональный тир</h2>
        <p className="section-subtitle">
          Атмосферная 3D-визуализация — как на премиальных e-commerce платформах. Плавная
          анимация, частицы и интерактивное освещение.
        </p>
        <div className="mt-10">
          <ScrollScene3D />
        </div>
      </section>

      <VideoSection />
      <AdvantagesSection />
      <PopularCourses />

      <section className="container-page pb-20">
        <div className="card-premium card-glow flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="section-label">Экзамен</p>
            <h2 className="mt-2 text-xl font-light text-white sm:text-2xl">Готовы к аттестации?</h2>
            <p className="mt-2 text-sm font-light text-[var(--text-secondary)]">
              10 вопросов, 1 ошибка допустима — как на экзамене Росгвардии.
            </p>
          </div>
          <Link href="/trenazhyor" className="btn-primary shrink-0">
            Начать тест
          </Link>
        </div>
      </section>
    </>
  );
}
