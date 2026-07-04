import AdminNav from "@/components/AdminNav";
import { LeadRecord, ReservationRecord, leadStatusLabels } from "@/lib/supabase-leads";

type AdminMetricsDashboardProps = {
  leads: LeadRecord[];
  reservations: ReservationRecord[];
};

function dayKey(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(date));
}

function groupCount<T>(items: T[], getKey: (item: T) => string) {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    const key = getKey(item) || "Sin dato";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value);
}

function lastDaysLeads(leads: LeadRecord[]) {
  const now = new Date();
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (13 - index));
    return {
      raw: date.toDateString(),
      label: dayKey(date.toISOString()),
      value: 0,
    };
  });

  leads.forEach((lead) => {
    const day = new Date(lead.created_at).toDateString();
    const bucket = days.find((item) => item.raw === day);
    if (bucket) bucket.value += 1;
  });

  return days;
}

export default function AdminMetricsDashboard({
  leads,
  reservations,
}: AdminMetricsDashboardProps) {
  const byDay = lastDaysLeads(leads);
  const byTreatment = groupCount(leads, (lead) => lead.treatment).slice(0, 8);
  const bySource = groupCount(leads, (lead) => lead.utm_source || "Directo").slice(0, 8);
  const byStatus = groupCount(
    leads,
    (lead) => leadStatusLabels[lead.status],
  );
  const maxDay = Math.max(...byDay.map((item) => item.value), 1);
  const maxTreatment = Math.max(...byTreatment.map((item) => item.value), 1);
  const bookedCount = leads.filter((lead) => lead.status === "booked").length;
  const conversion = leads.length > 0 ? Math.round((bookedCount / leads.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#f8f3f5] text-[#473a42]">
      <header className="border-b border-[#ead1d9] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[#c98fa1]">
            Panel admin
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#5f4d56]">
            Métricas avanzadas
          </h1>
          <AdminNav />
        </div>
      </header>

      <section className="mx-auto max-w-7xl space-y-5 px-5 py-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total leads" value={leads.length} />
          <MetricCard label="Reservas" value={reservations.length} />
          <MetricCard label="Conversión a reservado" value={`${conversion}%`} />
          <MetricCard label="Tratamientos únicos" value={byTreatment.length} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#5f4d56]">
              Leads últimos 14 días
            </h2>
            <div className="mt-5 max-w-full overflow-x-auto pb-2">
              <div className="flex h-64 min-w-[520px] items-end gap-2">
                {byDay.map((item) => (
                  <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t bg-[#c98fa1]"
                      style={{ height: `${Math.max((item.value / maxDay) * 210, 6)}px` }}
                      title={`${item.label}: ${item.value}`}
                    />
                    <span className="text-[11px] text-gray-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#5f4d56]">
              Estado de leads
            </h2>
            <div className="mt-5 space-y-3">
              {byStatus.map((item) => (
                <ProgressRow key={item.label} item={item} max={leads.length || 1} />
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <section className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#5f4d56]">
              Tratamientos más consultados
            </h2>
            <div className="mt-5 space-y-3">
              {byTreatment.map((item) => (
                <ProgressRow key={item.label} item={item} max={maxTreatment} />
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#5f4d56]">
              Fuentes y campañas
            </h2>
            <div className="mt-5 space-y-3">
              {bySource.map((item) => (
                <ProgressRow key={item.label} item={item} max={leads.length || 1} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-[#ead1d9] bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.16em] text-[#9d828d]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-[#5f4d56]">{value}</p>
    </div>
  );
}

function ProgressRow({
  item,
  max,
}: {
  item: { label: string; value: number };
  max: number;
}) {
  return (
    <div>
      <div className="flex justify-between gap-3 text-sm">
        <span className="truncate font-medium text-[#5f4d56]">{item.label}</span>
        <span className="text-gray-500">{item.value}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f4e8ed]">
        <div
          className="h-full rounded-full bg-[#c98fa1]"
          style={{ width: `${Math.max((item.value / max) * 100, 4)}%` }}
        />
      </div>
    </div>
  );
}
