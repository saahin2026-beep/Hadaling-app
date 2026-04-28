const STORAGE_KEY = 'hadaling:state';
const LEGACY_STORAGE_KEY = 'hadaling';

function defaultState() {
  return {
    onboardingComplete: false,
    intent: null,
    comfort: null,
    guestMode: true,
    currentLesson: 1,
    lessonsCompleted: [],
    xp: 0,
    dahab: 0,
    streak: 0,
    lastActiveDate: null,
    longestStreak: 0,
    language: 'so',
    authComplete: false,
    profileComplete: false,
    userId: null,
    userName: '',
    username: '',
    profileDraft: null,
    practiceCompleted: {},
    chunkStats: {},
    weakChunks: [],
    dailyPractice: {
      date: null,
      progress: 0,
      completed: false,
      exercises: [],
      correctCount: 0,
    },
    dailyStreak: 0,
    longestDailyStreak: 0,
    lastDailyDate: null,
    yaabViewedDate: null,
  };
}

function getToday() {
  return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function readRaw() {
  let raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      localStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      raw = legacy;
    }
  }
  return raw;
}

export const storage = {
  get() {
    try {
      const raw = readRaw();
      return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
    } catch {
      return defaultState();
    }
  },

  set(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // Quota exceeded etc. Surface to error tracking via dynamic import to
      // avoid a circular dep with observability (which doesn't import storage,
      // but we keep it dynamic for safety + zero overhead in the happy path).
      import('./observability').then((m) => m.reportError(e, { where: 'storage.set' })).catch(() => {});
    }
  },

  update(partial) {
    const current = this.get();
    this.set({ ...current, ...partial });
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
  },

  completeLesson(lessonId, dahabEarned = 0) {
    const current = this.get();
    const completed = current.lessonsCompleted || [];
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
    }

    // Streak logic
    const today = getToday();
    const yesterday = getYesterday();
    let { streak, lastActiveDate, longestStreak } = current;

    if (lastActiveDate === today) {
      // Already active today, no streak change
    } else if (lastActiveDate === yesterday) {
      // Consecutive day — increment streak
      streak += 1;
    } else {
      // Missed a day (or first time) — reset to 1
      streak = 1;
    }

    if (streak > (longestStreak || 0)) {
      longestStreak = streak;
    }

    this.set({
      ...current,
      lessonsCompleted: completed,
      currentLesson: Math.min(Math.max(current.currentLesson, lessonId + 1), 10),
      xp: (current.xp || 0) + 10,
      dahab: (current.dahab || 0) + dahabEarned,
      streak,
      lastActiveDate: today,
      longestStreak,
    });
  },

  checkDailyReset() {
    const current = this.get();
    const today = getToday();

    if (current.dailyPractice?.date !== today) {
      const yesterday = getYesterday();
      const streakBroken = current.lastDailyDate !== yesterday && current.lastDailyDate !== today;

      this.update({
        dailyPractice: {
          date: today,
          progress: 0,
          completed: false,
          exercises: [],
          correctCount: 0,
        },
        dailyStreak: streakBroken ? 0 : current.dailyStreak,
      });
    }
  },

  completeDailyPractice(correctCount) {
    const current = this.get();
    const today = getToday();
    const newStreak = (current.dailyStreak || 0) + 1;

    const roll = Math.random() * 100;
    let dahabEarned;
    let dahabTier;
    if (roll < 2) {
      dahabEarned = Math.floor(Math.random() * 31) + 50;
      dahabTier = 'jackpot';
    } else if (roll < 20) {
      dahabEarned = Math.floor(Math.random() * 21) + 20;
      dahabTier = 'mid';
    } else {
      dahabEarned = Math.floor(Math.random() * 11) + 5;
      dahabTier = 'normal';
    }

    this.update({
      dailyPractice: {
        ...current.dailyPractice,
        completed: true,
        correctCount,
        dahabEarned,
        dahabTier,
      },
      dailyStreak: newStreak,
      longestDailyStreak: Math.max(newStreak, current.longestDailyStreak || 0),
      lastDailyDate: today,
      xp: (current.xp || 0) + (correctCount * 10),
      dahab: (current.dahab || 0) + dahabEarned,
    });

    return { dahabEarned, dahabTier };
  },

  // Call this on app load to check if streak should reset
  checkStreak() {
    const current = this.get();
    const today = getToday();
    const yesterday = getYesterday();

    if (current.lastActiveDate && current.lastActiveDate !== today && current.lastActiveDate !== yesterday) {
      // Missed a day — reset streak
      this.update({ streak: 0 });
    }
  },
};
