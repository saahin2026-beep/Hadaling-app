import { describe, it, expect, vi, beforeEach } from 'vitest';

// We can't easily test initObservability with a real DSN, but we can verify
// the helpers are no-ops when Sentry isn't initialized, and that trackEvent
// hands off to Vercel Analytics's track function.

const mockVercelTrack = vi.fn();
const mockSentryCapture = vi.fn();
const mockSentrySetUser = vi.fn();
const mockSentryAddBreadcrumb = vi.fn();

vi.mock('@vercel/analytics', () => ({
  track: (...args) => mockVercelTrack(...args),
}));

vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  captureException: (...args) => mockSentryCapture(...args),
  setUser: (...args) => mockSentrySetUser(...args),
  addBreadcrumb: (...args) => mockSentryAddBreadcrumb(...args),
  browserTracingIntegration: () => null,
}));

beforeEach(() => {
  mockVercelTrack.mockReset();
  mockSentryCapture.mockReset();
  mockSentrySetUser.mockReset();
  mockSentryAddBreadcrumb.mockReset();
});

describe('observability — trackEvent', () => {
  it('forwards events to Vercel Analytics', async () => {
    const { trackEvent } = await import('../observability');
    trackEvent('test_event', { foo: 'bar' });
    expect(mockVercelTrack).toHaveBeenCalledWith('test_event', { foo: 'bar' });
  });

  it('does not crash when Vercel track throws (analytics must never break the app)', async () => {
    mockVercelTrack.mockImplementation(() => { throw new Error('network down'); });
    const { trackEvent } = await import('../observability');
    expect(() => trackEvent('any_event')).not.toThrow();
  });
});

describe('observability — reportError', () => {
  it('is a no-op when Sentry is not initialized (no DSN)', async () => {
    const { reportError } = await import('../observability');
    reportError(new Error('boom'));
    // Without a DSN initObservability is never called → captureException not invoked
    expect(mockSentryCapture).not.toHaveBeenCalled();
  });
});

describe('observability — setObservabilityUser', () => {
  it('is a no-op when Sentry is not initialized', async () => {
    const { setObservabilityUser } = await import('../observability');
    setObservabilityUser('user-123');
    expect(mockSentrySetUser).not.toHaveBeenCalled();
  });
});
