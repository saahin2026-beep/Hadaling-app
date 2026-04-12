import { useState } from 'react';
import { SpeakerHigh } from '@phosphor-icons/react';
import { playAudio } from '../utils/audio';

export default function QuestionCard({
  instruction = 'Translate this phrase',
  prompt,
  hasAudio = false,
  audioSrc = null,
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = async () => {
    if (!hasAudio || !audioSrc || isPlaying) return;
    setIsPlaying(true);
    await playAudio(audioSrc);
    setIsPlaying(false);
  };

  return (
    <div style={{ padding: '4px 0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
          background: 'linear-gradient(135deg, rgba(8,145,178,0.1), rgba(34,211,238,0.15))',
          border: '1.5px solid rgba(8,145,178,0.2)', borderRadius: '30px',
          boxShadow: '0 4px 16px rgba(8,145,178,0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
        }}>
          <div style={{
            width: '20px', height: '20px', background: 'linear-gradient(135deg, #0891B2, #0E7490)',
            borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(8,145,178,0.3)',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#0E7490', fontFamily: 'Nunito, sans-serif', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {instruction}
          </span>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
        border: '2px solid rgba(8,145,178,0.15)', borderRadius: '20px', padding: 'clamp(16px, 3vw, 24px)',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(8,145,178,0.1), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
      }}>
        <div style={{ position: 'absolute', top: '12px', left: '12px', width: '24px', height: '24px', borderLeft: '3px solid rgba(8,145,178,0.2)', borderTop: '3px solid rgba(8,145,178,0.2)', borderRadius: '4px 0 0 0' }} />
        <div style={{ position: 'absolute', top: '12px', right: '12px', width: '24px', height: '24px', borderRight: '3px solid rgba(8,145,178,0.2)', borderTop: '3px solid rgba(8,145,178,0.2)', borderRadius: '0 4px 0 0' }} />
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '24px', height: '24px', borderLeft: '3px solid rgba(8,145,178,0.2)', borderBottom: '3px solid rgba(8,145,178,0.2)', borderRadius: '0 0 0 4px' }} />
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '24px', height: '24px', borderRight: '3px solid rgba(8,145,178,0.2)', borderBottom: '3px solid rgba(8,145,178,0.2)', borderRadius: '0 0 4px 0' }} />
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '200px', height: '80px', background: 'radial-gradient(ellipse, rgba(8,145,178,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <p style={{
          fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800,
          background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 50%, #22D3EE 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          margin: 0, textAlign: 'center', lineHeight: 1.2, fontFamily: 'Nunito, sans-serif', position: 'relative',
        }}>
          {prompt}
        </p>

        {hasAudio && audioSrc && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button onClick={handlePlayAudio} disabled={isPlaying} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 28px',
              background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
              border: 'none', borderRadius: '28px', cursor: isPlaying ? 'default' : 'pointer',
              boxShadow: '0 8px 24px rgba(8,145,178,0.35), 0 2px 4px rgba(8,145,178,0.2), inset 0 1px 0 rgba(255,255,255,0.25)',
              opacity: isPlaying ? 0.8 : 1, transform: isPlaying ? 'scale(0.98)' : 'scale(1)', transition: 'all 0.15s ease',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.15), transparent)', pointerEvents: 'none' }} />
              <SpeakerHigh size={22} weight="fill" color="white" style={{ position: 'relative', animation: isPlaying ? 'pulse 1s ease-in-out infinite' : 'none' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'white', fontFamily: 'Nunito, sans-serif', position: 'relative' }}>
                {isPlaying ? 'Playing...' : 'Tap to listen'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
