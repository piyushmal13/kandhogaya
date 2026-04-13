import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const IS_PROD    = import.meta.env.PROD;

/**
 * initSentry — Institutional Error Intelligence
 *
 * Initialise once at app boot (before React renders).
 * Captures runtime exceptions, unhandled promise rejections, and
 * performance traces automatically. Only active when a valid DSN is set.
 *
 * To enable:
 *  1. Create a free project at https://sentry.io
 *  2. Add VITE_SENTRY_DSN=https://xxx@oyyy.ingest.sentry.io/zzz to .env
 *  3. Set VITE_SENTRY_DSN in Vercel → Settings → Environment Variables
 */
export function initSentry() {
  if (!SENTRY_DSN || SENTRY_DSN === "YOUR_DSN_HERE") {
    if (!IS_PROD) {
      console.info("[Sentry] DSN not configured — error monitoring disabled in dev.");
    }
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,

    // Capture 100 % of errors; tune down to 0.1 (10 %) when traffic is high
    sampleRate: IS_PROD ? 1 : 0,

    // Performance tracing: 10 % of page-loads in production
    tracesSampleRate: IS_PROD ? 0.1 : 0,

    // Release tied to the Vercel commit SHA for source-map lookup
    release: import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA ?? "dev",

    environment: IS_PROD ? "production" : "development",

    // Ignored noise
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed",
      "Non-Error promise rejection",
      /Loading chunk \d+ failed/,
    ],

    integrations: [
      Sentry.browserTracingIntegration(),
    ],

    beforeSend(event) {
      // Strip PII — never send e-mail addresses to Sentry
      if (event.user?.email) {
        event.user.email = "[redacted]";
      }
      return event;
    },
  });
}

/** Sentry-aware error boundary (drop-in replacement for the class component) */
export * as Sentry from "@sentry/react";
