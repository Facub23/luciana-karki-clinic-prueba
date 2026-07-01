import { MessageCircle } from "lucide-react";
import TrackedAnchor from "@/components/TrackedAnchor";

export default function WhatsappButton() {
  return (
    <TrackedAnchor
      href="https://wa.me/34644241706"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir WhatsApp"
      eventName="whatsapp_click"
      eventPayload={{ location: "floating_button" }}
      className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 font-medium text-white shadow-lg transition hover:scale-105 sm:bottom-5 sm:right-5 sm:h-auto sm:w-auto sm:gap-2 sm:px-5 sm:py-3"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </TrackedAnchor>
  );
}
