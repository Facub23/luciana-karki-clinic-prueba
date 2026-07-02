import Image from "next/image";

export type ImageGalleryBlockContent = {
  eyebrow: string;
  title: string;
  description: string;
  images: {
    src: string;
    alt: string;
  }[];
};

export const defaultBeforeAfterContent: ImageGalleryBlockContent = {
  eyebrow: "Resultados",
  title: "Antes y después",
  description:
    "Casos visuales orientativos. Cada resultado depende de la valoración previa, anatomía y plan de tratamiento.",
  images: [
    { src: "/images/antes-despues-1.jpeg", alt: "Antes y después 1" },
    { src: "/images/antes-despues-2.jpeg", alt: "Antes y después 2" },
    { src: "/images/antes-despues-3.jpeg", alt: "Antes y después 3" },
  ],
};

type BeforeAfterProps = {
  content?: ImageGalleryBlockContent;
};

export default function BeforeAfter({
  content = defaultBeforeAfterContent,
}: BeforeAfterProps) {
  return (
    <section className="py-20 bg-[#faf7f8] lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
            {content.eyebrow}
          </span>

          <h2 className="mt-4 text-4xl font-light text-[#6b5b63] sm:text-5xl">
            {content.title}
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            {content.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {content.images.map((image) => (
            <div
              key={image.src}
              className="overflow-hidden rounded-[24px] bg-white p-3 shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
                <Image
                  src={image.src}
                  alt={image.alt}
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
