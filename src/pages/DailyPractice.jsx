import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fire, Confetti as ConfettiIcon, CurrencyCircleDollar, Timer } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { calculateDahabTimed } from '../utils/speedScore';
import { generateDailyMix, saveChunkStats } from '../utils/dailyMix';
import { shuffleOptions } from '../utils/shuffleOptions';
import SpeedBonusPopup from '../components/SpeedBonusPopup';
import { useLanguage } from '../utils/useLanguage';
import ChooseExercise from '../exercises/ChooseExercise';
import FillGapExercise from '../exercises/FillGapExercise';
import OrderExercise from '../exercises/OrderExercise';
import ListenChooseExercise from '../exercises/ListenChooseExercise';
import ScenarioExercise from '../exercises/ScenarioExercise';
import Geel from '../components/Geel';
import Confetti from '../components/Confetti';
import ExerciseLayout from '../components/ExerciseLayout';

export default function DailyPractice() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [dahabResult, setDahabResult] = useState(null);
  const [showDahabAnimation, setShowDahabAnimation] = useState(false);
  const [sessionDahab, setSessionDahab] = useState(0);
  const [lastReward, setLastReward] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [chunkResults, setChunkResults] = useState([]);
  const [noLessons, setNoLessons] = useState(false);
  const exerciseStartRef = useRef(Date.now());
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    const state = storage.get();
    const today = new Date().toISOString().split('T')[0];

    if (state.dailyMix?.date === today && state.dailyMix?.completed) {
      setDahabResult({ dahabEarned: state.dailyMix.dahabEarned || 0 });
      setCompleted(true);
      return;
    }

    if (state.dailyMix?.date === today && state.dailyMix?.exercises?.length > 0) {
      setExercises(state.dailyMix.exercises);
      setCurrentIndex(state.dailyMix.progress || 0);
      setCorrectCount(state.dailyMix.correctCount || 0);
      return;
    }

    const mix = generateDailyMix().map(ex => shuffleOptions(ex));
    if (mix.length === 0) { setNoLessons(true); return; }

    storage.update({ dailyMix: { date: today, progress: 0, completed: false, exercises: mix, correctCount: 0 } });
    setExercises(mix);
  }, []);

  useEffect(() => {
    if (exercises.length === 0) return;
    exerciseStartRef.current = Date.now();
    timerIntervalRef.current = setInterval(() => setElapsed(Date.now() - exerciseStartRef.current), 100);
    return () => clearInterval(timerIntervalRef.current);
  }, [exercises.length]);

  const handleExerciseComplete = (wasCorrect) => {
    const responseTime = Date.now() - exerciseStartRef.current;
    const reward = calculateDahabTimed(responseTime, wasCorrect);
    const exercise = exercises[currentIndex];

    if (exercise.chunkId) setChunkResults(prev => [...prev, { chunkId: exercise.chunkId, correct: wasCorrect }]);
    if (reward.total > 0) { setLastReward(reward); setSessionDahab((prev) => prev + reward.total); setTimeout(() => setLastReward(null), 1500); }

    const newCorrect = wasCorrect ? correctCount + 1 : correctCount;
    setCorrectCount(newCorrect);
    const nextIndex = currentIndex + 1;

    storage.update({ dailyMix: { ...storage.get().dailyMix, progress: nextIndex, correctCount: newCorrect } });

    if (nextIndex >= exercises.length) {
      clearInterval(timerIntervalRef.current);
      const finalResults = [...chunkResults];
      if (exercise.chunkId) finalResults.push({ chunkId: exercise.chunkId, correct: wasCorrect });
      saveChunkStats(finalResults);

      const totalDahab = sessionDahab + reward.total;
      const result = storage.completeDailyPractice(newCorrect);
      storage.update({ dahab: (storage.get().dahab || 0) + totalDahab, dailyMix: { ...storage.get().dailyMix, completed: true, dahabEarned: totalDahab } });

      setDahabResult({ ...result, dahabEarned: totalDahab });
      setShowDahabAnimation(true);
      setTimeout(() => { setShowDahabAnimation(false); setCompleted(true); }, 2000);
    } else {
      setCurrentIndex(nextIndex);
      exerciseStartRef.current = Date.now();
      setElapsed(0);
    }
  };

  // No lessons completed
  if (noLessons) {
    return (
      <div style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
        minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <Geel size={100} />
        <h2 style={{ color: '#1E293B', fontFamily: 'Nunito, sans-serif', fontSize: 20, fontWeight: 800, marginTop: 20, textAlign: 'center' }}>
          {lang === 'en' ? 'Complete a lesson first!' : 'Marka hore cashir dhammee!'}
        </h2>
        <p style={{ color: '#64748B', fontFamily: 'Nunito, sans-serif', fontSize: 14, marginTop: 8, textAlign: 'center' }}>
          {lang === 'en' ? 'Daily Mix uses words from your completed lessons' : 'Daily Mix wuxuu isticmaalaa erayada casharadaada'}
        </p>
        <button onClick={() => navigate('/home')} style={{
          marginTop: 24, padding: '14px 32px', borderRadius: 14, border: 'none',
          background: 'linear-gradient(145deg, #0891B2 0%, #0E7490 50%, #064E5E 100%)',
          color: 'white', fontSize: 15, fontWeight: 800, fontFamily: 'Nunito, sans-serif',
          cursor: 'pointer', boxShadow: '0 8px 24px rgba(8,145,178,0.35)',
        }}>
          {lang === 'en' ? 'START A LESSON' : 'BILOW CASHIR'}
        </button>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>Loading...</p>
      </div>
    );
  }

  const state = storage.get();
  const dailyStreak = state.dailyStreak || 0;

  // Dahab animation
  if (showDahabAnimation && dahabResult) {
    const isJackpot = dahabResult.dahabTier === 'jackpot';
    return (
      <div style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
        minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {isJackpot && <Confetti />}
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: isJackpot ? 'linear-gradient(135deg, #F59E0B, #FBBF24)' : 'linear-gradient(180deg, #FFFFFF, #FFFBEB)',
          border: isJackpot ? 'none' : '2px solid rgba(245,158,11,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isJackpot ? '0 0 40px rgba(245,158,11,0.6)' : '0 8px 24px rgba(245,158,11,0.2)',
          animation: 'pop-in 0.4s ease',
        }}>
          <CurrencyCircleDollar size={48} weight="fill" color={isJackpot ? 'white' : '#F59E0B'} />
        </div>
        <p style={{ fontSize: isJackpot ? 48 : 36, fontWeight: 900, color: '#D97706', fontFamily: 'Nunito, sans-serif', marginTop: 20, animation: 'pop-in 0.4s ease 0.2s both' }}>
          +{dahabResult.dahabEarned}
        </p>
        <p style={{ fontSize: 16, color: '#64748B', fontFamily: 'Nunito, sans-serif', animation: 'fade-in 0.3s ease 0.4s both' }}>
          {isJackpot ? 'JACKPOT!' : 'Dahab'}
        </p>
      </div>
    );
  }

  // Completion screen
  if (completed) {
    return (
      <div style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
        minHeight: '100dvh', position: 'relative', overflow: 'hidden',
      }}>
        <Confetti />
        <div style={{ padding: '60px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <Geel size={110} expression="celebrating" circular style={{
            background: 'linear-gradient(180deg, #FDE68A 0%, #FCD34D 30%, #F59E0B 70%, #D97706 100%)',
            boxShadow: '0 12px 40px rgba(245,158,11,0.4), 0 0 0 4px rgba(255,255,255,0.9), 0 0 0 8px rgba(245,158,11,0.2)',
          }} />

          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 20, textAlign: 'center' }}>
            {lang === 'en' ? 'Daily Complete!' : 'Maanta Waa La Dhammeeystay!'} <ConfettiIcon size={24} weight="fill" color="#FFC107" style={{ display: 'inline', verticalAlign: 'middle' }} />
          </h1>
          <p style={{ fontSize: 15, color: '#64748B', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 8 }}>
            {lang === 'en' ? 'Come back tomorrow to keep your streak!' : 'Berri soo noqo si aad u sii waddid!'}
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, width: '100%' }}>
            <div style={{ flex: 1, background: 'linear-gradient(180deg, #FFFFFF, #ECFDF5)', border: '1.5px solid rgba(16,185,129,0.2)', borderRadius: 18, padding: '16px 10px', textAlign: 'center', boxShadow: '0 4px 16px rgba(16,185,129,0.1)' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#059669', fontFamily: 'Nunito, sans-serif' }}>{correctCount}/{exercises.length}</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#10B981', fontFamily: 'Nunito, sans-serif', marginTop: 2, textTransform: 'uppercase' }}>{lang === 'en' ? 'Correct' : 'Sax'}</p>
            </div>
            <div style={{ flex: 1, background: 'linear-gradient(180deg, #FFFFFF, #ECFEFF)', border: '1.5px solid rgba(8,145,178,0.2)', borderRadius: 18, padding: '16px 10px', textAlign: 'center', boxShadow: '0 4px 16px rgba(8,145,178,0.1)' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#0E7490', fontFamily: 'Nunito, sans-serif' }}>+{correctCount * 10}</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#0891B2', fontFamily: 'Nunito, sans-serif', marginTop: 2, textTransform: 'uppercase' }}>XP</p>
            </div>
            <div style={{
              flex: 1, borderRadius: 18, padding: '16px 10px', textAlign: 'center',
              background: dahabResult?.dahabTier === 'jackpot' ? 'linear-gradient(135deg, #F59E0B, #FBBF24)' : 'linear-gradient(180deg, #FFFFFF, #FFFBEB)',
              border: dahabResult?.dahabTier === 'jackpot' ? 'none' : '1.5px solid rgba(245,158,11,0.2)',
              boxShadow: '0 4px 16px rgba(245,158,11,0.1)',
            }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: dahabResult?.dahabTier === 'jackpot' ? 'white' : '#D97706', fontFamily: 'Nunito, sans-serif' }}>+{dahabResult?.dahabEarned || 0}</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: dahabResult?.dahabTier === 'jackpot' ? 'rgba(255,255,255,0.8)' : '#F59E0B', fontFamily: 'Nunito, sans-serif', marginTop: 2, textTransform: 'uppercase' }}>Dahab</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, background: 'linear-gradient(180deg, #FFFFFF, #FFF7ED)', border: '1.5px solid rgba(249,115,22,0.2)', padding: '12px 20px', borderRadius: 14, boxShadow: '0 4px 12px rgba(249,115,22,0.1)' }}>
            <Fire size={24} weight="fill" color="#EA580C" />
            <span style={{ fontSize: 18, fontWeight: 800, color: '#EA580C', fontFamily: 'Nunito, sans-serif' }}>{dailyStreak}</span>
            <span style={{ fontSize: 14, color: '#64748B', fontFamily: 'Nunito, sans-serif', marginLeft: 4 }}>
              {lang === 'en' ? 'day streak!' : 'maalmood oo isku xigta!'}
            </span>
          </div>

          <div style={{ height: 24 }} />
          <button onClick={() => navigate('/progress')} style={{
            width: '100%', height: '60px', background: 'linear-gradient(145deg, #0891B2 0%, #0E7490 50%, #064E5E 100%)',
            border: 'none', borderRadius: '18px', fontSize: '18px', fontWeight: 800, color: 'white',
            fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            boxShadow: '0 8px 28px rgba(8,145,178,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}>
            {lang === 'en' ? 'BACK TO PRACTICE' : 'KU NOQO XIRFADAHA'}
          </button>
        </div>
      </div>
    );
  }

  // Exercise screen
  const exercise = exercises[currentIndex];

  const renderExercise = () => {
    const baseProps = {
      data: { ...exercise, lessonId: exercise.lessonId },
      onComplete: handleExerciseComplete,
      practiceMode: true,
    };
    switch (exercise.type) {
      case 'choose': return <ChooseExercise key={currentIndex} {...baseProps} />;
      case 'fillgap': return <FillGapExercise key={currentIndex} {...baseProps} />;
      case 'order': return <OrderExercise key={currentIndex} {...baseProps} />;
      case 'listen': return <ListenChooseExercise key={currentIndex} {...baseProps} />;
      case 'scenario': return <ScenarioExercise key={currentIndex} {...baseProps} />;
      default: return <ChooseExercise key={currentIndex} {...baseProps} />;
    }
  };

  return (
    <ExerciseLayout
      current={currentIndex + 1}
      total={exercises.length}
      onClose={() => navigate('/progress')}
    >
      {/* Timer + Dahab row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 20,
          background: 'rgba(8,145,178,0.08)', border: '1px solid rgba(8,145,178,0.15)',
        }}>
          <Timer size={14} weight="fill" color="#0891B2" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', fontFamily: 'Nunito, sans-serif' }}>
            {(elapsed / 1000).toFixed(1)}s
          </span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 20,
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
        }}>
          <CurrencyCircleDollar size={16} weight="fill" color="#F59E0B" />
          <span style={{ fontSize: 14, fontWeight: 800, color: '#D97706', fontFamily: 'Nunito, sans-serif' }}>{sessionDahab}</span>
        </div>
      </div>

      {/* Speed bonus popup */}
      {lastReward && lastReward.total > 0 && (
        <SpeedBonusPopup dahab={lastReward.total} label={lastReward.label} color={lastReward.color} />
      )}

      <p style={{ fontSize: 15, fontWeight: 600, fontFamily: 'Nunito, sans-serif', color: '#333', marginBottom: 14 }}>
        {exercise.instruction}
      </p>

      {renderExercise()}
    </ExerciseLayout>
  );
}
