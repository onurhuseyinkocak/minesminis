/**
 * TTS Service — Fish Audio proxy with browser SpeechSynthesis fallback.
 * Audio blobs are cached in memory (text:speed → objectURL) to avoid re-fetching.
 */

// ─── Cache ───────────────────────────────────────────────────────────────────

const TTS_CACHE = new Map<string, string>(); // cacheKey → blob URL

function cacheKey(text: string, speed: number): string {
  return `${text.trim().toLowerCase()}:${speed}`;
}

// ─── CSRF token helper ────────────────────────────────────────────────────────

function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

// ─── Fallback: browser SpeechSynthesis ───────────────────────────────────────

function speakFallback(text: string): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.trim());
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

// ─── Core speak function ──────────────────────────────────────────────────────

/**
 * Speak text via Fish Audio TTS (proxied through server).
 * Falls back to browser SpeechSynthesis if Fish Audio is unavailable.
 */
export async function speak(text: string, speed = 1.0): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  const key = cacheKey(trimmed, speed);
  let blobUrl = TTS_CACHE.get(key);

  if (!blobUrl) {
    try {
      const csrfToken = getCsrfToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const res = await fetch('/api/fish-tts', {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: trimmed, speed }),
      });

      if (!res.ok) {
        // Server returned error — fall back silently
        speakFallback(trimmed);
        return;
      }

      const blob = await res.blob();
      blobUrl = URL.createObjectURL(blob);
      TTS_CACHE.set(key, blobUrl);
    } catch {
      // Network error — fall back silently
      speakFallback(trimmed);
      return;
    }
  }

  const audio = new Audio(blobUrl);
  audio.playbackRate = 1.0;
  try {
    await audio.play();
  } catch {
    // Autoplay blocked or other error — try fallback
    speakFallback(trimmed);
  }
}

// ─── Narration helper ─────────────────────────────────────────────────────────

/**
 * Narrate longer story text. Same as speak() but with a slower default speed.
 */
export async function narrateText(text: string): Promise<void> {
  return speak(text, 0.95);
}

// ─── Preload words ────────────────────────────────────────────────────────────

/**
 * Pre-fetch and cache audio for a list of words in parallel.
 * Call this when a game/lesson loads so pronunciations are instant.
 */
export async function preloadWords(words: string[]): Promise<void> {
  await Promise.allSettled(words.map((w) => speak(w)));
}

// ─── Cache management ─────────────────────────────────────────────────────────

/** Free all cached blob URLs and clear the cache. */
export function clearTTSCache(): void {
  TTS_CACHE.forEach((url) => URL.revokeObjectURL(url));
  TTS_CACHE.clear();
}
