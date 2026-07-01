import { treatments } from "@/lib/treatments";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.dralucianakarki.com";

export const clinicName = "Dra. Luciana Karki Martín";
export const clinicTitle = "Dra. Luciana Karki Martín | Medicina Estética";
export const clinicDescription =
  "Medicina estética avanzada, tratamientos faciales y corporales personalizados en Barcelona y Alicante.";
export const clinicPhone = "+34 644 24 17 06";
export const whatsappUrl = "https://wa.me/34644241706";
export const instagramUrl =
  "https://www.instagram.com/dra.lucianakarkimartin/";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

export const homeKeywords = [
  "medicina estética Barcelona",
  "medicina estética Alicante",
  "armonización facial",
  "ácido hialurónico Barcelona",
  "rinomodelación Barcelona",
  "neuromoduladores Barcelona",
  "Sculptra",
  "Dra Luciana Karki Martín",
];

export function treatmentKeywords(treatmentName: string) {
  return [
    treatmentName,
    `${treatmentName} Barcelona`,
    `${treatmentName} Alicante`,
    "medicina estética",
    "armonización facial",
    "valoración médica estética",
  ];
}

export function clinicJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": absoluteUrl("/#clinic"),
    name: clinicName,
    url: absoluteUrl("/"),
    description: clinicDescription,
    telephone: clinicPhone,
    image: absoluteUrl("/images/doctora.jpg"),
    sameAs: [instagramUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle Sepúlveda 125",
      addressLocality: "Barcelona",
      addressCountry: "ES",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Barcelona",
      },
      {
        "@type": "City",
        name: "Alicante",
      },
    ],
    medicalSpecialty: "AestheticMedicine",
    availableService: treatments.map((treatment) => ({
      "@type": "MedicalProcedure",
      name: treatment.name,
      description: treatment.shortDescription,
      url: absoluteUrl(`/tratamientos/${treatment.slug}`),
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: clinicTitle,
    url: absoluteUrl("/"),
    inLanguage: "es-ES",
    publisher: {
      "@id": absoluteUrl("/#clinic"),
    },
  };
}

export function treatmentJsonLd(treatment: {
  slug: string;
  name: string;
  shortDescription: string;
  price: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": absoluteUrl(`/tratamientos/${treatment.slug}#procedure`),
    name: treatment.name,
    description: treatment.shortDescription,
    url: absoluteUrl(`/tratamientos/${treatment.slug}`),
    provider: {
      "@id": absoluteUrl("/#clinic"),
    },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "EUR",
        description: treatment.price,
      },
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/tratamientos/${treatment.slug}`),
    },
  };
}
