self.addEventListener('install', (event) => {
    console.log('서비스 워커 설치됨');
    event.waitUntil(
        caches.open('voice2text-cache').then((cache) => {
            return cache.addAll([
                'index.html',
                'styles.css',
                'script.js',
                'manifest.json'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
