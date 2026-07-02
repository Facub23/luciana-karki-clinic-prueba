import crypto from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "lk_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

type AdminSessionPayload = {
  issuedAt: number;
  provider: "password" | "supabase";
  email?: string;
};

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function signSession(value: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function encodePayload(payload: AdminSessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(value: string) {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString()) as
      | AdminSessionPayload
      | null;
  } catch {
    return null;
  }
}

function getAllowedAdminEmails() {
  const rawEmails =
    process.env.ADMIN_ALLOWED_EMAILS || process.env.LEAD_NOTIFICATION_EMAIL_TO || "";

  return rawEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedAdminEmail(email: string) {
  const allowedEmails = getAllowedAdminEmails();

  if (!allowedEmails.length) {
    return false;
  }

  return allowedEmails.includes(email.trim().toLowerCase());
}

export async function createAdminSession(input?: {
  email?: string;
  provider?: "password" | "supabase";
}) {
  const cookieStore = await cookies();
  const payload = encodePayload({
    issuedAt: Date.now(),
    provider: input?.provider ?? "password",
    email: input?.email,
  });
  const signature = signSession(payload);

  cookieStore.set(ADMIN_COOKIE_NAME, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const secret = getSessionSecret();

  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!session) {
    return false;
  }

  const [timestamp, signature] = session.split(".");

  if (!timestamp || !signature) {
    return false;
  }

  if (!safeEqual(signature, signSession(timestamp))) {
    return false;
  }

  const payload = decodePayload(timestamp);

  if (payload) {
    if (Date.now() - payload.issuedAt > SESSION_TTL_MS) {
      return false;
    }

    if (payload.provider === "supabase" && payload.email) {
      return isAllowedAdminEmail(payload.email);
    }

    return payload.provider === "password";
  }

  const issuedAt = Number(timestamp);

  if (Number.isNaN(issuedAt)) {
    return false;
  }

  return Date.now() - issuedAt <= SESSION_TTL_MS;
}

export function isValidAdminPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return false;
  }

  return safeEqual(password, adminPassword);
}

export async function authenticateSupabaseAdmin(input: {
  email: string;
  password: string;
}) {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !input.email || !input.password) {
    return null;
  }

  if (!isAllowedAdminEmail(input.email)) {
    return null;
  }

  const response = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        password: input.password,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    user?: {
      email?: string;
    };
  };
  const email = payload.user?.email;

  if (!email || !isAllowedAdminEmail(email)) {
    return null;
  }

  return { email };
}
