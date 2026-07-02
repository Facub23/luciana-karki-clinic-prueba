import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteMediaAsset, listMediaAssets } from "@/lib/supabase-storage";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const assets = await listMediaAssets();

    return NextResponse.json({ ok: true, assets });
  } catch (error) {
    console.error("Admin media list failed", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "No se pudieron cargar medios",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as { path?: string };

    if (!payload.path) {
      return NextResponse.json(
        { ok: false, error: "Ruta requerida" },
        { status: 400 },
      );
    }

    await deleteMediaAsset(payload.path);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin media delete failed", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "No se pudo eliminar",
      },
      { status: 500 },
    );
  }
}
