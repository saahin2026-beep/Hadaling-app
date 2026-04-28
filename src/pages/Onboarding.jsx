import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { trackEvent } from '../utils/observability';
import { useData } from '../utils/DataContext';
import { House, Briefcase, GraduationCap, Trophy, Plant, Leaf, Tree, Check, X, ArrowRight, Shield, Sparkle } from '@phosphor-icons/react';
import Geel from '../components/Geel';

// Hardcoded defaults (fallback if Supabase not loaded yet)
const DEFAULTS = {
  screen0: { title: 'Hadaling', subtitle: 'Kalsooni ku baro, daqiiqado yar gudaheed', buttonText: 'BILOW →', footer: 'Hadaling — Ingiriis si fudud' },
  screen1: { question: 'Maxaad Ingiriis u baranaysaa?', options: [{ text: 'Nolol maalmeed', icon: 'House' }, { text: 'Shaqo', icon: 'Briefcase' }, { text: 'Iskuul', icon: 'GraduationCap' }, { text: 'Kalsooni', icon: 'Trophy' }] },
  screen2: { question: 'Sidee ayaad Ingiriis u dareemaysaa hadda?', options: [{ text: 'Waan fahmaa wax yar' }, { text: 'Waan fahmaa caadi' }, { text: 'Waan rabaa inaan is hagaajiyo' }], helperText: 'Ma aha imtixaan.' },
  screen3: { label: 'Ingiriis', instruction: 'Dooro micnaha saxda ah:', prompt: "Hi, I'm Ahmed.", options: ['Salaan, magacaygu waa Ahmed', 'Nabad gelyo', 'Sidee tahay?'], correctIndex: 0 },
  screen4: { title: 'Aragtay?', line1: 'Tani waa sida casharradu u shaqeeyaan.', line2: 'Waa fudud, waadna awooddaa.', buttonText: 'SII WAD' },
  screen5: { title: 'Ma rabtaa inaad kaydiso horumarkaaga?', subtitle: 'Si aadan u lumin XP-gaaga iyo streak-gaaga', primaryButton: 'KAYDI HORUMARKA', secondaryButton: 'KU SII WAD HADDA' },
};

const COMFORT_ICONS = [Plant, Leaf, Tree];

// Geel in glass container with sparkle badge
function GlassGeelContainer({ size = 80 }) {
  const geelSize = Math.round(size * 0.65);
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 'clamp(12px, 2.5vh, 20px)',
    }}>
      <div style={{
        width: size,
        height: size,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '2px solid rgba(255,255,255,0.3)',
        borderRadius: size * 0.25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}>
        <Geel size={geelSize} />
        <div style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 18,
          height: 18,
          background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(245,158,11,0.5)',
        }}>
          <Sparkle size={10} weight="fill" color="white" />
        </div>
      </div>
    </div>
  );
}

// Shared styles
const styles = {
  page: {
    background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  ambientTop: {
    position: 'absolute',
    top: '-50px',
    right: '-80px',
    width: '250px',
    height: '250px',
    background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  ambientBottom: {
    position: 'absolute',
    bottom: '10%',
    left: '-60px',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
    minHeight: 0,
  },
};

// Premium Progress Dots
function ProgressDots({ total, current }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(6px, 1.2vh, 10px)', padding: 'clamp(12px, 2.5vh, 20px) 0' }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: i === current
              ? 'linear-gradient(90deg, #22D3EE, #F59E0B)'
              : i < current
                ? 'rgba(255,255,255,0.5)'
                : 'rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
            boxShadow: i === current ? '0 0 12px rgba(34,211,238,0.5)' : 'none',
          }}
        />
      ))}
    </div>
  );
}

