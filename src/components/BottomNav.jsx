import { useNavigate } from 'react-router-dom';
import { Book, ChartBar, User, Globe } from '@phosphor-icons/react';
import { useLanguage } from '../utils/useLanguage';

const NAV_ITEMS = [
  { key: 'geel-world', Icon: Globe, label: 'Geel', path: '/geel-world' },
  { key: 'casharo', Icon: Book, labelKey: 'nav.lessons', path: '/home' },
  { key: 'xirfadaha', Icon: ChartBar, labelKey: 'nav.progress', path: '/progress' },
  { key: 'astaanta', Icon: User, labelKey: 'nav.profile', path: '/astaanta' },
];

export default function BottomNav({ active = 'casharo' }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div style={{
      position: 'fixed',
      bottom: 'max(16px, env(safe-area-inset-bottom))',
      left: '16px',
      right: '16px',
      maxWidth: '400px',
      marginLeft: 'auto',
      marginRight: 'auto',
      zIndex: 50,
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '28px',
        padding: '8px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}>
        {NAV_ITEMS.map((n) => {
          const isActive = active === n.key;
          return (
            <div
              key={n.key}
              onClick={() => { if (n.path && !isActive) navigate(n.path); }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 16px',
                borderRadius: '20px',
                background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '60px',
              }}
            >
              <n.Icon
                size={22}
                weight="fill"
                color={isActive ? 'white' : 'rgba(255,255,255,0.5)'}
              />
              <span style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                fontFamily: 'Nunito, sans-serif',
                marginTop: '4px',
                letterSpacing: '0.3px',
              }}>
                {n.label || t(n.labelKey)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
