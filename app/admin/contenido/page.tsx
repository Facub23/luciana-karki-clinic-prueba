import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminContentManager from "@/components/AdminContentManager";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getLegalContentDefaults } from "@/lib/public-legal-content";
import { getHomeContentDefaults } from "@/lib/public-home-content";
import { getPromotionContentDefaults } from "@/lib/public-promotions";
import { getSiteSettingsDefaults } from "@/lib/public-site-settings";
import { getTreatmentContentDefaults } from "@/lib/public-treatments";
import { ensureSiteContentDefaults, fetchSiteContent } from "@/lib/supabase-leads";

export const metadata: Metadata = {
  title: "Contenido admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  await ensureSiteContentDefaults([
    ...getHomeContentDefaults(),
    ...getLegalContentDefaults(),
    ...getSiteSettingsDefaults(),
    ...getTreatmentContentDefaults(),
    ...getPromotionContentDefaults(),
  ]);

  const content = await fetchSiteContent().catch(() => []);

  return <AdminContentManager initialContent={content} />;
}
