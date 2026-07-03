import Link from "next/link";
import type { Metadata } from "next";
import {
  CalendarDays,
  CheckCircle2,
  Droplets,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
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
  breadcrumbJsonLd,
  clinicName,
  faqJsonLd,
  treatmentPageJsonLd,
  treatmentJsonLd,
  treatmentKeywords,
} from "@/lib/seo";
import {
  getEditableTreatmentBySlug,
  getEditableTreatments,
} from "@/lib/public-treatments";
import {
  applyTreatmentTemplate,
  getEditableSiteSettings,
} from "@/lib/public-site-settings";
import {
  getPublicSiteContent,
  normalizePhoneForWhatsapp,
  phoneLabelFromContent,
  whatsappUrlFromPhone,
} from "@/lib/site-content";
import {
  treatments,
  type Treatment,
  type TreatmentDetails,
} from "@/lib/treatments";

type TreatmentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

function getPageDetails(treatment: Treatment): TreatmentDetails {
  const isBody = treatment.category.includes("Corporales");
  const isBiostimulator = treatment.category.includes("Bioestimuladores");

  const defaultDetails: TreatmentDetails = {
    duration: isBody ? "45-60 min aprox." : "30-45 min aprox.",
    technique: isBiostimulator
      ? "Bioestimulación médica con protocolo personalizado"
      : isBody
        ? "Plan corporal médico-estético adaptado a la zona"
        : "Técnica inyectable o médico-estética según valoración",
    comfort:
      "Molestia mínima. Se trabaja con una pauta pensada para que la experiencia sea tranquila.",
    recovery:
      "Habitualmente inmediata, con indicaciones sencillas para las primeras horas.",
    results: isBiostimulator
      ? "Progresivos, con mejora gradual de calidad de piel"
      : "Naturales y adaptados a la anatomía de cada paciente",
    effectDuration:
      "Variable según tratamiento, metabolismo, hábitos y cuidados posteriores",
    sessions: "Se define en consulta según objetivo y respuesta individual",
    contribution:
      "Ayuda a mejorar proporción, calidad de piel o armonía de la zona tratada sin buscar cambios artificiales.",
    care:
      "Evitar manipular la zona, calor intenso, ejercicio fuerte y exposición solar directa durante las primeras 24-48 h, salvo indicación específica.",
    precautions:
      "La indicación se confirma en valoración médica. Se revisan antecedentes, zona a tratar y expectativas antes de realizar cualquier procedimiento.",
  };

  return {
    ...defaultDetails,
    ...treatment.details,
  };
}

export function generateStaticParams() {
  return treatments.map((treatment) => ({
    slug: treatment.slug,
  }));
}

