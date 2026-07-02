"use client";

import { useMemo, useState } from "react";
import {
  Copy,
  ExternalLink,
  FileVideo,
  ImageIcon,
  LogOut,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import AdminNav from "@/components/AdminNav";
import type { MediaAsset } from "@/lib/supabase-storage";

type AdminMediaLibraryProps = {
  initialAssets: MediaAsset[];
};

type MediaFilter = "all" | "image" | "video";

function formatBytes(size: number | null) {
  if (!size) {
    return "-";
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaLibrary({
  initialAssets,
}: AdminMediaLibraryProps) {
  const [assets, setAssets] = useState(initialAssets);
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [query, setQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const visibleAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesFilter = filter === "all" || asset.type === filter;
      const matchesQuery =
        !query ||
        asset.name.toLowerCase().includes(query.toLowerCase()) ||
        asset.path.toLowerCase().includes(query.toLowerCase());

      return matchesFilter && matchesQuery;
    });
  }, [assets, filter, query]);

  async function uploadFile(file: File) {
    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        ok: boolean;
        url?: string;
        path?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.url || !payload.path) {
        throw new Error(payload.error || "No se pudo subir");
      }

      setAssets((current) => [
        {
          name: payload.path!.split("/").at(-1) || payload.path!,
          path: payload.path!,
          url: payload.url!,
          type: file.type.startsWith("video/") ? "video" : "image",
          size: file.size,
          updatedAt: new Date().toISOString(),
          mimeType: file.type,
        },
        ...current,
      ]);
      setMessage("Archivo subido.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo subir");
    } finally {
      setIsUploading(false);
    }
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setMessage("URL copiada.");
  }

  async function deleteAsset(path: string) {
    const confirmed = window.confirm(
      "¿Eliminar este archivo? Si está usado en la web, deberías reemplazarlo antes.",
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo eliminar");
      }

      setAssets((current) => current.filter((asset) => asset.path !== path));
      setMessage("Archivo eliminado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar");
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
              Biblioteca de medios
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
        <div className="grid gap-4 rounded-lg border border-[#ead1d9] bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7583]">
                Buscar
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="mt-2 w-full rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                placeholder="Nombre o ruta"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7583]">
                Tipo
              </span>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value as MediaFilter)}
                className="mt-2 w-full rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
              >
                <option value="all">Todos</option>
                <option value="image">Imágenes</option>
                <option value="video">Videos</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/admin/medios"
              className="inline-flex items-center gap-2 rounded-lg border border-[#ead1d9] bg-white px-4 py-2 text-sm font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6]"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Actualizar
            </a>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#c98fa1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bd7f93]">
              <Upload className="h-4 w-4" aria-hidden="true" />
              {isUploading ? "Subiendo" : "Subir archivo"}
              <input
                type="file"
                accept="image/*,video/mp4,video/webm"
                disabled={isUploading}
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    void uploadFile(file);
                  }

                  event.target.value = "";
                }}
              />
            </label>
          </div>
        </div>

        {message ? (
          <p className="mt-4 rounded-lg border border-[#ead1d9] bg-white px-4 py-3 text-sm text-[#5f4d56]">
            {message}
          </p>
        ) : null}

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleAssets.map((asset) => (
            <article
              key={asset.path}
              className="overflow-hidden rounded-lg border border-[#ead1d9] bg-white shadow-sm"
            >
              <div className="flex aspect-video items-center justify-center bg-[#fffafb]">
                {asset.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-[#6b5b63]">
                    <FileVideo className="h-10 w-10" aria-hidden="true" />
                    <span className="text-sm font-medium">Video</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff3f6] text-[#c98fa1]">
                    {asset.type === "image" ? (
                      <ImageIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <FileVideo className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-[#5f4d56]">
                      {asset.name}
                    </h2>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {asset.path}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatBytes(asset.size)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => void copyUrl(asset.url)}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#ead1d9] bg-white px-2 py-2 text-xs font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6]"
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    Copiar
                  </button>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#ead1d9] bg-white px-2 py-2 text-xs font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    Abrir
                  </a>
                  <button
                    type="button"
                    onClick={() => void deleteAsset(asset.path)}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Borrar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!visibleAssets.length ? (
          <div className="mt-6 rounded-lg border border-dashed border-[#ead1d9] bg-white p-8 text-center text-sm text-gray-500">
            No hay medios para mostrar.
          </div>
        ) : null}
      </section>
    </main>
  );
}
