import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, Fire, Trophy, CurrencyCircleDollar, ShareNetwork } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useData } from '../utils/DataContext';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';
import PrimaryButton from '../components/PrimaryButton';
import IconContainer from '../components/IconContainer';
import { recordLessonCompletion } from '../utils/streak';

function Particle({ delay, duration, startX, color }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '-20px',
      left: `${startX}%`,
      width: color === 'gold' ? '8px' : '6px',
      height: color === 'gold' ? '8px' : '6px',
      background: color === 'gold'
        ? 'linear-gradient(135deg, #F59E0B, #FBBF24)'
        : 'linear-gradient(135deg, #22D3EE, #06B6D4)',
      borderRadius: '50%',
      opacity: 0,
      animation: `floatUpCelebrate ${duration}s ease-out ${delay}s infinite`,
      boxShadow: color === 'gold'
        ? '0 0 10px rgba(245,158,11,0.5)'
        : '0 0 8px rgba(34,211,238,0.4)',
    }} />
  );
}

function ConfettiPiece({ delay, startX, color, rotation }) {
  return (
    <div style={{
      position: 'absolute',
      top: '-10px',
      left: `${startX}%`,
      width: '10px',
      height: '10px',
      background: color,
      opacity: 0,
      transform: `rotate(${rotation}deg)`,
      animation: `confettiFallCelebrate 3s ease-out ${delay}s infinite`,
    }} />
  );
}

