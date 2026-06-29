# Школа стрелковой подготовки «КАЛИБР» — сайт

Сайт лицензированной школы стрелковой подготовки «КАЛИБР» (Воскресенск): обучение
граждан и охранников, аттестация, спортивные секции, аренда тира, онлайн-запись,
калькулятор стоимости и интерактивный тренажёр-тест.

Премиальная тёмная тема, 3D-сцена на GPU (React Three Fiber / WebGPU с откатом на
WebGL), полный набор SEO-разметки и версия для слабовидящих.

---

## Содержание

- [Стек](#стек)
- [Быстрый старт](#быстрый-старт)
- [Скрипты](#скрипты)
- [Структура проекта](#структура-проекта)
- [Страницы и маршруты](#страницы-и-маршруты)
- [Слой данных](#слой-данных)
- [Ключевые компоненты](#ключевые-компоненты)
- [API онлайн-записи](#api-онлайн-записи)
- [3D-сцена](#3d-сцена)
- [SEO](#seo)
- [Доступность (a11y)](#доступность-a11y)
- [Стилизация и тема](#стилизация-и-тема)
- [Cookies](#cookies)
- [Точки кастомизации](#точки-кастомизации)
- [Деплой](#деплой)

---

## Стек

| Технология | Назначение |
| --- | --- |
| **Next.js 16** (App Router) | Фреймворк, серверный рендеринг, маршрутизация |
| **React 19** + **TypeScript 5** | UI и типизация |
| **Tailwind CSS v4** | Стилизация (через `@import "tailwindcss"` и `@theme`) |
| **React Three Fiber 9 / three 0.185** | 3D-сцена героя (WebGPU → WebGL fallback) |
| **@react-three/drei** | Хелперы для 3D |
| **lucide-react** | Иконки |
| **clsx / tailwind-merge / cva** | Утилиты для классов |

> Важно: это Next.js 16. API и соглашения могут отличаться от более ранних версий —
> при правках ориентируйтесь на актуальные доки в `node_modules/next/dist/docs/`.

---

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

---

## Скрипты

```bash
npm run dev     # дев-сервер (по умолчанию :3000)
npm run build   # продакшн-сборка
npm start       # запуск собранного приложения
npm run lint    # ESLint
```

---

## Структура проекта

```
src/
├── app/                      # App Router: страницы, API, метаданные
│   ├── layout.tsx            # корневой layout, шрифты, метаданные
│   ├── globals.css           # глобальные стили, тема, утилитарные классы
│   ├── page.tsx              # главная
│   ├── manifest.ts           # PWA-манифест
│   ├── opengraph-image.tsx   # динамическая OG-картинка
│   ├── robots.ts             # robots.txt
│   ├── sitemap.ts            # sitemap.xml
│   ├── api/booking/route.ts  # POST онлайн-записи
│   ├── uslugi/               # хаб услуг
│   ├── obuchenie-grazhdan/   # услуга: обучение граждан
│   ├── okhranniki/           # услуга: подготовка охранников
│   ├── sektsii/              # спортивные секции
│   ├── arenda-tira/          # аренда тира
│   ├── tseny/                # цены + калькулятор
│   ├── raspisanie/           # расписание + календарь записи
│   ├── trenazhyor/           # тренажёр-тест
│   ├── kontakty/             # контакты + FAQ
│   ├── oplata/               # онлайн-оплата (заглушка)
│   ├── privacy/              # политика конфиденциальности
│   └── docs/                 # справочные разделы (13 шт.)
│       ├── page.tsx          # список разделов
│       └── [slug]/page.tsx   # отдельный раздел
│
├── components/
│   ├── layout/               # Header, Footer, SiteLayout, FloatingContact, CookieBanner
│   ├── sections/             # секции главной и сервисных страниц
│   ├── booking/              # BookingForm, CallbackForm, BookingCalendar
│   ├── calculator/           # PriceCalculator
│   ├── test/                 # TestTrainer
│   ├── three/                # ShopifyHeroScene, LazyThree
│   ├── seo/                  # JsonLd (Schema.org)
│   ├── templates/            # ServicePageTemplate
│   └── a11y/                 # A11yProvider (версия для слабовидящих)
│
└── lib/
    ├── data/                 # контент и данные
    │   ├── site.ts           # реквизиты, навигация, контакты, гео, рейтинг
    │   ├── prices.ts         # цены и тарифы
    │   ├── schedule.ts       # слоты расписания
    │   ├── marketing.ts      # отзывы, инструкторы, галерея, акции (заглушки)
    │   ├── docs.ts           # разделы справки и FAQ
    │   └── test-questions.ts # вопросы тренажёра
    └── utils.ts              # утилиты (cn, maskPhone, …)
```

Данные онлайн-записи пишутся в `data/bookings.json` (создаётся при первой записи).

---

## Страницы и маршруты

| Маршрут | Описание |
| --- | --- |
| `/` | Главная: 3D-герой, направления, отзывы, инструкторы, галерея, акции |
| `/uslugi` | Хаб всех услуг с якорями и CTA |
| `/obuchenie-grazhdan` | Обучение граждан (лицензия/продление) |
| `/okhranniki` | Подготовка и проверка охранников |
| `/sektsii` | Спортивные секции (IPSC, Action Air) |
| `/arenda-tira` | Аренда тира 25 м |
| `/tseny` | Цены + интерактивный калькулятор |
| `/raspisanie` | Расписание + календарь записи |
| `/trenazhyor` | Тренажёр-тест (тренировка / экзамен) |
| `/kontakty` | Контакты, карта, формы, FAQ |
| `/oplata` | Онлайн-оплата и подарочные сертификаты (заглушка) |
| `/privacy` | Политика конфиденциальности |
| `/docs`, `/docs/[slug]` | Справочные разделы (13 шт.) |

---

## Слой данных

Весь контент вынесен в `src/lib/data/*` — UI читает данные оттуда, что упрощает
редактирование без правки разметки.

- **`site.ts`** — название, домен, телефоны, e-mail, адрес, мессенджеры
  (`max`/`maxUrl`, `telegram`), навигация (`NAV`, `FOOTER_NAV`), `geo` (lat/lng),
  `rating` (значение/кол-во), год основания. Используется и в Schema.org.
- **`prices.ts`** — тарифы для калькулятора и таблиц цен.
- **`schedule.ts`** — слоты для расписания и календаря записи.
- **`marketing.ts`** — отзывы, инструкторы, галерея, акции (сейчас заглушки —
  замените на реальные данные/фото).
- **`docs.ts`** — `DOC_SECTIONS` и `FAQ_ITEMS`.
- **`test-questions.ts`** — вопросы для тренажёра.

---

## Ключевые компоненты

- **`layout/SiteLayout.tsx`** — оборачивает страницы: фон-эффекты, Header, Footer,
  плавающая кнопка контактов, плашка cookies, версия для слабовидящих.
- **`layout/Header.tsx`** — плоское меню из 5 пунктов.
- **`layout/FloatingContact.tsx`** — плавающая кнопка (MAX / Telegram / телефон),
  появляется после прокрутки.
- **`layout/CookieBanner.tsx`** — баннер согласия на cookies (см. ниже).
- **`booking/BookingForm.tsx`** / **`CallbackForm.tsx`** — формы с маской телефона
  (`+7 (XXX) XXX-XX-XX`) и согласием на обработку ПДн.
- **`booking/BookingCalendar.tsx`** — месячный календарь с выбором дня и слотов.
- **`calculator/PriceCalculator.tsx`** — калькулятор с кастомным UI и анимацией
  итоговой суммы.
- **`test/TestTrainer.tsx`** — тренажёр в режимах «тренировка»/«экзамен».
- **`three/ShopifyHeroScene.tsx`** — 3D-сцена героя (см. ниже).
- **`seo/JsonLd.tsx`** — `LocalBusinessJsonLd`, `FaqJsonLd`, `CourseJsonLd`,
  `BreadcrumbJsonLd`.

---

## API онлайн-записи

`POST /api/booking` (`src/app/api/booking/route.ts`) — единый эндпоинт для записи
и обратного звонка.

- Тело запроса содержит `type: "booking" | "callback"`:
  - `booking` — требуются имя, телефон, email, направление, слот, согласие;
  - `callback` — требуются только имя, телефон, согласие.
- Заявка сохраняется в `data/bookings.json` (best-effort) **и** отправляется в
  уведомления (см. ниже). На serverless-хостинге файловая запись эфемерна —
  источником истины служат уведомления.
- Форма записи (`BookingForm`) предзаполняется из query-параметров ссылки:
  `?service=<направление>&slot=<id слота>&program=<id программы>` — так работают
  кнопки «Записаться» с расписания, калькулятора и страниц услуг.

### Переменные окружения

См. `.env.example`. Все необязательны — без них функция просто отключается.

| Переменная | Назначение |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` | Уведомления о заявках в Telegram |
| `BOOKING_WEBHOOK_URL` | POST JSON заявки во внешний сервис (CRM, Make, n8n) |
| `NEXT_PUBLIC_YM_ID` | ID счётчика Яндекс.Метрики (грузится только после согласия) |

---

## 3D-сцена

`components/three/ShopifyHeroScene.tsx` рендерит сцену героя на GPU:

- **WebGPU** через `WebGPURenderer` с **откатом на WebGL** на неподдерживаемых
  устройствах.
- Подсвеченные автомат и патрон, цикл выстрела (отдача, дульная вспышка), анимация
  патрона.
- Загружается лениво через `LazyThree.tsx` (`next/dynamic`, `ssr: false`), чтобы не
  блокировать первичный рендер.

При правках следите за бюджетом кадра: тяжёлые материалы/освещение и частые ререндеры
вызывают подвисания на слабых GPU.

---

## SEO

- **Метаданные** — в `app/layout.tsx` и на каждой странице (`title`, `description`,
  `canonical`, OpenGraph, Twitter, robots).
- **`opengraph-image.tsx`** — динамическая OG-картинка (статическая генерация).
- **`manifest.ts`** — PWA-манифест.
- **`sitemap.ts`** / **`robots.ts`** — карта сайта и правила обхода.
- **Schema.org JSON-LD** (`components/seo/JsonLd.tsx`): LocalBusiness,
  Course, FAQPage, BreadcrumbList. FAQ-разметка размещена на странице, где FAQ виден
  пользователю (`/kontakty`), согласно требованиям Google.
- Коды подтверждения Яндекс.Вебмастер / Google Search Console добавьте в
  `metadata.verification` в `app/layout.tsx`.

---

## Доступность (a11y)

`components/a11y/A11yProvider.tsx` даёт версию для слабовидящих:

- увеличенный шрифт (`html.a11y`),
- режим высокой контрастности (`html.a11y-high-contrast`),
- учёт `prefers-reduced-motion` (длинные анимации отключаются).

---

## Стилизация и тема

- **Tailwind CSS v4** подключён через `@import "tailwindcss"` в `globals.css`.
- Тема задаётся CSS-переменными в `:root` (палитра, акцент `--accent`, поверхности,
  границы, текст) и пробрасывается в Tailwind через `@theme inline`.
- **Шрифты:** заголовки — `Unbounded` (`--font-display`), текст — `Manrope`
  (`--font-manrope`); подключены в `app/layout.tsx` через `next/font/google` с
  кириллицей.
- Готовые утилитарные классы: `.container-page`, `.section-label`, `.section-title`,
  `.section-subtitle`, `.btn-primary`, `.btn-secondary`, `.card-surface`,
  `.card-premium`, фон-эффекты `.bg-fx` / `.bg-grain`.

---

## Cookies

`components/layout/CookieBanner.tsx`:

- Показывается, пока пользователь не сделал выбор.
- Кнопки «Принять» / «Только необходимые».
- Выбор сохраняется в `localStorage` под ключом **`calibr-cookie-consent`**
  (`accepted` | `rejected`); при повторных визитах баннер скрыт.
- Рендерится только после монтирования — без мерцания при гидратации.
- При выборе диспатчится событие `calibr-consent`, на которое реагирует
  аналитика (`components/analytics/Analytics.tsx`): Яндекс.Метрика грузится
  **только** после согласия (и при заданном `NEXT_PUBLIC_YM_ID`), сразу без
  перезагрузки страницы.

---

## Точки кастомизации

| Что менять | Где |
| --- | --- |
| Контакты, реквизиты, навигация, гео, рейтинг | `src/lib/data/site.ts` |
| Цены и тарифы | `src/lib/data/prices.ts` |
| Расписание / слоты | `src/lib/data/schedule.ts` |
| Отзывы, инструкторы, галерея, акции | `src/lib/data/marketing.ts` |
| Справка и FAQ | `src/lib/data/docs.ts` |
| Вопросы тренажёра | `src/lib/data/test-questions.ts` |
| Палитра и шрифты | `src/app/globals.css`, `src/app/layout.tsx` |
| Приём заявок (хранилище/CRM) | `src/app/api/booking/route.ts` |

---

## Деплой

```bash
npm run build
npm start
```

Проект готов к деплою на Vercel (рекомендуется) или любую платформу с поддержкой
Node.js. Перед публикацией:

1. Укажите реальный домен в `src/lib/data/site.ts` и `metadataBase`.
2. Замените заглушки в `marketing.ts` на реальные данные и фотографии.
3. Добавьте коды верификации поисковиков в `metadata.verification`.
4. Подключите реальное хранилище заявок вместо `data/bookings.json`.
