import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, EnvelopeSimple, Lock, Eye, EyeSlash, EnvelopeOpen } from '@phosphor-icons/react';
import { supabase } from '../utils/supabase';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import { trackEvent } from '../utils/observability';

export default function SignupPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length < 2) return t('signup.error_name');
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return t('signup.error_email');
    if (!form.password || form.password.length < 8) return t('signup.error_password');
    return null;
  };

  const handleSignup = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    try {
      const email = form.email.trim().toLowerCase();
      const name = form.name.trim();
      const { data, error: signupError } = await supabase.auth.signUp({
        email, password: form.password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/profile-setup/0`,
        },
      });
      if (signupError) {
        setError(signupError.message.includes('already registered') ? t('signup.error_exists') : signupError.message);
        setLoading(false); return;
      }

      if (!data.session) {
        // Email confirmation required — wait for the listener in App.jsx to handle the SIGNED_IN event.
        storage.update({ awaitingEmailConfirmation: true, pendingEmail: email, pendingName: name });
        trackEvent('signup_submitted', { needsConfirmation: true });
        setPendingEmail(email);
        setLoading(false);
        return;
      }
      trackEvent('signup_submitted', { needsConfirmation: false });

      storage.update({ authComplete: true, userId: data.user?.id, userName: name });
      navigate('/profile-setup/0');
    } catch (e) { setError(t('signup.error_generic')); console.error(e); }
    setLoading(false);
  };

  if (pendingEmail) {
    return (
      <div className="page-fixed" style={{
        background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-80px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '-60px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(20px, 5vw, 32px)', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: 'rgba(34,211,238,0.18)', border: '1px solid rgba(34,211,238,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 'clamp(16px, 3vh, 28px)', boxShadow: '0 8px 30px rgba(34,211,238,0.2)',
          }}>
            <EnvelopeOpen size={42} weight="fill" color="#22D3EE" />
          </div>

          <h1 style={{ fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', marginBottom: 'clamp(10px, 2vh, 16px)' }}>
            {t('signup.check_email_title')}
          </h1>

          <p style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', color: 'rgba(255,255,255,0.75)', fontFamily: 'Nunito, sans-serif', lineHeight: 1.6, marginBottom: 'clamp(6px, 1.2vh, 10px)' }}>
            {t('signup.check_email_intro')}
          </p>

          <p style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 800, color: '#22D3EE', fontFamily: 'Nunito, sans-serif', marginBottom: 'clamp(12px, 2.5vh, 20px)', wordBreak: 'break-all' }}>
            {pendingEmail}
          </p>

          <p style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', color: 'rgba(255,255,255,0.75)', fontFamily: 'Nunito, sans-serif', lineHeight: 1.6, marginBottom: 'clamp(6px, 1.2vh, 10px)' }}>
            {t('signup.check_email_action')}
          </p>

          <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginBottom: 'clamp(20px, 4vh, 32px)' }}>
            {t('signup.check_email_spam')}
          </p>

          <button onClick={() => { setPendingEmail(null); navigate('/auth-gate'); }} style={{
            padding: 'clamp(10px, 2.2vh, 14px) clamp(24px, 6vw, 36px)', borderRadius: 'clamp(8px, 2vw, 12px)',
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
            fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
            cursor: 'pointer', letterSpacing: '0.5px',
          }}>
            {t('signup.check_email_back')}
          </button>
        </div>

        <div style={{ height: 'max(16px, env(safe-area-inset-bottom))', flexShrink: 0 }} />
      </div>
    );
  }

  return (
    <div className="page-fixed" style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
    }}>
      <style>{`@keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }`}</style>

      <div style={{ position: 'absolute', top: '-50px', right: '-80px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', left: '-60px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ padding: 'clamp(8px, 2vh, 14px) clamp(12px, 2.5vh, 20px)', position: 'relative', zIndex: 2, flexShrink: 0 }}>
        <button onClick={() => navigate('/auth-gate')} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 'clamp(8px, 2vw, 12px)', padding: 'clamp(6px, 1.2vh, 10px) clamp(8px, 1.8vh, 14px)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'clamp(3px, 0.8vh, 6px)' }}>
          <ArrowLeft size={16} weight="bold" color="white" />
          <span style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 600, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{t('btn.back')}</span>
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(16px, 3vh, 28px)', position: 'relative', zIndex: 1, minHeight: 0 }}>

        <h1 style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 2 }}>
          {t('signup.title')}
        </h1>
        <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 'clamp(10px, 2.5vh, 20px)' }}>
          {t('signup.have_account')}{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#22D3EE', cursor: 'pointer', fontWeight: 700 }}>{t('signup.login_link')}</span>
        </p>

        {/* Form Card */}
        <div style={{
          width: '100%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 'clamp(14px, 3vw, 20px)', padding: 'clamp(14px, 2.5vh, 22px) clamp(14px, 3.5vw, 20px)', border: '1px solid rgba(255,255,255,0.15)',
        }}>
          {error && (
            <div style={{ padding: 'clamp(6px, 1.2vh, 10px) clamp(8px, 1.8vh, 14px)', borderRadius: 'clamp(8px, 2vw, 12px)', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: 'clamp(6px, 1.2vh, 10px)' }}>
              <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 600, color: '#FCA5A5', fontFamily: 'Nunito, sans-serif' }}>{error}</p>
            </div>
          )}

          <label style={labelStyle}>{t('signup.name_label')}</label>
          <div style={{ ...inputWrap, ...(focusedField === 'name' ? focusStyle : {}) }}>
            <div style={iconWrap}><User size={16} weight="fill" color="white" /></div>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} placeholder={t('signup.name_placeholder')} style={inputStyle} />
          </div>

          <label style={labelStyle}>{t('signup.email_label')}</label>
          <div style={{ ...inputWrap, ...(focusedField === 'email' ? focusStyle : {}) }}>
            <div style={iconWrap}><EnvelopeSimple size={16} weight="fill" color="white" /></div>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} placeholder={t('signup.email_placeholder')} style={inputStyle} />
          </div>

          <label style={labelStyle}>{t('signup.password_label')}</label>
          <div style={{ ...inputWrap, ...(focusedField === 'password' ? focusStyle : {}) }}>
            <div style={iconWrap}><Lock size={16} weight="fill" color="white" /></div>
            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} placeholder={t('signup.password_placeholder')} style={inputStyle} />
            <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 'clamp(3px, 0.8vh, 6px)' }}>
              {showPassword ? <EyeSlash size={16} color="rgba(255,255,255,0.5)" /> : <Eye size={16} color="rgba(255,255,255,0.5)" />}
            </button>
          </div>

          <button onClick={handleSignup} disabled={loading} style={{
            width: '100%', padding: 'clamp(12px, 2.5vh, 16px)', marginTop: 2,
            background: loading ? 'rgba(245,158,11,0.5)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            border: 'none', borderRadius: 'clamp(8px, 2vw, 12px)', fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
            cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 6px 24px rgba(245,158,11,0.35)',
            position: 'relative', overflow: 'hidden', textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {!loading && <div style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', animation: 'shimmer 2s infinite' }} />}
            <span style={{ position: 'relative', zIndex: 1 }}>{loading ? t('signup.loading') : t('signup.button')}</span>
          </button>
        </div>
      </div>

      <div style={{ height: 'max(16px, env(safe-area-inset-bottom))', flexShrink: 0 }} />
    </div>
  );
}

const labelStyle = { fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginBottom: 'clamp(3px, 0.8vh, 6px)', display: 'block', letterSpacing: '0.5px', textTransform: 'uppercase' };
const inputWrap = { display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.2vh, 10px)', padding: '3px', borderRadius: 'clamp(8px, 2vw, 12px)', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', marginBottom: 'clamp(6px, 1.2vh, 10px)', transition: 'all 0.2s ease' };
const iconWrap = { width: 36, height: 36, borderRadius: 'clamp(7px, 1.5vw, 9px)', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const inputStyle = { flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 'clamp(13px, 3.2vw, 15px)', color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, padding: 'clamp(6px, 1.2vh, 10px) 0' };
const focusStyle = { borderColor: 'rgba(34,211,238,0.5)', boxShadow: '0 0 0 3px rgba(34,211,238,0.1)' };
