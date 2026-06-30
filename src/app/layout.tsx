import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SITE } from "@/lib/data/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["200", "300", "400", "500", "600"],
});

const unbounded = Unbounded({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE.domain}`),
  title: {
    default: `${SITE.name} | Воскресенск`,
    template: `%s | ${SITE.shortName}`,
  },
  description:
    "Лицензированная школа стрелковой подготовки «КАЛИБР» в Воскресенске: обучение граждан и охранников, аттестация, спортивные секции IPSC и Action Air, аренда тира 25 м. Запись онлайн.",
  applicationName: SITE.shortName,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "education",
  keywords: [
    "стрелковая школа Воскресенск",
    "обучение на лицензию на оружие",
    "продление разрешения на оружие",
    "подготовка охранников 4 5 6 разряд",
    "периодическая проверка охранников",
    "аренда тира Воскресенск",
    "стрельба IPSC",
    "Action Air дети",
    "школа КАЛИБР",
    "тир 25 метров",
  ],
  alternates: {
    canonical: "/",
  },
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: `https://${SITE.domain}`,
    siteName: SITE.shortName,
    title: `${SITE.name} | Воскресенск`,
    description: SITE.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Воскресенск`,
    description: SITE.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Коды подтверждения добавьте после регистрации в Яндекс.Вебмастере / Google Search Console:
  // verification: { yandex: "...", google: "..." },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${unbounded.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-[var(--bg)] text-[var(--text)]">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
