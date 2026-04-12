import { X } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export default function ExerciseLayout({
  children,
  current,
  total,
  hearts = 5,
  onClose,
  showProgress = true,
}) {
  const navigate = useNavigate();
  const handleClose = () => { if (onClose) onClose(); else navigate(-1); };
  const progressPercent = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="page-fixed" style={{
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
    }}>
      <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '250px', background: 'radial-gradient(ellipse, rgba(8,145,178,0.12) 0%, rgba(8,145,178,0.04) 40%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '200px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '150px', left: '-40px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(8,145,178,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(8,145,178,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

      {showProgress && (
        <div style={{ padding: '12px 16px 12px', position: 'relative', zIndex: 2, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={handleClose} style={{
              width: '44px', height: '44px', background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(8,145,178,0.1)', borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
            }}>
              <X size={20} weight="bold" color="#64748B" />
            </button>

            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{
                height: '14px', background: 'linear-gradient(180deg, #E2E8F0, #CBD5E1)',
                borderRadius: '7px', overflow: 'hidden',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.8)',
              }}>
                <div style={{
                  width: `${progressPercent}%`, height: '100%',
                  background: 'linear-gradient(180deg, #22D3EE 0%, #0891B2 50%, #0E7490 100%)',
                  borderRadius: '7px', position: 'relative',
                  boxShadow: '0 0 12px rgba(8,145,178,0.4), inset 0 1px 0 rgba(255,255,255,0.4)',
                  transition: 'width 0.3s ease',
                }}>
                  <div style={{ position: 'absolute', top: '2px', left: '4px', right: '4px', height: '4px', background: 'linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))', borderRadius: '2px' }} />
                </div>
              </div>
              <div style={{
                position: 'absolute', top: '50%', right: '-8px', transform: 'translateY(-50%)',
                width: '28px', height: '28px', background: 'linear-gradient(135deg, #0891B2, #0E7490)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(8,145,178,0.4), 0 0 0 3px white',
              }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{current}</span>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
              background: 'linear-gradient(180deg, #FFFFFF, #FEF2F2)',
              border: '1.5px solid rgba(239,68,68,0.2)', borderRadius: '24px',
              boxShadow: '0 4px 12px rgba(239,68,68,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <defs><linearGradient id="heartGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#F87171" /><stop offset="100%" stopColor="#DC2626" /></linearGradient></defs>
                <path d="M10 17s-6.5-4-6.5-8.5A4 4 0 0110 5a4 4 0 016.5 3.5c0 4.5-6.5 8.5-6.5 8.5z" fill="url(#heartGradient)" />
              </svg>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#DC2626', fontFamily: 'Nunito, sans-serif' }}>{hearts}</span>
            </div>
          </div>
        </div>
      )}

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 2,
        padding: '0 20px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        minHeight: 0,
      }}>
        {children}
      </div>
    </div>
  );
}
