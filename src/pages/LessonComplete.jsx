import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, Fire, CurrencyCircleDollar, ShareNetwork } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useData } from '../utils/DataContext';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';
import IconContainer from '../components/IconContainer';
import { recordLessonCompletion } from '../utils/streak';
import { trackEvent } from '../utils/observability';

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
      trackEvent('lesson_completed', { lessonId: Number(id), dahabEarned });
    }
    const timer = setTimeout(() => setShowStats(true), 400);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (!nextLesson) return;
    if (countdown <= 0) { navigate(`/lesson/${nextLessonId}`); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, nextLesson]);

  useEffect(() => { if (!data) navigate('/home'); }, [data, navigate]);
  if (!data) return null;

  return (
    <div className="page-fixed" style={{
      background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
    }}>
      <style>{`
        @keyframes glowRing { 0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.3); } 50% { box-shadow: 0 0 40px rgba(245,158,11,0.5); } }
        @keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }
      `}</style>

      {/* Ambient */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Content — flex column, everything stretches to fill */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(12px, 3vh, 24px) clamp(12px, 2.5vh, 20px) max(16px, env(safe-area-inset-bottom))',
        position: 'relative', zIndex: 1, gap: 'clamp(8px, 1.5vh, 16px)',
      }}>
        {/* Geel ring */}
        <div style={{
          width: 'clamp(90px, 20vh, 130px)', height: 'clamp(90px, 20vh, 130px)', borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(251,191,36,0.1) 100%)',
          border: '2px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'glowRing 2s ease-in-out infinite', position: 'relative', flexShrink: 0,
        }}>
          <Geel size={Math.round(Math.min(80, window.innerHeight * 0.12))} expression="celebrating" circular />
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <h1 style={{ fontSize: 'clamp(20px, 4.5vw, 28px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
            {celebration.text} ⭐
          </h1>
          <p style={{ fontSize: 'clamp(12px, 3vw, 15px)', color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>
            {lang === 'en' ? `Lesson ${id} Complete` : `Casharka ${id} waa la dhammeeyey`}
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(6px, 1.5vw, 12px)',
          width: '100%', opacity: showStats ? 1 : 0, transition: 'opacity 0.6s ease-out', flexShrink: 0,
        }}>
          <StatCard icon={Star} glow="gold" value="+10" label="XP" />
          <StatCard icon={CurrencyCircleDollar} glow="gold" value={`+${dahabEarned}`} label="Dahab" highlight />
          <StatCard icon={Fire} glow="orange" value={state.streak || 1} label={t('complete.streak') || 'Streak'} />
        </div>

        {/* Share */}
        <div style={{
          width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: 'clamp(10px, 2vw, 14px)',
          padding: 'clamp(10px, 2vh, 16px) clamp(12px, 3vw, 20px)', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.2vh, 10px)', cursor: 'pointer', flexShrink: 0,
          opacity: showStats ? 1 : 0, transition: 'opacity 0.6s ease-out 0.2s',
        }}>
          <IconContainer icon={ShareNetwork} glow="purple" size="sm" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
              {lang === 'en' ? 'Share your progress' : 'La wadaag horumarkaaga'}
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Countdown */}
        {nextLesson && (
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <p style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif' }}>
              {lang === 'en' ? 'Next lesson in' : 'Casharka xiga'} {countdown}s
            </p>
          </div>
        )}

        {/* Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.2vh, 10px)', flexShrink: 0 }}>
          {nextLesson && (
            <button onClick={() => navigate(`/lesson/${nextLessonId}`)} style={{
              width: '100%', padding: 'clamp(12px, 2.5vh, 16px)',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              border: 'none', borderRadius: 'clamp(8px, 2vw, 12px)', color: 'white',
              fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 800, fontFamily: 'Nunito, sans-serif',
              cursor: 'pointer', boxShadow: '0 6px 24px rgba(245,158,11,0.4)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', animation: 'shimmer 2s infinite' }} />
              {lang === 'en' ? 'CONTINUE →' : 'SII WAD →'}
            </button>
          )}
          <button onClick={() => navigate('/home')} style={{
            width: '100%', padding: 'clamp(10px, 2vh, 14px)',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'clamp(8px, 2vw, 12px)',
            color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: 600, fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
          }}>
            {lang === 'en' ? 'Back to Home' : 'Ku noqo Bogga'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, glow, value, label, highlight }) {
  return (
    <div style={{
      background: highlight ? 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.15) 100%)' : 'rgba(255,255,255,0.08)',
      borderRadius: 'clamp(10px, 2vw, 14px)', padding: 'clamp(10px, 2vh, 16px) clamp(6px, 1.2vh, 10px)',
      border: highlight ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
    }}>
      <IconContainer icon={icon} glow={glow} size="sm" style={{ margin: '0 auto clamp(4px, 1vh, 8px)' }} />
      <p style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, color: highlight ? '#F59E0B' : 'white', fontFamily: 'Nunito, sans-serif' }}>{value}</p>
      <p style={{ fontSize: 'clamp(9px, 2vw, 11px)', color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif' }}>{label}</p>
    </div>
  );
}
