import { useState, useEffect } from 'react';
import { useData } from '../utils/DataContext';
import Geel from '../components/Geel';
import SpeechBubble from '../components/SpeechBubble';
import OptionCard from '../components/OptionCard';
import FeedbackBanner from '../components/FeedbackBanner';

export default function FillGapExercise({ data, onComplete, practiceMode = false, dark = false, premium = false }) {
  const useDark = premium || dark;
  const { getRandomPhrase } = useData();
  const [answered, setAnswered] = useState(false);
  const [wrongIndex, setWrongIndex] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [bannerPhrase, setBannerPhrase] = useState(null);
  const [bannerType, setBannerType] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [filledWord, setFilledWord] = useState(null);
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
      setFilledWord(data.options[data.correctIndex]);
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
        setFilledWord(data.options[data.correctIndex]);
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
        <Geel size={90} expression={answered ? 'celebrating' : 'happy'} />
        <div style={{ marginTop: 8 }}>
          <SpeechBubble dark={useDark} premium={premium} color={!useDark && (answered || showCorrect) ? '#D1FAE5' : '#FFFFFF'}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'baseline' }}>
              {data.sentence.map((word, i) => (
                <span key={i} style={{
                  fontSize: 18, fontWeight: i === data.blankIndex ? 800 : 700,
                  color: useDark
                    ? (i === data.blankIndex ? (filledWord ? '#6EE7B7' : '#22D3EE') : '#F1F5F9')
                    : (i === data.blankIndex ? (filledWord ? '#059669' : '#10B981') : '#333'),
                  fontFamily: 'Nunito, sans-serif',
                  borderBottom: i === data.blankIndex && !filledWord
                    ? (useDark ? '2px dashed #22D3EE' : '2px dashed #10B981')
                    : 'none',
                  padding: i === data.blankIndex ? '0 4px' : 0,
                }}>
                  {i === data.blankIndex ? (filledWord || '___') : word}
                </span>
              ))}
            </div>
          </SpeechBubble>
        </div>
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
            else { setWrongIndex(null); setFilledWord(null); setBannerPhrase(null); setBannerType(null); setBannerVisible(false); }
          }}
        />
      )}
    </div>
  );
}
