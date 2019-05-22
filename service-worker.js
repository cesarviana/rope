var CACHE_NAME = 'rope-cache-6'
var filesToCache = [
    '/',
    'index.html',
    'src/topcodes/topcodes.js',
    'dist/topcodes.js',
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
