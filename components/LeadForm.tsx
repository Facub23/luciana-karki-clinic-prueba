"use client";

import { FormEvent, useMemo, useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  defaultLeadFormContent,
  type LeadFormContent,
} from "@/lib/public-site-settings";

type LeadFormProps = {
  treatmentName?: string;
  compact?: boolean;
  phoneNumber?: string;
  content?: LeadFormContent;
};

const defaultPhoneNumber = "34644241706";

function getTrackingParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    landingPage: window.location.href,
    referrer: document.referrer,
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    utmTerm: params.get("utm_term") ?? "",
    utmContent: params.get("utm_content") ?? "",
  };
}

export default function LeadForm({
  treatmentName,
  compact = false,
  phoneNumber = defaultPhoneNumber,
  content = defaultLeadFormContent,
}: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState(treatmentName ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const selectedTreatment = interest || treatmentName || content.fallbackTreatment;
  const message = useMemo(() => {
    return [
      content.whatsappIntro,
      `${content.whatsappTreatmentPrefix} ${selectedTreatment}`,
      name ? `${content.whatsappNamePrefix} ${name}` : "",
      phone ? `${content.whatsappPhonePrefix} ${phone}` : "",
      content.whatsappClosing,
    ]
      .filter(Boolean)
      .join("\n");
  }, [content, name, phone, selectedTreatment]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          treatment: selectedTreatment,
          page: window.location.pathname,
          message,
          website: formData.get("website"),
          ...getTrackingParams(),
        }),
      });

      setStatus(response.ok ? "saved" : "error");

      trackEvent("lead_form_submit", {
        status: response.ok ? "saved" : "error",
        treatment: selectedTreatment,
        page: window.location.pathname,
      });
    } catch {
      setStatus("error");

      trackEvent("lead_form_submit", {
        status: "error",
        treatment: selectedTreatment,
        page: window.location.pathname,
      });
    } finally {
      setIsSubmitting(false);
    }

    trackEvent("whatsapp_click", {
      location: compact ? "compact_lead_form" : "lead_form",
      treatment: selectedTreatment,
      page: window.location.pathname,
    });

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`border border-[#ead1d9] bg-white/95 shadow-[0_22px_60px_rgba(107,91,99,0.16)] ring-1 ring-white/70 backdrop-blur ${
        compact ? "rounded-[28px] p-4 sm:p-5" : "rounded-[32px] p-8"
      }`}
    >
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#d9a8b5]">
          {content.eyebrow}
        </span>
        <h3
          className={`font-light text-[#6b5b63] ${
            compact ? "mt-1 text-xl" : "mt-3 text-2xl"
          }`}
        >
          {content.title}
        </h3>
        <p
          className={`text-sm leading-6 text-gray-600 ${
            compact ? "mt-1 hidden sm:block" : "mt-3"
          }`}
        >
          {content.description}
        </p>
      </div>

      <div
        className={`grid gap-3 ${
          compact ? "mt-3 sm:grid-cols-2" : "mt-6"
        }`}
      >
        <label className="block">
          <span className={compact ? "sr-only" : "text-sm text-[#6b5b63]"}>
            {content.nameLabel}
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={`w-full border border-[#ebd8df] bg-[#fffafb] px-4 text-[#4f4149] shadow-inner outline-none transition placeholder:text-[#9d828d] focus:border-[#c98fa1] focus:bg-white focus:ring-4 focus:ring-[#efd8df] ${
              compact
                ? "rounded-xl py-2.5 text-sm"
                : "mt-2 rounded-2xl py-3"
            }`}
            placeholder={content.namePlaceholder}
            type="text"
            required
          />
        </label>

        <label className="block">
          <span className={compact ? "sr-only" : "text-sm text-[#6b5b63]"}>
            {content.phoneLabel}
          </span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={`w-full border border-[#ebd8df] bg-[#fffafb] px-4 text-[#4f4149] shadow-inner outline-none transition placeholder:text-[#9d828d] focus:border-[#c98fa1] focus:bg-white focus:ring-4 focus:ring-[#efd8df] ${
              compact
                ? "rounded-xl py-2.5 text-sm"
                : "mt-2 rounded-2xl py-3"
            }`}
            placeholder={content.phonePlaceholder}
            type="tel"
            required
          />
        </label>

        <label className={compact ? "block sm:col-span-2" : "block"}>
          <span className={compact ? "sr-only" : "text-sm text-[#6b5b63]"}>
            {content.treatmentLabel}
          </span>
          <input
            value={interest}
            onChange={(event) => setInterest(event.target.value)}
            className={`w-full border border-[#ebd8df] bg-[#fffafb] px-4 text-[#4f4149] shadow-inner outline-none transition placeholder:text-[#9d828d] focus:border-[#c98fa1] focus:bg-white focus:ring-4 focus:ring-[#efd8df] ${
              compact
                ? "rounded-xl py-2.5 text-sm"
                : "mt-2 rounded-2xl py-3"
            }`}
            placeholder={content.treatmentPlaceholder}
            type="text"
          />
        </label>

        <input
          className="hidden"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`flex w-full items-center justify-center gap-2 rounded-full bg-[#c98fa1] px-6 font-medium text-white shadow-[0_14px_30px_rgba(201,143,161,0.35)] transition hover:-translate-y-0.5 hover:bg-[#bd7f93] disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70 ${
          compact ? "mt-3 py-3 text-sm" : "mt-6 py-4"
        }`}
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        )}
        {isSubmitting ? content.submittingLabel : content.submitLabel}
      </button>

      {status === "saved" ? (
        <p className="mt-3 text-sm text-green-700">{content.successMessage}</p>
      ) : null}

      {status === "error" ? (
        <p className="mt-3 text-sm text-amber-700">{content.errorMessage}</p>
      ) : null}
    </form>
  );
}
