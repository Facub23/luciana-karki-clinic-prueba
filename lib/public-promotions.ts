import { getPublicContentValue, PublicSiteContent } from "@/lib/site-content";

export type PromotionItem = {
  src: string;
  alt: string;
  shape: "compact" | "tall";
};

export const defaultPromotions: PromotionItem[] = [
  {
    src: "/images/tratamiento-1.jpeg",
    alt: "Promoción de relleno de labios con ácido hialurónico",
    shape: "compact",
  },
  {
    src: "/images/tratamiento-2.jpeg",
    alt: "Promoción pack anti-age completo",
    shape: "compact",
  },
  {
    src: "/images/tratamiento-3.jpeg",
    alt: "Promoción de medicina estética",
    shape: "tall",
  },
  {
    src: "/images/tratamiento-4.png",
    alt: "Promoción peeling axilas y zona íntima",
    shape: "tall",
  },
];

function isPromotionItem(item: unknown): item is PromotionItem {
  if (!item || typeof item !== "object") {
    return false;
  }

  const promotion = item as Partial<PromotionItem>;

  return (
    typeof promotion.src === "string" &&
    typeof promotion.alt === "string" &&
    (promotion.shape === "compact" || promotion.shape === "tall")
  );
}

export function serializePromotionsForAdmin() {
  return JSON.stringify(defaultPromotions, null, 2);
}

export function getEditablePromotions(content: PublicSiteContent) {
  const rawPromotions = getPublicContentValue(
    content,
    "Promociones",
    "Galería",
    "",
  );

  if (!rawPromotions.trim()) {
    return defaultPromotions;
  }

  try {
    const parsed = JSON.parse(rawPromotions) as unknown;

    if (Array.isArray(parsed) && parsed.every(isPromotionItem)) {
      return parsed;
    }
  } catch (error) {
    console.error("Promotions content override is invalid", error);
  }

  return defaultPromotions;
}

export function getPromotionContentDefaults() {
  return [
    {
      section: "Promociones",
      label: "Galería",
      content_type: "json" as const,
      value: serializePromotionsForAdmin(),
      description:
        "Listado editable de promociones. Usa src, alt y shape compact/tall.",
    },
  ];
}
