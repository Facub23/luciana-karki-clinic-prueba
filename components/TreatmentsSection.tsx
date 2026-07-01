import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { treatments } from "@/lib/treatments";

export default function TreatmentsSection() {
  return (
    <section id="tratamientos" className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <span className="text-sm uppercase tracking-[0.3em] text-[#d9a8b5]">
          Tratamientos
        </span>

        <h2 className="mt-4 text-4xl font-light text-[#6b5b63] sm:text-5xl">
          Elige el tratamiento que quieres valorar
        </h2>

        <p className="mt-6 text-lg text-gray-600">
          Cada página incluye beneficios, precio, ficha técnica y acceso directo
          a WhatsApp para coordinar la valoración.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {treatments.map((treatment) => (
          <article
            key={treatment.slug}
            className="flex min-h-[330px] flex-col rounded-[26px] border border-[#ead1d9] bg-white p-6 shadow-[0_16px_45px_rgba(107,91,99,0.1)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(107,91,99,0.15)]"
          >
            <span className="text-xs uppercase tracking-[0.22em] text-[#c98fa1]">
              {treatment.category}
            </span>

            <h3 className="mt-4 text-2xl font-light text-[#6b5b63]">
              {treatment.name}
            </h3>

            <p className="mt-4 flex-1 text-sm leading-6 text-gray-600">
              {treatment.shortDescription}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {treatment.oldPrice ? (
                <span className="text-gray-400 line-through">
                  {treatment.oldPrice}
                </span>
              ) : null}

              <span className="text-xl font-semibold text-[#c98fa1]">
                {treatment.price}
              </span>
            </div>

            <Link
              href={`/tratamientos/${treatment.slug}`}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-[#d9a8b5] px-5 py-2.5 text-sm font-medium text-[#b9788d] transition hover:bg-[#c98fa1] hover:text-white"
            >
              Ver tratamiento
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
