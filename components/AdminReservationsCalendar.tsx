"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, Edit3, LogOut, Save, Trash2, XCircle } from "lucide-react";
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

type ReservationFilter = "all" | "upcoming" | "past";

function dateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function timeInputValue(date: Date) {
  return date.toTimeString().slice(0, 5);
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

function sortReservations(left: ReservationRecord, right: ReservationRecord) {
  return new Date(left.starts_at).getTime() - new Date(right.starts_at).getTime();
}

export default function AdminReservationsCalendar({
  initialReservations,
  leads,
}: AdminReservationsCalendarProps) {
  const [reservations, setReservations] = useState(
    [...initialReservations].sort(sortReservations),
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [treatment, setTreatment] = useState("");
  const [date, setDate] = useState(dateInputValue(new Date()));
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<ReservationFilter>("all");
  const [filterNow] = useState(() => Date.now());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPatientName, setEditPatientName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editTreatment, setEditTreatment] = useState("");
  const [editDate, setEditDate] = useState(dateInputValue(new Date()));
  const [editTime, setEditTime] = useState("10:00");
  const [editNotes, setEditNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const monthDays = useMemo(() => buildMonthDays(currentMonth), [currentMonth]);
  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const startsAt = new Date(reservation.starts_at).getTime();

      if (filter === "upcoming") return startsAt >= filterNow;
      if (filter === "past") return startsAt < filterNow;
      return true;
    });
  }, [filter, filterNow, reservations]);
  const selectedReservations = filteredReservations
    .filter((reservation) => sameDay(new Date(reservation.starts_at), selectedDate))
    .sort(sortReservations);

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

  function startEditing(reservation: ReservationRecord) {
    const startsAt = new Date(reservation.starts_at);

    setEditingId(reservation.id);
    setEditPatientName(reservation.patient_name);
    setEditPhone(reservation.phone);
    setEditTreatment(reservation.treatment);
    setEditDate(dateInputValue(startsAt));
    setEditTime(timeInputValue(startsAt));
    setEditNotes(reservation.notes ?? "");
    setMessage("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditPatientName("");
    setEditPhone("");
    setEditTreatment("");
    setEditNotes("");
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
        [...current, payload.reservation!].sort(sortReservations),
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

  async function saveReservationEdit(id: string) {
    setIsSaving(true);
    setMessage("");

    try {
      const startsAt = new Date(`${editDate}T${editTime}:00`).toISOString();
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientName: editPatientName,
          phone: editPhone,
          treatment: editTreatment,
          startsAt,
          notes: editNotes,
        }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        reservation?: ReservationRecord;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.reservation) {
        throw new Error(payload.error || "No se pudo actualizar la reserva");
      }

      setReservations((current) =>
        current
          .map((reservation) =>
            reservation.id === id ? payload.reservation! : reservation,
          )
          .sort(sortReservations),
      );
      setSelectedDate(new Date(payload.reservation.starts_at));
      setDate(dateInputValue(new Date(payload.reservation.starts_at)));
      cancelEditing();
      setMessage("Reserva actualizada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo actualizar");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteReservation(id: string) {
    const reservation = reservations.find((item) => item.id === id);
    const confirmed = window.confirm(
      `Eliminar la reserva de ${reservation?.patient_name ?? "este paciente"}?`,
    );

    if (!confirmed) {
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo eliminar la reserva");
      }

      setReservations((current) =>
        current.filter((reservation) => reservation.id !== id),
      );
      setMessage("Reserva eliminada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar");
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

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-lg border border-[#ead1d9] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
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

          <div className="mt-4 flex flex-wrap gap-2 rounded-lg border border-[#ead1d9] bg-[#fffafb] p-2">
            {[
              ["all", "Todas"],
              ["upcoming", "Proximas"],
              ["past", "Pasadas"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value as ReservationFilter)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  filter === value
                    ? "bg-[#c98fa1] text-white"
                    : "bg-white text-[#6b5b63] hover:bg-[#fff3f6]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#9d828d]">
            {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2">
            {monthDays.map((day) => {
              const dayReservations = filteredReservations
                .filter((reservation) => sameDay(new Date(reservation.starts_at), day))
                .sort(sortReservations);
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
                        +{dayReservations.length - 2} mas
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
                    {editingId === reservation.id ? (
                      <div className="space-y-3">
                        <input
                          value={editPatientName}
                          onChange={(event) => setEditPatientName(event.target.value)}
                          className="w-full rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                          placeholder="Nombre paciente"
                        />
                        <input
                          value={editPhone}
                          onChange={(event) => setEditPhone(event.target.value)}
                          className="w-full rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                          placeholder="Telefono"
                        />
                        <input
                          value={editTreatment}
                          onChange={(event) => setEditTreatment(event.target.value)}
                          className="w-full rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                          placeholder="Tratamiento"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={editDate}
                            onChange={(event) => setEditDate(event.target.value)}
                            type="date"
                            className="w-full rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                          />
                          <input
                            value={editTime}
                            onChange={(event) => setEditTime(event.target.value)}
                            type="time"
                            className="w-full rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                          />
                        </div>
                        <textarea
                          value={editNotes}
                          onChange={(event) => setEditNotes(event.target.value)}
                          className="min-h-20 w-full rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-sm outline-none focus:border-[#c98fa1] focus:ring-4 focus:ring-[#efd8df]"
                          placeholder="Notas"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => void saveReservationEdit(reservation.id)}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#c98fa1] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#bd7f93] disabled:cursor-wait disabled:opacity-60"
                          >
                            <Save className="h-4 w-4" aria-hidden="true" />
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-xs font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6]"
                          >
                            <XCircle className="h-4 w-4" aria-hidden="true" />
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-3">
                          <div className="flex w-16 shrink-0 flex-col items-center rounded-lg bg-white px-2 py-2 text-[#7a5664]">
                            <span className="text-lg font-semibold">
                              {new Date(reservation.starts_at).toLocaleTimeString(
                                "es-ES",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#5f4d56]">
                              {reservation.patient_name}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                              {reservation.treatment}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {reservation.phone}
                            </p>
                            {reservation.notes ? (
                              <p className="mt-2 rounded-lg bg-white px-3 py-2 text-xs text-gray-600">
                                {reservation.notes}
                              </p>
                            ) : null}
                            <p className="mt-2 text-xs text-gray-400">
                              {reservationStatusLabels[reservation.status]}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => startEditing(reservation)}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#ead1d9] bg-white px-3 py-2 text-xs font-semibold text-[#6b5b63] transition hover:bg-[#fff3f6] disabled:cursor-wait disabled:opacity-60"
                          >
                            <Edit3 className="h-4 w-4" aria-hidden="true" />
                            Editar
                          </button>
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => void deleteReservation(reservation.id)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-wait disabled:opacity-60"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
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
                    {lead.name} - {lead.treatment}
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
                placeholder="Telefono"
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
