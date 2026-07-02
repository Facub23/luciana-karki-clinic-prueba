import type { Metadata } from "next";
import { renderLegalPage } from "@/lib/render-legal-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Aviso legal",
  robots: {
    index: false,
    follow: true,
  },
};

export default function AvisoLegalPage() {
  return renderLegalPage("aviso-legal");
}
