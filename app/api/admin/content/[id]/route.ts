import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  discardSiteContentDraft,
  publishSiteContentDraft,
  saveSiteContentDraft,
} from "@/lib/supabase-leads";

const updateContentSchema = z.object({
  value: z.string().max(10000),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsedBody = updateContentSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json(
      { ok: false, error: "Datos inválidos" },
      { status: 400 },
    );
  }

  const [content] = await saveSiteContentDraft(id, parsedBody.data);

  return Response.json({
    ok: true,
    content,
  });
}

const actionSchema = z.object({
  action: z.enum(["publish", "discard"]),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsedBody = actionSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json(
      { ok: false, error: "Acción inválida" },
      { status: 400 },
    );
  }

  if (parsedBody.data.action === "publish") {
    const content = await publishSiteContentDraft(id);

    return Response.json({ ok: true, content });
  }

  await discardSiteContentDraft(id);

  return Response.json({ ok: true });
}
