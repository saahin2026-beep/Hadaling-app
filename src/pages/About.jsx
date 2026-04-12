import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart } from '@phosphor-icons/react';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';

export default function About() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="page-scroll" style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient lights */}
      <div style={{ position: 'absolute', top: '-30px', right: '-50px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '-40px', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 2 }}>
        <button onClick={() => navigate('/astaanta')} style={{
          background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 12,
          padding: 10, cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}>
          <ArrowLeft size={20} weight="bold" color="white" />
        </button>
        <span style={{ fontSize: 17, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
          {t('about.title')}
        </span>
      </div>

      <div style={{ padding: '24px 16px', position: 'relative', zIndex: 2 }}>
        {/* App icon + name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 22, overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.25), 0 0 0 2px rgba(255,255,255,0.2)',
          }}>
            <img src="/branding/app-icon-1024.png" alt="Hadaling" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', marginTop: 12 }}>
            Hadaling
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>
            Version 1.0.0
          </p>
        </div>

        {/* Description */}
        <div style={{
          background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 16, padding: '16px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: 16,
        }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif', lineHeight: 1.7 }}>
            {t('about.description')}
          </p>
        </div>

        {/* Info rows */}
        <div style={{
          background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)',
        }}>
          <InfoRow label={t('about.language_label')} value={t('about.language_value')} />
          <InfoRow label={t('about.lessons_label')} value="10" />
          <InfoRow label={t('about.type_label')} value={t('about.type_value')} />
          <InfoRow label={t('about.method_label')} value={t('about.method_value')} last />
        </div>

        {/* Footer */}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 32 }}>
          Hadaling v1.0.0
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 4 }}>
          {t('astaanta.footer')} <Heart size={12} weight="fill" color="#E53935" style={{ display: 'inline', verticalAlign: 'middle' }} />
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value, last }) {
  return (
    <div style={{
      padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.08)',
    }}>
      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{value}</span>
    </div>
  );
}
