import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminContentManager from "@/components/AdminContentManager";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { fetchSiteContent } from "@/lib/supabase-leads";

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

  const content = await fetchSiteContent().catch(() => []);

  return <AdminContentManager initialContent={content} />;
}
