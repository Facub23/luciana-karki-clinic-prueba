import { isAllowedAdminEmail } from "@/lib/admin-auth";

function getSupabaseAdminConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are not configured");
  }

  return { supabaseUrl, serviceRoleKey };
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
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string | null;
  banned_until?: string | null;
  app_metadata?: {
    role?: string;
  };
};

async function listUsers() {
  const collectedUsers: SupabaseUser[] = [];

  for (let page = 1; page <= 10; page += 1) {
    const payload = await supabaseAuthRequest<{ users?: SupabaseUser[] }>(
      `/auth/v1/admin/users?page=${page}&per_page=100`,
    );
    const users = payload?.users ?? [];
    collectedUsers.push(...users);

    if (users.length < 100) {
      break;
    }
  }

  return collectedUsers;
}

export async function findAdminUserByEmail(email: string) {
  const users = await listUsers();

  return (
    users.find((item) => item.email?.toLowerCase() === email.toLowerCase()) ??
    null
  );
}

function formatAdminUser(user: SupabaseUser) {
  const role = user.app_metadata?.role ?? "";
  const email = user.email ?? "";

  return {
    id: user.id,
    email,
    role,
    active: role === "admin",
    bootstrapAllowed: email ? isAllowedAdminEmail(email) : false,
    createdAt: user.created_at ?? null,
    updatedAt: user.updated_at ?? null,
    lastSignInAt: user.last_sign_in_at ?? null,
    bannedUntil: user.banned_until ?? null,
  };
}

export async function listAdminUsers() {
  const users = await listUsers();

  return users
    .filter((user) => {
      const email = user.email ?? "";

      return (
        user.app_metadata?.role === "admin" ||
        user.app_metadata?.role === "disabled_admin" ||
        isAllowedAdminEmail(email)
      );
    })
    .map(formatAdminUser)
    .sort((left, right) => left.email.localeCompare(right.email));
}

export async function createOrUpdateAdminUser(input: {
  email: string;
  password: string;
}) {
  const existingUser = await findAdminUserByEmail(input.email);
  const userPayload = {
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { role: "admin", source: "admin-panel" },
    app_metadata: { role: "admin" },
  };

  if (existingUser) {
    await supabaseAuthRequest(`/auth/v1/admin/users/${existingUser.id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...userPayload,
        ban_duration: "none",
      }),
    });

    return "updated" as const;
  }

  await supabaseAuthRequest("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify(userPayload),
  });

  return "created" as const;
}

export async function updateAdminUser(input: {
  id: string;
  password?: string;
  active?: boolean;
}) {
  const updatePayload: Record<string, unknown> = {};

  if (input.password) {
    updatePayload.password = input.password;
  }

  if (typeof input.active === "boolean") {
    updatePayload.app_metadata = {
      role: input.active ? "admin" : "disabled_admin",
    };
    updatePayload.user_metadata = {
      role: input.active ? "admin" : "disabled_admin",
      source: "admin-panel",
    };
    updatePayload.ban_duration = input.active ? "none" : "876000h";
  }

  if (!Object.keys(updatePayload).length) {
    throw new Error("No hay cambios para guardar");
  }

  await supabaseAuthRequest(`/auth/v1/admin/users/${input.id}`, {
    method: "PUT",
    body: JSON.stringify(updatePayload),
  });
}
