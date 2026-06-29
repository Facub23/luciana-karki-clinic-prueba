import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { treatmentCategories, getTreatmentsByCategory } from "@/lib/treatments";

export default function TreatmentsSection() {
  return (
    <section id="tratamientos" className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <span className="uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
          Tratamientos
        </span>

        <h2 className="mt-4 text-4xl font-light text-[#6b5b63] sm:text-5xl">
          Páginas pensadas para convertir interés en reserva
        </h2>

        <p className="mt-6 text-lg text-gray-600">
          Cada tratamiento tiene su propia página con beneficios, precio,
          preguntas frecuentes y acceso directo a WhatsApp.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {treatmentCategories.map((category) => (
          <div
            key={category}
            className="bg-white rounded-[24px] p-6 shadow-md transition hover:shadow-xl sm:p-8"
          >
            <h3 className="text-2xl text-[#6b5b63] sm:text-3xl">{category}</h3>

            <div className="mt-7 space-y-6">
              {getTreatmentsByCategory(category).map((treatment) => (
                <div
                  key={treatment.slug}
                  className="border-b border-pink-100 pb-6 last:border-b-0 last:pb-0"
                >
                  <h4 className="font-medium text-[#6b5b63]">
                    {treatment.name}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {treatment.shortDescription}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {treatment.oldPrice ? (
                      <span className="text-gray-400 line-through">
                        {treatment.oldPrice}
                      </span>
                    ) : null}

                    <span className="text-xl font-semibold text-[#d9a8b5]">
                      {treatment.price}
                    </span>
                  </div>

                  <Link
                    href={`/tratamientos/${treatment.slug}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d9a8b5] px-5 py-2 text-sm font-medium text-[#d9a8b5] transition hover:bg-[#d9a8b5] hover:text-white"
                  >
                    Ver tratamiento
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
