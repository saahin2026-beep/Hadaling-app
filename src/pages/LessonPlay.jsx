import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../utils/DataContext';
import { calculateDahabLesson } from '../utils/speedScore';
import { saveChunkStats } from '../utils/dailyMix';
import { shuffleOptions } from '../utils/shuffleOptions';
import PremiumChooseExercise from '../exercises/PremiumChooseExercise';
import FillGapExercise from '../exercises/FillGapExercise';
import OrderExercise from '../exercises/OrderExercise';
import ListenChooseExercise from '../exercises/ListenChooseExercise';
import ScenarioExercise from '../exercises/ScenarioExercise';
import ExerciseLayout from '../components/ExerciseLayout';
import { trackEvent } from '../utils/observability';

export default function LessonPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lessonData } = useData();
  const data = lessonData?.[id];
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseKey, setExerciseKey] = useState(0);
  const [sessionDahab, setSessionDahab] = useState(0);
  const [chunkResults, setChunkResults] = useState([]);

  // Shuffle all exercise options once when lesson loads
  const shuffledExercises = useMemo(() => {
    if (!data) return [];
    return data.exercises.map(ex => shuffleOptions(ex));
  }, [data]);

  useEffect(() => { if (!data) navigate('/home'); }, [data, navigate]);
  useEffect(() => {
    if (data) trackEvent('lesson_started', { lessonId: Number(id), exerciseCount: data.exercises?.length || 0 });
  }, [data, id]);
  if (!data) return null;

  const totalExercises = shuffledExercises.length;
  const exercise = shuffledExercises[currentExercise];
  const enrichedData = { ...exercise, lessonId: Number(id) };

  const handleNext = (wasCorrect = true) => {
    const reward = calculateDahabLesson(wasCorrect);
    if (reward.total > 0) setSessionDahab((prev) => prev + reward.total);
    if (exercise.chunkId) setChunkResults(prev => [...prev, { chunkId: exercise.chunkId, correct: wasCorrect }]);

    if (currentExercise < totalExercises - 1) {
      setCurrentExercise((p) => p + 1);
      setExerciseKey((p) => p + 1);
    } else {
      const finalResults = [...chunkResults, { chunkId: exercise.chunkId, correct: wasCorrect }];
      saveChunkStats(finalResults);
      navigate(`/lesson/${id}/complete`, { state: { dahabEarned: sessionDahab + reward.total } });
    }
  };

  // Choose uses PremiumChooseExercise (has its own ExerciseLayout + QuestionCard + PremiumOptionCard)
  if (exercise.type === 'choose') {
    return (
      <PremiumChooseExercise
        key={exerciseKey}
        data={enrichedData}
        onComplete={handleNext}
        current={currentExercise + 1}
        total={totalExercises}
      />
    );
  }

  // All other types: same white ExerciseLayout, standard light-mode exercise components
  const ExerciseComponent = {
    fillgap: FillGapExercise,
    order: OrderExercise,
    listen: ListenChooseExercise,
    scenario: ScenarioExercise,
  }[exercise.type] || FillGapExercise;

  return (
    <ExerciseLayout
      current={currentExercise + 1}
      total={totalExercises}
      onClose={() => navigate('/home')}
    >
      <p style={{
        fontSize: 15, fontWeight: 600, fontFamily: 'Nunito, sans-serif',
        color: '#333', marginBottom: 14,
      }}>
        {exercise.instruction}
      </p>
      <ExerciseComponent key={exerciseKey} data={enrichedData} onComplete={handleNext} />
    </ExerciseLayout>
  );
}
