"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
};

type BaseProps = {
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  form?: string;
  required?: boolean;
  disabled?: boolean;
};

type ControlledProps = BaseProps & {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  defaultValue?: never;
};

type UncontrolledProps = BaseProps & {
  name: string;
  defaultValue?: string;
  value?: never;
  onChange?: never;
};

export type SelectProps = ControlledProps | UncontrolledProps;

export function Select(props: SelectProps) {
  const {
    options,
    placeholder = "Выберите…",
    className,
    form,
    required,
    disabled,
    name,
  } = props;

  const controlled = "value" in props && props.value !== undefined;
  const [internal, setInternal] = useState(
    controlled ? props.value : (props.defaultValue ?? ""),
  );
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const value = controlled ? props.value : internal;

  useEffect(() => {
    if (controlled) return;
    if ("defaultValue" in props && props.defaultValue !== undefined) {
      setInternal(props.defaultValue);
    }
  }, [controlled, props]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const selected = options.find((o) => o.value === value);

  function pick(next: string) {
    if (!controlled) setInternal(next);
    if (controlled) props.onChange(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={cn("field-select", className)}>
      {name && (
        <input
          type="hidden"
          name={name}
          value={value}
          form={form}
          required={required}
        />
      )}
      <button
        type="button"
        disabled={disabled}
        className={cn(
          "field-select-trigger input-field w-full text-left",
          disabled && "cursor-not-allowed opacity-60",
        )}
        onClick={() => !disabled && setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn("truncate", !selected && "text-[var(--text-muted)]")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[var(--text-muted)] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <ul className="field-select-menu" role="listbox">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={value === opt.value}
                className={cn(
                  "field-select-option",
                  value === opt.value && "field-select-option--active",
                )}
                onClick={() => pick(opt.value)}
              >
                <span className="truncate">{opt.label}</span>
                {value === opt.value && (
                  <Check className="size-4 shrink-0 text-[var(--accent)]" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
