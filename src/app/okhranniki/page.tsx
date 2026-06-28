import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Подготовка охранников",
  description: "Профессиональная подготовка и переподготовка частных охранников 4–6 разряд.",
};

export default function Page() {
  return (
    <ServicePageTemplate
      title="Профессиональная подготовка охранников"
      subtitle="Подготовка и переподготовка сотрудников ЧОО и ЧОП"
      direction="okhranniki"
      description={[
        "Программы дополнительного профессионального образования для лиц, осуществляющих частную охранную деятельность.",
        "Подготовка проводится квалифицированными инструкторами с практикой в тире.",
      ]}
      programs={[
        {
          title: "Программы",
          items: [
            "Подготовка на 4-й разряд",
            "Подготовка на 5-й разряд",
            "Подготовка на 6-й разряд",
            "Повышение квалификации охранников",
            "Повышение квалификации руководителей ЧОО",
            "Подготовка для ОХРР",
          ],
        },
      ]}
      checklist={[
        "Паспорт гражданина РФ",
        "Документ об образовании",
        "Медицинская справка",
        "Фотографии установленного формата",
      ]}
      documents={[
        { name: "Заявление охранник (DOCX)", href: "/docs/zayavlenie-okhrannik.docx" },
        { name: "Договор (PDF)", href: "/docs/dogovor-okhrannik.pdf" },
      ]}
    />
  );
}