// Glass Option Card
function GlassOptionCard({ icon: Icon, text, selected, correct, onClick, disabled, number, glowColor }) {
  const isCorrect = correct === true;
  const isWrong = correct === false;

  let bg = 'rgba(255,255,255,0.1)';
  let border = 'rgba(255,255,255,0.2)';
  let shadow = 'none';

  if (selected && !isWrong) {
    bg = 'rgba(255,255,255,0.2)';
    border = 'rgba(255,255,255,0.4)';
    shadow = '0 0 20px rgba(255,255,255,0.15)';
  }
  if (isCorrect) {
    bg = 'rgba(16,185,129,0.25)';
    border = 'rgba(52,211,153,0.5)';
    shadow = '0 0 20px rgba(16,185,129,0.3)';
  }
  if (isWrong) {
    bg = 'rgba(239,68,68,0.2)';
    border = 'rgba(248,113,113,0.4)';
    shadow = '0 0 20px rgba(239,68,68,0.2)';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: 'clamp(12px, 2.5vh, 20px) clamp(12px, 2.5vh, 20px)',
        background: bg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1.5px solid ${border}`,
        borderRadius: 'clamp(10px, 2.5vw, 16px)',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(8px, 1.8vh, 14px)',
        transition: 'all 0.25s ease',
        boxShadow: shadow,
        transform: selected && !isWrong ? 'scale(1.02)' : 'scale(1)',
        opacity: disabled && !selected && !isCorrect ? 0.5 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Colored glow overlay */}
      {glowColor && (
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '-15px',
          width: '50px',
          height: '50px',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}
      {Icon && (
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 'clamp(8px, 2vw, 12px)',
          background: glowColor ? glowColor.replace('0.3', '0.2') : 'rgba(255,255,255,0.15)',
          border: `1px solid ${glowColor ? glowColor.replace('0.3', '0.3') : 'rgba(255,255,255,0.2)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={22} weight="fill" color="white" />
        </div>
      )}
      {!Icon && number && (
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 'clamp(8px, 2vw, 12px)',
          background: isCorrect ? 'rgba(16,185,129,0.3)' : isWrong ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {isCorrect ? (
            <Check size={18} weight="bold" color="#10B981" />
          ) : isWrong ? (
            <X size={18} weight="bold" color="#EF4444" />
          ) : (
            <span style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif' }}>{number}</span>
          )}
        </div>
      )}
      <span style={{
        fontSize: 'clamp(14px, 3.8vw, 17px)',
        fontWeight: 700,
        color: isCorrect ? '#6EE7B7' : isWrong ? '#FCA5A5' : 'white',
        fontFamily: 'Nunito, sans-serif',
        textAlign: 'left',
        flex: 1,
      }}>
        {text}
      </span>
    </button>
  );
}

// Primary CTA Button
function PremiumButton({ onClick, children, variant = 'gold', disabled }) {
  const isSecondary = variant === 'secondary';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: 'clamp(12px, 2.5vh, 20px) clamp(16px, 3vh, 28px)',
        background: isSecondary
          ? 'rgba(255,255,255,0.1)'
          : variant === 'gold'
            ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
            : 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
        border: isSecondary ? '1px solid rgba(255,255,255,0.2)' : 'none',
        borderRadius: 'clamp(10px, 2.5vw, 16px)',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 'clamp(14px, 3.8vw, 17px)',
        fontWeight: 800,
        color: 'white',
        fontFamily: 'Nunito, sans-serif',
        boxShadow: isSecondary ? 'none' : variant === 'gold' ? '0 8px 30px rgba(245,158,11,0.4)' : '0 8px 30px rgba(8,145,178,0.4)',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {!isSecondary && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          animation: 'shimmer 2.5s infinite',
          pointerEvents: 'none',
        }} />
      )}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
}

// Feedback Banner
function FeedbackBanner({ type, visible, onContinue }) {
  if (!visible) return null;

  const isCorrect = type === 'correct';

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: isCorrect
        ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
        : 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      padding: 'clamp(12px, 2.5vh, 20px) clamp(16px, 3vh, 28px) max(20px, env(safe-area-inset-bottom))',
      borderRadius: 'clamp(16px, 3vh, 28px) clamp(16px, 3vh, 28px) 0 0',
      boxShadow: '0 -4px 30px rgba(0,0,0,0.3)',
      zIndex: 100,
      animation: 'slideUp 0.3s ease-out',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.8vh, 14px)', marginBottom: 'clamp(12px, 2.5vh, 20px)' }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 'clamp(8px, 2vw, 12px)',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {isCorrect ? <Check size={24} weight="bold" color="white" /> : <X size={24} weight="bold" color="white" />}
        </div>
        <div>
          <p style={{ fontSize: 'clamp(16px, 4.2vw, 20px)', fontWeight: 900, color: 'white', fontFamily: 'Nunito, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            {isCorrect ? 'Aad baad u fiicantahay!' : 'Isku day mar kale'}
          </p>
          <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: 'rgba(255,255,255,0.8)', fontFamily: 'Nunito, sans-serif' }}>
            {isCorrect ? 'Keep going!' : 'Try again'}
          </p>
        </div>
      </div>
      <PremiumButton onClick={onContinue} variant={isCorrect ? 'gold' : 'secondary'}>
        {isCorrect ? 'SII WAD →' : 'ISKU DAY'}
      </PremiumButton>
    </div>
  );
}

