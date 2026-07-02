import type { Metadata } from "next";
import { renderLegalPage } from "@/lib/render-legal-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Política de privacidad",
  robots: {
    index: false,
    follow: true,
  },
};

export default function PoliticaPrivacidadPage() {
  return renderLegalPage("politica-privacidad");
}
