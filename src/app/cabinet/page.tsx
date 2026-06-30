import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileText,
  Phone,
} from "lucide-react";
import { CLIENT_COOKIE, readClientToken } from "@/lib/client-auth";
import { getBookingsByPhone } from "@/db/queries";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "Личный кабинет",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  new: { label: "Новая", cls: "text-[var(--accent)] border-[var(--accent)]/40 bg-[var(--accent-muted)]" },
  confirmed: { label: "Подтверждена", cls: "text-[var(--success)] border-[var(--success)]/40 bg-[var(--success)]/10" },
  done: { label: "Завершена", cls: "text-[var(--text-muted)] border-[var(--border-light)] bg-[var(--surface)]" },
  cancelled: { label: "Отменена", cls: "text-[var(--error)] border-[var(--error)]/40 bg-[var(--error)]/10" },
};

function formatPhone(norm: string) {
  if (norm.length !== 11) return norm;
  return `+7 (${norm.slice(1, 4)}) ${norm.slice(4, 7)}-${norm.slice(7, 9)}-${norm.slice(9)}`;
}

export default async function CabinetPage() {
  const store = await cookies();
  const phone = await readClientToken(store.get(CLIENT_COOKIE)?.value);
  if (!phone) redirect("/cabinet/login");

  const all = await getBookingsByPhone(phone);
  const bookings = all.filter((b) => b.type === "booking");
  const callbacks = all.filter((b) => b.type === "callback");
  const name = all.find((b) => b.name)?.name ?? "Клиент";
  const upcoming = bookings
    .filter((b) => b.slotDate && b.slotDate >= new Date().toISOString().slice(0, 10))
    .sort((a, b) => (a.slotDate ?? "").localeCompare(b.slotDate ?? ""));

  return (
    <div className="container-page space-y-10 pb-12 pt-28 sm:pt-32">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Личный кабинет</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Phone className="h-4 w-4 text-[var(--accent)]" />
            {name} · {formatPhone(phone)}
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="btn-secondary text-sm">
            Выйти
          </button>
        </form>
      </header>

      {/* ── Заявки ── */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
          <ClipboardList className="h-5 w-5 text-[var(--accent)]" />
          Мои заявки
        </h2>
        {bookings.length === 0 && callbacks.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            Заявок пока нет.{" "}
            <Link href="/kontakty#zapis" className="text-[var(--accent)] underline">
              Записаться на занятие
            </Link>
          </p>
        ) : (
          <div className="grid gap-3">
            {bookings.map((b) => {
              const st = STATUS_LABELS[b.status] ?? STATUS_LABELS.new;
              return (
                <div key={b.id} className="card-surface flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{b.slotTitle ?? b.serviceLabel ?? "Заявка"}</p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      {b.serviceLabel ?? "—"}
                      {b.slotDate ? ` · ${new Date(b.slotDate).toLocaleDateString("ru-RU")}` : ""}
                      {` · подана ${new Date(b.createdAt).toLocaleDateString("ru-RU")}`}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-3 py-1 text-xs ${st.cls}`}>
                    {st.label}
                  </span>
                </div>
              );
            })}
            {callbacks.map((b) => (
              <div key={b.id} className="card-surface flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-white">Запрос обратного звонка</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    подан {new Date(b.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-[var(--border-light)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--text-muted)]">
                  Звонок
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Расписание ── */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
          <CalendarDays className="h-5 w-5 text-[var(--accent)]" />
          Моё расписание
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            Нет предстоящих занятий. Общее расписание —{" "}
            <Link href="/raspisanie" className="text-[var(--accent)] underline">
              на странице «Расписание»
            </Link>
            .
          </p>
        ) : (
          <ul className="grid gap-2">
            {upcoming.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
              >
                <span className="text-white">{b.slotTitle ?? b.serviceLabel}</span>
                <span className="text-[var(--text-muted)]">
                  {b.slotDate ? new Date(b.slotDate).toLocaleDateString("ru-RU") : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Документы ── */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
          <FileText className="h-5 w-5 text-[var(--accent)]" />
          Мои документы
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <a href="/docs/dogovor.pdf" className="card-premium block hover:border-[var(--accent)]/40">
            <p className="font-medium text-white">Договор об обучении</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Скачать образец (PDF)</p>
          </a>
          <a href="/docs/zayavlenie.docx" className="card-premium block hover:border-[var(--accent)]/40">
            <p className="font-medium text-white">Бланк заявления</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Скачать (Word)</p>
          </a>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Персональные документы (справка об окончании, акты) появятся здесь после
          прохождения обучения.
        </p>
      </section>

      {/* ── Оплаты ── */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
          <CreditCard className="h-5 w-5 text-[var(--accent)]" />
          Оплаты и сертификаты
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          История оплат и подарочные сертификаты будут отображаться здесь после
          подключения онлайн-оплаты.
        </p>
      </section>
    </div>
  );
}
