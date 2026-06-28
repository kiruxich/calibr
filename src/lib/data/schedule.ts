export type ScheduleDirection =
  | "obuchenie-grazhdan"
  | "okhranniki"
  | "sektsii"
  | "arenda";

export interface ScheduleSlot {
  id: string;
  date: string;
  time: string;
  title: string;
  direction: ScheduleDirection;
  spotsLeft: number;
  spotsTotal: number;
}

export const WEEKLY_SCHEDULE = [
  {
    day: "Понедельник",
    time: "10:00–16:00",
    event: "Секция «Меткий выстрел» + консультация",
    direction: "sektsii" as ScheduleDirection,
  },
  {
    day: "Вторник",
    time: "—",
    event: "Методический день",
    direction: "obuchenie-grazhdan" as ScheduleDirection,
  },
  {
    day: "Среда",
    time: "10:00–16:00",
    event: "Секция «Меткий выстрел» + консультация",
    direction: "sektsii" as ScheduleDirection,
  },
  {
    day: "Четверг",
    time: "10:00–17:00",
    event: "Обучение граждан + консультация",
    direction: "obuchenie-grazhdan" as ScheduleDirection,
  },
  {
    day: "Пятница",
    time: "10:00–17:00",
    event: "Аттестация и периодическая проверка",
    direction: "obuchenie-grazhdan" as ScheduleDirection,
  },
  {
    day: "Суббота (2-я, 4-я)",
    time: "10:00–16:00",
    event: "Секция «Калибр» (18+), по записи",
    direction: "sektsii" as ScheduleDirection,
  },
  {
    day: "Воскресенье",
    time: "—",
    event: "Выходной",
    direction: "obuchenie-grazhdan" as ScheduleDirection,
  },
];

export const DIRECTION_LABELS: Record<ScheduleDirection, string> = {
  "obuchenie-grazhdan": "Обучение граждан",
  okhranniki: "Охранники",
  sektsii: "Секции",
  arenda: "Аренда тира",
};

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function generateUpcomingSlots(count = 8): ScheduleSlot[] {
  const base = new Date();
  const templates: Omit<ScheduleSlot, "id" | "date">[] = [
    {
      time: "10:00",
      title: "Обучение граждан — первичное",
      direction: "obuchenie-grazhdan",
      spotsLeft: 4,
      spotsTotal: 8,
    },
    {
      time: "14:00",
      title: "Периодическая проверка",
      direction: "obuchenie-grazhdan",
      spotsLeft: 2,
      spotsTotal: 6,
    },
    {
      time: "10:00",
      title: "Секция «Меткий выстрел»",
      direction: "sektsii",
      spotsLeft: 6,
      spotsTotal: 10,
    },
    {
      time: "12:00",
      title: "Подготовка охранника 5 разряд",
      direction: "okhranniki",
      spotsLeft: 3,
      spotsTotal: 5,
    },
    {
      time: "16:00",
      title: "Аренда галереи 25 м",
      direction: "arenda",
      spotsLeft: 1,
      spotsTotal: 2,
    },
    {
      time: "11:00",
      title: "Секция «Калибр» IPSC",
      direction: "sektsii",
      spotsLeft: 5,
      spotsTotal: 8,
    },
    {
      time: "15:00",
      title: "Консультация по документам",
      direction: "obuchenie-grazhdan",
      spotsLeft: 8,
      spotsTotal: 10,
    },
    {
      time: "13:00",
      title: "Итоговая аттестация",
      direction: "obuchenie-grazhdan",
      spotsLeft: 2,
      spotsTotal: 4,
    },
  ];

  return templates.slice(0, count).map((t, i) => ({
    ...t,
    id: `slot-${i}`,
    date: formatDateISO(addDays(base, i + 1 + (i % 3))),
  }));
}

export const UPCOMING_SLOTS = generateUpcomingSlots();
