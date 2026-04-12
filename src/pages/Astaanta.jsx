import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Warning, Bell, ChartBar,
  ShieldCheck, Crown, SignOut, CaretRight, Globe, Heart
} from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';
import BottomNav from '../components/BottomNav';
import IconContainer from '../components/IconContainer';
import ProfilePopup from '../components/ProfilePopup';

export default function Astaanta() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const state = storage.get();

  const handleReset = () => {
    storage.reset();
    setResetDone(true);
    setShowResetConfirm(false);
    setTimeout(() => { window.location.href = '/'; }, 1500);
  };

  return (
    <div className="page-fixed" style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ambient light blobs */}
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '-30px',
        width: '140px',
        height: '140px',
        background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '-50px',
        width: '120px',
        height: '120px',
        background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '-20px',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{
        padding: 'clamp(8px, 1.8vh, 14px) clamp(12px, 2.5vh, 20px)',
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(6px, 1.2vh, 10px)',
        minHeight: 48,
        position: 'relative',
        zIndex: 2,
      }}>
        <Geel size={32} circular style={{ background: 'rgba(255,255,255,0.25)' }} />
        <span style={{ fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
          {t('astaanta.title')}
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 'max(100px, calc(80px + env(safe-area-inset-bottom)))', position: 'relative', zIndex: 2, minHeight: 0 }}>
        {/* Banner */}
        <div style={{ padding: 'clamp(6px, 1.2vh, 10px) clamp(12px, 2.5vh, 20px) 0' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0891B2 0%, #22D3EE 100%)',
            borderRadius: 'clamp(10px, 2.5vw, 16px)', padding: 'clamp(8px, 1.8vh, 14px) clamp(8px, 1.8vh, 14px)', display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.8vh, 14px)',
            boxShadow: '0 2px 12px rgba(8,145,178,0.25)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -20, top: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Crown size={20} weight="fill" color="white" />
            </div>
            <div style={{ flex: 1, zIndex: 1 }}>
              <p style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{t('astaanta.banner_title')}</p>
              <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: 'rgba(255,255,255,0.85)', fontFamily: 'Nunito, sans-serif', marginTop: 1 }}>{t('astaanta.banner_sub')}</p>
            </div>
          </div>
        </div>

        {/* Profile section — white card */}
        <div
          onClick={() => setShowProfile(true)}
          style={{
            margin: 'clamp(6px, 1.2vh, 10px) clamp(12px, 2.5vh, 20px) 0',
            background: 'white',
            borderRadius: 'clamp(10px, 2.5vw, 16px)',
            padding: 'clamp(8px, 1.8vh, 14px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(8px, 1.8vh, 14px)',
            cursor: 'pointer',
          }}
        >
          <Geel size={48} circular style={{ border: '2px solid #0891B2', background: '#ECFEFF' }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif' }}>
              {state.userName || (state.guestMode ? t('astaanta.guest') : t('astaanta.student'))}
            </p>
            <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: '#64748B', fontFamily: 'Nunito, sans-serif', marginTop: 1 }}>
              {state.authComplete ? (state.profileComplete ? '@' + (state.username || '') : t('astaanta.student_sub')) : t('astaanta.guest_sub')}
            </p>
          </div>
          <CaretRight size={16} weight="bold" color="#CBD5E1" />
        </div>

        {/* Menu */}
        <div style={{ padding: 'clamp(6px, 1.2vh, 10px) clamp(12px, 2.5vh, 20px) 0' }}>
          <MenuItem icon={ChartBar} glow="cyan" label={t('astaanta.progress')} sublabel={`${state.xp || 0} XP · ${state.lessonsCompleted?.length || 0}/10`} onClick={() => navigate('/progress/stats')} />
          {/* Language toggle — white card */}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(8px, 1.8vh, 14px)',
            padding: 'clamp(6px, 1.2vh, 10px) clamp(8px, 1.8vh, 14px)',
            background: 'white',
            borderRadius: 'clamp(8px, 2vw, 12px)',
            marginBottom: 'clamp(6px, 1.2vh, 10px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <IconContainer icon={Globe} glow="neutral" size="md" variant="light" />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', fontWeight: 700, color: '#1E293B', fontFamily: 'Nunito, sans-serif' }}>{t('astaanta.appearance')}</p>
              <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: '#64748B', fontFamily: 'Nunito, sans-serif', marginTop: 1 }}>
                {lang === 'so' ? 'Soomaali' : 'English'}
              </p>
            </div>
            <div
              onClick={() => setLang(lang === 'so' ? 'en' : 'so')}
              style={{
                width: 96, height: 36, borderRadius: 'clamp(14px, 3vw, 20px)',
                background: '#E2E8F0', cursor: 'pointer',
                display: 'flex', alignItems: 'center', padding: '3px',
                position: 'relative', transition: 'background 0.3s',
              }}
            >
              <div style={{
                position: 'absolute',
                left: lang === 'so' ? 3 : 'calc(100% - 49px)',
                width: 46, height: 30, borderRadius: 15,
                background: '#0891B2',
                transition: 'left 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
                  {lang === 'so' ? 'SO' : 'EN'}
                </span>
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', padding: '0 clamp(6px, 1.2vh, 10px)', zIndex: 0 }}>
                <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: 700, color: lang === 'so' ? 'transparent' : '#94A3B8', fontFamily: 'Nunito, sans-serif' }}>SO</span>
                <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', fontWeight: 700, color: lang === 'en' ? 'transparent' : '#94A3B8', fontFamily: 'Nunito, sans-serif' }}>EN</span>
              </div>
            </div>
          </div>
          <MenuItem icon={Bell} glow="gold" label={t('astaanta.notifications')} sublabel={t('astaanta.notifications_sub')} onClick={() => setShowComingSoon(true)} />
          <MenuItem icon={ShieldCheck} glow="green" label={t('astaanta.security')} sublabel={state.guestMode ? t('astaanta.security_guest') : t('astaanta.security_verified')} onClick={() => setShowComingSoon(true)} />
          <div style={{ height: 'clamp(3px, 0.8vh, 6px)' }} />

          <MenuItem icon={SignOut} glow="red" label={t('astaanta.signout')} sublabel={t('astaanta.signout_sub')} danger onClick={() => setShowResetConfirm(true)} />
        </div>

        <p style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: 'rgba(255,255,255,0.35)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 'clamp(8px, 1.8vh, 14px)' }}>Hadaling v1.0.0</p>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <Modal onClose={() => setShowComingSoon(false)}>
          <Geel size={80} expression="encouraging" />
          <h3 style={{ fontSize: 'clamp(16px, 4.2vw, 20px)', fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 'clamp(8px, 1.8vh, 14px)' }}>{t('coming_soon.title')}</h3>
          <p style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', color: '#64748B', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 'clamp(6px, 1.2vh, 10px)', lineHeight: 1.6 }}>{t('coming_soon.message')}</p>
          <button onClick={() => setShowComingSoon(false)} style={{
            width: '100%', padding: 'clamp(8px, 1.8vh, 14px) 0', borderRadius: 'clamp(10px, 2.5vw, 16px)', border: 'none', background: '#0891B2',
            fontSize: 'clamp(13px, 3.2vw, 15px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            marginTop: 'clamp(16px, 2.5vh, 20px)', textTransform: 'uppercase', letterSpacing: 0.5,
          }}>{t('coming_soon.close')}</button>
        </Modal>
      )}

      {/* Reset Modal */}
      {showResetConfirm && (
        <Modal onClose={() => setShowResetConfirm(false)}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Warning size={28} weight="fill" color="#E53935" />
          </div>
          <h3 style={{ fontSize: 'clamp(16px, 4.2vw, 20px)', fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 'clamp(8px, 1.8vh, 14px)' }}>{t('reset.title')}</h3>
          <p style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', color: '#64748B', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 'clamp(6px, 1.2vh, 10px)', lineHeight: 1.6 }}>{t('reset.message')}</p>
          <div style={{ display: 'flex', gap: 'clamp(6px, 1.2vh, 10px)', marginTop: 'clamp(16px, 2.5vh, 20px)', width: '100%' }}>
            <button onClick={() => setShowResetConfirm(false)} style={{
              flex: 1, padding: 'clamp(8px, 1.8vh, 14px) 0', borderRadius: 'clamp(10px, 2.5vw, 16px)', border: '2px solid #E2E8F0', background: 'white',
              fontSize: 'clamp(13px, 3.2vw, 15px)', fontWeight: 800, color: '#64748B', fontFamily: 'Nunito, sans-serif', cursor: 'pointer', textTransform: 'uppercase',
            }}>{t('reset.cancel')}</button>
            <button onClick={handleReset} style={{
              flex: 1, padding: 'clamp(8px, 1.8vh, 14px) 0', borderRadius: 'clamp(10px, 2.5vw, 16px)', border: 'none', background: '#E53935',
              fontSize: 'clamp(13px, 3.2vw, 15px)', fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', cursor: 'pointer', textTransform: 'uppercase',
            }}>{t('reset.confirm')}</button>
          </div>
        </Modal>
      )}

      {resetDone && (
        <Modal>
          <Geel size={80} expression="encouraging" />
          <p style={{ fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 'clamp(8px, 1.8vh, 14px)' }}>{t('reset.done')}</p>
          <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: '#64748B', fontFamily: 'Nunito, sans-serif', marginTop: 'clamp(3px, 0.8vh, 6px)' }}>{t('reset.redirecting')}</p>
        </Modal>
      )}

      {/* Profile Popup */}
      {showProfile && (
        <ProfilePopup onClose={() => setShowProfile(false)} />
      )}

      <BottomNav active="astaanta" />
    </div>
  );
}

