import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsappButton from "@/components/WhatsappButton";
import type { FooterContent, NavbarContent } from "@/lib/public-site-settings";
import type { Treatment } from "@/lib/treatments";

type LegalPageProps = {
  title: string;
  body: string;
  phoneLabel: string;
  whatsappUrl: string;
  navbarContent: NavbarContent;
  footerContent: FooterContent;
  treatments: Treatment[];
};

export default function LegalPage({
  title,
  body,
  phoneLabel,
  whatsappUrl,
  navbarContent,
  footerContent,
  treatments,
}: LegalPageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#faf7f8] to-white">
      <Navbar whatsappUrl={whatsappUrl} content={navbarContent} />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <Link href="/" className="text-sm font-medium text-[#c98fa1]">
          Volver al inicio
        </Link>

        <article className="mt-8 rounded-[28px] border border-[#ead1d9] bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-light text-[#6b5b63]">{title}</h1>
          <div className="mt-8 whitespace-pre-line text-base leading-8 text-gray-600">
            {body}
          </div>
        </article>
      </section>

      <WhatsappButton whatsappUrl={whatsappUrl} />
      <Footer
        phoneLabel={phoneLabel}
        whatsappUrl={whatsappUrl}
        content={footerContent}
        treatments={treatments}
      />
    </main>
  );
}
