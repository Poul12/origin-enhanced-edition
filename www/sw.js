
// sw.js (prosty)
const CACHE_NAME = 'rpg-assets-v1';
const ASSETS_TO_CACHE = [
  'https://Poul12.github.io/rpglooter-assets/img/backgrounds/warrior.png',
  'https://Poul12.github.io/rpglooter-assets/img/backgrounds/tree-skills-bg.png',
  // dodaj tu ważne pliki
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
