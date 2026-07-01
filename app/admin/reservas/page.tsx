import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminReservationsCalendar from "@/components/AdminReservationsCalendar";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { fetchAdminLeads, fetchReservations } from "@/lib/supabase-leads";

export const metadata: Metadata = {
  title: "Reservas admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [reservations, leads] = await Promise.all([
    fetchReservations().catch(() => []),
    fetchAdminLeads(),
  ]);

  return <AdminReservationsCalendar initialReservations={reservations} leads={leads} />;
}
