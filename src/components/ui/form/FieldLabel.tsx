import { cn } from "@/lib/utils";

type Props = {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function FieldLabel({ label, required, className, children }: Props) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-white">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}
