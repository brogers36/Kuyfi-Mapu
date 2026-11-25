/* Kuyfi Mapu · service worker: offline play + fresh updates when online. */
const CACHE = 'kuyfi-v1';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.url.indexOf('version.txt') >= 0) return; // always straight to the network
  if (/\.mp4(\?|$)/.test(req.url)) return; // the credits film streams from the network (range requests), never cached
  const nav = req.mode === 'navigate' || req.url.indexOf('/index.html') >= 0;
  if (nav) {
    // network first with forced revalidation, so a new build is picked up on the next online launch
    e.respondWith(fetch(req, { cache: 'no-cache' }).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => { c.put('./', copy.clone()); c.put('index.html', copy); });
      return r;
    }).catch(() => caches.match('./').then(r => r || caches.match('index.html'))));
  } else {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(f => {
      const copy = f.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return f;
    })));
  }
});
