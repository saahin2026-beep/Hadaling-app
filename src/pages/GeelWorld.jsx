import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fire, Star, Heart, Play, Target, Check, Lock, Lightning, Gift, ArrowRight, ChatCircleDots, Barbell, Sparkle, CurrencyCircleDollar, HandWaving, Lightbulb } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useData } from '../utils/DataContext';
import { useLanguage } from '../utils/useLanguage';
import BottomNav from '../components/BottomNav';
import IconContainer from '../components/IconContainer';
import { getDailyWordSync, fetchDailyWords, getWordAudioPath } from '../data/wordOfTheDay';
import { getDailyFact, getCategoryColor } from '../data/dailyFacts';
import { playAudio } from '../utils/audio';
import { getStreakData, purchaseStreakFreeze, getNextMilestone, getStreakTier, MILESTONES } from '../utils/streak';
import { Snowflake, Flame } from '@phosphor-icons/react';

function press3D(borderColor = '#155E75', depth = 6) {
  return {
    onPointerDown: (e) => {
      e.currentTarget.style.transform = `translateY(${depth}px)`;
      e.currentTarget.style.borderBottom = `0px solid ${borderColor}`;
    },
    onPointerUp: (e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderBottom = `${depth}px solid ${borderColor}`;
    },
    onPointerLeave: (e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderBottom = `${depth}px solid ${borderColor}`;
    },
  };
}

