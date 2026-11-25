/* Only the app shell is cached. Never stores photos, reports or browser history. */
const PREFIX = 'reloop-shell:' + self.registration.scope + ':';
const CACHE = PREFIX + 'v2-public-baselines';
const FILES = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './assets/mark.svg', './lib/data.js', './lib/baselines.js', './lib/model.js', './lib/report.js', './lib/storage.js'];
const URLs = FILES.map(file => new URL(file, self.registration.scope).href);
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(URLs)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url); url.search = ''; url.hash = '';
  if (!URLs.includes(url.href)) return;
  event.respondWith(caches.open(CACHE).then(cache => cache.match(event.request, { ignoreSearch: true })).then(cached => cached || fetch(event.request)));
});
