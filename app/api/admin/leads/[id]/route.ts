import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updateAdminLead } from "@/lib/supabase-leads";

const updateLeadSchema = z.object({
  status: z
    .enum(["new", "contacted", "booked", "no_response", "discarded", "archived"])
    .optional(),
  notes: z.string().max(2000).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Solicitud inválida" },
      { status: 400 },
    );
  }

  const parsedBody = updateLeadSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json(
      { ok: false, error: "Datos inválidos" },
      { status: 400 },
    );
  }

  const [lead] = await updateAdminLead(id, parsedBody.data);

  return Response.json({
    ok: true,
    lead,
  });
}
