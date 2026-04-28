import { supabase } from '../utils/supabase';

const fallbackWords = [
  { en: "Hello", so: "Salaan" },
  { en: "Goodbye", so: "Nabad gelyo" },
  { en: "Thank you", so: "Mahadsanid" },
  { en: "Please", so: "Fadlan" },
  { en: "Happy", so: "Faraxsan" },
  { en: "Teacher", so: "Macallin" },
  { en: "Car", so: "Baabuur" },
];

let cachedWords = null;

export const fetchDailyWords = async () => {
  try {
    const { data, error } = await supabase
      .from('word_of_day')
      .select('english, somali, category')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      cachedWords = data.map(w => ({ en: w.english, so: w.somali, category: w.category }));
      localStorage.setItem('wotd_cache', JSON.stringify(cachedWords));
      return cachedWords;
    }
  } catch (e) {
    import('../utils/observability').then((m) => m.reportError(e, { where: 'wordOfTheDay.fetchDailyWords' })).catch(() => {});
  }

  const cached = localStorage.getItem('wotd_cache');
  if (cached) {
    cachedWords = JSON.parse(cached);
    return cachedWords;
  }

  return fallbackWords;
};

export const getDailyWord = async () => {
  const words = cachedWords || await fetchDailyWords();
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
  return words[dayOfYear % words.length];
};

export const getDailyWordSync = () => {
  const cached = localStorage.getItem('wotd_cache');
  const words = cached ? JSON.parse(cached) : fallbackWords;
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
  return words[dayOfYear % words.length];
};

export const getWordAudioPath = (englishWord) => {
  const slug = englishWord.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return `/audio/wotd/${slug}.mp3`;
};
