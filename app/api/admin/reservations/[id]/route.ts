import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updateReservation } from "@/lib/supabase-leads";

const updateReservationSchema = z.object({
  status: z
    .enum(["scheduled", "confirmed", "completed", "cancelled", "no_show"])
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
  const body = await request.json();
  const parsedBody = updateReservationSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json(
      { ok: false, error: "Datos inválidos" },
      { status: 400 },
    );
  }

  const [reservation] = await updateReservation(id, parsedBody.data);

  return Response.json({
    ok: true,
    reservation,
  });
}
