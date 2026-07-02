export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqBlockContent = {
  eyebrow: string;
  title: string;
  items: FaqItem[];
};

export const defaultFaqs: FaqBlockContent = {
  eyebrow: "Dudas",
  title: "Preguntas frecuentes",
  items: [
    {
      question: "¿La valoración es necesaria antes del tratamiento?",
      answer:
        "Sí. La valoración permite confirmar si el tratamiento es adecuado, resolver dudas y diseñar un plan personalizado.",
    },
    {
      question: "¿Puedo reservar directamente por WhatsApp?",
      answer:
        "Sí. El formulario prepara un mensaje para WhatsApp y desde ahí se coordina la cita según disponibilidad.",
    },
    {
      question: "¿Dónde se realizan las consultas?",
      answer:
        "La atención se realiza en Barcelona y Alicante. En Alicante también se contemplan visitas a domicilio según el caso.",
    },
    {
      question: "¿Los resultados son naturales?",
      answer:
        "El enfoque prioriza armonía, proporción y resultados coherentes con la anatomía de cada paciente.",
    },
  ],
};

type FaqSectionProps = {
  items?: FaqItem[];
  title?: string;
  content?: FaqBlockContent;
};

export default function FaqSection({
  items,
  title,
  content = defaultFaqs,
}: FaqSectionProps) {
  const visibleTitle = title ?? content.title;
  const visibleItems = items ?? content.items;

  return (
    <section className="bg-white py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center">
          <span className="uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
            {content.eyebrow}
          </span>
          <h2 className="mt-4 text-4xl font-light text-[#6b5b63]">
            {visibleTitle}
          </h2>
        </div>

        <div className="mt-12 divide-y divide-pink-100 rounded-[32px] border border-pink-100 bg-[#faf7f8] px-6">
          {visibleItems.map((item) => (
            <div key={item.question} className="py-6">
              <h3 className="text-lg font-medium text-[#6b5b63]">
                {item.question}
              </h3>
              <p className="mt-3 leading-7 text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
