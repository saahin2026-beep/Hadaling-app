import { useState } from 'react';
import { useData } from '../utils/DataContext';
import { getChunkAudioPath } from '../utils/audio';
import ExerciseLayout from '../components/ExerciseLayout';
import QuestionCard from '../components/QuestionCard';
import PremiumOptionCard from '../components/PremiumOptionCard';
import FeedbackBanner from '../components/FeedbackBanner';

export default function PremiumChooseExercise({
  data, onComplete, current = 1, total = 10, hearts = 5,
}) {
  const { getRandomPhrase } = useData();
  const [answered, setAnswered] = useState(false);
  const [wrongIndex, setWrongIndex] = useState(null);
  const [bannerPhrase, setBannerPhrase] = useState(null);
  const [bannerType, setBannerType] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);

  const hasAudio = Boolean(data.chunkId && data.lessonId && data.direction !== 'so-en');
  const audioSrc = hasAudio ? getChunkAudioPath(data.lessonId, data.chunkId) : null;

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
    <ExerciseLayout current={current} total={total} hearts={hearts}>
      <QuestionCard
        instruction={data.instruction || 'Translate this phrase'}
        prompt={data.prompt}
        hasAudio={hasAudio}
        audioSrc={audioSrc}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
        {data.options.map((option, index) => (
          <PremiumOptionCard
            key={index}
            number={index + 1}
            text={option}
            selected={index === data.correctIndex && answered}
            correct={getCorrectProp(index)}
            onClick={() => handleTap(index)}
            disabled={answered || bannerVisible}
          />
        ))}
      </div>

      <FeedbackBanner
        type={bannerType === 'correct' ? 'correct' : 'wrong'}
        phrase={bannerPhrase}
        visible={bannerVisible}
        autoAdvance={bannerType === 'correct'}
        onContinue={() => {
          if (bannerType === 'correct') onComplete(true);
          else { setWrongIndex(null); setBannerPhrase(null); setBannerType(null); setBannerVisible(false); }
        }}
      />
    </ExerciseLayout>
  );
}
