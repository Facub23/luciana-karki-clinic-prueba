import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 6;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(40)
    .regex(/^[+\d\s().-]+$/, "Invalid phone format"),
  treatment: z.string().trim().max(160).optional().default("Valoración"),
  page: z.string().trim().max(300).optional().default(""),
  message: z.string().trim().max(1000).optional().default(""),
  website: z.string().trim().max(200).optional().default(""),
  landingPage: z.string().trim().max(700).optional().default(""),
  referrer: z.string().trim().max(700).optional().default(""),
  utmSource: z.string().trim().max(120).optional().default(""),
  utmMedium: z.string().trim().max(120).optional().default(""),
  utmCampaign: z.string().trim().max(160).optional().default(""),
  utmTerm: z.string().trim().max(160).optional().default(""),
  utmContent: z.string().trim().max(160).optional().default(""),
});

type LeadInput = z.infer<typeof leadSchema>;

type Lead = Omit<LeadInput, "website"> & {
  id: string;
  createdAt: string;
  source: string;
  userAgent: string;
  ip: string;
};

type DatabaseStatus = "supabase" | "supabase_skipped" | "supabase_failed";

type DeliveryResult = {
  database: DatabaseStatus;
  destination: "webhook" | "local" | "webhook_failed";
  warning?: string;
};

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { status });
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  return forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = rateLimitStore.get(ip);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  current.count += 1;
  rateLimitStore.set(ip, current);

  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function formatLeadForEmail(lead: Lead, delivery: DeliveryResult) {
  return [
    `Nuevo lead de ${lead.name}`,
    "",
    `Nombre: ${lead.name}`,
    `Teléfono: ${lead.phone}`,
    `Tratamiento: ${lead.treatment}`,
    `Página: ${lead.page || "-"}`,
    `Landing page: ${lead.landingPage || "-"}`,
    `Referrer: ${lead.referrer || "-"}`,
    `Origen: ${lead.source || "-"}`,
    `UTM source: ${lead.utmSource || "-"}`,
    `UTM medium: ${lead.utmMedium || "-"}`,
    `UTM campaign: ${lead.utmCampaign || "-"}`,
    `Base de datos: ${delivery.database}`,
    `Google Sheets: ${delivery.destination}`,
    delivery.warning ? `Aviso: ${delivery.warning}` : "",
    "",
    "Mensaje preparado:",
    lead.message || "-",
    "",
    `ID: ${lead.id}`,
    `Fecha: ${lead.createdAt}`,
    `IP: ${lead.ip}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatLeadHtmlForEmail(lead: Lead, delivery: DeliveryResult) {
  const rows = [
    ["Nombre", lead.name],
    ["Teléfono", lead.phone],
    ["Tratamiento", lead.treatment],
    ["Página", lead.page || "-"],
    ["Landing page", lead.landingPage || "-"],
    ["Referrer", lead.referrer || "-"],
    ["Origen", lead.source || "-"],
    ["UTM source", lead.utmSource || "-"],
    ["UTM medium", lead.utmMedium || "-"],
    ["UTM campaign", lead.utmCampaign || "-"],
    ["Base de datos", delivery.database],
    ["Google Sheets", delivery.destination],
    ["Aviso", delivery.warning || "-"],
    ["ID", lead.id],
    ["Fecha", lead.createdAt],
    ["IP", lead.ip],
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#2f2630;line-height:1.5">
      <h2 style="margin:0 0 16px">Nuevo lead de la web</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="border:1px solid #ead1d9;padding:8px;font-weight:700;background:#fff7fa">${label}</td>
                <td style="border:1px solid #ead1d9;padding:8px">${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
      <h3 style="margin:20px 0 8px">Mensaje preparado</h3>
      <pre style="white-space:pre-wrap;background:#faf7f8;border:1px solid #ead1d9;padding:12px;border-radius:10px">${escapeHtml(lead.message || "-")}</pre>
    </div>
  `;
}

function toSupabaseLead(lead: Lead) {
  return {
    id: lead.id,
    created_at: lead.createdAt,
    name: lead.name,
    phone: lead.phone,
    treatment: lead.treatment,
    page: lead.page,
    landing_page: lead.landingPage,
    referrer: lead.referrer,
    message: lead.message,
    source: lead.source,
    utm_source: lead.utmSource,
    utm_medium: lead.utmMedium,
    utm_campaign: lead.utmCampaign,
    utm_term: lead.utmTerm,
    utm_content: lead.utmContent,
    ip: lead.ip,
    user_agent: lead.userAgent,
    status: "new",
  };
}

async function appendLeadLocally(lead: Lead) {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "leads.json");

  await mkdir(dataDir, { recursive: true });

  let leads: Lead[] = [];

  try {
    const current = await readFile(filePath, "utf8");
    leads = JSON.parse(current) as Lead[];
  } catch {
    leads = [];
  }

  leads.push(lead);
  await writeFile(filePath, `${JSON.stringify(leads, null, 2)}\n`, "utf8");
}

