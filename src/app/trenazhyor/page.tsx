import type { Metadata } from "next";
import Link from "next/link";
import { TestTrainer } from "@/components/test/TestTrainer";

export const metadata: Metadata = {
  title: "Тренажёр-тест",
  description:
    "Онлайн-тестирование по правилам безопасного обращения с оружием — тренировка и экзамен.",
};

export default function TestPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-page relative">
          <h1 className="section-title">Тренажёр-тест</h1>
          <p className="section-subtitle">
            Подготовка к теоретической части экзамена Росгвардии: 10 вопросов, допускается 1
            ошибка.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <TestTrainer />
        <p className="mt-8 text-sm text-[var(--foreground)]/60">
          Официальный перечень вопросов Росгвардии — на странице{" "}
          <Link href="/obuchenie-grazhdan" className="text-[var(--accent)] underline">
            обучения граждан
          </Link>
          . Тренажёр не заменяет официальную аттестацию.
        </p>
      </section>
    </>
  );
}
