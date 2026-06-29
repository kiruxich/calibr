import { SITE } from "@/lib/data/site";

const BASE = `https://${SITE.domain}`;

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["EducationalOrganization", "LocalBusiness"],
        "@id": `${BASE}/#organization`,
        name: SITE.name,
        alternateName: SITE.shortName,
        description: SITE.tagline,
        url: BASE,
        email: SITE.email,
        telephone: SITE.phones[0].value,
        foundingDate: String(SITE.founded),
        priceRange: "₽₽",
        image: `${BASE}/opengraph-image`,
        logo: `${BASE}/opengraph-image`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "ул. Московская, зд. 23, стр. 1",
          addressLocality: "Воскресенск",
          addressRegion: "Московская область",
          addressCountry: "RU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SITE.geo.lat,
          longitude: SITE.geo.lng,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Wednesday", "Saturday"],
            opens: "10:00",
            closes: "16:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Thursday", "Friday"],
            opens: "10:00",
            closes: "17:00",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: SITE.rating.value,
          reviewCount: SITE.rating.count,
          bestRating: 5,
        },
        sameAs: [SITE.maxUrl, `https://t.me/${SITE.telegram}`],
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      }}
    />
  );
}

export function CourseJsonLd({
  name,
  description,
  slug,
  price,
}: {
  name: string;
  description: string;
  slug: string;
  price?: number;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Course",
        name,
        description,
        url: `${BASE}${slug}`,
        provider: {
          "@type": "EducationalOrganization",
          name: SITE.name,
          sameAs: BASE,
        },
        ...(price
          ? {
              offers: {
                "@type": "Offer",
                price,
                priceCurrency: "RUB",
                category: "Paid",
                availability: "https://schema.org/InStock",
              },
            }
          : {}),
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: `${BASE}${it.path}`,
        })),
      }}
    />
  );
}
