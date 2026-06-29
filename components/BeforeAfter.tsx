import Image from "next/image";

const results = [
  "/images/antes-despues-1.jpeg",
  "/images/antes-despues-2.jpeg",
  "/images/antes-despues-3.jpeg",
];

export default function BeforeAfter() {
  return (
    <section className="py-20 bg-[#faf7f8] lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
            Resultados
          </span>

          <h2 className="mt-4 text-4xl font-light text-[#6b5b63] sm:text-5xl">
            Antes y después
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            Casos visuales orientativos. Cada resultado depende de la valoración
            previa, anatomía y plan de tratamiento.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {results.map((src, index) => (
            <div
              key={src}
              className="overflow-hidden rounded-[24px] bg-white p-3 shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
                <Image
                  src={src}
                  alt={`Antes y después ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
