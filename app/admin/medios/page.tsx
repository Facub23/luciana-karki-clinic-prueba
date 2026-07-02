import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminMediaLibrary from "@/components/AdminMediaLibrary";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listMediaAssets } from "@/lib/supabase-storage";

export const metadata: Metadata = {
  title: "Medios admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const assets = await listMediaAssets().catch((error) => {
    console.error("Media assets fetch failed", error);
    return [];
  });

  return <AdminMediaLibrary initialAssets={assets} />;
}
