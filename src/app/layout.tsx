import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SITE } from "@/lib/data/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE.domain}`),
  title: {
    default: `${SITE.name} | Воскресенск`,
    template: `%s | ${SITE.shortName}`,
  },
  description: SITE.tagline,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE.shortName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${manrope.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-[var(--bg)] text-[var(--text)]">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
