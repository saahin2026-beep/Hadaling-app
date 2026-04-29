import { supabase } from '../utils/supabase';

// The 49 wotd audio files that ship in public/audio/wotd/. Keep this in
// sync with that directory and with the precache list in public/sw.js.
// An admin can add any English word to word_of_day, but only words whose
// slug matches one of these files will actually play — the others get
// filtered out before the daily picker sees them. Without this guard the
// daily rotation silently lands on words with no audio.
export const WOTD_AUDIO_SLUGS = new Set([
  'afternoon', 'bad', 'big', 'can-you-help', 'closed', 'cold', 'evening',
  'excuse-me', 'fast', 'food', 'good', 'goodbye', 'hello', 'help', 'here',
  'hot', 'how-much', 'how', 'i-dont-understand', 'i-have', 'i-need',
  'i-understand', 'i-want', 'left', 'money', 'morning', 'new', 'night',
  'no', 'old', 'open', 'please', 'repeat-please', 'right', 'slow', 'small',
  'sorry', 'speak-slowly', 'thank-you', 'there', 'today', 'tomorrow',
  'water', 'what', 'when', 'where', 'who', 'why', 'yes', 'yesterday',
]);

const slugify = (englishWord) =>
  englishWord.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

export const hasWordAudio = (englishWord) => WOTD_AUDIO_SLUGS.has(slugify(englishWord));

const fallbackWords = [
  { en: "Hello", so: "Salaan" },
  { en: "Goodbye", so: "Nabad gelyo" },
  { en: "Thank you", so: "Mahadsanid" },
  { en: "Please", so: "Fadlan" },
  { en: "Sorry", so: "Waan ka xumahay" },
  { en: "Yes", so: "Haa" },
  { en: "No", so: "Maya" },
];

let cachedWords = null;

const filterPlayable = (words) => words.filter((w) => hasWordAudio(w.en));

export const fetchDailyWords = async () => {
  try {
    const { data, error } = await supabase
      .from('word_of_day')
      .select('english, somali, category')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      const playable = data.filter((w) => hasWordAudio(w.english));
      if (playable.length > 0) {
        cachedWords = playable.map((w) => ({ en: w.english, so: w.somali, category: w.category }));
        localStorage.setItem('wotd_cache', JSON.stringify(cachedWords));
        return cachedWords;
      }
    }
  } catch (e) {
    import('../utils/observability').then((m) => m.reportError(e, { where: 'wordOfTheDay.fetchDailyWords' })).catch(() => {});
  }

  const cached = localStorage.getItem('wotd_cache');
  if (cached) {
    const parsed = filterPlayable(JSON.parse(cached));
    if (parsed.length > 0) {
      cachedWords = parsed;
      return cachedWords;
    }
  }

  return fallbackWords;
};

const pickByDay = (words) => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
  return words[dayOfYear % words.length];
};

export const getDailyWord = async () => {
  const words = cachedWords || await fetchDailyWords();
  return pickByDay(words);
};

export const getDailyWordSync = () => {
  const cached = localStorage.getItem('wotd_cache');
  // Defensive filter — the cache may have been written by a prior version
  // before this guard existed and could still contain words with no audio.
  let words = cached ? filterPlayable(JSON.parse(cached)) : fallbackWords;
  if (words.length === 0) words = fallbackWords;
  return pickByDay(words);
};

export const getWordAudioPath = (englishWord) => `/audio/wotd/${slugify(englishWord)}.mp3`;
