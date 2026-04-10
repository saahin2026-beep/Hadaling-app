import lessonData from '../data/lessonData';
import { storage } from './storage';

/**
 * Generate weighted Daily Mix exercises
 * 40% weak (wrong answers), 40% recent (last 3 days), 20% decay (not seen 3+ days)
 */
export function generateDailyMix() {
  const state = storage.get();
  const completedIds = (state.lessonsCompleted || []).map(Number);

  if (completedIds.length === 0) return [];

  const chunkStats = state.chunkStats || {};
  const weakChunks = state.weakChunks || [];
  const now = new Date();
  const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000);

  const allExercises = completedIds.flatMap(id => {
    const lesson = lessonData[id];
    if (!lesson) return [];
    return lesson.exercises.map(ex => ({ ...ex, lessonId: id }));
  });

  const recent = [];
  const weak = [];
  const decayed = [];

  allExercises.forEach(ex => {
    const chunkIds = (ex.chunkId || '').split(',');
    const isWeak = chunkIds.some(c => weakChunks.includes(c.trim()));
    const stat = chunkStats[chunkIds[0]];
    const lastSeen = stat?.lastSeen ? new Date(stat.lastSeen) : null;

    if (isWeak) {
      weak.push(ex);
    } else if (!lastSeen || lastSeen > threeDaysAgo) {
      recent.push(ex);
    } else {
      decayed.push(ex);
    }
  });

  const picked = [];
  picked.push(...pickRandom(weak, 6));
  picked.push(...pickRandom(recent, 6));
  picked.push(...pickRandom(decayed, 3));

  while (picked.length < 15 && allExercises.length > 0) {
    const remaining = allExercises.filter(e => !picked.includes(e));
    if (remaining.length === 0) break;
    picked.push(...pickRandom(remaining, 15 - picked.length));
  }

  return shuffle(picked).slice(0, 15);
}

function pickRandom(arr, count) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(count, arr.length));
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function saveChunkStats(results) {
  const state = storage.get();
  const stats = state.chunkStats || {};

  results.forEach(({ chunkId, correct }) => {
    if (!chunkId) return;
    const ids = chunkId.split(',').map(s => s.trim());
    ids.forEach(id => {
      if (!stats[id]) {
        stats[id] = { timesCorrect: 0, timesWrong: 0, isWeak: false, correctStreak: 0, lastSeen: null };
      }
      stats[id].lastSeen = new Date().toISOString();
      if (correct) {
        stats[id].timesCorrect++;
        stats[id].correctStreak++;
        if (stats[id].correctStreak >= 3) stats[id].isWeak = false;
      } else {
        stats[id].timesWrong++;
        stats[id].correctStreak = 0;
        stats[id].isWeak = true;
      }
    });
  });

  const weakChunks = Object.entries(stats)
    .filter(([_, s]) => s.isWeak)
    .map(([id]) => id);

  storage.update({ chunkStats: stats, weakChunks });
}
