/**
 * Offline Manager — utilities for detecting connectivity and
 * caching data in localStorage with TTL support.
 */

const CACHE_PREFIX = 'mm_offline_';

interface CachedEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

/**
 * Returns true if the browser reports an active network connection.
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

/**
 * Registers a listener for online/offline transitions.
 * Returns an unsubscribe function.
 */
export function onOnlineStatusChange(
  callback: (online: boolean) => void
): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Retrieves cached data from localStorage.
 * Returns null if the key doesn't exist or has expired.
 */
export function getCachedData<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const entry: CachedEntry<T> = JSON.parse(raw);
    const age = Date.now() - entry.timestamp;

    if (entry.ttlMs > 0 && age > entry.ttlMs) {
      // Expired — remove it
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Stores data in localStorage with an optional TTL.
 * @param key   Cache key (prefixed automatically)
 * @param data  The data to cache
 * @param ttlMs Time-to-live in milliseconds. 0 = no expiry. Default: 24 hours.
 */
export function setCachedData<T>(
  key: string,
  data: T,
  ttlMs: number = 24 * 60 * 60 * 1000
): void {
  try {
    const entry: CachedEntry<T> = {
      data,
      timestamp: Date.now(),
      ttlMs,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // localStorage might be full or unavailable — fail silently
  }
}

/**
 * Removes a specific cached entry.
 */
export function removeCachedData(key: string): void {
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch {
    // ignore
  }
}

/**
 * Clears all offline cache entries (those with our prefix).
 */
export function clearOfflineCache(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
