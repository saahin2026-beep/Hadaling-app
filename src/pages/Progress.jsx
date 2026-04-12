import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Fire, Trophy, CheckCircle } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import practiceFeatures from '../data/practiceFeatures';
import Geel from '../components/Geel';
import IconContainer from '../components/IconContainer';

const FEATURE_KEYS = Object.keys(practiceFeatures);

export default function Progress() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const state = storage.get();
  const { xp = 0, streak = 0, longestStreak = 0, lessonsCompleted = [] } = state;
  const completedFeatures = state.practiceCompleted || {};

  const lessonPct = Math.round((lessonsCompleted.length / 10) * 100);

  return (
    <div className="page-scroll" style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      position: 'relative',
    }}>
      {/* Ambient light blobs */}
      <div style={{
        position: 'absolute',
        top: '8%',
        right: '-40px',
        width: '160px',
        height: '160px',
        background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '-50px',
        width: '120px',
        height: '120px',
        background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{
        padding: 'clamp(8px, 1.8vh, 14px) clamp(12px, 2.5vh, 20px)',
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(6px, 1.2vh, 10px)',
        minHeight: 48,
        position: 'relative',
        zIndex: 2,
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'rgba(255,255,255,0.15)',
          border: 'none',
          cursor: 'pointer',
          padding: 'clamp(6px, 1.2vh, 10px)',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 'clamp(8px, 2vw, 12px)',
        }}>
          <ArrowLeft size={20} weight="bold" color="white" />
        </button>
        <span style={{ fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
          {t('progress.title')}
        </span>
      </div>

      <div style={{ padding: 'clamp(8px, 1.8vh, 14px) clamp(12px, 2.5vh, 20px) max(84px, calc(72px + env(safe-area-inset-bottom)))', position: 'relative', zIndex: 2 }}>
        {/* Geel */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'clamp(16px, 2.5vh, 20px)',
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
        }}>
          <Geel size={100} expression={lessonPct > 50 ? 'celebrating' : 'happy'} />
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(6px, 1.2vh, 10px)', marginBottom: 'clamp(16px, 3vh, 28px)' }}>
          <StatCard icon={Star} glow="gold" label={t('progress.total_xp')} value={xp} />
          <StatCard icon={Fire} glow="orange" label={t('progress.current_streak')} value={`${streak} ${t('progress.days')}`} />
          <StatCard icon={Trophy} glow="purple" label={t('progress.longest_streak')} value={`${longestStreak} ${t('progress.days')}`} />
          <StatCard icon={CheckCircle} glow="green" label={t('progress.lessons_done')} value={`${lessonsCompleted.length}/10`} />
        </div>

        {/* Growth Area */}
        <p style={{
          fontSize: 'clamp(13px, 3.2vw, 15px)',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.7)',
          fontFamily: 'Nunito, sans-serif',
          marginBottom: 'clamp(8px, 1.8vh, 14px)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          {lang === 'en' ? 'Growth Area' : 'Horumarkaaga'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'clamp(6px, 1.2vh, 10px)', marginBottom: 'clamp(16px, 3vh, 28px)' }}>
          <ProgressRing
            percentage={lessonPct}
            label={lang === 'en' ? 'Lessons' : 'Casharro'}
            color="#22D3EE"
          />
          {FEATURE_KEYS.map((key) => {
            const feature = practiceFeatures[key];
            const done = completedFeatures[key];
            const progress = state[`practice_${key}_progress`] || 0;
            const pct = done ? 100 : Math.round((progress / feature.exercises.length) * 100);
            return (
              <ProgressRing
                key={key}
                percentage={pct}
                label={lang === 'en' ? feature.titleEn : feature.title}
                color={feature.color}
              />
            );
          })}
        </div>
      </div>

    </div>
  );
}

function StatCard({ icon: Icon, glow, label, value }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.12)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: 'clamp(10px, 2.5vw, 16px)',
      padding: 'clamp(12px, 2.5vh, 20px) clamp(8px, 1.8vh, 14px)',
      border: '1px solid rgba(255,255,255,0.15)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'clamp(6px, 1.2vh, 10px)'
    }}>
      <IconContainer icon={Icon} glow={glow} size="lg" />
      <span style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{value}</span>
      <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: 600, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', textAlign: 'center' }}>{label}</span>
    </div>
  );
}

function ProgressRing({ percentage, label, color }) {
  const radius = 34;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: 'clamp(10px, 2.5vw, 16px)',
      padding: 'clamp(8px, 1.8vh, 14px) clamp(6px, 1.2vh, 10px) clamp(8px, 1.8vh, 14px)',
      border: '1px solid rgba(255,255,255,0.12)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'clamp(6px, 1.2vh, 10px)',
    }}>
      <div style={{ position: 'relative', width: 76, height: 76 }}>
        <svg width="76" height="76" viewBox="0 0 76 76">
          <circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={stroke}
          />
          <circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 38 38)"
            style={{
              transition: 'stroke-dashoffset 0.8s ease',
              filter: `drop-shadow(0 0 6px ${color}60)`
            }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
            {percentage}%
          </span>
        </div>
      </div>
      <span style={{
        fontSize: 'clamp(9px, 2.2vw, 11px)',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.6)',
        fontFamily: 'Nunito, sans-serif',
        textAlign: 'center',
        lineHeight: 1.2,
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </div>
  );
}
