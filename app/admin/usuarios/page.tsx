import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminUsersManager from "@/components/AdminUsersManager";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listAdminUsers } from "@/lib/supabase-admin-users";

export const metadata: Metadata = {
  title: "Usuarios admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const users = await listAdminUsers().catch((error) => {
    console.error("Admin users fetch failed", error);
    return [];
  });

  return <AdminUsersManager initialUsers={users} />;
}
