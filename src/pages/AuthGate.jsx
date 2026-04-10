import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';

export default function AuthGate() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient lights */}
      <div style={{ position: 'absolute', top: '-40px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '-50px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Top section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.25))' }}>
          <Geel size={120} expression="celebrating" />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 16, textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          Hadaling
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif', marginTop: 6 }}>
          {t('auth.continue_learning')}
        </p>
      </div>

      {/* Bottom CTA section */}
      <div style={{
        padding: '36px 24px 48px',
        display: 'flex', flexDirection: 'column', gap: 12,
        position: 'relative', zIndex: 1,
      }}>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 8 }}>
          {t('auth.completed_lessons')} {t('auth.create_account_desc')}
        </p>
        <button
          onClick={() => navigate('/signup')}
          style={{
            width: '100%', padding: '16px 0', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            fontSize: 16, fontWeight: 800, color: 'white',
            fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(245,158,11,0.4)',
            textTransform: 'uppercase', letterSpacing: 1,
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shimmer 2s infinite', pointerEvents: 'none',
          }} />
          <span style={{ position: 'relative', zIndex: 1 }}>{t('auth.signup')}</span>
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            width: '100%', padding: '16px 0', borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            fontSize: 16, fontWeight: 800, color: 'white',
            fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}
        >
          {t('auth.login')}
        </button>
      </div>
    </div>
  );
}
