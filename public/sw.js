// MinesMinis Service Worker v2
// Enhanced PWA with offline support

const CACHE_NAME = 'minesminis-v2';
const STATIC_CACHE = 'minesminis-static-v2';
const API_CACHE = 'minesminis-api-v2';

// App shell files to precache on install
const APP_SHELL = [
    '/',
    '/index.html',
    '/manifest.json',
    '/images/mine-logo.jpg',
];

// Static asset extensions — cache-first strategy
const STATIC_EXTENSIONS = [
    '.js', '.css', '.woff', '.woff2', '.ttf', '.eot',
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
];

// API paths to cache with network-first + stale-while-revalidate
const CACHEABLE_API_PATTERNS = [
    { pattern: /\/api\/daily-challenge/, ttl: 24 * 60 * 60 * 1000 },
    { pattern: /\/api\/story\/today/, ttl: 24 * 60 * 60 * 1000 },
];

// Paths to never cache
const SKIP_CACHE_PATTERNS = [
    /\/auth\//,
    /\/admin/,
    /supabase\.co\/auth/,
    /supabase\.co\/rest\/v1\/rpc/,
];

function isStaticAsset(url) {
    return STATIC_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));
}

function shouldSkipCache(url) {
    const fullUrl = url.href;
    return SKIP_CACHE_PATTERNS.some((pattern) => pattern.test(fullUrl));
}

function getCacheableApiConfig(url) {
    const fullUrl = url.href;
    return CACHEABLE_API_PATTERNS.find((entry) => entry.pattern.test(fullUrl)) || null;
}

// Install event — precache app shell
self.addEventListener('install', (event) => {
    console.log('Service Worker v2: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('Service Worker: Precaching app shell');
            return cache.addAll(APP_SHELL);
        })
    );

    self.skipWaiting();
});

// Activate event — clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker v2: Activated');

    const validCaches = [CACHE_NAME, STATIC_CACHE, API_CACHE];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (!validCaches.includes(name)) {
                        console.log('Service Worker: Deleting old cache:', name);
                        return caches.delete(name);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

// Fetch event — strategy varies by request type
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests (POST, PUT, DELETE, etc.)
    if (request.method !== 'GET') return;

    // Skip requests that should never be cached
    if (shouldSkipCache(url)) return;

    // Strategy 1: Cache-first for static assets (JS, CSS, images, fonts)
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }

    // Strategy 2: Network-first with stale-while-revalidate for cacheable API routes
    const apiConfig = getCacheableApiConfig(url);
    if (apiConfig) {
        event.respondWith(networkFirstWithTTL(request, API_CACHE, apiConfig.ttl));
        return;
    }

    // Strategy 3: Network-first for everything else (HTML navigation, etc.)
    event.respondWith(networkFirst(request));
});

// ─── Caching strategies ──────────────────────────────────────────────────────

/**
 * Cache-first: try cache, fall back to network (and update cache).
 */
async function cacheFirst(request, cacheName) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return new Response('Offline - Asset not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' },
        });
    }
}

/**
 * Network-first with TTL: try network, cache the response with a timestamp.
 * If network fails, serve from cache if within TTL.
 * Also does stale-while-revalidate: returns stale immediately, refreshes in background.
 */
async function networkFirstWithTTL(request, cacheName, ttl) {
    const cache = await caches.open(cacheName);

    try {
        const response = await fetch(request);
        if (response.ok) {
            // Store response with timestamp header
            const headers = new Headers(response.headers);
            headers.set('sw-cache-time', Date.now().toString());
            const timedResponse = new Response(await response.clone().blob(), {
                status: response.status,
                statusText: response.statusText,
                headers,
            });
            cache.put(request, timedResponse);
        }
        return response;
    } catch {
        // Network failed — try cache
        const cached = await cache.match(request);
        if (cached) {
            const cacheTime = parseInt(cached.headers.get('sw-cache-time') || '0', 10);
            const age = Date.now() - cacheTime;
            if (age < ttl) {
                return cached;
            }
        }

        // Even if expired, return stale data rather than nothing
        if (cached) return cached;

        return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

/**
 * Network-first: try network, fall back to cache, ultimate fallback to cached index.html.
 */
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        if (cached) return cached;

        // For navigation requests, serve cached index.html (SPA handles routing)
        if (request.mode === 'navigate') {
            const fallback = await caches.match('/index.html');
            if (fallback) return fallback;
        }

        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' },
        });
    }
}

// ─── Push notifications ──────────────────────────────────────────────────────

self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New notification from MinesMinis!',
        icon: '/images/mine-logo.jpg',
        badge: '/images/mine-logo.jpg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
        actions: [
            { action: 'explore', title: 'Open App' },
            { action: 'close', title: 'Close' },
        ],
    };

    event.waitUntil(
        self.registration.showNotification('MinesMinis', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(clients.openWindow('/'));
    }
});
