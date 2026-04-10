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

  useEffect(() => {
    setTimeout(() => setShowContent(true), 200);
  }, []);

  if (!data) { navigate('/home'); return null; }

  return (
    <div style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      minHeight: '100dvh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 30px rgba(245,158,11,0.4); }
          50% { transform: scale(1.05); box-shadow: 0 12px 40px rgba(245,158,11,0.6); }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>

      {/* Ambient lights */}
      <div style={{
        position: 'absolute', top: '-30px', right: '-60px', width: '200px', height: '200px',
        background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', left: '-50px', width: '160px', height: '160px',
        background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '40%', right: '-40px', width: '120px', height: '120px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
        position: 'relative', zIndex: 2,
      }}>
        <button
          onClick={() => navigate('/home')}
          style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 12,
            padding: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} weight="bold" color="white" />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
          {t('lesson.lesson')} {data.id}
        </span>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '16px 24px 32px', position: 'relative', zIndex: 1,
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease-out',
      }}>
        {/* Geel with floating animation */}
        <div style={{
          animation: 'float 3s ease-in-out infinite',
          filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.25))',
        }}>
          <Geel size={120} expression="excited" />
        </div>

        {/* Lesson number badge */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
          border: '3px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 16, boxShadow: '0 8px 30px rgba(8,145,178,0.5)',
        }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
            {data.id}
          </span>
        </div>

        {/* Lesson title */}
        <h1 style={{
          fontSize: 26, fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif',
          textAlign: 'center', marginTop: 14, textShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}>
          {data.titleSo}
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', marginTop: 4 }}>
          ({data.titleEn})
        </p>

        {/* Ability card */}
        <div style={{
          width: '100%', marginTop: 20,
          background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 16, padding: '16px 18px', border: '1px solid rgba(255,255,255,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Target size={16} weight="fill" color="#F59E0B" />
            </div>
            <span style={{
              fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif',
              textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              {t('lesson.ability_intro')}
            </span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#22D3EE', fontFamily: 'Nunito, sans-serif', lineHeight: 1.5 }}>
            {data.ability}
          </p>
        </div>

        {/* Chunks section */}
        <div style={{ width: '100%', marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Lightning size={18} weight="fill" color="#F59E0B" />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
              {t('lesson.chunks_title')}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.chunks.map((chunk, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                  borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  opacity: showContent ? 1 : 0,
                  transform: showContent ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `all 0.4s ease-out ${0.1 + i * 0.1}s`,
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22D3EE, #0891B2)',
                  marginTop: 6, flexShrink: 0, boxShadow: '0 0 8px rgba(34,211,238,0.5)',
                }} />
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif', marginBottom: 2 }}>
                    {chunk.en}
                  </p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif' }}>
                    {chunk.so}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 20 }} />

        {/* CTA Button */}
        <button
          onClick={() => navigate(`/lesson/${id}/play`)}
          style={{
            width: '100%', padding: '18px 24px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            border: 'none', borderRadius: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 8px 30px rgba(245,158,11,0.4)',
            position: 'relative', overflow: 'hidden',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
            animation: 'shimmer 2s infinite', pointerEvents: 'none',
          }} />
          <Play size={22} weight="fill" color="white" />
          <span style={{
            fontSize: 17, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
            position: 'relative', zIndex: 1,
          }}>
            {t('lesson.start')}
          </span>
        </button>
      </div>
    </div>
  );
}
