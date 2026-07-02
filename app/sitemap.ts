import type { MetadataRoute } from "next";
import { absoluteUrl, defaultSeoImage } from "@/lib/seo";
import { treatments } from "@/lib/treatments";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [absoluteUrl(defaultSeoImage)],
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
