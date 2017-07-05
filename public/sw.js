var dataCacheName = 'LiveReaction';
var cachedName = 'LiveReaction';
var base = '';
var filesToCache = [
    base + '/',
    base + '/index.html',
    base + '/img/like.png',
    base + '/img/love.png',
    base + '/img/haha.png',
    base + '/img/wow.png',
    base + '/img/angry.png',
    base + '/img/sad.png',
    base + '/css/bootstrap.min.css',
    base + '/css/bootstrap-theme.min.css',
    base + '/js/jquery-3.2.1.min.js',
    base + '/js/bootstrap.min.js',
    base + '/fonts/glyphicons-halflings-regular.woff2',
    base + '/fonts/glyphicons-halflings-regular.woff',
    base + '/fonts/glyphicons-halflings-regular.ttf',
];

self.addEventListener('install', e => {
    console.log('[ServiceWorker] Installed')
    e.waitUntil(preCache())
})

self.addEventListener('fetch', e => {
    console.log('[ServiceWorker] Serving the asset.')
    e.respondWith(fromNetwork(e.request, 1000).catch(() => {
        return fromCache(e.request)
    }))
})

const preCache = () => {
    caches.open(cachedName).then((cache) => {
        console.log('[ServiceWorker] Caching app shell')
        return cache.addAll(filesToCache)
    })
}

const fromNetwork = (req, timeout) => {
    return new Promise((resolve, reject) => {
        let timeoutId = setTimeout(reject, timeout)
        fetch(req).then((res) => {
            clearTimeout(timeoutId)
            resolve(res)
        }, reject)
    })
}

const fromCache = (req) => {
    return caches.open(cachedName).then(cache => {
        return cache.match(req).then(matching => {
            return matching || Promise.reject(new Error('no-match'))
        })
    })
}