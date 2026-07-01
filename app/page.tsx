import About from "@/components/About";
import BeforeAfter from "@/components/BeforeAfter";
import BookingProcess from "@/components/BookingProcess";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import Results from "@/components/Results";
import TreatmentsSection from "@/components/TreatmentsSection";
import VideoSection from "@/components/VideoSection";
import WhatsappButton from "@/components/WhatsappButton";
import WhyChooseUs from "@/components/WhyChooseUs";
import { clinicJsonLd, websiteJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#faf7f8] to-white">
      <JsonLd data={clinicJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <Navbar />

      <Hero />

      <Results />

      <WhyChooseUs />

      <About />

      <VideoSection />

      <Gallery />

      <BeforeAfter />

      <TreatmentsSection />

      <BookingProcess />

      <FaqSection />

      <section
        id="contacto"
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="mx-auto max-w-4xl text-center">
          <span className="uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
            Contacto
          </span>

          <h2 className="mt-4 text-4xl text-[#6b5b63] mb-6">
            Agenda una valoración
          </h2>

          <p className="text-gray-600">Calle Sepúlveda 125 · Barcelona</p>
          <p className="mt-2 text-gray-600">Alicante · Visitas a domicilio</p>
          <p className="mt-2 text-gray-600">Atención solo con cita previa</p>
          <p className="mt-2 text-gray-600">+34 644 24 17 06</p>

          <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
            {[
              "Te respondemos por WhatsApp",
              "Revisamos el tratamiento que te interesa",
              "Coordinamos disponibilidad y valoración",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-pink-100 bg-white p-4 text-sm text-[#6b5b63]"
              >
                {item}
              </div>
            ))}
          </div>

          <a
            href="#inicio"
            className="mt-10 inline-flex rounded-full bg-[#d9a8b5] px-8 py-4 font-medium text-white transition hover:opacity-90"
          >
            Completar formulario
          </a>
        </div>
      </section>

      <WhatsappButton />

      <Footer />
    </main>
  );
}
