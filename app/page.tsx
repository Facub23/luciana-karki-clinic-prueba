import type { Metadata } from "next";
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
import {
  absoluteUrl,
  clinicJsonLd,
  clinicName,
  defaultSeoImage,
  faqJsonLd,
  homePageJsonLd,
  homeKeywords,
  siteUrl,
  websiteJsonLd,
} from "@/lib/seo";
import {
  getPublicContentValue,
  getPublicSiteContent,
  normalizePhoneForWhatsapp,
  phoneLabelFromContent,
  publicContentFallbacks,
  whatsappUrlFromPhone,
} from "@/lib/site-content";
import { getEditableTreatments } from "@/lib/public-treatments";
import { getEditablePromotions } from "@/lib/public-promotions";
import { getEditableHomeContent } from "@/lib/public-home-content";
import { getEditableSiteSettings } from "@/lib/public-site-settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublicSiteContent();
  const title = getPublicContentValue(
    content,
    "SEO",
    "Meta title",
    publicContentFallbacks.seoTitle,
  );
  const description = getPublicContentValue(
    content,
    "SEO",
    "Meta description",
    publicContentFallbacks.seoDescription,
  );

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: homeKeywords,
    alternates: {
      canonical: absoluteUrl("/"),
    },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url: absoluteUrl("/"),
      siteName: title,
      title,
      description,
      images: [
        {
          url: absoluteUrl(defaultSeoImage),
          width: 1200,
          height: 900,
          alt: clinicName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(defaultSeoImage)],
    },
  };
}

export default async function Home() {
  const content = await getPublicSiteContent();
  const phoneLabel = phoneLabelFromContent(content);
  const whatsappUrl = whatsappUrlFromPhone(phoneLabel);
  const editableTreatments = getEditableTreatments(content);
  const editablePromotions = getEditablePromotions(content);
  const editableHomeContent = getEditableHomeContent(content);
  const siteSettings = getEditableSiteSettings(content);
  const title = getPublicContentValue(
    content,
    "SEO",
    "Meta title",
    publicContentFallbacks.seoTitle,
  );
  const description = getPublicContentValue(
    content,
    "SEO",
    "Meta description",
    publicContentFallbacks.seoDescription,
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#faf7f8] to-white">
      <JsonLd data={clinicJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={homePageJsonLd(title, description)} />
      <JsonLd data={faqJsonLd(editableHomeContent.faq.items)} />
      <Navbar whatsappUrl={whatsappUrl} content={siteSettings.navbar} />

      <Hero
        content={editableHomeContent.hero}
        whatsappUrl={whatsappUrl}
        phoneNumber={normalizePhoneForWhatsapp(phoneLabel)}
      />

      <Results content={editableHomeContent.results} />

      <WhyChooseUs content={editableHomeContent.whyChooseUs} />

      <About whatsappUrl={whatsappUrl} content={editableHomeContent.about} />

      <VideoSection content={editableHomeContent.videos} />

      <Gallery promotions={editablePromotions} />

      <BeforeAfter content={editableHomeContent.beforeAfter} />

      <TreatmentsSection treatments={editableTreatments} />

      <BookingProcess content={editableHomeContent.booking} />

      <FaqSection content={editableHomeContent.faq} />

      <section
        id="contacto"
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="mx-auto max-w-4xl text-center">
          <span className="uppercase tracking-[0.3em] text-[#d9a8b5] text-sm">
            {siteSettings.contact.eyebrow}
          </span>

          <h2 className="mt-4 text-4xl text-[#6b5b63] mb-6">
            {siteSettings.contact.title}
          </h2>

          {siteSettings.contact.lines.map((line, index) => (
            <p
              key={line}
              className={index === 0 ? "text-gray-600" : "mt-2 text-gray-600"}
            >
              {line}
            </p>
          ))}
          <p className="mt-2 text-gray-600">{phoneLabel}</p>

          <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
            {siteSettings.contact.cards.map((item) => (
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
            {siteSettings.contact.ctaLabel}
          </a>
        </div>
      </section>

      <WhatsappButton whatsappUrl={whatsappUrl} />

      <Footer
        phoneLabel={phoneLabel}
        whatsappUrl={whatsappUrl}
        content={siteSettings.footer}
        treatments={editableTreatments}
      />
    </main>
  );
}
