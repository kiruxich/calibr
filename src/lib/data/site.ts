export const SITE = {
  name: "Школа стрелковой подготовки «КАЛИБР»",
  shortName: "КАЛИБР",
  domain: "voskres-calibr.ru",
  tagline:
    "Единственная лицензированная школа стрелковой подготовки в Воскресенске",
  address:
    "Московская область, г.о. Воскресенск, ул. Московская, зд. 23, стр. 1",
  email: "kalibr.school@yandex.ru",
  phones: [
    { label: "Обучение / консультация", value: "+79055032389", display: "+7 (905) 503-23-89" },
    { label: "Услуги тира", value: "+79253777514", display: "+7 (925) 377-75-14" },
    { label: "Дополнительный", value: "+79253444514", display: "+7 (925) 344-45-14" },
  ],
  youtube: "https://www.youtube.com/embed/AQzfHz-DuwQ",
  yandexMapsOrg:
    "https://yandex.ru/maps/org/shkola_strelkovoy_podgotovki_kalibr/240026747872/",
  max: "kalibr_school",
  maxUrl: "https://max.ru/kalibr_school",
  telegram: "kalibr_school",
  rating: { value: 4.9, count: 59 },
  geo: { lat: 55.31556, lng: 38.69556 },
  founded: 2016,
} as const;

export const NAV = [
  { href: "/uslugi", label: "Услуги" },
  { href: "/raspisanie", label: "Расписание" },
  { href: "/tseny", label: "Цены" },
  { href: "/trenazhyor", label: "Тренажёр" },
  { href: "/kontakty", label: "Контакты" },
] as const;

export const FOOTER_NAV = [
  { href: "/uslugi", label: "Услуги" },
  { href: "/raspisanie", label: "Расписание" },
  { href: "/tseny", label: "Цены и калькулятор" },
  { href: "/oplata", label: "Оплата и сертификаты" },
  { href: "/trenazhyor", label: "Тренажёр-тест" },
  { href: "/docs", label: "Сведения об организации" },
  { href: "/cabinet", label: "Личный кабинет" },
  { href: "/kontakty", label: "Контакты" },
] as const;

export const DIRECTIONS = [
  {
    href: "/obuchenie-grazhdan",
    title: "Обучение граждан",
    description: "Лицензия и продление разрешения на оружие",
    icon: "shield",
  },
  {
    href: "/okhranniki",
    title: "Охранники",
    description: "Подготовка и переподготовка ЧОО 4–6 разряд",
    icon: "badge",
  },
  {
    href: "/sektsii",
    title: "Action Air / Секции",
    description: "Детская секция и IPSC для взрослых",
    icon: "target",
  },
  {
    href: "/arenda-tira",
    title: "Аренда тира",
    description: "25-метровая галерея и мишенные установки",
    icon: "building",
  },
] as const;

export const ADVANTAGES = [
  {
    title: "Единственная лицензия в Воскресенске",
    text: "Официальное обучение и аттестация по программам, принимаемым Росгвардией.",
  },
  {
    title: "Профессиональные инструкторы",
    text: "Опытные преподаватели с практической подготовкой в тире 25 м.",
  },
  {
    title: "Современное оборудование",
    text: "Стрелковая галерея, мишенные установки, спортивный инвентарь.",
  },
  {
    title: "Спорт и обучение",
    text: "IPSC, Action Air, детская секция «Меткий выстрел».",
  },
] as const;

export const POPULAR_COURSES = [
  {
    title: "Первоначальное обучение",
    priceFrom: 8500,
    href: "/obuchenie-grazhdan",
    direction: "obuchenie-grazhdan",
  },
  {
    title: "Периодическая проверка",
    priceFrom: 6500,
    href: "/obuchenie-grazhdan",
    direction: "obuchenie-grazhdan",
  },
  {
    title: "Подготовка охранника 4 разряд",
    priceFrom: 12000,
    href: "/okhranniki",
    direction: "okhranniki",
  },
  {
    title: "Секция «Меткий выстрел»",
    priceFrom: 2500,
    href: "/sektsii",
    direction: "sektsii",
  },
] as const;

export const WORK_HOURS = [
  { day: "Понедельник", hours: "10:00 – 16:00" },
  { day: "Вторник", hours: "Методический день" },
  { day: "Среда", hours: "10:00 – 16:00" },
  { day: "Четверг", hours: "10:00 – 17:00" },
  { day: "Пятница", hours: "10:00 – 17:00" },
  { day: "Суббота (2-я, 4-я)", hours: "10:00 – 16:00" },
  { day: "Воскресенье", hours: "Выходной" },
] as const;
