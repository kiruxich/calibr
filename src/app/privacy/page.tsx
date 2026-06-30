import type { Metadata } from "next";
import { SITE } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика обработки персональных данных школы «КАЛИБР».",
};

export default function PrivacyPage() {
  return (
    <section className="container-page pb-16 pt-28 sm:pb-20 sm:pt-32">
      <h1 className="section-title">Политика конфиденциальности</h1>
      <div className="prose-content mt-8 max-w-3xl">
        <p>
          Настоящая политика определяет порядок обработки и защиты персональных данных
          пользователей сайта {SITE.domain} в соответствии с Федеральным законом № 152-ФЗ «О
          персональных данных».
        </p>
        <h2 className="text-xl font-bold">1. Оператор</h2>
        <p>{SITE.name}, адрес: {SITE.address}, email: {SITE.email}.</p>
        <h2 className="text-xl font-bold">2. Какие данные собираем</h2>
        <p>
          ФИО, телефон, email и иные данные, добровольно указанные в формах записи и обратной
          связи.
        </p>
        <h2 className="text-xl font-bold">3. Цели обработки</h2>
        <p>
          Запись на занятия, консультации, информирование об услугах, исполнение договоров
          образовательных услуг.
        </p>
        <h2 className="text-xl font-bold">4. Хранение</h2>
        <p>
          Данные хранятся на серверах на территории Российской Федерации. Срок хранения — до 3
          лет с момента последнего обращения или по требованию законодательства.
        </p>
        <h2 className="text-xl font-bold">5. Права субъекта</h2>
        <p>
          Вы вправе запросить уточнение, блокирование или удаление персональных данных, направив
          запрос на {SITE.email}.
        </p>
      </div>
    </section>
  );
}
