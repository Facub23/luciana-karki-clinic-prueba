import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteReservation, updateReservation } from "@/lib/supabase-leads";

const updateReservationSchema = z.object({
  patientName: z.string().trim().min(2).max(160).optional(),
  phone: z.string().trim().min(6).max(40).optional(),
  treatment: z.string().trim().min(2).max(180).optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional().or(z.literal("")),
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

  try {
    const [reservation] = await updateReservation(id, parsedBody.data);

    if (!reservation) {
      return Response.json(
        { ok: false, error: "Reserva no encontrada" },
        { status: 404 },
      );
    }

    return Response.json({
      ok: true,
      reservation,
    });
  } catch (error) {
    console.error("Reservation update failed", error);

    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar la reserva",
      },
      { status: 502 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteReservation(id);

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Reservation deletion failed", error);

    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo eliminar la reserva",
      },
      { status: 502 },
    );
  }
}
