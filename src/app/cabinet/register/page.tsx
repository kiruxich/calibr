import type { Metadata } from "next";
import Link from "next/link";
import { FieldLabel, PhoneInput, TextInput } from "@/components/ui/form";
import { registerAction } from "../actions";

export const metadata: Metadata = {
  title: "Регистрация",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  name: "Укажите имя (минимум 2 символа).",
  phone: "Введите корректный номер телефона.",
  weak: "Пароль должен быть не короче 6 символов.",
  match: "Пароли не совпадают.",
  exists: "Аккаунт с таким телефоном уже существует.",
  nodb: "Регистрация временно недоступна (база данных не подключена).",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-24">
      <div className="card-surface w-full max-w-sm space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-white">Регистрация</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Создайте аккаунт, чтобы входить по телефону и паролю.
          </p>
        </div>

        {error && ERRORS[error] && (
          <p className="rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
            {ERRORS[error]}
          </p>
        )}

        <form action={registerAction} className="space-y-4">
          <FieldLabel label="Имя" required>
            <TextInput name="name" required placeholder="Как к вам обращаться" />
          </FieldLabel>
          <FieldLabel label="Телефон" required>
            <PhoneInput name="phone" required />
          </FieldLabel>
          <FieldLabel label="Пароль" required>
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
            Зарегистрироваться
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-muted)]">
          Уже есть аккаунт?{" "}
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
