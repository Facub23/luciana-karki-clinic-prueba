"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarCheck,
  Download,
  Eye,
  LogOut,
  MessageCircle,
  Phone,
  RefreshCw,
  Save,
  Search,
} from "lucide-react";
import {
  LeadRecord,
  LeadStatus,
  leadStatusLabels,
} from "@/lib/supabase-leads";
import AdminNav from "@/components/AdminNav";

type AdminLeadsDashboardProps = {
  initialLeads: LeadRecord[];
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

export default function AdminLeadsDashboard({
  initialLeads,
}: AdminLeadsDashboardProps) {
  const [leads, setLeads] = useState(initialLeads);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const treatments = useMemo(
    () => Array.from(new Set(leads.map((lead) => lead.treatment))).sort(),
    [leads],
  );
  const [treatment, setTreatment] = useState("all");

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
            <table className="min-w-[1120px] w-full border-collapse text-left text-sm">
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
                    saving={savingId === lead.id}
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
  saving,
  onSave,
}: {
  lead: LeadRecord;
  saving: boolean;
  onSave: (id: string, changes: Partial<LeadRecord>) => Promise<void>;
}) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");

  return (
    <tr className="align-top transition hover:bg-[#fffafb]">
      <td className="px-4 py-4">
        <Link
          href={`/admin/leads/${lead.id}`}
          className="font-semibold text-[#5f4d56] underline-offset-4 hover:underline"
        >
          {lead.name}
        </Link>
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

          <Link
            href={`/admin/leads/${lead.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#ead1d9] px-3 py-2 text-xs font-medium text-[#6b5b63] transition hover:bg-[#fff3f6]"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            Detalle
          </Link>

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
