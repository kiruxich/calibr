import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Аренда тира",
  description: "Аренда 25-метровой стрелковой галереи и мишенных установок в Воскресенске.",
};

export default function Page() {
  return (
    <ServicePageTemplate
      title="Аренда 25-метровой стрелковой галереи"
      subtitle="Для частных лиц, спортсmenов и корпоративных мероприятий"
      direction="arenda"
      description={[
        "25-метровая стрелковая галерея доступна для аренды по предварительной записи.",
        "В стоимость входит инструктаж по безопасности, работа инструктора и мишени.",
      ]}
      programs={[
        {
          title: "Услуги",
          items: [
            "Аренда стрелковой галереи 25 м",
            "Аренда мишенных установок и направлений",
            "Подарочные сертификаты",
            "Замер мощности травматического оружия",
            "Проверка боя длинноствольного гладкоствольного оружия",
          ],
        },
      ]}
      checklist={[
        "Паспорт гражданина РФ",
        "Разрешение на оружие (при использовании личного оружия)",
        "Справка 002-О/у",
      ]}
      documents={[
        { name: "Прейскурант аренды (PDF)", href: "/docs/preiskurant-arenda.pdf" },
      ]}
    />
  );
}
