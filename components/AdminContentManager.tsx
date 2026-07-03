"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  FileVideo,
  FolderOpen,
  History,
  ImageIcon,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import AdminNav from "@/components/AdminNav";
import {
  SiteContentHistoryRecord,
  SiteContentRecord,
} from "@/lib/supabase-leads";
import type { MediaAsset } from "@/lib/supabase-storage";

type AdminContentManagerProps = {
  initialContent: SiteContentRecord[];
};

type AdminContentItem = SiteContentRecord & {
  publishedValue: string;
};

type EditableTreatmentContent = {
  category?: string;
  name?: string;
  oldPrice?: string;
  price?: string;
  shortDescription?: string;
  salesDescription?: string;
  benefits?: string[];
  idealFor?: string[];
  details?: Record<string, string>;
  image?: string;
};

type EditablePromotionContent = {
  src: string;
  alt: string;
  shape: "compact" | "tall";
};

type EditableStructuredBlock = {
  eyebrow?: string;
  title?: string;
  description?: string;
  paragraphs?: string[];
  principles?: string[];
  ctaLabel?: string;
  cards?: {
    icon?: string;
    title: string;
    text: string;
  }[];
  videos?: {
    src: string;
    title: string;
  }[];
  images?: {
    src: string;
    alt: string;
  }[];
  steps?: {
    title: string;
    text: string;
  }[];
  items?: {
    question: string;
    answer: string;
  }[];
};

type EditableHeroContent = {
  eyebrow?: string;
  title?: string;
  doctor?: string;
  description?: string;
  primaryCta?: string;
  secondaryCta?: string;
  secondaryHref?: string;
  image?: string;
  imageAlt?: string;
  floatingTitle?: string;
  floatingText?: string;
};

type EditableFooterContent = {
  brandName?: string;
  description?: string;
  addressLines?: string[];
  instagramUrl?: string;
  copyright?: string;
};

type EditableNavbarContent = {
  brandShort?: string;
  brandFull?: string;
  specialty?: string;
  ctaMobile?: string;
  ctaDesktop?: string;
  links?: {
    label: string;
    href: string;
  }[];
};

type EditableLeadFormContent = {
  eyebrow?: string;
  title?: string;
  description?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  treatmentLabel?: string;
  treatmentPlaceholder?: string;
  submitLabel?: string;
  submittingLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  fallbackTreatment?: string;
  whatsappIntro?: string;
  whatsappTreatmentPrefix?: string;
  whatsappNamePrefix?: string;
  whatsappPhonePrefix?: string;
  whatsappClosing?: string;
};

type EditableContactContent = {
  eyebrow?: string;
  title?: string;
  lines?: string[];
  cards?: string[];
  ctaLabel?: string;
};

type EditableTreatmentPageContent = {
  approach?: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };
  protocol?: {
    eyebrow?: string;
    title?: string;
    careTitle?: string;
    precautionsTitle?: string;
  };
  assessment?: {
    eyebrow?: string;
    title?: string;
    items?: string[];
  };
  closing?: {
    title?: string;
    description?: string;
  };
};

type EditableLegalContent = {
  title?: string;
  body?: string;
};

const treatmentDetailFields = [
  ["duration", "DuraciÃ³n"],
  ["technique", "TÃ©cnica"],
  ["comfort", "Confort"],
  ["recovery", "RecuperaciÃ³n"],
  ["results", "Resultados"],
  ["effectDuration", "DuraciÃ³n del efecto"],
  ["sessions", "Sesiones"],
  ["contribution", "Lo que aporta"],
  ["care", "Cuidados"],
  ["precautions", "Precauciones"],
] as const;

