export const mediaBucketName = "site-assets";

export const maxMediaFileSize = 25 * 1024 * 1024;

export const allowedMediaMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
];

export type MediaAsset = {
  name: string;
  path: string;
  url: string;
  type: "image" | "video" | "file";
  size: number | null;
  updatedAt: string | null;
  mimeType: string | null;
};

function getSupabaseStorageConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are not configured");
  }

  return { supabaseUrl, serviceRoleKey };
}

function getStorageHeaders(contentType = "application/json") {
  const { serviceRoleKey } = getSupabaseStorageConfig();

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": contentType,
  };
}

export function getPublicMediaUrl(path: string) {
  const { supabaseUrl } = getSupabaseStorageConfig();

  return `${supabaseUrl}/storage/v1/object/public/${mediaBucketName}/${path}`;
}

export function sanitizeMediaFileName(name: string) {
  const [baseName = "archivo", extension = ""] = name.split(/(?=\.[^.]+$)/);
  const safeBaseName = baseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${safeBaseName || "archivo"}${extension.toLowerCase()}`;
}

export async function ensurePublicMediaBucket() {
  const { supabaseUrl } = getSupabaseStorageConfig();
  const headers = getStorageHeaders();

  const existingBucket = await fetch(
    `${supabaseUrl}/storage/v1/bucket/${mediaBucketName}`,
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
      id: mediaBucketName,
      name: mediaBucketName,
      public: true,
      file_size_limit: maxMediaFileSize,
      allowed_mime_types: allowedMediaMimeTypes,
    }),
  });

  if (!response.ok && response.status !== 409) {
    throw new Error(`No se pudo crear el bucket: ${await response.text()}`);
  }
}

export async function uploadMediaFile(file: File) {
  if (!allowedMediaMimeTypes.includes(file.type)) {
    throw new Error("Formato no permitido");
  }

  if (file.size > maxMediaFileSize) {
    throw new Error("El archivo supera 25 MB");
  }

  await ensurePublicMediaBucket();

  const { supabaseUrl } = getSupabaseStorageConfig();
  const folder = file.type.startsWith("video/") ? "videos" : "images";
  const path = `${folder}/${Date.now()}-${sanitizeMediaFileName(file.name)}`;
  const uploadResponse = await fetch(
    `${supabaseUrl}/storage/v1/object/${mediaBucketName}/${path}`,
    {
      method: "POST",
      headers: {
        ...getStorageHeaders(file.type),
        "x-upsert": "true",
      },
      body: Buffer.from(await file.arrayBuffer()),
    },
  );

  if (!uploadResponse.ok) {
    throw new Error(`No se pudo subir el archivo: ${await uploadResponse.text()}`);
  }

  return {
    url: getPublicMediaUrl(path),
    path,
    bucket: mediaBucketName,
  };
}

type StorageObject = {
  name: string;
  updated_at?: string | null;
  created_at?: string | null;
  metadata?: {
    size?: number;
    mimetype?: string;
    mimeType?: string;
  } | null;
};

async function listFolder(prefix: "images" | "videos") {
  const { supabaseUrl } = getSupabaseStorageConfig();
  await ensurePublicMediaBucket();

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/list/${mediaBucketName}`,
    {
      method: "POST",
      headers: getStorageHeaders(),
      body: JSON.stringify({
        prefix,
        limit: 100,
        offset: 0,
        sortBy: {
          column: "updated_at",
          order: "desc",
        },
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`No se pudo listar medios: ${await response.text()}`);
  }

  const objects = (await response.json()) as StorageObject[];

  return objects
    .filter((object) => object.name && !object.name.endsWith("/"))
    .map<MediaAsset>((object) => {
      const path = `${prefix}/${object.name}`;
      const mimeType =
        object.metadata?.mimetype ?? object.metadata?.mimeType ?? null;

      return {
        name: object.name,
        path,
        url: getPublicMediaUrl(path),
        type: prefix === "images" ? "image" : "video",
        size: object.metadata?.size ?? null,
        updatedAt: object.updated_at ?? object.created_at ?? null,
        mimeType,
      };
    });
}

export async function listMediaAssets() {
  const [images, videos] = await Promise.all([
    listFolder("images"),
    listFolder("videos"),
  ]);

  return [...images, ...videos].sort((left, right) => {
    const leftTime = left.updatedAt ? new Date(left.updatedAt).getTime() : 0;
    const rightTime = right.updatedAt ? new Date(right.updatedAt).getTime() : 0;

    return rightTime - leftTime;
  });
}

export async function deleteMediaAsset(path: string) {
  if (!path.startsWith("images/") && !path.startsWith("videos/")) {
    throw new Error("Ruta de archivo no permitida");
  }

  const { supabaseUrl } = getSupabaseStorageConfig();
  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${mediaBucketName}`,
    {
      method: "DELETE",
      headers: getStorageHeaders(),
      body: JSON.stringify({
        prefixes: [path],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`No se pudo eliminar el archivo: ${await response.text()}`);
  }
}
