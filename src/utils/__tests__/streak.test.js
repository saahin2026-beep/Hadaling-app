import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStreakData,
  saveStreakData,
  checkStreakStatus,
  recordLessonCompletion,
  purchaseStreakFreeze,
  getNextMilestone,
  MILESTONES,
} from '../streak';

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-04-28T10:00:00Z'));
});

describe('getStreakData', () => {
  it('returns sensible defaults', () => {
    const d = getStreakData();
    expect(d.currentStreak).toBe(0);
    expect(d.longestStreak).toBe(0);
    expect(d.freezesOwned).toBe(0);
    expect(d.lastLessonDate).toBeNull();
  });

  it('hydrates partial saved data with defaults filled in', () => {
    saveStreakData({ currentStreak: 5 });
    const d = getStreakData();
    expect(d.currentStreak).toBe(5);
    expect(d.longestStreak).toBe(0); // default fills gap
    expect(d.milestonesClaimed).toBeDefined();
  });
});

describe('checkStreakStatus', () => {
  it('returns "new" when no streak history', () => {
    expect(checkStreakStatus().status).toBe('new');
  });

  it('returns "active" when last lesson was today', () => {
    saveStreakData({ currentStreak: 3, lastLessonDate: '2026-04-28' });
    expect(checkStreakStatus().status).toBe('active');
  });

  it('returns "pending" when last lesson was yesterday', () => {
    saveStreakData({ currentStreak: 3, lastLessonDate: '2026-04-27' });
    expect(checkStreakStatus().status).toBe('pending');
  });

  it('returns "broken" with the lost streak when more than a day has passed and no freezes', () => {
    saveStreakData({ currentStreak: 5, lastLessonDate: '2026-04-25', freezesOwned: 0 });
    const result = checkStreakStatus();
    expect(result.status).toBe('broken');
    expect(result.lostStreak).toBe(5);
    // Streak should now be reset
    expect(getStreakData().currentStreak).toBe(0);
  });

  it('uses freezes to save the streak when enough are owned', () => {
    saveStreakData({ currentStreak: 5, lastLessonDate: '2026-04-26', freezesOwned: 2 });
    // Missed 1 day (04-27) — 1 freeze used
    const result = checkStreakStatus();
    expect(result.status).toBe('freeze_used');
    expect(result.freezesUsed).toBe(1);
    expect(getStreakData().freezesOwned).toBe(1); // one consumed
    expect(getStreakData().currentStreak).toBe(5); // streak preserved
  });
});

describe('recordLessonCompletion', () => {
  it('starts streak at 1 on first lesson', () => {
    const result = recordLessonCompletion();
    expect(result.streakIncreased).toBe(true);
    expect(result.currentStreak).toBe(1);
    expect(getStreakData().currentStreak).toBe(1);
  });

  it('does not increment when lesson is completed twice on the same day', () => {
    recordLessonCompletion();
    const result = recordLessonCompletion();
    expect(result.streakIncreased).toBe(false);
    expect(getStreakData().currentStreak).toBe(1);
  });

  it('grants milestone reward when reaching a milestone day', () => {
    saveStreakData({ currentStreak: 2, lastLessonDate: '2026-04-27' });
    const result = recordLessonCompletion(); // bumps to 3
    expect(result.milestone).not.toBeNull();
    expect(result.milestone.day).toBe(3);
    expect(result.milestone.dahab).toBe(MILESTONES[3].dahab);
  });

  it('only grants each milestone once', () => {
    saveStreakData({ currentStreak: 2, lastLessonDate: '2026-04-27', milestonesClaimed: { 3: true, 7: false, 14: false, 30: false, 60: false, 100: false } });
    const result = recordLessonCompletion();
    expect(result.milestone).toBeNull(); // already claimed
  });
});

describe('purchaseStreakFreeze', () => {
  it('rejects when user already owns 2 freezes', () => {
    saveStreakData({ freezesOwned: 2 });
    const result = purchaseStreakFreeze(1000, () => {});
    expect(result.success).toBe(false);
  });

  it('rejects when the user has fewer than 50 dahab', () => {
    const result = purchaseStreakFreeze(49, () => {});
    expect(result.success).toBe(false);
  });

  it('deducts dahab and grants a freeze when conditions are met', () => {
    let deducted = 0;
    const result = purchaseStreakFreeze(50, (amount) => { deducted = amount; });
    expect(result.success).toBe(true);
    expect(deducted).toBe(50);
    expect(getStreakData().freezesOwned).toBe(1);
  });
});

describe('getNextMilestone', () => {
  it('returns the smallest milestone above the current streak', () => {
    expect(getNextMilestone(0).day).toBe(3);
    expect(getNextMilestone(3).day).toBe(7);
    expect(getNextMilestone(7).day).toBe(14);
  });

  it('returns null when past every milestone', () => {
    expect(getNextMilestone(101)).toBeNull();
  });
});
