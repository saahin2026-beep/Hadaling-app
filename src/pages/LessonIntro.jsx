import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../utils/DataContext';
import { useLanguage } from '../utils/useLanguage';
import { ArrowLeft, Play, Lightning, Target } from '@phosphor-icons/react';
import Geel from '../components/Geel';

export default function LessonIntro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { lessonData } = useData();
  const data = lessonData?.[id];
  const [showContent, setShowContent] = useState(false);

  useEffect(() => { setTimeout(() => setShowContent(true), 200); }, []);
  if (!data) { navigate('/home'); return null; }

  return (
    <div className="page-fixed" style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
    }}>
      <style>{`
        @keyframes pulse { 0%, 100% { transform: scale(1); box-shadow: 0 6px 24px rgba(245,158,11,0.4); } 50% { transform: scale(1.03); box-shadow: 0 8px 30px rgba(245,158,11,0.5); } }
        @keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }
      `}</style>

      <div style={{ position: 'absolute', top: '-30px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '-50px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ padding: 'clamp(8px, 2vh, 14px) clamp(12px, 2.5vh, 20px)', display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.2vh, 10px)', position: 'relative', zIndex: 2, flexShrink: 0 }}>
        <button onClick={() => navigate('/home')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 'clamp(8px, 2vw, 12px)', padding: 'clamp(6px, 1.2vh, 10px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} weight="bold" color="white" />
        </button>
        <span style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
          {t('lesson.lesson')} {data.id}
        </span>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '0 clamp(12px, 2.5vh, 20px)', position: 'relative', zIndex: 1,
        opacity: showContent ? 1 : 0, transition: 'opacity 0.5s ease-out',
        gap: 'clamp(6px, 1.5vh, 14px)',
      }}>
        {/* Geel */}
        <Geel size={Math.round(Math.min(90, window.innerHeight * 0.13))} expression="excited" />

        {/* Badge + Title */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{
            width: 'clamp(36px, 8vh, 48px)', height: 'clamp(36px, 8vh, 48px)', borderRadius: '50%',
            background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
            border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto', boxShadow: '0 6px 20px rgba(8,145,178,0.4)',
          }}>
            <span style={{ fontSize: 'clamp(16px, 3.5vw, 20px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{data.id}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', marginTop: 'clamp(4px, 1vh, 10px)' }}>
            {data.titleSo}
          </h1>
          <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>({data.titleEn})</p>
        </div>

        {/* Ability */}
        <div style={{
          width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 'clamp(10px, 2vw, 14px)',
          padding: 'clamp(10px, 2vh, 14px) clamp(12px, 3vw, 16px)', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.2vh, 10px)', marginBottom: 'clamp(3px, 0.8vh, 6px)' }}>
            <Target size={14} weight="fill" color="#F59E0B" />
            <span style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: 600, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('lesson.ability_intro')}
            </span>
          </div>
          <p style={{ fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: 700, color: '#22D3EE', fontFamily: 'Nunito, sans-serif', lineHeight: 1.4 }}>{data.ability}</p>
        </div>

        {/* Chunks */}
        <div style={{ width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(3px, 0.8vh, 6px)', marginBottom: 'clamp(4px, 1vh, 8px)', flexShrink: 0 }}>
            <Lightning size={14} weight="fill" color="#F59E0B" />
            <span style={{ fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{t('lesson.chunks_title')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 0.8vh, 6px)', flex: 1, minHeight: 0 }}>
            {data.chunks.map((chunk, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: 'clamp(8px, 2vw, 12px)',
                padding: 'clamp(8px, 1.5vh, 12px) clamp(10px, 2.5vw, 14px)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.2vh, 10px)',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22D3EE', flexShrink: 0, boxShadow: '0 0 6px rgba(34,211,238,0.5)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{chunk.en}</p>
                  <p style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif' }}>{chunk.so}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button onClick={() => navigate(`/lesson/${id}/play`)} style={{
          width: '100%', padding: 'clamp(12px, 2.5vh, 16px)',
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          border: 'none', borderRadius: 'clamp(8px, 2vw, 12px)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(6px, 1.2vh, 10px)',
          boxShadow: '0 6px 24px rgba(245,158,11,0.4)', position: 'relative', overflow: 'hidden',
          animation: 'pulse 2s ease-in-out infinite', flexShrink: 0,
          marginBottom: 'max(8px, env(safe-area-inset-bottom))',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)', animation: 'shimmer 2s infinite', pointerEvents: 'none' }} />
          <Play size={18} weight="fill" color="white" />
          <span style={{ fontSize: 'clamp(14px, 3.5vw, 17px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', position: 'relative', zIndex: 1 }}>
            {t('lesson.start')}
          </span>
        </button>
      </div>
    </div>
  );
}
