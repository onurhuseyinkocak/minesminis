/**
 * TTS Service — ElevenLabs proxy (via /api/tts-v2) with Web Speech API synthesis as fallback.
 * Server handles Supabase caching so the same text is never generated twice.
 * Client-side memory cache (text → objectURL) avoids repeat network round-trips per session.
 *
 * All Web Speech API functions are also exported directly for high-quality
 * phonics, word, and sentence playback without a server round-trip.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TTSOptions {
  lang?: 'en-US' | 'en-GB' | 'tr-TR';
  rate?: number;    // 0.5–2.0, default 0.8 (slower for children)
  pitch?: number;   // 0.5–2.0, default 1.1 (slightly higher for child-friendliness)
  volume?: number;  // 0–1, default 1
  onEnd?: () => void;
  onError?: () => void;
}

// ─── TTS availability ─────────────────────────────────────────────────────────

export function isTTSAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// ─── Voice selection ─────────────────────────────────────────────────────────

export function getBestEnglishVoice(): SpeechSynthesisVoice | null {
  if (!isTTSAvailable()) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Prefer en-US, fall back to en-GB, then any English voice
  const enUS = voices.find((v) => v.lang === 'en-US');
  if (enUS) return enUS;

  const enGB = voices.find((v) => v.lang === 'en-GB');
  if (enGB) return enGB;

  const anyEn = voices.find((v) => v.lang.startsWith('en'));
  return anyEn ?? null;
}

// ─── Init TTS (preload voices) ────────────────────────────────────────────────

/**
 * Browsers load voices asynchronously. Call this on app mount so voices are
 * ready when the child first taps a speak button.
 */
export function initTTS(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (!isTTSAvailable()) {
      resolve();
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve();
      return;
    }

    const handleVoicesChanged = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      resolve();
    };

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    // Resolve after 3 s in case the event never fires (some browsers)
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      resolve();
    }, 3000);
  });
}

// ─── Stop speech ──────────────────────────────────────────────────────────────

export function stopSpeech(): void {
  if (isTTSAvailable()) {
    window.speechSynthesis.cancel();
  }
}

// ─── Core Web Speech API speak function ──────────────────────────────────────

/**
 * Speak any text using Web Speech API synthesis.
 * Explicit lang, rate, pitch, and volume — safe on iOS Safari when called
 * from a user gesture. When called from autoPlay/mount effects on iOS the
 * speech may be blocked; we handle that gracefully with onError.
 */
