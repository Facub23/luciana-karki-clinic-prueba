import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  createOrUpdateAdminUser,
  listAdminUsers,
  updateAdminUser,
} from "@/lib/supabase-admin-users";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const users = await listAdminUsers();

    return NextResponse.json({ ok: true, users });
  } catch (error) {
    console.error("Admin users fetch failed", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "No se pudieron cargar usuarios",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as {
      email?: string;
      password?: string;
    };
    const email = payload.email?.trim();
    const password = payload.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email y contraseña requeridos" },
        { status: 400 },
      );
    }

    const action = await createOrUpdateAdminUser({ email, password });

    return NextResponse.json({ ok: true, action, email });
  } catch (error) {
    console.error("Admin user setup failed", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "No se pudo crear el usuario",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as {
      id?: string;
      password?: string;
      active?: boolean;
    };

    if (!payload.id) {
      return NextResponse.json(
        { ok: false, error: "Usuario requerido" },
        { status: 400 },
      );
    }

    await updateAdminUser({
      id: payload.id,
      password: payload.password,
      active: payload.active,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin user update failed", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "No se pudo actualizar usuario",
      },
      { status: 500 },
    );
  }
}
