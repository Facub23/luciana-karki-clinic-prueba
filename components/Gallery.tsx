import Image from "next/image";

const promotions = [
  {
    src: "/images/tratamiento-1.jpeg",
    alt: "Promoción de relleno de labios con ácido hialurónico",
  },
  {
    src: "/images/tratamiento-2.jpeg",
    alt: "Promoción pack anti-age completo",
  },
  {
    src: "/images/tratamiento-3.jpeg",
    alt: "Promoción de medicina estética",
  },
];

export default function Gallery() {
  return (
    <section className="py-20 bg-white lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
            Promociones
          </span>

          <h2 className="mt-4 text-4xl font-light text-[#6b5b63] sm:text-5xl">
            Campañas destacadas
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            Piezas informativas para campañas y redes. Las condiciones finales
            se confirman siempre durante la valoración.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {promotions.map((promotion) => (
            <div
              key={promotion.src}
              className="overflow-hidden rounded-[24px] bg-[#faf7f8] shadow-md"
            >
              <Image
                src={promotion.src}
                alt={promotion.alt}
                width={700}
                height={700}
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
