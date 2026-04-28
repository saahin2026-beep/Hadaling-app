import { supabase } from './supabase';
import { reportError } from './observability';

const CACHE_KEY = 'hadaling-data-cache';

function getCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function setCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, cachedAt: Date.now() }));
  } catch (e) { reportError(e, { where: 'dataService.setCache' }); }
}

/**
 * Fetch all lessons with their exercises from Supabase.
 * Returns data in the same format as the old lessonData.js object.
 * Falls back to localStorage cache if offline.
 */
export async function fetchLessons() {
  try {
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (lessonsError) throw lessonsError;

    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('*')
      .eq('is_active', true)
      .order('lesson_id, sort_order', { ascending: true });

    if (exercisesError) throw exercisesError;

    // Transform into the app's expected format
    const lessonData = {};
    lessons.forEach((lesson) => {
      lessonData[lesson.id] = {
        id: lesson.id,
        titleSo: lesson.title_so,
        titleEn: lesson.title_en,
        ability: lesson.ability,
        explanation: lesson.explanation,
        chunks: lesson.chunks,
        exercises: exercises
          .filter((ex) => ex.lesson_id === lesson.id)
          .map((ex) => {
            const exercise = {
              type: ex.type,
              instruction: ex.instruction,
            };
            if (ex.type === 'choose' || ex.type === 'listen') {
              exercise.prompt = ex.prompt;
              exercise.correctIndex = ex.correct_index;
              exercise.options = ex.options;
            } else if (ex.type === 'fillgap') {
              exercise.sentence = ex.sentence;
              exercise.blankIndex = ex.blank_index;
              exercise.correctIndex = ex.correct_index;
              exercise.options = ex.options;
            } else if (ex.type === 'order') {
              exercise.correctSentence = ex.correct_sentence;
              exercise.words = ex.words;
            } else if (ex.type === 'scenario') {
              exercise.scenario = ex.scenario;
              exercise.correctIndex = ex.correct_index;
              exercise.options = ex.options;
            }
            return exercise;
          }),
      };
    });

    // Also build lessons list for Home screen
    const lessonsList = lessons.map((l) => ({
      id: l.id,
      titleSo: l.title_so,
      titleEn: l.title_en,
    }));

    const result = { lessonData, lessonsList };
    setCache(result);
    return result;
  } catch (err) {
    reportError(err, { where: 'dataService.fetchLessons' });
    const cached = getCache();
    if (cached) return cached;

    // Last resort: return null (app should handle this)
    return null;
  }
}

/**
 * Fetch all phrases from Supabase.
 * Returns { feedback: [...], encouragement: [...], celebration: [...] }
 */
export async function fetchPhrases() {
  try {
    const { data, error } = await supabase
      .from('phrases')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    const phrases = {
      feedback: data.filter((p) => p.category === 'feedback').map((p) => ({ text: p.text_so, emoji: p.emoji })),
      encouragement: data.filter((p) => p.category === 'encouragement').map((p) => ({ text: p.text_so, emoji: p.emoji })),
      celebration: data.filter((p) => p.category === 'celebration').map((p) => ({ text: p.text_so, emoji: p.emoji })),
    };

    localStorage.setItem('hadaling-phrases-cache', JSON.stringify(phrases));
    return phrases;
  } catch (err) {
    reportError(err, { where: 'dataService.fetchPhrases' });
    try {
      const cached = localStorage.getItem('hadaling-phrases-cache');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      reportError(e, { where: 'dataService.fetchPhrases.cacheRead' });
    }

    // Fallback to hardcoded (import from phrases.js still works)
    return null;
  }
}

/**
 * Fetch onboarding content from Supabase.
 * Returns an object keyed by screen_key.
 */
export async function fetchOnboardingContent() {
  try {
    const { data, error } = await supabase
      .from('onboarding_content')
      .select('*');

    if (error) throw error;

    const content = {};
    data.forEach((row) => { content[row.screen_key] = row.content; });

    localStorage.setItem('hadaling-onboarding-cache', JSON.stringify(content));
    return content;
  } catch (err) {
    reportError(err, { where: 'dataService.fetchOnboardingContent' });
    try {
      const cached = localStorage.getItem('hadaling-onboarding-cache');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      reportError(e, { where: 'dataService.fetchOnboardingContent.cacheRead' });
    }
    return null;
  }
}
