import type { Metadata } from "next";
import Link from "next/link";
import { FieldLabel, PhoneInput, TextInput } from "@/components/ui/form";
import { forgotRequestAction, resetPasswordAction } from "../actions";

export const metadata: Metadata = {
  title: "Восстановление пароля",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  phone: "Введите корректный номер телефона.",
  weak: "Пароль должен быть не короче 6 символов.",
  match: "Пароли не совпадают.",
  invalid: "Неверный код. Попробуйте ещё раз.",
  expired: "Срок действия кода истёк. Запросите новый.",
  too_many: "Слишком много попыток. Запросите новый код.",
  nodb: "Восстановление временно недоступно (база данных не подключена).",
};

export default async function ForgotPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string; phone?: string; error?: string }>;
}) {
  const { step, phone, error } = await searchParams;
  const onResetStep = step === "reset" && phone;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-24">
      <div className="card-surface w-full max-w-sm space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-white">Восстановление пароля</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {onResetStep
              ? `Введите код из СМС, отправленный на +${phone}, и новый пароль.`
              : "Укажите телефон — пришлём код для сброса пароля."}
          </p>
        </div>

        {error && ERRORS[error] && (
          <p className="rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
            {ERRORS[error]}
          </p>
        )}

        {onResetStep ? (
          <form action={resetPasswordAction} className="space-y-4">
            <input type="hidden" name="phone" value={phone} />
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
            <FieldLabel label="Новый пароль" required>
              <TextInput
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Минимум 6 символов"
              />
            </FieldLabel>
            <FieldLabel label="Повторите пароль" required>
              <TextInput
                name="password2"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Ещё раз"
              />
            </FieldLabel>
            <button type="submit" className="btn-primary w-full">
              Сохранить пароль
            </button>
            <Link
              href="/cabinet/forgot"
              className="block text-center text-sm text-[var(--text-muted)] hover:text-white"
            >
              Изменить номер
            </Link>
          </form>
        ) : (
          <form action={forgotRequestAction} className="space-y-4">
            <FieldLabel label="Телефон" required>
              <PhoneInput name="phone" required />
            </FieldLabel>
            <button type="submit" className="btn-primary w-full">
              Получить код
            </button>
          </form>
        )}

        <p className="text-center text-sm text-[var(--text-muted)]">
          Вспомнили пароль?{" "}
          <Link
            href="/cabinet/login"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
