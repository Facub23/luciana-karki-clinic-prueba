import { getPublicContentValue, PublicSiteContent } from "@/lib/site-content";
import { treatments, type Treatment } from "@/lib/treatments";

type TreatmentOverride = Partial<
  Omit<Treatment, "slug" | "benefits" | "idealFor" | "details">
> & {
  benefits?: string[];
  idealFor?: string[];
  details?: Treatment["details"];
};

const treatmentSlugAliases: Record<string, string> = {
  labios: "labios-acido-hialuronico",
};

function parseTreatmentOverride(value: string, slug: string) {
  if (!value.trim()) {
    return {};
  }

  try {
    return JSON.parse(value) as TreatmentOverride;
  } catch (error) {
    console.error(`Treatment content override is invalid for ${slug}`, error);
    return {};
  }
}

export function serializeTreatmentForAdmin(treatment: Treatment) {
  return JSON.stringify(
    {
      category: treatment.category,
      name: treatment.name,
      oldPrice: treatment.oldPrice ?? "",
      price: treatment.price,
      shortDescription: treatment.shortDescription,
      salesDescription: treatment.salesDescription,
      benefits: treatment.benefits,
      idealFor: treatment.idealFor,
      details: treatment.details ?? {},
      image: treatment.image,
    },
    null,
    2,
  );
}

export function getEditableTreatment(treatment: Treatment, content: PublicSiteContent) {
  const rawOverride = getPublicContentValue(content, "Tratamientos", treatment.slug, "");
  const override = parseTreatmentOverride(rawOverride, treatment.slug);

  return {
    ...treatment,
    ...override,
    slug: treatment.slug,
    benefits: Array.isArray(override.benefits)
      ? override.benefits
      : treatment.benefits,
    idealFor: Array.isArray(override.idealFor)
      ? override.idealFor
      : treatment.idealFor,
    details: {
      ...(treatment.details ?? {}),
      ...(override.details ?? {}),
    },
  };
}

export function getEditableTreatments(content: PublicSiteContent) {
  return treatments.map((treatment) => getEditableTreatment(treatment, content));
}

export function getEditableTreatmentBySlug(
  slug: string,
  content: PublicSiteContent,
) {
  const normalizedSlug = treatmentSlugAliases[slug] ?? slug;
  const treatment = treatments.find((item) => item.slug === normalizedSlug);

  if (!treatment) {
    return undefined;
  }

  return getEditableTreatment(treatment, content);
}

export function getTreatmentContentDefaults() {
  return treatments.map((treatment) => ({
    section: "Tratamientos",
    label: treatment.slug,
    content_type: "json" as const,
    value: serializeTreatmentForAdmin(treatment),
    description: `Contenido editable de ${treatment.name}. Mantén el JSON válido para que se aplique en la web.`,
  }));
}
