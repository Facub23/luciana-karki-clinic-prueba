import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminLeadsDashboard from "@/components/AdminLeadsDashboard";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { fetchAdminLeadEvents, fetchAdminLeads } from "@/lib/supabase-leads";

export const metadata: Metadata = {
  title: "Admin leads",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [leads, events] = await Promise.all([
    fetchAdminLeads(),
    fetchAdminLeadEvents(),
  ]);

  return <AdminLeadsDashboard initialLeads={leads} initialEvents={events} />;
}
