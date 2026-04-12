import { useNavigate } from 'react-router-dom';
import { Lock, Check, CaretRight } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useData } from '../utils/DataContext';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';
import BottomNav from '../components/BottomNav';
import IconContainer from '../components/IconContainer';

const LESSON_EMOJIS = {
  1: '👋', 2: '👨‍👩‍👧‍👦', 3: '🔢', 4: '🍽️', 5: '⏰',
  6: '📍', 7: '💼', 8: '🚗', 9: '🏥', 10: '🎉',
};

export default function Home() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const state = storage.get();
  const { lessonsList } = useData();
  const lessons = (lessonsList || []).slice(0, 10);
  const { lessonsCompleted = [], currentLesson = 1 } = state;

  return (
    <div className="page-scroll" style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Ambient light blobs */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        right: '-40px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '-60px',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      {/* ═══ HEADER ═══ */}
      <div style={{
        padding: 'clamp(20px, 5vw, 28px) clamp(16px, 4vw, 24px)',
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(12px, 3vw, 16px)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
      }}>
        <Geel size={52} circular style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }} />
        <div>
          <p style={{
            fontSize: 'clamp(18px, 4.5vw, 24px)',
            fontWeight: 800,
            color: 'white',
            fontFamily: 'Nunito, sans-serif',
            margin: 0,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {lang === 'en' ? 'Lessons' : 'Casharka'}
          </p>
          <p style={{
            fontSize: 'clamp(11px, 2.8vw, 13px)',
            color: 'rgba(255,255,255,0.7)',
            fontFamily: 'Nunito, sans-serif',
            margin: 'clamp(3px, 0.8vh, 6px) 0 0'
          }}>
            {lessonsCompleted.length} of 10 complete
          </p>
        </div>
      </div>

      {/* ═══ LESSON CARDS ═══ */}
      <div style={{
        flex: 1,
        padding: 'clamp(12px, 3vw, 20px) clamp(14px, 3.5vw, 20px)',
        paddingBottom: 'max(100px, calc(80px + env(safe-area-inset-bottom)))',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 2,
      }}>
        {lessons.map((lesson) => {
          const id = lesson.id;
          const isCompleted = (lessonsCompleted || []).includes(id);
          const isCurrent = id === currentLesson && !isCompleted;

          // ── COMPLETED ──
          if (isCompleted) {
            return (
              <div
                key={id}
                onClick={() => navigate(`/lesson/${id}`)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: 'clamp(16px, 4vw, 20px)',
                  padding: 'clamp(14px, 3.5vw, 18px)',
                  marginBottom: 'clamp(10px, 2.5vw, 12px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(12px, 3vw, 16px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <IconContainer icon={Check} glow="green" size="md" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.2vh, 10px)' }}>
                    <span style={{
                      fontSize: 'clamp(9px, 2.2vw, 11px)',
                      fontWeight: 700,
                      color: '#6EE7B7',
                      fontFamily: 'Nunito, sans-serif',
                      letterSpacing: '0.5px',
                    }}>
                      LESSON {id}
                    </span>
                    <span style={{
                      fontSize: 'clamp(9px, 2.2vw, 11px)',
                      color: '#10B981',
                      background: 'rgba(16,185,129,0.2)',
                      padding: 'clamp(3px, 0.8vh, 6px) clamp(6px, 1.2vh, 10px)',
                      borderRadius: 'clamp(8px, 2vw, 12px)',
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 600,
                    }}>
                      {lang === 'en' ? 'Done' : 'Dhammaystay'}
                    </span>
                  </div>
                  <p style={{
                    fontSize: 'clamp(13px, 3.2vw, 15px)',
                    fontWeight: 700,
                    color: 'white',
                    fontFamily: 'Nunito, sans-serif',
                    margin: 'clamp(3px, 0.8vh, 6px) 0 0',
                  }}>
                    {lesson.titleSo}
                  </p>
                  <p style={{
                    fontSize: 'clamp(11px, 2.8vw, 13px)',
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'Nunito, sans-serif',
                    margin: 'clamp(3px, 0.8vh, 6px) 0 0',
                  }}>
                    {lesson.titleEn}
                  </p>
                </div>
                <CaretRight size={18} weight="bold" color="rgba(255,255,255,0.4)" />
              </div>
            );
          }

          // ── CURRENT ──
          if (isCurrent) {
            return (
              <div
                key={id}
                onClick={() => navigate(`/lesson/${id}`)}
                style={{
                  background: 'white',
                  borderRadius: 'clamp(16px, 4vw, 20px)',
                  padding: 'clamp(16px, 4vw, 20px)',
                  marginBottom: 'clamp(10px, 2.5vw, 12px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(12px, 3vw, 16px)',
                  cursor: 'pointer',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                  border: '2px solid rgba(255,255,255,0.9)',
                }}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 'clamp(10px, 2.5vw, 16px)',
                  background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 'clamp(20px, 5.5vw, 28px)',
                  boxShadow: '0 4px 12px rgba(8,145,178,0.3)',
                }}>
                  {LESSON_EMOJIS[id] || '📚'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.2vh, 10px)' }}>
                    <span style={{
                      fontSize: 'clamp(9px, 2.2vw, 11px)',
                      fontWeight: 700,
                      color: '#0891B2',
                      fontFamily: 'Nunito, sans-serif',
                      letterSpacing: '0.5px',
                    }}>
                      LESSON {id}
                    </span>
                    <span style={{
                      fontSize: 'clamp(9px, 2.2vw, 11px)',
                      color: '#0E7490',
                      background: '#ECFEFF',
                      padding: 'clamp(3px, 0.8vh, 6px) clamp(6px, 1.2vh, 10px)',
                      borderRadius: 'clamp(8px, 2vw, 12px)',
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 700,
                    }}>
                      {lang === 'en' ? 'Next' : 'Xiga'}
                    </span>
                  </div>
                  <p style={{
                    fontSize: 'clamp(14px, 3.8vw, 17px)',
                    fontWeight: 800,
                    color: '#0E7490',
                    fontFamily: 'Nunito, sans-serif',
                    margin: 'clamp(3px, 0.8vh, 6px) 0 0',
                  }}>
                    {lesson.titleSo}
                  </p>
                  <p style={{
                    fontSize: 'clamp(11px, 2.8vw, 13px)',
                    color: '#64748B',
                    fontFamily: 'Nunito, sans-serif',
                    margin: 'clamp(3px, 0.8vh, 6px) 0 0',
                  }}>
                    {lesson.titleEn}
                  </p>
                </div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
                  flexShrink: 0,
                }}>
                  <span style={{ color: 'white', fontSize: 'clamp(14px, 3.8vw, 17px)' }}>▶</span>
                </div>
              </div>
            );
          }

          // ── LOCKED ──
          return (
            <div
              key={id}
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderRadius: 'clamp(16px, 4vw, 20px)',
                padding: 'clamp(14px, 3.5vw, 18px)',
                marginBottom: 'clamp(10px, 2.5vw, 12px)',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(12px, 3vw, 16px)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'default',
              }}
            >
              <IconContainer icon={Lock} glow="neutral" size="md" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  fontSize: 'clamp(9px, 2.2vw, 11px)',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.35)',
                  fontFamily: 'Nunito, sans-serif',
                  letterSpacing: '0.5px',
                }}>
                  LESSON {id}
                </span>
                <p style={{
                  fontSize: 'clamp(13px, 3.2vw, 15px)',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'Nunito, sans-serif',
                  margin: 'clamp(3px, 0.8vh, 6px) 0 0',
                }}>
                  {lesson.titleSo}
                </p>
                <p style={{
                  fontSize: 'clamp(11px, 2.8vw, 13px)',
                  color: 'rgba(255,255,255,0.35)',
                  fontFamily: 'Nunito, sans-serif',
                  margin: 'clamp(3px, 0.8vh, 6px) 0 0',
                }}>
                  {lesson.titleEn}
                </p>
              </div>
              <Lock size={16} weight="fill" color="rgba(255,255,255,0.25)" />
            </div>
          );
        })}
      </div>

      <BottomNav active="casharo" />
    </div>
  );
}
