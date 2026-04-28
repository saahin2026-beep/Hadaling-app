import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, EnvelopeSimple, Lock, Eye, EyeSlash, CheckCircle, SignOut } from '@phosphor-icons/react';
import { supabase } from '../utils/supabase';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import Toast from '../components/Toast';

export default function AccountSecurityPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPw, setLoadingPw] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [pwError, setPwError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted && data.user) setEmail(data.user.email || '');
    });
    return () => { mounted = false; };
  }, []);

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailError('');
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError(t('signup.error_email'));
      return;
    }
    if (trimmed === email) {
      setEmailError(t('account.email_same'));
      return;
    }
    setLoadingEmail(true);
    const { error } = await supabase.auth.updateUser(
      { email: trimmed },
      { emailRedirectTo: `${window.location.origin}/` },
    );
    setLoadingEmail(false);
    if (error) {
      setEmailError(error.message);
      return;
    }
    setNewEmail('');
    setToast({ message: t('account.email_change_sent'), type: 'success' });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    if (newPw.length < 8) { setPwError(t('signup.error_password')); return; }
    if (newPw !== confirmPw) { setPwError(t('reset.error_mismatch')); return; }

    // Re-authenticate to confirm the user knows their current password.
    setLoadingPw(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPw });
    if (signInError) {
      setLoadingPw(false);
      setPwError(t('account.wrong_current_pw'));
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPw });
    setLoadingPw(false);
    if (updateError) {
      setPwError(updateError.message);
      return;
    }
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setToast({ message: t('account.password_changed'), type: 'success' });
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    await supabase.auth.signOut();
    storage.reset();
    window.location.href = '/';
  };

  return (
    <div className="page-scroll" style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      paddingBottom: 'max(40px, env(safe-area-inset-bottom))',
    }}>
      <Toast {...(toast || {})} onDismiss={() => setToast(null)} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
        <button type="button" aria-label="Back" onClick={() => navigate('/astaanta')} style={{
          background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 12,
          padding: 10, cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}>
          <ArrowLeft size={20} weight="bold" color="white" />
        </button>
        <h1 style={{ fontSize: 17, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
          {t('account.title')}
        </h1>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480, margin: '0 auto' }}>
        {/* Current email */}
        <Section title={t('account.email_title')}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', marginBottom: 6 }}>
            {t('account.current_email')}
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif', marginBottom: 14, wordBreak: 'break-all' }}>
            {email || '—'}
          </p>

          <form onSubmit={handleEmailChange}>
            {emailError && <ErrorBanner message={emailError} />}
            <label style={labelStyle}>{t('account.new_email')}</label>
            <div style={inputWrap}>
              <div style={iconWrap}><EnvelopeSimple size={16} weight="fill" color="white" /></div>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={t('signup.email_placeholder')}
                autoComplete="email"
                style={inputStyle}
              />
            </div>
            <button type="submit" disabled={loadingEmail} style={primaryBtn(loadingEmail)}>
              {loadingEmail ? t('account.saving') : t('account.update_email')}
            </button>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginTop: 8, lineHeight: 1.5 }}>
              {t('account.email_help')}
            </p>
          </form>
        </Section>

        {/* Change password */}
        <Section title={t('account.password_title')}>
          <form onSubmit={handlePasswordChange}>
            {pwError && <ErrorBanner message={pwError} />}

            <label style={labelStyle}>{t('account.current_password')}</label>
            <div style={inputWrap}>
              <div style={iconWrap}><Lock size={16} weight="fill" color="white" /></div>
              <input
                type={showPw ? 'text' : 'password'}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                autoComplete="current-password"
                style={inputStyle}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? 'Hide password' : 'Show password'} style={eyeBtn}>
                {showPw ? <EyeSlash size={16} color="rgba(255,255,255,0.5)" /> : <Eye size={16} color="rgba(255,255,255,0.5)" />}
              </button>
            </div>

            <label style={labelStyle}>{t('reset.new_password')}</label>
            <div style={inputWrap}>
              <div style={iconWrap}><Lock size={16} weight="fill" color="white" /></div>
              <input
                type={showPw ? 'text' : 'password'}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                autoComplete="new-password"
                style={inputStyle}
              />
            </div>

            <label style={labelStyle}>{t('reset.confirm_password')}</label>
            <div style={inputWrap}>
              <div style={iconWrap}><Lock size={16} weight="fill" color="white" /></div>
              <input
                type={showPw ? 'text' : 'password'}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                autoComplete="new-password"
                style={inputStyle}
              />
            </div>

            <button type="submit" disabled={loadingPw} style={primaryBtn(loadingPw)}>
              {loadingPw ? t('account.saving') : t('account.update_password')}
            </button>
          </form>
        </Section>

        {/* Sign out */}
        <Section title={t('account.session_title')}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', lineHeight: 1.5, marginBottom: 14 }}>
            {t('account.signout_help')}
          </p>
          <button type="button" onClick={handleLogout} disabled={loadingLogout} style={{
            width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(239,68,68,0.4)',
            background: 'rgba(239,68,68,0.15)', cursor: loadingLogout ? 'not-allowed' : 'pointer',
            color: '#FCA5A5', fontSize: 14, fontWeight: 800, fontFamily: 'Nunito, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            <SignOut size={16} weight="bold" />
            {loadingLogout ? t('account.signing_out') : t('account.signout')}
          </button>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderRadius: 18, padding: 18, border: '1px solid rgba(255,255,255,0.12)',
    }}>
      <h2 style={{ fontSize: 15, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', marginBottom: 14 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div role="alert" style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: 10 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#FCA5A5', fontFamily: 'Nunito, sans-serif' }}>{message}</p>
    </div>
  );
}

function primaryBtn(loading) {
  return {
    width: '100%', padding: 14, marginTop: 4,
    background: loading ? 'rgba(245,158,11,0.5)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    border: 'none', borderRadius: 12,
    fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
    cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
  };
}

const labelStyle = { fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginBottom: 6, display: 'block', letterSpacing: '0.5px', textTransform: 'uppercase' };
const inputWrap = { display: 'flex', alignItems: 'center', gap: 10, padding: 3, borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', marginBottom: 10 };
const iconWrap = { width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const inputStyle = { flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, padding: '8px 0' };
const eyeBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: 6 };
