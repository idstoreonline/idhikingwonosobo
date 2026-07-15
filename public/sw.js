const CACHE = 'idhr-v2';
const ASSETS = ['/', '/manifest.webmanifest', '/icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Never cache API responses (they must be fresh)
  if (url.pathname.startsWith('/api/')) return;
  // Stale-while-revalidate for images & static
  if (req.destination === 'image' || req.destination === 'style' || req.destination === 'script' || req.destination === 'font') {
    e.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const fetchPromise = fetch(req).then((res) => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        }).catch(()=>cached);
        return cached || fetchPromise;
      })
    );
    return;
  }
  // Network-first for pages, fallback to cache
  e.respondWith(
    fetch(req).then((res) => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(req, clone));
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('/')))
  );
});
