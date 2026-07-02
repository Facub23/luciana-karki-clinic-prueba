import {
  CalendarCheck,
  MapPin,
  MessageCircle,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type TrustSignalsContent = {
  cards: {
    icon: string;
    title: string;
    text: string;
  }[];
};

export const defaultTrustSignalsContent: TrustSignalsContent = {
  cards: [
    {
      icon: "shield",
      title: "Valoración médica",
      text: "Cada tratamiento se indica después de revisar tu caso y objetivos.",
    },
    {
      icon: "message",
      title: "Reserva por WhatsApp",
      text: "Contacto directo para resolver dudas y coordinar tu cita.",
    },
    {
      icon: "location",
      title: "Barcelona y Alicante",
      text: "Atención en clínica y visitas a domicilio en Alicante.",
    },
    {
      icon: "calendar",
      title: "Solo con cita previa",
      text: "Agenda organizada para una atención tranquila y personalizada.",
    },
  ],
};

const iconMap: Record<string, LucideIcon> = {
  calendar: CalendarCheck,
  location: MapPin,
  message: MessageCircle,
  shield: ShieldCheck,
};

type TrustSignalsProps = {
  content?: TrustSignalsContent;
};

export default function TrustSignals({
  content = defaultTrustSignalsContent,
}: TrustSignalsProps) {
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto grid gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {content.cards.map((card) => {
          const Icon = iconMap[card.icon] ?? ShieldCheck;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-pink-100 bg-[#faf7f8] p-5"
            >
              <Icon className="h-6 w-6 text-[#d9a8b5]" aria-hidden="true" />
              <h3 className="mt-4 font-medium text-[#6b5b63]">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{card.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
