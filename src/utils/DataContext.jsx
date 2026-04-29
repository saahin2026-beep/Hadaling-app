import { createContext, useContext, useState, useEffect } from 'react';
import { fetchLessons, fetchPhrases, fetchOnboardingContent, fetchPracticeFeatures } from './dataService';
import { reportError } from './observability';

import hardcodedLessonData from '../data/lessonData';
import { lessons as hardcodedLessonsList } from '../data/lessons';
import hardcodedPracticeFeatures from '../data/practiceFeatures';
import {
  feedbackPhrases as hardcodedFeedback,
  encouragementPhrases as hardcodedEncouragement,
  celebrationPhrases as hardcodedCelebration,
} from '../data/phrases';

const DataContext = createContext(null);

// Bump these when the underlying schema/content shape changes — that
// invalidates stale localStorage caches and forces a re-fetch.
const CACHE_VERSION = 'v5';
const PHRASES_CACHE_VERSION = 'v1';
const PRACTICE_FEATURES_CACHE_VERSION = 'v1';

function getInitialLessons() {
  try {
    const cached = localStorage.getItem('hadaling-data-cache');
    const version = localStorage.getItem('hadaling-cache-version');

    if (version !== CACHE_VERSION) {
      localStorage.removeItem('hadaling-data-cache');
      localStorage.setItem('hadaling-cache-version', CACHE_VERSION);
      return { lessonData: hardcodedLessonData, lessonsList: hardcodedLessonsList };
    }

    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.lessonData && Object.keys(parsed.lessonData).length > 0) return parsed;
    }
  } catch (e) {
    reportError(e, { where: 'DataContext.getInitialLessons' });
  }
  return { lessonData: hardcodedLessonData, lessonsList: hardcodedLessonsList };
}

function getInitialPhrases() {
  try {
    const version = localStorage.getItem('hadaling-phrases-cache-version');
    if (version !== PHRASES_CACHE_VERSION) {
      localStorage.removeItem('hadaling-phrases-cache');
      localStorage.setItem('hadaling-phrases-cache-version', PHRASES_CACHE_VERSION);
      return { feedback: hardcodedFeedback, encouragement: hardcodedEncouragement, celebration: hardcodedCelebration };
    }
    const cached = localStorage.getItem('hadaling-phrases-cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.feedback && parsed.feedback.length > 0) return parsed;
    }
  } catch (e) {
    reportError(e, { where: 'DataContext.getInitialPhrases' });
  }
  return {
    feedback: hardcodedFeedback,
    encouragement: hardcodedEncouragement,
    celebration: hardcodedCelebration,
  };
}

function getInitialPracticeFeatures() {
  try {
    const version = localStorage.getItem('hadaling-practice-features-cache-version');
    if (version !== PRACTICE_FEATURES_CACHE_VERSION) {
      localStorage.removeItem('hadaling-practice-features-cache');
      localStorage.setItem('hadaling-practice-features-cache-version', PRACTICE_FEATURES_CACHE_VERSION);
      return hardcodedPracticeFeatures;
    }
    const cached = localStorage.getItem('hadaling-practice-features-cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Object.keys(parsed).length > 0) return parsed;
    }
  } catch (e) {
    reportError(e, { where: 'DataContext.getInitialPracticeFeatures' });
  }
  return hardcodedPracticeFeatures;
}

export function DataProvider({ children }) {
  // Initial state seeds from cache (or hardcoded fallback) so the app
  // renders instantly. Then we sync from Supabase in useEffect and the
  // state replaces the seed once fresh data arrives.
  const [lessons, setLessons] = useState(() => getInitialLessons());
  const [phrases, setPhrases] = useState(() => getInitialPhrases());
  const [practiceFeatures, setPracticeFeatures] = useState(() => getInitialPracticeFeatures());
  const [onboardingContent, setOnboardingContent] = useState(null);

  useEffect(() => {
    async function syncFromSupabase() {
      try {
        const lessonsResult = await fetchLessons();
        if (lessonsResult?.lessonData && Object.keys(lessonsResult.lessonData).length > 0) {
          setLessons(lessonsResult);
        }
      } catch (e) {
        reportError(e, { where: 'DataContext.syncLessons' });
      }

      try {
        const phrasesResult = await fetchPhrases();
        if (phrasesResult?.feedback?.length > 0) {
          setPhrases(phrasesResult);
        }
      } catch (e) {
        reportError(e, { where: 'DataContext.syncPhrases' });
      }

      try {
        const practiceResult = await fetchPracticeFeatures();
        if (practiceResult && Object.keys(practiceResult).length > 0) {
          setPracticeFeatures(practiceResult);
        }
      } catch (e) {
        reportError(e, { where: 'DataContext.syncPracticeFeatures' });
      }

      try {
        const onboardingResult = await fetchOnboardingContent();
        if (onboardingResult) setOnboardingContent(onboardingResult);
      } catch (e) {
        reportError(e, { where: 'DataContext.syncOnboarding' });
      }
    }

    syncFromSupabase();
  }, []);

  const getRandomPhrase = (category) => {
    const list = phrases?.[category];
    if (!list || list.length === 0) return { text: '', emoji: '' };
    return list[Math.floor(Math.random() * list.length)];
  };

  return (
    <DataContext.Provider value={{
      lessonData: lessons.lessonData,
      lessonsList: lessons.lessonsList,
      phrases,
      practiceFeatures,
      loading: false,
      getRandomPhrase,
      onboardingContent,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
