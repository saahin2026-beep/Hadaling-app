import { useState, useEffect } from 'react';
import { ShareNetwork, Plus, X, ArrowRight } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';

export default function IOSInstallPrompt() {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const state = storage.get();
    if (!state.onboardingComplete || state.iosInstallDismissed) return;

    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);

    if (isIOS && isSafari && !isStandalone) {
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    storage.update({ iosInstallDismissed: true });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(86px + env(safe-area-inset-bottom))',
      left: 'clamp(12px, 4vw, 20px)',
      right: 'clamp(12px, 4vw, 20px)',
      background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
      borderRadius: 18,
      padding: '16px 18px 14px',
      boxShadow: '0 14px 40px rgba(8,145,178,0.45)',
      border: '1px solid rgba(255,255,255,0.15)',
      zIndex: 50,
      fontFamily: 'Nunito, sans-serif',
      animation: 'iosInstallSlideUp 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>
      <style>{`
        @keyframes iosInstallSlideUp {
          from { transform: translateY(140%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <button onClick={dismiss} aria-label="Close" style={{
        position: 'absolute', top: 10, right: 10,
        background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 8,
        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', padding: 0,
      }}>
        <X size={14} weight="bold" color="white" />
      </button>

      <h3 style={{
        fontSize: 'clamp(14px, 3.6vw, 16px)', fontWeight: 800, color: 'white',
        marginBottom: 6, paddingRight: 32, lineHeight: 1.3,
      }}>
        {t('install.ios_title')}
      </h3>

      <p style={{
        fontSize: 'clamp(11px, 2.9vw, 13px)', color: 'rgba(255,255,255,0.85)',
        lineHeight: 1.5, marginBottom: 10, paddingRight: 8,
      }}>
        {t('install.ios_body')}
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(0,0,0,0.18)', borderRadius: 10, padding: '8px 12px',
      }}>
        <ShareNetwork size={20} weight="fill" color="#22D3EE" />
        <ArrowRight size={12} weight="bold" color="rgba(255,255,255,0.6)" />
        <Plus size={20} weight="bold" color="#22D3EE" />
        <span style={{
          fontSize: 'clamp(11px, 2.9vw, 13px)', fontWeight: 700, color: 'white',
          marginLeft: 4,
        }}>
          {t('install.ios_action')}
        </span>
      </div>
    </div>
  );
}
