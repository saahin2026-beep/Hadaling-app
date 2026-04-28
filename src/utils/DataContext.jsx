import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { fetchPhrases, fetchOnboardingContent } from './dataService';
import { reportError } from './observability';

import hardcodedLessonData from '../data/lessonData';
import { lessons as hardcodedLessonsList } from '../data/lessons';
import {
  feedbackPhrases as hardcodedFeedback,
  encouragementPhrases as hardcodedEncouragement,
  celebrationPhrases as hardcodedCelebration,
} from '../data/phrases';

const DataContext = createContext(null);
const CACHE_VERSION = 'v5'; // Increment when curriculum changes
const PHRASES_CACHE_VERSION = 'v1'; // Increment when phrase content changes

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

export function DataProvider({ children }) {
  const lessons = useMemo(() => getInitialLessons(), []);
  const [phrases, setPhrases] = useState(() => getInitialPhrases());
  const [onboardingContent, setOnboardingContent] = useState(null);

  useEffect(() => {
    async function syncFromSupabase() {
      try {
        const phrasesResult = await fetchPhrases();
        if (phrasesResult?.feedback?.length > 0) {
          setPhrases(phrasesResult);
        }
      } catch (e) {
        reportError(e, { where: 'DataContext.syncPhrases' });
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
