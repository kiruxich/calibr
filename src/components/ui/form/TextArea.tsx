"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextArea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn("input-field resize-y min-h-[96px]", className)}
      {...props}
    />
  );
});
