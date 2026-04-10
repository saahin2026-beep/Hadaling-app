import { CheckCircle, XCircle } from '@phosphor-icons/react';
import { useLanguage } from '../utils/useLanguage';
import PhraseIcon from '../utils/PhraseIcon';

export default function FeedbackBanner({ type, phrase, onContinue, visible, dark = false, premium = false, autoAdvance = false }) {
  const { t } = useLanguage();
  if (!visible || !phrase) return null;
  const isCorrect = type === 'correct';

  const bannerBg = premium
    ? (isCorrect
      ? 'linear-gradient(180deg, rgba(16,185,129,0.95) 0%, rgba(5,150,105,0.98) 100%)'
      : 'linear-gradient(180deg, rgba(239,68,68,0.95) 0%, rgba(220,38,38,0.98) 100%)')
    : dark
      ? '#1E293B'
      : (isCorrect ? 'linear-gradient(180deg, #D1FAE5 0%, #A7F3D0 100%)' : 'linear-gradient(180deg, #FFEBEE 0%, #FFCDD2 100%)');

  const borderTop = premium
    ? (isCorrect ? '3px solid rgba(255,255,255,0.3)' : '3px solid rgba(255,255,255,0.2)')
    : dark
      ? (isCorrect ? '3px solid #10B981' : '3px solid #EF4444')
      : (isCorrect ? '4px solid #10B981' : '4px solid #EF5350');

  const bannerShadow = premium
    ? '0 -12px 40px rgba(0,0,0,0.3)'
    : dark
      ? (isCorrect ? '0 -8px 32px rgba(16, 185, 129, 0.1)' : '0 -8px 32px rgba(239, 68, 68, 0.08)')
      : (isCorrect ? '0 -8px 32px rgba(16,185,129,0.15)' : '0 -8px 32px rgba(244,67,54,0.12)');

  const titleColor = (premium || dark)
    ? (isCorrect ? '#6EE7B7' : '#FCA5A5')
    : (isCorrect ? '#059669' : '#C62828');

  const phraseColor = premium
    ? 'rgba(255,255,255,0.85)'
    : dark
      ? '#94A3B8'
      : (isCorrect ? '#047857' : '#D32F2F');

  const iconColor = (premium || dark) ? (isCorrect ? '#10B981' : '#EF4444') : (isCorrect ? '#10B981' : '#F44336');

  const btnBg = premium
    ? (isCorrect
      ? 'linear-gradient(135deg, #F59E0B, #D97706)'
      : 'rgba(255,255,255,0.2)')
    : dark
      ? (isCorrect ? 'linear-gradient(180deg, #6EE7B7, #10B981)' : 'linear-gradient(180deg, #FCA5A5, #EF4444)')
      : (isCorrect ? 'linear-gradient(180deg, #34D399 0%, #10B981 40%, #059669 100%)' : 'linear-gradient(180deg, #EF5350 0%, #F44336 50%, #E53935 100%)');

  const btnBorder = premium
    ? 'none'
    : dark
      ? (isCorrect ? '3px solid #047857' : '3px solid #B91C1C')
      : (isCorrect ? '3px solid #059669' : '3px solid #C62828');

  const btnShadow = premium
    ? (isCorrect ? '0 8px 24px rgba(245,158,11,0.4)' : 'none')
    : (isCorrect ? '0 3px 10px rgba(46,125,50,0.25)' : '0 3px 10px rgba(198,40,40,0.25)');

  return (
    <div className="animate-slide-up-banner" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', justifyContent: 'center',
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
    }}>
      <div style={{
        width: '100%', maxWidth: 520,
        background: bannerBg,
        backdropFilter: premium ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: premium ? 'blur(20px)' : 'none',
        borderTop,
        borderRadius: '28px 28px 0 0',
        padding: 'clamp(18px, 4.5vw, 28px) clamp(16px, 4vw, 24px) clamp(20px, 5vw, 32px)',
        boxShadow: bannerShadow,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          {isCorrect
            ? <CheckCircle size={32} weight="fill" color={premium ? 'white' : iconColor} />
            : <XCircle size={32} weight="fill" color={premium ? 'white' : iconColor} />}
          <span style={{
            fontSize: 'clamp(16px, 4vw, 22px)', fontWeight: 800, fontFamily: 'Nunito, sans-serif',
            color: premium ? 'white' : titleColor,
          }}>
            {isCorrect ? t('btn.correct') : t('btn.wrong')}
          </span>
        </div>
        <p style={{
          fontSize: 14, fontFamily: 'Nunito, sans-serif', marginBottom: 14, marginLeft: 42,
          color: phraseColor,
        }}>
          <PhraseIcon name={phrase.emoji} size={16} color={phraseColor} /> {phrase.text}
        </p>
        {autoAdvance ? (
          <div style={{
            width: '100%', height: 6, borderRadius: 3,
            background: premium ? 'rgba(255,255,255,0.2)' : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(16,185,129,0.15)'),
            overflow: 'hidden', marginTop: 8,
          }}>
            <div style={{
              height: '100%', borderRadius: 3,
              background: premium ? 'white' : '#10B981',
              animation: 'advanceBar 1.5s linear forwards',
            }} />
          </div>
        ) : (
          <button onClick={onContinue} style={{
            width: '100%', padding: '16px 24px', borderRadius: premium ? 14 : 16,
            border: premium ? 'none' : 'none',
            background: btnBg,
            borderBottom: btnBorder,
            boxShadow: btnShadow,
            fontSize: 15, fontWeight: 800, color: 'white',
            fontFamily: 'Nunito, sans-serif', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1,
            position: premium ? 'relative' : 'static',
            overflow: premium ? 'hidden' : 'visible',
          }}>
            {premium && isCorrect && (
              <div style={{
                position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'shimmer 2s infinite', pointerEvents: 'none',
              }} />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>
              {isCorrect ? t('btn.continue') : t('btn.retry')}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
