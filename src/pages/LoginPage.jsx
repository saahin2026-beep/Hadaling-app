import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, EnvelopeSimple, Lock, Eye, EyeSlash } from '@phosphor-icons/react';
import { supabase } from '../utils/supabase';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password) { setError(t('login.error_fill')); return; }
    setLoading(true); setError('');
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email: form.email.trim().toLowerCase(), password: form.password });
      if (loginError) { setError(t('login.error_credentials')); setLoading(false); return; }
      const { data: profile } = await supabase.from('profiles').select('profile_complete, name').eq('id', data.user.id).single();
      storage.update({ authComplete: true, userId: data.user.id, userName: profile?.name || '', profileComplete: profile?.profile_complete || false });
      navigate(profile?.profile_complete ? '/home' : '/profile-setup/0');
    } catch (e) { setError(t('login.error_generic')); console.error(e); }
    setLoading(false);
  };

  return (
    <div className="page-fixed" style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
    }}>
      <style>{`
        @keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }
      `}</style>

      <div style={{ position: 'absolute', top: '-50px', right: '-80px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-60px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ padding: 'clamp(8px, 2vh, 14px) 16px', position: 'relative', zIndex: 2, flexShrink: 0 }}>
        <button onClick={() => navigate('/auth-gate')} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 12, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={16} weight="bold" color="white" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{t('btn.back')}</span>
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', position: 'relative', zIndex: 1, minHeight: 0 }}>

        <h1 style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 4 }}>
          {t('login.title')}
        </h1>
        <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 'clamp(12px, 3vh, 24px)' }}>
          {t('login.subtitle')}
        </p>

        {/* Form Card */}
        <div style={{
          width: '100%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 20, padding: 'clamp(16px, 3vh, 24px) clamp(16px, 4vw, 22px)', border: '1px solid rgba(255,255,255,0.15)',
        }}>
          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#FCA5A5', fontFamily: 'Nunito, sans-serif' }}>{error}</p>
            </div>
          )}

          <label style={labelStyle}>{t('signup.email_label')}</label>
          <div style={{ ...inputWrap, ...(focusedField === 'email' ? focusStyle : {}) }}>
            <div style={iconWrap}><EnvelopeSimple size={16} weight="fill" color="white" /></div>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} placeholder={t('signup.email_placeholder')} style={inputStyle} />
          </div>

          <label style={labelStyle}>{t('signup.password_label')}</label>
          <div style={{ ...inputWrap, ...(focusedField === 'password' ? focusStyle : {}) }}>
            <div style={iconWrap}><Lock size={16} weight="fill" color="white" /></div>
            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} placeholder={t('signup.password_placeholder')} style={inputStyle} />
            <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              {showPassword ? <EyeSlash size={16} color="rgba(255,255,255,0.5)" /> : <Eye size={16} color="rgba(255,255,255,0.5)" />}
            </button>
          </div>

          <button onClick={handleLogin} disabled={loading} style={{
            width: '100%', padding: 'clamp(12px, 2.5vh, 16px)', marginTop: 4,
            background: loading ? 'rgba(245,158,11,0.5)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            border: 'none', borderRadius: 12, fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
            cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 6px 24px rgba(245,158,11,0.35)',
            position: 'relative', overflow: 'hidden', textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {!loading && <div style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', animation: 'shimmer 2s infinite' }} />}
            <span style={{ position: 'relative', zIndex: 1 }}>{loading ? t('login.loading') : t('login.button')}</span>
          </button>
        </div>

        <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 'clamp(12px, 3vh, 24px)' }}>
          {t('login.no_account')}{' '}
          <span onClick={() => navigate('/signup')} style={{ color: '#22D3EE', cursor: 'pointer', fontWeight: 700 }}>{t('login.signup_link')}</span>
        </p>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginBottom: 6, display: 'block', letterSpacing: '0.5px', textTransform: 'uppercase' };
const inputWrap = { display: 'flex', alignItems: 'center', gap: 10, padding: '3px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', marginBottom: 12, transition: 'all 0.2s ease' };
const iconWrap = { width: 38, height: 38, borderRadius: 9, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const inputStyle = { flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, padding: '10px 0' };
const focusStyle = { borderColor: 'rgba(34,211,238,0.5)', boxShadow: '0 0 0 3px rgba(34,211,238,0.1)' };
