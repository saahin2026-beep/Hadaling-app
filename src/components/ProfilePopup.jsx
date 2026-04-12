import { useNavigate } from 'react-router-dom';
import { X, ShareNetwork, Heart, Users, Star } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { getStreakData, MILESTONES } from '../utils/streak';
import { useLanguage } from '../utils/useLanguage';
import Geel from './Geel';

export default function ProfilePopup({ onClose }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const state = storage.get();
  const streakData = getStreakData();

  const { xp = 0, dahab = 0, userName, username } = state;
  const streak = streakData.currentStreak || 0;
  const hearts = 5;

  const earnedBadges = Object.entries(MILESTONES)
    .filter(([day]) => streak >= Number(day))
    .map(([day, m]) => ({ day: Number(day), ...m }));

  const nextBadge = Object.entries(MILESTONES)
    .find(([day]) => streak < Number(day));

  const handleUpgrade = (plan) => {
    onClose();
    navigate('/upgrade', { state: { selectedPlan: plan } });
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 3vw, 20px)' }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 340, background: 'white', borderRadius: 'clamp(16px, 4vw, 28px)', overflow: 'hidden', boxShadow: '0 25px 80px rgba(0,0,0,0.3)', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover */}
        <div style={{ position: 'relative', height: 70, background: 'linear-gradient(135deg, #064E5E 0%, #0891B2 50%, #22D3EE 100%)' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 'clamp(6px, 1.5vw, 10px)', right: 'clamp(6px, 1.5vw, 10px)', width: 28, height: 28, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} weight="bold" color="white" />
          </button>
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: -35, position: 'relative', zIndex: 2 }}>
          <div style={{ width: 70, height: 70, background: 'linear-gradient(180deg, #FDE68A 0%, #F59E0B 70%, #D97706 100%)', borderRadius: '50%', border: '3px solid white', boxShadow: '0 6px 20px rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Geel size={44} circular />
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, background: 'linear-gradient(135deg, #0891B2, #0E7490)', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={10} weight="fill" color="white" />
            </div>
          </div>
        </div>

        {/* Name */}
        <div style={{ textAlign: 'center', padding: 'clamp(3px, 0.8vw, 6px) clamp(12px, 3vw, 20px) 0' }}>
          <p style={{ fontSize: 'clamp(16px, 4.2vw, 20px)', fontWeight: 800, color: '#1E293B', margin: 0, fontFamily: 'Nunito, sans-serif' }}>
            {userName || (lang === 'en' ? 'Guest' : 'Martida')}
          </p>
          {username && <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', color: '#0891B2', margin: '2px 0 0', fontWeight: 600, fontFamily: 'Nunito, sans-serif' }}>@{username}</p>}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(3px, 0.8vw, 6px)', padding: 'clamp(6px, 1.5vw, 10px) clamp(8px, 2vw, 14px) clamp(6px, 1.5vw, 10px)' }}>
          <StatBox value={streak} label="Streak" emoji="🔥" bg="#FFFBEB" border="rgba(245,158,11,0.15)" color="#B45309" />
          <StatBox value={xp >= 1000 ? `${(xp/1000).toFixed(1)}k` : xp} label="XP" emoji="⭐" bg="#ECFEFF" border="rgba(8,145,178,0.15)" color="#0E7490" />
          <StatBox value={dahab} label="Dahab" emoji="🪙" bg="#FEF3C7" border="rgba(245,158,11,0.15)" color="#B45309" />
          <StatBox value={hearts} label="Hearts" emoji="❤️" bg="#FEF2F2" border="rgba(239,68,68,0.15)" color="#DC2626" />
        </div>

        {/* Badges */}
        <div style={{ padding: '0 clamp(8px, 2vw, 14px) clamp(6px, 1.5vw, 10px)' }}>
          <p style={{ fontSize: 'clamp(8px, 2.2vw, 11px)', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 clamp(3px, 0.8vw, 6px)', fontFamily: 'Nunito, sans-serif' }}>
            {lang === 'en' ? 'Badges' : 'Calaamadaha'}
          </p>
          <div style={{ display: 'flex', gap: 'clamp(3px, 0.8vw, 6px)' }}>
            {earnedBadges.slice(0, 3).map((b) => <BadgeBox key={b.day} emoji={b.badge} label={`${b.day}d`} earned />)}
            {nextBadge && <BadgeBox emoji={nextBadge[1].badge} label={`${nextBadge[0]}d`} locked />}
          </div>
        </div>

        {/* Plans */}
        <div style={{ padding: '0 clamp(8px, 2vw, 14px) clamp(6px, 1.5vw, 10px)' }}>
          <p style={{ fontSize: 'clamp(8px, 2.2vw, 11px)', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 clamp(3px, 0.8vw, 6px)', fontFamily: 'Nunito, sans-serif' }}>
            {lang === 'en' ? 'Your Plan' : 'Qorshaha'}
          </p>

          {/* Free */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 'clamp(8px, 2vw, 12px)', padding: 'clamp(6px, 1.5vw, 10px) clamp(8px, 2vw, 14px)', marginBottom: 'clamp(3px, 0.8vw, 6px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 10px)' }}>
              <div style={{ width: 34, height: 34, background: '#E2E8F0', borderRadius: 'clamp(8px, 2vw, 12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={18} color="#94A3B8" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(3px, 0.8vw, 6px)' }}>
                  <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 800, color: '#64748B', margin: 0, fontFamily: 'Nunito, sans-serif' }}>Free</p>
                  <span style={{ fontSize: 'clamp(8px, 2.2vw, 11px)', fontWeight: 700, color: 'white', background: '#94A3B8', padding: '1px clamp(3px, 0.8vw, 6px)', borderRadius: 'clamp(6px, 1.5vw, 10px)', textTransform: 'uppercase' }}>
                    {lang === 'en' ? 'Current' : 'Hadda'}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 'clamp(13px, 3.2vw, 15px)', fontWeight: 800, color: '#94A3B8', margin: 0, fontFamily: 'Nunito, sans-serif' }}>$0</p>
            </div>
          </div>

          {/* Plus */}
          <div onClick={() => handleUpgrade('plus')} style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, white 100%)', border: '1.5px solid #F59E0B', borderRadius: 'clamp(8px, 2vw, 12px)', padding: 'clamp(6px, 1.5vw, 10px) clamp(8px, 2vw, 14px)', marginBottom: 'clamp(3px, 0.8vw, 6px)', cursor: 'pointer', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -8, right: 'clamp(8px, 2vw, 14px)', background: 'linear-gradient(135deg, #F59E0B, #D97706)', padding: '2px clamp(6px, 1.5vw, 10px)', borderRadius: 'clamp(6px, 1.5vw, 10px)' }}>
              <span style={{ fontSize: 'clamp(8px, 2.2vw, 11px)', fontWeight: 800, color: 'white', textTransform: 'uppercase' }}>{lang === 'en' ? 'Popular' : 'Caanka'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 10px)' }}>
              <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: 'clamp(8px, 2vw, 12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={18} weight="fill" color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 800, color: '#B45309', margin: 0, fontFamily: 'Nunito, sans-serif' }}>Plus</p>
                <p style={{ fontSize: 'clamp(8px, 2.2vw, 11px)', color: '#D97706', margin: '1px 0 0', fontFamily: 'Nunito, sans-serif' }}>
                  {lang === 'en' ? 'Unlimited hearts' : 'Wadnaha oo dhan'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 900, color: '#B45309', margin: 0, fontFamily: 'Nunito, sans-serif' }}>$5</p>
                <p style={{ fontSize: 'clamp(8px, 2.2vw, 11px)', color: '#D97706', margin: 0, fontFamily: 'Nunito, sans-serif' }}>/mo</p>
              </div>
            </div>
          </div>

          {/* Family */}
          <div onClick={() => handleUpgrade('family')} style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, white 100%)', border: '1.5px solid #8B5CF6', borderRadius: 'clamp(8px, 2vw, 12px)', padding: 'clamp(6px, 1.5vw, 10px) clamp(8px, 2vw, 14px)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 10px)' }}>
              <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', borderRadius: 'clamp(8px, 2vw, 12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} weight="fill" color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 800, color: '#7C3AED', margin: 0, fontFamily: 'Nunito, sans-serif' }}>Family</p>
                <p style={{ fontSize: 'clamp(8px, 2.2vw, 11px)', color: '#A78BFA', margin: '1px 0 0', fontFamily: 'Nunito, sans-serif' }}>
                  {lang === 'en' ? '6 accounts' : '6 koonto'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 900, color: '#7C3AED', margin: 0, fontFamily: 'Nunito, sans-serif' }}>$9</p>
                <p style={{ fontSize: 'clamp(8px, 2.2vw, 11px)', color: '#A78BFA', margin: 0, fontFamily: 'Nunito, sans-serif' }}>/mo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Share */}
        <div style={{ padding: '0 clamp(8px, 2vw, 14px) clamp(8px, 2vw, 14px)' }}>
          <button style={{ width: '100%', padding: 'clamp(6px, 1.5vw, 10px)', background: 'white', border: '1px solid #E2E8F0', borderRadius: 'clamp(8px, 2vw, 12px)', fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 700, color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(3px, 0.8vw, 6px)', fontFamily: 'Nunito, sans-serif' }}>
            <ShareNetwork size={12} weight="bold" />
            {lang === 'en' ? 'Share profile' : 'La wadaag'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ value, label, emoji, bg, border, color }) {
  return (
    <div style={{ flex: 1, background: bg, border: `1px solid ${border}`, borderRadius: 'clamp(8px, 2vw, 12px)', padding: 'clamp(6px, 1.5vw, 10px) clamp(3px, 0.8vw, 6px)', textAlign: 'center' }}>
      <p style={{ fontSize: 'clamp(14px, 3.8vw, 17px)', fontWeight: 800, color, margin: 0, fontFamily: 'Nunito, sans-serif' }}>{value}</p>
      <p style={{ fontSize: 'clamp(8px, 2.2vw, 11px)', fontWeight: 700, color, margin: '1px 0 0', textTransform: 'uppercase', fontFamily: 'Nunito, sans-serif' }}>{emoji} {label}</p>
    </div>
  );
}

function BadgeBox({ emoji, label, earned, locked }) {
  const bgColors = { '🔥': '#FEF3C7', '💪': '#ECFDF5', '🐪': '#ECFEFF', '⭐': '#F5F3FF', '👑': '#FEF3C7' };
  const textColors = { '🔥': '#B45309', '💪': '#065F46', '🐪': '#0E7490', '⭐': '#7C3AED', '👑': '#B45309' };
  return (
    <div style={{ flex: 1, background: locked ? '#F1F5F9' : (bgColors[emoji] || '#F1F5F9'), borderRadius: 'clamp(8px, 2vw, 12px)', padding: 'clamp(6px, 1.5vw, 10px) clamp(3px, 0.8vw, 6px)', textAlign: 'center', opacity: locked ? 0.5 : 1 }}>
      <span style={{ fontSize: 'clamp(16px, 4.2vw, 20px)', filter: locked ? 'grayscale(1)' : 'none' }}>{emoji}</span>
      <p style={{ fontSize: 'clamp(8px, 2.2vw, 11px)', fontWeight: 700, color: locked ? '#94A3B8' : (textColors[emoji] || '#64748B'), margin: '2px 0 0', fontFamily: 'Nunito, sans-serif' }}>{label}</p>
    </div>
  );
}
