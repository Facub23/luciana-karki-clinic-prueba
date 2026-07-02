import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Acceso admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f3f5] px-6 py-12 text-[#473a42]">
      <section className="w-full max-w-md rounded-lg border border-[#ead1d9] bg-white p-8 shadow-[0_24px_70px_rgba(107,91,99,0.14)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7dfe7] text-[#a8697e]">
          <LockKeyhole className="h-5 w-5" aria-hidden="true" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-[#5f4d56]">
          Panel privado
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Acceso reservado para gestionar consultas, contenido, reservas y
          biblioteca de medios.
        </p>

        <form action="/api/admin/login" method="post" className="mt-6">
          <label className="block">
            <span className="text-sm font-medium text-[#5f4d56]">
              Email administrador
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-[#ead1d9] bg-[#fffafb] px-4 py-3 text-[#4f4149] outline-none transition placeholder:text-[#9d828d] focus:border-[#c98fa1] focus:bg-white focus:ring-4 focus:ring-[#efd8df]"
              placeholder="admin@clinica.com"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-[#5f4d56]">
              Contraseña
            </span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-[#ead1d9] bg-[#fffafb] px-4 py-3 text-[#4f4149] outline-none transition placeholder:text-[#9d828d] focus:border-[#c98fa1] focus:bg-white focus:ring-4 focus:ring-[#efd8df]"
              placeholder="Introduce la contraseña"
            />
          </label>

          {error ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              Acceso incorrecto. Revisa email y contraseña.
            </p>
          ) : null}

          <p className="mt-3 text-xs leading-5 text-gray-500">
            Si todavía no hay usuario de Supabase Auth, puedes dejar el email
            vacío y usar la contraseña temporal del admin.
          </p>

          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-[#c98fa1] px-5 py-3 font-semibold text-white shadow-[0_14px_30px_rgba(201,143,161,0.28)] transition hover:bg-[#bd7f93]"
          >
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
