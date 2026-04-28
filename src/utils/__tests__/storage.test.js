import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from '../storage';

beforeEach(() => {
  localStorage.clear();
});

describe('storage.get', () => {
  it('returns defaults when nothing is stored', () => {
    const s = storage.get();
    expect(s.onboardingComplete).toBe(false);
    expect(s.lessonsCompleted).toEqual([]);
    expect(s.xp).toBe(0);
    expect(s.dahab).toBe(0);
    expect(s.streak).toBe(0);
    expect(s.language).toBe('so');
    expect(s.guestMode).toBe(true);
    expect(s.profileDraft).toBeNull();
  });

  it('does NOT include userEmail (PII removal)', () => {
    const s = storage.get();
    expect(s.userEmail).toBeUndefined();
  });

  it('migrates from legacy "hadaling" key to "hadaling:state"', () => {
    localStorage.setItem('hadaling', JSON.stringify({ xp: 42, currentLesson: 3 }));
    const s = storage.get();
    expect(s.xp).toBe(42);
    expect(s.currentLesson).toBe(3);
    expect(localStorage.getItem('hadaling:state')).toBeTruthy();
    expect(localStorage.getItem('hadaling')).toBeNull();
  });

  it('returns defaults when stored JSON is corrupt', () => {
    localStorage.setItem('hadaling:state', '{not valid json}');
    const s = storage.get();
    expect(s.xp).toBe(0);
    expect(s.lessonsCompleted).toEqual([]);
  });
});

describe('storage.update', () => {
  it('shallow-merges into existing state', () => {
    storage.update({ xp: 100 });
    storage.update({ dahab: 50 });
    const s = storage.get();
    expect(s.xp).toBe(100);
    expect(s.dahab).toBe(50);
  });

  it('survives JSON round-trip without corrupting nested objects', () => {
    storage.update({ profileDraft: { username: 'ahmed', city: 'Muqdisho' } });
    expect(storage.get().profileDraft).toEqual({ username: 'ahmed', city: 'Muqdisho' });
  });
});

describe('storage.completeLesson', () => {
  beforeEach(() => {
    // Pin "today" to a deterministic date so tests don't depend on the wall clock.
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-28T10:00:00Z'));
  });

  it('starts a streak at 1 on first completion', () => {
    storage.completeLesson(1, 5);
    const s = storage.get();
    expect(s.streak).toBe(1);
    expect(s.longestStreak).toBe(1);
    expect(s.lessonsCompleted).toContain(1);
    expect(s.dahab).toBe(5);
    expect(s.xp).toBe(10);
  });

  it('increments streak on a consecutive day', () => {
    // Day 1
    storage.completeLesson(1, 5);
    // Day 2
    vi.setSystemTime(new Date('2026-04-29T10:00:00Z'));
    storage.completeLesson(2, 5);
    expect(storage.get().streak).toBe(2);
    expect(storage.get().longestStreak).toBe(2);
  });

  it('does not double-count lessons completed twice', () => {
    storage.completeLesson(1, 5);
    storage.completeLesson(1, 5);
    const s = storage.get();
    expect(s.lessonsCompleted).toEqual([1]);
    // XP and dahab still accrue twice — the dedup is on the lessonsCompleted list only
    expect(s.xp).toBe(20);
  });

  it('resets streak when a day is skipped', () => {
    storage.completeLesson(1, 5);
    vi.setSystemTime(new Date('2026-04-30T10:00:00Z')); // skipped 04-29
    storage.completeLesson(2, 5);
    expect(storage.get().streak).toBe(1);
    expect(storage.get().longestStreak).toBe(1);
  });

  it('caps currentLesson at 10', () => {
    storage.update({ currentLesson: 9 });
    storage.completeLesson(9, 0);
    expect(storage.get().currentLesson).toBe(10);
    storage.completeLesson(10, 0);
    expect(storage.get().currentLesson).toBe(10); // doesn't go past 10
  });
});

describe('storage.completeDailyPractice', () => {
  it('always returns a tier and dahabEarned', () => {
    const result = storage.completeDailyPractice(5);
    expect(['jackpot', 'mid', 'normal']).toContain(result.dahabTier);
    expect(result.dahabEarned).toBeGreaterThan(0);
  });

  it('adds the tier bonus to dahab and xp scaling per correct answer', () => {
    storage.update({ dahab: 100, xp: 0 });
    const result = storage.completeDailyPractice(7);
    const s = storage.get();
    expect(s.dahab).toBe(100 + result.dahabEarned);
    expect(s.xp).toBe(70); // 7 correct × 10 xp
    expect(s.dailyStreak).toBe(1);
  });
});

describe('storage.checkStreak', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-28T10:00:00Z'));
  });

  it('does nothing when last activity is today', () => {
    storage.update({ streak: 5, lastActiveDate: '2026-04-28' });
    storage.checkStreak();
    expect(storage.get().streak).toBe(5);
  });

  it('does nothing when last activity is yesterday (still within window)', () => {
    storage.update({ streak: 5, lastActiveDate: '2026-04-27' });
    storage.checkStreak();
    expect(storage.get().streak).toBe(5);
  });

  it('zeros the streak when more than a day has passed', () => {
    storage.update({ streak: 5, lastActiveDate: '2026-04-25' });
    storage.checkStreak();
    expect(storage.get().streak).toBe(0);
  });
});
