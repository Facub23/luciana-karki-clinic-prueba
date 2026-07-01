"use client";

import { useMemo, useState } from "react";
import { LogOut, Save } from "lucide-react";
import AdminNav from "@/components/AdminNav";
import { SiteContentRecord } from "@/lib/supabase-leads";

type AdminContentManagerProps = {
  initialContent: SiteContentRecord[];
};

export default function AdminContentManager({
  initialContent,
}: AdminContentManagerProps) {
  const [items, setItems] = useState(initialContent);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const grouped = useMemo(() => {
    return items.reduce<Record<string, SiteContentRecord[]>>((acc, item) => {
      acc[item.section] = acc[item.section] || [];
      acc[item.section].push(item);
      return acc;
    }, {});
  }, [items]);

  async function saveItem(id: string, value: string) {
    setSavingId(id);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/content/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        content?: SiteContentRecord;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.content) {
        throw new Error(payload.error || "No se pudo guardar");
      }

      setItems((current) =>
        current.map((item) => (item.id === id ? payload.content! : item)),
      );
      setMessage("Contenido guardado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar");
    } finally {
      setSavingId(null);
    }
  }

  function updateDraft(id: string, value: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, value } : item)),
    );
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
              Contenido editable
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
        <div className="rounded-lg border border-[#ead1d9] bg-white p-4 text-sm leading-6 text-gray-600 shadow-sm">
          Esta sección deja preparada la edición de contenido desde el admin. Los
          cambios quedan guardados en Supabase; el siguiente paso es conectar
          cada bloque editable con la web pública.
        </div>

        {message ? (
          <p className="mt-4 rounded-lg border border-[#ead1d9] bg-white px-4 py-3 text-sm text-[#5f4d56]">
            {message}
          </p>
        ) : null}

        <div className="mt-5 space-y-5">
          {Object.entries(grouped).map(([section, records]) => (
            <section
              key={section}
              className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#5f4d56]">
                {section}
              </h2>
              <div className="mt-4 grid gap-4">
                {records.map((item) => (
                  <div key={item.id} className="rounded-lg bg-[#fffafb] p-4">
                    <label className="block">
                      <span className="text-sm font-semibold text-[#5f4d56]">
                        {item.label}
                      </span>
                      {item.description ? (
                        <span className="mt-1 block text-xs text-gray-500">
                          {item.description}
                        </span>
                      ) : null}
                      {item.content_type === "textarea" ||
                      item.content_type === "json" ? (
                        <textarea
                          value={item.value}
                          onChange={(event) =>
                            updateDraft(item.id, event.target.value)
                          }
                          className="mt-2 min-h-28 w-full rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                        />
                      ) : (
                        <input
                          value={item.value}
                          onChange={(event) =>
                            updateDraft(item.id, event.target.value)
                          }
                          className="mt-2 w-full rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                        />
                      )}
                    </label>
                    <button
                      type="button"
                      disabled={savingId === item.id}
                      onClick={() => saveItem(item.id, item.value)}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#c98fa1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bd7f93] disabled:cursor-wait disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" aria-hidden="true" />
                      {savingId === item.id ? "Guardando" : "Guardar"}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
