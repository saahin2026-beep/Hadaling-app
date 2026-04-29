/**
 * Howler.js wrapper for audio playback with a small in-memory LRU cache.
 *
 * Keeping recently-loaded audio in memory across exercise navigation is
 * a perceived-perf win — the same lesson re-uses the same audio instances
 * instead of re-fetching. We cap at 30 to bound memory; oldest entries
 * are unloaded on insertion past the limit.
 *
 * Audio errors are intentionally silent (resolve with no value). Audio
 * failure shouldn't crash a lesson — the user just doesn't hear the
 * prompt, and the exercise still works.
 *
 * Audio file paths are static (/audio/lessons/<n>/<n>-<a-e>.mp3 etc.)
 * and precached by the service worker — see public/sw.js.
 */

import { Howl } from 'howler';

const MAX_CACHE_SIZE = 30;
// Map preserves insertion order — re-insert on access to track LRU.
const audioCache = new Map();

function touch(src) {
  const entry = audioCache.get(src);
  audioCache.delete(src);
  audioCache.set(src, entry);
  return entry;
}

function evictIfNeeded() {
  while (audioCache.size > MAX_CACHE_SIZE) {
    const [oldestKey, oldestSound] = audioCache.entries().next().value;
    audioCache.delete(oldestKey);
    try { oldestSound.stop(); oldestSound.unload(); } catch (_) { /* ignore */ }
  }
}

function getOrCreate(src, opts = {}) {
  if (audioCache.has(src)) return touch(src);
  const sound = new Howl({ src: [src], html5: true, preload: true, ...opts });
  audioCache.set(src, sound);
  evictIfNeeded();
  return sound;
}

export function playAudio(src) {
  return new Promise((resolve) => {
    try {
      const sound = getOrCreate(src, {
        onloaderror: () => { console.warn('Audio not found:', src); resolve(); },
        onplayerror: () => { console.warn('Audio play failed:', src); resolve(); },
      });
      sound.off('end').on('end', () => resolve());
      sound.play();
    } catch (err) {
      console.warn('Audio error:', src, err);
      resolve();
    }
  });
}

export function preloadAudio(sources) {
  sources.forEach((src) => getOrCreate(src));
}

export function stopAllAudio() {
  audioCache.forEach((sound) => {
    try { sound.stop(); } catch (_) { /* ignore */ }
  });
}

export function getChunkAudioPath(lessonId, chunkId) {
  return `/audio/lessons/lesson-${lessonId}/${chunkId.toLowerCase()}.mp3`;
}

export function getListenAudioPath(lessonId, exerciseIndex = 5) {
  return `/audio/lessons/lesson-${lessonId}/listen-${exerciseIndex}.mp3`;
}

export function getPracticeAudioPath(module, text) {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `/audio/practice/${module}/${slug}.mp3`;
}

export function getAudioPath(lessonId, englishText) {
  const slug = englishText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return `/audio/lessons/lesson-${lessonId}/${slug}.mp3`;
}
