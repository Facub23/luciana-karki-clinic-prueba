import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import BookingProcess from "@/components/BookingProcess";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import LeadForm from "@/components/LeadForm";
import Navbar from "@/components/Navbar";
import TrustSignals from "@/components/TrustSignals";
import WhatsappButton from "@/components/WhatsappButton";
import {
  absoluteUrl,
  clinicName,
  treatmentJsonLd,
  treatmentKeywords,
} from "@/lib/seo";
import { getTreatmentBySlug, treatments } from "@/lib/treatments";

type TreatmentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return treatments.map((treatment) => ({
    slug: treatment.slug,
  }));
}

export async function generateMetadata({
  params,
}: TreatmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const treatment = getTreatmentBySlug(slug);

  if (!treatment) {
    return {};
  }

  const url = absoluteUrl(`/tratamientos/${treatment.slug}`);

  return {
    title: treatment.name,
    description: treatment.shortDescription,
    keywords: treatmentKeywords(treatment.name),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      locale: "es_ES",
      url,
      title: `${treatment.name} | ${clinicName}`,
      description: treatment.shortDescription,
      images: [
        {
          url: absoluteUrl(treatment.image),
          width: 1200,
          height: 1200,
          alt: treatment.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${treatment.name} | ${clinicName}`,
      description: treatment.shortDescription,
      images: [absoluteUrl(treatment.image)],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TreatmentPage({ params }: TreatmentPageProps) {
  const { slug } = await params;
  const treatment = getTreatmentBySlug(slug);

  if (!treatment) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#faf7f8] to-white">
      <JsonLd data={treatmentJsonLd(treatment)} />
      <Navbar />

      <section className="max-w-7xl mx-auto grid gap-12 px-6 py-20 lg:grid-cols-[1fr_420px] lg:items-start">
        <div>
          <Link
            href="/#tratamientos"
            className="text-sm font-medium text-[#d9a8b5]"
          >
            Volver a tratamientos
          </Link>

          <span className="mt-8 block uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
            {treatment.category}
          </span>

          <h1 className="mt-5 text-4xl font-light text-[#6b5b63] sm:text-5xl lg:text-7xl">
            {treatment.name}
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-9 text-gray-600">
            {treatment.salesDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {treatment.oldPrice ? (
              <span className="text-xl text-gray-400 line-through">
                {treatment.oldPrice}
              </span>
            ) : null}

            <span className="text-3xl font-semibold text-[#d9a8b5]">
              {treatment.price}
            </span>
          </div>

          <div className="mt-10 rounded-[32px] bg-white p-8 shadow-sm">
            <span className="uppercase tracking-[0.25em] text-[#d9a8b5] text-xs">
              Enfoque del tratamiento
            </span>
            <h2 className="mt-3 text-3xl font-light text-[#6b5b63]">
              Indicación personalizada, resultado natural
            </h2>
            <p className="mt-5 max-w-3xl leading-8 text-gray-600">
              Antes de tratar se revisa la zona, el objetivo estético y la
              armonía general. Así se define una propuesta proporcionada,
              realista y adaptada a tu caso.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <div className="rounded-[32px] bg-white p-8 shadow-sm">
              <h2 className="text-2xl text-[#6b5b63]">Beneficios</h2>
              <ul className="mt-5 list-disc space-y-3 pl-5 text-gray-600">
                {treatment.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-sm">
              <h2 className="text-2xl text-[#6b5b63]">Ideal para</h2>
              <ul className="mt-5 list-disc space-y-3 pl-5 text-gray-600">
                {treatment.idealFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <section className="mt-14 rounded-[32px] bg-white p-8 shadow-sm">
            <span className="uppercase tracking-[0.25em] text-[#d9a8b5] text-xs">
              Valoración previa
            </span>
            <h2 className="mt-3 text-3xl font-light text-[#6b5b63]">
              Qué revisamos antes de indicar el tratamiento
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Tus objetivos y expectativas",
                "Proporciones y armonía facial o corporal",
                "Plan recomendado, precio y próximos pasos",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#d9a8b5]"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 rounded-[32px] bg-[#6b5b63] p-8 text-white">
            <h2 className="text-3xl font-light">Reserva con una valoración</h2>
            <p className="mt-4 max-w-2xl leading-8 text-white/80">
              Cada tratamiento se indica después de revisar tu caso, tus
              objetivos y tu anatomía. La prioridad es un resultado natural,
              seguro y coherente contigo.
            </p>
          </section>
        </div>

        <div className="lg:sticky lg:top-28">
          <LeadForm compact treatmentName={treatment.name} />
        </div>
      </section>

      <TrustSignals />

      <BookingProcess />

      <FaqSection
        title={`Dudas sobre ${treatment.name}`}
        items={[
          {
            question: `¿Cómo sé si ${treatment.name} es para mí?`,
            answer:
              "La indicación se confirma en valoración, revisando tus objetivos, anatomía y antecedentes relevantes.",
          },
          {
            question: "¿Puedo preguntar antes de reservar?",
            answer:
              "Sí. El formulario abre WhatsApp con tus datos y el tratamiento de interés para resolver dudas y coordinar la cita.",
          },
          {
            question: "¿El resultado busca verse natural?",
            answer:
              "Sí. El enfoque prioriza proporción, armonía y un resultado coherente con tus rasgos.",
          },
        ]}
      />

      <WhatsappButton />
      <Footer />
    </main>
  );
}
