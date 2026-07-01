"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

type TrackedLinkProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode;
    eventName: AnalyticsEventName;
    eventPayload?: Record<string, string | number | boolean | null>;
  };

export default function TrackedLink({
  children,
  eventName,
  eventPayload,
  onClick,
  ...props
}: TrackedLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackEvent(eventName, eventPayload);
    onClick?.(event);
  }

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
