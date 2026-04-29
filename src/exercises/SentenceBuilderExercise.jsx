import { useState } from 'react';
import FeedbackBanner from '../components/FeedbackBanner';
import { useData } from '../utils/DataContext';

export default function SentenceBuilderExercise({ data, featureColor, onComplete, practiceMode = false, dark = false }) {
  const { getRandomPhrase } = useData();
  const allWords = [...data.words, ...(data.distractors || [])];
  const [placed, setPlaced] = useState([]);
  const [available, setAvailable] = useState(() =>
    allWords.map((w, i) => ({ text: w, id: i })).sort(() => Math.random() - 0.5)
  );
  const [bannerPhrase, setBannerPhrase] = useState(null);
  const [bannerType, setBannerType] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handlePlace = (piece) => {
    if (isCorrect || bannerVisible) return;
    setPlaced((p) => [...p, piece]);
    setAvailable((a) => a.filter((x) => x.id !== piece.id));
  };

  const handleRemove = (piece) => {
    if (isCorrect || bannerVisible) return;
    setAvailable((a) => [...a, piece]);
    setPlaced((p) => p.filter((x) => x.id !== piece.id));
  };

  const handleCheck = () => {
    const formed = placed.map((p) => p.text).join(' ');
    if (formed === data.correctSentence) {
      setIsCorrect(true);
      setBannerType('correct');
      setBannerPhrase(getRandomPhrase('encouragement'));
      setBannerVisible(true);
    } else {
      if (practiceMode) {
        setIsCorrect(false);
        setBannerType('wrong');
        setBannerPhrase({ text: `Jawaabta saxda: ${data.correctSentence}`, emoji: 'BookOpen' });
        setBannerVisible(true);
      } else {
        setBannerType('wrong');
        setBannerPhrase(getRandomPhrase('feedback'));
        setBannerVisible(true);
      }
    }
  };

  const handleReset = () => {
    setAvailable(allWords.map((w, i) => ({ text: w, id: i })).sort(() => Math.random() - 0.5));
    setPlaced([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Prompt — show somaliFull when present (English-arrangement variant),
          fall back to instruction (Somali-arrangement variant where users
          arrange Somali words to form a Somali sentence). */}
      {(data.somaliFull || data.instruction) && (
        <div style={{
          background: dark ? '#1E293B' : '#FFF8E1',
          border: dark ? '1px solid #334155' : '1px solid #FFE082',
          borderRadius: 12, padding: '10px 14px', marginBottom: 14, textAlign: 'center',
        }}>
          {data.somaliFull && (
            <p style={{ fontSize: 12, color: dark ? '#64748B' : '#999', fontFamily: 'Nunito, sans-serif', margin: 0 }}>Soomaaliga:</p>
          )}
          <p style={{ fontSize: 17, fontWeight: 800, color: dark ? '#F1F5F9' : '#333', fontFamily: 'Nunito, sans-serif', margin: data.somaliFull ? '4px 0 0' : 0 }}>
            {data.somaliFull || data.instruction}
          </p>
        </div>
      )}

      {/* Drop zone */}
      <div style={{
        minHeight: 56, borderRadius: 14, padding: '12px 14px',
        display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
        marginBottom: 14, transition: 'all 0.2s',
        background: dark
          ? (isCorrect ? 'rgba(16, 185, 129, 0.1)' : '#1E293B')
          : (isCorrect ? '#D1FAE5' : '#FAFAFA'),
        border: dark
          ? (isCorrect ? '2px solid #10B981' : placed.length > 0 ? '2px solid #334155' : '2px dashed #334155')
          : (isCorrect ? '2px solid #10B981' : placed.length > 0 ? '2px solid #E0E0E0' : '2px dashed #D0D0D0'),
      }}>
        {placed.length === 0 && (
          <span style={{ fontSize: 13, color: dark ? '#64748B' : '#bbb', fontFamily: 'Nunito, sans-serif', fontStyle: 'italic' }}>
            Halkan ku dhig erayada...
          </span>
        )}
        {placed.map((p) => (
          <button key={p.id} onClick={() => handleRemove(p)} style={{
            padding: '8px 16px', borderRadius: 10,
            background: dark
              ? (isCorrect ? 'rgba(16, 185, 129, 0.2)' : '#0891B2')
              : (isCorrect ? '#A7F3D0' : '#E3F2FD'),
            border: dark
              ? (isCorrect ? '1.5px solid #10B981' : '1.5px solid #0E7490')
              : (isCorrect ? '1.5px solid #A5D6A7' : '1.5px solid #90CAF9'),
            color: dark
              ? (isCorrect ? '#6EE7B7' : 'white')
              : (isCorrect ? '#059669' : '#1565C0'),
            fontSize: 15, fontWeight: 700, fontFamily: 'Nunito, sans-serif',
            cursor: isCorrect ? 'default' : 'pointer',
          }}>{p.text}</button>
        ))}
      </div>

      {/* Available words */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 14, minHeight: 44 }}>
        {available.map((p) => (
          <button key={p.id} onClick={() => handlePlace(p)} style={{
            padding: '10px 18px', borderRadius: 12,
            border: dark ? '1.5px solid #475569' : '2px solid #E0E0E0',
            background: dark ? '#334155' : 'white',
            color: dark ? '#F1F5F9' : '#333',
            fontSize: 15, fontWeight: 700,
            fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            boxShadow: dark ? 'none' : '0 2px 6px rgba(0,0,0,0.06)',
          }}>{p.text}</button>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 12 }}>
        {!isCorrect && (
          <button onClick={handleReset} style={{
            flex: 1, padding: '14px', borderRadius: 14,
            border: dark ? '2px solid #334155' : '2px solid #E0E0E0',
            background: dark ? '#1E293B' : 'white',
            color: dark ? '#94A3B8' : '#666',
            fontSize: 14, fontWeight: 700,
            fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
          }}>DIB U BILOW</button>
        )}
        {placed.length > 0 && !isCorrect && !bannerVisible && (
          <button onClick={handleCheck} style={{
            flex: 2, padding: '14px', borderRadius: 14, border: 'none',
            background: featureColor, color: 'white', fontSize: 14, fontWeight: 800,
            fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            boxShadow: `0 2px 10px ${featureColor}44`,
          }}>HUBI</button>
        )}
      </div>

      <FeedbackBanner type={bannerType === 'correct' ? 'correct' : 'wrong'} phrase={bannerPhrase} visible={bannerVisible} dark={dark}
        onContinue={() => {
          if (bannerType === 'correct') onComplete(true);
          else if (practiceMode) onComplete(false);
          else { handleReset(); setBannerPhrase(null); setBannerType(null); setBannerVisible(false); }
        }} />
    </div>
  );
}
