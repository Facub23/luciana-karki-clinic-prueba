import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  createLeadEvent,
  leadStatusLabels,
  updateAdminLead,
} from "@/lib/supabase-leads";

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

  if (parsedBody.data.status) {
    await createLeadEvent(id, {
      eventType: "status_changed",
      title: `Estado actualizado a ${leadStatusLabels[parsedBody.data.status]}`,
      metadata: {
        status: parsedBody.data.status,
      },
    });
  }

  if (typeof parsedBody.data.notes === "string") {
    await createLeadEvent(id, {
      eventType: "note_updated",
      title: "Notas internas actualizadas",
      description: parsedBody.data.notes,
    });
  }

  return Response.json({
    ok: true,
    lead,
  });
}
