/**
 * Centralized observability: error tracking + custom analytics events.
 *
 * Errors are reported to:
 *   1. Sentry, if VITE_SENTRY_DSN is configured (preferred for prod)
 *   2. A Supabase `client_errors` table as a fallback so errors are
 *      captured even without Sentry. The table needs to exist; SQL is
 *      in the project notes. Without the table the insert fails
 *      silently and errors are simply not captured — that's fine, the
 *      app keeps working.
 *
 * Analytics events go to Vercel Analytics (page views + web vitals are
 * mounted as components in main.jsx).
 */
import * as Sentry from '@sentry/react';
import { track as vercelTrack } from '@vercel/analytics';
import { supabase } from './supabase';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const APP_ENV = import.meta.env.VITE_APP_ENV || (import.meta.env.PROD ? 'production' : 'development');

let sentryInitialized = false;
let currentUserId = null;

// Cap how much we write to Supabase to avoid runaway loops or quota burn.
// In-memory only — resets per page load, intentional. We dedupe identical
// messages and enforce a hard ceiling.
const MAX_ERRORS_PER_SESSION = 20;
const reportedFingerprints = new Set();
let errorsThisSession = 0;

export function initObservability() {
  if (sentryInitialized) return;
  if (!SENTRY_DSN) return; // No DSN configured — skip silently, fall back to Supabase only.

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: APP_ENV,
    tracesSampleRate: APP_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    beforeSend(event) {
      if (event.request?.url) {
        try {
          const u = new URL(event.request.url);
          event.request.url = u.origin + u.pathname;
        } catch { /* ignore */ }
      }
      return event;
    },
    sendDefaultPii: false,
  });

  sentryInitialized = true;
}

export function setObservabilityUser(userId) {
  currentUserId = userId || null;
  if (!sentryInitialized) return;
  Sentry.setUser(userId ? { id: userId } : null);
}

/**
 * Strip likely-PII (emails, JWT-shaped tokens, supabase auth cookies) from
 * a string before persisting it. Best-effort — Sentry has its own scrubbing.
 */
function scrubText(text) {
  if (!text) return text;
  return String(text)
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '<email>')
    .replace(/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/g, '<jwt>')
    .replace(/\b[A-Za-z0-9_-]{40,}\b/g, (m) => (m.length > 80 ? '<token>' : m));
}

function getCurrentUrl() {
  try {
    const u = new URL(window.location.href);
    return u.origin + u.pathname; // strip query + hash (might contain tokens)
  } catch { return ''; }
}

/**
 * Persist a captured error to the client_errors Supabase table.
 * Silent failure: this is best-effort observability, must never break the app.
 */
async function logErrorToSupabase(error, context) {
  if (errorsThisSession >= MAX_ERRORS_PER_SESSION) return;

  const message = scrubText(error?.message || String(error));
  const fingerprint = `${message}::${error?.stack?.split('\n')[1] || ''}`;
  if (reportedFingerprints.has(fingerprint)) return; // dedupe within a session
  reportedFingerprints.add(fingerprint);
  errorsThisSession += 1;

  try {
    await supabase.from('client_errors').insert({
      message,
      stack: scrubText(error?.stack)?.slice(0, 4000) || null,
      url: getCurrentUrl(),
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 500) : null,
      user_id: currentUserId,
      context: context ? JSON.parse(JSON.stringify(context)) : null,
      environment: APP_ENV,
    });
  } catch {
    // Don't recurse — drop on the floor.
  }
}

export function reportError(error, context) {
  if (sentryInitialized) {
    Sentry.captureException(error, context ? { extra: context } : undefined);
  }
  // Always also try to log to Supabase — gives a record even when Sentry isn't set up.
  logErrorToSupabase(error, context);

  if (!import.meta.env.PROD) {
    // eslint-disable-next-line no-console
    console.error('[reportError]', error, context);
  }
}

export function trackEvent(name, props) {
  try {
    vercelTrack(name, props);
  } catch { /* analytics shouldn't break the app */ }

  if (sentryInitialized) {
    Sentry.addBreadcrumb({ category: 'event', message: name, data: props, level: 'info' });
  }
}

export { Sentry };
