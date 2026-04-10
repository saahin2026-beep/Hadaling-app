export default function SpeechBubble({ children, color = '#FFFFFF', dark = false, premium = false }) {
  const bgColor = premium ? 'white' : (dark ? '#1E293B' : color);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        background: bgColor,
        borderRadius: 20,
        padding: '16px 20px',
        border: premium ? 'none' : (dark ? '1.5px solid #334155' : '1.5px solid rgba(0,0,0,0.05)'),
        boxShadow: premium ? '0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)' : (dark ? 'none' : '0 2px 0 rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.06)'),
        maxWidth: 260,
      }}>
        {children}
      </div>
      <div style={{
        position: 'absolute',
        bottom: -8,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: `8px solid ${bgColor}`,
        filter: premium ? 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))' : (dark ? 'none' : 'drop-shadow(0 2px 1px rgba(0,0,0,0.04))'),
      }} />
    </div>
  );
}
