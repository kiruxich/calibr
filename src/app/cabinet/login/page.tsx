import type { Metadata } from "next";
import Link from "next/link";
import { FieldLabel, PhoneInput, TextInput } from "@/components/ui/form";
import { requestCodeAction, verifyCodeAction } from "../actions";

export const metadata: Metadata = {
  title: "Вход в личный кабинет",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  phone: "Введите корректный номер телефона.",
  nodb: "Кабинет временно недоступен (база данных не подключена).",
  invalid: "Неверный код. Попробуйте ещё раз.",
  expired: "Срок действия кода истёк. Запросите новый.",
  too_many: "Слишком много попыток. Запросите новый код.",
};

export default async function CabinetLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string; phone?: string; error?: string }>;
}) {
  const { step, phone, error } = await searchParams;
  const onCodeStep = step === "code" && phone;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-20">
      <div className="card-surface w-full max-w-sm space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-white">Личный кабинет</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {onCodeStep
              ? `Введите код из СМС, отправленный на +${phone}`
              : "Вход по номеру телефона — пришлём код в СМС"}
          </p>
        </div>

        {error && ERRORS[error] && (
          <p className="rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
            {ERRORS[error]}
          </p>
        )}

        {onCodeStep ? (
          <form action={verifyCodeAction} className="space-y-4">
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
            <button type="submit" className="btn-primary w-full">
              Войти
            </button>
            <Link
              href="/cabinet/login"
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
              Кабинет покажет ваши заявки, расписание и документы. Доступ — по номеру,
              указанному при записи.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
