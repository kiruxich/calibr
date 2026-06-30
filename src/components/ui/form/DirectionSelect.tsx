import { DIRECTION_LABELS, type ScheduleDirection } from "@/lib/data/schedule";
import { Select } from "./Select";

const OPTIONS = (Object.keys(DIRECTION_LABELS) as ScheduleDirection[]).map((value) => ({
  value,
  label: DIRECTION_LABELS[value],
}));

type Props = {
  name: string;
  defaultValue?: string;
  required?: boolean;
  form?: string;
  className?: string;
  placeholder?: string;
};

export function DirectionSelect({
  name,
  defaultValue = "obuchenie-grazhdan",
  required,
  form,
  className,
  placeholder = "Направление",
}: Props) {
  return (
    <Select
      name={name}
      defaultValue={defaultValue}
      required={required}
      form={form}
      className={className}
      options={OPTIONS}
      placeholder={placeholder}
    />
  );
}
