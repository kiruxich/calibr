"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  required?: boolean;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  children: React.ReactNode;
};

export function Checkbox({
  name,
  required,
  defaultChecked,
  checked,
  onChange,
  className,
  children,
}: Props) {
  const controlled = checked !== undefined;

  return (
    <label className={cn("flex cursor-pointer items-start gap-3", className)}>
      <span className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          name={name}
          required={required}
          defaultChecked={defaultChecked}
          checked={controlled ? checked : undefined}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-md border border-[var(--border-light)] bg-[var(--bg-elevated)] transition",
            "peer-focus-visible:border-[var(--accent)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent)]/30",
            "peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)]",
            "[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100",
          )}
          aria-hidden
        >
          <Check className="h-3 w-3 text-[var(--accent-foreground)] transition-opacity" strokeWidth={3} />
        </span>
      </span>
      <span className="text-sm text-[var(--text-secondary)]">{children}</span>
    </label>
  );
}