export default function LessonComplete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang } = useLanguage();
  const dahabEarned = location.state?.dahabEarned || 5;
  const { lessonData, getRandomPhrase } = useData();
  const data = lessonData?.[id];
  const [celebration] = useState(() => getRandomPhrase?.('celebration') || { text: 'Mahadsanid!', emoji: 'star' });
  const state = storage.get();
  const [countdown, setCountdown] = useState(8);
  const [showStats, setShowStats] = useState(false);
  const nextLessonId = Number(id) + 1;
  const nextLesson = lessonData?.[nextLessonId];

  useEffect(() => {
    if (id) {
      storage.completeLesson(Number(id), dahabEarned);
      recordLessonCompletion();
    }
    setTimeout(() => setShowStats(true), 400);
  }, [id]);

  useEffect(() => {
    if (!nextLesson) return;
    if (countdown <= 0) {
      navigate(`/lesson/${nextLessonId}`);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, nextLesson]);

  if (!data) { navigate('/home'); return null; }

  const particles = Array.from({ length: 20 }, () => ({
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    startX: Math.random() * 100,
    color: Math.random() > 0.5 ? 'gold' : 'cyan',
  }));

  const confetti = Array.from({ length: 30 }, () => ({
    delay: Math.random() * 2,
    startX: Math.random() * 100,
    color: ['#F59E0B', '#22D3EE', '#10B981', '#EC4899', '#8B5CF6'][Math.floor(Math.random() * 5)],
    rotation: Math.random() * 360,
  }));

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      minHeight: '100dvh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <style>{`
        @keyframes floatUpCelebrate {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          20% { opacity: 1; transform: translateY(-100px) scale(1); }
          100% { opacity: 0; transform: translateY(-600px) scale(0.3); }
        }
        @keyframes confettiFallCelebrate {
          0% { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
        }
        @keyframes glowRing {
          0%, 100% { box-shadow: 0 0 30px rgba(245,158,11,0.4); }
          50% { box-shadow: 0 0 60px rgba(245,158,11,0.6); }
        }
      `}</style>

      {/* Floating particles */}
      {particles.map((p, i) => <Particle key={`p${i}`} {...p} />)}

      {/* Confetti */}
      {confetti.map((c, i) => <ConfettiPiece key={`c${i}`} {...c} />)}

      {/* Ambient glows */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
        animation: 'pulse 3s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', left: '-50px',
        width: '200px', height: '200px',
        background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '30%', right: '-50px',
        width: '180px', height: '180px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Main content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '40px 24px 32px', position: 'relative', zIndex: 1,
      }}>
        {/* Trophy ring with Geel */}
        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(251,191,36,0.1) 100%)',
          border: '3px solid #F59E0B',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'glowRing 2s ease-in-out infinite',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: '8px', borderRadius: '50%',
            border: '2px solid rgba(245,158,11,0.3)',
          }} />
          <Geel size={90} expression="celebrating" circular />
        </div>

        {/* Celebration text */}
        <h1 style={{
          fontSize: 28, fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif',
          marginTop: 20, textAlign: 'center', textShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}>
          {celebration.text} ⭐
        </h1>
        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif', marginTop: 4,
        }}>
          {lang === 'en' ? `Lesson ${id} Complete` : `Casharka ${id} waa la dhammeeyey`}
        </p>

        {/* Stats cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
          width: '100%', marginTop: 28,
          opacity: showStats ? 1 : 0,
          transform: showStats ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16, padding: '18px 12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
          }}>
            <IconContainer icon={Star} glow="gold" size="md" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: 24, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>+10</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif' }}>XP</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.15) 100%)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16, padding: '18px 12px', border: '1px solid rgba(245,158,11,0.3)',
            textAlign: 'center', boxShadow: '0 0 30px rgba(245,158,11,0.15)',
          }}>
            <IconContainer icon={CurrencyCircleDollar} glow="gold" size="md" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: 24, fontWeight: 800, color: '#F59E0B', fontFamily: 'Nunito, sans-serif' }}>+{dahabEarned}</p>
            <p style={{ fontSize: 11, color: 'rgba(245,158,11,0.7)', fontFamily: 'Nunito, sans-serif' }}>Dahab</p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16, padding: '18px 12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
          }}>
            <IconContainer icon={Fire} glow="orange" size="md" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: 24, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{state.streak || 1}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif' }}>{t('complete.streak') || 'Streak'}</p>
          </div>
        </div>

        {/* Share card */}
        <div style={{
          width: '100%', marginTop: 24,
          background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 16, padding: '16px 20px', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
          opacity: showStats ? 1 : 0,
          transform: showStats ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out 0.2s',
        }}>
          <IconContainer icon={ShareNetwork} glow="purple" size="md" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
              {lang === 'en' ? 'Share your progress' : 'La wadaag horumarkaaga'}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif' }}>
              {lang === 'en' ? 'Screenshot this moment!' : 'Sawir qaad!'}
            </p>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 20 }} />

        {/* Next lesson countdown */}
        {nextLesson && (
          <div style={{
            width: '100%', textAlign: 'center', marginBottom: 16,
            opacity: showStats ? 1 : 0, transition: 'opacity 0.6s ease-out 0.4s',
          }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif' }}>
              {lang === 'en' ? 'Next lesson in' : 'Casharka xiga'} {countdown}s
            </p>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif', marginTop: 4 }}>
              {nextLesson.titleSo}
            </p>
          </div>
        )}

        {/* CTA Buttons */}
        <div style={{
          width: '100%', display: 'flex', flexDirection: 'column', gap: 10,
          opacity: showStats ? 1 : 0,
          transform: showStats ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out 0.3s',
        }}>
          {nextLesson && (
            <button
              onClick={() => navigate(`/lesson/${nextLessonId}`)}
              style={{
                width: '100%', padding: '16px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                border: 'none', borderRadius: 14, color: 'white',
                fontSize: 16, fontWeight: 800, fontFamily: 'Nunito, sans-serif',
                cursor: 'pointer', boxShadow: '0 8px 30px rgba(245,158,11,0.4)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'shimmer 2s infinite',
              }} />
              {lang === 'en' ? 'CONTINUE →' : 'SII WAD →'}
            </button>
          )}

          <button
            onClick={() => navigate('/home')}
            style={{
              width: '100%', padding: '14px',
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14,
              color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: 600,
              fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            }}
          >
            {lang === 'en' ? 'Back to Home' : 'Ku noqo Bogga'}
          </button>
        </div>
      </div>
    </div>
  );
}
