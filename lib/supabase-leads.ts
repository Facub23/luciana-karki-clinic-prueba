export type LeadStatus =
  | "new"
  | "contacted"
  | "booked"
  | "no_response"
  | "discarded"
  | "archived";

export type LeadRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  phone: string;
  treatment: string;
  page: string | null;
  landing_page: string | null;
  referrer: string | null;
  message: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  ip: string | null;
  user_agent: string | null;
  status: LeadStatus;
  notes: string | null;
  contacted_at: string | null;
  booked_at: string | null;
  archived_at: string | null;
};

export type LeadEvent = {
  id: string;
  lead_id: string;
  created_at: string;
  event_type: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
};

export type LeadUpdateInput = {
  status?: LeadStatus;
  notes?: string;
};

export type SiteContentRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  section: string;
  label: string;
  content_type: "text" | "textarea" | "url" | "json";
  value: string;
  description: string | null;
};

export type SiteContentDefaultInput = Pick<
  SiteContentRecord,
  "section" | "label" | "content_type" | "value" | "description"
>;

export type ReservationStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type ReservationRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  lead_id: string | null;
  patient_name: string;
  phone: string;
  treatment: string;
  starts_at: string;
  ends_at: string | null;
  status: ReservationStatus;
  notes: string | null;
};

export type ReservationInput = {
  leadId?: string;
  patientName: string;
  phone: string;
  treatment: string;
  startsAt: string;
  endsAt?: string;
  status?: ReservationStatus;
  notes?: string;
};

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  booked: "Reservado",
  no_response: "No responde",
  discarded: "Descartado",
  archived: "Archivado",
};

export const reservationStatusLabels: Record<ReservationStatus, string> = {
  scheduled: "Agendada",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
  no_show: "No asistió",
};

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are not configured");
  }

  return { supabaseUrl, serviceRoleKey };
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}) {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Supabase request failed ${response.status}: ${responseText}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export async function fetchAdminLeads() {
  return supabaseRequest<LeadRecord[]>(
    "leads?select=*&order=created_at.desc&limit=500",
  );
}

export async function fetchAdminLeadEvents() {
  try {
    return await supabaseRequest<LeadEvent[]>(
      "lead_events?select=*&order=created_at.desc&limit=1000",
    );
  } catch (error) {
    console.error("Supabase lead events fetch failed", error);
    return [];
  }
}

export async function fetchAdminLeadById(id: string) {
  const [lead] = await supabaseRequest<LeadRecord[]>(
    `leads?select=*&id=eq.${encodeURIComponent(id)}&limit=1`,
  );

  return lead ?? null;
}

export async function fetchAdminLeadEventsByLeadId(id: string) {
  try {
    return await supabaseRequest<LeadEvent[]>(
      `lead_events?select=*&lead_id=eq.${encodeURIComponent(id)}&order=created_at.desc&limit=200`,
    );
  } catch (error) {
    console.error("Supabase lead events fetch failed", error);
    return [];
  }
}

export async function createLeadEvent(
  leadId: string,
  event: {
    eventType: string;
    title: string;
    description?: string;
    metadata?: Record<string, unknown>;
  },
) {
  try {
    await supabaseRequest<null>("lead_events", {
      method: "POST",
      headers: {
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        lead_id: leadId,
        event_type: event.eventType,
        title: event.title,
        description: event.description ?? null,
        metadata: event.metadata ?? null,
      }),
    });
  } catch (error) {
    console.error("Supabase lead event insert failed", error);
  }
}

export async function updateAdminLead(id: string, input: LeadUpdateInput) {
  const now = new Date().toISOString();
  const payload: Record<string, string | null> = {};

  if (input.status) {
    payload.status = input.status;

    if (input.status === "contacted") {
      payload.contacted_at = now;
    }

    if (input.status === "booked") {
      payload.booked_at = now;
    }

    if (input.status === "archived") {
      payload.archived_at = now;
    }
  }

  if (typeof input.notes === "string") {
    payload.notes = input.notes;
  }

  return supabaseRequest<LeadRecord[]>(
    `leads?id=eq.${encodeURIComponent(id)}&select=*`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    },
  );
}

export async function fetchSiteContent() {
  return supabaseRequest<SiteContentRecord[]>(
    "site_content?select=*&order=section.asc,label.asc",
  );
}

export async function ensureSiteContentDefaults(defaults: SiteContentDefaultInput[]) {
  if (!defaults.length) {
    return;
  }

  try {
    await supabaseRequest<null>(
      "site_content?on_conflict=section,label",
      {
        method: "POST",
        headers: {
          Prefer: "resolution=ignore-duplicates,return=minimal",
        },
        body: JSON.stringify(defaults),
      },
    );
  } catch (error) {
    console.error("Supabase site content defaults insert failed", error);
  }
}

export async function updateSiteContent(
  id: string,
  input: Pick<SiteContentRecord, "value">,
) {
  return supabaseRequest<SiteContentRecord[]>(
    `site_content?id=eq.${encodeURIComponent(id)}&select=*`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        value: input.value,
      }),
    },
  );
}

export async function fetchReservations() {
  return supabaseRequest<ReservationRecord[]>(
    "reservations?select=*&order=starts_at.asc&limit=1000",
  );
}

export async function createReservation(input: ReservationInput) {
  return supabaseRequest<ReservationRecord[]>("reservations?select=*", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      lead_id: input.leadId || null,
      patient_name: input.patientName,
      phone: input.phone,
      treatment: input.treatment,
      starts_at: input.startsAt,
      ends_at: input.endsAt || null,
      status: input.status || "scheduled",
      notes: input.notes || null,
    }),
  });
}

export async function updateReservation(
  id: string,
  input: Partial<ReservationInput>,
) {
  const payload: Record<string, string | null> = {};

  if (typeof input.leadId === "string") payload.lead_id = input.leadId || null;
  if (typeof input.patientName === "string") payload.patient_name = input.patientName;
  if (typeof input.phone === "string") payload.phone = input.phone;
  if (typeof input.treatment === "string") payload.treatment = input.treatment;
  if (typeof input.startsAt === "string") payload.starts_at = input.startsAt;
  if (typeof input.endsAt === "string") payload.ends_at = input.endsAt || null;
  if (typeof input.status === "string") payload.status = input.status;
  if (typeof input.notes === "string") payload.notes = input.notes || null;

  return supabaseRequest<ReservationRecord[]>(
    `reservations?id=eq.${encodeURIComponent(id)}&select=*`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    },
  );
}