export default function Onboarding() {
  const { step } = useParams();
  const navigate = useNavigate();
  const currentStep = parseInt(step, 10);
  const { onboardingContent, getRandomPhrase } = useData();

  const getContent = (key) => onboardingContent?.[key] || DEFAULTS[key];

  const goNext = () => {
    if (currentStep < 5) navigate(`/onboarding/${currentStep + 1}`);
  };

  return (
    <div className="page-fixed" style={styles.page}>
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px rgba(245,158,11,0.3); }
          50% { box-shadow: 0 0 50px rgba(245,158,11,0.5); }
        }
      `}</style>

      {/* Ambient lights */}
      <div style={styles.ambientTop} />
      <div style={styles.ambientBottom} />

      <div style={{ ...styles.content, animation: 'fadeSlideUp 0.5s ease-out' }}>
        {currentStep === 0 && <Screen0 goNext={goNext} c={getContent('screen0')} />}
        {currentStep === 1 && <Screen1 goNext={goNext} c={getContent('screen1')} />}
        {currentStep === 2 && <Screen2 goNext={goNext} c={getContent('screen2')} />}
        {currentStep === 3 && <Screen3 goNext={goNext} c={getContent('screen3')} getRandomPhrase={getRandomPhrase} />}
        {currentStep === 4 && <Screen4 goNext={goNext} c={getContent('screen4')} />}
        {currentStep === 5 && <Screen5 c={getContent('screen5')} />}
      </div>
    </div>
  );
}

// SCREEN 0: Welcome/Splash
function Screen0({ goNext, c }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 clamp(12px, 2.5vh, 20px) clamp(12px, 2.5vh, 20px)' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 0.6s ease-out',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* App Icon */}
          <div style={{
            width: 140,
            height: 140,
            borderRadius: 'clamp(24px, 5vw, 36px)',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35), 0 0 0 3px rgba(255,255,255,0.2)',
            animation: 'float 4s ease-in-out infinite',
          }}>
            <img
              src="/branding/app-icon-1024.png"
              alt="Hadaling"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 10vw, 52px)',
            fontWeight: 900,
            color: 'white',
            fontFamily: 'Nunito, sans-serif',
            textAlign: 'center',
            marginTop: 'clamp(16px, 3vh, 28px)',
            textShadow: '0 4px 20px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.1)',
            letterSpacing: '-0.5px',
          }}>
            {c.title}
          </h1>

          <p style={{
            fontSize: 'clamp(17px, 4.5vw, 20px)',
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'Nunito, sans-serif',
            textAlign: 'center',
            marginTop: 'clamp(8px, 1.8vh, 14px)',
            lineHeight: 1.6,
            maxWidth: 300,
            fontWeight: 600,
          }}>
            {c.subtitle}
          </p>
        </div>
      </div>

      <div style={{
        width: '100%',
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out 0.3s',
      }}>
        <PremiumButton onClick={goNext}>{c.buttonText}</PremiumButton>
        <p style={{
          fontSize: 'clamp(11px, 2.8vw, 13px)',
          color: 'rgba(255,255,255,0.5)',
          fontFamily: 'Nunito, sans-serif',
          textAlign: 'center',
          marginTop: 'clamp(12px, 2.5vh, 20px)',
        }}>
          {c.footer}
        </p>
      </div>
    </div>
  );
}

const OPTION_GLOWS = [
  'rgba(251,146,60,0.3)',   // Home - orange
  'rgba(139,92,246,0.3)',   // Work - purple
  'rgba(34,211,238,0.3)',   // School - cyan
  'rgba(245,158,11,0.3)',   // Confidence - gold
];

const COMFORT_GLOWS = [
  'rgba(16,185,129,0.3)',   // Plant - green
  'rgba(34,211,238,0.3)',   // Leaf - cyan
  'rgba(245,158,11,0.3)',   // Tree - gold
];

// SCREEN 1: Intent Question
function Screen1({ goNext, c }) {
  const [selected, setSelected] = useState(null);
  const iconMap = { House, Briefcase, GraduationCap, Trophy };
  const timerRef = useRef(null);

  const handleTap = (value) => {
    setSelected(value);
    storage.update({ intent: value });
    timerRef.current = setTimeout(goNext, 600);
  };
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 clamp(12px, 2.5vh, 20px) clamp(12px, 2.5vh, 20px)' }}>
      <ProgressDots total={5} current={0} />

      <GlassGeelContainer size={80} />

      <h2 style={{
        fontSize: 'clamp(24px, 6vw, 28px)',
        fontWeight: 900,
        color: 'white',
        fontFamily: 'Nunito, sans-serif',
        textAlign: 'center',
        marginBottom: 'clamp(16px, 3vh, 28px)',
        textShadow: '0 3px 15px rgba(0,0,0,0.25)',
        lineHeight: 1.3,
      }}>
        {c.question}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vh, 14px)' }}>
        {(c.options || []).map((opt, i) => {
          const IconComponent = iconMap[['House', 'Briefcase', 'GraduationCap', 'Trophy'][i]];
          return (
            <GlassOptionCard
              key={i}
              icon={IconComponent}
              text={opt.text || opt}
              selected={selected === (opt.text || opt)}
              onClick={() => handleTap(opt.text || opt)}
              glowColor={OPTION_GLOWS[i]}
            />
          );
        })}
      </div>
    </div>
  );
}

// SCREEN 2: Comfort Level
function Screen2({ goNext, c }) {
  const [selected, setSelected] = useState(null);
  const timerRef = useRef(null);

  const handleTap = (value) => {
    setSelected(value);
    storage.update({ comfort: value });
    timerRef.current = setTimeout(goNext, 600);
  };
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 clamp(12px, 2.5vh, 20px) clamp(12px, 2.5vh, 20px)' }}>
      <ProgressDots total={5} current={1} />

      <GlassGeelContainer size={80} />

      <h2 style={{
        fontSize: 'clamp(18px, 5vw, 24px)',
        fontWeight: 800,
        color: 'white',
        fontFamily: 'Nunito, sans-serif',
        textAlign: 'center',
        marginBottom: 'clamp(16px, 3vh, 28px)',
      }}>
        {c.question}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vh, 14px)' }}>
        {(c.options || []).map((opt, i) => (
          <GlassOptionCard
            key={i}
            icon={COMFORT_ICONS[i]}
            text={opt.text || opt}
            selected={selected === (opt.text || opt)}
            onClick={() => handleTap(opt.text || opt)}
            glowColor={COMFORT_GLOWS[i]}
          />
        ))}
      </div>

      <p style={{
        fontSize: 'clamp(11px, 2.8vw, 13px)',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'Nunito, sans-serif',
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 'clamp(12px, 2.5vh, 20px)',
      }}>
        {c.helperText}
      </p>
    </div>
  );
}

// SCREEN 3: Mini Quiz
function Screen3({ goNext, c }) {
  const [answered, setAnswered] = useState(false);
  const [wrongIndex, setWrongIndex] = useState(null);
  const [bannerType, setBannerType] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);

  const correctIdx = c.correctIndex ?? 0;

  const handleTap = (index) => {
    if (answered || bannerVisible) return;
    if (index === correctIdx) {
      setAnswered(true);
      setBannerType('correct');
      setBannerVisible(true);
    } else {
      setWrongIndex(index);
      setBannerType('wrong');
      setBannerVisible(true);
    }
  };

  const getCorrectProp = (i) => {
    if (i === correctIdx && answered) return true;
    if (i === wrongIndex) return false;
    return null;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 clamp(12px, 2.5vh, 20px) clamp(12px, 2.5vh, 20px)' }}>
      <ProgressDots total={5} current={2} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'clamp(12px, 2.5vh, 20px)' }}>
        <GlassGeelContainer size={90} />

        {/* Speech bubble */}
        <div style={{
          marginTop: 'clamp(8px, 1.8vh, 14px)',
          background: answered ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: answered ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(255,255,255,0.2)',
          borderRadius: 'clamp(10px, 2.5vw, 16px)',
          padding: 'clamp(8px, 1.8vh, 14px) clamp(12px, 2.5vh, 20px)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: answered ? '8px solid rgba(16,185,129,0.2)' : '8px solid rgba(255,255,255,0.15)',
          }} />
          <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: 'rgba(255,255,255,0.6)', fontFamily: 'Nunito, sans-serif', marginBottom: 'clamp(3px, 0.8vh, 6px)', fontWeight: 600 }}>{c.label}</p>
          <p style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 900, color: answered ? '#6EE7B7' : 'white', fontFamily: 'Nunito, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>{c.prompt}</p>
        </div>
      </div>

      <p style={{
        fontSize: 'clamp(14px, 3.8vw, 17px)',
        fontWeight: 700,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'Nunito, sans-serif',
        marginBottom: 'clamp(12px, 2.5vh, 20px)',
        textShadow: '0 1px 6px rgba(0,0,0,0.15)',
      }}>
        {c.instruction}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.2vh, 10px)' }}>
        {(c.options || []).map((opt, i) => (
          <GlassOptionCard
            key={i}
            text={opt}
            number={i + 1}
            selected={i === correctIdx && answered}
            correct={getCorrectProp(i)}
            onClick={() => handleTap(i)}
            disabled={answered || bannerVisible}
          />
        ))}
      </div>

      <FeedbackBanner
        type={bannerType}
        visible={bannerVisible}
        onContinue={() => {
          if (bannerType === 'correct') goNext();
          else {
            setWrongIndex(null);
            setBannerType(null);
            setBannerVisible(false);
          }
        }}
      />
    </div>
  );
}

// SCREEN 4: Encouragement
function Screen4({ goNext, c }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 clamp(16px, 3vh, 28px) max(16px, env(safe-area-inset-bottom))' }}>
      <ProgressDots total={5} current={3} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.25))',
          animation: 'float 3s ease-in-out infinite',
        }}>
          <Geel size={150} expression="celebrating" />
        </div>

        <h2 style={{
          fontSize: 'clamp(30px, 7.5vw, 36px)',
          fontWeight: 900,
          color: 'white',
          fontFamily: 'Nunito, sans-serif',
          textAlign: 'center',
          marginTop: 'clamp(16px, 3vh, 28px)',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          letterSpacing: '-0.3px',
        }}>
          {c.title}
        </h2>

        <p style={{
          fontSize: 'clamp(17px, 4.5vw, 20px)',
          color: 'rgba(255,255,255,0.85)',
          fontFamily: 'Nunito, sans-serif',
          textAlign: 'center',
          marginTop: 'clamp(8px, 1.8vh, 14px)',
          lineHeight: 1.7,
          fontWeight: 600,
        }}>
          {c.line1}
        </p>
        <p style={{
          fontSize: 'clamp(17px, 4.5vw, 20px)',
          color: 'rgba(255,255,255,0.75)',
          fontFamily: 'Nunito, sans-serif',
          textAlign: 'center',
          marginTop: 'clamp(3px, 0.8vh, 6px)',
          fontWeight: 600,
        }}>
          {c.line2}
        </p>
      </div>

      <PremiumButton onClick={goNext}>{c.buttonText}</PremiumButton>
    </div>
  );
}

// SCREEN 5: Save Progress Prompt
function Screen5({ c }) {
  const navigate = useNavigate();
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 clamp(12px, 2.5vh, 20px) clamp(12px, 2.5vh, 20px)' }}>
      <ProgressDots total={5} current={4} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: 'clamp(20px, 5vw, 30px)',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'clamp(16px, 3vh, 28px)',
          boxShadow: '0 0 40px rgba(16,185,129,0.2)',
        }}>
          <Shield size={48} weight="fill" color="#10B981" />
        </div>

        <h2 style={{
          fontSize: 'clamp(24px, 6vw, 28px)',
          fontWeight: 900,
          color: 'white',
          fontFamily: 'Nunito, sans-serif',
          textAlign: 'center',
          textShadow: '0 3px 15px rgba(0,0,0,0.25)',
          lineHeight: 1.3,
        }}>
          {c.title}
        </h2>

        <p style={{
          fontSize: 'clamp(16px, 4vw, 18px)',
          color: 'rgba(255,255,255,0.8)',
          fontFamily: 'Nunito, sans-serif',
          textAlign: 'center',
          marginTop: 'clamp(8px, 1.8vh, 14px)',
          lineHeight: 1.6,
          fontWeight: 600,
        }}>
          {c.subtitle}
        </p>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vh, 14px)' }}>
        <PremiumButton onClick={() => { storage.update({ onboardingComplete: true, guestMode: false }); trackEvent('onboarding_completed', { choice: 'save_progress' }); navigate('/auth-gate'); }} variant="cyan">
          {c.primaryButton}
        </PremiumButton>
        <PremiumButton onClick={() => { storage.update({ onboardingComplete: true, guestMode: true }); trackEvent('onboarding_completed', { choice: 'continue_as_guest' }); navigate('/home'); }} variant="secondary">
          {c.secondaryButton}
        </PremiumButton>
      </div>
    </div>
  );
}
