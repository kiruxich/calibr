import type { MetadataRoute } from "next";
import { DOC_SECTIONS } from "@/lib/data/docs";

const BASE = "https://voskres-calibr.ru";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/obuchenie-grazhdan",
    "/okhranniki",
    "/sektsii",
    "/arenda-tira",
    "/raspisanie",
    "/tseny",
    "/trenazhyor",
    "/docs",
    "/kontakty",
    "/privacy",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${BASE}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...DOC_SECTIONS.map((s) => ({
      url: `${BASE}/docs/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
