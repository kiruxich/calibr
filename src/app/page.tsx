import Link from "next/link";
import { PremiumHero, StatsMarquee } from "@/components/sections/PremiumHero";
import { UpcomingSlots } from "@/components/sections/UpcomingSlots";
import { DirectionsGrid } from "@/components/sections/DirectionsGrid";
import { AdvantagesSection } from "@/components/sections/HomeSections";
import {
  ReviewsSection,
  InstructorsSection,
  GallerySection,
  PromoSection,
} from "@/components/sections/MarketingSections";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd />

      <PremiumHero />
      <StatsMarquee />
      <DirectionsGrid />
      <UpcomingSlots />
      <AdvantagesSection />
      <ReviewsSection />
      <InstructorsSection />
      <GallerySection />
      <PromoSection />

      <section className="container-page py-20 sm:py-28">
        <div className="card-premium card-glow flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="section-label">Подготовка к экзамену</p>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Проверьте себя онлайн</h2>
            <p className="mt-3 text-base text-[var(--text-secondary)]">
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
