import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const BUCKET_NAME = "site-assets";
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
];

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are not configured");
  }

  return { supabaseUrl, serviceRoleKey };
}

function sanitizeFileName(name: string) {
  const [baseName = "archivo", extension = ""] = name.split(/(?=\.[^.]+$)/);
  const safeBaseName = baseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${safeBaseName || "archivo"}${extension.toLowerCase()}`;
}

async function ensurePublicBucket() {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };

  const existingBucket = await fetch(
    `${supabaseUrl}/storage/v1/bucket/${BUCKET_NAME}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (existingBucket.ok) {
    return;
  }

  const response = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      id: BUCKET_NAME,
      name: BUCKET_NAME,
      public: true,
      file_size_limit: MAX_FILE_SIZE,
      allowed_mime_types: allowedMimeTypes,
    }),
  });

  if (!response.ok && response.status !== 409) {
    throw new Error(`No se pudo crear el bucket: ${await response.text()}`);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Archivo requerido" },
        { status: 400 },
      );
    }

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: "Formato no permitido" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { ok: false, error: "El archivo supera 25 MB" },
        { status: 400 },
      );
    }

    await ensurePublicBucket();

    const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
    const folder = file.type.startsWith("video/") ? "videos" : "images";
    const objectPath = `${folder}/${Date.now()}-${sanitizeFileName(file.name)}`;
    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/${BUCKET_NAME}/${objectPath}`,
      {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": file.type,
          "x-upsert": "true",
        },
        body: Buffer.from(await file.arrayBuffer()),
      },
    );

    if (!uploadResponse.ok) {
      throw new Error(`No se pudo subir el archivo: ${await uploadResponse.text()}`);
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${objectPath}`;

    return NextResponse.json({
      ok: true,
      url: publicUrl,
      path: objectPath,
      bucket: BUCKET_NAME,
    });
  } catch (error) {
    console.error("Admin upload failed", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "No se pudo subir",
      },
      { status: 500 },
    );
  }
}
