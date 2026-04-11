const CACHE_NAME = 'hadaling-v5';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/mascot/geel-happy.png',
  '/branding/favicon-192.png',
  '/branding/app-icon-1024.png',
];

// All 140 audio files — cached in background after install
const AUDIO_URLS = [
  '/audio/lessons/lesson-1/1-a.mp3','/audio/lessons/lesson-1/1-b.mp3','/audio/lessons/lesson-1/1-c.mp3','/audio/lessons/lesson-1/1-d.mp3','/audio/lessons/lesson-1/1-e.mp3','/audio/lessons/lesson-1/listen-5.mp3',
  '/audio/lessons/lesson-2/2-a.mp3','/audio/lessons/lesson-2/2-b.mp3','/audio/lessons/lesson-2/2-c.mp3','/audio/lessons/lesson-2/2-d.mp3','/audio/lessons/lesson-2/2-e.mp3','/audio/lessons/lesson-2/listen-5.mp3',
  '/audio/lessons/lesson-3/3-a.mp3','/audio/lessons/lesson-3/3-b.mp3','/audio/lessons/lesson-3/3-c.mp3','/audio/lessons/lesson-3/3-d.mp3','/audio/lessons/lesson-3/3-e.mp3','/audio/lessons/lesson-3/listen-5.mp3',
  '/audio/lessons/lesson-4/4-a.mp3','/audio/lessons/lesson-4/4-b.mp3','/audio/lessons/lesson-4/4-c.mp3','/audio/lessons/lesson-4/4-d.mp3','/audio/lessons/lesson-4/4-e.mp3','/audio/lessons/lesson-4/listen-5.mp3',
  '/audio/lessons/lesson-5/5-a.mp3','/audio/lessons/lesson-5/5-b.mp3','/audio/lessons/lesson-5/5-c.mp3','/audio/lessons/lesson-5/5-d.mp3','/audio/lessons/lesson-5/5-e.mp3','/audio/lessons/lesson-5/listen-5.mp3',
  '/audio/lessons/lesson-6/6-a.mp3','/audio/lessons/lesson-6/6-b.mp3','/audio/lessons/lesson-6/6-c.mp3','/audio/lessons/lesson-6/6-d.mp3','/audio/lessons/lesson-6/6-e.mp3','/audio/lessons/lesson-6/listen-5.mp3',
  '/audio/lessons/lesson-7/7-a.mp3','/audio/lessons/lesson-7/7-b.mp3','/audio/lessons/lesson-7/7-c.mp3','/audio/lessons/lesson-7/7-d.mp3','/audio/lessons/lesson-7/7-e.mp3','/audio/lessons/lesson-7/listen-5.mp3',
  '/audio/lessons/lesson-8/8-a.mp3','/audio/lessons/lesson-8/8-b.mp3','/audio/lessons/lesson-8/8-c.mp3','/audio/lessons/lesson-8/8-d.mp3','/audio/lessons/lesson-8/8-e.mp3','/audio/lessons/lesson-8/listen-5.mp3',
  '/audio/lessons/lesson-9/9-a.mp3','/audio/lessons/lesson-9/9-b.mp3','/audio/lessons/lesson-9/9-c.mp3','/audio/lessons/lesson-9/9-d.mp3','/audio/lessons/lesson-9/9-e.mp3','/audio/lessons/lesson-9/listen-5.mp3',
  '/audio/lessons/lesson-10/10-a.mp3','/audio/lessons/lesson-10/10-b.mp3','/audio/lessons/lesson-10/10-c.mp3','/audio/lessons/lesson-10/10-d.mp3','/audio/lessons/lesson-10/10-e.mp3','/audio/lessons/lesson-10/listen-5.mp3',
  '/audio/practice/vocabulary/bread.mp3','/audio/practice/vocabulary/brother.mp3','/audio/practice/vocabulary/father.mp3','/audio/practice/vocabulary/green.mp3','/audio/practice/vocabulary/mother.mp3','/audio/practice/vocabulary/red.mp3','/audio/practice/vocabulary/rice.mp3','/audio/practice/vocabulary/sister.mp3','/audio/practice/vocabulary/tomato.mp3','/audio/practice/vocabulary/yellow.mp3',
  '/audio/practice/word-formation/apple.mp3','/audio/practice/word-formation/children.mp3','/audio/practice/word-formation/family.mp3','/audio/practice/word-formation/friend.mp3','/audio/practice/word-formation/green.mp3','/audio/practice/word-formation/hospital.mp3','/audio/practice/word-formation/mother.mp3','/audio/practice/word-formation/school.mp3','/audio/practice/word-formation/teacher.mp3','/audio/practice/word-formation/water.mp3',
  '/audio/practice/sentence-builder/can-you-help-me-please.mp3','/audio/practice/sentence-builder/he-is-happy.mp3','/audio/practice/sentence-builder/i-am-from-somalia.mp3','/audio/practice/sentence-builder/i-love-you.mp3','/audio/practice/sentence-builder/i-want-water.mp3','/audio/practice/sentence-builder/i-work-as-a-teacher.mp3','/audio/practice/sentence-builder/my-name-is-ahmed.mp3','/audio/practice/sentence-builder/she-goes-to-school.mp3','/audio/practice/sentence-builder/the-children-are-playing.mp3','/audio/practice/sentence-builder/where-are-you-from.mp3',
  '/audio/wotd/afternoon.mp3','/audio/wotd/bad.mp3','/audio/wotd/big.mp3','/audio/wotd/can-you-help.mp3','/audio/wotd/closed.mp3','/audio/wotd/cold.mp3','/audio/wotd/evening.mp3','/audio/wotd/excuse-me.mp3','/audio/wotd/fast.mp3','/audio/wotd/food.mp3','/audio/wotd/good.mp3','/audio/wotd/goodbye.mp3','/audio/wotd/hello.mp3','/audio/wotd/help.mp3','/audio/wotd/here.mp3','/audio/wotd/hot.mp3','/audio/wotd/how-much.mp3','/audio/wotd/how.mp3','/audio/wotd/i-dont-understand.mp3','/audio/wotd/i-have.mp3','/audio/wotd/i-need.mp3','/audio/wotd/i-understand.mp3','/audio/wotd/i-want.mp3','/audio/wotd/left.mp3','/audio/wotd/money.mp3','/audio/wotd/morning.mp3','/audio/wotd/new.mp3','/audio/wotd/night.mp3','/audio/wotd/no.mp3','/audio/wotd/old.mp3','/audio/wotd/open.mp3','/audio/wotd/please.mp3','/audio/wotd/repeat-please.mp3','/audio/wotd/right.mp3','/audio/wotd/slow.mp3','/audio/wotd/small.mp3','/audio/wotd/sorry.mp3','/audio/wotd/speak-slowly.mp3','/audio/wotd/thank-you.mp3','/audio/wotd/there.mp3','/audio/wotd/today.mp3','/audio/wotd/tomorrow.mp3','/audio/wotd/water.mp3','/audio/wotd/what.mp3','/audio/wotd/when.mp3','/audio/wotd/where.mp3','/audio/wotd/who.mp3','/audio/wotd/why.mp3','/audio/wotd/yes.mp3','/audio/wotd/yesterday.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Precache critical assets first (fast install)
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      // Cache all audio in background after activation (doesn't block the app)
      caches.open(CACHE_NAME).then((cache) => {
        AUDIO_URLS.forEach((url) => {
          cache.match(url).then((existing) => {
            if (!existing) {
              fetch(url).then((response) => {
                if (response.ok) cache.put(url, response);
              }).catch(() => {}); // Silently skip if offline
            }
          });
        });
      });
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // Audio files: cache first (already precached or cached on play)
  if (url.pathname.startsWith('/audio/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => new Response('', { status: 404 }));
      })
    );
    return;
  }

  // JS/CSS chunks: cache first (hashed filenames)
  if (url.pathname.match(/\/assets\/.*\.(js|css)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Navigation: network first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Other assets (images, fonts): cache first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
