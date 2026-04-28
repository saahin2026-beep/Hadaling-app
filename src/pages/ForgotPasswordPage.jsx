import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, EnvelopeSimple, EnvelopeOpen } from '@phosphor-icons/react';
import { supabase } from '../utils/supabase';
import { useLanguage } from '../utils/useLanguage';
import { trackEvent, reportError } from '../utils/observability';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(t('signup.error_email'));
      return;
    }
    setLoading(true); setError('');
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmed, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetError) {
      reportError(new Error('forgot_password_reset_failed'), { code: resetError.code, message: resetError.message });
    }
    trackEvent('forgot_password_requested');
    // Always show "sent" — never reveal whether the email exists (account enumeration protection).
    setSent(true);
  };

  if (sent) {
    return (
      <div className="page-fixed" style={{
        background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-80px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(20px, 5vw, 32px)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: 'rgba(34,211,238,0.18)', border: '1px solid rgba(34,211,238,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 'clamp(16px, 3vh, 28px)',
          }}>
            <EnvelopeOpen size={42} weight="fill" color="#22D3EE" />
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', marginBottom: 'clamp(10px, 2vh, 16px)' }}>
            {t('forgot.sent_title')}
          </h1>
          <p style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', color: 'rgba(255,255,255,0.75)', fontFamily: 'Nunito, sans-serif', lineHeight: 1.6, marginBottom: 'clamp(20px, 4vh, 32px)' }}>
            {t('forgot.sent_body')}
          </p>
          <button type="button" onClick={() => navigate('/login')} style={{
            padding: 'clamp(10px, 2.2vh, 14px) clamp(24px, 6vw, 36px)', borderRadius: 'clamp(8px, 2vw, 12px)',
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
            fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
            cursor: 'pointer', letterSpacing: '0.5px', textTransform: 'uppercase',
          }}>
            {t('forgot.back_to_login')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-fixed" style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
    }}>
      <div style={{ position: 'absolute', top: '-50px', right: '-80px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ padding: 'clamp(8px, 2vh, 14px) clamp(12px, 2.5vh, 20px)', position: 'relative', zIndex: 2 }}>
        <button type="button" aria-label="Back" onClick={() => navigate('/login')} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 'clamp(8px, 2vw, 12px)', padding: 'clamp(6px, 1.2vh, 10px) clamp(8px, 1.8vh, 14px)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={16} weight="bold" color="white" />
          <span style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 600, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{t('btn.back')}</span>
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(16px, 3vh, 28px)', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 6 }}>
          {t('forgot.title')}
        </h1>
        <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 'clamp(16px, 3vh, 24px)', maxWidth: 320 }}>
          {t('forgot.subtitle')}
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360 }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 'clamp(14px, 3vw, 20px)', padding: 'clamp(14px, 2.5vh, 22px)', border: '1px solid rgba(255,255,255,0.15)',
          }}>
            {error && (
              <div role="alert" style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: 10 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#FCA5A5', fontFamily: 'Nunito, sans-serif' }}>{error}</p>
              </div>
            )}

            <label style={labelStyle}>{t('signup.email_label')}</label>
            <div style={{ ...inputWrap, ...(focused ? focusStyle : {}) }}>
              <div style={iconWrap}><EnvelopeSimple size={16} weight="fill" color="white" /></div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={t('signup.email_placeholder')}
                autoComplete="email"
                style={inputStyle}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: 'clamp(12px, 2.5vh, 16px)', marginTop: 8,
              background: loading ? 'rgba(245,158,11,0.5)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              border: 'none', borderRadius: 'clamp(8px, 2vw, 12px)',
              fontSize: 'clamp(13px, 3.2vw, 15px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              {loading ? t('forgot.loading') : t('forgot.submit')}
            </button>
          </div>
        </form>
      </div>

      <div style={{ height: 'max(16px, env(safe-area-inset-bottom))', flexShrink: 0 }} />
    </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginBottom: 6, display: 'block', letterSpacing: '0.5px', textTransform: 'uppercase' };
const inputWrap = { display: 'flex', alignItems: 'center', gap: 10, padding: 3, borderRadius: 12, background: 'rgba(255,255,255,0.08)', borderWidth: '1.5px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.12)', marginBottom: 10, transition: 'all 0.2s ease' };
const iconWrap = { width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const inputStyle = { flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, padding: '8px 0' };
const focusStyle = { borderColor: 'rgba(34,211,238,0.5)', boxShadow: '0 0 0 3px rgba(34,211,238,0.1)' };
