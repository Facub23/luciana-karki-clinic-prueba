export type AnalyticsEventName =
  | "lead_form_submit"
  | "whatsapp_click"
  | "treatment_interest";

type AnalyticsPayload = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    dataLayer?: Array<AnalyticsPayload & { event: AnalyticsEventName }>;
  }
}

export function trackEvent(
  event: AnalyticsEventName,
  payload: AnalyticsPayload = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...payload,
  });
}
