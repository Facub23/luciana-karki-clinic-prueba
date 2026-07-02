export type PublicSiteContentRecord = {
  id: string;
  section: string;
  label: string;
  content_type: "text" | "textarea" | "url" | "json";
  value: string;
  description: string | null;
};

export type PublicSiteContent = Record<string, string>;

export const publicContentFallbacks = {
  heroTitle: "Medicina estética con resultados naturales",
  heroDoctor: "Dra. Luciana Karki Martín",
  heroDescription:
    "Tratamientos faciales y corporales diseñados con valoración médica, criterio estético y una prioridad clara: realzar sin transformar tu esencia.",
  whatsapp: "+34 644 24 17 06",
  seoTitle: "Dra. Luciana Karki Martín | Medicina Estética",
  seoDescription:
    "Medicina estética avanzada, tratamientos faciales y corporales personalizados en Barcelona y Alicante.",
};

function contentKey(section: string, label: string) {
  return `${section.trim().toLowerCase()}::${label.trim().toLowerCase()}`;
}

function getSupabaseReadConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !key) {
    return null;
  }

  return { supabaseUrl, key };
}

export function normalizePhoneForWhatsapp(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("00")) {
    return digits.slice(2);
  }

  return digits;
}

export function whatsappUrlFromPhone(phone: string) {
  const normalized = normalizePhoneForWhatsapp(phone);
  return normalized ? `https://wa.me/${normalized}` : "https://wa.me/34644241706";
}

export function phoneLabelFromContent(content: PublicSiteContent) {
  return getPublicContentValue(content, "Contacto", "WhatsApp", publicContentFallbacks.whatsapp);
}

export function getPublicContentValue(
  content: PublicSiteContent,
  section: string,
  label: string,
  fallback = "",
) {
  return content[contentKey(section, label)]?.trim() || fallback;
}

export async function getPublicSiteContent(): Promise<PublicSiteContent> {
  const config = getSupabaseReadConfig();

  if (!config) {
    return {};
  }

  try {
    const response = await fetch(
      `${config.supabaseUrl}/rest/v1/site_content?select=id,section,label,content_type,value,description`,
      {
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error("Public site content fetch failed", await response.text());
      return {};
    }

    const records = (await response.json()) as PublicSiteContentRecord[];

    return records
      .filter((record) => !record.section.startsWith("__"))
      .reduce<PublicSiteContent>((acc, record) => {
        acc[contentKey(record.section, record.label)] = record.value;
        return acc;
      }, {});
  } catch (error) {
    console.error("Public site content fetch failed", error);
    return {};
  }
}
