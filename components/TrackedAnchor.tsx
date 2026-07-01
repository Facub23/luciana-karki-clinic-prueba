"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

type TrackedAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: AnalyticsEventName;
  eventPayload?: Record<string, string | number | boolean | null>;
};

export default function TrackedAnchor({
  eventName,
  eventPayload,
  onClick,
  ...props
}: TrackedAnchorProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackEvent(eventName, eventPayload);
    onClick?.(event);
  }

  return <a {...props} onClick={handleClick} />;
}
