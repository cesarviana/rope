var CACHE_NAME = 'rope-cache-6'
var filesToCache = [
    '/',
    'index.html',
    'favicon-16x16.png',
    'favicon.ico',
    'manifest.json',
    'browserconfig.xml',
    'android-chrome-192x192.png',
    'android-chrome-384x384.png',
    'android-chrome-530x530.png',
    'dist/app.js',
    'assets/highlight.svg',
    'assets/f.svg',
    'assets/f_exit.svg',
    'assets/go.svg',
    'assets/go_active.svg',
    'assets/go_disabled.svg',
    'assets/go_back_exit.svg',
    'assets/go_back.svg',
    'assets/ico_48.svg',
    'assets/ico36.png',
    'assets/ico48.png',
    'assets/magnifying.svg',
    'assets/placeholder.svg',
    'assets/pointer.svg',
    'assets/rope_2.svg', 
    'assets/rope_hide.svg',
    'assets/rope_magnifying.svg',
    'assets/rope_not_found_2.svg',
    'assets/rope_not_found.svg',
    'assets/rope.svg',
    'assets/snapsound.mp3',
    'assets/startsound.wav',
    'assets/steps.svg',
    'assets/stopsound.wav',
    'assets/l_exit.svg',
    'assets/l.svg',
    'assets/r_exit.svg',
    'assets/r.svg',
    'assets/searching.svg',
    'assets/highlight.svg',
    'assets/next.wav',
    'mstile-150x150.png',
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
