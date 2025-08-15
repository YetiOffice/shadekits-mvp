// lib/logError.js
export function logError(error, info) {
  // Minimal no-op logger to keep builds green.
  // Hook this up to Sentry/Logtail/etc. later if you want.
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error("[SentryBoundary]", error, info);
  }
}
