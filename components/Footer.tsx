import Image from "next/image";
import TrackedAnchor from "@/components/TrackedAnchor";
import TrackedLink from "@/components/TrackedLink";
import { treatments } from "@/lib/treatments";

const treatmentColumns = [
  treatments.slice(0, 4),
  treatments.slice(4, 8),
  treatments.slice(8),
];

export default function Footer() {
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

            <h3 className="mt-5 text-xl font-semibold">
              Dra. Luciana Karki Martín
            </h3>

            <p className="mt-4 max-w-sm text-white/80">
              Medicina estética avanzada en Barcelona y Alicante, con valoración
              médica y planes personalizados.
            </p>

            <div className="mt-6 space-y-2 text-white/80">
              <p>+34 644 24 17 06</p>
              <p>Calle Sepúlveda 125</p>
              <p>Barcelona · Alicante</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="https://www.instagram.com/dra.lucianakarkimartin/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                Instagram
              </a>

              <TrackedAnchor
                href="https://wa.me/34644241706"
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

        <div className="mt-12 border-t border-white/20 pt-8 text-center text-white/60">
          © 2026 Dra. Luciana Karki Martín · Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
}
