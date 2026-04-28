import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, At, Phone, Calendar, MapPin, CheckCircle, XCircle, CircleNotch } from '@phosphor-icons/react';
import { supabase } from '../utils/supabase';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import { trackEvent, reportError } from '../utils/observability';
import somaliCities from '../data/somaliCities';
import Toast from '../components/Toast';

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', username: '', phone: '', birthday: '', city: '' });
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  // 'idle' | 'invalid' | 'checking' | 'available' | 'taken' | 'error'
  const [usernameStatus, setUsernameStatus] = useState('idle');
  const checkTimerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { navigate('/login'); return; }

      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('name, username, phone, birthday, city')
        .eq('id', userData.user.id)
        .maybeSingle();

      if (!mounted) return;
      if (fetchError) {
        setError(t('profile.error_generic'));
        setLoading(false);
        return;
      }

      // Fall back to storage / user_metadata when profile fields are empty
      // (covers users who signed up before the ProfileSetup data-loss fix).
      const localState = storage.get();
      const meta = userData.user.user_metadata || {};
      const initial = {
        name: profile?.name || localState.userName || meta.name || '',
        username: profile?.username || localState.username || '',
        phone: profile?.phone || '',
        birthday: profile?.birthday || '',
        city: profile?.city || '',
      };
      setForm(initial);
      setOriginal(initial);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [navigate, t]);

  // Live username availability check (debounced 500ms).
  useEffect(() => {
    if (checkTimerRef.current) clearTimeout(checkTimerRef.current);
    if (!original) return;

    const value = form.username.trim().toLowerCase();
    if (!value) { setUsernameStatus('idle'); return; }
    if (value === (original.username || '').toLowerCase()) { setUsernameStatus('idle'); return; }
    if (value.length < 3 || !/^[a-z0-9_]+$/.test(value)) {
      setUsernameStatus('invalid');
      return;
    }

    setUsernameStatus('checking');
    checkTimerRef.current = setTimeout(async () => {
      const { data, error: rpcError } = await supabase.rpc('check_username_available', { check_username: value });
      if (rpcError) {
        setUsernameStatus('error');
        return;
      }
      setUsernameStatus(data === true ? 'available' : 'taken');
    }, 500);

    return () => { if (checkTimerRef.current) clearTimeout(checkTimerRef.current); };
  }, [form.username, original]);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  };

  const validate = () => {
    if (form.name.trim().length < 2) return t('signup.error_name');
    const usernameNorm = form.username.trim().toLowerCase();
    if (!usernameNorm || usernameNorm.length < 3) return t('profile.error_username_length');
    if (!/^[a-z0-9_]+$/.test(usernameNorm)) return t('profile.error_username_chars');
    const cleanedPhone = (form.phone || '').replace(/[\s-]+/g, '');
    if (!cleanedPhone) return t('profile.error_phone');
    if (!/^\+?\d{7,15}$/.test(cleanedPhone)) return t('profile.error_phone');
    if (!form.birthday) return t('profile.error_birthday');
    if (!form.city) return t('profile.error_city');
    return null;
  };

  const dirty = original && Object.keys(form).some((k) => (form[k] || '') !== (original[k] || ''));

  const handleSave = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    if (usernameStatus === 'taken') { setError(t('profile.error_username_taken')); return; }
    if (usernameStatus === 'checking') return; // Wait for the check to finish

    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { navigate('/login'); return; }

    const payload = {
      name: form.name.trim(),
      username: form.username.trim().toLowerCase(),
      phone: form.phone.trim(),
      birthday: form.birthday,
      city: form.city,
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', userData.user.id);

    setSaving(false);
    if (updateError) {
      if (updateError.message?.includes('unique') || updateError.code === '23505') {
        setError(t('profile.error_username_taken'));
      } else {
        setError(updateError.message);
        reportError(new Error('profile_edit_save_failed'), { code: updateError.code, message: updateError.message });
      }
      return;
    }

    storage.update({ userName: payload.name, username: payload.username });
    setOriginal(payload);
    trackEvent('profile_edit_saved');
    setToast({ message: t('profile_edit.saved'), type: 'success' });
  };

  if (loading) {
    return (
      <div className="page-fixed" style={{
        background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      }} />
    );
  }

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
          {t('profile_edit.title')}
        </h1>
      </div>

      <form onSubmit={handleSave} style={{ padding: '0 16px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 18, padding: 18, border: '1px solid rgba(255,255,255,0.12)', marginBottom: 16,
        }}>
          {error && (
            <div role="alert" style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#FCA5A5', fontFamily: 'Nunito, sans-serif' }}>{error}</p>
            </div>
          )}

          <Field icon={User} label={t('signup.name_label')}>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" style={inputStyle} />
          </Field>

          <Field icon={At} label={t('profile.username_label')}>
            <input
              value={form.username}
              onChange={(e) => update('username', e.target.value.toLowerCase())}
              autoComplete="username"
              aria-describedby="username-status"
              style={inputStyle}
            />
            <UsernameStatusIcon status={usernameStatus} />
          </Field>
          <UsernameStatusMessage status={usernameStatus} t={t} />


          <Field icon={Phone} label={t('profile.phone_label')}>
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" inputMode="tel" placeholder={t('profile.phone_placeholder')} style={inputStyle} />
          </Field>

          <Field icon={Calendar} label={t('profile.birthday_label')}>
            <input
              type="date"
              value={form.birthday}
              onChange={(e) => update('birthday', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              min="1940-01-01"
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </Field>

          <Field icon={MapPin} label={t('profile.city_label')}>
            <select value={form.city} onChange={(e) => update('city', e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
              <option value="" disabled>{t('profile.city_label')}</option>
              {somaliCities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <button type="submit" disabled={saving || !dirty || usernameStatus === 'taken' || usernameStatus === 'checking'} style={{
            width: '100%', padding: 14, marginTop: 4,
            background: (saving || !dirty || usernameStatus === 'taken' || usernameStatus === 'checking')
              ? 'rgba(245,158,11,0.4)'
              : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            border: 'none', borderRadius: 12,
            fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
            cursor: (saving || !dirty || usernameStatus === 'taken' || usernameStatus === 'checking') ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {saving ? t('profile_edit.saving') : t('profile_edit.save')}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      <div style={inputWrap}>
        <div style={iconWrap}><Icon size={16} weight="fill" color="white" /></div>
        {children}
      </div>
    </div>
  );
}

function UsernameStatusIcon({ status }) {
  if (status === 'idle') return null;
  const wrap = { paddingRight: 10, display: 'flex', alignItems: 'center', flexShrink: 0 };
  if (status === 'checking') return (
    <div style={wrap}>
      <CircleNotch size={16} weight="bold" color="rgba(255,255,255,0.7)" style={{ animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (status === 'available') return <div style={wrap}><CheckCircle size={18} weight="fill" color="#10B981" /></div>;
  if (status === 'taken' || status === 'invalid') return <div style={wrap}><XCircle size={18} weight="fill" color="#EF4444" /></div>;
  return null;
}

function UsernameStatusMessage({ status, t }) {
  if (status === 'idle' || status === 'checking') return null;
  const text =
    status === 'available' ? t('profile_edit.username_available') :
    status === 'taken' ? t('profile.error_username_taken') :
    status === 'invalid' ? t('profile.error_username_chars') :
    null;
  if (!text) return null;
  const color = status === 'available' ? '#34D399' : '#FCA5A5';
  return (
    <p id="username-status" role="status" style={{ fontSize: 11, fontWeight: 600, color, fontFamily: 'Nunito, sans-serif', marginTop: -6, marginBottom: 8, paddingLeft: 4 }}>
      {text}
    </p>
  );
}

const labelStyle = { fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginBottom: 6, display: 'block', letterSpacing: '0.5px', textTransform: 'uppercase' };
const inputWrap = { display: 'flex', alignItems: 'center', gap: 10, padding: 3, borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)' };
const iconWrap = { width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const inputStyle = { flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600, padding: '8px 4px 8px 0' };
