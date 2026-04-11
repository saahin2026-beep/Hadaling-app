import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash, Warning, Bell, ChartBar,
  ShieldCheck, BookOpen, Info, Crown, SignOut, CaretRight, Globe, Heart
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
    <div style={{
      background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)',
      minHeight: '100dvh',
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
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minHeight: 48,
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          <Geel size={26} circular />
        </div>
        <span style={{ fontSize: 17, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
          {t('astaanta.title')}
        </span>
      </div>

      <div style={{ overflowY: 'auto', paddingBottom: 100, position: 'relative', zIndex: 2 }}>
        {/* Banner */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0891B2 0%, #22D3EE 100%)',
            borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 2px 12px rgba(8,145,178,0.25)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -20, top: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Crown size={24} weight="fill" color="white" />
            </div>
            <div style={{ flex: 1, zIndex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>{t('astaanta.banner_title')}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>{t('astaanta.banner_sub')}</p>
            </div>
          </div>
        </div>

        {/* Profile section — white card */}
        <div
          onClick={() => setShowProfile(true)}
          style={{
            margin: '20px 16px 0',
            background: 'white',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: '#ECFEFF', border: '2px solid #0891B2',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          }}>
            <Geel size={50} circular />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif' }}>
              {state.userName || (state.guestMode ? t('astaanta.guest') : t('astaanta.student'))}
            </p>
            <p style={{ fontSize: 13, color: '#64748B', fontFamily: 'Nunito, sans-serif', marginTop: 1 }}>
              {state.authComplete ? (state.profileComplete ? '@' + (state.username || '') : t('astaanta.student_sub')) : t('astaanta.guest_sub')}
            </p>
          </div>
          <CaretRight size={18} weight="bold" color="#CBD5E1" />
        </div>

        {/* Menu */}
        <div style={{ padding: '12px 16px 0' }}>
          <MenuItem icon={BookOpen} glow="cyan" label={t('astaanta.manage_courses')} sublabel={t('astaanta.manage_courses_sub')} onClick={() => navigate('/home')} />
          <MenuItem icon={ChartBar} glow="cyan" label={t('astaanta.progress')} sublabel={`${state.xp || 0} XP · ${state.lessonsCompleted?.length || 0}/10`} onClick={() => navigate('/progress/stats')} />
          {/* Language toggle — white card */}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: 14,
            background: 'white',
            borderRadius: 14,
            marginBottom: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <IconContainer icon={Globe} glow="neutral" size="md" variant="light" />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', fontFamily: 'Nunito, sans-serif' }}>{t('astaanta.appearance')}</p>
              <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Nunito, sans-serif', marginTop: 1 }}>
                {lang === 'so' ? 'Soomaali' : 'English'}
              </p>
            </div>
            <div
              onClick={() => setLang(lang === 'so' ? 'en' : 'so')}
              style={{
                width: 96, height: 36, borderRadius: 18,
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
                <span style={{ fontSize: 10, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
                  {lang === 'so' ? 'SO' : 'EN'}
                </span>
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', padding: '0 10px', zIndex: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: lang === 'so' ? 'transparent' : '#94A3B8', fontFamily: 'Nunito, sans-serif' }}>SO</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: lang === 'en' ? 'transparent' : '#94A3B8', fontFamily: 'Nunito, sans-serif' }}>EN</span>
              </div>
            </div>
          </div>
          <MenuItem icon={Bell} glow="gold" label={t('astaanta.notifications')} sublabel={t('astaanta.notifications_sub')} onClick={() => setShowComingSoon(true)} />
          <MenuItem icon={ShieldCheck} glow="green" label={t('astaanta.security')} sublabel={state.guestMode ? t('astaanta.security_guest') : t('astaanta.security_verified')} onClick={() => setShowComingSoon(true)} />
          <MenuItem icon={Info} glow="neutral" label={t('astaanta.about')} sublabel={t('astaanta.about_sub')} onClick={() => navigate('/about')} />

          <div style={{ height: 10 }} />

          <MenuItem icon={Trash} glow="red" label={t('astaanta.reset')} sublabel={t('astaanta.reset_sub')} danger onClick={() => setShowResetConfirm(true)} />
          <MenuItem icon={SignOut} glow="red" label={t('astaanta.signout')} sublabel={t('astaanta.signout_sub')} danger onClick={() => setShowResetConfirm(true)} />
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 28 }}>Hadaling v1.0.0</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 4 }}>{t('astaanta.footer')} <Heart size={12} weight="fill" color="#E53935" style={{ display: 'inline', verticalAlign: 'middle' }} /></p>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <Modal onClose={() => setShowComingSoon(false)}>
          <Geel size={80} expression="encouraging" />
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 12 }}>{t('coming_soon.title')}</h3>
          <p style={{ fontSize: 14, color: '#64748B', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 8, lineHeight: 1.6 }}>{t('coming_soon.message')}</p>
          <button onClick={() => setShowComingSoon(false)} style={{
            width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', background: '#0891B2',
            fontSize: 15, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', cursor: 'pointer',
            marginTop: 20, textTransform: 'uppercase', letterSpacing: 0.5,
          }}>{t('coming_soon.close')}</button>
        </Modal>
      )}

      {/* Reset Modal */}
      {showResetConfirm && (
        <Modal onClose={() => setShowResetConfirm(false)}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Warning size={28} weight="fill" color="#E53935" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 12 }}>{t('reset.title')}</h3>
          <p style={{ fontSize: 14, color: '#64748B', fontFamily: 'Nunito, sans-serif', textAlign: 'center', marginTop: 8, lineHeight: 1.6 }}>{t('reset.message')}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, width: '100%' }}>
            <button onClick={() => setShowResetConfirm(false)} style={{
              flex: 1, padding: '14px 0', borderRadius: 14, border: '2px solid #E2E8F0', background: 'white',
              fontSize: 15, fontWeight: 800, color: '#64748B', fontFamily: 'Nunito, sans-serif', cursor: 'pointer', textTransform: 'uppercase',
            }}>{t('reset.cancel')}</button>
            <button onClick={handleReset} style={{
              flex: 1, padding: '14px 0', borderRadius: 14, border: 'none', background: '#E53935',
              fontSize: 15, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif', cursor: 'pointer', textTransform: 'uppercase',
            }}>{t('reset.confirm')}</button>
          </div>
        </Modal>
      )}

      {resetDone && (
        <Modal>
          <Geel size={80} expression="encouraging" />
          <p style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', fontFamily: 'Nunito, sans-serif', marginTop: 12 }}>{t('reset.done')}</p>
          <p style={{ fontSize: 13, color: '#64748B', fontFamily: 'Nunito, sans-serif', marginTop: 4 }}>{t('reset.redirecting')}</p>
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
      gap: 14,
      padding: 14,
      borderRadius: 14,
      marginBottom: 10,
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
        <p style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Nunito, sans-serif', color: danger ? '#DC2626' : '#1E293B' }}>{label}</p>
        {sublabel && <p style={{ fontSize: 12, fontFamily: 'Nunito, sans-serif', marginTop: 2, color: danger ? '#F87171' : '#64748B' }}>{sublabel}</p>}
      </div>
      <CaretRight size={18} weight="bold" color={danger ? '#FECACA' : '#CBD5E1'} />
    </button>
  );
}

function ProfileRow({ label, value, last }) {
  return (
    <div style={{
      padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: last ? 'none' : '1px solid #F1F5F9', background: 'white',
    }}>
      <span style={{ fontSize: 13, color: '#64748B', fontFamily: 'Nunito, sans-serif' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', fontFamily: 'Nunito, sans-serif', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div style={{ background: 'white', borderRadius: 24, padding: '24px 20px', width: '100%', maxWidth: 340, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
