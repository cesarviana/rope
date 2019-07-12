var CACHE_NAME = 'rope-cache-9'
var filesToCache = [
    '/',
    'index.html',
    'manifest.json',
    'assets/b_exit.svg',
    'assets/b.svg',
    'assets/error.flac',
    'assets/f_exit.svg',
    'assets/f.svg',
    'assets/go_active.svg',
    'assets/go_disabled.svg',
    'assets/go.svg',
    'assets/highlight.svg',
    'assets/ico_48.svg',
    'assets/l_exit.svg',
    'assets/l.svg',
    'assets/magnifying.svg',
    'assets/next.wav',
    'assets/placeholder.svg',
    'assets/pointer.svg',
    'assets/r_exit.svg',
    'assets/rope_184x188.png',
    'assets/rope_not_found_2.svg',
    'assets/rope_not_found.svg',
    'assets/rope.png',
    'assets/rope_shadow.svg',
    'assets/rope.svg',
    'assets/r.svg',
    'assets/snapsound.mp3',
    'assets/startsound.wav',
    'assets/steps.svg',
    'assets/stopsound.wav',
    'dist/app.js',
    'dist/style.css',
]

self.addEventListener('install', function(event) {
    console.log('A *new* Service Worker is installing.');
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache){
            cache.addAll(filesToCache)
        })
    )
});
  
self.addEventListener('activate', function(event) {
    console.log('Finally i\'m active. Ready to start serving content!');
});

self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request)
        .then(function(response){
            if(response)
                return response
            return fetch(event.request)
        })
    )
})