function parseJsonValue<T>(value: string, fallback: T) {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function stringifyJsonValue(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function mediaTypeFromAccept(accept: string) {
  return accept.startsWith("image/")
    ? "image"
    : accept.startsWith("video/")
      ? "video"
      : "all";
}

function assetMatchesAccept(asset: MediaAsset, accept: string) {
  const type = mediaTypeFromAccept(accept);

  return type === "all" || asset.type === type;
}

export default function AdminContentManager({
  initialContent,
}: AdminContentManagerProps) {
  const [items, setItems] = useState<AdminContentItem[]>(
    initialContent.map((item) => ({
      ...item,
      publishedValue: item.value,
      value: item.draftValue ?? item.value,
      hasDraft: Boolean(item.hasDraft),
    })),
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [previewOpenIds, setPreviewOpenIds] = useState<Set<string>>(
    () => new Set(),
  );

  const grouped = useMemo(() => {
    return items.reduce<Record<string, AdminContentItem[]>>((acc, item) => {
      acc[item.section] = acc[item.section] || [];
      acc[item.section].push(item);
      return acc;
    }, {});
  }, [items]);
  const sections = Object.keys(grouped);
  const [activeSection, setActiveSection] = useState(sections[0] ?? "");
  const visibleSection = activeSection && grouped[activeSection] ? activeSection : sections[0];

  async function saveItem(id: string, value: string) {
    const item = items.find((currentItem) => currentItem.id === id);

    if (item?.content_type === "json") {
      try {
        JSON.parse(value);
      } catch {
        setMessage("El JSON no es vÃ¡lido. Revisa comas, comillas y llaves.");
        return;
      }
    }

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

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo guardar");
      }

      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                value,
                draftValue: value,
                hasDraft: true,
                draftUpdatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
      setMessage("Borrador guardado. La web pÃºblica todavÃ­a no cambiÃ³.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar");
    } finally {
      setSavingId(null);
    }
  }

  async function publishItem(id: string) {
    const item = items.find((currentItem) => currentItem.id === id);

    if (!item) return;

    setSavingId(id);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/content/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "publish" }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        content?: SiteContentRecord;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo publicar");
      }

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === id
            ? {
                ...currentItem,
                value: item.value,
                publishedValue: item.value,
                draftValue: null,
                hasDraft: false,
                draftUpdatedAt: null,
                history: payload.content?.history ?? currentItem.history,
              }
            : currentItem,
        ),
      );
      setMessage("Contenido publicado en la web.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo publicar");
    } finally {
      setSavingId(null);
    }
  }

  async function discardDraft(id: string) {
    const item = items.find((currentItem) => currentItem.id === id);

    if (!item) return;

    setSavingId(id);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/content/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "discard" }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo descartar");
      }

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === id
            ? {
                ...currentItem,
                value: currentItem.publishedValue,
                draftValue: null,
                hasDraft: false,
                draftUpdatedAt: null,
              }
            : currentItem,
        ),
      );
      setMessage("Borrador descartado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo descartar");
    } finally {
      setSavingId(null);
    }
  }

  async function restoreHistory(id: string, history: SiteContentHistoryRecord) {
    setSavingId(id);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/content/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "restore", historyId: history.id }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        content?: SiteContentRecord;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.content) {
        throw new Error(payload.error || "No se pudo restaurar la version");
      }

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === id
            ? {
                ...currentItem,
                value: payload.content!.value,
                draftValue: payload.content!.value,
                hasDraft: true,
                draftUpdatedAt: new Date().toISOString(),
              }
            : currentItem,
        ),
      );
      setMessage("Version restaurada como borrador. Publica para aplicarla.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo restaurar");
    } finally {
      setSavingId(null);
    }
  }

  function updateDraft(id: string, value: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, value } : item)),
    );
  }

  function togglePreview(id: string) {
    setPreviewOpenIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  function getPreviewLines(item: SiteContentRecord, value: string) {
    if (!value.trim()) {
      return ["Sin contenido."];
    }

    if (item.content_type !== "json") {
      return value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 10);
    }

    try {
      const parsed = JSON.parse(value) as unknown;

      if (Array.isArray(parsed)) {
        return parsed.slice(0, 8).map((entry, index) => {
          if (entry && typeof entry === "object") {
            const record = entry as Record<string, unknown>;
            const title =
              record.name || record.title || record.alt || record.question || `Item ${index + 1}`;
            const detail =
              record.price || record.shortDescription || record.description || record.text || "";

            return [title, detail].filter(Boolean).join(" Â· ");
          }

          return String(entry);
        });
      }

      if (parsed && typeof parsed === "object") {
        const record = parsed as Record<string, unknown>;
        const lines: string[] = [];

        for (const key of [
          "eyebrow",
          "title",
          "description",
          "brandName",
          "ctaLabel",
          "copyright",
          "body",
        ]) {
          const field = record[key];

          if (typeof field === "string" && field.trim()) {
            lines.push(`${key}: ${field}`);
          }
        }

        for (const key of ["cards", "items", "videos", "images", "steps", "addressLines"]) {
          const field = record[key];

          if (Array.isArray(field) && field.length) {
            lines.push(`${key}: ${field.length} elementos`);
          }
        }

        return lines.length ? lines.slice(0, 10) : [JSON.stringify(parsed, null, 2)];
      }

      return [String(parsed)];
    } catch {
      return ["El contenido todavÃ­a no tiene un formato vÃ¡lido para previsualizar."];
    }
  }

  function renderPreviewPanel(
    title: string,
    value: string,
    item: SiteContentRecord,
    tone: "published" | "draft",
  ) {
    const lines = getPreviewLines(item, value);

    return (
      <div
        className={`rounded-lg border p-4 ${
          tone === "published"
            ? "border-[#ead1d9] bg-white"
            : "border-[#d9ebdf] bg-[#f8fffa]"
        }`}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-[0.16em] ${
            tone === "published" ? "text-[#9a7583]" : "text-green-700"
          }`}
        >
          {title}
        </p>
        <div className="mt-3 space-y-2 text-sm leading-6 text-[#5f4d56]">
          {lines.map((line, index) => (
            <p
              key={`${title}-${index}-${line.slice(0, 12)}`}
              className="rounded-md bg-white/70 px-3 py-2"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    );
  }

  function renderContentPreview(item: AdminContentItem) {
    const hasLocalChange = item.value !== item.publishedValue;
    const draftTitle = item.hasDraft ? "Borrador guardado" : "EdiciÃ³n actual";

    return (
      <div className="mt-4 rounded-lg border border-[#ead1d9] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-[#5f4d56]">
              Vista previa antes/despuÃ©s
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Revisa lo publicado frente a lo que se publicarÃ­a antes de tocar
              el botÃ³n Publicar.
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              hasLocalChange
                ? "bg-amber-50 text-amber-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {hasLocalChange ? "Hay cambios" : "Sin cambios"}
          </span>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {renderPreviewPanel("Publicado ahora", item.publishedValue, item, "published")}
          {renderPreviewPanel(draftTitle, item.value, item, "draft")}
        </div>
      </div>
    );
  }

  function renderContentHistory(item: AdminContentItem) {
    const history = item.history ?? [];

    return (
      <div className="mt-4 rounded-lg border border-[#ead1d9] bg-white p-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-[#c98fa1]" aria-hidden="true" />
          <p className="text-sm font-semibold text-[#5f4d56]">
            Historial de publicaciones
          </p>
        </div>

        {history.length ? (
          <div className="mt-3 space-y-2">
            {history.slice(0, 5).map((version) => (
              <div
                key={version.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#fffafb] px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-[#5f4d56]">
                    {new Date(version.publishedAt).toLocaleString("es-ES", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    Version anterior guardada antes de publicar.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={savingId === item.id}
                  onClick={() => void restoreHistory(item.id, version)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-xs font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6] disabled:cursor-wait disabled:opacity-60"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Restaurar como borrador
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-lg border border-dashed border-[#ead1d9] bg-[#fffafb] px-3 py-3 text-sm text-gray-500">
            Todavia no hay publicaciones anteriores para este bloque.
          </p>
        )}
      </div>
    );
  }

  function renderTextEditor(item: SiteContentRecord) {
    if (item.content_type === "textarea") {
      return (
        <textarea
          value={item.value}
          onChange={(event) => updateDraft(item.id, event.target.value)}
          className="mt-2 min-h-28 w-full rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
        />
      );
    }

    return (
      <input
        value={item.value}
        onChange={(event) => updateDraft(item.id, event.target.value)}
        className="mt-2 w-full rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
      />
    );
  }

  function renderTreatmentEditor(item: SiteContentRecord) {
    const treatment = parseJsonValue<EditableTreatmentContent>(item.value, {});
    const details = treatment.details ?? {};

    function updateTreatment(nextValue: EditableTreatmentContent) {
      updateDraft(item.id, stringifyJsonValue(nextValue));
    }

    function updateField(field: keyof EditableTreatmentContent, value: string) {
      updateTreatment({ ...treatment, [field]: value });
    }

    function updateList(
      field: "benefits" | "idealFor",
      index: number,
      value: string,
    ) {
      const list = [...(treatment[field] ?? [])];
      list[index] = value;
      updateTreatment({ ...treatment, [field]: list });
    }

    function addListItem(field: "benefits" | "idealFor") {
      updateTreatment({
        ...treatment,
        [field]: [...(treatment[field] ?? []), ""],
      });
    }

    function removeListItem(field: "benefits" | "idealFor", index: number) {
      updateTreatment({
        ...treatment,
        [field]: (treatment[field] ?? []).filter((_, itemIndex) => itemIndex !== index),
      });
    }

    function updateDetail(field: string, value: string) {
      updateTreatment({
        ...treatment,
        details: {
          ...details,
          [field]: value,
        },
      });
    }

    return (
      <div className="mt-4 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField label="Nombre">
            <input
              value={treatment.name ?? ""}
              onChange={(event) => updateField("name", event.target.value)}
              className="admin-content-input"
            />
          </AdminField>

          <AdminField label="CategorÃ­a">
            <input
              value={treatment.category ?? ""}
              onChange={(event) => updateField("category", event.target.value)}
              className="admin-content-input"
            />
          </AdminField>

          <AdminField label="Precio anterior">
            <input
              value={treatment.oldPrice ?? ""}
              onChange={(event) => updateField("oldPrice", event.target.value)}
              className="admin-content-input"
              placeholder="Opcional"
            />
          </AdminField>

          <AdminField label="Precio actual">
            <input
              value={treatment.price ?? ""}
              onChange={(event) => updateField("price", event.target.value)}
              className="admin-content-input"
            />
          </AdminField>
        </div>

        <AdminField label="DescripciÃ³n corta">
          <textarea
            value={treatment.shortDescription ?? ""}
            onChange={(event) =>
              updateField("shortDescription", event.target.value)
            }
            className="admin-content-textarea min-h-24"
          />
        </AdminField>

        <AdminField label="Texto principal de la pÃ¡gina">
          <textarea
            value={treatment.salesDescription ?? ""}
            onChange={(event) =>
              updateField("salesDescription", event.target.value)
            }
            className="admin-content-textarea min-h-32"
          />
        </AdminField>

        <AdminField label="Imagen del tratamiento">
          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <div className="space-y-2">
              <input
                value={treatment.image ?? ""}
                onChange={(event) => updateField("image", event.target.value)}
                className="admin-content-input"
                placeholder="/images/tratamiento-1.jpeg"
              />
              <UploadButton
                accept="image/*"
                onUploaded={(url) => updateField("image", url)}
              />
              <MediaPickerButton
                accept="image/*"
                onSelect={(asset) => updateField("image", asset.url)}
              />
            </div>
            <div
              className="flex min-h-28 items-center justify-center rounded-lg border border-[#ead1d9] bg-white bg-cover bg-center text-xs text-gray-400"
              style={
                treatment.image
                  ? { backgroundImage: `url("${treatment.image}")` }
                  : undefined
              }
            >
              {!treatment.image ? <ImageIcon className="h-5 w-5" /> : null}
            </div>
          </div>
        </AdminField>

        <EditableList
          title="Beneficios"
          items={treatment.benefits ?? []}
          onAdd={() => addListItem("benefits")}
          onChange={(index, value) => updateList("benefits", index, value)}
          onRemove={(index) => removeListItem("benefits", index)}
        />

        <EditableList
          title="Ideal para"
          items={treatment.idealFor ?? []}
          onAdd={() => addListItem("idealFor")}
          onChange={(index, value) => updateList("idealFor", index, value)}
          onRemove={(index) => removeListItem("idealFor", index)}
        />

        <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#5f4d56]">
            Ficha tÃ©cnica
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {treatmentDetailFields.map(([field, label]) => (
              <AdminField key={field} label={label}>
                <textarea
                  value={details[field] ?? ""}
                  onChange={(event) => updateDetail(field, event.target.value)}
                  className="admin-content-textarea min-h-20"
                />
              </AdminField>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderPromotionsEditor(item: SiteContentRecord) {
    const promotions = parseJsonValue<EditablePromotionContent[]>(item.value, []);

    function updatePromotions(nextValue: EditablePromotionContent[]) {
      updateDraft(item.id, stringifyJsonValue(nextValue));
    }

    function updatePromotion<Field extends keyof EditablePromotionContent>(
      index: number,
      field: Field,
      value: EditablePromotionContent[Field],
    ) {
      updatePromotions(
        promotions.map((promotion, promotionIndex) =>
          promotionIndex === index ? { ...promotion, [field]: value } : promotion,
        ),
      );
    }

    return (
      <div className="mt-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {promotions.map((promotion, index) => (
            <div
              key={`${promotion.src}-${index}`}
              className="rounded-lg border border-[#ead1d9] bg-white p-4"
            >
              <div
                className={`mb-4 flex items-center justify-center rounded-lg border border-[#ead1d9] bg-[#fffafb] bg-cover bg-center text-xs text-gray-400 ${
                  promotion.shape === "compact" ? "aspect-square" : "aspect-[9/16]"
                }`}
                style={
                  promotion.src
                    ? { backgroundImage: `url("${promotion.src}")` }
                    : undefined
                }
              >
                {!promotion.src ? <ImageIcon className="h-5 w-5" /> : null}
              </div>

              <div className="space-y-3">
                <AdminField label="Imagen">
                  <div className="space-y-2">
                    <input
                      value={promotion.src}
                      onChange={(event) =>
                        updatePromotion(index, "src", event.target.value)
                      }
                      className="admin-content-input"
                      placeholder="/images/promocion.jpg"
                    />
                    <UploadButton
                      accept="image/*"
                      onUploaded={(url) => updatePromotion(index, "src", url)}
                    />
                    <MediaPickerButton
                      accept="image/*"
                      onSelect={(asset) => updatePromotion(index, "src", asset.url)}
                    />
                  </div>
                </AdminField>

                <AdminField label="Texto alternativo">
                  <input
                    value={promotion.alt}
                    onChange={(event) =>
                      updatePromotion(index, "alt", event.target.value)
                    }
                    className="admin-content-input"
                  />
                </AdminField>

                <AdminField label="Formato">
                  <select
                    value={promotion.shape}
                    onChange={(event) =>
                      updatePromotion(
                        index,
                        "shape",
                        event.target.value as EditablePromotionContent["shape"],
                      )
                    }
                    className="admin-content-input"
                  >
                    <option value="compact">Cuadrada</option>
                    <option value="tall">Vertical</option>
                  </select>
                </AdminField>
              </div>

              <button
                type="button"
                onClick={() =>
                  updatePromotions(
                    promotions.filter((_, promotionIndex) => promotionIndex !== index),
                  )
                }
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Quitar imagen
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            updatePromotions([
              ...promotions,
              {
                src: "",
                alt: "Nueva promociÃ³n",
                shape: "compact",
              },
            ])
          }
          className="inline-flex items-center gap-2 rounded-lg border border-[#ead1d9] bg-white px-4 py-2 text-sm font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Agregar imagen
        </button>
      </div>
    );
  }

  function renderStructuredBlockEditor(item: SiteContentRecord) {
    const block = parseJsonValue<EditableStructuredBlock>(item.value, {});

    function updateBlock(nextValue: EditableStructuredBlock) {
      updateDraft(item.id, stringifyJsonValue(nextValue));
    }

    function updateBlockField(
      field: "eyebrow" | "title" | "description" | "ctaLabel",
      value: string,
    ) {
      updateBlock({ ...block, [field]: value });
    }

    function updateArrayItem<
      Field extends "cards" | "videos" | "images" | "steps" | "items",
    >(
      field: Field,
      index: number,
      value: NonNullable<EditableStructuredBlock[Field]>[number],
    ) {
      const list = [...((block[field] ?? []) as NonNullable<EditableStructuredBlock[Field]>)];
      list[index] = value;
      updateBlock({ ...block, [field]: list });
    }

    function removeArrayItem(
      field: "cards" | "videos" | "images" | "steps" | "items",
      index: number,
    ) {
      updateBlock({
        ...block,
        [field]: (block[field] ?? []).filter((_, itemIndex) => itemIndex !== index),
      });
    }

    return (
      <div className="mt-4 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          {"eyebrow" in block ? (
            <AdminField label="Etiqueta superior">
              <input
                value={block.eyebrow ?? ""}
                onChange={(event) =>
                  updateBlockField("eyebrow", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
          ) : null}

          {"title" in block ? (
            <AdminField label="TÃ­tulo">
              <input
                value={block.title ?? ""}
                onChange={(event) => updateBlockField("title", event.target.value)}
                className="admin-content-input"
              />
            </AdminField>
          ) : null}
        </div>

        {"description" in block ? (
          <AdminField label="DescripciÃ³n">
            <textarea
              value={block.description ?? ""}
              onChange={(event) =>
                updateBlockField("description", event.target.value)
              }
              className="admin-content-textarea min-h-24"
            />
          </AdminField>
        ) : null}

        {Array.isArray(block.paragraphs) ? (
          <EditableList
            title="PÃƒÂ¡rrafos"
            items={block.paragraphs}
            onAdd={() =>
              updateBlock({
                ...block,
                paragraphs: [...(block.paragraphs ?? []), ""],
              })
            }
            onChange={(index, value) => {
              const paragraphs = [...(block.paragraphs ?? [])];
              paragraphs[index] = value;
              updateBlock({ ...block, paragraphs });
            }}
            onRemove={(index) =>
              updateBlock({
                ...block,
                paragraphs: (block.paragraphs ?? []).filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              })
            }
          />
        ) : null}

        {Array.isArray(block.principles) ? (
          <EditableList
            title="Principios"
            items={block.principles}
            onAdd={() =>
              updateBlock({
                ...block,
                principles: [...(block.principles ?? []), ""],
              })
            }
            onChange={(index, value) => {
              const principles = [...(block.principles ?? [])];
              principles[index] = value;
              updateBlock({ ...block, principles });
            }}
            onRemove={(index) =>
              updateBlock({
                ...block,
                principles: (block.principles ?? []).filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              })
            }
          />
        ) : null}

        {"ctaLabel" in block ? (
          <AdminField label="Texto del botÃƒÂ³n">
            <input
              value={block.ctaLabel ?? ""}
              onChange={(event) => updateBlockField("ctaLabel", event.target.value)}
              className="admin-content-input"
            />
          </AdminField>
        ) : null}

        {Array.isArray(block.cards) ? (
          <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-[#5f4d56]">Tarjetas</h3>
              <button
                type="button"
                onClick={() =>
                  updateBlock({
                    ...block,
                    cards: [
                      ...(block.cards ?? []),
                      { icon: "", title: "Nueva tarjeta", text: "" },
                    ],
                  })
                }
                className="inline-flex items-center gap-2 rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-xs font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Agregar tarjeta
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {block.cards.map((card, index) => (
                <div key={index} className="rounded-lg bg-[#fffafb] p-4">
                  {"icon" in card ? (
                    <AdminField label="Icono">
                      <input
                        value={card.icon ?? ""}
                        onChange={(event) =>
                          updateArrayItem("cards", index, {
                            ...card,
                            icon: event.target.value,
                          })
                        }
                        className="admin-content-input"
                      />
                    </AdminField>
                  ) : null}

                  <div className="mt-3">
                    <AdminField label="TÃ­tulo">
                      <input
                        value={card.title}
                        onChange={(event) =>
                          updateArrayItem("cards", index, {
                            ...card,
                            title: event.target.value,
                          })
                        }
                        className="admin-content-input"
                      />
                    </AdminField>
                  </div>

                  <div className="mt-3">
                    <AdminField label="Texto">
                      <textarea
                        value={card.text}
                        onChange={(event) =>
                          updateArrayItem("cards", index, {
                            ...card,
                            text: event.target.value,
                          })
                        }
                        className="admin-content-textarea min-h-24"
                      />
                    </AdminField>
                  </div>

                  <RemoveButton
                    label="Quitar tarjeta"
                    onClick={() => removeArrayItem("cards", index)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {Array.isArray(block.videos) ? (
          <MediaListEditor
            title="Videos"
            addLabel="Agregar video"
            items={block.videos}
            srcLabel="Video"
            textLabel="TÃ­tulo"
            accept="video/mp4,video/webm"
            onAdd={() =>
              updateBlock({
                ...block,
                videos: [...(block.videos ?? []), { src: "", title: "Nuevo video" }],
              })
            }
            onChange={(index, nextItem) =>
              updateArrayItem("videos", index, nextItem)
            }
            onRemove={(index) => removeArrayItem("videos", index)}
          />
        ) : null}

        {Array.isArray(block.images) ? (
          <MediaListEditor
            title="ImÃ¡genes"
            addLabel="Agregar imagen"
            items={block.images.map((image) => ({
              src: image.src,
              title: image.alt,
            }))}
            srcLabel="Imagen"
            textLabel="Texto alternativo"
            accept="image/*"
            onAdd={() =>
              updateBlock({
                ...block,
                images: [
                  ...(block.images ?? []),
                  { src: "", alt: "Nueva imagen" },
                ],
              })
            }
            onChange={(index, nextItem) =>
              updateArrayItem("images", index, {
                src: nextItem.src,
                alt: nextItem.title,
              })
            }
            onRemove={(index) => removeArrayItem("images", index)}
          />
        ) : null}

        {Array.isArray(block.steps) ? (
          <TextPairListEditor
            title="Pasos"
            addLabel="Agregar paso"
            items={block.steps}
            textLabel="Texto"
            onAdd={() =>
              updateBlock({
                ...block,
                steps: [...(block.steps ?? []), { title: "Nuevo paso", text: "" }],
              })
            }
            onChange={(index, nextItem) =>
              updateArrayItem("steps", index, nextItem)
            }
            onRemove={(index) => removeArrayItem("steps", index)}
          />
        ) : null}

        {Array.isArray(block.items) ? (
          <TextPairListEditor
            title="Preguntas"
            addLabel="Agregar pregunta"
            items={block.items.map((faq) => ({
              title: faq.question,
              text: faq.answer,
            }))}
            textLabel="Respuesta"
            onAdd={() =>
              updateBlock({
                ...block,
                items: [
                  ...(block.items ?? []),
                  { question: "Nueva pregunta", answer: "" },
                ],
              })
            }
            onChange={(index, nextItem) =>
              updateArrayItem("items", index, {
                question: nextItem.title,
                answer: nextItem.text,
              })
            }
            onRemove={(index) => removeArrayItem("items", index)}
          />
        ) : null}
      </div>
    );
  }

  function renderHeroEditor(item: SiteContentRecord) {
    const hero = parseJsonValue<EditableHeroContent>(item.value, {});

    function updateHero(nextValue: EditableHeroContent) {
      updateDraft(item.id, stringifyJsonValue(nextValue));
    }

    function updateField(field: keyof EditableHeroContent, value: string) {
      updateHero({ ...hero, [field]: value });
    }

    return (
      <div className="mt-4 space-y-6">
        <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#5f4d56]">
            Texto principal
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <AdminField label="Ubicación / etiqueta">
              <input
                value={hero.eyebrow ?? ""}
                onChange={(event) => updateField("eyebrow", event.target.value)}
                className="admin-content-input"
              />
            </AdminField>

            <AdminField label="Nombre doctora">
              <input
                value={hero.doctor ?? ""}
                onChange={(event) => updateField("doctor", event.target.value)}
                className="admin-content-input"
              />
            </AdminField>
          </div>

          <div className="mt-4">
            <AdminField label="Título principal">
              <textarea
                value={hero.title ?? ""}
                onChange={(event) => updateField("title", event.target.value)}
                className="admin-content-textarea min-h-24"
              />
            </AdminField>
          </div>

          <div className="mt-4">
            <AdminField label="Descripción">
              <textarea
                value={hero.description ?? ""}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                className="admin-content-textarea min-h-28"
              />
            </AdminField>
          </div>
        </div>

        <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#5f4d56]">Botones</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <AdminField label="Botón principal">
              <input
                value={hero.primaryCta ?? ""}
                onChange={(event) => updateField("primaryCta", event.target.value)}
                className="admin-content-input"
              />
            </AdminField>

            <AdminField label="Botón secundario">
              <input
                value={hero.secondaryCta ?? ""}
                onChange={(event) =>
                  updateField("secondaryCta", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>

            <AdminField label="Destino secundario">
              <input
                value={hero.secondaryHref ?? ""}
                onChange={(event) =>
                  updateField("secondaryHref", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
          </div>
        </div>

        <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#5f4d56]">Imagen</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-[220px_1fr]">
            <div className="overflow-hidden rounded-lg border border-[#ead1d9] bg-[#fffafb]">
              {hero.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={hero.image}
                  alt={hero.imageAlt ?? ""}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center text-sm text-gray-500">
                  Sin imagen
                </div>
              )}
            </div>

            <div className="space-y-4">
              <AdminField label="Imagen principal">
                <input
                  value={hero.image ?? ""}
                  onChange={(event) => updateField("image", event.target.value)}
                  className="admin-content-input"
                />
              </AdminField>

              <div className="flex flex-wrap gap-2">
                <MediaPickerButton
                  accept="image/*"
                  onSelect={(asset) => updateField("image", asset.url)}
                />
                <UploadButton
                  accept="image/*"
                  onUploaded={(url) => updateField("image", url)}
                />
              </div>

              <AdminField label="Texto alternativo">
                <input
                  value={hero.imageAlt ?? ""}
                  onChange={(event) => updateField("imageAlt", event.target.value)}
                  className="admin-content-input"
                />
              </AdminField>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#5f4d56]">
            Tarjeta sobre imagen
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <AdminField label="Título tarjeta">
              <input
                value={hero.floatingTitle ?? ""}
                onChange={(event) =>
                  updateField("floatingTitle", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>

            <AdminField label="Texto tarjeta">
              <textarea
                value={hero.floatingText ?? ""}
                onChange={(event) =>
                  updateField("floatingText", event.target.value)
                }
                className="admin-content-textarea min-h-24"
              />
            </AdminField>
          </div>
        </div>
      </div>
    );
  }

  function renderNavbarEditor(item: SiteContentRecord) {
    const navbar = parseJsonValue<EditableNavbarContent>(item.value, {});

    function updateNavbar(nextValue: EditableNavbarContent) {
      updateDraft(item.id, stringifyJsonValue(nextValue));
    }

    function updateField(field: keyof EditableNavbarContent, value: string) {
      updateNavbar({ ...navbar, [field]: value });
    }

    function updateLink(
      index: number,
      field: "label" | "href",
      value: string,
    ) {
      const links = [...(navbar.links ?? [])];
      links[index] = {
        ...(links[index] ?? { label: "", href: "" }),
        [field]: value,
      };
      updateNavbar({ ...navbar, links });
    }

    return (
      <div className="mt-4 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField label="Marca móvil">
            <input
              value={navbar.brandShort ?? ""}
              onChange={(event) => updateField("brandShort", event.target.value)}
              className="admin-content-input"
            />
          </AdminField>

          <AdminField label="Marca escritorio">
            <input
              value={navbar.brandFull ?? ""}
              onChange={(event) => updateField("brandFull", event.target.value)}
              className="admin-content-input"
            />
          </AdminField>

          <AdminField label="Especialidad">
            <input
              value={navbar.specialty ?? ""}
              onChange={(event) => updateField("specialty", event.target.value)}
              className="admin-content-input"
            />
          </AdminField>

          <AdminField label="Botón móvil">
            <input
              value={navbar.ctaMobile ?? ""}
              onChange={(event) => updateField("ctaMobile", event.target.value)}
              className="admin-content-input"
            />
          </AdminField>

          <AdminField label="Botón escritorio">
            <input
              value={navbar.ctaDesktop ?? ""}
              onChange={(event) => updateField("ctaDesktop", event.target.value)}
              className="admin-content-input"
            />
          </AdminField>
        </div>

        <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-[#5f4d56]">
              Enlaces del menú
            </h3>
            <button
              type="button"
              onClick={() =>
                updateNavbar({
                  ...navbar,
                  links: [...(navbar.links ?? []), { label: "Nuevo", href: "/" }],
                })
              }
              className="inline-flex items-center gap-2 rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-xs font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Agregar enlace
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {(navbar.links ?? []).map((link, index) => (
              <div
                key={`${link.href}-${index}`}
                className="grid gap-3 rounded-lg bg-[#fffafb] p-3 md:grid-cols-[1fr_1fr_auto]"
              >
                <AdminField label="Texto">
                  <input
                    value={link.label}
                    onChange={(event) =>
                      updateLink(index, "label", event.target.value)
                    }
                    className="admin-content-input"
                  />
                </AdminField>

                <AdminField label="Destino">
                  <input
                    value={link.href}
                    onChange={(event) =>
                      updateLink(index, "href", event.target.value)
                    }
                    className="admin-content-input"
                  />
                </AdminField>

                <button
                  type="button"
                  onClick={() =>
                    updateNavbar({
                      ...navbar,
                      links: (navbar.links ?? []).filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    })
                  }
                  className="mt-6 inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderLeadFormEditor(item: SiteContentRecord) {
    const form = parseJsonValue<EditableLeadFormContent>(item.value, {});

    function updateForm(nextValue: EditableLeadFormContent) {
      updateDraft(item.id, stringifyJsonValue(nextValue));
    }

    function updateField(field: keyof EditableLeadFormContent, value: string) {
      updateForm({ ...form, [field]: value });
    }

    return (
      <div className="mt-4 space-y-6">
        <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#5f4d56]">
            Encabezado del formulario
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <AdminField label="Etiqueta superior">
              <input
                value={form.eyebrow ?? ""}
                onChange={(event) => updateField("eyebrow", event.target.value)}
                className="admin-content-input"
              />
            </AdminField>
            <AdminField label="Título">
              <input
                value={form.title ?? ""}
                onChange={(event) => updateField("title", event.target.value)}
                className="admin-content-input"
              />
            </AdminField>
          </div>
          <div className="mt-4">
            <AdminField label="Descripción">
              <textarea
                value={form.description ?? ""}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                className="admin-content-textarea min-h-24"
              />
            </AdminField>
          </div>
        </div>

        <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#5f4d56]">
            Campos y botones
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <AdminField label="Label nombre">
              <input
                value={form.nameLabel ?? ""}
                onChange={(event) => updateField("nameLabel", event.target.value)}
                className="admin-content-input"
              />
            </AdminField>
            <AdminField label="Placeholder nombre">
              <input
                value={form.namePlaceholder ?? ""}
                onChange={(event) =>
                  updateField("namePlaceholder", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
            <AdminField label="Label teléfono">
              <input
                value={form.phoneLabel ?? ""}
                onChange={(event) => updateField("phoneLabel", event.target.value)}
                className="admin-content-input"
              />
            </AdminField>
            <AdminField label="Placeholder teléfono">
              <input
                value={form.phonePlaceholder ?? ""}
                onChange={(event) =>
                  updateField("phonePlaceholder", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
            <AdminField label="Label tratamiento">
              <input
                value={form.treatmentLabel ?? ""}
                onChange={(event) =>
                  updateField("treatmentLabel", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
            <AdminField label="Placeholder tratamiento">
              <input
                value={form.treatmentPlaceholder ?? ""}
                onChange={(event) =>
                  updateField("treatmentPlaceholder", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
            <AdminField label="Botón">
              <input
                value={form.submitLabel ?? ""}
                onChange={(event) => updateField("submitLabel", event.target.value)}
                className="admin-content-input"
              />
            </AdminField>
            <AdminField label="Botón cargando">
              <input
                value={form.submittingLabel ?? ""}
                onChange={(event) =>
                  updateField("submittingLabel", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
          </div>
        </div>

        <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#5f4d56]">
            Mensajes de estado
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <AdminField label="Mensaje correcto">
              <textarea
                value={form.successMessage ?? ""}
                onChange={(event) =>
                  updateField("successMessage", event.target.value)
                }
                className="admin-content-textarea min-h-24"
              />
            </AdminField>
            <AdminField label="Mensaje error">
              <textarea
                value={form.errorMessage ?? ""}
                onChange={(event) =>
                  updateField("errorMessage", event.target.value)
                }
                className="admin-content-textarea min-h-24"
              />
            </AdminField>
          </div>
        </div>

        <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#5f4d56]">
            Mensaje automático de WhatsApp
          </h3>
          <div className="mt-4 space-y-4">
            <AdminField label="Tratamiento por defecto">
              <input
                value={form.fallbackTreatment ?? ""}
                onChange={(event) =>
                  updateField("fallbackTreatment", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
            <AdminField label="Primera línea">
              <textarea
                value={form.whatsappIntro ?? ""}
                onChange={(event) =>
                  updateField("whatsappIntro", event.target.value)
                }
                className="admin-content-textarea min-h-20"
              />
            </AdminField>
            <div className="grid gap-4 md:grid-cols-3">
              <AdminField label="Prefijo tratamiento">
                <input
                  value={form.whatsappTreatmentPrefix ?? ""}
                  onChange={(event) =>
                    updateField("whatsappTreatmentPrefix", event.target.value)
                  }
                  className="admin-content-input"
                />
              </AdminField>
              <AdminField label="Prefijo nombre">
                <input
                  value={form.whatsappNamePrefix ?? ""}
                  onChange={(event) =>
                    updateField("whatsappNamePrefix", event.target.value)
                  }
                  className="admin-content-input"
                />
              </AdminField>
              <AdminField label="Prefijo teléfono">
                <input
                  value={form.whatsappPhonePrefix ?? ""}
                  onChange={(event) =>
                    updateField("whatsappPhonePrefix", event.target.value)
                  }
                  className="admin-content-input"
                />
              </AdminField>
            </div>
            <AdminField label="Cierre">
              <textarea
                value={form.whatsappClosing ?? ""}
                onChange={(event) =>
                  updateField("whatsappClosing", event.target.value)
                }
                className="admin-content-textarea min-h-20"
              />
            </AdminField>
          </div>
        </div>
      </div>
    );
  }

  function renderFooterEditor(item: SiteContentRecord) {
    const footer = parseJsonValue<EditableFooterContent>(item.value, {});

    function updateFooter(nextValue: EditableFooterContent) {
      updateDraft(item.id, stringifyJsonValue(nextValue));
    }

    function updateField(field: keyof EditableFooterContent, value: string) {
      updateFooter({ ...footer, [field]: value });
    }

    function updateAddressLine(index: number, value: string) {
      const addressLines = [...(footer.addressLines ?? [])];
      addressLines[index] = value;
      updateFooter({ ...footer, addressLines });
    }

    return (
      <div className="mt-4 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField label="Nombre / marca">
            <input
              value={footer.brandName ?? ""}
              onChange={(event) => updateField("brandName", event.target.value)}
              className="admin-content-input"
            />
          </AdminField>

          <AdminField label="Instagram">
            <input
              value={footer.instagramUrl ?? ""}
              onChange={(event) =>
                updateField("instagramUrl", event.target.value)
              }
              className="admin-content-input"
            />
          </AdminField>
        </div>

        <AdminField label="DescripciÃ³n">
          <textarea
            value={footer.description ?? ""}
            onChange={(event) => updateField("description", event.target.value)}
            className="admin-content-textarea min-h-24"
          />
        </AdminField>

        <EditableList
          title="DirecciÃ³n / lÃ­neas de contacto"
          items={footer.addressLines ?? []}
          onAdd={() =>
            updateFooter({
              ...footer,
              addressLines: [...(footer.addressLines ?? []), ""],
            })
          }
          onChange={updateAddressLine}
          onRemove={(index) =>
            updateFooter({
              ...footer,
              addressLines: (footer.addressLines ?? []).filter(
                (_, itemIndex) => itemIndex !== index,
              ),
            })
          }
        />

        <AdminField label="Copyright">
          <input
            value={footer.copyright ?? ""}
            onChange={(event) => updateField("copyright", event.target.value)}
            className="admin-content-input"
          />
        </AdminField>
      </div>
    );
  }

  function renderContactEditor(item: SiteContentRecord) {
    const contact = parseJsonValue<EditableContactContent>(item.value, {});

    function updateContact(nextValue: EditableContactContent) {
      updateDraft(item.id, stringifyJsonValue(nextValue));
    }

    function updateField(field: keyof EditableContactContent, value: string) {
      updateContact({ ...contact, [field]: value });
    }

    function updateList(field: "lines" | "cards", index: number, value: string) {
      const list = [...(contact[field] ?? [])];
      list[index] = value;
      updateContact({ ...contact, [field]: list });
    }

    function removeListItem(field: "lines" | "cards", index: number) {
      updateContact({
        ...contact,
        [field]: (contact[field] ?? []).filter(
          (_, itemIndex) => itemIndex !== index,
        ),
      });
    }

    return (
      <div className="mt-4 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField label="Etiqueta superior">
            <input
              value={contact.eyebrow ?? ""}
              onChange={(event) => updateField("eyebrow", event.target.value)}
              className="admin-content-input"
            />
          </AdminField>

          <AdminField label="TÃ­tulo">
            <input
              value={contact.title ?? ""}
              onChange={(event) => updateField("title", event.target.value)}
              className="admin-content-input"
            />
          </AdminField>
        </div>

        <EditableList
          title="LÃ­neas de contacto"
          items={contact.lines ?? []}
          onAdd={() =>
            updateContact({ ...contact, lines: [...(contact.lines ?? []), ""] })
          }
          onChange={(index, value) => updateList("lines", index, value)}
          onRemove={(index) => removeListItem("lines", index)}
        />

        <EditableList
          title="Tarjetas informativas"
          items={contact.cards ?? []}
          onAdd={() =>
            updateContact({ ...contact, cards: [...(contact.cards ?? []), ""] })
          }
          onChange={(index, value) => updateList("cards", index, value)}
          onRemove={(index) => removeListItem("cards", index)}
        />

        <AdminField label="Texto del botÃ³n">
          <input
            value={contact.ctaLabel ?? ""}
            onChange={(event) => updateField("ctaLabel", event.target.value)}
            className="admin-content-input"
          />
        </AdminField>
      </div>
    );
  }

  function renderTreatmentPageEditor(item: SiteContentRecord) {
    const pageContent = parseJsonValue<EditableTreatmentPageContent>(item.value, {});

    function updatePageContent(nextValue: EditableTreatmentPageContent) {
      updateDraft(item.id, stringifyJsonValue(nextValue));
    }

    function updateSectionField<
      Section extends keyof EditableTreatmentPageContent,
      Field extends keyof NonNullable<EditableTreatmentPageContent[Section]>,
    >(section: Section, field: Field, value: string) {
      updatePageContent({
        ...pageContent,
        [section]: {
          ...(pageContent[section] ?? {}),
          [field]: value,
        },
      });
    }

    function updateAssessmentItem(index: number, value: string) {
      const items = [...(pageContent.assessment?.items ?? [])];
      items[index] = value;
      updatePageContent({
        ...pageContent,
        assessment: {
          ...(pageContent.assessment ?? {}),
          items,
        },
      });
    }

    return (
      <div className="mt-4 space-y-6">
        <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#5f4d56]">
            Enfoque inicial
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <AdminField label="Etiqueta superior">
              <input
                value={pageContent.approach?.eyebrow ?? ""}
                onChange={(event) =>
                  updateSectionField("approach", "eyebrow", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
            <AdminField label="Título">
              <input
                value={pageContent.approach?.title ?? ""}
                onChange={(event) =>
                  updateSectionField("approach", "title", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
          </div>
          <div className="mt-4">
            <AdminField label="Descripción">
              <textarea
                value={pageContent.approach?.description ?? ""}
                onChange={(event) =>
                  updateSectionField(
                    "approach",
                    "description",
                    event.target.value,
                  )
                }
                className="admin-content-textarea min-h-24"
              />
            </AdminField>
          </div>
        </div>

        <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#5f4d56]">
            Protocolo
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <AdminField label="Etiqueta superior">
              <input
                value={pageContent.protocol?.eyebrow ?? ""}
                onChange={(event) =>
                  updateSectionField("protocol", "eyebrow", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
            <AdminField label="Título">
              <input
                value={pageContent.protocol?.title ?? ""}
                onChange={(event) =>
                  updateSectionField("protocol", "title", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
            <AdminField label="Título cuidados">
              <input
                value={pageContent.protocol?.careTitle ?? ""}
                onChange={(event) =>
                  updateSectionField("protocol", "careTitle", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
            <AdminField label="Título precauciones">
              <input
                value={pageContent.protocol?.precautionsTitle ?? ""}
                onChange={(event) =>
                  updateSectionField(
                    "protocol",
                    "precautionsTitle",
                    event.target.value,
                  )
                }
                className="admin-content-input"
              />
            </AdminField>
          </div>
        </div>

        <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#5f4d56]">
            Valoración previa
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <AdminField label="Etiqueta superior">
              <input
                value={pageContent.assessment?.eyebrow ?? ""}
                onChange={(event) =>
                  updateSectionField("assessment", "eyebrow", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
            <AdminField label="Título">
              <input
                value={pageContent.assessment?.title ?? ""}
                onChange={(event) =>
                  updateSectionField("assessment", "title", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
          </div>
          <div className="mt-4">
            <EditableList
              title="Puntos de valoración"
              items={pageContent.assessment?.items ?? []}
              onAdd={() =>
                updatePageContent({
                  ...pageContent,
                  assessment: {
                    ...(pageContent.assessment ?? {}),
                    items: [...(pageContent.assessment?.items ?? []), ""],
                  },
                })
              }
              onChange={updateAssessmentItem}
              onRemove={(index) =>
                updatePageContent({
                  ...pageContent,
                  assessment: {
                    ...(pageContent.assessment ?? {}),
                    items: (pageContent.assessment?.items ?? []).filter(
                      (_, itemIndex) => itemIndex !== index,
                    ),
                  },
                })
              }
            />
          </div>
        </div>

        <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#5f4d56]">
            Cierre de reserva
          </h3>
          <div className="mt-4">
            <AdminField label="Título">
              <input
                value={pageContent.closing?.title ?? ""}
                onChange={(event) =>
                  updateSectionField("closing", "title", event.target.value)
                }
                className="admin-content-input"
              />
            </AdminField>
          </div>
          <div className="mt-4">
            <AdminField label="Descripción">
              <textarea
                value={pageContent.closing?.description ?? ""}
                onChange={(event) =>
                  updateSectionField("closing", "description", event.target.value)
                }
                className="admin-content-textarea min-h-24"
              />
            </AdminField>
          </div>
        </div>
      </div>
    );
  }

  function renderLegalEditor(item: SiteContentRecord) {
    const legal = parseJsonValue<EditableLegalContent>(item.value, {});

    function updateLegal(nextValue: EditableLegalContent) {
      updateDraft(item.id, stringifyJsonValue(nextValue));
    }

    return (
      <div className="mt-4 space-y-5">
        <AdminField label="TÃ­tulo">
          <input
            value={legal.title ?? ""}
            onChange={(event) =>
              updateLegal({ ...legal, title: event.target.value })
            }
            className="admin-content-input"
          />
        </AdminField>

        <AdminField label="Contenido">
          <textarea
            value={legal.body ?? ""}
            onChange={(event) =>
              updateLegal({ ...legal, body: event.target.value })
            }
            className="admin-content-textarea min-h-80"
          />
        </AdminField>
      </div>
    );
  }

  function renderContentEditor(item: SiteContentRecord) {
    if (item.section === "Tratamientos" && item.content_type === "json") {
      return renderTreatmentEditor(item);
    }

    if (item.section === "Promociones" && item.content_type === "json") {
      return renderPromotionsEditor(item);
    }

    if (
      item.section === "Home" &&
      item.label === "Hero / Inicio" &&
      item.content_type === "json"
    ) {
      return renderHeroEditor(item);
    }

    if (
      item.section === "Global" &&
      item.label === "Navegación principal" &&
      item.content_type === "json"
    ) {
      return renderNavbarEditor(item);
    }

    if (
      item.section === "Global" &&
      item.label === "Formulario de leads" &&
      item.content_type === "json"
    ) {
      return renderLeadFormEditor(item);
    }

    if (
      item.section === "Global" &&
      item.label === "Páginas de tratamiento" &&
      item.content_type === "json"
    ) {
      return renderTreatmentPageEditor(item);
    }

    if (
      (item.section === "Home" ||
        item.section === "FAQ" ||
        item.section === "Global") &&
      item.content_type === "json"
    ) {
      return renderStructuredBlockEditor(item);
    }

    if (item.section === "Footer" && item.content_type === "json") {
      return renderFooterEditor(item);
    }

    if (
      item.section === "Contacto" &&
      item.label === "Bloque contacto" &&
      item.content_type === "json"
    ) {
      return renderContactEditor(item);
    }

    if (item.section === "Legales" && item.content_type === "json") {
      return renderLegalEditor(item);
    }

    return renderTextEditor(item);
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
          Los cambios se guardan primero como borrador. La web pÃºblica solo
          cambia cuando presionas Publicar.
        </div>

        {message ? (
          <p className="mt-4 rounded-lg border border-[#ead1d9] bg-white px-4 py-3 text-sm text-[#5f4d56]">
            {message}
          </p>
        ) : null}

        <div className="mt-5 flex gap-2 overflow-x-auto rounded-lg border border-[#ead1d9] bg-white p-2 shadow-sm">
          {sections.map((section) => {
            const draftCount = grouped[section].filter((item) => item.hasDraft).length;
            const isActive = section === visibleSection;

            return (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#c98fa1] text-white"
                    : "bg-[#fffafb] text-[#6b5b63] hover:bg-[#fff3f6]"
                }`}
              >
                {section}
                {draftCount ? (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isActive ? "bg-white/20" : "bg-[#f7dfe7] text-[#a8697e]"
                    }`}
                  >
                    {draftCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-5">
          {visibleSection ? (
            <section
              key={visibleSection}
              className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#5f4d56]">
                {visibleSection}
              </h2>
              <div className="mt-4 grid gap-4">
                {grouped[visibleSection].map((item) => (
                  <div key={item.id} className="rounded-lg bg-[#fffafb] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="text-sm font-semibold text-[#5f4d56]">
                          {item.label}
                        </span>
                        {item.hasDraft ? (
                          <span className="ml-2 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                            Borrador sin publicar
                          </span>
                        ) : (
                          <span className="ml-2 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                            Publicado
                          </span>
                        )}
                        {item.description ? (
                          <span className="mt-1 block text-xs text-gray-500">
                            {item.description}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="block">
                      {renderContentEditor(item)}
                    </div>

                    {previewOpenIds.has(item.id) ? renderContentPreview(item) : null}

                    {renderContentHistory(item)}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => togglePreview(item.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#ead1d9] bg-white px-4 py-2 text-sm font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6]"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        {previewOpenIds.has(item.id)
                          ? "Ocultar vista previa"
                          : "Ver antes/despuÃ©s"}
                      </button>

                      <button
                        type="button"
                        disabled={savingId === item.id}
                        onClick={() => saveItem(item.id, item.value)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#c98fa1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bd7f93] disabled:cursor-wait disabled:opacity-60"
                      >
                        <Save className="h-4 w-4" aria-hidden="true" />
                        {savingId === item.id ? "Guardando" : "Guardar borrador"}
                      </button>

                      <button
                        type="button"
                        disabled={!item.hasDraft || savingId === item.id}
                        onClick={() => publishItem(item.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        Publicar
                      </button>

                      <button
                        type="button"
                        disabled={!item.hasDraft || savingId === item.id}
                        onClick={() => discardDraft(item.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" aria-hidden="true" />
                        Descartar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
function AdminField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7583]">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function EditableList({
  title,
  items,
  onAdd,
  onChange,
  onRemove,
}: {
  title: string;
  items: string[];
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#5f4d56]">{title}</h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-xs font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Agregar
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={item}
                onChange={(event) => onChange(index, event.target.value)}
                className="admin-content-input"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-700 transition hover:bg-red-100"
                aria-label="Quitar elemento"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-[#ead1d9] bg-[#fffafb] px-4 py-3 text-sm text-gray-500">
            No hay elementos todavÃ­a.
          </p>
        )}
      </div>
    </div>
  );
}

function RemoveButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
    >
      <Trash2 className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function MediaListEditor({
  title,
  addLabel,
  items,
  srcLabel,
  textLabel,
  accept = "image/*,video/mp4,video/webm",
  onAdd,
  onChange,
  onRemove,
}: {
  title: string;
  addLabel: string;
  items: { src: string; title: string }[];
  srcLabel: string;
  textLabel: string;
  accept?: string;
  onAdd: () => void;
  onChange: (index: number, item: { src: string; title: string }) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#5f4d56]">{title}</h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-xs font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {addLabel}
        </button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={`${item.src}-${index}`} className="rounded-lg bg-[#fffafb] p-4">
            <div
              className="mb-4 flex aspect-video items-center justify-center rounded-lg border border-[#ead1d9] bg-white bg-cover bg-center text-xs text-gray-400"
              style={item.src ? { backgroundImage: `url("${item.src}")` } : undefined}
            >
              {!item.src ? <ImageIcon className="h-5 w-5" /> : null}
            </div>

            <AdminField label={srcLabel}>
              <div className="space-y-2">
                <input
                  value={item.src}
                  onChange={(event) =>
                    onChange(index, { ...item, src: event.target.value })
                  }
                  className="admin-content-input"
                />
                <UploadButton
                  accept={accept}
                  onUploaded={(url) => onChange(index, { ...item, src: url })}
                />
                <MediaPickerButton
                  accept={accept}
                  onSelect={(asset) => onChange(index, { ...item, src: asset.url })}
                />
              </div>
            </AdminField>

            <div className="mt-3">
              <AdminField label={textLabel}>
                <input
                  value={item.title}
                  onChange={(event) =>
                    onChange(index, { ...item, title: event.target.value })
                  }
                  className="admin-content-input"
                />
              </AdminField>
            </div>

            <RemoveButton label="Quitar" onClick={() => onRemove(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TextPairListEditor({
  title,
  addLabel,
  items,
  textLabel,
  onAdd,
  onChange,
  onRemove,
}: {
  title: string;
  addLabel: string;
  items: { title: string; text: string }[];
  textLabel: string;
  onAdd: () => void;
  onChange: (index: number, item: { title: string; text: string }) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="rounded-lg border border-[#ead1d9] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#5f4d56]">{title}</h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-xs font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {addLabel}
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg bg-[#fffafb] p-4">
            <AdminField label="TÃ­tulo">
              <input
                value={item.title}
                onChange={(event) =>
                  onChange(index, { ...item, title: event.target.value })
                }
                className="admin-content-input"
              />
            </AdminField>

            <div className="mt-3">
              <AdminField label={textLabel}>
                <textarea
                  value={item.text}
                  onChange={(event) =>
                    onChange(index, { ...item, text: event.target.value })
                  }
                  className="admin-content-textarea min-h-24"
                />
              </AdminField>
            </div>

            <RemoveButton label="Quitar" onClick={() => onRemove(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaPickerButton({
  accept,
  onSelect,
}: {
  accept: string;
  onSelect: (asset: MediaAsset) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const expectedType = mediaTypeFromAccept(accept);
  const visibleAssets = assets.filter((asset) => {
    const matchesType = assetMatchesAccept(asset, accept);
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      asset.name.toLowerCase().includes(normalizedQuery) ||
      asset.path.toLowerCase().includes(normalizedQuery);

    return matchesType && matchesQuery;
  });

  async function openLibrary() {
    setIsOpen(true);

    if (assets.length || isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/media");
      const payload = (await response.json()) as {
        ok: boolean;
        assets?: MediaAsset[];
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudieron cargar medios");
      }

      setAssets(payload.assets ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar medios",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function selectAsset(asset: MediaAsset) {
    onSelect(asset);
    setIsOpen(false);
    setQuery("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void openLibrary()}
        className="inline-flex items-center gap-2 rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-xs font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6]"
      >
        <FolderOpen className="h-4 w-4" aria-hidden="true" />
        Elegir de biblioteca
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b2027]/45 px-4 py-6">
          <div className="max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-lg border border-[#ead1d9] bg-white shadow-2xl">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#ead1d9] px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c98fa1]">
                  Biblioteca
                </p>
                <h3 className="mt-1 text-lg font-semibold text-[#5f4d56]">
                  Elegir {expectedType === "video" ? "video" : "imagen"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6]"
              >
                Cerrar
              </button>
            </div>

            <div className="border-b border-[#ead1d9] p-5">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="admin-content-input"
                placeholder="Buscar por nombre o ruta"
              />
              {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
            </div>

            <div className="max-h-[58vh] overflow-y-auto p-5">
              {isLoading ? (
                <div className="rounded-lg border border-dashed border-[#ead1d9] bg-[#fffafb] p-8 text-center text-sm text-gray-500">
                  Cargando medios...
                </div>
              ) : null}

              {!isLoading && visibleAssets.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleAssets.map((asset) => (
                    <button
                      key={asset.path}
                      type="button"
                      onClick={() => selectAsset(asset)}
                      className="overflow-hidden rounded-lg border border-[#ead1d9] bg-white text-left shadow-sm transition hover:border-[#c98fa1] hover:shadow-md"
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
                          <div className="flex flex-col items-center gap-2 text-[#6b5b63]">
                            <FileVideo className="h-9 w-9" aria-hidden="true" />
                            <span className="text-sm font-semibold">Video</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="truncate text-sm font-semibold text-[#5f4d56]">
                          {asset.name}
                        </p>
                        <p className="mt-1 truncate text-xs text-gray-500">
                          {asset.path}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}

              {!isLoading && !visibleAssets.length ? (
                <div className="rounded-lg border border-dashed border-[#ead1d9] bg-[#fffafb] p-8 text-center text-sm text-gray-500">
                  No hay medios para este tipo. Puedes subir uno desde este mismo
                  campo o desde la seccion Medios.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function UploadButton({
  accept,
  onUploaded,
}: {
  accept: string;
  onUploaded: (url: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile(file: File) {
    setIsUploading(true);
    setError("");

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
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.url) {
        throw new Error(payload.error || "No se pudo subir el archivo");
      }

      onUploaded(payload.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "No se pudo subir el archivo",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-xs font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6]">
        <Upload className="h-4 w-4" aria-hidden="true" />
        {isUploading ? "Subiendo..." : "Subir archivo"}
        <input
          type="file"
          accept={accept}
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

      {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
