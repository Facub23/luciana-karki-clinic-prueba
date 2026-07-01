import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AdminLeadDetail from "@/components/AdminLeadDetail";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  fetchAdminLeadById,
  fetchAdminLeadEventsByLeadId,
} from "@/lib/supabase-leads";

export const metadata: Metadata = {
  title: "Detalle lead",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const [lead, events] = await Promise.all([
    fetchAdminLeadById(id),
    fetchAdminLeadEventsByLeadId(id),
  ]);

  if (!lead) {
    notFound();
  }

  return <AdminLeadDetail initialLead={lead} initialEvents={events} />;
}
