import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ForgotPasswordPage from '../ForgotPasswordPage';

const mockReset = vi.fn();

vi.mock('../../utils/supabase', () => ({
  supabase: {
    auth: { resetPasswordForEmail: (...args) => mockReset(...args) },
  },
}));

vi.mock('../../utils/observability', () => ({
  trackEvent: vi.fn(),
  reportError: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/forgot-password']}>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/login" element={<div>LOGIN</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockReset.mockReset();
});

describe('ForgotPasswordPage', () => {
  it('rejects malformed email without calling Supabase', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByPlaceholderText(/email|tusaale/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /send link|dir link/i }));
    expect(mockReset).not.toHaveBeenCalled();
  });

  it('calls resetPasswordForEmail with redirectTo=/reset-password', async () => {
    mockReset.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/email|tusaale/i), 'user@example.com');
    await user.click(screen.getByRole('button', { name: /send link|dir link/i }));

    expect(mockReset).toHaveBeenCalledWith('user@example.com', expect.objectContaining({
      redirectTo: expect.stringContaining('/reset-password'),
    }));
  });

  it('always shows the "check email" success state, even when Supabase errors (account-enumeration protection)', async () => {
    mockReset.mockResolvedValue({ error: { message: 'User not found' } });
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/email|tusaale/i), 'user@example.com');
    await user.click(screen.getByRole('button', { name: /send link|dir link/i }));

    await screen.findByText(/check your email|hubi email/i);
  });

  it('lowercases and trims the email before submission', async () => {
    mockReset.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText(/email|tusaale/i), '  USER@Example.com  ');
    await user.click(screen.getByRole('button', { name: /send link|dir link/i }));

    expect(mockReset).toHaveBeenCalledWith('user@example.com', expect.any(Object));
  });
});
