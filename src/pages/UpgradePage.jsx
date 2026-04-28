import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Check, Crown } from '@phosphor-icons/react';
import { useLanguage } from '../utils/useLanguage';
import Geel from '../components/Geel';

export default function UpgradePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const initialPlan = location.state?.selectedPlan || 'plus';
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);

  const handlePurchase = () => {
    // TODO: payment integration
  };

  return (
    <div className="page-scroll" style={{ background: 'linear-gradient(180deg, #064E5E 0%, #0E7490 30%, #0891B2 70%, #0E7490 100%)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -60, right: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', left: -80, width: 180, height: 180, background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: -30, width: 150, height: 150, background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <style>{`@keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', position: 'relative', zIndex: 2 }}>
        <button onClick={() => navigate(-1)} style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={20} weight="bold" color="white" />
        </button>
        <p style={{ fontSize: 17, fontWeight: 800, color: 'white', margin: 0, fontFamily: 'Nunito, sans-serif' }}>
          {lang === 'en' ? 'Upgrade' : 'Kor u qaad'}
        </p>
        <div style={{ width: 44 }} />
      </div>

      <div style={{ padding: '0 20px 40px', position: 'relative', zIndex: 2 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
            <div style={{ width: 100, height: 100, background: 'linear-gradient(180deg, #FDE68A 0%, #FCD34D 30%, #F59E0B 70%, #D97706 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(245,158,11,0.4)' }}>
              <Geel size={60} expression="celebrating" />
            </div>
            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)' }}>
              <Crown size={32} weight="fill" color="#F59E0B" />
            </div>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'white', margin: '0 0 8px', fontFamily: 'Nunito, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>Hadaling Plus</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: 0, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5, fontFamily: 'Nunito, sans-serif' }}>
            {lang === 'en' ? 'Unlimited hearts, no ads, and exclusive features to learn faster' : 'Wadnaha oo dhan, xayeysiis la\'aan, iyo sifo gaar ah'}
          </p>
        </div>

        {/* Plans */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FreePlanCard lang={lang} />
          <PlanCard plan="plus" selected={selectedPlan === 'plus'} onSelect={() => setSelectedPlan('plus')} icon={<Heart size={28} weight="fill" color="white" />} iconBg="linear-gradient(135deg, #F59E0B, #D97706)" iconShadow="0 6px 16px rgba(245,158,11,0.35)" name="Plus" description={lang === 'en' ? 'Unlimited hearts, no ads' : 'Wadnaha oo dhan, xayeysiis la\'aan'} price="$5" priceColor="#B45309" badge={lang === 'en' ? 'Most Popular' : 'Ugu caanka'} badgeColor="#F59E0B" features={[lang === 'en' ? 'Unlimited hearts' : 'Wadnaha oo dhan', lang === 'en' ? 'No ads' : 'Xayeysiis la\'aan', lang === 'en' ? 'Streak freeze' : 'Streak freeze', lang === 'en' ? 'Progress insights' : 'Faahfaahin horumar']} highlight />
          <PlanCard plan="family" selected={selectedPlan === 'family'} onSelect={() => setSelectedPlan('family')} icon={<Users size={28} weight="fill" color="white" />} iconBg="linear-gradient(135deg, #8B5CF6, #7C3AED)" iconShadow="0 6px 16px rgba(139,92,246,0.35)" name="Family" description={lang === 'en' ? 'Up to 6 accounts' : 'Ilaa 6 koonto'} price="$9" priceColor="#7C3AED" badge={lang === 'en' ? 'Save 40%' : 'Kaydi 40%'} badgeColor="#8B5CF6" features={[lang === 'en' ? 'Everything in Plus' : 'Wax kasta oo Plus', lang === 'en' ? '6 accounts' : '6 koonto', lang === 'en' ? 'Family dashboard' : 'Maaraynta qoyska']} />
        </div>

        {selectedPlan !== 'free' && (
          <button onClick={handlePurchase} style={{ width: '100%', marginTop: 24, padding: 18, background: selectedPlan === 'plus' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #8B5CF6, #7C3AED)', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 800, color: 'white', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 0.5, boxShadow: selectedPlan === 'plus' ? '0 8px 24px rgba(245,158,11,0.4)' : '0 8px 24px rgba(139,92,246,0.4)', fontFamily: 'Nunito, sans-serif', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', animation: 'shimmer 2s infinite' }} />
            <span style={{ position: 'relative' }}>
              {lang === 'en' ? `Get ${selectedPlan === 'plus' ? 'Plus' : 'Family'}` : `Hel ${selectedPlan === 'plus' ? 'Plus' : 'Family'}`}
            </span>
          </button>
        )}

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, fontFamily: 'Nunito, sans-serif' }}>
            {lang === 'en' ? 'Cancel anytime · Restore purchases' : 'Jooji wakhti kasta · Soo celi iibka'}
          </p>
        </div>
      </div>
    </div>
  );
}

function FreePlanCard({ lang }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Heart size={26} color="rgba(255,255,255,0.5)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{ fontSize: 17, fontWeight: 800, color: 'white', margin: 0, fontFamily: 'Nunito, sans-serif' }}>Free</p>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#22D3EE', background: 'rgba(34,211,238,0.2)', padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase' }}>
              {lang === 'en' ? 'Current' : 'Hadda'}
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0', fontFamily: 'Nunito, sans-serif' }}>
            {lang === 'en' ? '5 hearts per day' : '5 wadne maalintiiba'}
          </p>
        </div>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'rgba(255,255,255,0.4)', margin: 0, fontFamily: 'Nunito, sans-serif' }}>$0</p>
      </div>
    </div>
  );
}

function PlanCard({ selected, onSelect, icon, iconBg, iconShadow, name, description, price, priceColor, badge, badgeColor, features, highlight }) {
  return (
    <div onClick={onSelect} style={{ background: 'white', borderRadius: highlight ? 22 : 20, padding: highlight ? 4 : 0, position: 'relative', boxShadow: highlight ? '0 12px 40px rgba(245,158,11,0.25)' : '0 8px 32px rgba(0,0,0,0.1)', cursor: 'pointer', border: selected ? `3px solid ${priceColor}` : 'none' }}>
      {highlight && (
        <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg, ${badgeColor}, ${badgeColor}dd)`, padding: '6px 16px', borderRadius: 20, boxShadow: `0 4px 12px ${badgeColor}66`, zIndex: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'Nunito, sans-serif' }}>{badge}</p>
        </div>
      )}
      <div style={{ background: highlight ? `linear-gradient(180deg, ${priceColor}15 0%, white 100%)` : `linear-gradient(180deg, ${priceColor}10 0%, white 100%)`, borderRadius: highlight ? 18 : 20, padding: '22px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, background: iconBg, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: iconShadow || 'none' }}>{icon}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', margin: 0, fontFamily: 'Nunito, sans-serif' }}>{name}</p>
            <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0', fontFamily: 'Nunito, sans-serif' }}>{description}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 24, fontWeight: 900, color: priceColor, margin: 0, fontFamily: 'Nunito, sans-serif' }}>{price}</p>
            <p style={{ fontSize: 11, color: '#94A3B8', margin: 0, fontFamily: 'Nunito, sans-serif' }}>/month</p>
          </div>
        </div>
        {features && features.length > 0 && (
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ECFDF5', padding: '6px 12px', borderRadius: 20 }}>
                  <Check size={14} weight="bold" color="#10B981" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#065F46', fontFamily: 'Nunito, sans-serif' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {selected && (
          <div style={{ position: 'absolute', top: 16, right: 16, width: 24, height: 24, background: priceColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={14} weight="bold" color="white" />
          </div>
        )}
      </div>
    </div>
  );
}
