/**
 * The original ProfileSetup data-loss bug: each step was its own route
 * mount, so formData reset to {} every time, and only the LAST step's
 * value (city) actually persisted to the DB. These tests would have
 * caught it.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProfileSetup from '../ProfileSetup';
import { storage } from '../../utils/storage';

// ---- Mocks ----
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockRpc = vi.fn();

vi.mock('../../utils/supabase', () => ({
  supabase: {
    from: () => ({
      update: (payload) => {
        mockUpdate(payload);
        return { eq: (col, val) => { mockEq(col, val); return Promise.resolve({ error: null }); } };
      },
    }),
    rpc: (...args) => mockRpc(...args),
  },
}));

vi.mock('../../utils/observability', () => ({
  trackEvent: vi.fn(),
  setObservabilityUser: vi.fn(),
}));

function renderAtStep(step) {
  return render(
    <MemoryRouter initialEntries={[`/profile-setup/${step}`]}>
      <Routes>
        <Route path="/profile-setup/:step" element={<ProfileSetup />} />
        <Route path="/home" element={<div>HOME</div>} />
        <Route path="/geel-world" element={<div>GEELWORLD</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  mockUpdate.mockReset();
  mockEq.mockReset();
  mockRpc.mockReset();
  // Default: every username we ask about is available.
  mockRpc.mockResolvedValue({ data: true, error: null });
  // Pretend the user is already authed and has a userId in storage.
  storage.update({ userId: 'user-123', authComplete: true });
});

describe('ProfileSetup — data persistence across steps (regression for the original bug)', () => {
  it('persists each step to profileDraft as the user types, not just on the final step', async () => {
    const user = userEvent.setup();
    renderAtStep(0); // username step

    const input = screen.getByRole('textbox');
    await user.type(input, 'ahmed99');

    // After typing, the draft should be saved to storage so the next step
    // mount can read it back.
    expect(storage.get().profileDraft).toEqual(
      expect.objectContaining({ username: 'ahmed99' }),
    );
  });

  it('hydrates the form from profileDraft when re-mounting at a later step', () => {
    storage.update({
      profileDraft: { username: 'ahmed99', phone: '+252611234567', birthday: '', city: '' },
    });
    renderAtStep(1); // phone step

    const input = screen.getByRole('textbox');
    expect(input.value).toBe('+252611234567');
  });

  it('on final submit, sends ALL four fields to Supabase, not just the last one', async () => {
    const user = userEvent.setup();
    storage.update({
      profileDraft: {
        username: 'ahmed99',
        phone: '+252611234567',
        birthday: '1995-05-15',
        city: 'Muqdisho',
      },
    });
    renderAtStep(3); // city step (last)

    // Pick "Muqdisho" — its presence ensures the city field is kept.
    await user.click(screen.getByRole('button', { name: /Muqdisho/i }));
    // Hit the submit button.
    await user.click(screen.getByRole('button', { name: /finish|dhammaystir/i }));

    // The KEY assertion: every field is in the payload, not blank.
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'ahmed99',
        phone: '+252611234567',
        birthday: '1995-05-15',
        city: 'Muqdisho',
        profile_complete: true,
      }),
    );
    expect(mockEq).toHaveBeenCalledWith('id', 'user-123');
  });

  it('clears profileDraft after successful save so a new user starts fresh', async () => {
    const user = userEvent.setup();
    storage.update({
      profileDraft: {
        username: 'ahmed99',
        phone: '+252611234567',
        birthday: '1995-05-15',
        city: 'Muqdisho',
      },
    });
    renderAtStep(3);
    await user.click(screen.getByRole('button', { name: /Muqdisho/i }));
    await user.click(screen.getByRole('button', { name: /finish|dhammaystir/i }));

    // Wait a tick for the await to resolve.
    await vi.waitFor(() => expect(storage.get().profileComplete).toBe(true));
    expect(storage.get().profileDraft).toBeNull();
  });
});

describe('ProfileSetup — username live availability', () => {
  it('blocks submit on the username step when the username is taken', async () => {
    mockRpc.mockResolvedValue({ data: false, error: null });
    const user = userEvent.setup();
    renderAtStep(0);

    const input = screen.getByRole('textbox');
    await user.type(input, 'ahmed99');

    // findByRole wraps in act and polls until the status appears, draining
    // the 500ms debounce + the RPC promise without leaking updates.
    const statusEl = await screen.findByRole('status', {}, { timeout: 2000 });
    expect(statusEl.textContent).toMatch(/taken|hore/i);

    // Same here — wait for the disabled state to settle in act-aware fashion.
    await vi.waitFor(() => {
      const continueBtn = screen.getByRole('button', { name: /continue|sii|finish/i });
      expect(continueBtn).toBeDisabled();
    });
  });

  it('lowercases the username on input so case can\'t bypass the unique check', async () => {
    const user = userEvent.setup();
    renderAtStep(0);

    const input = screen.getByRole('textbox');
    await user.type(input, 'AhMeD99');
    expect(input.value).toBe('ahmed99');
  });
});
