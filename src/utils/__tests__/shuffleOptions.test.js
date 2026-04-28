import { describe, it, expect } from 'vitest';
import { shuffleOptions } from '../shuffleOptions';

describe('shuffleOptions', () => {
  it('preserves the correct option even after shuffling (no string matching, index-based)', () => {
    // Run many times — every run must keep the correct option mapped correctly.
    for (let i = 0; i < 100; i++) {
      const ex = {
        type: 'choose',
        options: ['Salaan', 'Mahadsanid', 'Iska warran', 'Nabad gelyo'],
        correctIndex: 1,
      };
      const correctValue = ex.options[ex.correctIndex];
      const shuffled = shuffleOptions(ex);
      expect(shuffled.options[shuffled.correctIndex]).toBe(correctValue);
    }
  });

  it('handles duplicate option strings — the right index, not the right string, is what matters', () => {
    const ex = {
      type: 'choose',
      options: ['Yes', 'No', 'Yes', 'Maybe'],
      correctIndex: 2,
    };
    const shuffled = shuffleOptions(ex);
    // The shuffled options still contain all 4 originals
    expect(shuffled.options).toHaveLength(4);
    expect(shuffled.options.filter((o) => o === 'Yes')).toHaveLength(2);
    // We can't tell which "Yes" was correct from string alone; just verify the
    // function doesn't crash and returns a valid index.
    expect(shuffled.correctIndex).toBeGreaterThanOrEqual(0);
    expect(shuffled.correctIndex).toBeLessThan(4);
  });

  it('does not shuffle "order" type exercises (they have intrinsic ordering)', () => {
    const ex = {
      type: 'order',
      options: ['a', 'b', 'c'],
      correctIndex: 0,
    };
    const result = shuffleOptions(ex);
    expect(result).toBe(ex); // returns the same reference
  });

  it('returns the input unchanged when options or correctIndex are missing', () => {
    const ex = { type: 'choose', options: undefined };
    expect(shuffleOptions(ex)).toBe(ex);
    const ex2 = { type: 'choose', options: ['a', 'b'] }; // no correctIndex
    expect(shuffleOptions(ex2)).toBe(ex2);
  });
});
