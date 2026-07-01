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

async function sendLeadToWebhook(lead: Lead) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    await appendLeadLocally(lead);
    return "local";
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

  return "webhook";
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
        request.headers.get("referer") ??
        parsedLead.data.landingPage ??
        parsedLead.data.page,
      userAgent: request.headers.get("user-agent") ?? "",
      ip,
    };

    const destination = await sendLeadToWebhook(lead);

    return jsonResponse({
      ok: true,
      destination,
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
