"use client";

import { useState } from "react";
import { KeyRound, LogOut, Plus, ShieldCheck, ShieldOff } from "lucide-react";
import AdminNav from "@/components/AdminNav";

export type AdminUserRecord = {
  id: string;
  email: string;
  role: string;
  active: boolean;
  bootstrapAllowed: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  lastSignInAt: string | null;
  bannedUntil: string | null;
};

type AdminUsersManagerProps = {
  initialUsers: AdminUserRecord[];
};

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminUsersManager({
  initialUsers,
}: AdminUsersManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function refreshUsers() {
    const response = await fetch("/api/admin/users");
    const payload = (await response.json()) as {
      ok: boolean;
      users?: AdminUserRecord[];
      error?: string;
    };

    if (!response.ok || !payload.ok || !payload.users) {
      throw new Error(payload.error || "No se pudieron cargar usuarios");
    }

    setUsers(payload.users);
  }

  async function createUser() {
    setSavingId("new");
    setMessage("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        action?: "created" | "updated";
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo guardar usuario");
      }

      setEmail("");
      setPassword("");
      await refreshUsers();
      setMessage(
        payload.action === "updated"
          ? "Usuario actualizado."
          : "Usuario creado.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar");
    } finally {
      setSavingId(null);
    }
  }

  async function updateUser(input: {
    id: string;
    password?: string;
    active?: boolean;
  }) {
    setSavingId(input.id);
    setMessage("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo actualizar usuario");
      }

      await refreshUsers();
      setMessage("Usuario actualizado.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo actualizar",
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f3f5] text-[#473a42]">
      <header className="border-b border-[#ead1d9] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#c98fa1]">
              Panel admin
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#5f4d56]">
              Usuarios
            </h1>
            <AdminNav />
          </div>

          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-[#ead1d9] bg-white px-4 py-2 text-sm font-medium text-[#6b5b63] transition hover:bg-[#fff3f6]"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Salir
            </button>
          </form>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-6">
        <div className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#5f4d56]">
            Crear o actualizar usuario admin
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7583]">
                Email
              </span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                placeholder="admin@clinica.com"
                type="email"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7583]">
                Contraseña
              </span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                placeholder="Contraseña segura"
                type="password"
              />
            </label>

            <button
              type="button"
              disabled={!email || !password || savingId === "new"}
              onClick={() => void createUser()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c98fa1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bd7f93] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {savingId === "new" ? "Guardando" : "Guardar"}
            </button>
          </div>
        </div>

        {message ? (
          <p className="mt-4 rounded-lg border border-[#ead1d9] bg-white px-4 py-3 text-sm text-[#5f4d56]">
            {message}
          </p>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-lg border border-[#ead1d9] bg-white shadow-sm">
          <div className="grid grid-cols-[1.3fr_0.7fr_0.8fr_1fr] gap-4 border-b border-[#ead1d9] bg-[#fffafb] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#9a7583]">
            <span>Email</span>
            <span>Estado</span>
            <span>Último acceso</span>
            <span>Acciones</span>
          </div>

          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSaving={savingId === user.id}
              onUpdate={(input) => void updateUser({ id: user.id, ...input })}
            />
          ))}

          {!users.length ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500">
              No hay usuarios admin todavía.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function UserRow({
  user,
  isSaving,
  onUpdate,
}: {
  user: AdminUserRecord;
  isSaving: boolean;
  onUpdate: (input: { password?: string; active?: boolean }) => void;
}) {
  const [newPassword, setNewPassword] = useState("");

  return (
    <div className="grid grid-cols-[1.3fr_0.7fr_0.8fr_1fr] gap-4 border-b border-[#ead1d9] px-4 py-4 text-sm last:border-b-0">
      <div className="min-w-0">
        <p className="truncate font-semibold text-[#5f4d56]">{user.email}</p>
        <p className="mt-1 text-xs text-gray-500">
          Creado: {formatDate(user.createdAt)}
        </p>
      </div>

      <div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            user.active
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {user.active ? "Activo" : "Desactivado"}
        </span>
      </div>

      <div className="text-gray-600">{formatDate(user.lastSignInAt)}</div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-xs outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
            placeholder="Nueva contraseña"
            type="password"
          />
          <button
            type="button"
            disabled={!newPassword || isSaving}
            onClick={() => {
              onUpdate({ password: newPassword });
              setNewPassword("");
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-xs font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
            Cambiar
          </button>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={() => onUpdate({ active: !user.active })}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-wait disabled:opacity-60 ${
            user.active
              ? "border border-red-100 bg-red-50 text-red-700 hover:bg-red-100"
              : "border border-green-100 bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          {user.active ? (
            <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {user.active ? "Desactivar" : "Activar"}
        </button>
      </div>
    </div>
  );
}
