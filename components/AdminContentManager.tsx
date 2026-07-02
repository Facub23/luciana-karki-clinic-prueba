"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { ImageIcon, LogOut, Plus, Save, Trash2 } from "lucide-react";
import AdminNav from "@/components/AdminNav";
import { SiteContentRecord } from "@/lib/supabase-leads";

type AdminContentManagerProps = {
  initialContent: SiteContentRecord[];
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

const treatmentDetailFields = [
  ["duration", "Duración"],
  ["technique", "Técnica"],
  ["comfort", "Confort"],
  ["recovery", "Recuperación"],
  ["results", "Resultados"],
  ["effectDuration", "Duración del efecto"],
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
    const item = items.find((currentItem) => currentItem.id === id);

    if (item?.content_type === "json") {
      try {
        JSON.parse(value);
      } catch {
        setMessage("El JSON no es válido. Revisa comas, comillas y llaves.");
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

          <AdminField label="Categoría">
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

        <AdminField label="Descripción corta">
          <textarea
            value={treatment.shortDescription ?? ""}
            onChange={(event) =>
              updateField("shortDescription", event.target.value)
            }
            className="admin-content-textarea min-h-24"
          />
        </AdminField>

        <AdminField label="Texto principal de la página">
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
            <input
              value={treatment.image ?? ""}
              onChange={(event) => updateField("image", event.target.value)}
              className="admin-content-input"
              placeholder="/images/tratamiento-1.jpeg"
            />
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
            Ficha técnica
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
                  <input
                    value={promotion.src}
                    onChange={(event) =>
                      updatePromotion(index, "src", event.target.value)
                    }
                    className="admin-content-input"
                    placeholder="/images/promocion.jpg"
                  />
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
                alt: "Nueva promoción",
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
      field: "eyebrow" | "title" | "description",
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
            <AdminField label="Título">
              <input
                value={block.title ?? ""}
                onChange={(event) => updateBlockField("title", event.target.value)}
                className="admin-content-input"
              />
            </AdminField>
          ) : null}
        </div>

        {"description" in block ? (
          <AdminField label="Descripción">
            <textarea
              value={block.description ?? ""}
              onChange={(event) =>
                updateBlockField("description", event.target.value)
              }
              className="admin-content-textarea min-h-24"
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
                    <AdminField label="Título">
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
            textLabel="Título"
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
            title="Imágenes"
            addLabel="Agregar imagen"
            items={block.images.map((image) => ({
              src: image.src,
              title: image.alt,
            }))}
            srcLabel="Imagen"
            textLabel="Texto alternativo"
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

  function renderContentEditor(item: SiteContentRecord) {
    if (item.section === "Tratamientos" && item.content_type === "json") {
      return renderTreatmentEditor(item);
    }

    if (item.section === "Promociones" && item.content_type === "json") {
      return renderPromotionsEditor(item);
    }

    if (
      (item.section === "Home" || item.section === "FAQ") &&
      item.content_type === "json"
    ) {
      return renderStructuredBlockEditor(item);
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
          Los cambios quedan guardados en Supabase y ya alimentan los bloques
          principales de la web pública. Seguiremos conectando tratamientos,
          promociones e imágenes por fases.
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
                    <div className="block">
                      <span className="text-sm font-semibold text-[#5f4d56]">
                        {item.label}
                      </span>
                      {item.description ? (
                        <span className="mt-1 block text-xs text-gray-500">
                          {item.description}
                        </span>
                      ) : null}
                      {renderContentEditor(item)}
                    </div>
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
            No hay elementos todavía.
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
  onAdd,
  onChange,
  onRemove,
}: {
  title: string;
  addLabel: string;
  items: { src: string; title: string }[];
  srcLabel: string;
  textLabel: string;
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
              <input
                value={item.src}
                onChange={(event) =>
                  onChange(index, { ...item, src: event.target.value })
                }
                className="admin-content-input"
              />
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
            <AdminField label="Título">
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
