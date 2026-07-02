import { getPublicContentValue, PublicSiteContent } from "@/lib/site-content";
import type { FaqBlockContent } from "@/components/FaqSection";

export type FooterContent = {
  brandName: string;
  description: string;
  addressLines: string[];
  instagramUrl: string;
  copyright: string;
};

export type ContactContent = {
  eyebrow: string;
  title: string;
  lines: string[];
  cards: string[];
  ctaLabel: string;
};

export const defaultFooterContent: FooterContent = {
  brandName: "Dra. Luciana Karki Martín",
  description:
    "Medicina estética avanzada en Barcelona y Alicante, con valoración médica y planes personalizados.",
  addressLines: ["Calle Sepúlveda 125", "Barcelona · Alicante"],
  instagramUrl: "https://www.instagram.com/dra.lucianakarkimartin/",
  copyright: "© 2026 Dra. Luciana Karki Martín · Todos los derechos reservados",
};

export const defaultContactContent: ContactContent = {
  eyebrow: "Contacto",
  title: "Agenda una valoración",
  lines: [
    "Calle Sepúlveda 125 · Barcelona",
    "Alicante · Visitas a domicilio",
    "Atención solo con cita previa",
  ],
  cards: [
    "Te respondemos por WhatsApp",
    "Revisamos el tratamiento que te interesa",
    "Coordinamos disponibilidad y valoración",
  ],
  ctaLabel: "Completar formulario",
};

export const defaultTreatmentFaqContent: FaqBlockContent = {
  eyebrow: "Dudas",
  title: "Dudas sobre {treatment}",
  items: [
    {
      question: "¿Cómo sé si {treatment} es para mí?",
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
  ],
};

function parseSetting<T>(value: string, fallback: T) {
  if (!value.trim()) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error("Public site setting override is invalid", error);
    return fallback;
  }
}

function serializeSetting(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function applyTreatmentTemplate(text: string, treatmentName: string) {
  return text.replaceAll("{treatment}", treatmentName);
}

export function getEditableSiteSettings(content: PublicSiteContent) {
  const footer = parseSetting(
    getPublicContentValue(content, "Footer", "Contenido", ""),
    defaultFooterContent,
  );
  const contact = parseSetting(
    getPublicContentValue(content, "Contacto", "Bloque contacto", ""),
    defaultContactContent,
  );
  const treatmentFaq = parseSetting(
    getPublicContentValue(content, "FAQ", "Tratamientos", ""),
    defaultTreatmentFaqContent,
  );

  return { footer, contact, treatmentFaq };
}

export function getSiteSettingsDefaults() {
  return [
    {
      section: "Footer",
      label: "Contenido",
      content_type: "json" as const,
      value: serializeSetting(defaultFooterContent),
      description: "Datos, redes y textos del pie de página.",
    },
    {
      section: "Contacto",
      label: "Bloque contacto",
      content_type: "json" as const,
      value: serializeSetting(defaultContactContent),
      description: "Textos visibles en la sección de contacto de la home.",
    },
    {
      section: "FAQ",
      label: "Tratamientos",
      content_type: "json" as const,
      value: serializeSetting(defaultTreatmentFaqContent),
      description:
        "Preguntas usadas en cada página de tratamiento. Puedes usar {treatment}.",
    },
  ];
}
