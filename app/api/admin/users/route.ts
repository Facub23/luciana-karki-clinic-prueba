import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

function getSupabaseAdminConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are not configured");
  }

  return { supabaseUrl, serviceRoleKey };
}

function getAllowedAdminEmails() {
  const rawEmails =
    process.env.ADMIN_ALLOWED_EMAILS || process.env.LEAD_NOTIFICATION_EMAIL_TO || "";

  return rawEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedAdminEmail(email: string) {
  return getAllowedAdminEmails().includes(email.trim().toLowerCase());
}

async function supabaseAuthRequest<T>(path: string, init: RequestInit = {}) {
  const { supabaseUrl, serviceRoleKey } = getSupabaseAdminConfig();
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  const responseText = await response.text();
  const payload = responseText ? (JSON.parse(responseText) as T) : null;

  if (!response.ok) {
    throw new Error(
      `Supabase Auth request failed ${response.status}: ${responseText}`,
    );
  }

  return payload;
}

type SupabaseUser = {
  id: string;
  email?: string;
};

async function findUserByEmail(email: string) {
  for (let page = 1; page <= 10; page += 1) {
    const payload = await supabaseAuthRequest<{ users?: SupabaseUser[] }>(
      `/auth/v1/admin/users?page=${page}&per_page=100`,
    );
    const users = payload?.users ?? [];
    const user = users.find(
      (item) => item.email?.toLowerCase() === email.toLowerCase(),
    );

    if (user) {
      return user;
    }

    if (users.length < 100) {
      return null;
    }
  }

  return null;
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

    if (!isAllowedAdminEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Email no permitido como administrador" },
        { status: 403 },
      );
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      await supabaseAuthRequest(`/auth/v1/admin/users/${existingUser.id}`, {
        method: "PUT",
        body: JSON.stringify({
          email,
          password,
          email_confirm: true,
          user_metadata: { role: "admin", source: "admin-panel" },
          app_metadata: { role: "admin" },
        }),
      });

      return NextResponse.json({ ok: true, action: "updated", email });
    }

    await supabaseAuthRequest("/auth/v1/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: "admin", source: "admin-panel" },
        app_metadata: { role: "admin" },
      }),
    });

    return NextResponse.json({ ok: true, action: "created", email });
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