export function speak(text: string, options?: TTSOptions): void {
  if (!isTTSAvailable() || !text.trim()) {
    options?.onError?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = options?.lang ?? 'en-US';
    utterance.rate = options?.rate ?? 0.8;
    utterance.pitch = options?.pitch ?? 1.1;
    utterance.volume = options?.volume ?? 1;

    // Prefer best English voice for en-US/en-GB
    if (!options?.lang || options.lang !== 'tr-TR') {
      const voice = getBestEnglishVoice();
      if (voice) utterance.voice = voice;
    }

    if (options?.onEnd) {
      utterance.onend = () => options.onEnd?.();
    }
    if (options?.onError) {
      utterance.onerror = () => options.onError?.();
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    options?.onError?.();
  }
}

// ─── Specialised helpers ──────────────────────────────────────────────────────

/**
 * Speak a single phoneme/sound very slowly and clearly.
 * For 's' we say "sss" not "ess" — pass the sound representation, not the letter name.
 */
export function speakPhoneme(phoneme: string, options?: Pick<TTSOptions, 'onEnd' | 'onError'>): void {
  speak(phoneme, {
    lang: 'en-US',
    rate: 0.5,
    pitch: 1.1,
    volume: 1,
    ...options,
  });
}

/**
 * Speak a word in English, then after a pause speak its Turkish translation.
 */
export function speakWordWithTranslation(word: string, translationTr: string): void {
  if (!isTTSAvailable()) return;

  try {
    window.speechSynthesis.cancel();

    const enUtt = new SpeechSynthesisUtterance(word.trim());
    enUtt.lang = 'en-US';
    enUtt.rate = 0.8;
    enUtt.pitch = 1.1;
    enUtt.volume = 1;

    const voice = getBestEnglishVoice();
    if (voice) enUtt.voice = voice;

    const trUtt = new SpeechSynthesisUtterance(translationTr.trim());
    trUtt.lang = 'tr-TR';
    trUtt.rate = 0.8;
    trUtt.pitch = 1.0;
    trUtt.volume = 1;

    // Queue both; browser speaks them sequentially
    window.speechSynthesis.speak(enUtt);
    window.speechSynthesis.speak(trUtt);
  } catch {
    // Silently ignore — iOS autoplay block etc.
  }
}

/**
 * Speak a full sentence at a natural, slightly-slow rate for children.
 */
export function speakSentence(sentence: string, options?: Pick<TTSOptions, 'onEnd' | 'onError'>): void {
  speak(sentence, {
    lang: 'en-US',
    rate: 0.85,
    pitch: 1.0,
    volume: 1,
    ...options,
  });
}

// ─── ElevenLabs proxy (server-side TTS with Supabase cache) ───────────────────

const TTS_CACHE = new Map<string, string>(); // cacheKey → blob URL

function _cacheKey(text: string, speed: number): string {
  return `${text.trim().toLowerCase()}:${speed}`;
}

function _getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

/**
 * Speak text via ElevenLabs TTS (proxied through /api/tts-v2).
 * Server checks Supabase cache first; only calls ElevenLabs on cache miss.
 * Falls back to Web Speech API synthesis if the server is unavailable.
 *
 * NOTE: This returns a Promise for backwards-compatibility with callers that
 * await it (e.g. SpellingBee). The Web Speech API speak() above is synchronous
 * and preferred for direct phonics/word playback.
 */
export async function speakElevenLabs(text: string, speed = 1.0): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  const key = _cacheKey(trimmed, speed);
  let blobUrl = TTS_CACHE.get(key);

  if (!blobUrl) {
    try {
      const csrfToken = _getCsrfToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10_000);

      const res = await fetch('/api/tts-v2', {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: trimmed }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        speak(trimmed);
        return;
      }

      const blob = await res.blob();
      blobUrl = URL.createObjectURL(blob);
      TTS_CACHE.set(key, blobUrl);
    } catch {
      speak(trimmed);
      return;
    }
  }

  const audio = new Audio(blobUrl);
  audio.playbackRate = 1.0;
  try {
    await audio.play();
  } catch {
    speak(trimmed);
  }
}

// ─── Narration helper ─────────────────────────────────────────────────────────

/**
 * Narrate longer story text via ElevenLabs with a slightly slower speed.
 */
export async function narrateText(text: string): Promise<void> {
  return speakElevenLabs(text, 0.95);
}

// ─── Preload words ────────────────────────────────────────────────────────────

/**
 * Pre-fetch and cache ElevenLabs audio for a list of words in parallel.
 * Call this when a game/lesson loads so pronunciations are instant.
 * Only caches the audio blobs; does NOT play them.
 */
export async function preloadWords(words: string[]): Promise<void> {
  await Promise.allSettled(words.map((w) => _preloadSingle(w)));
}

async function _preloadSingle(text: string, speed = 1.0): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  const key = _cacheKey(trimmed, speed);
  if (TTS_CACHE.has(key)) return;

  try {
    const csrfToken = _getCsrfToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const res = await fetch('/api/tts-v2', {
      method: 'POST',
      headers,
      body: JSON.stringify({ text: trimmed }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return;

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    TTS_CACHE.set(key, blobUrl);
  } catch {
    // Preload failed silently — will fall back to Web Speech API at play time
  }
}

// ─── Cache management ─────────────────────────────────────────────────────────

/** Free all cached blob URLs and clear the ElevenLabs cache. */
export function clearTTSCache(): void {
  TTS_CACHE.forEach((url) => URL.revokeObjectURL(url));
  TTS_CACHE.clear();
}
