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

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  booked: "Reservado",
  no_response: "No responde",
  discarded: "Descartado",
  archived: "Archivado",
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
