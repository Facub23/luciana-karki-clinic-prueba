import { getPublicContentValue, PublicSiteContent } from "@/lib/site-content";

export type LegalContent = {
  title: string;
  body: string;
};

export const legalPages = [
  {
    slug: "aviso-legal",
    label: "Aviso legal",
    fallback: {
      title: "Aviso legal",
      body:
        "Contenido legal pendiente de revisión final. Este texto debe validarse con la doctora o asesoría legal antes de publicar la versión definitiva.",
    },
  },
  {
    slug: "politica-privacidad",
    label: "Política de privacidad",
    fallback: {
      title: "Política de privacidad",
      body:
        "Contenido de privacidad pendiente de revisión final. Debe explicar responsable, finalidad, base legal, conservación, destinatarios y derechos de las personas usuarias.",
    },
  },
  {
    slug: "cookies",
    label: "Aviso de cookies",
    fallback: {
      title: "Aviso de cookies",
      body:
        "Contenido de cookies pendiente de revisión final. Debe detallar qué cookies se usan, finalidad, duración y forma de configurar o rechazar cookies.",
    },
  },
] as const;

export type LegalPageSlug = (typeof legalPages)[number]["slug"];

function parseLegal(value: string, fallback: LegalContent) {
  if (!value.trim()) {
    return fallback;
  }

  try {
    return JSON.parse(value) as LegalContent;
  } catch (error) {
    console.error("Legal content override is invalid", error);
    return fallback;
  }
}

export function getEditableLegalContent(
  content: PublicSiteContent,
  slug: LegalPageSlug,
) {
  const page = legalPages.find((item) => item.slug === slug);

  if (!page) {
    return null;
  }

  return parseLegal(
    getPublicContentValue(content, "Legales", page.label, ""),
    page.fallback,
  );
}

export function getLegalContentDefaults() {
  return legalPages.map((page) => ({
    section: "Legales",
    label: page.label,
    content_type: "json" as const,
    value: JSON.stringify(page.fallback, null, 2),
    description: `Contenido editable de ${page.label}. Revisar legalmente antes de publicar definitivo.`,
  }));
}
