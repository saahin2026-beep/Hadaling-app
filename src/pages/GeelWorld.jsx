import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fire, Star, Heart, Play, Target, Check, Lock, Lightning, Gift, ArrowRight, ChatCircleDots, Barbell, Sparkle, CurrencyCircleDollar, HandWaving, Lightbulb } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useData } from '../utils/DataContext';
import { useLanguage } from '../utils/useLanguage';
import BottomNav from '../components/BottomNav';
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
    <div style={{ background: '#FBF7F0', minHeight: '100dvh', paddingBottom: 100 }}>
      {/* ═══ 1. HERO HEADER ═══ */}
      <div style={{
        background: 'linear-gradient(180deg, #22D3EE 0%, #0891B2 40%, #0E7490 100%)',
        borderRadius: '0 0 24px 24px',
        boxShadow: '0 4px 20px rgba(8,145,178,0.3)',
        padding: '20px 20px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', left: -20, bottom: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        {/* Stats pills */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <StatPill icon={<Fire size={14} weight="fill" color="white" />} gradient="linear-gradient(135deg, #F97316, #FB923C)" value={streak} />
          <StatPill icon={<Star size={14} weight="fill" color="white" />} gradient="linear-gradient(135deg, #FFCA28, #FFD54F)" value={xp} />
          <StatPill icon={<CurrencyCircleDollar size={14} weight="fill" color="white" />} gradient="linear-gradient(135deg, #F59E0B, #FBBF24)" value={dahab} />
          <StatPill icon={<Heart size={14} weight="fill" color="white" />} gradient="linear-gradient(135deg, #EF4444, #F87171)" value={5} />
        </div>

        {/* Greeting */}
        <div style={{ textAlign: 'center', marginTop: 16, position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif', letterSpacing: 2, textTransform: 'uppercase' }}>
            {greeting}
          </p>
          <p style={{ fontSize: 'clamp(22px, 5.5vw, 30px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', marginTop: 4, textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>Welcome back! <HandWaving size={24} weight="fill" color="white" /></span>
          </p>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div style={{ padding: '0 16px' }}>

        {/* ═══ 2. WORD OF THE DAY ═══ */}
        <div style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)',
          border: '1px solid rgba(0,0,0,0.05)', borderBottom: '3px solid rgba(0,0,0,0.06)',
          borderRadius: 20, padding: 20,
          marginTop: -20, position: 'relative',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 120, height: 120, borderRadius: '24px 0 60px 0', background: 'linear-gradient(135deg, #ECFEFF 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: 'linear-gradient(135deg, #0891B2, #22D3EE)',
                boxShadow: '0 4px 0 #0E7490',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
              }}>
                <ChatCircleDots size={20} weight="fill" color="white" />
              </div>
              <p style={{ fontSize: 11, fontWeight: 800, color: '#0891B2', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: 2 }}>
                WORD OF THE DAY
              </p>
              <p style={{ fontSize: 'clamp(26px, 6.5vw, 38px)', fontWeight: 900, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>{dailyWord.en}</p>
              <p style={{ fontSize: 'clamp(14px, 3.5vw, 18px)', fontWeight: 600, color: '#0891B2', fontFamily: 'Nunito, sans-serif' }}>{dailyWord.so}</p>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 16 }}>
          <MiniStatCard label="TODAY" value="0" sublabel="lessons" color="#10B981" />
          <MiniStatCard label="GOAL" value="3" sublabel="weekly" color="#0891B2" />
          <MiniStatCard label="RANK" value="#42" sublabel="global" color="#8B5CF6" />
        </div>

        {/* ═══ 4. TODAY'S MISSION ═══ */}
        <div style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)',
          border: '1px solid rgba(0,0,0,0.05)', borderBottom: '3px solid rgba(0,0,0,0.06)',
          borderRadius: 20, padding: 20,
          marginTop: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16,
              background: 'linear-gradient(135deg, #0891B2, #22D3EE)',
              boxShadow: '0 4px 0 #0E7490',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Target size={24} weight="fill" color="white" />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#0891B2', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: 2 }}>
                MAANTA / TODAY
              </p>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>
                {currentLessonData?.titleSo || `Casharka ${currentLesson}`}
              </p>
              <p style={{ fontSize: 13, color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>
                {currentLessonData?.titleEn || ''}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 16, height: 14, borderRadius: 12, background: '#F1F5F9', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 12,
              width: `${Math.round((lessonsCompleted.length / 10) * 100)}%`,
              background: 'linear-gradient(90deg, #0E7490 0%, #0891B2 50%, #22D3EE 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', fontFamily: 'Nunito, sans-serif' }}>
              {Math.round((lessonsCompleted.length / 10) * 100)}% complete
            </span>
            <span style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Nunito, sans-serif' }}>
              {lessonsCompleted.length}/10 lessons
            </span>
          </div>

          <button
            onClick={() => navigate(`/lesson/${currentLesson}`)}
            style={{
              width: '100%', padding: '16px 24px', borderRadius: 16, border: 'none',
              background: 'linear-gradient(180deg, #22D3EE 0%, #0891B2 40%, #0E7490 100%)',
              borderBottom: '6px solid #155E75',
              boxShadow: '0 4px 12px rgba(8,145,178,0.3)',
              color: 'white', fontSize: 16, fontWeight: 800,
              fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: 1, marginTop: 16,
              transform: 'translateY(0)', transition: 'all 0.08s ease',
            }}
            {...press3D('#155E75', 6)}
          >
            Sii Wad →
          </button>
        </div>

        {/* ═══ 5. QUICK ACTIONS ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
          {/* Xirfadaha */}
          <button
            onClick={() => navigate('/progress')}
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)', borderRadius: 20, padding: '20px 16px',
              border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 6px 0 #D1FAE5',
              textAlign: 'center', cursor: 'pointer',
              transform: 'translateY(0)', transition: 'all 0.08s ease',
            }}
            {...press3D('#D1FAE5', 6)}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 18, margin: '0 auto',
              background: 'linear-gradient(135deg, #059669, #10B981)',
              boxShadow: '0 5px 0 #047857',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Barbell size={28} weight="fill" color="white" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 12 }}>Xirfadaha</p>
            <p style={{ fontSize: 12, color: '#10B981', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>Quick practice</p>
          </button>

          {/* Yaab — Daily Fact */}
          {yaabRevealed ? (() => {
            const catColor = getCategoryColor(dailyFact.category);
            return (
              <div style={{
                flex: 1, background: catColor.bg,
                borderRadius: 20, padding: 16,
                display: 'flex', flexDirection: 'column', gap: 10,
                minHeight: 120, border: `1.5px solid ${catColor.border}30`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Lightbulb size={18} weight="fill" color={catColor.text} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: catColor.text, fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {catColor.label}
                  </span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', fontFamily: 'Nunito, sans-serif', margin: 0, lineHeight: 1.4, flex: 1 }}>
                  {dailyFact.fact}
                </p>
              </div>
            );
          })() : (
            <div
              onClick={handleYaabTap}
              style={{
                flex: 1, background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                borderRadius: 20, padding: 20,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, cursor: 'pointer', position: 'relative', overflow: 'hidden', minHeight: 120,
              }}
            >
              <Sparkle size={12} weight="fill" color="rgba(255,255,255,0.6)" style={{ position: 'absolute', top: 12, right: 12 }} />
              <Sparkle size={10} weight="fill" color="rgba(255,255,255,0.5)" style={{ position: 'absolute', bottom: 16, left: 12 }} />
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Gift size={26} weight="fill" color="white" />
              </div>
              <p style={{ fontSize: 16, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', margin: 0 }}>Yaab!</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
                {lang === 'en' ? 'Tap to reveal' : 'Taabo si aad u aragto'}
              </p>
            </div>
          )}
        </div>

        {/* ═══ 6. DAILY CHALLENGE ═══ */}
        <div style={{
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
          border: '1px solid #FCD34D', borderRadius: 20, padding: '16px 18px',
          marginTop: 16, boxShadow: '0 5px 0 #D97706',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
            boxShadow: '0 4px 0 #D97706',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Lightning size={24} weight="fill" color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#92400E', fontFamily: 'Nunito, sans-serif' }}>Daily Challenge</p>
            <p style={{ fontSize: 12, color: '#B45309', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>Complete for +25 Dahab</p>
          </div>
          <button
            onClick={() => navigate('/practice/daily')}
            style={{
              background: '#F59E0B', color: 'white', borderRadius: 12,
              padding: '10px 20px', fontWeight: 800, fontSize: 13, border: 'none',
              boxShadow: '0 3px 0 #D97706', cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase',
              transform: 'translateY(0)', transition: 'all 0.08s ease',
            }}
            {...press3D('#D97706', 3)}
          >
            GO
          </button>
        </div>

        {/* ═══ 7. STREAK CARD ═══ */}
        {(() => {
          const streakData = getStreakData();
          const { label, color, icon } = getStreakTier(streakData.currentStreak);
          const next = getNextMilestone(streakData.currentStreak);
          const prevDay = next ? Object.keys(MILESTONES).map(Number).filter(d => d < next.day).pop() || 0 : 0;
          const progress = next ? ((streakData.currentStreak - prevDay) / (next.day - prevDay)) * 100 : 100;

          return (
            <div style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)',
              border: '1px solid rgba(0,0,0,0.05)', borderBottom: '3px solid rgba(0,0,0,0.06)',
              borderRadius: 20, padding: 'clamp(14px, 3.5vw, 20px)',
              marginTop: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 13, color: '#64748B', fontFamily: 'Nunito, sans-serif', margin: '0 0 4px' }}>Streak-kaaga</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 36, fontWeight: 800, color, fontFamily: 'Nunito, sans-serif', lineHeight: 1 }}>{streakData.currentStreak}</span>
                    <span style={{ fontSize: 14, color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>maalmood</span>
                  </div>
                </div>
                <span style={{ fontSize: 32 }}>{icon}</span>
              </div>

              <div style={{ display: 'inline-block', padding: '4px 12px', background: `${color}15`, borderRadius: 20, marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: 'Nunito, sans-serif' }}>{label}</span>
              </div>

              {next && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>Xiga: Maalin {next.day}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#334155', fontFamily: 'Nunito, sans-serif' }}>{next.daysLeft} maalin</span>
                  </div>
                  <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${color}CC)`, borderRadius: 4, transition: 'width 0.3s ease' }} />
                  </div>
                  <p style={{ fontSize: 11, color: '#64748B', fontFamily: 'Nunito, sans-serif', margin: '6px 0 0' }}>
                    +{next.reward.dahab} Dahab {next.reward.xpMultiplier ? `+ ${next.reward.xpMultiplier}x XP` : ''}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: 12, marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 11, color: '#94A3B8', margin: 0, fontFamily: 'Nunito, sans-serif' }}>Ugu dheer</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#334155', margin: '2px 0 0', fontFamily: 'Nunito, sans-serif' }}>{streakData.longestStreak} maalin</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: '#94A3B8', margin: 0, fontFamily: 'Nunito, sans-serif' }}>Freeze</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#0891B2', margin: '2px 0 0', fontFamily: 'Nunito, sans-serif' }}>
                    <Snowflake size={14} weight="fill" style={{ verticalAlign: 'middle', marginRight: 4 }} />{streakData.freezesOwned}/2
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
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  width: '100%', padding: '12px 16px', background: '#E0F2FE', color: '#0891B2',
                  border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
                  fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
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

function MiniStatCard({ label, value, sublabel, color }) {
  return (
    <div style={{
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)',
      border: '1px solid rgba(0,0,0,0.05)', borderBottom: '3px solid rgba(0,0,0,0.06)',
      borderRadius: 'clamp(12px, 3vw, 18px)', padding: 'clamp(12px, 3vw, 18px) clamp(8px, 2vw, 14px)', textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      <p style={{ fontSize: 10, fontWeight: 700, color, fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</p>
      <p style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 900, color, fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>{value}</p>
      <p style={{ fontSize: 11, color: '#64748B', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>{sublabel}</p>
    </div>
  );
}
