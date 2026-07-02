import { notFound } from "next/navigation";
import LegalPage from "@/components/LegalPage";
import {
  getEditableLegalContent,
  type LegalPageSlug,
} from "@/lib/public-legal-content";
import { getEditableSiteSettings } from "@/lib/public-site-settings";
import { getEditableTreatments } from "@/lib/public-treatments";
import {
  getPublicSiteContent,
  phoneLabelFromContent,
  whatsappUrlFromPhone,
} from "@/lib/site-content";

export async function renderLegalPage(slug: LegalPageSlug) {
  const content = await getPublicSiteContent();
  const legalContent = getEditableLegalContent(content, slug);

  if (!legalContent) {
    notFound();
  }

  const phoneLabel = phoneLabelFromContent(content);
  const whatsappUrl = whatsappUrlFromPhone(phoneLabel);
  const siteSettings = getEditableSiteSettings(content);
  const treatments = getEditableTreatments(content);

  return (
    <LegalPage
      title={legalContent.title}
      body={legalContent.body}
      phoneLabel={phoneLabel}
      whatsappUrl={whatsappUrl}
      footerContent={siteSettings.footer}
      treatments={treatments}
    />
  );
}