function MenuItem({ icon: Icon, glow = 'neutral', label, sublabel, onClick, danger }) {
  const cardStyle = danger ? {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
  } : {
    background: 'white',
    border: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  };

  return (
    <button onClick={onClick} style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(8px, 1.8vh, 14px)',
      padding: 'clamp(6px, 1.2vh, 10px) clamp(8px, 1.8vh, 14px)',
      borderRadius: 'clamp(8px, 2vw, 12px)',
      marginBottom: 'clamp(6px, 1.2vh, 10px)',
      cursor: onClick ? 'pointer' : 'default',
      textAlign: 'left',
      transition: 'transform 0.15s, box-shadow 0.15s',
      ...cardStyle,
    }}
      onPointerDown={(e) => { if (onClick) e.currentTarget.style.transform = 'scale(0.98)'; }}
      onPointerUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <IconContainer icon={Icon} glow={danger ? 'red' : glow} size="md" variant="light" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', fontWeight: 700, fontFamily: 'Nunito, sans-serif', color: danger ? '#DC2626' : '#1E293B' }}>{label}</p>
        {sublabel && <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontFamily: 'Nunito, sans-serif', marginTop: 'clamp(3px, 0.8vh, 6px)', color: danger ? '#F87171' : '#64748B' }}>{sublabel}</p>}
      </div>
      <CaretRight size={18} weight="bold" color={danger ? '#FECACA' : '#CBD5E1'} />
    </button>
  );
}

function ProfileRow({ label, value, last }) {
  return (
    <div style={{
      padding: 'clamp(8px, 1.8vh, 14px) clamp(12px, 2.5vh, 20px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: last ? 'none' : '1px solid #F1F5F9', background: 'white',
    }}>
      <span style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>{label}</span>
      <span style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', fontWeight: 700, color: '#1E293B', fontFamily: 'Nunito, sans-serif', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px, 3vh, 28px)' }}
      onClick={onClose}
    >
      <div style={{ background: 'white', borderRadius: 'clamp(16px, 3.5vw, 24px)', padding: 'clamp(16px, 3vh, 28px) clamp(16px, 2.5vh, 20px)', width: '100%', maxWidth: 340, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
