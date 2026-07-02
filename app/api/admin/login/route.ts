import { redirect } from "next/navigation";
import {
  authenticateSupabaseAdmin,
  createAdminSession,
  isValidAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (email) {
    const adminUser = await authenticateSupabaseAdmin({ email, password });

    if (adminUser) {
      await createAdminSession({
        email: adminUser.email,
        provider: "supabase",
      });
      redirect("/admin");
    }
  }

  if (!isValidAdminPassword(password)) {
    redirect("/admin/login?error=1");
  }

  await createAdminSession({ provider: "password" });
  redirect("/admin");
}
