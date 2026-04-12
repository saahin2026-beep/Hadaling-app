import { useEffect, useState } from 'react';
import { checkStreakStatus } from '../utils/streak';
import { storage } from '../utils/storage';
import { purchaseStreakFreeze } from '../utils/streak';
import StreakBrokenModal from './StreakBrokenModal';
import StreakFreezeUsedModal from './StreakFreezeUsedModal';

export default function AppShell({ children }) {
  const [streakModal, setStreakModal] = useState(null);

  useEffect(() => {
    const status = checkStreakStatus();
    const modal = status.status === 'broken' && status.lostStreak > 0
      ? { type: 'broken', lostStreak: status.lostStreak }
      : status.status === 'freeze_used'
        ? { type: 'freeze_used', streak: status.streak, freezesUsed: status.freezesUsed, freezesRemaining: status.freezesRemaining }
        : null;
    if (modal) setStreakModal(modal);
  }, []);

  const handleBuyFreeze = () => {
    const state = storage.get();
    const result = purchaseStreakFreeze(state.dahab || 0, (amount) => {
      storage.update({ dahab: (state.dahab || 0) - amount });
    });
    if (!result.success) alert(result.message);
    else setStreakModal(null);
  };

  return (
    <div className="app-shell">
      {children}

      {streakModal?.type === 'broken' && (
        <StreakBrokenModal
          lostStreak={streakModal.lostStreak}
          onClose={() => setStreakModal(null)}
          onBuyFreeze={handleBuyFreeze}
          onStartLesson={() => { setStreakModal(null); window.location.href = `/lesson/${storage.get().currentLesson || 1}`; }}
        />
      )}

      {streakModal?.type === 'freeze_used' && (
        <StreakFreezeUsedModal
          streak={streakModal.streak}
          freezesUsed={streakModal.freezesUsed}
          freezesRemaining={streakModal.freezesRemaining}
          onClose={() => setStreakModal(null)}
        />
      )}
    </div>
  );
}
