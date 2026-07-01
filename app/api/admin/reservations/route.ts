import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createReservation } from "@/lib/supabase-leads";

const createReservationSchema = z.object({
  leadId: z.string().uuid().optional().or(z.literal("")),
  patientName: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(6).max(40),
  treatment: z.string().trim().min(2).max(180),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional().or(z.literal("")),
  notes: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parsedBody = createReservationSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json(
      { ok: false, error: "Datos inválidos" },
      { status: 400 },
    );
  }

  const [reservation] = await createReservation(parsedBody.data);

  return Response.json({
    ok: true,
    reservation,
  });
}
