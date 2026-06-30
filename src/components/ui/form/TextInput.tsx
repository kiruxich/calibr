"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const TextInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function TextInput({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn("input-field", className)}
      {...props}
    />
  );
});
