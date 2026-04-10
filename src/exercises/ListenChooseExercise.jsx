import { useState, useEffect } from 'react';
import { SpeakerHigh } from '@phosphor-icons/react';
import Geel from '../components/Geel';
import OptionCard from '../components/OptionCard';
import FeedbackBanner from '../components/FeedbackBanner';
import { useData } from '../utils/DataContext';
import { playAudio, getAudioPath } from '../utils/audio';

export default function ListenChooseExercise({ data, onComplete, dark = false, premium = false }) {
  const useDark = premium || dark;
  const [answered, setAnswered] = useState(false);
  const [wrongIndex, setWrongIndex] = useState(null);
  const [bannerPhrase, setBannerPhrase] = useState(null);
  const [bannerType, setBannerType] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const { getRandomPhrase } = useData();
  const [isPlaying, setIsPlaying] = useState(false);

  const audioSrc = data.lessonId ? getAudioPath(data.lessonId, data.prompt) : null;

  const handlePlayAudio = async () => {
    if (isPlaying || !audioSrc) return;
    setIsPlaying(true);
    await playAudio(audioSrc);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (audioSrc) {
      const timer = setTimeout(() => handlePlayAudio(), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTap = (index) => {
    if (answered || bannerVisible) return;
    if (index === data.correctIndex) {
      setAnswered(true);
      setBannerType('correct');
      setBannerPhrase(getRandomPhrase('encouragement'));
      setBannerVisible(true);
    } else {
      setWrongIndex(index);
      setBannerType('wrong');
      setBannerPhrase(getRandomPhrase('feedback'));
      setBannerVisible(true);
    }
  };

  const getCorrectProp = (i) => {
    if (i === data.correctIndex && answered) return true;
    if (i === wrongIndex) return false;
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <Geel size={90} expression={answered ? 'celebrating' : 'happy'} />
      </div>

      <div
        onClick={handlePlayAudio}
        style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
          borderRadius: 16,
          background: premium ? 'rgba(255,255,255,0.12)' : useDark ? '#1E293B' : 'linear-gradient(180deg, #EBF5FF 0%, #D6EBFF 100%)',
          border: premium ? '1.5px solid rgba(255,255,255,0.15)' : useDark ? '1.5px solid #334155' : '1.5px solid #90CAF9',
          borderBottom: premium ? '1.5px solid rgba(255,255,255,0.15)' : useDark ? '1.5px solid #334155' : '3px solid #42A5F5',
          marginBottom: 20, cursor: 'pointer',
          boxShadow: useDark ? 'none' : '0 2px 12px rgba(33,150,243,0.1)',
          backdropFilter: premium ? 'blur(12px)' : 'none',
          transition: 'transform 0.15s',
          transform: isPlaying ? 'scale(0.98)' : 'scale(1)',
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: premium ? 'rgba(255,255,255,0.2)' : useDark ? '#0891B2' : '#1E88E5',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          boxShadow: useDark ? '0 0 12px rgba(34, 211, 238, 0.2)' : '0 2px 8px rgba(30,136,229,0.3)',
          animation: isPlaying ? 'pulse 1s ease-in-out infinite' : 'none',
        }}>
          <SpeakerHigh size={26} weight="fill" color="white" />
        </div>
        <p style={{ fontSize: 18, fontWeight: 800, color: useDark ? '#22D3EE' : '#1565C0', fontFamily: 'Nunito, sans-serif' }}>{data.prompt}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.options.map((opt, i) => (
          <OptionCard key={i} text={opt} number={i + 1} selected={i === data.correctIndex && answered} correct={getCorrectProp(i)} onClick={() => handleTap(i)} disabled={answered || bannerVisible} dark={useDark} premium={premium} />
        ))}
      </div>

      <FeedbackBanner type={bannerType === 'correct' ? 'correct' : 'wrong'} phrase={bannerPhrase} visible={bannerVisible} dark={useDark} premium={premium}
        onContinue={() => { if (bannerType === 'correct') { onComplete(); } else { setWrongIndex(null); setBannerPhrase(null); setBannerType(null); setBannerVisible(false); } }} />
    </div>
  );
}