export default function GeelWorld() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const state = storage.get();
  const { lessonData } = useData();
  const { lessonsCompleted = [], currentLesson = 1, xp = 0, streak = 0, dahab = 0 } = state;

  const currentLessonData = lessonData?.[currentLesson];
  const progressPercent = Math.round((lessonsCompleted.length / 10) * 100);

  const [dailyWord, setDailyWord] = useState(getDailyWordSync());
  const [isPlayingWord, setIsPlayingWord] = useState(false);
  const [yaabRevealed, setYaabRevealed] = useState(() => storage.get().yaabViewedDate === new Date().toDateString());
  const dailyFact = getDailyFact();

  useEffect(() => {
    fetchDailyWords().then(() => setDailyWord(getDailyWordSync()));
  }, []);

  const handlePlayWord = async () => {
    if (isPlayingWord) return;
    setIsPlayingWord(true);
    try { await playAudio(getWordAudioPath(dailyWord.en)); } catch (_) { /* audio not available */ }
    setIsPlayingWord(false);
  };

  const handleYaabTap = () => {
    if (!yaabRevealed) {
      setYaabRevealed(true);
      storage.update({ yaabViewedDate: new Date().toDateString() });
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'SUBAX WANAAGSAN' : hour < 17 ? 'GALAB WANAAGSAN' : 'FIID WANAAGSAN';

  return (
    <div className="page-scroll" style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      paddingBottom: 'max(84px, calc(72px + env(safe-area-inset-bottom)))',
      position: 'relative',
    }}>
      {/* Ambient light blobs */}
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '-60px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '-80px',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(8,145,178,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ═══ 1. HERO HEADER ═══ */}
      <div style={{
        padding: 'clamp(8px, 1.8vh, 14px) clamp(12px, 2.5vh, 20px) clamp(12px, 2.5vh, 20px)',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 2,
      }}>
        {/* Stats pills */}
        <div style={{ display: 'flex', gap: 'clamp(3px, 0.8vh, 6px)', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <StatPill icon={<Fire size={14} weight="fill" color="white" />} gradient="linear-gradient(135deg, #F97316, #FB923C)" value={streak} />
          <StatPill icon={<Star size={14} weight="fill" color="white" />} gradient="linear-gradient(135deg, #FFCA28, #FFD54F)" value={xp} />
          <StatPill icon={<CurrencyCircleDollar size={14} weight="fill" color="white" />} gradient="linear-gradient(135deg, #F59E0B, #FBBF24)" value={dahab} />
          <StatPill icon={<Heart size={14} weight="fill" color="white" />} gradient="linear-gradient(135deg, #EF4444, #F87171)" value={5} />
        </div>

        {/* Greeting */}
        <div style={{ textAlign: 'center', marginTop: 'clamp(6px, 1.2vh, 10px)', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif', letterSpacing: 2, textTransform: 'uppercase' }}>
            {greeting}
          </p>
          <p style={{ fontSize: 'clamp(18px, 4.5vw, 24px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', marginTop: 'clamp(3px, 0.8vh, 6px)', textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(3px, 0.8vh, 6px)' }}>Welcome back! <HandWaving size={20} weight="fill" color="white" /></span>
          </p>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div style={{ padding: '0 clamp(12px, 2.5vh, 20px)', position: 'relative', zIndex: 2 }}>

        {/* ═══ WEAK WORDS BADGE ═══ */}
        {(state.weakChunks || []).length > 0 && (
          <div onClick={() => navigate('/progress')} style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'clamp(8px, 2vw, 12px)',
            padding: 'clamp(8px, 1.8vh, 14px) clamp(12px, 2.5vh, 20px)',
            marginBottom: 'clamp(8px, 1.8vh, 14px)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(6px, 1.2vh, 10px)',
            cursor: 'pointer',
          }}>
            <span style={{ fontSize: 'clamp(16px, 4.2vw, 20px)' }}>⚠️</span>
            <div>
              <p style={{ color: '#FCA5A5', fontWeight: 700, fontSize: 'clamp(13px, 3.2vw, 15px)', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
                {(state.weakChunks || []).length} {lang === 'en' ? 'Weak words' : 'Erayo daciif ah'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(11px, 2.8vw, 13px)', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
                {lang === 'en' ? 'Tap to practice' : 'Taabo si aad u tababarto'}
              </p>
            </div>
          </div>
        )}

        {/* ═══ 2. WORD OF THE DAY ═══ */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 'clamp(10px, 2.5vw, 16px)',
          padding: 'clamp(8px, 1.8vh, 14px) clamp(12px, 2.5vh, 20px)',
          marginTop: 'clamp(-8px, -1.5vh, -6px)',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            <div>
              <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: 800, color: '#22D3EE', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                WORD OF THE DAY
              </p>
              <p style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', marginTop: 'clamp(3px, 0.8vh, 6px)' }}>{dailyWord.en}</p>
              <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif' }}>{dailyWord.so}</p>
            </div>
            <button
              onClick={handlePlayWord}
              style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0891B2, #22D3EE)',
                borderBottom: '6px solid #155E75',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: isPlayingWord ? 'scale(0.95)' : 'translateY(0)',
                transition: 'all 0.08s ease',
                animation: isPlayingWord ? 'pulse 0.8s ease-in-out infinite' : 'none',
              }}
              {...press3D('#155E75', 6)}
            >
              <Play size={24} weight="fill" color="white" />
            </button>
          </div>
        </div>

        {/* ═══ 3. QUICK STATS ROW ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(6px, 1.2vh, 10px)', marginTop: 'clamp(6px, 1.2vh, 10px)' }}>
          <MiniStatCard label="TODAY" value="0" sublabel="lessons" />
          <MiniStatCard label="GOAL" value="3" sublabel="weekly" />
          <MiniStatCard label="RANK" value="#42" sublabel="global" />
        </div>

        {/* ═══ 4. TODAY'S MISSION — WHITE HERO CARD ═══ */}
        <div style={{
          background: 'white',
          borderRadius: 'clamp(10px, 2.5vw, 16px)',
          padding: 'clamp(8px, 1.8vh, 14px) clamp(12px, 2.5vh, 20px)',
          marginTop: 'clamp(6px, 1.2vh, 10px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
          border: '2px solid rgba(255,255,255,0.9)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle gradient shimmer overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '150px',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(8,145,178,0.03) 50%, rgba(34,211,238,0.05) 100%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.8vh, 14px)', position: 'relative', zIndex: 1 }}>
            <IconContainer icon={Target} glow="cyan" size="md" variant="light" />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: 700, color: '#0891B2', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                MAANTA / TODAY
              </p>
              <p style={{ fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 1 }}>
                {currentLessonData?.titleSo || `Casharka ${currentLesson}`}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 'clamp(6px, 1.2vh, 10px)', height: 5, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #0891B2, #22D3EE)',
              borderRadius: 3,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'clamp(3px, 0.8vh, 6px)', position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: 600, color: '#0891B2', fontFamily: 'Nunito, sans-serif' }}>
              {progressPercent}%
            </span>
            <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>
              {lessonsCompleted.length}/10
            </span>
          </div>

          <button
            onClick={() => navigate(`/lesson/${currentLesson}`)}
            style={{
              width: '100%',
              marginTop: 'clamp(6px, 1.2vh, 10px)',
              padding: 'clamp(8px, 1.8vh, 14px)',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              border: 'none',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              color: 'white',
              fontSize: 'clamp(13px, 3.2vw, 15px)',
              fontWeight: 800,
              fontFamily: 'Nunito, sans-serif',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(245,158,11,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(6px, 1.2vh, 10px)',
              position: 'relative',
              zIndex: 1,
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              animation: 'shimmer 2s infinite',
              pointerEvents: 'none',
            }} />
            SII WAD →
          </button>
        </div>

        {/* ═══ 5. QUICK ACTIONS ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(6px, 1.2vh, 10px)', marginTop: 'clamp(6px, 1.2vh, 10px)' }}>
          {/* Xirfadaha */}
          <button
            onClick={() => navigate('/progress')}
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: 'clamp(10px, 2.5vw, 16px)',
              padding: 'clamp(8px, 1.8vh, 14px) clamp(8px, 1.8vh, 14px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glow effect */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <IconContainer icon={Barbell} glow="cyan" size="lg" style={{ margin: '0 auto clamp(6px, 1.2vh, 10px)', position: 'relative', zIndex: 1 }} />
            <p style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif', position: 'relative', zIndex: 1 }}>Xirfadaha</p>
            <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', marginTop: 'clamp(3px, 0.8vh, 6px)', position: 'relative', zIndex: 1 }}>Quick practice</p>
          </button>

          {/* Yaab — Daily Fact */}
          {yaabRevealed ? (() => {
            const catColor = getCategoryColor(dailyFact.category);
            return (
              <div style={{
                flex: 1, background: catColor.bg,
                borderRadius: 'clamp(14px, 3vw, 20px)', padding: 'clamp(12px, 2.5vh, 20px)',
                display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.2vh, 10px)',
                minHeight: 120, border: `1.5px solid ${catColor.border}30`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.2vh, 10px)' }}>
                  <Lightbulb size={18} weight="fill" color={catColor.text} />
                  <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: 700, color: catColor.text, fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {catColor.label}
                  </span>
                </div>
                <p style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', fontWeight: 700, color: '#1E293B', fontFamily: 'Nunito, sans-serif', margin: 0, lineHeight: 1.4, flex: 1 }}>
                  {dailyFact.fact}
                </p>
              </div>
            );
          })() : (
            <div
              onClick={handleYaabTap}
              style={{
                flex: 1, background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                borderRadius: 'clamp(10px, 2.5vw, 16px)', padding: 'clamp(8px, 1.8vh, 14px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 'clamp(3px, 0.8vh, 6px)', cursor: 'pointer', position: 'relative', overflow: 'hidden', minHeight: 100,
                boxShadow: '0 8px 32px rgba(245,158,11,0.3)',
              }}
            >
              {/* Gold glow */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '80px',
                background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
              <Sparkle size={12} weight="fill" color="rgba(255,255,255,0.6)" style={{ position: 'absolute', top: 'clamp(8px, 1.8vh, 14px)', right: 'clamp(8px, 1.8vh, 14px)' }} />
              <Sparkle size={10} weight="fill" color="rgba(255,255,255,0.5)" style={{ position: 'absolute', bottom: 'clamp(12px, 2.5vh, 20px)', left: 'clamp(8px, 1.8vh, 14px)' }} />
              <IconContainer icon={Gift} glow="gold" size="lg" style={{ position: 'relative', zIndex: 1 }} />
              <p style={{ fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', margin: 0, position: 'relative', zIndex: 1 }}>Yaab!</p>
              <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif', margin: 0, position: 'relative', zIndex: 1 }}>
                {lang === 'en' ? 'Tap to reveal' : 'Taabo si aad u aragto'}
              </p>
            </div>
          )}
        </div>

        {/* ═══ 6. DAILY CHALLENGE ═══ */}
        <button
          onClick={() => navigate('/practice/daily')}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
            borderRadius: 'clamp(10px, 2.5vw, 16px)',
            padding: 'clamp(8px, 1.8vh, 14px) clamp(12px, 2.5vh, 20px)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(8px, 1.8vh, 14px)',
            marginTop: 'clamp(6px, 1.2vh, 10px)',
            boxShadow: '0 8px 30px rgba(234,88,12,0.35)',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          {/* Animated shimmer */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shimmer 2s infinite',
            pointerEvents: 'none',
          }} />

          <IconContainer icon={Lightning} glow="orange" size="lg" />

          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>Daily Challenge</p>
            <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: 'rgba(255,255,255,0.85)', fontFamily: 'Nunito, sans-serif', marginTop: 'clamp(3px, 0.8vh, 6px)' }}>Complete for +25 Dahab</p>
          </div>

          <span style={{
            padding: 'clamp(6px, 1.2vh, 10px) clamp(12px, 2.5vh, 20px)',
            background: 'rgba(255,255,255,0.25)',
            borderRadius: 'clamp(14px, 3vw, 20px)',
            fontSize: 'clamp(11px, 2.8vw, 13px)',
            fontWeight: 700,
            color: 'white',
            fontFamily: 'Nunito, sans-serif',
          }}>GO</span>
        </button>

        {/* ═══ 7. STREAK CARD ═══ */}
        {(() => {
          const streakData = getStreakData();
          const { label, color, icon } = getStreakTier(streakData.currentStreak);
          const next = getNextMilestone(streakData.currentStreak);
          const prevDay = next ? Object.keys(MILESTONES).map(Number).filter(d => d < next.day).pop() || 0 : 0;
          const progress = next ? ((streakData.currentStreak - prevDay) / (next.day - prevDay)) * 100 : 100;

          return (
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'clamp(14px, 3vw, 20px)',
              padding: 'clamp(14px, 3.5vw, 20px)',
              marginTop: 'clamp(12px, 2.5vh, 20px)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'clamp(8px, 1.8vh, 14px)' }}>
                <div>
                  <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', margin: '0 0 clamp(3px, 0.8vh, 6px)' }}>Streak-kaaga</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(3px, 0.8vh, 6px)' }}>
                    <span style={{ fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: 800, color, fontFamily: 'Nunito, sans-serif', lineHeight: 1 }}>{streakData.currentStreak}</span>
                    <span style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif' }}>maalmood</span>
                  </div>
                </div>
                <span style={{ fontSize: 'clamp(24px, 6vw, 32px)' }}>{icon}</span>
              </div>

              <div style={{ display: 'inline-block', padding: 'clamp(3px, 0.8vh, 6px) clamp(8px, 1.8vh, 14px)', background: `${color}15`, borderRadius: 'clamp(14px, 3vw, 20px)', marginBottom: 'clamp(8px, 1.8vh, 14px)' }}>
                <span style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 700, color, fontFamily: 'Nunito, sans-serif' }}>{label}</span>
              </div>

              {next && (
                <div style={{ marginBottom: 'clamp(12px, 2.5vh, 20px)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'clamp(3px, 0.8vh, 6px)' }}>
                    <span style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif' }}>Xiga: Maalin {next.day}</span>
                    <span style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 600, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{next.daysLeft} maalin</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${color}CC)`, borderRadius: 4, transition: 'width 0.3s ease' }} />
                  </div>
                  <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', margin: 'clamp(3px, 0.8vh, 6px) 0 0' }}>
                    +{next.reward.dahab} Dahab {next.reward.xpMultiplier ? `+ ${next.reward.xpMultiplier}x XP` : ''}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'clamp(8px, 1.8vh, 14px)', marginBottom: 'clamp(8px, 1.8vh, 14px)' }}>
                <div>
                  <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: 'rgba(255,255,255,0.5)', margin: 0, fontFamily: 'Nunito, sans-serif' }}>Ugu dheer</p>
                  <p style={{ fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 700, color: 'white', margin: 'clamp(3px, 0.8vh, 6px) 0 0', fontFamily: 'Nunito, sans-serif' }}>{streakData.longestStreak} maalin</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: 'rgba(255,255,255,0.5)', margin: 0, fontFamily: 'Nunito, sans-serif' }}>Freeze</p>
                  <p style={{ fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 700, color: '#22D3EE', margin: 'clamp(3px, 0.8vh, 6px) 0 0', fontFamily: 'Nunito, sans-serif' }}>
                    <Snowflake size={14} weight="fill" style={{ verticalAlign: 'middle', marginRight: 'clamp(3px, 0.8vh, 6px)' }} />{streakData.freezesOwned}/2
                  </p>
                </div>
              </div>

              {streakData.freezesOwned < 2 && (
                <button onClick={() => {
                  const s = storage.get();
                  const result = purchaseStreakFreeze(s.dahab || 0, (amount) => storage.update({ dahab: (s.dahab || 0) - amount }));
                  if (!result.success) alert(result.message);
                  else alert(result.message);
                }} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(6px, 1.2vh, 10px)',
                  width: '100%', padding: 'clamp(8px, 1.8vh, 14px) clamp(12px, 2.5vh, 20px)',
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  fontSize: 'clamp(13px, 3.2vw, 15px)',
                  fontWeight: 700,
                  fontFamily: 'Nunito, sans-serif',
                  cursor: 'pointer',
                }}>
                  <Snowflake size={18} weight="fill" /> Freeze iibso (50 Dahab)
                </button>
              )}
            </div>
          );
        })()}

      </div>

      <BottomNav active="geel-world" />
    </div>
  );
}

function StatPill({ icon, gradient, value }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.15)',
      border: '1px solid rgba(255,255,255,0.3)',
      borderRadius: 'clamp(12px, 3vw, 18px)', padding: 'clamp(6px, 1.5vw, 12px) clamp(10px, 2.5vw, 16px)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 10px)',
    }}>
      <div style={{
        width: 'clamp(22px, 5.5vw, 32px)', height: 'clamp(22px, 5.5vw, 32px)', borderRadius: 'clamp(6px, 1.5vw, 10px)', background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 'clamp(14px, 3.5vw, 20px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{value}</span>
    </div>
  );
}

function MiniStatCard({ label, value, sublabel }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: 'clamp(10px, 2.5vw, 16px)',
      padding: 'clamp(6px, 1.2vh, 10px) clamp(6px, 1.2vh, 10px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
      <p style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', marginTop: 1 }}>{value}</p>
      <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif' }}>{sublabel}</p>
    </div>
  );
}
