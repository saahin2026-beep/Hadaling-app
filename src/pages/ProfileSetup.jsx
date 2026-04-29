import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Phone, Calendar, MapPin, At, CheckCircle, XCircle, CircleNotch } from '@phosphor-icons/react';
import { supabase } from '../utils/supabase';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import { useData } from '../utils/DataContext';
import { trackEvent, reportError } from '../utils/observability';
import somaliCities from '../data/somaliCities';
import Geel from '../components/Geel';

// STRUCTURAL config — order, field key, icon, validation rules. NOT editable
// from admin. Admin controls only the visible content (titles, subtitles,
// placeholders), seeded into Supabase profile_setup_content table.
const STEP_CONFIGS = [
  { key: 'username', icon: At },
  { key: 'phone', icon: Phone },
  { key: 'birthday', icon: Calendar },
  { key: 'city', icon: MapPin },
];

// Hardcoded fallback content used until Supabase responds (or if it fails).
const FALLBACK_CONTENT = {
  username: { questionKey: 'profile.username_question', labelKey: 'profile.username_label', placeholderKey: 'profile.username_placeholder' },
  phone: { questionKey: 'profile.phone_question', labelKey: 'profile.phone_label', placeholderKey: 'profile.phone_placeholder' },
  birthday: { questionKey: 'profile.birthday_question', labelKey: 'profile.birthday_label', placeholderKey: '' },
  city: { questionKey: 'profile.city_question', labelKey: 'profile.city_label', placeholderKey: '' },
};

