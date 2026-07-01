import type { Metadata } from "next";
import Link from "next/link";
import { FieldLabel, PhoneInput, TextInput } from "@/components/ui/form";
import {
  passwordLoginAction,
  requestCodeAction,
  verifyCodeAction,
} from "../actions";

export const metadata: Metadata = {
  title: "Вход в личный кабинет",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  phone: "Введите корректный номер телефона.",
  creds: "Неверный телефон или пароль.",
  nodb: "Кабинет временно недоступен (база данных не подключена).",
  invalid: "Неверный код. Попробуйте ещё раз.",
  expired: "Срок действия кода истёк. Запросите новый.",
  too_many: "Слишком много попыток. Запросите новый код.",
};

export default async function CabinetLoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    method?: string;
    step?: string;
    phone?: string;
    error?: string;
  }>;
}) {
  const { method, step, phone, error } = await searchParams;
  const activeMethod = method === "sms" ? "sms" : "password";
  const onCodeStep = activeMethod === "sms" && step === "code" && phone;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-24">
      <div className="card-surface w-full max-w-sm space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-white">Личный кабинет</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Войдите, чтобы видеть свои заявки, расписание и документы.
          </p>
        </div>

        {/* Переключатель способа входа */}
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
          <Link
            href="/cabinet/login?method=password"
            className={`rounded-lg px-3 py-2 text-center text-sm font-medium transition ${
              activeMethod === "password"
                ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            По паролю
          </Link>
          <Link
            href="/cabinet/login?method=sms"
            className={`rounded-lg px-3 py-2 text-center text-sm font-medium transition ${
              activeMethod === "sms"
                ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            По СМС-коду
          </Link>
        </div>

        {error && ERRORS[error] && (
          <p className="rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
            {ERRORS[error]}
          </p>
        )}

        {activeMethod === "password" && (
          <form action={passwordLoginAction} className="space-y-4">
            <FieldLabel label="Телефон" required>
              <PhoneInput name="phone" required />
            </FieldLabel>
            <FieldLabel label="Пароль" required>
              <TextInput
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Ваш пароль"
              />
            </FieldLabel>
            <button type="submit" className="btn-primary w-full">
              Войти
            </button>
            <div className="flex items-center justify-between text-sm">
              <Link
                href="/cabinet/forgot"
                className="text-[var(--text-muted)] hover:text-white"
              >
                Забыли пароль?
              </Link>
              <Link
                href="/cabinet/register"
                className="font-medium text-[var(--accent)] hover:underline"
              >
                Регистрация
              </Link>
            </div>
          </form>
        )}

        {activeMethod === "sms" &&
          (onCodeStep ? (
            <form action={verifyCodeAction} className="space-y-4">
              <input type="hidden" name="phone" value={phone} />
              <p className="text-sm text-[var(--text-secondary)]">
                Введите код из СМС, отправленный на +{phone}
              </p>
              <FieldLabel label="Код из СМС" required>
                <TextInput
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={4}
                  required
                  autoFocus
                  placeholder="0000"
                />
              </FieldLabel>
              <button type="submit" className="btn-primary w-full">
                Войти
              </button>
              <Link
                href="/cabinet/login?method=sms"
                className="block text-center text-sm text-[var(--text-muted)] hover:text-white"
              >
                Изменить номер
              </Link>
            </form>
          ) : (
            <form action={requestCodeAction} className="space-y-4">
              <FieldLabel label="Телефон" required>
                <PhoneInput name="phone" required />
              </FieldLabel>
              <button type="submit" className="btn-primary w-full">
                Получить код
              </button>
              <p className="text-xs text-[var(--text-muted)]">
                Пришлём код подтверждения на номер, указанный при записи.
              </p>
            </form>
          ))}
      </div>
    </div>
  );
}
