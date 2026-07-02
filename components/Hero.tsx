import Image from "next/image";
import LeadForm from "@/components/LeadForm";
import TrackedAnchor from "@/components/TrackedAnchor";
import {
  getPublicContentValue,
  normalizePhoneForWhatsapp,
  publicContentFallbacks,
  PublicSiteContent,
  whatsappUrlFromPhone,
} from "@/lib/site-content";

type HeroProps = {
  content?: PublicSiteContent;
};

export default function Hero({ content = {} }: HeroProps) {
  const heroTitle = getPublicContentValue(
    content,
    "Inicio",
    "Título principal",
    publicContentFallbacks.heroTitle,
  );
  const heroDoctor = getPublicContentValue(
    content,
    "Inicio",
    "Subtítulo doctora",
    publicContentFallbacks.heroDoctor,
  );
  const heroDescription = getPublicContentValue(
    content,
    "Inicio",
    "Descripción hero",
    publicContentFallbacks.heroDescription,
  );
  const phoneLabel = getPublicContentValue(
    content,
    "Contacto",
    "WhatsApp",
    publicContentFallbacks.whatsapp,
  );
  const whatsappUrl = whatsappUrlFromPhone(phoneLabel);
  const phoneNumber = normalizePhoneForWhatsapp(phoneLabel);

  return (
    <section id="inicio" className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex flex-col">
          <div className="max-w-xl">
            <LeadForm compact phoneNumber={phoneNumber} />
          </div>

          <div className="mt-8 lg:mt-10">
            <span className="text-xs uppercase tracking-[0.24em] text-[#d9a8b5] sm:text-sm">
              Barcelona · Alicante
            </span>

            <h1 className="mt-5 max-w-3xl text-4xl font-light leading-tight text-[#6b5b63] sm:text-5xl lg:text-6xl">
              {heroTitle}
            </h1>

            <h2 className="mt-5 text-xl text-[#d9a8b5] sm:text-2xl">
              {heroDoctor}
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              {heroDescription}
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
                Reservar valoración
              </TrackedAnchor>

              <a
                href="#tratamientos"
                className="rounded-full border border-[#d9a8b5] px-8 py-4 text-center font-medium text-[#d9a8b5]"
              >
                Ver tratamientos
              </a>
            </div>
          </div>
        </div>

        <div className="relative">
          <Image
            src="/images/doctora.jpg"
            alt="Dra. Luciana Karki Martín"
            width={700}
            height={900}
            priority
            className="h-auto w-full rounded-[32px] object-cover shadow-2xl"
          />

          <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur">
            <p className="text-sm font-medium text-[#6b5b63]">
              Medicina estética avanzada
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-600">
              Resultados naturales con atención en Barcelona y Alicante.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
