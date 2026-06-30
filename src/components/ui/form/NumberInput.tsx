"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const NumberInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function NumberInput({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      type="number"
      className={cn("input-field field-number", className)}
      {...props}
    />
  );
});
