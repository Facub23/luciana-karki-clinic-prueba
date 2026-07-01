import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { treatments } from "@/lib/treatments";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [absoluteUrl("/images/doctora.jpg")],
    },
    ...treatments.map((treatment) => ({
      url: absoluteUrl(`/tratamientos/${treatment.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
      images: [absoluteUrl(treatment.image)],
    })),
  ];
}
