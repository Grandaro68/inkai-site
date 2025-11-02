// Cache simple pour GitHub Pages
const CACHE = 'inkai-v1';
const ASSETS = [
  '/', '/index.html',
  '/assets/images/Inkai_headphones_frontpage.png',
  '/assets/images/Inkai_birth_frontpage.MOV',
  '/assets/fonts/Ethnocentric-Regular.otf',
  '/privacy.html', '/terms.html', '/cookies.html', '/cookies-settings.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  e.respondWith(
    caches.match(request).then(resp => {
      return resp || fetch(request).then(net => {
        // Cache-then-network pour les GET
        if (request.method === 'GET' && net.ok) {
          const copy = net.clone();
          caches.open(CACHE).then(c => c.put(request, copy));
        }
        return net;
      });
    })
  );
});
