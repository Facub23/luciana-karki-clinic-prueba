import Image from "next/image";
import { CalendarCheck, MessageCircle, ShieldCheck } from "lucide-react";

const heroHighlights = [
  {
    icon: ShieldCheck,
    title: "Valoración médica",
    text: "Antes de indicar cualquier tratamiento.",
  },
  {
    icon: CalendarCheck,
    title: "Plan personalizado",
    text: "Según tu rostro, objetivos y proporciones.",
  },
  {
    icon: MessageCircle,
    title: "Reserva directa",
    text: "Cita rápida por WhatsApp.",
  },
];

export default function Hero() {
  return (
    <section id="inicio" className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <span className="uppercase tracking-[0.24em] text-[#d9a8b5] text-xs sm:text-sm">
            Barcelona · Alicante
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl font-light leading-tight text-[#6b5b63] sm:text-5xl lg:text-7xl">
            Medicina estética con resultados naturales
          </h1>

          <h2 className="mt-5 text-xl text-[#d9a8b5] sm:text-2xl lg:text-3xl">
            Dra. Luciana Karki Martín
          </h2>

          <p className="mt-7 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            Tratamientos faciales y corporales diseñados con valoración médica,
            criterio estético y una prioridad clara: realzar sin transformar tu
            esencia.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="https://wa.me/34644241706"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#d9a8b5] px-8 py-4 text-center font-medium text-white"
            >
              Reservar valoración
            </a>

            <a
              href="#tratamientos"
              className="rounded-full border border-[#d9a8b5] px-8 py-4 text-center font-medium text-[#d9a8b5]"
            >
              Ver tratamientos
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {heroHighlights.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-pink-100 bg-white/80 p-4 shadow-sm"
              >
                <Icon className="h-5 w-5 text-[#d9a8b5]" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-[#6b5b63]">
                  {title}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">{text}</p>
              </div>
            ))}
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
