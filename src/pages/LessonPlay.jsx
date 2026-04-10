import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, CurrencyCircleDollar } from '@phosphor-icons/react';
import { useData } from '../utils/DataContext';
import { calculateDahabLesson } from '../utils/speedScore';
import { saveChunkStats } from '../utils/dailyMix';
import ExerciseWrapper from '../components/ExerciseWrapper';
import ProgressBar from '../components/ProgressBar';
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

  const handleNext = (wasCorrect = true) => {
    const reward = calculateDahabLesson(wasCorrect);

    if (reward.total > 0) {
      setSessionDahab((prev) => prev + reward.total);
    }

    // Track chunk result
    if (exercise.chunkId) {
      setChunkResults(prev => [...prev, { chunkId: exercise.chunkId, correct: wasCorrect }]);
    }

    if (currentExercise < totalExercises - 1) {
      setCurrentExercise((p) => p + 1);
      setExerciseKey((p) => p + 1);
    } else {
      // Save chunk stats on lesson complete
      const finalResults = [...chunkResults, { chunkId: exercise.chunkId, correct: wasCorrect }];
      saveChunkStats(finalResults);

      navigate(`/lesson/${id}/complete`, {
        state: { dahabEarned: sessionDahab + reward.total }
      });
    }
  };

  return (
    <div style={{ background: '#0F172A', minHeight: '100dvh', display: 'flex', flexDirection: 'column', animation: 'darkFadeIn 0.3s ease-out' }}>
      <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <X size={22} weight="bold" color="#94A3B8" />
        </button>
        <div style={{ flex: 1 }}>
          <ProgressBar current={currentExercise + 1} total={totalExercises} dark={true} color="#0891B2" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <CurrencyCircleDollar size={16} weight="fill" color="#F59E0B" />
          <span style={{
            fontSize: 15, fontWeight: 800, fontFamily: 'Nunito, sans-serif',
            color: sessionDahab > 0 ? '#D97706' : '#94A3B8',
            minWidth: 28, textAlign: 'right', transition: 'color 0.3s',
          }}>
            {sessionDahab}
          </span>
        </div>
      </div>

      <ExerciseWrapper instruction={exercise.instruction} dark={true}>
        <ExerciseComponent key={exerciseKey} data={enrichedData} onComplete={handleNext} dark={true} />
      </ExerciseWrapper>
    </div>
  );
}
