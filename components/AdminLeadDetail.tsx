"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  FileText,
  MessageCircle,
  Save,
} from "lucide-react";
import {
  LeadEvent,
  LeadRecord,
  LeadStatus,
  leadStatusLabels,
} from "@/lib/supabase-leads";
import AdminNav from "@/components/AdminNav";

type AdminLeadDetailProps = {
  initialLead: LeadRecord;
  initialEvents: LeadEvent[];
};

type TimelineItem = {
  id: string;
  createdAt: string;
  title: string;
  description?: string | null;
};

const statusOptions = Object.entries(leadStatusLabels) as [
  LeadStatus,
  string,
][];

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusClass(status: LeadStatus) {
  const styles: Record<LeadStatus, string> = {
    new: "bg-[#fff3f6] text-[#9f6276] ring-[#ead1d9]",
    contacted: "bg-blue-50 text-blue-700 ring-blue-100",
    booked: "bg-green-50 text-green-700 ring-green-100",
    no_response: "bg-amber-50 text-amber-700 ring-amber-100",
    discarded: "bg-red-50 text-red-700 ring-red-100",
    archived: "bg-gray-100 text-gray-600 ring-gray-200",
  };

  return styles[status];
}

function getWhatsappUrl(lead: LeadRecord) {
  const phone = lead.phone.replace(/[^\d]/g, "");
  const message = [
    `Hola ${lead.name}, soy del equipo de la Dra. Luciana Karki Martín.`,
    `Te escribimos por tu consulta sobre ${lead.treatment}.`,
    "¿Te gustaría que coordinemos una valoración médica?",
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function buildTimeline(lead: LeadRecord, events: LeadEvent[]) {
  const timeline: TimelineItem[] = [
    {
      id: `${lead.id}-created`,
      createdAt: lead.created_at,
      title: "Lead recibido",
      description: lead.treatment,
    },
  ];

  if (lead.contacted_at) {
    timeline.push({
      id: `${lead.id}-contacted`,
      createdAt: lead.contacted_at,
      title: "Marcado como contactado",
    });
  }

  if (lead.booked_at) {
    timeline.push({
      id: `${lead.id}-booked`,
      createdAt: lead.booked_at,
      title: "Marcado como reservado",
    });
  }

  if (lead.archived_at) {
    timeline.push({
      id: `${lead.id}-archived`,
      createdAt: lead.archived_at,
      title: "Archivado",
    });
  }

  events.forEach((event) => {
    timeline.push({
      id: event.id,
      createdAt: event.created_at,
      title: event.title,
      description: event.description,
    });
  });

  return timeline.sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export default function AdminLeadDetail({
  initialLead,
  initialEvents,
}: AdminLeadDetailProps) {
  const [lead, setLead] = useState(initialLead);
  const [events, setEvents] = useState(initialEvents);
  const [status, setStatus] = useState<LeadStatus>(initialLead.status);
  const [notes, setNotes] = useState(initialLead.notes ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const timeline = useMemo(() => buildTimeline(lead, events), [lead, events]);

  async function saveLead() {
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          notes,
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        lead?: LeadRecord;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.lead) {
        throw new Error(payload.error || "No se pudo guardar el lead");
      }

      const now = new Date().toISOString();
      const newEvents: LeadEvent[] = [];

      if (status !== lead.status) {
        newEvents.push({
          id: crypto.randomUUID(),
          lead_id: lead.id,
          created_at: now,
          event_type: "status_changed",
          title: `Estado actualizado a ${leadStatusLabels[status]}`,
          description: null,
          metadata: { status },
        });
      }

      if (notes !== (lead.notes ?? "")) {
        newEvents.push({
          id: crypto.randomUUID(),
          lead_id: lead.id,
          created_at: now,
          event_type: "note_updated",
          title: "Notas internas actualizadas",
          description: notes,
          metadata: null,
        });
      }

      setLead(payload.lead);
      setEvents((currentEvents) => [...newEvents, ...currentEvents]);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar el lead",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f3f5] text-[#473a42]">
      <header className="border-b border-[#ead1d9] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#8b6875] transition hover:text-[#5f4d56]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Volver al panel
            </Link>
            <h1 className="mt-3 text-2xl font-semibold text-[#5f4d56]">
              {lead.name}
            </h1>
            <p className="mt-1 text-sm text-gray-600">{lead.treatment}</p>
            <AdminNav />
          </div>

          <a
            href={getWhatsappUrl(lead)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp con mensaje listo
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <div className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusClass(lead.status)}`}
              >
                {leadStatusLabels[lead.status]}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {formatDate(lead.created_at)}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <DetailItem label="Teléfono" value={lead.phone} />
              <DetailItem label="Tratamiento" value={lead.treatment} />
              <DetailItem label="Página" value={lead.page || "-"} />
              <DetailItem label="Source" value={lead.source || "-"} />
            </div>
          </div>

          <div className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#5f4d56]">
              Gestión del lead
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
              <label className="block">
                <span className="text-sm font-medium text-[#5f4d56]">
                  Estado
                </span>
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as LeadStatus)
                  }
                  className="mt-2 w-full rounded-lg border border-[#ead1d9] bg-[#fffafb] px-3 py-2.5 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                >
                  {statusOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-[#5f4d56]">
                  Notas internas
                </span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="mt-2 min-h-32 w-full rounded-lg border border-[#ead1d9] bg-[#fffafb] px-3 py-2.5 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                  placeholder="Notas internas"
                />
              </label>
            </div>

            {error ? (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              disabled={isSaving}
              onClick={saveLead}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#c98fa1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bd7f93] disabled:cursor-wait disabled:opacity-60"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {isSaving ? "Guardando" : "Guardar cambios"}
            </button>
          </div>

          <div className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#5f4d56]">Mensaje</h2>
            <p className="mt-3 rounded-lg bg-[#faf7f8] p-4 text-sm leading-7 text-gray-700">
              {lead.message || "Sin mensaje"}
            </p>
          </div>

          <div className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#5f4d56]">
              Origen y campaña
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <DetailItem label="Landing page" value={lead.landing_page || "-"} />
              <DetailItem label="Referrer" value={lead.referrer || "-"} />
              <DetailItem label="UTM source" value={lead.utm_source || "-"} />
              <DetailItem label="UTM medium" value={lead.utm_medium || "-"} />
              <DetailItem label="UTM campaign" value={lead.utm_campaign || "-"} />
              <DetailItem label="IP" value={lead.ip || "-"} />
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#5f4d56]">Historial</h2>
          <div className="mt-4 space-y-4">
            {timeline.map((item) => (
              <div key={item.id} className="flex gap-3">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff3f6] text-[#c98fa1]">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#5f4d56]">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(item.createdAt)}
                  </p>
                  {item.description ? (
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#9d828d]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm leading-6 text-[#5f4d56]">
        {value}
      </p>
    </div>
  );
}
