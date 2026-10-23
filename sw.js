// RitmoCoop – service worker: deixa o app abrir mesmo sem internet.
const CACHE = 'ritmocoop-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './firebase-config.js', './icons/icon-192.png', './icons/icon-512.png', './icons/favicon.svg'];
// Fontes e bibliotecas do Firebase podem ficar em cache.
// O banco de dados e o login (firestore/googleapis) nunca passam pelo cache.
const CACHEABLE_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const firebaseLib = url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/');
  if (!sameOrigin && !firebaseLib && !CACHEABLE_HOSTS.includes(url.hostname)) return;

  // Página e configuração: rede primeiro (pega atualizações), cache se estiver sem internet.
  if (req.mode === 'navigate' || (sameOrigin && url.pathname.endsWith('firebase-config.js'))) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? './index.html' : req, copy));
        return res;
      }).catch(() => caches.match(req.mode === 'navigate' ? './index.html' : req))
    );
    return;
  }
  // Ícones, fontes e bibliotecas: cache primeiro.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
