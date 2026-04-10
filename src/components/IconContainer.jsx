const SIZES = {
  xs: { container: 32, icon: 16, radius: 8 },
  sm: { container: 38, icon: 18, radius: 10 },
  md: { container: 46, icon: 22, radius: 12 },
  lg: { container: 54, icon: 26, radius: 14 },
  xl: { container: 64, icon: 30, radius: 16 },
};

const GLOWS = {
  cyan: {
    bg: 'rgba(8,145,178,0.18)',
    border: 'rgba(34,211,238,0.3)',
    shadow: '0 4px 20px rgba(34,211,238,0.2)',
  },
  gold: {
    bg: 'rgba(245,158,11,0.18)',
    border: 'rgba(251,191,36,0.3)',
    shadow: '0 4px 20px rgba(245,158,11,0.2)',
  },
  green: {
    bg: 'rgba(16,185,129,0.18)',
    border: 'rgba(52,211,153,0.3)',
    shadow: '0 4px 20px rgba(16,185,129,0.2)',
  },
  purple: {
    bg: 'rgba(139,92,246,0.18)',
    border: 'rgba(167,139,250,0.3)',
    shadow: '0 4px 20px rgba(139,92,246,0.2)',
  },
  orange: {
    bg: 'rgba(249,115,22,0.18)',
    border: 'rgba(251,146,60,0.3)',
    shadow: '0 4px 20px rgba(249,115,22,0.2)',
  },
  red: {
    bg: 'rgba(239,68,68,0.15)',
    border: 'rgba(248,113,113,0.25)',
    shadow: '0 4px 16px rgba(239,68,68,0.15)',
  },
  pink: {
    bg: 'rgba(236,72,153,0.18)',
    border: 'rgba(244,114,182,0.3)',
    shadow: '0 4px 20px rgba(236,72,153,0.2)',
  },
  neutral: {
    bg: 'rgba(255,255,255,0.15)',
    border: 'rgba(255,255,255,0.25)',
    shadow: 'none',
  },
};

const GLOWS_LIGHT = {
  cyan: {
    bg: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
    border: 'rgba(8,145,178,0.2)',
    shadow: '0 4px 16px rgba(8,145,178,0.15)',
    iconColor: '#0891B2',
  },
  gold: {
    bg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    border: 'rgba(217,119,6,0.2)',
    shadow: '0 4px 16px rgba(245,158,11,0.15)',
    iconColor: '#D97706',
  },
  green: {
    bg: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
    border: 'rgba(16,185,129,0.2)',
    shadow: '0 4px 16px rgba(16,185,129,0.15)',
    iconColor: '#059669',
  },
  purple: {
    bg: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
    border: 'rgba(139,92,246,0.2)',
    shadow: '0 4px 16px rgba(139,92,246,0.15)',
    iconColor: '#7C3AED',
  },
  orange: {
    bg: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)',
    border: 'rgba(234,88,12,0.2)',
    shadow: '0 4px 16px rgba(249,115,22,0.15)',
    iconColor: '#EA580C',
  },
  red: {
    bg: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
    border: 'rgba(220,38,38,0.2)',
    shadow: '0 4px 16px rgba(239,68,68,0.12)',
    iconColor: '#DC2626',
  },
  neutral: {
    bg: '#F1F5F9',
    border: 'rgba(100,116,139,0.15)',
    shadow: 'none',
    iconColor: '#64748B',
  },
};

export default function IconContainer({
  icon: Icon,
  glow = 'cyan',
  size = 'md',
  variant = 'dark',
  onClick,
  style = {},
}) {
  const s = SIZES[size] || SIZES.md;
  const g = variant === 'light' ? (GLOWS_LIGHT[glow] || GLOWS_LIGHT.neutral) : (GLOWS[glow] || GLOWS.neutral);
  const iconColor = variant === 'light' ? g.iconColor : 'white';

  return (
    <div
      onClick={onClick}
      style={{
        width: s.container,
        height: s.container,
        borderRadius: s.radius,
        background: g.bg,
        border: `1px solid ${g.border}`,
        boxShadow: g.shadow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        ...style,
      }}
    >
      <Icon size={s.icon} weight="fill" color={iconColor} />
    </div>
  );
}

export { SIZES, GLOWS, GLOWS_LIGHT };
