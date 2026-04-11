export default function Geel({ size = 120, expression = 'happy', circular = false, style: extraStyle = {} }) {
  let className = 'select-none';
  if (expression === 'encouraging') className += ' mascot-encouraging';
  if (expression === 'celebrating') className += ' animate-celebrate';

  const imageScale = circular ? 1.55 : 1;
  const imageSize = size * imageScale;

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: circular ? '50%' : size * 0.22,
          overflow: 'hidden',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...extraStyle,
        }}
      >
        <img
          src="/mascot/geel-happy.png"
          alt="Geel"
          draggable={false}
          style={{
            width: circular ? imageSize : size + 4,
            height: circular ? imageSize : size + 4,
            objectFit: 'cover',
            display: 'block',
            margin: circular ? 0 : -2,
          }}
        />
      </div>
    </div>
  );
}
