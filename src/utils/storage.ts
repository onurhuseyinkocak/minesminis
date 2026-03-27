/**
 * Safe localStorage utilities — guards against QuotaExceededError and
 * storage-unavailable environments (private browsing, Safari ITP, etc.).
 */

/**
 * localStorage.setItem wrapped in try/catch.
 * Silently no-ops when storage is full or unavailable.
 */
export function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // QuotaExceededError or SecurityError — ignore
  }
}

/**
 * localStorage.getItem wrapped in try/catch.
 * Returns null on any error.
 */
export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * localStorage.removeItem wrapped in try/catch.
 */
export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
