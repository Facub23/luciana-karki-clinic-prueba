import crypto from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "lk_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function signSession(timestamp: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(timestamp)
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

export async function createAdminSession() {
  const cookieStore = await cookies();
  const timestamp = Date.now().toString();
  const signature = signSession(timestamp);

  cookieStore.set(ADMIN_COOKIE_NAME, `${timestamp}.${signature}`, {
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
  const issuedAt = Number(timestamp);

  if (!timestamp || !signature || Number.isNaN(issuedAt)) {
    return false;
  }

  if (Date.now() - issuedAt > SESSION_TTL_MS) {
    return false;
  }

  return safeEqual(signature, signSession(timestamp));
}

export function isValidAdminPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return false;
  }

  return safeEqual(password, adminPassword);
}