export default function ProfileSetup() {
  const { step } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { profileSetupContent } = useData();
  const currentStep = parseInt(step, 10);
  const [formData, setFormData] = useState(() => ({
    username: '', phone: '', birthday: '', city: '',
    ...(storage.get().profileDraft || {}),
  }));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState(false);
  // 'idle' | 'invalid' | 'checking' | 'available' | 'taken' | 'error'
  const [usernameStatus, setUsernameStatus] = useState('idle');
  const checkTimerRef = useRef(null);

  const stepConfig = STEP_CONFIGS[currentStep];

  // Content for this step: prefer admin-managed content from Supabase,
  // fall back to translation keys if Supabase hasn't responded yet.
  const dbContent = profileSetupContent?.[currentStep];
  const fallback = stepConfig ? FALLBACK_CONTENT[stepConfig.key] : null;
  const title = dbContent
    ? (lang === 'en' ? (dbContent.titleEn || dbContent.titleSo) : (dbContent.titleSo || dbContent.titleEn))
    : (fallback ? t(fallback.questionKey) : '');
  const subtitle = dbContent
    ? (lang === 'en' ? (dbContent.subtitleEn || dbContent.subtitleSo) : (dbContent.subtitleSo || dbContent.subtitleEn))
    : (fallback ? t(fallback.labelKey) : '');
  const placeholder = dbContent
    ? (lang === 'en' ? (dbContent.placeholderEn || dbContent.placeholderSo) : (dbContent.placeholderSo || dbContent.placeholderEn))
    : (fallback?.placeholderKey ? t(fallback.placeholderKey) : '');

  useEffect(() => {
    if (!stepConfig) navigate('/home');
  }, [stepConfig, navigate]);

  // Funnel tracking — see where users abandon profile setup
  useEffect(() => {
    if (stepConfig) trackEvent('profile_setup_step_viewed', { step: currentStep, key: stepConfig.key });
  }, [currentStep, stepConfig]);

  // Live username availability (only on the username step).
  useEffect(() => {
    if (stepConfig?.key !== 'username') return;
    if (checkTimerRef.current) clearTimeout(checkTimerRef.current);

    const value = (formData.username || '').trim().toLowerCase();
    if (!value) { setUsernameStatus('idle'); return; }
    if (value.length < 3 || !/^[a-z0-9_]+$/.test(value)) {
      setUsernameStatus('invalid');
      return;
    }

    setUsernameStatus('checking');
    checkTimerRef.current = setTimeout(async () => {
      const { data, error: rpcError } = await supabase.rpc('check_username_available', { check_username: value });
      if (rpcError) { setUsernameStatus('error'); return; }
      setUsernameStatus(data === true ? 'available' : 'taken');
    }, 500);

    return () => { if (checkTimerRef.current) clearTimeout(checkTimerRef.current); };
  }, [formData.username, stepConfig]);

  if (!stepConfig) return null;

  const updateField = (value) => {
    const next = { ...formData, [stepConfig.key]: value };
    setFormData(next);
    storage.update({ profileDraft: next });
    setError('');
  };

  const validate = () => {
    const val = formData[stepConfig.key];
    if (stepConfig.key === 'username') {
      const normalized = (val || '').trim().toLowerCase();
      if (!normalized || normalized.length < 3) return t('profile.error_username_length');
      if (!/^[a-z0-9_]+$/.test(normalized)) return t('profile.error_username_chars');
    }
    if (stepConfig.key === 'phone') {
      const cleaned = (val || '').replace(/[\s-]+/g, '');
      if (!cleaned) return t('profile.error_phone');
      if (!/^\+?\d{7,15}$/.test(cleaned)) return t('profile.error_phone');
    }
    if (stepConfig.key === 'birthday' && !val) return t('profile.error_birthday');
    if (stepConfig.key === 'city' && !val) return t('profile.error_city');
    return null;
  };

  const handleNext = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    if (stepConfig.key === 'username') {
      if (usernameStatus === 'taken') { setError(t('profile.error_username_taken')); return; }
      if (usernameStatus === 'checking') return; // wait for the check
    }

    if (currentStep < STEP_CONFIGS.length - 1) {
      navigate(`/profile-setup/${currentStep + 1}`);
    } else {
      setSaving(true);
      try {
        const state = storage.get();
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: formData.username.trim().toLowerCase(),
            phone: formData.phone.trim(),
            birthday: formData.birthday,
            city: formData.city,
            profile_complete: true,
          })
          .eq('id', state.userId);

        if (updateError) {
          if (updateError.message.includes('unique')) setError(t('profile.error_username_taken'));
          else { setError(updateError.message); reportError(new Error('profile_setup_save_failed'), { code: updateError.code, message: updateError.message }); }
          setSaving(false); return;
        }

        storage.update({
          profileComplete: true,
          username: formData.username.trim().toLowerCase(),
          profileDraft: null,
        });
        trackEvent('profile_setup_completed');
        navigate('/geel-world');
      } catch (e) {
        setError(t('profile.error_generic'));
        reportError(e, { where: 'ProfileSetup.handleNext' });
      }
      setSaving(false);
    }
  };

  const StepIcon = stepConfig.icon;

  return (
    <div className="page-fixed" style={{
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }
      `}</style>

      {/* Ambient lights */}
      <div style={{ position: 'absolute', top: '-40px', right: '-60px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '-50px', width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(6px, 1.2vh, 10px)', padding: 'clamp(12px, 2.5vh, 20px) clamp(16px, 3vh, 28px) 0', position: 'relative', zIndex: 2 }}>
        {Array.from({ length: STEP_CONFIGS.length }, (_, i) => (
          <div key={i} style={{
            width: i === currentStep ? 24 : 8, height: 8, borderRadius: 'clamp(3px, 0.8vh, 6px)',
            background: i === currentStep ? 'linear-gradient(90deg, #22D3EE, #F59E0B)' : i < currentStep ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
            boxShadow: i === currentStep ? '0 0 12px rgba(34,211,238,0.5)' : 'none',
          }} />
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'clamp(12px, 2.5vh, 20px) clamp(16px, 3vh, 28px) max(16px, env(safe-area-inset-bottom))', position: 'relative', zIndex: 2 }}>
        {/* Geel */}
        <div style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.2))' }}>
          <Geel size={100} expression={currentStep === STEP_CONFIGS.length - 1 ? 'celebrating' : 'happy'} />
        </div>
        <div style={{ height: 'clamp(12px, 2.5vh, 20px)' }} />

        {/* Icon badge */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(8,145,178,0.2)', border: '1px solid rgba(34,211,238,0.3)',
          boxShadow: '0 4px 20px rgba(34,211,238,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'clamp(12px, 2.5vh, 20px)',
        }}>
          <StepIcon size={26} weight="fill" color="white" />
        </div>

        {/* Question */}
        <h2 style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 'clamp(6px, 1.2vh, 10px)', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
          {title}
        </h2>
        <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', marginBottom: 'clamp(16px, 3vh, 28px)' }}>
          {subtitle}
        </p>

        {error && (
          <div style={{ padding: 'clamp(8px, 1.8vh, 14px) clamp(12px, 2.5vh, 20px)', borderRadius: 'clamp(8px, 2vw, 12px)', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: 'clamp(12px, 2.5vh, 20px)', width: '100%' }}>
            <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 600, color: '#FCA5A5', fontFamily: 'Nunito, sans-serif' }}>{error}</p>
          </div>
        )}

        {/* Input field */}
        <div style={{ width: '100%', marginBottom: 'clamp(16px, 3vh, 28px)' }}>
          {stepConfig.key === 'city' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.2vh, 10px)', maxHeight: 280, overflowY: 'auto' }}>
              {somaliCities.map((city) => (
                <button
                  key={city}
                  onClick={() => updateField(city)}
                  style={{
                    width: '100%', padding: 'clamp(8px, 1.8vh, 14px) clamp(12px, 2.5vh, 20px)', borderRadius: 'clamp(10px, 2.5vw, 16px)', textAlign: 'left',
                    border: formData.city === city ? '1.5px solid rgba(34,211,238,0.5)' : '1.5px solid rgba(255,255,255,0.12)',
                    background: formData.city === city ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.08)',
                    color: 'white',
                    fontSize: 'clamp(13px, 3.2vw, 15px)', fontWeight: formData.city === city ? 700 : 600,
                    fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: formData.city === city ? '0 0 20px rgba(34,211,238,0.15)' : 'none',
                  }}
                >
                  {formData.city === city && <MapPin size={16} weight="fill" color="#22D3EE" style={{ marginRight: 'clamp(6px, 1.2vh, 10px)', verticalAlign: 'middle' }} />}
                  {city}
                </button>
              ))}
            </div>
          ) : stepConfig.key === 'birthday' ? (
            <input
              type="date"
              value={formData.birthday}
              onChange={(e) => updateField(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              min="1940-01-01"
              style={{
                width: '100%', padding: 'clamp(12px, 2.5vh, 20px)', borderRadius: 'clamp(10px, 2.5vw, 16px)',
                border: '1.5px solid rgba(255,255,255,0.12)',
                fontSize: 'clamp(14px, 3.8vw, 17px)', fontFamily: 'Nunito, sans-serif', color: 'white',
                outline: 'none', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.08)',
              }}
            />
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.8vh, 14px)', padding: 'clamp(3px, 0.8vh, 6px)',
              borderRadius: 'clamp(10px, 2.5vw, 16px)', background: 'rgba(255,255,255,0.08)',
              border: focusedField ? '1.5px solid rgba(34,211,238,0.5)' : '1.5px solid rgba(255,255,255,0.12)',
              boxShadow: focusedField ? '0 0 0 4px rgba(34,211,238,0.1)' : 'none',
              transition: 'all 0.2s ease',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'clamp(8px, 2vw, 12px)',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <StepIcon size={20} weight="fill" color="white" />
              </div>
              <input
                value={formData[stepConfig.key]}
                onChange={(e) => updateField(stepConfig.key === 'username' ? e.target.value.toLowerCase() : e.target.value)}
                onFocus={() => setFocusedField(true)}
                onBlur={() => setFocusedField(false)}
                placeholder={placeholder}
                aria-describedby={stepConfig.key === 'username' ? 'username-status' : undefined}
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontSize: 'clamp(14px, 3.8vw, 17px)', color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600,
                  padding: 'clamp(8px, 1.8vh, 14px) 0',
                }}
              />
              {stepConfig.key === 'username' && <UsernameStatusIcon status={usernameStatus} />}
            </div>
          )}
          {stepConfig.key === 'username' && <UsernameStatusMessage status={usernameStatus} t={t} />}
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={handleNext}
          type="button"
          disabled={saving || (stepConfig.key === 'username' && (usernameStatus === 'taken' || usernameStatus === 'checking'))}
          style={{
            width: '100%', padding: 'clamp(12px, 2.5vh, 20px)', borderRadius: 'clamp(10px, 2.5vw, 16px)', border: 'none',
            background: (saving || (stepConfig.key === 'username' && (usernameStatus === 'taken' || usernameStatus === 'checking')))
              ? 'rgba(245,158,11,0.5)'
              : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
            cursor: (saving || (stepConfig.key === 'username' && (usernameStatus === 'taken' || usernameStatus === 'checking'))) ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 30px rgba(245,158,11,0.4)',
            position: 'relative', overflow: 'hidden',
            textTransform: 'uppercase', letterSpacing: '1px',
          }}
        >
          {!saving && (
            <div style={{
              position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              animation: 'shimmer 2s infinite', pointerEvents: 'none',
            }} />
          )}
          <span style={{ position: 'relative', zIndex: 1 }}>
            {saving ? t('profile.loading') : currentStep === STEP_CONFIGS.length - 1 ? t('profile.finish') : t('btn.continue')}
          </span>
        </button>
      </div>
    </div>
  );
}

function UsernameStatusIcon({ status }) {
  if (status === 'idle') return null;
  const wrap = { paddingRight: 12, display: 'flex', alignItems: 'center', flexShrink: 0 };
  if (status === 'checking') return (
    <div style={wrap}>
      <CircleNotch size={18} weight="bold" color="rgba(255,255,255,0.7)" style={{ animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (status === 'available') return <div style={wrap}><CheckCircle size={20} weight="fill" color="#10B981" /></div>;
  if (status === 'taken' || status === 'invalid') return <div style={wrap}><XCircle size={20} weight="fill" color="#EF4444" /></div>;
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
    <p id="username-status" role="status" style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 600, color, fontFamily: 'Nunito, sans-serif', marginTop: 'clamp(6px, 1.2vh, 10px)', textAlign: 'center' }}>
      {text}
    </p>
  );
}
