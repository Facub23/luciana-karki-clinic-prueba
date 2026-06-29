"use client";

import { FormEvent, useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";

type LeadFormProps = {
  treatmentName?: string;
  compact?: boolean;
};

const phoneNumber = "34644241706";

export default function LeadForm({
  treatmentName,
  compact = false,
}: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState(treatmentName ?? "");

  const message = useMemo(() => {
    const selectedTreatment = interest || treatmentName || "una valoración";
    return [
      "Hola, quiero solicitar una valoración.",
      `Tratamiento: ${selectedTreatment}`,
      name ? `Nombre: ${name}` : "",
      phone ? `Teléfono: ${phone}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [interest, name, phone, treatmentName]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white border border-pink-100 shadow-lg ${
        compact ? "rounded-3xl p-6" : "rounded-[32px] p-8"
      }`}
    >
      <div>
        <span className="uppercase tracking-[0.25em] text-[#d9a8b5] text-xs">
          Valoración
        </span>
        <h3 className="mt-3 text-2xl font-light text-[#6b5b63]">
          Reserva tu consulta
        </h3>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Completa tus datos y abre WhatsApp con el mensaje listo para reservar.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm text-[#6b5b63]">Nombre</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-[#d9a8b5]"
            placeholder="Tu nombre"
            type="text"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm text-[#6b5b63]">Teléfono</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-[#d9a8b5]"
            placeholder="+34..."
            type="tel"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm text-[#6b5b63]">Tratamiento</span>
          <input
            value={interest}
            onChange={(event) => setInterest(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-[#d9a8b5]"
            placeholder="Tratamiento que te interesa"
            type="text"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#d9a8b5] px-6 py-4 font-medium text-white transition hover:opacity-90"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        Enviar por WhatsApp
      </button>
    </form>
  );
}
