import { useState, useEffect } from 'react';
import { useData } from '../utils/DataContext';
import { ChatCircle } from '@phosphor-icons/react';
import OptionCard from '../components/OptionCard';
import FeedbackBanner from '../components/FeedbackBanner';

export default function ScenarioExercise({ data, onComplete, practiceMode = false, dark = false, premium = false }) {
  const useDark = premium || dark;
  const { getRandomPhrase } = useData();
  const [answered, setAnswered] = useState(false);
  const [wrongIndex, setWrongIndex] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [bannerPhrase, setBannerPhrase] = useState(null);
  const [bannerType, setBannerType] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);

  useEffect(() => {
    if (!autoAdvance || practiceMode) return;
    const timer = setTimeout(() => {
      onComplete(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [autoAdvance, practiceMode]);

  const handleTap = (index) => {
    if (answered || bannerVisible || showCorrect) return;

    if (index === data.correctIndex) {
      setAnswered(true);
      if (practiceMode) {
        setShowCorrect(true);
        setTimeout(() => onComplete(true), 1000);
      } else {
        setBannerType('correct');
        setBannerPhrase(getRandomPhrase('encouragement'));
        setBannerVisible(true);
        setAutoAdvance(true);
      }
    } else {
      if (practiceMode) {
        setWrongIndex(index);
        setShowCorrect(true);
        setTimeout(() => onComplete(false), 1500);
      } else {
        setWrongIndex(index);
        setBannerType('wrong');
        setBannerPhrase(getRandomPhrase('feedback'));
        setBannerVisible(true);
      }
    }
  };

  const getCorrectProp = (i) => {
    if (showCorrect && i === data.correctIndex) return true;
    if (i === data.correctIndex && answered && !practiceMode) return true;
    if (i === wrongIndex) return false;
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Scenario card */}
      <div style={{
        background: premium ? 'rgba(255,255,255,0.12)' : useDark ? '#1E293B' : 'linear-gradient(180deg, #FFF9E8 0%, #FFF3CC 100%)',
        border: premium ? '1.5px solid rgba(255,255,255,0.15)' : useDark ? '1.5px solid #334155' : '1.5px solid #FFDF80',
        borderRadius: 16,
        borderBottom: premium ? '1.5px solid rgba(255,255,255,0.15)' : useDark ? '1.5px solid #334155' : '3px solid #FFCA28',
        boxShadow: useDark ? 'none' : '0 2px 12px rgba(255,193,7,0.1)',
        backdropFilter: premium ? 'blur(12px)' : 'none',
        padding: '16px 18px', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <ChatCircle size={18} weight="fill" color="#F59E0B" />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#F59E0B', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            XAALAD
          </span>
        </div>
        <p style={{ fontSize: 14, color: premium ? 'white' : (useDark ? '#F1F5F9' : '#333'), fontFamily: 'Nunito, sans-serif', lineHeight: 1.6 }}>
          {data.scenario}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.options.map((opt, i) => (
          <OptionCard
            key={i}
            text={opt}
            number={i + 1}
            selected={i === data.correctIndex && (answered || showCorrect)}
            correct={getCorrectProp(i)}
            onClick={() => handleTap(i)}
            disabled={answered || bannerVisible || showCorrect}
            dark={useDark}
            premium={premium}
          />
        ))}
      </div>

      {practiceMode && showCorrect && wrongIndex !== null && (
        <div style={{
          marginTop: 12, padding: '12px 16px', borderRadius: 12, textAlign: 'center',
          background: useDark ? 'rgba(16, 185, 129, 0.1)' : '#D1FAE5',
          border: useDark ? '1px solid rgba(16, 185, 129, 0.2)' : 'none',
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: useDark ? '#6EE7B7' : '#059669', fontFamily: 'Nunito, sans-serif' }}>
            Jawaabta saxda: {data.options[data.correctIndex]}
          </p>
        </div>
      )}

      {!practiceMode && (
        <FeedbackBanner
          type={bannerType === 'correct' ? 'correct' : 'wrong'}
          phrase={bannerPhrase}
          visible={bannerVisible}
          dark={useDark}
          premium={premium}
          autoAdvance={bannerType === 'correct'}
          onContinue={() => {
            if (bannerType === 'correct') onComplete(true);
            else { setWrongIndex(null); setBannerPhrase(null); setBannerType(null); setBannerVisible(false); }
          }}
        />
      )}
    </div>
  );
}
