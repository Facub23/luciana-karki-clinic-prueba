import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { uploadMediaFile } from "@/lib/supabase-storage";

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

    const uploaded = await uploadMediaFile(file);

    return NextResponse.json({
      ok: true,
      ...uploaded,
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
