import Image from "next/image";
import {
  defaultPromotions,
  type PromotionItem,
} from "@/lib/public-promotions";

type GalleryProps = {
  promotions?: PromotionItem[];
};

export default function Gallery({ promotions = defaultPromotions }: GalleryProps) {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-[#d9a8b5]">
            Especial verano
          </span>

          <h2 className="mt-4 text-4xl font-light text-[#6b5b63] sm:text-5xl">
            Precio exclusivo verano
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {promotions.map((promotion) => (
            <div
              key={promotion.src}
              className="overflow-hidden rounded-[28px] border border-[#ead1d9] bg-[#fffafb] p-3 shadow-[0_18px_50px_rgba(107,91,99,0.12)]"
            >
              <div
                className={`relative overflow-hidden rounded-[22px] bg-white ${
                  promotion.shape === "compact" ? "aspect-square" : "aspect-[9/16]"
                }`}
              >
                <Image
                  src={promotion.src}
                  alt={promotion.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
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
