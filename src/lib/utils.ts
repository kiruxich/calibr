import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export function formatPhone(raw: string) {
  return raw.replace(/(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 ($2) $3-$4-$5");
}
