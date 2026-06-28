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
      <section className="bg-[var(--bg-elevated)] py-8">
        <div className="container-page">
          <Link href="/docs" className="text-sm text-[var(--accent)] hover:underline">
            ← Все сведения
          </Link>
          <h1 className="section-title mt-4">{section.title}</h1>
          <p className="section-subtitle">{section.description}</p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="prose-content max-w-3xl">
          {section.content.map((p) => (
            <p key={p.slice(0, 30)}>{p}</p>
          ))}
        </div>
      </section>
    </>
  );
}
