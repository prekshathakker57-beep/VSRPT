import { track } from "@vercel/analytics";

export function trackAnalyticsEvent(eventName: string, properties?: Record<string, any>) {
  try {
    // Sanitize properties to prevent accidental PII logging
    const safeProps: Record<string, any> = {};
    if (properties) {
      for (const [key, val] of Object.entries(properties)) {
        // Exclude potential PII fields
        if (
          !key.toLowerCase().includes("name") &&
          !key.toLowerCase().includes("email") &&
          !key.toLowerCase().includes("phone") &&
          !key.toLowerCase().includes("message")
        ) {
          safeProps[key] = val;
        }
      }
    }

    if (typeof window !== "undefined") {
      track(eventName, safeProps);
      if (process.env.NODE_ENV !== "production") {
        console.log(`[Analytics Event Tracked]: ${eventName}`, safeProps);
      }
    }
  } catch (err) {
    // Fail silently so user experience is never interrupted by analytics
    console.warn("Analytics tracking error:", err);
  }
}