export async function generateMetadata({
  params,
}: TreatmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getPublicSiteContent();
  const treatment = getEditableTreatmentBySlug(slug, content);

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
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function TreatmentPage({ params }: TreatmentPageProps) {
  const { slug } = await params;
  const content = await getPublicSiteContent();
  const treatment = getEditableTreatmentBySlug(slug, content);

  if (!treatment) {
    notFound();
  }

  const phoneLabel = phoneLabelFromContent(content);
  const whatsappUrl = whatsappUrlFromPhone(phoneLabel);
  const phoneNumber = normalizePhoneForWhatsapp(phoneLabel);
  const siteSettings = getEditableSiteSettings(content);
  const treatmentPageContent = siteSettings.treatmentPage;
  const editableTreatments = getEditableTreatments(content);
  const treatmentFaqContent = {
    ...siteSettings.treatmentFaq,
    title: applyTreatmentTemplate(siteSettings.treatmentFaq.title, treatment.name),
    items: siteSettings.treatmentFaq.items.map((item) => ({
      question: applyTreatmentTemplate(item.question, treatment.name),
      answer: applyTreatmentTemplate(item.answer, treatment.name),
    })),
  };
  const pageDetails = getPageDetails(treatment);
  const detailItems = [
    { label: "Duración", value: pageDetails.duration, icon: Timer },
    { label: "Técnica", value: pageDetails.technique, icon: Droplets },
    { label: "Confort", value: pageDetails.comfort, icon: ShieldCheck },
    { label: "Recuperación", value: pageDetails.recovery, icon: CheckCircle2 },
    { label: "Resultados", value: pageDetails.results, icon: Sparkles },
    {
      label: "Duración del efecto",
      value: pageDetails.effectDuration,
      icon: Sparkles,
    },
    { label: "Sesiones", value: pageDetails.sessions, icon: CalendarDays },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#faf7f8] to-white">
      <JsonLd data={treatmentJsonLd(treatment)} />
      <JsonLd data={treatmentPageJsonLd(treatment)} />
      <JsonLd data={faqJsonLd(treatmentFaqContent.items)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: absoluteUrl("/") },
          { name: "Tratamientos", url: absoluteUrl("/#tratamientos") },
          {
            name: treatment.name,
            url: absoluteUrl(`/tratamientos/${treatment.slug}`),
          },
        ])}
      />
      <Navbar whatsappUrl={whatsappUrl} content={siteSettings.navbar} />

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
              {treatmentPageContent.approach.eyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-light text-[#6b5b63]">
              {treatmentPageContent.approach.title}
            </h2>
            <p className="mt-5 max-w-3xl leading-8 text-gray-600">
              {treatmentPageContent.approach.description}
            </p>
          </div>

          <section className="mt-10 overflow-hidden rounded-[34px] border border-[#ead1d9] bg-white shadow-[0_22px_70px_rgba(107,91,99,0.12)]">
              <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                <div className="bg-[#fffafb] p-8 sm:p-10">
                  <span className="text-xs uppercase tracking-[0.28em] text-[#c98fa1]">
                    {treatmentPageContent.protocol.eyebrow}
                  </span>

                  <h2 className="mt-4 text-3xl font-light text-[#6b5b63] sm:text-4xl">
                    {treatmentPageContent.protocol.title}
                  </h2>

                  <p className="mt-5 leading-8 text-gray-600">
                    {pageDetails.contribution}
                  </p>

                  <div className="mt-8 grid gap-4">
                    <div className="rounded-2xl border border-[#ead1d9] bg-white p-5">
                      <h3 className="font-medium text-[#6b5b63]">
                        {treatmentPageContent.protocol.careTitle}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {pageDetails.care}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#ead1d9] bg-white p-5">
                      <h3 className="font-medium text-[#6b5b63]">
                        {treatmentPageContent.protocol.precautionsTitle}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {pageDetails.precautions}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="grid gap-4">
                    {detailItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.label}
                          className="flex gap-4 rounded-2xl border border-[#ead1d9] bg-[#fffafb] p-4"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c98fa1] text-white">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>

                          <p className="leading-7 text-gray-600">
                            <span className="font-semibold text-[#6b5b63]">
                              {item.label}:
                            </span>{" "}
                            {item.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

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
              {treatmentPageContent.assessment.eyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-light text-[#6b5b63]">
              {treatmentPageContent.assessment.title}
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {treatmentPageContent.assessment.items.map((item) => (
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
            <h2 className="text-3xl font-light">
              {treatmentPageContent.closing.title}
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-white/80">
              {treatmentPageContent.closing.description}
            </p>
          </section>
        </div>

        <div className="lg:sticky lg:top-28">
          <LeadForm
            compact
            treatmentName={treatment.name}
            phoneNumber={phoneNumber}
          />
        </div>
      </section>

      <TrustSignals content={siteSettings.trustSignals} />

      <BookingProcess />

      <FaqSection content={treatmentFaqContent} />

      <WhatsappButton whatsappUrl={whatsappUrl} />
      <Footer
        phoneLabel={phoneLabel}
        whatsappUrl={whatsappUrl}
        content={siteSettings.footer}
        treatments={editableTreatments}
      />
    </main>
  );
}