async function saveLeadToSupabase(lead: Lead): Promise<DatabaseStatus> {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return "supabase_skipped";
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(toSupabaseLead(lead)),
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(
        `Supabase failed with status ${response.status}: ${responseText}`,
      );
    }

    return "supabase";
  } catch (error) {
    console.error("Supabase lead insert failed", error);
    return "supabase_failed";
  }
}

async function sendLeadToWebhook(lead: Lead) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    await appendLeadLocally(lead);
    return "local" as const;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    throw new Error(`Webhook failed with status ${response.status}`);
  }

  const responseText = await response.text();

  try {
    const parsedResponse = JSON.parse(responseText) as { ok?: boolean };

    if (parsedResponse.ok !== true) {
      throw new Error("Webhook did not confirm success");
    }
  } catch {
    throw new Error("Webhook response was not valid JSON");
  }

  return "webhook" as const;
}

async function deliverLead(
  lead: Lead,
  database: DatabaseStatus,
): Promise<DeliveryResult> {
  try {
    const destination = await sendLeadToWebhook(lead);
    const warning =
      database === "supabase_failed"
        ? "Supabase no confirmó el guardado. Sheets y email siguen funcionando."
        : undefined;

    return { database, destination, warning };
  } catch (error) {
    console.error("Lead webhook delivery failed", error);

    try {
      await appendLeadLocally(lead);
    } catch (localError) {
      console.error("Lead local fallback failed", localError);
    }

    return {
      database,
      destination: "webhook_failed",
      warning:
        "Google Sheets no confirmó el guardado. El usuario igualmente continuará por WhatsApp.",
    };
  }
}

async function sendLeadEmailNotification(lead: Lead, delivery: DeliveryResult) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notificationTo = process.env.LEAD_NOTIFICATION_EMAIL_TO;
  const notificationFrom =
    process.env.LEAD_NOTIFICATION_EMAIL_FROM ||
    "Dra. Luciana Karki <onboarding@resend.dev>";

  if (!resendApiKey || !notificationTo) {
    return "skipped";
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: notificationFrom,
      to: notificationTo
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean),
      subject: `Nuevo lead: ${lead.treatment} - ${lead.name}`,
      text: formatLeadForEmail(lead, delivery),
      html: formatLeadHtmlForEmail(lead, delivery),
    }),
  });

  if (!response.ok) {
    throw new Error(`Email notification failed with status ${response.status}`);
  }

  return "sent";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  try {
    let rawLead: unknown;

    try {
      rawLead = await request.json();
    } catch {
      return jsonResponse(
        {
          ok: false,
          error: "Solicitud inválida. Revisa el formato de los datos.",
        },
        400,
      );
    }

    const parsedLead = leadSchema.safeParse(rawLead);

    if (!parsedLead.success) {
      return jsonResponse(
        {
          ok: false,
          error: "Datos inválidos. Revisa nombre, teléfono y tratamiento.",
        },
        400,
      );
    }

    if (parsedLead.data.website) {
      return jsonResponse({
        ok: true,
        destination: "spam-filter",
      });
    }

    if (isRateLimited(ip)) {
      return jsonResponse(
        {
          ok: false,
          error:
            "Hemos recibido varias solicitudes seguidas. Inténtalo nuevamente en unos minutos.",
        },
        429,
      );
    }

    const lead: Lead = {
      name: parsedLead.data.name,
      phone: parsedLead.data.phone,
      treatment: parsedLead.data.treatment,
      page: parsedLead.data.page,
      message: parsedLead.data.message,
      landingPage: parsedLead.data.landingPage,
      referrer: parsedLead.data.referrer,
      utmSource: parsedLead.data.utmSource,
      utmMedium: parsedLead.data.utmMedium,
      utmCampaign: parsedLead.data.utmCampaign,
      utmTerm: parsedLead.data.utmTerm,
      utmContent: parsedLead.data.utmContent,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      source:
        request.headers.get("referer") ||
        parsedLead.data.landingPage ||
        parsedLead.data.page,
      userAgent: request.headers.get("user-agent") ?? "",
      ip,
    };

    const database = await saveLeadToSupabase(lead);
    const delivery = await deliverLead(lead, database);
    let emailNotification = "skipped";

    try {
      emailNotification = await sendLeadEmailNotification(lead, delivery);
    } catch (emailError) {
      console.error("Lead email notification failed", emailError);
      emailNotification = "failed";
    }

    return jsonResponse({
      ok: true,
      database,
      destination: delivery.destination,
      emailNotification,
      warning: delivery.warning,
    });
  } catch (error) {
    console.error("Lead submission failed", error);

    return jsonResponse(
      {
        ok: false,
        error:
          "No pudimos guardar la solicitud, pero puedes continuar por WhatsApp.",
      },
      500,
    );
  }
}
