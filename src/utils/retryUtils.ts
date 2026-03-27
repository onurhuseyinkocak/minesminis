/**
 * RETRY UTILITIES
 * Exponential-backoff retry for Supabase requests.
 */

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries an async function up to `maxAttempts` times with exponential backoff.
 * Delays: 1s, 2s, 4s, …
 */
export async function withRetry<T>(
  fn: () => PromiseLike<T>,
  maxAttempts = 3,
): Promise<T> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === maxAttempts - 1) throw e;
      await delay(1000 * Math.pow(2, i));
    }
  }
  // TypeScript: unreachable, but needed for type safety
  throw new Error('withRetry: exhausted all attempts');
}

/**
 * Creates a debounced version of an async function.
 * Only the last call within the wait window executes.
 */
export function debounceAsync<T extends unknown[]>(
  fn: (...args: T) => Promise<void>,
  wait: number,
): (...args: T) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: T): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args).catch(() => {
        // swallow — callers log their own errors
      });
    }, wait);
  };
}
