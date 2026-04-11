import { useNavigate } from 'react-router-dom';
import { House, Book, ChartBar, User } from '@phosphor-icons/react';
import { useLanguage } from '../utils/useLanguage';

const NAV_ITEMS = [
  { key: 'geel-world', Icon: House, label: 'Geel', labelSo: 'Geel', path: '/geel-world' },
  { key: 'casharo', Icon: Book, label: 'Lessons', labelSo: 'Casharo', path: '/home' },
  { key: 'xirfadaha', Icon: ChartBar, label: 'Progress', labelSo: 'Horumarka', path: '/progress' },
  { key: 'astaanta', Icon: User, label: 'Profile', labelSo: 'Astaanta', path: '/astaanta' },
];

export default function BottomNav({ active = 'casharo' }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  return (
    <div style={{
      position: 'fixed',
      bottom: 'max(12px, env(safe-area-inset-bottom))',
      left: '12px',
      right: '12px',
      maxWidth: '380px',
      marginLeft: 'auto',
      marginRight: 'auto',
      zIndex: 50,
    }}>
      <nav style={{
        background: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 22,
        padding: 6,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.1)',
      }}>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          const Icon = item.Icon;

          return (
            <button
              key={item.key}
              onClick={() => { if (item.path && !isActive) navigate(item.path); }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 16px',
                borderRadius: 16,
                background: isActive
                  ? 'linear-gradient(135deg, #0891B2, #0E7490)'
                  : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: 64,
                boxShadow: isActive ? '0 4px 12px rgba(8,145,178,0.3)' : 'none',
              }}
            >
              <Icon
                size={24}
                weight="fill"
                color={isActive ? 'white' : '#94A3B8'}
                style={{
                  transition: 'transform 0.2s ease',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              />
              <span style={{
                fontSize: 11,
                fontWeight: isActive ? 800 : 600,
                color: isActive ? 'white' : '#94A3B8',
                fontFamily: 'Nunito, sans-serif',
                marginTop: 4,
                letterSpacing: 0.2,
                transition: 'color 0.2s ease',
              }}>
                {lang === 'en' ? item.label : item.labelSo}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
