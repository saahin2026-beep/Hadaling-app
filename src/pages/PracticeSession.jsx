import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Confetti as ConfettiIcon } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useData } from '../utils/DataContext';
import ChooseExercise from '../exercises/ChooseExercise';
import FillGapExercise from '../exercises/FillGapExercise';
import ScenarioExercise from '../exercises/ScenarioExercise';
import ScrambleExercise from '../exercises/ScrambleExercise';
import SentenceBuilderExercise from '../exercises/SentenceBuilderExercise';
import Geel from '../components/Geel';
import Confetti from '../components/Confetti';
import ExerciseLayout from '../components/ExerciseLayout';
import { shuffleOptions } from '../utils/shuffleOptions';

export default function PracticeSession() {
  const { featureKey } = useParams();
  const navigate = useNavigate();
  const { practiceFeatures } = useData();
  const feature = practiceFeatures?.[featureKey];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const shuffledExercises = useMemo(() => {
    if (!feature) return [];
    return feature.exercises.map(ex => shuffleOptions(ex));
  }, [feature]);

  useEffect(() => { if (!feature) navigate('/progress'); }, [feature, navigate]);
  if (!feature) return null;

  const exercise = shuffledExercises[currentIndex];

  const handleExerciseComplete = (wasCorrect) => {
    if (wasCorrect) setCorrectCount((c) => c + 1);
    const nextIndex = currentIndex + 1;
    storage.update({ [`practice_${featureKey}_progress`]: nextIndex });

    if (nextIndex >= shuffledExercises.length) {
      const state = storage.get();
      const pc = state.practiceCompleted || {};
      pc[featureKey] = true;
      storage.update({ practiceCompleted: pc, [`practice_${featureKey}_progress`]: feature.exercises.length });
      setCompleted(true);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const accuracyPct = completed ? Math.round((correctCount / feature.exercises.length) * 100) : 0;

  if (completed) {
    return (
      <div className="page-fixed" style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <Confetti />
        <div style={{ padding: 'clamp(16px, 4vh, 32px) clamp(12px, 2.5vh, 20px) clamp(12px, 2.5vh, 20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, flex: 1, minHeight: 0 }}>
          <Geel size={90} expression="celebrating" circular style={{
            background: 'linear-gradient(180deg, #FDE68A 0%, #FCD34D 30%, #F59E0B 70%, #D97706 100%)',
            boxShadow: '0 12px 40px rgba(245,158,11,0.4), 0 0 0 4px rgba(255,255,255,0.9), 0 0 0 8px rgba(245,158,11,0.2)',
          }} />
          <h1 style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 900, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 'clamp(12px, 2.5vh, 20px)', textAlign: 'center' }}>
            Hambalyo! <ConfettiIcon size={24} weight="fill" color="#FFC107" style={{ display: 'inline', verticalAlign: 'middle' }} />
          </h1>
          <p style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', color: '#64748B', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 'clamp(6px, 1.2vh, 10px)' }}>
            Waxaad dhammaysay {feature.title}
          </p>

          <div style={{ display: 'flex', gap: 'clamp(8px, 1.8vh, 14px)', marginTop: 'clamp(16px, 3vh, 28px)', width: '100%' }}>
            <div style={{ flex: 1, background: 'linear-gradient(180deg, #FFFFFF, #ECFDF5)', border: '1.5px solid rgba(16,185,129,0.2)', borderRadius: 'clamp(14px, 3vw, 20px)', padding: 'clamp(12px, 2.5vh, 20px) clamp(6px, 1.2vh, 10px)', textAlign: 'center', boxShadow: '0 4px 16px rgba(16,185,129,0.1)' }}>
              <p style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 800, color: '#059669', fontFamily: 'Nunito, sans-serif' }}>{correctCount}/{feature.exercises.length}</p>
              <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: 700, color: '#10B981', fontFamily: 'Nunito, sans-serif', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sax</p>
            </div>
            <div style={{ flex: 1, background: 'linear-gradient(180deg, #FFFFFF, #ECFEFF)', border: '1.5px solid rgba(8,145,178,0.2)', borderRadius: 'clamp(14px, 3vw, 20px)', padding: 'clamp(12px, 2.5vh, 20px) clamp(6px, 1.2vh, 10px)', textAlign: 'center', boxShadow: '0 4px 16px rgba(8,145,178,0.1)' }}>
              <p style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 800, color: accuracyPct >= 70 ? '#0E7490' : '#D97706', fontFamily: 'Nunito, sans-serif' }}>{accuracyPct}%</p>
              <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: 700, color: '#0891B2', fontFamily: 'Nunito, sans-serif', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Saxnaan</p>
            </div>
          </div>

          {accuracyPct < 70 && (
            <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: '#D97706', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 'clamp(8px, 1.8vh, 14px)' }}>
              Isku day mar kale si aad u hesho 70%+
            </p>
          )}

          <div style={{ height: 'clamp(16px, 3vh, 28px)' }} />
          <button onClick={() => navigate('/progress')} style={{
            width: '100%', height: '60px', background: 'linear-gradient(145deg, #0891B2 0%, #0E7490 50%, #064E5E 100%)',
            border: 'none', borderRadius: 'clamp(14px, 3vw, 20px)', fontSize: 'clamp(16px, 4.2vw, 20px)', fontWeight: 800, color: 'white',
            fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            boxShadow: '0 8px 28px rgba(8,145,178,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}>
            KU NOQO XIRFADAHA
          </button>
          {accuracyPct < 100 && (
            <button onClick={() => {
              setCurrentIndex(0); setCorrectCount(0); setCompleted(false);
              storage.update({ [`practice_${featureKey}_progress`]: 0 });
              const state = storage.get();
              const pc = state.practiceCompleted || {};
              delete pc[featureKey];
              storage.update({ practiceCompleted: pc });
            }} style={{
              width: '100%', height: '54px', marginTop: 'clamp(6px, 1.2vh, 10px)',
              background: 'transparent', border: '2px solid #E2E8F0', borderRadius: 'clamp(14px, 3vw, 20px)',
              fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 800, color: '#64748B', fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            }}>
              MAR KALE KU CELI
            </button>
          )}
        </div>
      </div>
    );
  }

  const renderExercise = () => {
    const baseProps = { data: exercise, onComplete: handleExerciseComplete, practiceMode: true };

    switch (exercise.type) {
      case 'choose': return <ChooseExercise key={currentIndex} {...baseProps} />;
      case 'fillgap': return <FillGapExercise key={currentIndex} {...baseProps} />;
      case 'scenario': return <ScenarioExercise key={currentIndex} {...baseProps} />;
      case 'scramble': return <ScrambleExercise key={currentIndex} data={exercise} featureColor={feature.color} onComplete={handleExerciseComplete} practiceMode />;
      case 'sentenceBuilder': return <SentenceBuilderExercise key={currentIndex} data={exercise} featureColor={feature.color} onComplete={handleExerciseComplete} practiceMode />;
      default: return <ChooseExercise key={currentIndex} {...baseProps} />;
    }
  };

  return (
    <ExerciseLayout
      current={currentIndex + 1}
      total={feature.exercises.length}
      onClose={() => navigate('/progress')}
    >
      <p style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', fontWeight: 600, fontFamily: 'Nunito, sans-serif', color: '#333', marginBottom: 'clamp(8px, 1.8vh, 14px)' }}>
        {exercise.instruction}
      </p>
      {renderExercise()}
    </ExerciseLayout>
  );
}
