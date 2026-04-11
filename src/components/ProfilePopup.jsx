import { useNavigate } from 'react-router-dom';
import { X, PencilSimple, ShareNetwork, Heart, Users, Star, Fire, CurrencyCircleDollar } from '@phosphor-icons/react';
import { storage } from '../utils/storage';
import { getStreakData, MILESTONES } from '../utils/streak';
import { useLanguage } from '../utils/useLanguage';
import Geel from './Geel';

export default function ProfilePopup({ onClose }) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const state = storage.get();
  const streakData = getStreakData();

  const { xp = 0, dahab = 0, userName, username, authComplete } = state;
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
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 360, background: 'white', borderRadius: 28, overflow: 'hidden', boxShadow: '0 25px 80px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover gradient */}
        <div style={{ position: 'relative', height: 90, background: 'linear-gradient(135deg, #064E5E 0%, #0891B2 50%, #22D3EE 100%)' }}>
          <div style={{ position: 'absolute', top: -30, right: -20, width: 120, height: 120, background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -20, left: 20, width: 80, height: 80, background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} weight="bold" color="white" />
          </button>
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: -45, position: 'relative', zIndex: 2 }}>
          <div style={{ width: 90, height: 90, background: 'linear-gradient(180deg, #FDE68A 0%, #FCD34D 30%, #F59E0B 70%, #D97706 100%)', borderRadius: '50%', border: '4px solid white', boxShadow: '0 8px 24px rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Geel size={55} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, background: 'linear-gradient(135deg, #0891B2, #0E7490)', borderRadius: '50%', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={12} weight="fill" color="white" />
            </div>
          </div>
        </div>

        {/* Name */}
        <div style={{ textAlign: 'center', padding: '10px 20px 0' }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', margin: 0, fontFamily: 'Nunito, sans-serif' }}>
            {userName || (lang === 'en' ? 'Guest' : 'Martida')}
          </p>
          {username && <p style={{ fontSize: 13, color: '#0891B2', margin: '3px 0 0', fontWeight: 600, fontFamily: 'Nunito, sans-serif' }}>@{username}</p>}
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '16px 16px 14px' }}>
          <StatBox value={streak} label="Streak" emoji="🔥" bg="#FFFBEB" border="rgba(245,158,11,0.15)" color="#B45309" />
          <StatBox value={xp >= 1000 ? `${(xp/1000).toFixed(1)}k` : xp} label="XP" emoji="⭐" bg="#ECFEFF" border="rgba(8,145,178,0.15)" color="#0E7490" />
          <StatBox value={dahab} label="Dahab" emoji="🪙" bg="#FEF3C7" border="rgba(245,158,11,0.15)" color="#B45309" />
          <StatBox value={hearts} label="Hearts" emoji="❤️" bg="#FEF2F2" border="rgba(239,68,68,0.15)" color="#DC2626" />
        </div>

        {/* Badges */}
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, margin: 0, fontFamily: 'Nunito, sans-serif' }}>
              {lang === 'en' ? 'Badges' : 'Calaamadaha'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {earnedBadges.slice(0, 3).map((b) => <BadgeBox key={b.day} emoji={b.badge} label={`${b.day} Day`} earned />)}
            {nextBadge && <BadgeBox emoji={nextBadge[1].badge} label={`${nextBadge[0]} Day`} locked />}
          </div>
        </div>

        {/* Subscription Plans */}
        <div style={{ padding: '0 16px 16px' }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 10px', fontFamily: 'Nunito, sans-serif' }}>
            {lang === 'en' ? 'Your Plan' : 'Qorshaha'}
          </p>

          {/* Free */}
          <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, background: '#E2E8F0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={22} color="#94A3B8" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#64748B', margin: 0, fontFamily: 'Nunito, sans-serif' }}>Free</p>
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'white', background: '#94A3B8', padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase' }}>
                    {lang === 'en' ? 'Current' : 'Hadda'}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0', fontFamily: 'Nunito, sans-serif' }}>
                  {lang === 'en' ? '5 hearts per day' : '5 wadne maalintiiba'}
                </p>
              </div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#94A3B8', margin: 0, fontFamily: 'Nunito, sans-serif' }}>$0</p>
            </div>
          </div>

          {/* Plus */}
          <div onClick={() => handleUpgrade('plus')} style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, white 100%)', border: '2px solid #F59E0B', borderRadius: 16, padding: '14px 16px', marginBottom: 10, position: 'relative', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', top: -10, right: 16, background: 'linear-gradient(135deg, #F59E0B, #D97706)', padding: '4px 10px', borderRadius: 12 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: 'white', textTransform: 'uppercase' }}>
                {lang === 'en' ? 'Popular' : 'Caanka'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
                <Heart size={22} weight="fill" color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#B45309', margin: 0, fontFamily: 'Nunito, sans-serif' }}>Plus</p>
                <p style={{ fontSize: 11, color: '#D97706', margin: '2px 0 0', fontFamily: 'Nunito, sans-serif' }}>
                  {lang === 'en' ? 'Unlimited hearts · No ads' : 'Wadnaha oo dhan · Xayeysiis la\'aan'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 18, fontWeight: 900, color: '#B45309', margin: 0, fontFamily: 'Nunito, sans-serif' }}>$5</p>
                <p style={{ fontSize: 9, color: '#D97706', margin: 0, fontFamily: 'Nunito, sans-serif' }}>/month</p>
              </div>
            </div>
          </div>

          {/* Family */}
          <div onClick={() => handleUpgrade('family')} style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, white 100%)', border: '2px solid #8B5CF6', borderRadius: 16, padding: '14px 16px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}>
                <Users size={22} weight="fill" color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#7C3AED', margin: 0, fontFamily: 'Nunito, sans-serif' }}>Family</p>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#8B5CF6', background: 'rgba(139,92,246,0.15)', padding: '2px 8px', borderRadius: 10 }}>
                    {lang === 'en' ? 'Save 40%' : 'Kaydi 40%'}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: '#A78BFA', margin: '2px 0 0', fontFamily: 'Nunito, sans-serif' }}>
                  {lang === 'en' ? '6 accounts · All Plus features' : '6 koonto · Plus oo dhan'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 18, fontWeight: 900, color: '#7C3AED', margin: 0, fontFamily: 'Nunito, sans-serif' }}>$9</p>
                <p style={{ fontSize: 9, color: '#A78BFA', margin: 0, fontFamily: 'Nunito, sans-serif' }}>/month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Share */}
        <div style={{ padding: '0 16px 20px' }}>
          <button style={{ width: '100%', padding: 12, background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'Nunito, sans-serif' }}>
            <ShareNetwork size={14} weight="bold" />
            {lang === 'en' ? 'Share profile' : 'La wadaag'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ value, label, emoji, bg, border, color }) {
  return (
    <div style={{ flex: 1, background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: '10px 6px', textAlign: 'center' }}>
      <p style={{ fontSize: 18, fontWeight: 800, color, margin: 0, fontFamily: 'Nunito, sans-serif' }}>{value}</p>
      <p style={{ fontSize: 9, fontWeight: 700, color, margin: '2px 0 0', textTransform: 'uppercase', fontFamily: 'Nunito, sans-serif' }}>{emoji} {label}</p>
    </div>
  );
}

function BadgeBox({ emoji, label, earned, locked }) {
  const bgColors = { '🔥': '#FEF3C7', '💪': '#ECFDF5', '🐪': '#ECFEFF', '⭐': '#F5F3FF', '👑': '#FEF3C7' };
  const textColors = { '🔥': '#B45309', '💪': '#065F46', '🐪': '#0E7490', '⭐': '#7C3AED', '👑': '#B45309' };
  return (
    <div style={{ flex: 1, background: locked ? '#F1F5F9' : (bgColors[emoji] || '#F1F5F9'), borderRadius: 12, padding: '10px 6px', textAlign: 'center', opacity: locked ? 0.5 : 1 }}>
      <span style={{ fontSize: 22, filter: locked ? 'grayscale(1)' : 'none' }}>{emoji}</span>
      <p style={{ fontSize: 9, fontWeight: 700, color: locked ? '#94A3B8' : (textColors[emoji] || '#64748B'), margin: '4px 0 0', fontFamily: 'Nunito, sans-serif' }}>{label}</p>
    </div>
  );
}
