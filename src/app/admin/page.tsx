import type { Metadata } from "next";
import { hasDb } from "@/db";
import { getAllSlots, getWeeklySchedule, getBookings, listAdmins } from "@/db/queries";
import { getAdminSession } from "@/lib/admin-session";
import {
  ADMIN_ROLES,
  ROLE_HINTS,
  ROLE_LABELS,
  canManageAdmins,
  canManageSchedule,
  type AdminRole,
} from "@/lib/auth";
import {
  DateInput,
  DirectionSelect,
  NumberInput,
  Select,
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
  createAdminAction,
  updateAdminRoleAction,
  resetAdminPasswordAction,
  deleteAdminAction,
  changeOwnPasswordAction,
  logoutAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Админка",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ERROR_MESSAGES: Record<string, string> = {
  forbidden: "Недостаточно прав для этого действия.",
  admin_input: "Проверьте поля: логин от 3 символов, пароль от 6.",
  admin_exists: "Администратор с таким логином уже существует.",
  last_owner: "Нельзя убрать последнего владельца.",
  self_demote: "Нельзя понизить свою собственную роль владельца.",
  self_delete: "Нельзя удалить собственную учётную запись.",
  bad_current: "Текущий пароль указан неверно.",
  legacy_pw: "Смена пароля доступна только для аккаунтов в базе данных.",
};

const ROLE_OPTIONS = ADMIN_ROLES.map((r) => ({
  value: r,
  label: `${ROLE_LABELS[r]} — ${ROLE_HINTS[r]}`,
}));

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const dbReady = hasDb();
  const { error, ok } = await searchParams;
  const session = await getAdminSession();
  const role: AdminRole = session?.role ?? "manager";
  const maySchedule = canManageSchedule(role);
  const mayAdmins = canManageAdmins(role);

  const [slots, weekly, bookings, adminList] = await Promise.all([
    getAllSlots(),
    getWeeklySchedule(),
    getBookings(),
    mayAdmins ? listAdmins() : Promise.resolve([]),
  ]);

  return (
    <div className="container-page space-y-12 pb-12 pt-28 sm:pt-32">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Админка · КАЛИБР</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Ваша роль:{" "}
            <span className="font-medium text-[var(--accent)]">{ROLE_LABELS[role]}</span>{" "}
            · {ROLE_HINTS[role]}
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="btn-secondary text-sm">
            Выйти
          </button>
        </form>
      </header>

      {error && ERROR_MESSAGES[error] && (
        <p className="rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 p-4 text-sm text-[var(--error)]">
          {ERROR_MESSAGES[error]}
        </p>
      )}

      {ok === "pw" && (
        <p className="rounded-lg border border-[var(--success)]/40 bg-[var(--success)]/10 p-4 text-sm text-[var(--success)]">
          Пароль изменён.
        </p>
      )}

      {/* ── Свой пароль ── */}
      {dbReady && session?.sub && session.sub !== "legacy" && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Мой пароль</h2>
          <form
            action={changeOwnPasswordAction}
            className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-3"
          >
            <TextInput
              name="current"
              type="password"
              placeholder="Текущий пароль"
              required
              autoComplete="current-password"
            />
            <TextInput
              name="password"
              type="password"
              placeholder="Новый пароль (от 6)"
              required
              autoComplete="new-password"
            />
            <button type="submit" className="btn-primary text-sm">
              Сменить пароль
            </button>
          </form>
        </section>
      )}

      {!dbReady && (
        <p className="rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-muted)] p-4 text-sm text-[var(--accent)]">
          База данных не настроена (нет <code>DATABASE_URL</code>). Сейчас показаны
          демо-данные, редактирование недоступно. Подключите Neon, выполните
          <code> npm run db:push</code> и <code> npm run db:seed</code>.
        </p>
      )}

      {/* ── Slots ── */}
      {maySchedule && (
      <>
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

      </>
      )}

      {!maySchedule && (
        <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)]">
          Управление расписанием доступно администраторам и владельцу. Ваша роль —
          «{ROLE_LABELS[role]}»: доступен просмотр заявок.
        </p>
      )}

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

      {/* ── Administrators (owner only) ── */}
      {mayAdmins && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Администраторы</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Учётные записи и роли. Владелец управляет доступом; администратор ведёт
              расписание и заявки; менеджер только просматривает заявки.
            </p>
          </div>

          <form
            action={createAdminAction}
            className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-5"
          >
            <TextInput name="login" placeholder="Логин" required autoComplete="off" />
            <TextInput name="name" placeholder="Имя" required autoComplete="off" />
            <TextInput
              name="password"
              type="password"
              placeholder="Пароль (от 6)"
              required
              autoComplete="new-password"
            />
            <Select name="role" options={ROLE_OPTIONS} defaultValue="manager" />
            <button type="submit" disabled={!dbReady} className="btn-primary text-sm">
              Добавить
            </button>
          </form>

          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-[var(--surface)] text-left text-[var(--text-secondary)]">
                <tr>
                  <th className="p-3">Логин</th>
                  <th className="p-3">Имя</th>
                  <th className="p-3">Роль</th>
                  <th className="p-3">Новый пароль</th>
                  <th className="p-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {adminList.map((a) => (
                  <tr key={a.id} className="border-t border-[var(--border)] align-middle">
                    <td className="p-3 text-white">
                      {a.login}
                      {a.id === session?.sub && (
                        <span className="ml-2 text-xs text-[var(--text-muted)]">(вы)</span>
                      )}
                    </td>
                    <td className="p-3">{a.name}</td>
                    <td className="p-2">
                      <form action={updateAdminRoleAction} id={`role-${a.id}`} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={a.id} />
                        <Select
                          name="role"
                          form={`role-${a.id}`}
                          options={ROLE_OPTIONS}
                          defaultValue={a.role}
                        />
                        <button type="submit" className="btn-secondary px-3 py-1.5 text-xs">
                          Сохранить
                        </button>
                      </form>
                    </td>
                    <td className="p-2">
                      <form action={resetAdminPasswordAction} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={a.id} />
                        <TextInput
                          name="password"
                          type="password"
                          placeholder="от 6 символов"
                          autoComplete="new-password"
                          className="w-36"
                        />
                        <button type="submit" className="btn-secondary px-3 py-1.5 text-xs">
                          Сбросить
                        </button>
                      </form>
                    </td>
                    <td className="p-2">
                      {a.id !== session?.sub && (
                        <form action={deleteAdminAction}>
                          <input type="hidden" name="id" value={a.id} />
                          <button
                            type="submit"
                            className="rounded-lg border border-[var(--error)]/40 px-3 py-1.5 text-xs text-[var(--error)]"
                          >
                            Удалить
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
