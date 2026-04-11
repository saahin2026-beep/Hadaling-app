import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { BookOpen, ListNumbers, ArrowsLeftRight, PuzzlePiece, Shuffle, Stack, CheckCircle, CaretRight, Calendar, Fire } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import practiceFeatures from '../data/practiceFeatures';
import Geel from '../components/Geel';
import BottomNav from '../components/BottomNav';
import IconContainer from '../components/IconContainer';

const ICON_MAP = { BookOpen, ListNumbers, ArrowsLeftRight, PuzzlePiece, Shuffle, Stack };
const FEATURE_KEYS = Object.keys(practiceFeatures);

export default function PracticeHub() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const state = storage.get();
  const completedFeatures = state.practiceCompleted || {};

  useEffect(() => { storage.checkDailyReset(); }, []);

  const dailyState = state.dailyPractice || {};
  const isDailyCompleted = dailyState.completed && dailyState.date === new Date().toISOString().split('T')[0];
  const dailyProgress = dailyState.progress || 0;
  const dailyStreak = state.dailyStreak || 0;

  const getTimeUntilReset = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="page-scroll" style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ambient light blobs */}
      <div style={{
        position: 'absolute', top: '5%', right: '-60px', width: '200px', height: '200px',
        background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: '35%', left: '-80px', width: '180px', height: '180px',
        background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)',
        width: '250px', height: '250px',
        background: 'radial-gradient(circle, rgba(8,145,178,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Header */}
      <div style={{
        padding: '16px 20px 24px',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Geel size={44} circular style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }} />
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
              {lang === 'en' ? 'Practice' : 'Xirfadaha'}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif' }}>
              {lang === 'en' ? 'Build your skills' : 'Kor u qaad xirfadahaaga'}
            </p>
          </div>
        </div>

        {/* Overall practice progress */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 12, padding: '12px 14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'Nunito, sans-serif' }}>
              {lang === 'en' ? 'Overall Progress' : 'Horumarkaaga guud'}
            </span>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
              {Object.keys(completedFeatures).filter((k) => completedFeatures[k]).length}/{FEATURE_KEYS.length}
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3, background: 'white',
              width: `${(Object.keys(completedFeatures).filter((k) => completedFeatures[k]).length / FEATURE_KEYS.length) * 100}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Daily Mix Card — WHITE for contrast */}
      <div style={{ padding: '0 16px', position: 'relative', zIndex: 2 }}>
        {!isDailyCompleted ? (
          <button
            onClick={() => navigate('/practice/daily')}
            style={{
              width: '100%',
              background: 'white',
              borderRadius: 20,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 2px 10px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle accent gradient */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '40%', height: '100%',
              background: 'linear-gradient(135deg, transparent 0%, rgba(8,145,178,0.03) 50%, rgba(34,211,238,0.06) 100%)',
              pointerEvents: 'none',
            }} />

            <div style={{ padding: '20px 18px 16px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Calendar size={22} weight="fill" color="#0891B2" />
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif' }}>
                      {lang === 'en' ? 'Daily Mix' : 'Jimicsiga Maanta'}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>
                    {lang === 'en' ? '12 exercises \u2022 All skills' : '12 su\'aalo \u2022 Dhammaan xirfadaha'}
                  </p>
                </div>
                {dailyStreak > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FFF7ED', padding: '6px 10px', borderRadius: 10 }}>
                    <Fire size={16} weight="fill" color="#EA580C" />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#EA580C', fontFamily: 'Nunito, sans-serif' }}>{dailyStreak}</span>
                  </div>
                )}
              </div>

              {dailyProgress > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>{dailyProgress}/12</span>
                    <span style={{ fontSize: 11, color: '#0891B2', fontWeight: 700, fontFamily: 'Nunito, sans-serif' }}>{Math.round((dailyProgress / 12) * 100)}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: '#E0F2FE', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #0891B2, #22D3EE)', width: `${(dailyProgress / 12) * 100}%`, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              )}

              {/* Skill tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: dailyProgress > 0 ? 0 : 12 }}>
                {['vocab', 'plurals', 'opposites', 'word form', 'conjugation', 'sentence'].map(skill => (
                  <span key={skill} style={{
                    padding: '4px 10px', background: '#E0F2FE', borderRadius: 20,
                    fontSize: 11, fontWeight: 600, color: '#0891B2', fontFamily: 'Nunito, sans-serif',
                  }}>
                    {skill} x2
                  </span>
                ))}
              </div>
            </div>

            {/* Start button */}
            <div style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s linear infinite',
              }} />
              <span style={{ fontSize: 15, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: 1, position: 'relative', zIndex: 1 }}>
                {dailyProgress > 0 ? (lang === 'en' ? 'CONTINUE' : 'SII WAD') : (lang === 'en' ? 'START' : 'BILOW')}
              </span>
            </div>
          </button>
        ) : (
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 20, padding: 18,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={24} weight="fill" color="#10B981" />
                <span style={{ fontSize: 18, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
                  {lang === 'en' ? 'Daily Complete!' : 'Maanta Waa Dhammaatay!'}
                </span>
              </div>
              {dailyStreak > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.15)', padding: '6px 10px', borderRadius: 10 }}>
                  <Fire size={16} weight="fill" color="#F97316" />
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{dailyStreak}</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif' }}>
                {dailyState.correctCount}/12 {lang === 'en' ? 'correct' : 'sax'} {'\u2022'} +{dailyState.dahabEarned || 0} Dahab
              </span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif' }}>
                {lang === 'en' ? 'Resets in' : 'Dib u bilowga'} {getTimeUntilReset()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Feature cards */}
      <div style={{ padding: '16px 16px 100px', position: 'relative', zIndex: 2 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {lang === 'en' ? 'Practice Activities' : 'Jimcsiyo ku celceli'}
        </p>

        {FEATURE_KEYS.map((key) => {
          const feature = practiceFeatures[key];
          const Icon = ICON_MAP[feature.icon] || BookOpen;
          const isCompleted = completedFeatures[key];
          const progress = state[`practice_${key}_progress`] || 0;

          return (
            <button
              key={key}
              onClick={() => navigate(`/practice/${key}`)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                padding: '18px 16px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.12)',
                marginBottom: 10, cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              {isCompleted ? (
                <IconContainer icon={CheckCircle} glow="green" size="lg" />
              ) : (
                <IconContainer icon={Icon} glow={
                  key === 'vocabulary' ? 'cyan' :
                  key === 'plurals' ? 'purple' :
                  key === 'opposites' ? 'gold' :
                  key === 'wordFormation' ? 'green' :
                  key === 'verbConjugation' ? 'orange' :
                  key === 'sentenceBuilder' ? 'pink' : 'cyan'
                } size="lg" />
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
                  {lang === 'en' ? feature.titleEn : feature.title}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>
                  {lang === 'en' ? feature.descriptionEn : feature.description}
                </p>
                {progress > 0 && !isCompleted && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 2, background: feature.color, width: `${(progress / feature.exercises.length) * 100}%` }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: feature.color, fontFamily: 'Nunito, sans-serif' }}>{progress}/{feature.exercises.length}</span>
                  </div>
                )}
                {isCompleted && (
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#6EE7B7', fontFamily: 'Nunito, sans-serif', marginTop: 4 }}>
                    {lang === 'en' ? 'Completed!' : 'Waa la dhammaystiray!'}
                  </p>
                )}
              </div>

              <CaretRight size={18} weight="bold" color="rgba(255,255,255,0.4)" />
            </button>
          );
        })}
      </div>

      <BottomNav active="xirfadaha" />
    </div>
  );
}
