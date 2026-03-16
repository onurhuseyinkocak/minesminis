/**
 * API base URL - use relative path when frontend and backend are same origin
 * (Vite proxy in dev, Express serves both in production)
 */
export function getApiBase(): string {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '');
  }
  return '';
}
