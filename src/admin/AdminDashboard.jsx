import { useState } from 'react';
import LessonManager from './LessonManager';
import PhraseManager from './PhraseManager';
import OnboardingManager from './OnboardingManager';
import PracticeManager from './PracticeManager';
import ProfileSetupManager from './ProfileSetupManager';
import WordOfDayManager from './WordOfDayManager';

const TABS = [
  { key: 'lessons', label: 'Lessons' },
  { key: 'phrases', label: 'Phrases' },
  { key: 'wordofday', label: 'Word of Day' },
  { key: 'onboarding', label: 'Onboarding' },
  { key: 'practice', label: 'Practice' },
  { key: 'profilesetup', label: 'Profile Setup' },
];

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('lessons');

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ background: '#0891B2' }}>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>Hadaling Admin</span>
          <button type="button" onClick={onLogout} style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.4)',
            background: 'transparent', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif', flexShrink: 0,
          }}>Logout</button>
        </div>
        <div style={{
          display: 'flex', gap: 4, padding: '0 16px 10px',
          overflowX: 'auto', WebkitOverflowScrolling: 'touch',
        }}>
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : 'transparent',
              color: 'white', fontSize: 13, fontWeight: activeTab === tab.key ? 800 : 600,
              fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap', flexShrink: 0,
            }}>{tab.label}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: '24px 16px', maxWidth: 1000, margin: '0 auto' }}>
        {activeTab === 'lessons' && <LessonManager />}
        {activeTab === 'phrases' && <PhraseManager />}
        {activeTab === 'wordofday' && <WordOfDayManager />}
        {activeTab === 'onboarding' && <OnboardingManager />}
        {activeTab === 'practice' && <PracticeManager />}
        {activeTab === 'profilesetup' && <ProfileSetupManager />}
      </div>
    </div>
  );
}
