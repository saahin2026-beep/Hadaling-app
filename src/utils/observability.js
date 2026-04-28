/**
 * Centralized observability: Sentry error tracking + custom analytics events.
 *
 * Vercel Analytics (page views, web vitals) is initialized as React components
 * in main.jsx. This file is for everything else: errors and product events.
 *
 * Sentry only initializes if VITE_SENTRY_DSN is set in the build env, so the
 * scaffolding ships now without requiring an account.
 */
import * as Sentry from '@sentry/react';
import { track as vercelTrack } from '@vercel/analytics';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const APP_ENV = import.meta.env.VITE_APP_ENV || (import.meta.env.PROD ? 'production' : 'development');

let sentryInitialized = false;

export function initObservability() {
  if (sentryInitialized) return;
  if (!SENTRY_DSN) return; // No DSN configured — skip silently.

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: APP_ENV,
    // Capture 10% of sessions in prod for tracing; full in dev.
    tracesSampleRate: APP_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    // Strip query strings and hash fragments from URLs — these can contain
    // recovery tokens or email addresses we don't want in error reports.
    beforeSend(event) {
      if (event.request?.url) {
        try {
          const u = new URL(event.request.url);
          event.request.url = u.origin + u.pathname;
        } catch { /* ignore */ }
      }
      return event;
    },
    // Don't fingerprint users.
    sendDefaultPii: false,
  });

  sentryInitialized = true;
}

/**
 * Tag the Sentry session with a user id (no email, no PII). Call after auth.
 */
export function setObservabilityUser(userId) {
  if (!sentryInitialized) return;
  Sentry.setUser(userId ? { id: userId } : null);
}

/**
 * Manually report a non-fatal error.
 */
export function reportError(error, context) {
  if (sentryInitialized) {
    Sentry.captureException(error, context ? { extra: context } : undefined);
  }
  // Also surface in dev console so we don't lose visibility.
  if (!import.meta.env.PROD) {
    // eslint-disable-next-line no-console
    console.error('[reportError]', error, context);
  }
}

/**
 * Track a product event (lesson completed, signup, etc.). Goes to Vercel
 * Analytics; if Sentry is up, also adds a breadcrumb so errors include
 * recent activity.
 */
export function trackEvent(name, props) {
  try {
    vercelTrack(name, props);
  } catch { /* analytics shouldn't break the app */ }

  if (sentryInitialized) {
    Sentry.addBreadcrumb({ category: 'event', message: name, data: props, level: 'info' });
  }
}

export { Sentry };
