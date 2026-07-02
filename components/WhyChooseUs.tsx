export type IconCardsBlockContent = {
  eyebrow: string;
  title: string;
  cards: {
    icon: string;
    title: string;
    text: string;
  }[];
};

export const defaultWhyChooseUsContent: IconCardsBlockContent = {
  eyebrow: "Excelencia",
  title: "¿Por qué elegir a la Dra. Luciana Karki?",
  cards: [
    {
      icon: "✨",
      title: "Resultados Naturales",
      text: "Buscamos potenciar tu belleza respetando siempre tu armonía facial.",
    },
    {
      icon: "💎",
      title: "Atención Personalizada",
      text: "Cada tratamiento se adapta a las características y objetivos de cada paciente.",
    },
    {
      icon: "🌿",
      title: "Técnicas Avanzadas",
      text: "Procedimientos modernos orientados a resultados seguros y elegantes.",
    },
  ],
};

type WhyChooseUsProps = {
  content?: IconCardsBlockContent;
};

export default function WhyChooseUs({
  content = defaultWhyChooseUsContent,
}: WhyChooseUsProps) {
  return (
    <section className="py-24 bg-[#faf7f8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
            {content.eyebrow}
          </span>

          <h2 className="mt-4 text-5xl font-light text-[#6b5b63]">
            {content.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {content.cards.map((card) => (
            <div key={card.title} className="bg-white rounded-[32px] p-8 shadow-sm">
              <div className="text-4xl mb-4">{card.icon}</div>

              <h3 className="text-2xl text-[#6b5b63]">{card.title}</h3>

              <p className="mt-4 text-gray-600 leading-7">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
