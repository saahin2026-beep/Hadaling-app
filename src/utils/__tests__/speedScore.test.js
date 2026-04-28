import { describe, it, expect } from 'vitest';
import {
  getSpeedTier,
  calculateDahabTimed,
  calculateDahabLesson,
  calculateAvgSpeedScore,
  SPEED_TIERS,
  LESSON_DAHAB_PER_CORRECT,
} from '../speedScore';

describe('getSpeedTier', () => {
  it('returns lightning for very fast responses', () => {
    expect(getSpeedTier(500).tier).toBe('lightning');
    expect(getSpeedTier(2000).tier).toBe('lightning');
  });

  it('walks tiers correctly at boundaries', () => {
    expect(getSpeedTier(2001).tier).toBe('fast');
    expect(getSpeedTier(4000).tier).toBe('fast');
    expect(getSpeedTier(4001).tier).toBe('quick');
    expect(getSpeedTier(8000).tier).toBe('good');
    expect(getSpeedTier(12000).tier).toBe('normal');
  });

  it('falls through to slow for very long responses', () => {
    expect(getSpeedTier(60000).tier).toBe('slow');
    expect(getSpeedTier(60000).bonus).toBe(1);
  });

  it('every tier has a positive bonus (sanity check)', () => {
    Object.values(SPEED_TIERS).forEach((t) => {
      expect(t.bonus).toBeGreaterThan(0);
    });
  });
});

describe('calculateDahabTimed', () => {
  it('returns 0 for wrong answers', () => {
    const r = calculateDahabTimed(500, false);
    expect(r.total).toBe(0);
    expect(r.tier).toBe('wrong');
  });

  it('rewards a correct answer based on speed tier', () => {
    expect(calculateDahabTimed(500, true).total).toBe(SPEED_TIERS.lightning.bonus);
    expect(calculateDahabTimed(50000, true).total).toBe(1);
  });
});

describe('calculateDahabLesson', () => {
  it('returns LESSON_DAHAB_PER_CORRECT for correct, 0 for wrong', () => {
    expect(calculateDahabLesson(true).total).toBe(LESSON_DAHAB_PER_CORRECT);
    expect(calculateDahabLesson(false).total).toBe(0);
  });
});

describe('calculateAvgSpeedScore', () => {
  it('returns 0 when there are no correct attempts', () => {
    expect(calculateAvgSpeedScore([])).toBe(0);
    expect(calculateAvgSpeedScore([{ correct: false, response_time_ms: 1000 }])).toBe(0);
  });

  it('averages bonus across correct attempts only', () => {
    // 2 lightning (20) + 1 fast (15) = 55 / 3 = 18.33
    const attempts = [
      { correct: true, response_time_ms: 500 },
      { correct: true, response_time_ms: 1500 },
      { correct: true, response_time_ms: 3000 },
      { correct: false, response_time_ms: 100 }, // ignored
    ];
    expect(calculateAvgSpeedScore(attempts)).toBeCloseTo(18.33, 1);
  });
});
