import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DOC_SECTIONS } from "@/lib/data/docs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return DOC_SECTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const section = DOC_SECTIONS.find((s) => s.slug === slug);
  if (!section) return {};
  return { title: section.title, description: section.description };
}

export default async function DocSectionPage({ params }: Props) {
  const { slug } = await params;
  const section = DOC_SECTIONS.find((s) => s.slug === slug);
  if (!section) notFound();

  return (
    <>
      <section className="page-hero">
        <div className="container-page relative">
          <Link href="/docs" className="text-sm text-[var(--accent)] hover:underline">
            ← Все сведения
          </Link>
          <h1 className="section-title mt-4">{section.title}</h1>
          <p className="section-subtitle">{section.description}</p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="max-w-3xl space-y-8">
          {section.pending && (
            <p className="rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-muted)] p-4 text-sm text-[var(--accent)]">
              Раздел содержит данные-заглушки и требует заполнения реальными сведениями
              организации.
            </p>
          )}

          <div className="prose-content">
            {section.content.map((p) => (
              <p key={p.slice(0, 30)}>{p}</p>
            ))}
          </div>

          {section.subsections?.map((sub) => (
            <div key={sub.heading}>
              <h2 className="text-lg font-semibold text-white">{sub.heading}</h2>
              <ul className="mt-3 space-y-2 text-[var(--text-secondary)]">
                {sub.items.map((item) => (
                  <li key={item.slice(0, 30)} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {section.links && section.links.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white">Документы для скачивания</h2>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
