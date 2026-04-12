import { CheckCircle, XCircle } from '@phosphor-icons/react';

export default function PremiumOptionCard({
  text, number, selected = false, correct = null,
  onClick, disabled = false,
}) {
  const isCorrect = correct === true;
  const isWrong = correct === false;
  const isAnswered = correct !== null;

  const getContainerStyles = () => {
    const base = {
      width: '100%', minHeight: 'clamp(60px, 12vw, 80px)', padding: 'clamp(12px, 2.5vw, 18px) clamp(14px, 3vw, 22px)', borderRadius: 'clamp(10px, 2.5vw, 16px)',
      display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 20px)',
      cursor: disabled ? 'default' : 'pointer', transition: 'all 0.2s ease',
      position: 'relative', overflow: 'hidden', fontFamily: 'Nunito, sans-serif',
      border: '2px solid', outline: 'none',
    };
    if (isCorrect) return { ...base, background: 'linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 100%)', borderColor: '#10B981', boxShadow: '0 0 0 4px rgba(16,185,129,0.1), 0 8px 24px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.8)' };
    if (isWrong) return { ...base, background: 'linear-gradient(180deg, #FEF2F2 0%, #FECACA 100%)', borderColor: '#EF4444', boxShadow: '0 0 0 4px rgba(239,68,68,0.1), 0 8px 24px rgba(239,68,68,0.12), inset 0 1px 0 rgba(255,255,255,0.8)' };
    if (selected) return { ...base, background: 'linear-gradient(180deg, #ECFEFF 0%, #CFFAFE 100%)', borderColor: '#0891B2', boxShadow: '0 0 0 4px rgba(8,145,178,0.1), 0 8px 24px rgba(8,145,178,0.12), inset 0 1px 0 rgba(255,255,255,0.8)' };
    return { ...base, background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)', borderColor: '#E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,1)' };
  };

  const getBadgeStyles = () => {
    const base = { width: 'clamp(38px, 9vw, 50px)', height: 'clamp(38px, 9vw, 50px)', borderRadius: 'clamp(12px, 3vw, 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', position: 'relative', flexShrink: 0 };
    if (isCorrect) return { ...base, background: 'linear-gradient(145deg, #34D399 0%, #10B981 50%, #059669 100%)', boxShadow: '0 6px 16px rgba(16,185,129,0.35), inset 0 1px 0 rgba(255,255,255,0.3)' };
    if (isWrong) return { ...base, background: 'linear-gradient(145deg, #F87171 0%, #EF4444 50%, #DC2626 100%)', boxShadow: '0 6px 16px rgba(239,68,68,0.35), inset 0 1px 0 rgba(255,255,255,0.3)' };
    return { ...base, background: 'linear-gradient(145deg, #0891B2 0%, #0E7490 50%, #064E5E 100%)', boxShadow: '0 6px 16px rgba(8,145,178,0.35), inset 0 1px 0 rgba(255,255,255,0.2)' };
  };

  const getTextColor = () => { if (isCorrect) return '#065F46'; if (isWrong) return '#991B1B'; return '#1E293B'; };

  return (
    <button onClick={onClick} disabled={disabled} style={getContainerStyles()}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: isCorrect ? 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)' : isWrong ? 'linear-gradient(90deg, transparent, rgba(239,68,68,0.3), transparent)' : 'linear-gradient(90deg, transparent, rgba(8,145,178,0.1), transparent)' }} />
      <div style={getBadgeStyles()}>
        <div style={{ position: 'absolute', top: 'clamp(3px, 0.8vw, 6px)', left: 'clamp(3px, 0.8vw, 6px)', width: 'clamp(6px, 1.5vw, 10px)', height: 'clamp(6px, 1.5vw, 10px)', background: 'rgba(255,255,255,0.3)', borderRadius: '50%' }} />
        {isCorrect ? <CheckCircle size={28} weight="fill" color="white" /> : isWrong ? <XCircle size={28} weight="fill" color="white" /> : number}
      </div>
      <span style={{ flex: 1, fontSize: 'clamp(16px, 4.2vw, 20px)', fontWeight: 700, color: getTextColor(), fontFamily: 'Nunito, sans-serif', textAlign: 'left' }}>{text}</span>
      {!isAnswered && (
        <div style={{ marginLeft: 'auto', width: 'clamp(16px, 4vw, 28px)', height: 'clamp(16px, 4vw, 28px)', border: selected ? '2px solid #0891B2' : '2px solid #CBD5E1', borderRadius: '50%', background: selected ? 'linear-gradient(135deg, #0891B2, #0E7490)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s ease' }}>
          {selected && <div style={{ width: 'clamp(6px, 1.5vw, 10px)', height: 'clamp(6px, 1.5vw, 10px)', background: 'white', borderRadius: '50%' }} />}
        </div>
      )}
    </button>
  );
}
