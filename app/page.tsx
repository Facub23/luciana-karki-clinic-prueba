import About from "@/components/About";
import BeforeAfter from "@/components/BeforeAfter";
import BookingProcess from "@/components/BookingProcess";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import LeadForm from "@/components/LeadForm";
import Navbar from "@/components/Navbar";
import Results from "@/components/Results";
import TreatmentsSection from "@/components/TreatmentsSection";
import TrustSignals from "@/components/TrustSignals";
import VideoSection from "@/components/VideoSection";
import WhatsappButton from "@/components/WhatsappButton";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#faf7f8] to-white">
      <Navbar />

      <Hero />

      <TrustSignals />

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
        className="max-w-7xl mx-auto grid gap-10 px-6 py-24 lg:grid-cols-[1fr_420px] lg:items-start"
      >
        <div className="text-center lg:text-left">
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
        </div>

        <LeadForm />
      </section>

      <WhatsappButton />

      <Footer />
    </main>
  );
}
