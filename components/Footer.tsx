import Image from "next/image";
import TrackedAnchor from "@/components/TrackedAnchor";
import TrackedLink from "@/components/TrackedLink";
import {
  defaultFooterContent,
  type FooterContent,
} from "@/lib/public-site-settings";
import { treatments as defaultTreatments, type Treatment } from "@/lib/treatments";

type FooterProps = {
  phoneLabel?: string;
  whatsappUrl?: string;
  content?: FooterContent;
  treatments?: Treatment[];
};

export default function Footer({
  phoneLabel = "+34 644 24 17 06",
  whatsappUrl = "https://wa.me/34644241706",
  content = defaultFooterContent,
  treatments = defaultTreatments,
}: FooterProps) {
  const treatmentColumns = [
    treatments.slice(0, 4),
    treatments.slice(4, 8),
    treatments.slice(8),
  ];

  return (
    <footer className="mt-24 bg-[#6b5b63] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_2fr]">
          <div>
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/95 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Logo Dra. Luciana Karki"
                  width={52}
                  height={52}
                  className="h-12 w-12 object-contain"
                />
              </span>
            </div>

            <h3 className="mt-5 text-xl font-semibold">{content.brandName}</h3>

            <p className="mt-4 max-w-sm text-white/80">{content.description}</p>

            <div className="mt-6 space-y-2 text-white/80">
              <p>{phoneLabel}</p>
              {content.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={content.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                Instagram
              </a>

              <TrackedAnchor
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                eventName="whatsapp_click"
                eventPayload={{ location: "footer_link" }}
                className="text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                WhatsApp
              </TrackedAnchor>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Tratamientos</h3>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {treatmentColumns.map((column, index) => (
                <ul key={index} className="space-y-3">
                  {column.map((treatment) => (
                    <li key={treatment.slug}>
                      <TrackedLink
                        href={`/tratamientos/${treatment.slug}`}
                        eventName="treatment_interest"
                        eventPayload={{
                          treatment: treatment.name,
                          slug: treatment.slug,
                          location: "footer",
                        }}
                        className="text-sm leading-6 text-white/80 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {treatment.name}
                      </TrackedLink>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/20 pt-8 text-center text-white/60 lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <p>{content.copyright}</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm lg:justify-end">
            <TrackedLink
              href="/cookies"
              eventName="footer_legal_click"
              eventPayload={{ location: "footer", page: "cookies" }}
              className="underline-offset-4 hover:text-white hover:underline"
            >
              Aviso de cookies
            </TrackedLink>
            <TrackedLink
              href="/politica-privacidad"
              eventName="footer_legal_click"
              eventPayload={{ location: "footer", page: "privacy" }}
              className="underline-offset-4 hover:text-white hover:underline"
            >
              Política de privacidad
            </TrackedLink>
            <TrackedLink
              href="/aviso-legal"
              eventName="footer_legal_click"
              eventPayload={{ location: "footer", page: "legal" }}
              className="underline-offset-4 hover:text-white hover:underline"
            >
              Aviso legal
            </TrackedLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
