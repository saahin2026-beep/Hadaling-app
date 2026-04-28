import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeSlash, CheckCircle } from '@phosphor-icons/react';
import { supabase } from '../utils/supabase';
import { useLanguage } from '../utils/useLanguage';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Only allow resetting when arriving from a valid password recovery link.
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted && data.session) setAuthorized(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) setAuthorized(true);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) { setError(t('signup.error_password')); return; }
    if (password !== confirm) { setError(t('reset.error_mismatch')); return; }
    setLoading(true); setError('');
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  if (!authorized) {
    return (
      <div className="page-fixed" style={{
        background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', padding: 32, maxWidth: 360 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', marginBottom: 12 }}>
            {t('reset.expired_title')}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif', marginBottom: 24, lineHeight: 1.6 }}>
            {t('reset.expired_body')}
          </p>
          <button type="button" onClick={() => navigate('/forgot-password')} style={{
            padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            border: 'none', fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
            cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {t('reset.try_again')}
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="page-fixed" style={{
        background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', padding: 32 }}>
          <CheckCircle size={88} weight="fill" color="#10B981" />
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', marginTop: 16 }}>
            {t('reset.success')}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-fixed" style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(16px, 3vh, 28px)' }}>
        <h1 style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 6 }}>
          {t('reset.title')}
        </h1>
        <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 'clamp(16px, 3vh, 24px)' }}>
          {t('reset.subtitle')}
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360 }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 18, padding: 18, border: '1px solid rgba(255,255,255,0.15)',
          }}>
            {error && (
              <div role="alert" style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: 10 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#FCA5A5', fontFamily: 'Nunito, sans-serif' }}>{error}</p>
              </div>
            )}

            <label style={labelStyle}>{t('reset.new_password')}</label>
            <div style={{ ...inputWrap, ...(focusedField === 'pw' ? focusStyle : {}) }}>
              <div style={iconWrap}><Lock size={16} weight="fill" color="white" /></div>
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('pw')}
                onBlur={() => setFocusedField(null)}
                autoComplete="new-password"
                style={inputStyle}
              />
              <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} style={eyeBtn}>
                {show ? <EyeSlash size={16} color="rgba(255,255,255,0.5)" /> : <Eye size={16} color="rgba(255,255,255,0.5)" />}
              </button>
            </div>

            <label style={labelStyle}>{t('reset.confirm_password')}</label>
            <div style={{ ...inputWrap, ...(focusedField === 'cf' ? focusStyle : {}) }}>
              <div style={iconWrap}><Lock size={16} weight="fill" color="white" /></div>
              <input
                type={show ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onFocus={() => setFocusedField('cf')}
                onBlur={() => setFocusedField(null)}
                autoComplete="new-password"
                style={inputStyle}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: 14, marginTop: 4,
              background: loading ? 'rgba(245,158,11,0.5)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              border: 'none', borderRadius: 12,
              fontSize: 15, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              {loading ? t('reset.saving') : t('reset.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginBottom: 6, display: 'block', letterSpacing: '0.5px', textTransform: 'uppercase' };
const inputWrap = { display: 'flex', alignItems: 'center', gap: 10, padding: 3, borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', marginBottom: 10, transition: 'all 0.2s ease' };
const iconWrap = { width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const inputStyle = { flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, padding: '8px 0' };
const focusStyle = { borderColor: 'rgba(34,211,238,0.5)', boxShadow: '0 0 0 3px rgba(34,211,238,0.1)' };
const eyeBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: 6 };
