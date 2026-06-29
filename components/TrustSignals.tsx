import { CalendarCheck, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

const signals = [
  {
    icon: ShieldCheck,
    title: "Valoración médica",
    text: "Cada tratamiento se indica después de revisar tu caso y objetivos.",
  },
  {
    icon: MessageCircle,
    title: "Reserva por WhatsApp",
    text: "Contacto directo para resolver dudas y coordinar tu cita.",
  },
  {
    icon: MapPin,
    title: "Barcelona y Alicante",
    text: "Atención en clínica y visitas a domicilio en Alicante.",
  },
  {
    icon: CalendarCheck,
    title: "Solo con cita previa",
    text: "Agenda organizada para una atención tranquila y personalizada.",
  },
];

export default function TrustSignals() {
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto grid gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {signals.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-2xl border border-pink-100 bg-[#faf7f8] p-5"
          >
            <Icon className="h-6 w-6 text-[#d9a8b5]" aria-hidden="true" />
            <h3 className="mt-4 font-medium text-[#6b5b63]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
