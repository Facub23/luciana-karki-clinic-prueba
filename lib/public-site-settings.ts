import { getPublicContentValue, PublicSiteContent } from "@/lib/site-content";
import type { FaqBlockContent } from "@/components/FaqSection";
import {
  defaultTrustSignalsContent,
  type TrustSignalsContent,
} from "@/components/TrustSignals";

export type NavbarContent = {
  brandShort: string;
  brandFull: string;
  specialty: string;
  ctaMobile: string;
  ctaDesktop: string;
  links: {
    label: string;
    href: string;
  }[];
};

export type LeadFormContent = {
  eyebrow: string;
  title: string;
  description: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  treatmentLabel: string;
  treatmentPlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  errorMessage: string;
  fallbackTreatment: string;
  whatsappIntro: string;
  whatsappTreatmentPrefix: string;
  whatsappNamePrefix: string;
  whatsappPhonePrefix: string;
  whatsappClosing: string;
};

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

export type TreatmentPageContent = {
  approach: {
    eyebrow: string;
    title: string;
    description: string;
  };
  protocol: {
    eyebrow: string;
    title: string;
    careTitle: string;
    precautionsTitle: string;
  };
  assessment: {
    eyebrow: string;
    title: string;
    items: string[];
  };
  closing: {
    title: string;
    description: string;
  };
};

export const defaultNavbarContent: NavbarContent = {
  brandShort: "Dra. Luciana",
  brandFull: "Dra. Luciana Karki Martín",
  specialty: "Medicina estética",
  ctaMobile: "Cita",
  ctaDesktop: "Reservar cita",
  links: [
    { label: "Inicio", href: "/#inicio" },
    { label: "Tratamientos", href: "/#tratamientos" },
    { label: "Sobre mí", href: "/#sobre" },
    { label: "Contacto", href: "/#contacto" },
  ],
};

export const defaultLeadFormContent: LeadFormContent = {
  eyebrow: "Valoración",
  title: "Reserva tu consulta",
  description:
    "Completa tus datos y abre WhatsApp con el mensaje listo para reservar.",
  nameLabel: "Nombre",
  namePlaceholder: "Tu nombre",
  phoneLabel: "Teléfono",
  phonePlaceholder: "+34...",
  treatmentLabel: "Tratamiento",
  treatmentPlaceholder: "Tratamiento que te interesa",
  submitLabel: "Enviar por WhatsApp",
  submittingLabel: "Guardando...",
  successMessage: "Solicitud registrada. Se abrirá WhatsApp para continuar.",
  errorMessage:
    "WhatsApp se abrirá igual. Revisaremos la conexión del registro luego.",
  fallbackTreatment: "una valoración",
  whatsappIntro:
    "Hola, quiero solicitar una valoración médica con la Dra. Luciana Karki Martín.",
  whatsappTreatmentPrefix: "Me interesa:",
  whatsappNamePrefix: "Nombre:",
  whatsappPhonePrefix: "Teléfono:",
  whatsappClosing: "Quedo pendiente para coordinar disponibilidad. Gracias.",
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

export const defaultTreatmentPageContent: TreatmentPageContent = {
  approach: {
    eyebrow: "Enfoque del tratamiento",
    title: "Indicación personalizada, resultado natural",
    description:
      "Antes de tratar se revisa la zona, el objetivo estético y la armonía general. Así se define una propuesta proporcionada, realista y adaptada a tu caso.",
  },
  protocol: {
    eyebrow: "Protocolo personalizado",
    title: "Un plan diseñado para tu caso",
    careTitle: "Cuidados posteriores",
    precautionsTitle: "Precauciones",
  },
  assessment: {
    eyebrow: "Valoración previa",
    title: "Qué revisamos antes de indicar el tratamiento",
    items: [
      "Tus objetivos y expectativas",
      "Proporciones y armonía facial o corporal",
      "Plan recomendado, precio y próximos pasos",
    ],
  },
  closing: {
    title: "Reserva con una valoración",
    description:
      "Cada tratamiento se indica después de revisar tu caso, tus objetivos y tu anatomía. La prioridad es un resultado natural, seguro y coherente contigo.",
  },
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
  const navbar = parseSetting(
    getPublicContentValue(content, "Global", "Navegación principal", ""),
    defaultNavbarContent,
  );
  const leadForm = parseSetting(
    getPublicContentValue(content, "Global", "Formulario de leads", ""),
    defaultLeadFormContent,
  );
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
  const trustSignals = parseSetting(
    getPublicContentValue(content, "Global", "Confianza tratamientos", ""),
    defaultTrustSignalsContent,
  );
  const treatmentPage = parseSetting(
    getPublicContentValue(content, "Global", "Páginas de tratamiento", ""),
    defaultTreatmentPageContent,
  );

  return {
    navbar,
    leadForm,
    footer,
    contact,
    treatmentFaq,
    trustSignals,
    treatmentPage,
  };
}

export function getSiteSettingsDefaults() {
  return [
    {
      section: "Global",
      label: "Navegación principal",
      content_type: "json" as const,
      value: serializeSetting(defaultNavbarContent),
      description: "Marca, enlaces y botón principal del menú superior.",
    },
    {
      section: "Global",
      label: "Formulario de leads",
      content_type: "json" as const,
      value: serializeSetting(defaultLeadFormContent),
      description:
        "Textos del formulario y plantilla del mensaje automático de WhatsApp.",
    },
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
    {
      section: "Global",
      label: "Confianza tratamientos",
      content_type: "json" as const,
      value: serializeSetting(defaultTrustSignalsContent satisfies TrustSignalsContent),
      description:
        "Tarjetas de confianza visibles en las páginas de tratamiento.",
    },
    {
      section: "Global",
      label: "Páginas de tratamiento",
      content_type: "json" as const,
      value: serializeSetting(defaultTreatmentPageContent),
      description:
        "Textos globales usados dentro de todas las páginas de tratamiento.",
    },
  ];
}
