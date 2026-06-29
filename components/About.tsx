import { CheckCircle2 } from "lucide-react";

const principles = [
  "Valoración individual antes de indicar cualquier tratamiento",
  "Resultados naturales, proporcionados y coherentes con cada rostro",
  "Atención en Barcelona y Alicante con cita previa",
];

export default function About() {
  return (
    <section id="sobre" className="py-20 bg-white lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <span className="uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
              Sobre la doctora
            </span>

            <h2 className="mt-4 text-4xl font-light leading-tight text-[#6b5b63] sm:text-5xl">
              Un enfoque médico, estético y personalizado
            </h2>
          </div>

          <div className="rounded-[32px] bg-[#faf7f8] p-7 sm:p-10">
            <p className="text-lg leading-8 text-gray-600">
              La Dra. Luciana Karki Martín trabaja la medicina estética desde
              una mirada integral: escuchar el objetivo de cada paciente,
              evaluar proporciones y proponer tratamientos que realcen sin
              cambiar la esencia.
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Cada plan empieza con una valoración para definir qué técnica,
              cantidad y ritmo son adecuados. La prioridad es que el resultado
              se vea armónico, seguro y natural.
            </p>

            <div className="mt-8 space-y-4">
              {principles.map((principle) => (
                <div key={principle} className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 h-5 w-5 shrink-0 text-[#d9a8b5]"
                    aria-hidden="true"
                  />
                  <p className="leading-7 text-gray-600">{principle}</p>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/34644241706"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex rounded-full bg-[#d9a8b5] px-8 py-4 font-medium text-white transition hover:opacity-90"
            >
              Solicitar valoración
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
