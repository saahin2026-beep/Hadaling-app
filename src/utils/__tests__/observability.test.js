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

const mockSupabaseInsert = vi.fn();
vi.mock('../supabase', () => ({
  supabase: {
    from: () => ({ insert: (...args) => mockSupabaseInsert(...args) }),
  },
}));

beforeEach(() => {
  mockVercelTrack.mockReset();
  mockSentryCapture.mockReset();
  mockSentrySetUser.mockReset();
  mockSentryAddBreadcrumb.mockReset();
  mockSupabaseInsert.mockReset();
  mockSupabaseInsert.mockResolvedValue({ error: null });
  // Reset module state so each test gets a fresh dedupe set / counter
  vi.resetModules();
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
  it('does not call Sentry when no DSN is configured', async () => {
    const { reportError } = await import('../observability');
    reportError(new Error('boom'));
    expect(mockSentryCapture).not.toHaveBeenCalled();
  });

  it('persists errors to the client_errors Supabase table as a fallback', async () => {
    const { reportError } = await import('../observability');
    reportError(new Error('something broke'), { where: 'test' });
    // Wait a tick for the async insert
    await new Promise((r) => setTimeout(r, 0));

    expect(mockSupabaseInsert).toHaveBeenCalledTimes(1);
    const inserted = mockSupabaseInsert.mock.calls[0][0];
    expect(inserted.message).toBe('something broke');
    expect(inserted.context).toEqual({ where: 'test' });
    expect(inserted.environment).toBeTruthy();
  });

  it('scrubs PII (emails, JWTs) from messages before persisting', async () => {
    const { reportError } = await import('../observability');
    // Realistic JWT shape: header.payload.signature, each ~25+ url-safe chars.
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    reportError(new Error(`failed for user@example.com with token ${fakeJwt}`), null);
    await new Promise((r) => setTimeout(r, 0));

    const inserted = mockSupabaseInsert.mock.calls[0][0];
    expect(inserted.message).not.toContain('user@example.com');
    expect(inserted.message).toContain('<email>');
    expect(inserted.message).not.toContain(fakeJwt);
    expect(inserted.message).toContain('<jwt>');
  });

  it('dedupes identical errors within a session', async () => {
    const { reportError } = await import('../observability');
    const err = new Error('same error');
    reportError(err);
    reportError(err);
    reportError(err);
    await new Promise((r) => setTimeout(r, 0));

    expect(mockSupabaseInsert).toHaveBeenCalledTimes(1);
  });

  it('caps total error reports per session to prevent runaway loops', async () => {
    const { reportError } = await import('../observability');
    // Try to send 30 different errors — only 20 should make it through
    for (let i = 0; i < 30; i++) {
      reportError(new Error(`err number ${i}`));
    }
    await new Promise((r) => setTimeout(r, 0));

    expect(mockSupabaseInsert.mock.calls.length).toBeLessThanOrEqual(20);
  });

  it('never throws when the Supabase insert itself errors', async () => {
    mockSupabaseInsert.mockRejectedValue(new Error('network down'));
    const { reportError } = await import('../observability');

    expect(() => reportError(new Error('oops'))).not.toThrow();
  });
});

describe('observability — setObservabilityUser', () => {
  it('is a no-op when Sentry is not initialized', async () => {
    const { setObservabilityUser } = await import('../observability');
    setObservabilityUser('user-123');
    expect(mockSentrySetUser).not.toHaveBeenCalled();
  });
});
