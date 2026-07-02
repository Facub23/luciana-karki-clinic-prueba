import { getPublicContentValue, PublicSiteContent } from "@/lib/site-content";
import { defaultFaqs, type FaqBlockContent } from "@/components/FaqSection";
import { defaultResultsContent, type CardsBlockContent } from "@/components/Results";
import {
  defaultWhyChooseUsContent,
  type IconCardsBlockContent,
} from "@/components/WhyChooseUs";
import { defaultVideoContent, type VideoBlockContent } from "@/components/VideoSection";
import {
  defaultBeforeAfterContent,
  type ImageGalleryBlockContent,
} from "@/components/BeforeAfter";
import {
  defaultBookingContent,
  type BookingBlockContent,
} from "@/components/BookingProcess";
import { defaultAboutContent, type AboutBlockContent } from "@/components/About";

export type EditableHomeBlock =
  | CardsBlockContent
  | IconCardsBlockContent
  | VideoBlockContent
  | ImageGalleryBlockContent
  | BookingBlockContent
  | FaqBlockContent
  | AboutBlockContent;

function parseBlock<T>(value: string, fallback: T) {
  if (!value.trim()) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error("Home content block override is invalid", error);
    return fallback;
  }
}

function getBlock<T>(
  content: PublicSiteContent,
  section: string,
  label: string,
  fallback: T,
) {
  return parseBlock(getPublicContentValue(content, section, label, ""), fallback);
}

export function serializeHomeBlockForAdmin(value: EditableHomeBlock) {
  return JSON.stringify(value, null, 2);
}

export function getEditableHomeContent(content: PublicSiteContent) {
  return {
    results: getBlock(
      content,
      "Home",
      "Filosofía y resultados",
      defaultResultsContent,
    ),
    about: getBlock(content, "Home", "Sobre la doctora", defaultAboutContent),
    whyChooseUs: getBlock(
      content,
      "Home",
      "Excelencia",
      defaultWhyChooseUsContent,
    ),
    videos: getBlock(content, "Home", "Videos", defaultVideoContent),
    beforeAfter: getBlock(
      content,
      "Home",
      "Antes y después",
      defaultBeforeAfterContent,
    ),
    booking: getBlock(content, "Home", "Proceso de reserva", defaultBookingContent),
    faq: getBlock(content, "FAQ", "Preguntas frecuentes", defaultFaqs),
  };
}

export function getHomeContentDefaults() {
  return [
    {
      section: "Home",
      label: "Filosofía y resultados",
      content_type: "json" as const,
      value: serializeHomeBlockForAdmin(defaultResultsContent),
      description: "Título, texto y tarjetas de la sección de filosofía.",
    },
    {
      section: "Home",
      label: "Sobre la doctora",
      content_type: "json" as const,
      value: serializeHomeBlockForAdmin(defaultAboutContent),
      description: "Textos, principios y botón de la sección Sobre la doctora.",
    },
    {
      section: "Home",
      label: "Excelencia",
      content_type: "json" as const,
      value: serializeHomeBlockForAdmin(defaultWhyChooseUsContent),
      description: "Título y tarjetas de la sección de confianza.",
    },
    {
      section: "Home",
      label: "Videos",
      content_type: "json" as const,
      value: serializeHomeBlockForAdmin(defaultVideoContent),
      description: "Videos visibles en la sección En consulta.",
    },
    {
      section: "Home",
      label: "Antes y después",
      content_type: "json" as const,
      value: serializeHomeBlockForAdmin(defaultBeforeAfterContent),
      description: "Imágenes y textos de casos visuales.",
    },
    {
      section: "Home",
      label: "Proceso de reserva",
      content_type: "json" as const,
      value: serializeHomeBlockForAdmin(defaultBookingContent),
      description: "Pasos de cómo reservar.",
    },
    {
      section: "FAQ",
      label: "Preguntas frecuentes",
      content_type: "json" as const,
      value: serializeHomeBlockForAdmin(defaultFaqs),
      description: "Preguntas frecuentes de la home.",
    },
  ];
}
