import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminContentManager from "@/components/AdminContentManager";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPromotionContentDefaults } from "@/lib/public-promotions";
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
    ...getTreatmentContentDefaults(),
    ...getPromotionContentDefaults(),
  ]);

  const content = await fetchSiteContent().catch(() => []);

  return <AdminContentManager initialContent={content} />;
}
