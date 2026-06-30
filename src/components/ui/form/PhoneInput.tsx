"use client";

import { forwardRef } from "react";
import { maskPhone } from "@/lib/utils";
import { TextInput } from "./TextInput";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  onChange?: (value: string) => void;
};

export const PhoneInput = forwardRef<HTMLInputElement, Props>(function PhoneInput(
  { className, value, defaultValue, onChange, ...props },
  ref,
) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = maskPhone(e.target.value);
    onChange?.(masked);
  }

  return (
    <TextInput
      ref={ref}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder="+7 (___) ___-__-__"
      className={className}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      {...props}
    />
  );
});
