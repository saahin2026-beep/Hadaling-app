import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Fire, Confetti as ConfettiIcon, CurrencyCircleDollar, Timer } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { calculateDahabTimed } from '../utils/speedScore';
import { generateDailyMix, saveChunkStats } from '../utils/dailyMix';
import SpeedBonusPopup from '../components/SpeedBonusPopup';
import { useLanguage } from '../utils/useLanguage';
import ChooseExercise from '../exercises/ChooseExercise';
import FillGapExercise from '../exercises/FillGapExercise';
import OrderExercise from '../exercises/OrderExercise';
import ListenChooseExercise from '../exercises/ListenChooseExercise';
import ScenarioExercise from '../exercises/ScenarioExercise';
import Geel from '../components/Geel';
import Confetti from '../components/Confetti';
import PrimaryButton from '../components/PrimaryButton';

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

    // Check if already completed today
    if (state.dailyMix?.date === today && state.dailyMix?.completed) {
      setDahabResult({ dahabEarned: state.dailyMix.dahabEarned || 0 });
      setCompleted(true);
      return;
    }

    // Check for in-progress session
    if (state.dailyMix?.date === today && state.dailyMix?.exercises?.length > 0) {
      setExercises(state.dailyMix.exercises);
      setCurrentIndex(state.dailyMix.progress || 0);
      setCorrectCount(state.dailyMix.correctCount || 0);
      return;
    }

    // Generate new daily mix from completed lessons
    const mix = generateDailyMix();
    if (mix.length === 0) {
      setNoLessons(true);
      return;
    }

    storage.update({
      dailyMix: {
        date: today,
        progress: 0,
        completed: false,
        exercises: mix,
        correctCount: 0,
      },
    });
    setExercises(mix);
  }, []);

  useEffect(() => {
    if (exercises.length === 0) return;
    exerciseStartRef.current = Date.now();
    timerIntervalRef.current = setInterval(() => {
      setElapsed(Date.now() - exerciseStartRef.current);
    }, 100);
    return () => clearInterval(timerIntervalRef.current);
  }, [exercises.length]);

  const getTimerColor = () => {
    if (elapsed < 2000) return '#A78BFA';
    if (elapsed < 4000) return '#FBBF24';
    if (elapsed < 6000) return '#6EE7B7';
    if (elapsed < 8000) return '#22D3EE';
    return 'rgba(255,255,255,0.5)';
  };

  const handleExerciseComplete = (wasCorrect) => {
    const responseTime = Date.now() - exerciseStartRef.current;
    const reward = calculateDahabTimed(responseTime, wasCorrect);
    const exercise = exercises[currentIndex];

    if (exercise.chunkId) {
      setChunkResults(prev => [...prev, { chunkId: exercise.chunkId, correct: wasCorrect }]);
    }

    if (reward.total > 0) {
      setLastReward(reward);
      setSessionDahab((prev) => prev + reward.total);
      setTimeout(() => setLastReward(null), 1500);
    }

    const newCorrect = wasCorrect ? correctCount + 1 : correctCount;
    setCorrectCount(newCorrect);
    const nextIndex = currentIndex + 1;

    storage.update({
      dailyMix: {
        ...storage.get().dailyMix,
        progress: nextIndex,
        correctCount: newCorrect,
      },
    });

    if (nextIndex >= exercises.length) {
      clearInterval(timerIntervalRef.current);

      const finalResults = [...chunkResults];
      if (exercise.chunkId) finalResults.push({ chunkId: exercise.chunkId, correct: wasCorrect });
      saveChunkStats(finalResults);

      const totalDahab = sessionDahab + reward.total;
      const result = storage.completeDailyPractice(newCorrect);

      storage.update({
        dahab: (storage.get().dahab || 0) + totalDahab,
        dailyMix: {
          ...storage.get().dailyMix,
          completed: true,
          dahabEarned: totalDahab,
        },
      });

      setDahabResult({ ...result, dahabEarned: totalDahab });
      setShowDahabAnimation(true);
      setTimeout(() => {
        setShowDahabAnimation(false);
        setCompleted(true);
      }, 2000);
    } else {
      setCurrentIndex(nextIndex);
      exerciseStartRef.current = Date.now();
      setElapsed(0);
    }
  };

  // No lessons completed yet
  if (noLessons) {
    return (
      <div style={{
        background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
        minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <Geel size={100} />
        <h2 style={{ color: 'white', fontFamily: 'Nunito, sans-serif', fontSize: 20, fontWeight: 800, marginTop: 20, textAlign: 'center' }}>
          {lang === 'en' ? 'Complete a lesson first!' : 'Marka hore cashir dhammee!'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', fontSize: 14, marginTop: 8, textAlign: 'center' }}>
          {lang === 'en' ? 'Daily Mix uses words from your completed lessons' : 'Daily Mix wuxuu isticmaalaa erayada casharadaada'}
        </p>
        <button onClick={() => navigate('/home')} style={{
          marginTop: 24, padding: '14px 32px', borderRadius: 14, border: 'none',
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          color: 'white', fontSize: 15, fontWeight: 800, fontFamily: 'Nunito, sans-serif',
          cursor: 'pointer', boxShadow: '0 8px 24px rgba(245,158,11,0.35)',
        }}>
          {lang === 'en' ? 'START A LESSON' : 'BILOW CASHIR'}
        </button>
      </div>
    );
  }

  // Loading
  if (exercises.length === 0) {
    return (
      <div style={{ background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif' }}>Loading...</p>
      </div>
    );
  }

  const state = storage.get();
  const dailyStreak = state.dailyStreak || 0;

  // Dahab reward animation
  if (showDahabAnimation && dahabResult) {
    const isJackpot = dahabResult.dahabTier === 'jackpot';
    return (
      <div style={{
        background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
        minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {isJackpot && <Confetti />}
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: isJackpot ? 'linear-gradient(135deg, #F59E0B, #FBBF24)' : 'rgba(255,255,255,0.1)',
          border: isJackpot ? 'none' : '2px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isJackpot ? '0 0 40px rgba(245,158,11,0.6)' : '0 0 20px rgba(245,158,11,0.3)',
          animation: 'pop-in 0.4s ease',
        }}>
          <CurrencyCircleDollar size={48} weight="fill" color={isJackpot ? 'white' : '#F59E0B'} />
        </div>
        <p style={{
          fontSize: isJackpot ? 48 : 36, fontWeight: 900, color: '#F59E0B',
          fontFamily: 'Nunito, sans-serif', marginTop: 20,
          animation: 'pop-in 0.4s ease 0.2s both',
          textShadow: isJackpot ? '0 0 20px rgba(245,158,11,0.5)' : 'none',
        }}>
          +{dahabResult.dahabEarned}
        </p>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', animation: 'fade-in 0.3s ease 0.4s both' }}>
          {isJackpot ? 'JACKPOT!' : 'Dahab'}
        </p>
      </div>
    );
  }

  // Completion screen
  if (completed) {
    return (
      <div style={{
        background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
        minHeight: '100dvh', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <Confetti />
        <div style={{ padding: '60px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 110, height: 110, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            border: '2px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Geel size={75} expression="celebrating" />
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', marginTop: 20, textAlign: 'center' }}>
            {lang === 'en' ? 'Daily Complete!' : 'Maanta Waa La Dhammeeystay!'} <ConfettiIcon size={24} weight="fill" color="#FFC107" style={{ display: 'inline', verticalAlign: 'middle' }} />
          </h1>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 8 }}>
            {lang === 'en' ? 'Come back tomorrow to keep your streak!' : 'Berri soo noqo si aad u sii waddid!'}
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, width: '100%' }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '16px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#6EE7B7', fontFamily: 'Nunito, sans-serif' }}>{correctCount}/{exercises.length}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>{lang === 'en' ? 'Correct' : 'Sax'}</p>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '16px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#FBBF24', fontFamily: 'Nunito, sans-serif' }}>+{correctCount * 10}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>XP</p>
            </div>
            <div style={{
              flex: 1, borderRadius: 14, padding: '16px 10px', textAlign: 'center',
              background: dahabResult?.dahabTier === 'jackpot' ? 'linear-gradient(135deg, #F59E0B, #FBBF24)' : 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              border: dahabResult?.dahabTier === 'jackpot' ? 'none' : '1px solid rgba(255,255,255,0.15)',
            }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: dahabResult?.dahabTier === 'jackpot' ? 'white' : '#F59E0B', fontFamily: 'Nunito, sans-serif' }}>
                +{dahabResult?.dahabEarned || 0}
              </p>
              <p style={{ fontSize: 11, color: dahabResult?.dahabTier === 'jackpot' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>Dahab</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', padding: '12px 20px', borderRadius: 12 }}>
            <Fire size={24} weight="fill" color="#FF7043" />
            <span style={{ fontSize: 18, fontWeight: 800, color: '#FF7043', fontFamily: 'Nunito, sans-serif' }}>{dailyStreak}</span>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', marginLeft: 4 }}>
              {lang === 'en' ? 'day streak!' : 'maalmood oo isku xigta!'}
            </span>
          </div>

          <div style={{ height: 24 }} />
          <button onClick={() => navigate('/progress')} style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            fontSize: 16, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif',
            cursor: 'pointer', boxShadow: '0 8px 24px rgba(245,158,11,0.35)',
            textTransform: 'uppercase', letterSpacing: 1,
          }}>
            {lang === 'en' ? 'BACK TO PRACTICE' : 'KU NOQO XIRFADAHA'}
          </button>
        </div>
      </div>
    );
  }

  // Exercise screen
  const exercise = exercises[currentIndex];
  const progress = ((currentIndex + 1) / exercises.length) * 100;

  const renderExercise = () => {
    const baseProps = {
      data: { ...exercise, lessonId: exercise.lessonId },
      onComplete: handleExerciseComplete,
      practiceMode: true,
      premium: true,
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
    <div style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient lights */}
      <div style={{ position: 'absolute', top: '-30px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '-50px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 2 }}>
        <button onClick={() => navigate('/progress')} style={{
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

        {/* Timer */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 13, fontWeight: 700, fontFamily: 'Nunito, sans-serif',
          color: getTimerColor(), transition: 'color 0.3s ease',
        }}>
          <Timer size={14} weight="fill" />
          {(elapsed / 1000).toFixed(1)}s
        </div>

        {/* Dahab */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(245,158,11,0.15)', padding: '6px 12px', borderRadius: 10,
          border: '1px solid rgba(245,158,11,0.25)',
        }}>
          <CurrencyCircleDollar size={16} weight="fill" color="#F59E0B" />
          <span style={{ fontSize: 14, fontWeight: 800, fontFamily: 'Nunito, sans-serif', color: '#FBBF24', minWidth: 20, textAlign: 'right' }}>
            {sessionDahab}
          </span>
        </div>
      </div>

      {/* Exercise counter */}
      <div style={{ padding: '4px 20px 8px', position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: 16,
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif' }}>
            {currentIndex + 1} / {exercises.length}
          </span>
        </div>
      </div>

      {/* Speed bonus popup */}
      {lastReward && lastReward.total > 0 && (
        <SpeedBonusPopup dahab={lastReward.total} label={lastReward.label} color={lastReward.color} />
      )}

      <div style={{ padding: '0 20px 8px', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif', textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
          {exercise.instruction}
        </p>
      </div>

      <div style={{ flex: 1, padding: '0 20px 120px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        {renderExercise()}
      </div>
    </div>
  );
}
