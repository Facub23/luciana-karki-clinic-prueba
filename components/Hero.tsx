import Image from "next/image";
import LeadForm from "@/components/LeadForm";
import TrackedAnchor from "@/components/TrackedAnchor";

export type HeroContent = {
  eyebrow: string;
  title: string;
  doctor: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  secondaryHref: string;
  image: string;
  imageAlt: string;
  floatingTitle: string;
  floatingText: string;
};

export const defaultHeroContent: HeroContent = {
  eyebrow: "Barcelona · Alicante",
  title: "Medicina estética con resultados naturales",
  doctor: "Dra. Luciana Karki Martín",
  description:
    "Tratamientos faciales y corporales diseñados con valoración médica, criterio estético y una prioridad clara: realzar sin transformar tu esencia.",
  primaryCta: "Reservar valoración",
  secondaryCta: "Ver tratamientos",
  secondaryHref: "#tratamientos",
  image: "/images/doctora.jpg",
  imageAlt: "Dra. Luciana Karki Martín",
  floatingTitle: "Medicina estética avanzada",
  floatingText: "Resultados naturales con atención en Barcelona y Alicante.",
};

type HeroProps = {
  content?: HeroContent;
  whatsappUrl?: string;
  phoneNumber?: string;
};

export default function Hero({
  content = defaultHeroContent,
  whatsappUrl = "https://wa.me/34644241706",
  phoneNumber = "34644241706",
}: HeroProps) {
  return (
    <section id="inicio" className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex flex-col">
          <div className="max-w-xl">
            <LeadForm compact phoneNumber={phoneNumber} />
          </div>

          <div className="mt-8 lg:mt-10">
            <span className="text-xs uppercase tracking-[0.24em] text-[#d9a8b5] sm:text-sm">
              {content.eyebrow}
            </span>

            <h1 className="mt-5 max-w-3xl text-4xl font-light leading-tight text-[#6b5b63] sm:text-5xl lg:text-6xl">
              {content.title}
            </h1>

            <h2 className="mt-5 text-xl text-[#d9a8b5] sm:text-2xl">
              {content.doctor}
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              {content.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <TrackedAnchor
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                eventName="whatsapp_click"
                eventPayload={{ location: "hero_cta" }}
                className="rounded-full bg-[#d9a8b5] px-8 py-4 text-center font-medium text-white"
              >
                {content.primaryCta}
              </TrackedAnchor>

              <a
                href={content.secondaryHref}
                className="rounded-full border border-[#d9a8b5] px-8 py-4 text-center font-medium text-[#d9a8b5]"
              >
                {content.secondaryCta}
              </a>
            </div>
          </div>
        </div>

        <div className="relative">
          <Image
            src={content.image}
            alt={content.imageAlt}
            width={700}
            height={900}
            priority
            className="h-auto w-full rounded-[32px] object-cover shadow-2xl"
          />

          <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur">
            <p className="text-sm font-medium text-[#6b5b63]">
              {content.floatingTitle}
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-600">
              {content.floatingText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
