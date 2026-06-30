import type { Metadata } from "next";
import { hasDb } from "@/db";
import { getAllSlots, getWeeklySchedule, getBookings } from "@/db/queries";
import {
  DateInput,
  DirectionSelect,
  NumberInput,
  TextInput,
  TimeInput,
} from "@/components/ui/form";
import {
  createSlotAction,
  updateSlotAction,
  deleteSlotAction,
  createWeeklyAction,
  updateWeeklyAction,
  deleteWeeklyAction,
  logoutAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Админка",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const dbReady = hasDb();
  const [slots, weekly, bookings] = await Promise.all([
    getAllSlots(),
    getWeeklySchedule(),
    getBookings(),
  ]);

  return (
    <div className="container-page space-y-12 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Админка · Расписание</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Управление слотами, недельной сеткой и заявками
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="btn-secondary text-sm">
            Выйти
          </button>
        </form>
      </header>

      {!dbReady && (
        <p className="rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-muted)] p-4 text-sm text-[var(--accent)]">
          База данных не настроена (нет <code>DATABASE_URL</code>). Сейчас показаны
          демо-данные, редактирование недоступно. Подключите Neon, выполните
          <code> npm run db:push</code> и <code> npm run db:seed</code>.
        </p>
      )}

      {/* ── Slots ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Слоты записи</h2>

        <form
          action={createSlotAction}
          className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-7"
        >
          <DateInput name="date" required />
          <TimeInput name="time" required />
          <TextInput name="title" placeholder="Название" required className="sm:col-span-2" />
          <DirectionSelect name="direction" />
          <NumberInput name="spotsTotal" min={0} placeholder="Всего" required />
          <div className="flex gap-2">
            <NumberInput name="spotsLeft" min={0} placeholder="Своб." required />
            <button type="submit" disabled={!dbReady} className="btn-primary shrink-0 px-3 text-sm">
              +
            </button>
          </div>
        </form>

        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-[var(--surface)] text-left text-[var(--text-secondary)]">
              <tr>
                <th className="p-3">Дата</th>
                <th className="p-3">Время</th>
                <th className="p-3">Название</th>
                <th className="p-3">Направление</th>
                <th className="p-3">Всего</th>
                <th className="p-3">Свободно</th>
                <th className="p-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => (
                <tr key={s.id} className="border-t border-[var(--border)] align-middle">
                  <td className="p-2">
                    <form action={updateSlotAction} id={`slot-${s.id}`} className="contents">
                      <input type="hidden" name="id" value={s.id} />
                      <DateInput name="date" defaultValue={s.date} form={`slot-${s.id}`} />
                    </form>
                  </td>
                  <td className="p-2">
                    <TimeInput form={`slot-${s.id}`} name="time" defaultValue={s.time} />
                  </td>
                  <td className="p-2">
                    <TextInput form={`slot-${s.id}`} name="title" defaultValue={s.title} className="min-w-[160px]" />
                  </td>
                  <td className="p-2">
                    <DirectionSelect form={`slot-${s.id}`} name="direction" defaultValue={s.direction} />
                  </td>
                  <td className="p-2">
                    <NumberInput form={`slot-${s.id}`} name="spotsTotal" min={0} defaultValue={s.spotsTotal} className="w-20" />
                  </td>
                  <td className="p-2">
                    <NumberInput form={`slot-${s.id}`} name="spotsLeft" min={0} defaultValue={s.spotsLeft} className="w-20" />
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button form={`slot-${s.id}`} type="submit" disabled={!dbReady} className="btn-secondary px-3 py-1.5 text-xs">
                        Сохранить
                      </button>
                      <form action={deleteSlotAction}>
                        <input type="hidden" name="id" value={s.id} />
                        <button type="submit" disabled={!dbReady} className="rounded-lg border border-[var(--error)]/40 px-3 py-1.5 text-xs text-[var(--error)]">
                          Удалить
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Weekly ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Недельная сетка</h2>

        <form
          action={createWeeklyAction}
          className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-6"
        >
          <NumberInput name="position" min={0} placeholder="№" required className="w-20" />
          <TextInput name="day" placeholder="День" required />
          <TimeInput name="time" required />
          <TextInput name="event" placeholder="Мероприятие" required />
          <DirectionSelect name="direction" />
          <button type="submit" disabled={!dbReady} className="btn-primary text-sm">
            Добавить
          </button>
        </form>

        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-[var(--surface)] text-left text-[var(--text-secondary)]">
              <tr>
                <th className="p-3">№</th>
                <th className="p-3">День</th>
                <th className="p-3">Время</th>
                <th className="p-3">Мероприятие</th>
                <th className="p-3">Направление</th>
                <th className="p-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {weekly.map((w) => (
                <tr key={w.id ?? w.position} className="border-t border-[var(--border)]">
                  <td className="p-2">
                    <form action={updateWeeklyAction} id={`wk-${w.id}`} className="contents">
                      <input type="hidden" name="id" value={w.id ?? ""} />
                      <NumberInput name="position" min={0} defaultValue={w.position} className="w-16" />
                    </form>
                  </td>
                  <td className="p-2">
                    <TextInput form={`wk-${w.id}`} name="day" defaultValue={w.day} className="min-w-[120px]" />
                  </td>
                  <td className="p-2">
                    <TimeInput form={`wk-${w.id}`} name="time" defaultValue={w.time} />
                  </td>
                  <td className="p-2">
                    <TextInput form={`wk-${w.id}`} name="event" defaultValue={w.event} className="min-w-[200px]" />
                  </td>
                  <td className="p-2">
                    <DirectionSelect form={`wk-${w.id}`} name="direction" defaultValue={w.direction} />
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button form={`wk-${w.id}`} type="submit" disabled={!dbReady || !w.id} className="btn-secondary px-3 py-1.5 text-xs">
                        Сохранить
                      </button>
                      <form action={deleteWeeklyAction}>
                        <input type="hidden" name="id" value={w.id ?? ""} />
                        <button type="submit" disabled={!dbReady || !w.id} className="rounded-lg border border-[var(--error)]/40 px-3 py-1.5 text-xs text-[var(--error)]">
                          Удалить
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Bookings ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          Заявки <span className="text-[var(--text-muted)]">({bookings.length})</span>
        </h2>

        {bookings.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            Заявок пока нет{!dbReady ? " (БД не подключена)" : ""}.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-[var(--surface)] text-left text-[var(--text-secondary)]">
                <tr>
                  <th className="p-3">Дата</th>
                  <th className="p-3">Тип</th>
                  <th className="p-3">Имя</th>
                  <th className="p-3">Телефон</th>
                  <th className="p-3">Направление</th>
                  <th className="p-3">Слот</th>
                  <th className="p-3">Комментарий</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-[var(--border)] align-top">
                    <td className="p-3 whitespace-nowrap text-[var(--text-muted)]">
                      {new Date(b.createdAt).toLocaleString("ru-RU")}
                    </td>
                    <td className="p-3">{b.type === "callback" ? "Звонок" : "Запись"}</td>
                    <td className="p-3 text-white">{b.name}</td>
                    <td className="p-3 whitespace-nowrap">
                      <a href={`tel:${b.phone}`} className="text-[var(--accent)]">{b.phone}</a>
                    </td>
                    <td className="p-3">{b.serviceLabel ?? "—"}</td>
                    <td className="p-3">{b.slotTitle ? `${b.slotTitle} (${b.slotDate ?? "—"})` : "—"}</td>
                    <td className="p-3 max-w-[240px] text-[var(--text-secondary)]">{b.comment || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
