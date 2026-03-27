/**
 * LOGGER UTILITY
 * MinesMinis — production-safe logging.
 *
 * - logger.log / logger.warn: only fire in DEV (import.meta.env.DEV)
 * - logger.error: always fires — also captured by errorLogger / Sentry
 * - logger.debug: only fires in DEV (finer-grained than log)
 *
 * Usage:
 *   import { logger } from '../utils/logger';
 *   logger.log('User signed in', userId);
 *   logger.warn('Sync skipped — no network');
 *   logger.error('Supabase insert failed', err);
 */

const isDev = import.meta.env.DEV;

export const logger = {
  /** Development-only informational log. Silent in production. */
  log: (...args: unknown[]): void => {
    if (isDev) console.log(...args);
  },

  /** Development-only debug log (even more granular). Silent in production. */
  debug: (...args: unknown[]): void => {
    if (isDev) console.debug(...args);
  },

  /** Development-only warning. Silent in production. */
  warn: (...args: unknown[]): void => {
    if (isDev) console.warn(...args);
  },

  /**
   * Error — always logged (dev + production).
   * Captured by errorLogger/Sentry in production via console.error override.
   */
  error: (...args: unknown[]): void => {
    console.error(...args);
  },
};
