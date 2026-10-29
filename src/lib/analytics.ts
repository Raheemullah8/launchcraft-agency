"use client";

export type AnalyticsEvent =
  | "page_view"
  | "service_click"
  | "portfolio_filter"
  | "case_study_view"
  | "inquiry_submit_success"
  | "contact_submit_success"
  | "booking_complete"
  | "email_subscribe_success"
  | "job_apply_success";

export interface EventProperties {
  pagePath?: string;
  serviceSlug?: string;
  serviceTitle?: string;
  category?: string;
  projectSlug?: string;
  jobSlug?: string;
  bookingType?: string;
  [key: string]: string | number | boolean | undefined;
}

const COOKIE_CONSENT_KEY = "launchcraft_cookie_consent_v1";

export function getConsentStatus(): {
  necessary: boolean;
  analytics: boolean;
} {
  if (typeof window === "undefined") {
    return { necessary: true, analytics: false };
  }
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return { necessary: true, analytics: false };
    const parsed = JSON.parse(raw);
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
    };
  } catch {
    return { necessary: true, analytics: false };
  }
}

export function setConsentStatus(analyticsAllowed: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        necessary: true,
        analytics: analyticsAllowed,
        timestamp: new Date().toISOString(),
      })
    );
  } catch (e) {
    console.error("Failed to store consent status", e);
  }
}

export function trackEvent(
  eventName: AnalyticsEvent,
  properties?: EventProperties
): void {
  if (typeof window === "undefined") return;

  const { analytics } = getConsentStatus();
  if (!analytics) {
    // Strictly respect consent: do not dispatch if analytics consent is not given
    return;
  }

  // Sanitize properties to strictly prevent PII (no names, emails, phone, CVs)
  const sanitizedProps: EventProperties = {};
  if (properties) {
    for (const [key, val] of Object.entries(properties)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("name") ||
        lowerKey.includes("email") ||
        lowerKey.includes("phone") ||
        lowerKey.includes("cv") ||
        lowerKey.includes("message") ||
        lowerKey.includes("note")
      ) {
        continue; // Exclude PII
      }
      sanitizedProps[key] = val;
    }
  }

  // Dispatch to window.dataLayer / gtag if available, or console in development
  if (typeof window !== "undefined" && (window as unknown as { dataLayer?: unknown[] }).dataLayer) {
    (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
      event: eventName,
      ...sanitizedProps,
    });
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[Analytics Event: ${eventName}]`, sanitizedProps);
  }
}

