export interface Review {
  id: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  source: "Яндекс" | "2ГИС" | "Google";
  text: string;
  program: string;
}

export const REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Алексей М.",
    initials: "АМ",
    rating: 5,
    date: "Май 2026",
    source: "Яндекс",
    text: "Проходил первоначальное обучение для лицензии. Всё чётко за один день: теория, практика в тире, документы оформили сразу. Инструкторы спокойно объясняют, не торопят.",
    program: "Обучение граждан",
  },
  {
    id: "r2",
    author: "Дмитрий К.",
    initials: "ДК",
    rating: 5,
    date: "Апрель 2026",
    source: "2ГИС",
    text: "Готовился на 4 разряд охранника. Подготовка серьёзная, на экзамене не было ни одного вопроса, который не разобрали. Рекомендую.",
    program: "Подготовка охранников",
  },
  {
    id: "r3",
    author: "Ирина С.",
    initials: "ИС",
    rating: 5,
    date: "Апрель 2026",
    source: "Яндекс",
    text: "Отдала сына в детскую секцию «Меткий выстрел». Ребёнок в восторге, дисциплина и безопасность на первом месте. Отдельное спасибо тренеру.",
    program: "Секции",
  },
  {
    id: "r4",
    author: "Сергей В.",
    initials: "СВ",
    rating: 5,
    date: "Март 2026",
    source: "Google",
    text: "Арендовали тир для корпоратива. 25 метров, нормальные мишени, грамотный инструктаж по безопасности. Организовано отлично.",
    program: "Аренда тира",
  },
  {
    id: "r5",
    author: "Наталья П.",
    initials: "НП",
    rating: 5,
    date: "Март 2026",
    source: "Яндекс",
    text: "Продлевала разрешение, периодическая проверка. Записалась онлайн, всё прошло быстро и без нервов. Спасибо за чёткую работу!",
    program: "Обучение граждан",
  },
  {
    id: "r6",
    author: "Павел Р.",
    initials: "ПР",
    rating: 5,
    date: "Февраль 2026",
    source: "2ГИС",
    text: "Хожу в секцию IPSC «Калибр». Реально прокачивает практическую стрельбу, тренер мастер спорта. Атмосфера дружеская.",
    program: "Секции",
  },
];

export interface Instructor {
  id: string;
  name: string;
  initials: string;
  role: string;
  experience: string;
  bio: string;
}

export const INSTRUCTORS: Instructor[] = [
  {
    id: "i1",
    name: "Имя инструктора",
    initials: "—",
    role: "Руководитель, старший инструктор",
    experience: "опыт 15+ лет",
    bio: "Подготовка граждан и охранников, итоговая аттестация. Фото и регалии будут добавлены.",
  },
  {
    id: "i2",
    name: "Имя инструктора",
    initials: "—",
    role: "Инструктор практической стрельбы",
    experience: "опыт 10+ лет",
    bio: "Секция IPSC «Калибр», подготовка спортсменов. Фото и регалии будут добавлены.",
  },
  {
    id: "i3",
    name: "Имя инструктора",
    initials: "—",
    role: "Тренер детской секции",
    experience: "опыт 8+ лет",
    bio: "Секция «Меткий выстрел», Action Air для детей 8–17 лет. Фото и регалии будут добавлены.",
  },
];

export interface GalleryItem {
  id: string;
  caption: string;
}

export const GALLERY: GalleryItem[] = [
  { id: "g1", caption: "Стрелковая галерея 25 м" },
  { id: "g2", caption: "Учебный класс" },
  { id: "g3", caption: "Мишенные установки" },
  { id: "g4", caption: "Занятие в секции" },
  { id: "g5", caption: "Практическая стрельба" },
  { id: "g6", caption: "Детская секция" },
];

export interface Promo {
  id: string;
  title: string;
  text: string;
  badge: string;
}

export const PROMOS: Promo[] = [
  {
    id: "p1",
    title: "Подарочный сертификат на стрельбу",
    text: "Оформите сертификат на занятие в тире — отличный подарок. Номинал на выбор.",
    badge: "Хит",
  },
  {
    id: "p2",
    title: "Скидка 10% при записи группой",
    text: "Записывайтесь компанией от 4 человек на обучение или аренду тира и получите скидку.",
    badge: "−10%",
  },
];
