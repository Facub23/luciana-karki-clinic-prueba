"use client";

import { useMemo, useState } from "react";
import {
  CalendarCheck,
  Download,
  Eye,
  FileText,
  LogOut,
  MessageCircle,
  Phone,
  RefreshCw,
  Save,
  Search,
  X,
} from "lucide-react";
import {
  LeadEvent,
  LeadRecord,
  LeadStatus,
  leadStatusLabels,
} from "@/lib/supabase-leads";

type AdminLeadsDashboardProps = {
  initialLeads: LeadRecord[];
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
    dateStyle: "short",
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

function buildCsv(leads: LeadRecord[]) {
  const headers = [
    "Fecha",
    "Nombre",
    "Telefono",
    "Tratamiento",
    "Estado",
    "Notas",
    "Pagina",
    "UTM source",
    "UTM medium",
    "UTM campaign",
  ];

  const rows = leads.map((lead) => [
    lead.created_at,
    lead.name,
    lead.phone,
    lead.treatment,
    leadStatusLabels[lead.status],
    lead.notes ?? "",
    lead.page ?? "",
    lead.utm_source ?? "",
    lead.utm_medium ?? "",
    lead.utm_campaign ?? "",
  ]);

  return [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
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

  events
    .filter((event) => event.lead_id === lead.id)
    .forEach((event) => {
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

export default function AdminLeadsDashboard({
  initialLeads,
  initialEvents,
}: AdminLeadsDashboardProps) {
  const [leads, setLeads] = useState(initialLeads);
  const [events, setEvents] = useState(initialEvents);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(
    initialLeads[0]?.id ?? null,
  );
  const [error, setError] = useState("");

  const treatments = useMemo(
    () => Array.from(new Set(leads.map((lead) => lead.treatment))).sort(),
    [leads],
  );
  const [treatment, setTreatment] = useState("all");

  const selectedLead =
    leads.find((lead) => lead.id === selectedLeadId) ?? leads[0] ?? null;

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          lead.name,
          lead.phone,
          lead.treatment,
          lead.message,
          lead.notes,
          lead.utm_source,
          lead.utm_campaign,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedQuery));
      const matchesStatus = status === "all" || lead.status === status;
      const matchesTreatment =
        treatment === "all" || lead.treatment === treatment;

      return matchesQuery && matchesStatus && matchesTreatment;
    });
  }, [leads, query, status, treatment]);

  const metrics = useMemo(() => {
    const today = new Date().toDateString();

    return {
      total: leads.length,
      today: leads.filter(
        (lead) => new Date(lead.created_at).toDateString() === today,
      ).length,
      new: leads.filter((lead) => lead.status === "new").length,
      booked: leads.filter((lead) => lead.status === "booked").length,
    };
  }, [leads]);

  async function updateLead(id: string, changes: Partial<LeadRecord>) {
    setError("");
    setSavingId(id);

    const currentLead = leads.find((lead) => lead.id === id);

    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: changes.status,
          notes: changes.notes,
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

      setLeads((currentLeads) =>
        currentLeads.map((lead) => (lead.id === id ? payload.lead! : lead)),
      );

      const newEvents: LeadEvent[] = [];
      const now = new Date().toISOString();

      if (changes.status && changes.status !== currentLead?.status) {
        newEvents.push({
          id: crypto.randomUUID(),
          lead_id: id,
          created_at: now,
          event_type: "status_changed",
          title: `Estado actualizado a ${leadStatusLabels[changes.status]}`,
          description: null,
          metadata: { status: changes.status },
        });
      }

      if (typeof changes.notes === "string" && changes.notes !== currentLead?.notes) {
        newEvents.push({
          id: crypto.randomUUID(),
          lead_id: id,
          created_at: now,
          event_type: "note_updated",
          title: "Notas internas actualizadas",
          description: changes.notes,
          metadata: null,
        });
      }

      if (newEvents.length > 0) {
        setEvents((currentEvents) => [...newEvents, ...currentEvents]);
      }
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "No se pudo guardar el lead",
      );
    } finally {
      setSavingId(null);
    }
  }

  function exportCsv() {
    const csv = buildCsv(filteredLeads);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#f8f3f5] text-[#473a42]">
      <header className="border-b border-[#ead1d9] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#c98fa1]">
              Panel admin
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#5f4d56]">
              Leads y seguimiento
            </h1>
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

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total leads" value={metrics.total} />
            <MetricCard label="Hoy" value={metrics.today} />
            <MetricCard label="Nuevos" value={metrics.new} />
            <MetricCard label="Reservados" value={metrics.booked} />
          </div>

          <div className="mt-5 rounded-lg border border-[#ead1d9] bg-white p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_180px_240px_auto_auto]">
              <label className="relative block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9d828d]"
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full rounded-lg border border-[#ead1d9] bg-[#fffafb] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#c98fa1] focus:bg-white focus:ring-4 focus:ring-[#efd8df]"
                  placeholder="Buscar nombre, teléfono, tratamiento, campaña..."
                />
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as LeadStatus | "all")
                }
                className="rounded-lg border border-[#ead1d9] bg-[#fffafb] px-3 py-2.5 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
              >
                <option value="all">Todos los estados</option>
                {statusOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                value={treatment}
                onChange={(event) => setTreatment(event.target.value)}
                className="rounded-lg border border-[#ead1d9] bg-[#fffafb] px-3 py-2.5 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
              >
                <option value="all">Todos los tratamientos</option>
                {treatments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#ead1d9] px-4 py-2.5 text-sm font-medium text-[#6b5b63] transition hover:bg-[#fff3f6]"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                CSV
              </button>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c98fa1] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#bd7f93]"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Actualizar
              </button>
            </div>

            {error ? (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-[#ead1d9] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full border-collapse text-left text-sm">
                <thead className="bg-[#fff7fa] text-xs uppercase tracking-[0.12em] text-[#8b6875]">
                  <tr>
                    <th className="px-4 py-3">Lead</th>
                    <th className="px-4 py-3">Tratamiento</th>
                    <th className="px-4 py-3">Origen</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Notas</th>
                    <th className="px-4 py-3">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0dde4]">
                  {filteredLeads.map((lead) => (
                    <LeadRow
                      key={lead.id}
                      lead={lead}
                      selected={selectedLead?.id === lead.id}
                      saving={savingId === lead.id}
                      onSelect={() => setSelectedLeadId(lead.id)}
                      onSave={updateLead}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-gray-500">
                No hay leads con esos filtros.
              </div>
            ) : null}
          </div>
        </div>

        <LeadDetailPanel
          lead={selectedLead}
          events={events}
          onClose={() => setSelectedLeadId(null)}
        />
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[#ead1d9] bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.16em] text-[#9d828d]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-[#5f4d56]">{value}</p>
    </div>
  );
}

function LeadRow({
  lead,
  selected,
  saving,
  onSelect,
  onSave,
}: {
  lead: LeadRecord;
  selected: boolean;
  saving: boolean;
  onSelect: () => void;
  onSave: (id: string, changes: Partial<LeadRecord>) => Promise<void>;
}) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");

  return (
    <tr
      className={`align-top transition hover:bg-[#fffafb] ${
        selected ? "bg-[#fff7fa]" : ""
      }`}
    >
      <td className="px-4 py-4">
        <button
          type="button"
          onClick={onSelect}
          className="text-left font-semibold text-[#5f4d56] underline-offset-4 hover:underline"
        >
          {lead.name}
        </button>
        <div className="mt-2 space-y-1 text-xs text-gray-500">
          <p className="inline-flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {lead.phone}
          </p>
          <p className="flex items-center gap-1.5">
            <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(lead.created_at)}
          </p>
          {lead.message ? (
            <p className="mt-2 max-w-xs leading-5 text-gray-600">
              {lead.message}
            </p>
          ) : null}
        </div>
      </td>

      <td className="px-4 py-4">
        <p className="font-medium text-[#5f4d56]">{lead.treatment}</p>
        <p className="mt-1 text-xs text-gray-500">{lead.page || "-"}</p>
      </td>

      <td className="px-4 py-4 text-xs text-gray-600">
        <div className="space-y-1">
          <p>
            <span className="font-semibold">UTM:</span>{" "}
            {lead.utm_source || "-"} / {lead.utm_medium || "-"}
          </p>
          <p>
            <span className="font-semibold">Campaña:</span>{" "}
            {lead.utm_campaign || "-"}
          </p>
          <p className="max-w-[220px] truncate">
            <span className="font-semibold">Ref:</span> {lead.referrer || "-"}
          </p>
        </div>
      </td>

      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusClass(lead.status)}`}
        >
          {leadStatusLabels[lead.status]}
        </span>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as LeadStatus)}
          className="mt-3 block w-full rounded-lg border border-[#ead1d9] bg-white px-2.5 py-2 text-xs outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
        >
          {statusOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </td>

      <td className="px-4 py-4">
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="min-h-24 w-full min-w-[240px] rounded-lg border border-[#ead1d9] bg-[#fffafb] px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:bg-white focus:ring-4 focus:ring-[#efd8df]"
          placeholder="Notas internas"
        />
      </td>

      <td className="px-4 py-4">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(lead.id, { status, notes })}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c98fa1] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#bd7f93] disabled:cursor-wait disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            {saving ? "Guardando" : "Guardar"}
          </button>

          <button
            type="button"
            onClick={onSelect}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#ead1d9] px-3 py-2 text-xs font-medium text-[#6b5b63] transition hover:bg-[#fff3f6]"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            Detalle
          </button>

          <a
            href={getWhatsappUrl(lead)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 transition hover:bg-green-100"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </td>
    </tr>
  );
}

function LeadDetailPanel({
  lead,
  events,
  onClose,
}: {
  lead: LeadRecord | null;
  events: LeadEvent[];
  onClose: () => void;
}) {
  if (!lead) {
    return (
      <aside className="rounded-lg border border-[#ead1d9] bg-white p-6 text-sm text-gray-500 shadow-sm">
        Selecciona un lead para ver el detalle.
      </aside>
    );
  }

  const timeline = buildTimeline(lead, events);

  return (
    <aside className="sticky top-5 max-h-[calc(100vh-40px)] overflow-y-auto rounded-lg border border-[#ead1d9] bg-white shadow-sm">
      <div className="border-b border-[#ead1d9] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#c98fa1]">
              Detalle del lead
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#5f4d56]">
              {lead.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-[#fff3f6] hover:text-[#6b5b63]"
            aria-label="Cerrar detalle"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusClass(lead.status)}`}
          >
            {leadStatusLabels[lead.status]}
          </span>
          <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {formatDate(lead.created_at)}
          </span>
        </div>

        <a
          href={getWhatsappUrl(lead)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Escribir WhatsApp con mensaje listo
        </a>
      </div>

      <div className="space-y-5 p-5">
        <DetailSection title="Contacto">
          <DetailItem label="Teléfono" value={lead.phone} />
          <DetailItem label="Tratamiento" value={lead.treatment} />
          <DetailItem label="Página" value={lead.page || "-"} />
        </DetailSection>

        <DetailSection title="Mensaje">
          <p className="rounded-lg bg-[#faf7f8] p-3 text-sm leading-6 text-gray-700">
            {lead.message || "Sin mensaje"}
          </p>
        </DetailSection>

        <DetailSection title="Origen y campaña">
          <DetailItem label="Landing" value={lead.landing_page || "-"} />
          <DetailItem label="Referrer" value={lead.referrer || "-"} />
          <DetailItem label="UTM source" value={lead.utm_source || "-"} />
          <DetailItem label="UTM medium" value={lead.utm_medium || "-"} />
          <DetailItem label="UTM campaign" value={lead.utm_campaign || "-"} />
          <DetailItem label="IP" value={lead.ip || "-"} />
        </DetailSection>

        <DetailSection title="Notas internas">
          <p className="rounded-lg bg-[#faf7f8] p-3 text-sm leading-6 text-gray-700">
            {lead.notes || "Sin notas"}
          </p>
        </DetailSection>

        <DetailSection title="Historial">
          <div className="space-y-3">
            {timeline.map((item) => (
              <div key={item.id} className="flex gap-3">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff3f6] text-[#c98fa1]">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
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
        </DetailSection>
      </div>
    </aside>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9d828d]">
        {title}
      </h3>
      <div className="mt-3 space-y-2">{children}</div>
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="break-words text-sm leading-6 text-[#5f4d56]">{value}</p>
    </div>
  );
}
