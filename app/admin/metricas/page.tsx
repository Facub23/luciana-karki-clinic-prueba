import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminMetricsDashboard from "@/components/AdminMetricsDashboard";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { fetchAdminLeads, fetchReservations } from "@/lib/supabase-leads";

export const metadata: Metadata = {
  title: "Métricas admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminMetricsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [leads, reservations] = await Promise.all([
    fetchAdminLeads(),
    fetchReservations().catch(() => []),
  ]);

  return <AdminMetricsDashboard leads={leads} reservations={reservations} />;
}
