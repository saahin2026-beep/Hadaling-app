export default function ExerciseWrapper({ children, instruction, dark = false, premium = false }) {
  return (
    <div className="animate-slide-in" style={{
      display: 'flex', flexDirection: 'column',
      padding: '20px 20px 140px 20px', flex: 1,
      position: 'relative', zIndex: 1,
    }}>
      <p style={{
        fontSize: premium ? 16 : 15,
        fontWeight: premium ? 700 : 600,
        fontFamily: 'Nunito, sans-serif',
        color: premium ? 'white' : (dark ? '#F1F5F9' : '#333'),
        marginBottom: 14,
        textShadow: premium ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
      }}>
        {instruction}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
