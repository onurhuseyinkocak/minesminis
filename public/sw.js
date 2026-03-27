// MinesMinis Service Worker v3
// Enhanced PWA with offline support + iOS splash + skipWaiting race-condition fix

const CACHE_NAME = 'minesminis-v3';
const STATIC_CACHE = 'minesminis-static-v3';
const API_CACHE = 'minesminis-api-v3';

// App shell files to precache on install
const APP_SHELL = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/icon-maskable-512.png',
    '/images/mine-logo.jpg',
    '/mascot/mimi_happy.json',
    '/mascot/mimi_idle.json',
    '/mascot/mimi_sad.json',
    '/mascot/mimi_talk.json',
    '/mascot/mimi_wave.json',
    '/mascot/mimi_walk.json',
    '/mascot/mimi_sit.json',
    '/lottie/cat-loader.json',
];

// Static asset extensions — cache-first strategy
const STATIC_EXTENSIONS = [
    '.js', '.css', '.woff', '.woff2', '.ttf', '.eot',
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif', '.ico',
    '.json',
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
    // API routes that return JSON should not be treated as static assets
    if (url.pathname.startsWith('/api/')) return false;
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
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(APP_SHELL);
        }).then(() => self.skipWaiting())
    );
});

// Activate event — clean up old caches + claim clients atomically
self.addEventListener('activate', (event) => {
    const validCaches = [CACHE_NAME, STATIC_CACHE, API_CACHE];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => !validCaches.includes(name))
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
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
    let data = { title: 'MinesMinis', body: "Bugün ders yapmayı unutma!" };
    if (event.data) {
        try {
            data = event.data.json();
        } catch {
            data.body = event.data.text() || data.body;
        }
    }

    event.waitUntil(
        self.registration.showNotification(data.title || 'MinesMinis', {
            body: data.body || '',
            icon: '/images/mine-logo.jpg',
            badge: '/images/mine-logo.jpg',
            data: { url: data.url || '/' },
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = (event.notification.data && event.notification.data.url) || '/';
    event.waitUntil(clients.openWindow(url));
});
