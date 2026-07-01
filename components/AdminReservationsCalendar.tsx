"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, LogOut, Save } from "lucide-react";
import AdminNav from "@/components/AdminNav";
import {
  LeadRecord,
  ReservationRecord,
  reservationStatusLabels,
} from "@/lib/supabase-leads";

type AdminReservationsCalendarProps = {
  initialReservations: ReservationRecord[];
  leads: LeadRecord[];
};

function dateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function monthTitle(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function sameDay(left: Date, right: Date) {
  return left.toDateString() === right.toDateString();
}

function buildMonthDays(date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = new Date(firstDay);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  start.setDate(firstDay.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export default function AdminReservationsCalendar({
  initialReservations,
  leads,
}: AdminReservationsCalendarProps) {
  const [reservations, setReservations] = useState(initialReservations);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [treatment, setTreatment] = useState("");
  const [date, setDate] = useState(dateInputValue(new Date()));
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const monthDays = useMemo(() => buildMonthDays(currentMonth), [currentMonth]);
  const selectedReservations = reservations.filter((reservation) =>
    sameDay(new Date(reservation.starts_at), selectedDate),
  );

  function previousMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  }

  function nextMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  }

  function fillFromLead(leadId: string) {
    const lead = leads.find((item) => item.id === leadId);
    if (!lead) return;
    setPatientName(lead.name);
    setPhone(lead.phone);
    setTreatment(lead.treatment);
  }

  async function createNewReservation() {
    setIsSaving(true);
    setMessage("");

    try {
      const startsAt = new Date(`${date}T${time}:00`).toISOString();
      const response = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientName,
          phone,
          treatment,
          startsAt,
          notes,
        }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        reservation?: ReservationRecord;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.reservation) {
        throw new Error(payload.error || "No se pudo crear la reserva");
      }

      setReservations((current) =>
        [...current, payload.reservation!].sort(
          (left, right) =>
            new Date(left.starts_at).getTime() -
            new Date(right.starts_at).getTime(),
        ),
      );
      setSelectedDate(new Date(payload.reservation.starts_at));
      setPatientName("");
      setPhone("");
      setTreatment("");
      setNotes("");
      setMessage("Reserva creada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo crear");
    } finally {
      setIsSaving(false);
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
              Reservas y calendario
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

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={previousMonth}
              className="rounded-lg border border-[#ead1d9] px-3 py-2 text-sm hover:bg-[#fff3f6]"
            >
              Anterior
            </button>
            <h2 className="text-lg font-semibold capitalize text-[#5f4d56]">
              {monthTitle(currentMonth)}
            </h2>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-lg border border-[#ead1d9] px-3 py-2 text-sm hover:bg-[#fff3f6]"
            >
              Siguiente
            </button>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#9d828d]">
            {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2">
            {monthDays.map((day) => {
              const dayReservations = reservations.filter((reservation) =>
                sameDay(new Date(reservation.starts_at), day),
              );
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isSelected = sameDay(day, selectedDate);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => {
                    setSelectedDate(day);
                    setDate(dateInputValue(day));
                  }}
                  className={`min-h-24 rounded-lg border p-2 text-left transition ${
                    isSelected
                      ? "border-[#c98fa1] bg-[#fff3f6]"
                      : "border-[#ead1d9] bg-white hover:bg-[#fffafb]"
                  } ${isCurrentMonth ? "" : "opacity-45"}`}
                >
                  <span className="text-sm font-semibold">{day.getDate()}</span>
                  <div className="mt-2 space-y-1">
                    {dayReservations.slice(0, 2).map((reservation) => (
                      <p
                        key={reservation.id}
                        className="truncate rounded bg-[#f7dfe7] px-1.5 py-1 text-[11px] text-[#7a5664]"
                      >
                        {new Date(reservation.starts_at).toLocaleTimeString(
                          "es-ES",
                          { hour: "2-digit", minute: "2-digit" },
                        )}{" "}
                        {reservation.patient_name}
                      </p>
                    ))}
                    {dayReservations.length > 2 ? (
                      <p className="text-[11px] text-gray-500">
                        +{dayReservations.length - 2} más
                      </p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#5f4d56]">
              {selectedDate.toLocaleDateString("es-ES", {
                dateStyle: "full",
              })}
            </h2>
            <div className="mt-4 space-y-3">
              {selectedReservations.length === 0 ? (
                <p className="text-sm text-gray-500">No hay reservas.</p>
              ) : (
                selectedReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="rounded-lg border border-[#ead1d9] bg-[#fffafb] p-3"
                  >
                    <p className="font-semibold text-[#5f4d56]">
                      {reservation.patient_name}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(reservation.starts_at).toLocaleTimeString(
                        "es-ES",
                        { hour: "2-digit", minute: "2-digit" },
                      )}{" "}
                      · {reservation.treatment}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {reservationStatusLabels[reservation.status]}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#5f4d56]">
              <CalendarPlus className="h-5 w-5" aria-hidden="true" />
              Nueva reserva
            </h2>

            <div className="mt-4 space-y-3">
              <select
                onChange={(event) => fillFromLead(event.target.value)}
                className="w-full rounded-lg border border-[#ead1d9] bg-[#fffafb] px-3 py-2.5 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                defaultValue=""
              >
                <option value="">Completar desde lead</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} · {lead.treatment}
                  </option>
                ))}
              </select>

              <input
                value={patientName}
                onChange={(event) => setPatientName(event.target.value)}
                placeholder="Nombre paciente"
                className="w-full rounded-lg border border-[#ead1d9] bg-[#fffafb] px-3 py-2.5 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
              />
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Teléfono"
                className="w-full rounded-lg border border-[#ead1d9] bg-[#fffafb] px-3 py-2.5 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
              />
              <input
                value={treatment}
                onChange={(event) => setTreatment(event.target.value)}
                placeholder="Tratamiento"
                className="w-full rounded-lg border border-[#ead1d9] bg-[#fffafb] px-3 py-2.5 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  type="date"
                  className="w-full rounded-lg border border-[#ead1d9] bg-[#fffafb] px-3 py-2.5 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                />
                <input
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  type="time"
                  className="w-full rounded-lg border border-[#ead1d9] bg-[#fffafb] px-3 py-2.5 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                />
              </div>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Notas"
                className="min-h-24 w-full rounded-lg border border-[#ead1d9] bg-[#fffafb] px-3 py-2.5 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
              />

              {message ? (
                <p className="rounded-lg bg-[#fffafb] px-3 py-2 text-sm text-[#5f4d56]">
                  {message}
                </p>
              ) : null}

              <button
                type="button"
                disabled={isSaving}
                onClick={createNewReservation}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#c98fa1] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#bd7f93] disabled:cursor-wait disabled:opacity-60"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                {isSaving ? "Guardando" : "Crear reserva"}
              </button>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
