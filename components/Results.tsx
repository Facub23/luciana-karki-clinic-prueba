export type CardsBlockContent = {
  eyebrow: string;
  title: string;
  description: string;
  cards: {
    title: string;
    text: string;
  }[];
};

export const defaultResultsContent: CardsBlockContent = {
  eyebrow: "Filosofía",
  title: "Resultados Naturales",
  description:
    "Cada tratamiento busca realzar tu belleza natural respetando la armonía facial y corporal.",
  cards: [
    {
      title: "Armonización Facial",
      text: "Diseñamos tratamientos personalizados para conseguir equilibrio, proporción y naturalidad.",
    },
    {
      title: "Tratamientos Personalizados",
      text: "Cada paciente recibe una valoración individualizada para obtener el mejor resultado posible.",
    },
    {
      title: "Tecnología Avanzada",
      text: "Técnicas modernas orientadas a resultados seguros y duraderos.",
    },
    {
      title: "Belleza Natural",
      text: "Nuestro objetivo es potenciar tu belleza sin alterar tu esencia.",
    },
  ],
};

type ResultsProps = {
  content?: CardsBlockContent;
};

export default function Results({ content = defaultResultsContent }: ResultsProps) {
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <span className="uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
            {content.eyebrow}
          </span>

          <h2 className="mt-4 text-5xl font-light text-[#6b5b63]">
            {content.title}
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {content.cards.map((card) => (
            <div key={card.title} className="bg-[#faf7f8] rounded-[32px] p-8">
              <h3 className="text-2xl text-[#6b5b63]">{card.title}</h3>

              <p className="mt-4 text-gray-600 leading-8">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
