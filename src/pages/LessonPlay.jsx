import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, CurrencyCircleDollar } from '@phosphor-icons/react';
import { useData } from '../utils/DataContext';
import { calculateDahabLesson } from '../utils/speedScore';
import { saveChunkStats } from '../utils/dailyMix';
import ExerciseWrapper from '../components/ExerciseWrapper';
import ChooseExercise from '../exercises/ChooseExercise';
import FillGapExercise from '../exercises/FillGapExercise';
import OrderExercise from '../exercises/OrderExercise';
import ListenChooseExercise from '../exercises/ListenChooseExercise';
import ScenarioExercise from '../exercises/ScenarioExercise';

const EXERCISE_MAP = {
  choose: ChooseExercise,
  fillgap: FillGapExercise,
  order: OrderExercise,
  listen: ListenChooseExercise,
  scenario: ScenarioExercise,
};

export default function LessonPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lessonData } = useData();
  const data = lessonData?.[id];
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseKey, setExerciseKey] = useState(0);
  const [sessionDahab, setSessionDahab] = useState(0);
  const [chunkResults, setChunkResults] = useState([]);

  if (!data) { navigate('/home'); return null; }

  const totalExercises = data.exercises.length;
  const exercise = data.exercises[currentExercise];
  const ExerciseComponent = EXERCISE_MAP[exercise.type];
  const enrichedData = { ...exercise, lessonId: Number(id) };
  const progress = ((currentExercise + 1) / totalExercises) * 100;

  const handleNext = (wasCorrect = true) => {
    const reward = calculateDahabLesson(wasCorrect);
    if (reward.total > 0) {
      setSessionDahab((prev) => prev + reward.total);
    }
    if (exercise.chunkId) {
      setChunkResults(prev => [...prev, { chunkId: exercise.chunkId, correct: wasCorrect }]);
    }
    if (currentExercise < totalExercises - 1) {
      setCurrentExercise((p) => p + 1);
      setExerciseKey((p) => p + 1);
    } else {
      const finalResults = [...chunkResults, { chunkId: exercise.chunkId, correct: wasCorrect }];
      saveChunkStats(finalResults);
      navigate(`/lesson/${id}/complete`, {
        state: { dahabEarned: sessionDahab + reward.total }
      });
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient lights */}
      <div style={{ position: 'absolute', top: '-30px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '-50px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 2 }}>
        <button onClick={() => navigate('/home')} style={{
          width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.12)',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <X size={20} weight="bold" color="white" />
        </button>

        <div style={{ flex: 1, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 5,
            background: 'linear-gradient(90deg, #22D3EE, #0891B2)',
            width: `${progress}%`, transition: 'width 0.4s ease',
            boxShadow: '0 0 12px rgba(34,211,238,0.4)',
          }} />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(245,158,11,0.15)', padding: '8px 14px', borderRadius: 12,
          border: '1px solid rgba(245,158,11,0.25)',
        }}>
          <CurrencyCircleDollar size={18} weight="fill" color="#F59E0B" />
          <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'Nunito, sans-serif', color: '#FBBF24', minWidth: 24, textAlign: 'right' }}>
            {sessionDahab}
          </span>
        </div>
      </div>

      {/* Exercise number */}
      <div style={{ padding: '4px 20px 12px', position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: 20,
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif' }}>
            {currentExercise + 1} / {totalExercises}
          </span>
        </div>
      </div>

      <ExerciseWrapper instruction={exercise.instruction} premium={true}>
        <ExerciseComponent key={exerciseKey} data={enrichedData} onComplete={handleNext} premium={true} />
      </ExerciseWrapper>
    </div>
  );
}
