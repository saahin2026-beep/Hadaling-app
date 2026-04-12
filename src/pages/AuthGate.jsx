import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';

export default function AuthGate() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="page-fixed" style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
    }}>
      <div style={{ position: 'absolute', top: '-40px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '-50px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(16px, 3vh, 28px)', position: 'relative', zIndex: 1 }}>
        <Geel size={Math.min(100, window.innerWidth * 0.22)} expression="celebrating" />
        <h1 style={{ fontSize: 'clamp(22px, 6vw, 28px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 'clamp(8px, 2vh, 16px)' }}>
          Hadaling
        </h1>
        <p style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif', marginTop: 'clamp(3px, 0.8vh, 6px)' }}>
          {t('auth.continue_learning')}
        </p>
      </div>

      <div style={{ padding: 'clamp(16px, 4vh, 36px) clamp(16px, 3vh, 28px) max(24px, env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.2vh, 10px)', position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <p style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginBottom: 'clamp(3px, 0.8vh, 6px)' }}>
          {t('auth.completed_lessons')} {t('auth.create_account_desc')}
        </p>
        <button onClick={() => navigate('/signup')} style={{
          width: '100%', padding: 'clamp(12px, 3vh, 16px) 0', borderRadius: 'clamp(10px, 2.5vw, 16px)', border: 'none',
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 800, color: 'white',
          fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(245,158,11,0.4)', textTransform: 'uppercase', letterSpacing: 1,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', animation: 'shimmer 2s infinite', pointerEvents: 'none' }} />
          <span style={{ position: 'relative', zIndex: 1 }}>{t('auth.signup')}</span>
        </button>
        <button onClick={() => navigate('/login')} style={{
          width: '100%', padding: 'clamp(12px, 3vh, 16px) 0', borderRadius: 'clamp(10px, 2.5vw, 16px)',
          border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.1)',
          fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 800, color: 'white',
          fontFamily: 'Nunito, sans-serif', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 0.5,
        }}>
          {t('auth.login')}
        </button>
      </div>
    </div>
  );
}
