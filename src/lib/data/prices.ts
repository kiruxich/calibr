export interface PriceService {
  id: string;
  direction: string;
  name: string;
  basePrice: number;
  unit: "course" | "hour" | "session" | "exam";
  includes: string[];
}

export interface PriceExtra {
  id: string;
  name: string;
  price: number;
}

export const PRICE_SERVICES: PriceService[] = [
  {
    id: "primary-training",
    direction: "obuchenie-grazhdan",
    name: "Первоначальное обучение (лицензия)",
    basePrice: 8500,
    unit: "course",
    includes: ["Теория", "Практика в тире", "Итоговая аттестация", "Документы"],
  },
  {
    id: "renewal-exam",
    direction: "obuchenie-grazhdan",
    name: "Периодическая проверка / продление",
    basePrice: 6500,
    unit: "exam",
    includes: ["Теоретический тест", "Практические упражнения", "Акт проверки"],
  },
  {
    id: "guard-4",
    direction: "okhranniki",
    name: "Подготовка охранника 4 разряд",
    basePrice: 12000,
    unit: "course",
    includes: ["Программа ДПО", "Практика", "Удостоверение"],
  },
  {
    id: "guard-5",
    direction: "okhranniki",
    name: "Подготовка охранника 5 разряд",
    basePrice: 14000,
    unit: "course",
    includes: ["Программа ДПО", "Практика", "Удостоверение"],
  },
  {
    id: "guard-6",
    direction: "okhranniki",
    name: "Подготовка охранника 6 разряд",
    basePrice: 16000,
    unit: "course",
    includes: ["Программа ДПО", "Практика", "Удостоверение"],
  },
  {
    id: "kids-section",
    direction: "sektsii",
    name: "Детская секция «Меткий выстрел»",
    basePrice: 2500,
    unit: "session",
    includes: ["Инструктаж", "Пневматика / Action Air", "Инструктор"],
  },
  {
    id: "ipsc-section",
    direction: "sektsii",
    name: "Секция «Калибр» IPSC (18+)",
    basePrice: 3500,
    unit: "session",
    includes: ["Инструктаж", "Практическая стрельба", "Инструктор"],
  },
  {
    id: "range-rental",
    direction: "arenda",
    name: "Аренда 25-метровой галереи",
    basePrice: 5000,
    unit: "hour",
    includes: ["Галерея", "Мишени", "Инструктор по безопасности"],
  },
];

export const PRICE_EXTRAS: PriceExtra[] = [
  { id: "extra-instructor", name: "Доп. час с инструктором", price: 2000 },
  { id: "extra-ammo", name: "Дополнительный комплект патронов", price: 1500 },
  { id: "extra-cert", name: "Подарочный сертификат (оформление)", price: 500 },
  { id: "extra-power", name: "Замер мощности травматического оружия", price: 1200 },
];

export const DIRECTION_OPTIONS = [
  { value: "obuchenie-grazhdan", label: "Обучение граждан" },
  { value: "okhranniki", label: "Подготовка охранников" },
  { value: "sektsii", label: "Секции и Action Air" },
  { value: "arenda", label: "Аренда тира" },
];

export const PRICE_TABLES = [
  { title: "Обучение граждан", file: "/docs/preiskurant-grazhdane.pdf" },
  { title: "Подготовка охранников", file: "/docs/preiskurant-okhranniki.pdf" },
  { title: "Стрелковые секции", file: "/docs/preiskurant-sektsii.pdf" },
  { title: "Аренда тира", file: "/docs/preiskurant-arenda.pdf" },
  { title: "Дополнительные услуги", file: "/docs/preiskurant-dop.pdf" },
];
