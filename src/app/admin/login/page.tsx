import type { Metadata } from "next";
import { hasDb } from "@/db";
import { FieldLabel, TextInput } from "@/components/ui/form";
import { loginAction } from "../actions";

export const metadata: Metadata = {
  title: "Вход в админку",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;
  const dbReady = hasDb();
  // With a DB, login goes through admin accounts (seeded from ADMIN_PASSWORD).
  // Without a DB, the single shared ADMIN_PASSWORD is used.
  const hasPassword = dbReady || Boolean(process.env.ADMIN_PASSWORD);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-20">
      <div className="card-surface w-full max-w-sm space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-white">Админка · КАЛИБР</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Управление расписанием и заявками
          </p>
        </div>

        {!hasPassword && (
          <p className="rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
            Не задан <code>ADMIN_PASSWORD</code> — вход недоступен. Добавьте переменную
            окружения и перезапустите.
          </p>
        )}

        {error && (
          <p className="rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
            {error === "rate"
              ? "Слишком много попыток входа. Подождите несколько минут и попробуйте снова."
              : "Неверный логин или пароль."}
          </p>
        )}

        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="from" value={from ?? "/admin"} />
          {dbReady && (
            <FieldLabel label="Логин" required>
              <TextInput
                name="login"
                required
                autoFocus
                autoComplete="username"
                placeholder="Ваш логин"
              />
            </FieldLabel>
          )}
          <FieldLabel label="Пароль" required>
            <TextInput
              name="password"
              type="password"
              required
              autoFocus={!dbReady}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </FieldLabel>
          <button type="submit" disabled={!hasPassword} className="btn-primary w-full">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
