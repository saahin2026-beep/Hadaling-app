import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Phone, Calendar, MapPin, At } from '@phosphor-icons/react';
import { supabase } from '../utils/supabase';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import somaliCities from '../data/somaliCities';
import Geel from '../components/Geel';

const STEP_CONFIGS = [
  { key: 'username', icon: At, labelKey: 'profile.username_label', placeholderKey: 'profile.username_placeholder', questionKey: 'profile.username_question' },
  { key: 'phone', icon: Phone, labelKey: 'profile.phone_label', placeholderKey: 'profile.phone_placeholder', questionKey: 'profile.phone_question' },
  { key: 'birthday', icon: Calendar, labelKey: 'profile.birthday_label', placeholderKey: '', questionKey: 'profile.birthday_question' },
  { key: 'city', icon: MapPin, labelKey: 'profile.city_label', placeholderKey: '', questionKey: 'profile.city_question' },
];

export default function ProfileSetup() {
  const { step } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const currentStep = parseInt(step, 10);
  const [formData, setFormData] = useState({ username: '', phone: '', birthday: '', city: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState(false);

  const stepConfig = STEP_CONFIGS[currentStep];
  if (!stepConfig) { navigate('/home'); return null; }

  const updateField = (value) => {
    setFormData((f) => ({ ...f, [stepConfig.key]: value }));
    setError('');
  };

  const validate = () => {
    const val = formData[stepConfig.key];
    if (stepConfig.key === 'username') {
      if (!val.trim() || val.trim().length < 3) return t('profile.error_username_length');
      if (!/^[a-zA-Z0-9_]+$/.test(val.trim())) return t('profile.error_username_chars');
    }
    if (stepConfig.key === 'phone' && !val.trim()) return t('profile.error_phone');
    if (stepConfig.key === 'birthday' && !val) return t('profile.error_birthday');
    if (stepConfig.key === 'city' && !val) return t('profile.error_city');
    return null;
  };

  const handleNext = async () => {
    const err = validate();
    if (err) { setError(err); return; }

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
          else setError(updateError.message);
          setSaving(false); return;
        }

        storage.update({
          profileComplete: true,
          username: formData.username.trim().toLowerCase(),
          userPhone: formData.phone.trim(),
          userBirthday: formData.birthday,
          userCity: formData.city,
        });
        navigate('/home');
      } catch (e) {
        setError(t('profile.error_generic')); console.error(e);
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
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '20px 24px 0', position: 'relative', zIndex: 2 }}>
        {Array.from({ length: STEP_CONFIGS.length }, (_, i) => (
          <div key={i} style={{
            width: i === currentStep ? 24 : 8, height: 8, borderRadius: 4,
            background: i === currentStep ? 'linear-gradient(90deg, #22D3EE, #F59E0B)' : i < currentStep ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
            boxShadow: i === currentStep ? '0 0 12px rgba(34,211,238,0.5)' : 'none',
          }} />
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px 40px', position: 'relative', zIndex: 2 }}>
        {/* Geel */}
        <div style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.2))' }}>
          <Geel size={100} expression={currentStep === STEP_CONFIGS.length - 1 ? 'celebrating' : 'happy'} />
        </div>
        <div style={{ height: 20 }} />

        {/* Icon badge */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(8,145,178,0.2)', border: '1px solid rgba(34,211,238,0.3)',
          boxShadow: '0 4px 20px rgba(34,211,238,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <StepIcon size={26} weight="fill" color="white" />
        </div>

        {/* Question */}
        <h2 style={{ fontSize: 24, fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 8, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
          {t(stepConfig.questionKey)}
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', marginBottom: 24 }}>
          {t(stepConfig.labelKey)}
        </p>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: 16, width: '100%' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#FCA5A5', fontFamily: 'Nunito, sans-serif' }}>{error}</p>
          </div>
        )}

        {/* Input field */}
        <div style={{ width: '100%', marginBottom: 24 }}>
          {stepConfig.key === 'city' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
              {somaliCities.map((city) => (
                <button
                  key={city}
                  onClick={() => updateField(city)}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: 14, textAlign: 'left',
                    border: formData.city === city ? '1.5px solid rgba(34,211,238,0.5)' : '1.5px solid rgba(255,255,255,0.12)',
                    background: formData.city === city ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.08)',
                    color: 'white',
                    fontSize: 15, fontWeight: formData.city === city ? 700 : 600,
                    fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: formData.city === city ? '0 0 20px rgba(34,211,238,0.15)' : 'none',
                  }}
                >
                  {formData.city === city && <MapPin size={16} weight="fill" color="#22D3EE" style={{ marginRight: 8, verticalAlign: 'middle' }} />}
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
                width: '100%', padding: '16px', borderRadius: 14,
                border: '1.5px solid rgba(255,255,255,0.12)',
                fontSize: 16, fontFamily: 'Nunito, sans-serif', color: 'white',
                outline: 'none', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.08)',
              }}
            />
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '4px',
              borderRadius: 14, background: 'rgba(255,255,255,0.08)',
              border: focusedField ? '1.5px solid rgba(34,211,238,0.5)' : '1.5px solid rgba(255,255,255,0.12)',
              boxShadow: focusedField ? '0 0 0 4px rgba(34,211,238,0.1)' : 'none',
              transition: 'all 0.2s ease',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <StepIcon size={20} weight="fill" color="white" />
              </div>
              <input
                value={formData[stepConfig.key]}
                onChange={(e) => updateField(e.target.value)}
                onFocus={() => setFocusedField(true)}
                onBlur={() => setFocusedField(false)}
                placeholder={t(stepConfig.placeholderKey)}
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontSize: 16, color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 600,
                  padding: '12px 0',
                }}
              />
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={handleNext}
          disabled={saving}
          style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 'none',
            background: saving ? 'rgba(245,158,11,0.5)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            fontSize: 16, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
            cursor: saving ? 'not-allowed' : 'pointer',
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
