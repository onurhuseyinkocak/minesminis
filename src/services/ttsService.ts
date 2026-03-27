/**
 * TTS Service — Supabase-cached Qwen TTS audio with Web Speech API fallback.
 *
 * Priority:
 *   1. Check tts_cache table in Supabase by text hash → play audio URL
 *   2. Fall back to Web Speech API (browser built-in)
 *
 * The ElevenLabs proxy has been removed. The local Qwen TTS server
 * pre-generates audio files which are stored in Supabase Storage.
 */

import { supabase } from '../config/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TTSOptions {
  lang?: 'en-US' | 'en-GB' | 'tr-TR';
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
  onError?: () => void;
}

// ─── Supabase Storage base URL ────────────────────────────────────────────────

const STORAGE_BASE = 'https://sblwqplagirgiroekotp.supabase.co/storage/v1/object/public/audio';

// ─── In-memory cache (text → audio URL | null) ───────────────────────────────

const _urlCache = new Map<string, string | null>();

/**
 * Explicit set of valid phonics graphemes that have files in phonics/ storage.
 * These are the ONLY strings that should route to phonics/{grapheme}.wav.
 * All other single/short words route to word/{word}.wav.
 *
 * Note: 'a', 'e', 'i', 'o', 'u' are single-letter vowel sounds used in phonics lessons.
 * The pronoun "I" is handled separately because its storage key is word/I.wav (uppercase).
 */
const PHONICS_GRAPHEMES = new Set([
  // Single consonants
  'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z',
  // Single vowels (short phonics sounds)
  'a', 'e', 'i', 'o', 'u',
  // Consonant digraphs
  'ch', 'ck', 'ng', 'qu', 'sh', 'th', 'wh',
  // Vowel digraphs / diphthongs
  'ai', 'ar', 'ee', 'er', 'ie', 'oa', 'oi', 'oo', 'or', 'ou', 'ue',
  // Variant IDs used in tts-items (e.g. oo_long, oo_short, th_voiced, th_unvoiced)
  'oo_long', 'oo_short', 'th_voiced', 'th_unvoiced',
]);

/**
 * Words whose storage key preserves the original capitalisation because the
 * file was uploaded with a non-lowercase name (e.g. word/I.wav).
 */
const WORD_CASE_EXCEPTIONS: Record<string, string> = {
  i: 'I',
};

/**
 * Build a storage key for a given text.
 * - Known phonics graphemes → phonics/{grapheme}.wav
 * - Single word (no spaces) → word/{word}.wav
 * - Everything else → null (caller falls back to tts_cache table)
 */
function storageKeyFor(text: string): string | null {
  const raw = text.trim();
  const t = raw.toLowerCase();
  if (!t) return null;

  // Special case: the pronoun "I" (uppercase in input) must go to word/I.wav,
  // not phonics/i.wav (which is the short /ɪ/ vowel sound).
  if (raw === 'I') {
    return 'word/I.wav';
  }

  // Explicit phonics grapheme check — only route to phonics/ if the text is
  // a recognised grapheme sound. This prevents common words like "cat", "dog",
  // "no", "my", "in" from being routed to a non-existent phonics/ path.
  if (PHONICS_GRAPHEMES.has(t)) {
    return `phonics/${t}.wav`;
  }

  // Single word (no spaces, may include apostrophe/hyphen)
  if (/^[a-zA-Z'-]+$/.test(raw)) {
    const filename = WORD_CASE_EXCEPTIONS[t] ?? t;
    return `word/${filename}.wav`;
  }

  return null;
}

/**
 * Look up a text in Supabase Storage (by guessing path) or tts_cache table.
 * Returns the public audio URL if found, or null.
 */
async function lookupCache(text: string): Promise<string | null> {
  const key = text.toLowerCase().trim();

  if (_urlCache.has(key)) {
    return _urlCache.get(key) ?? null;
  }

  // 1. Try to guess the Storage URL and verify it exists
  const storageKey = storageKeyFor(key);
  if (storageKey) {
    const url = `${STORAGE_BASE}/${storageKey}`;
    // Quick HEAD check to see if the file exists
    try {
      const resp = await fetch(url, { method: 'HEAD' });
      if (resp.ok) {
        _urlCache.set(key, url);
        return url;
      }
    } catch {
      // Storage file not found
    }
  }

  // 2. Fallback: look up in tts_cache table by text match
  try {
    const { data } = await supabase
      .from('tts_cache')
      .select('audio_url')
      .eq('text', key)
      .maybeSingle();

    if (data?.audio_url) {
      _urlCache.set(key, data.audio_url as string);
      return data.audio_url as string;
    }
  } catch {
    // Ignore
  }

  _urlCache.set(key, null);
  return null;
}

// ─── TTS availability ─────────────────────────────────────────────────────────

export function isTTSAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// ─── Voice selection ──────────────────────────────────────────────────────────

export function getBestEnglishVoice(): SpeechSynthesisVoice | null {
  if (!isTTSAvailable()) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const enUS = voices.find((v) => v.lang === 'en-US');
  if (enUS) return enUS;

  const enGB = voices.find((v) => v.lang === 'en-GB');
  if (enGB) return enGB;

  const anyEn = voices.find((v) => v.lang.startsWith('en'));
  return anyEn ?? null;
}

// ─── Init TTS (preload voices) ────────────────────────────────────────────────

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

// ─── Web Speech API fallback ──────────────────────────────────────────────────

function _speakWebSpeech(text: string, options?: TTSOptions): void {
  if (!isTTSAvailable()) {
    options?.onError?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang ?? 'en-US';
    utterance.rate = options?.rate ?? 0.8;
    utterance.pitch = options?.pitch ?? 1.1;
    utterance.volume = options?.volume ?? 1;

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

// ─── Play audio URL ───────────────────────────────────────────────────────────

async function _playUrl(
  url: string,
  options?: Pick<TTSOptions, 'onEnd' | 'onError'>,
): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const audio = new Audio(url);
    audio.playbackRate = 0.95;
    if (options?.onEnd) {
      audio.addEventListener('ended', () => options.onEnd?.(), { once: true });
    }
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

// ─── Core speak function ──────────────────────────────────────────────────────

/**
 * Main speak entry point.
 * 1. Check tts_cache in Supabase → play URL if found
 * 2. Fall back to Web Speech API
 */
export function speak(text: string, options?: TTSOptions): void {
  if (!text.trim()) {
    options?.onError?.();
    return;
  }

  const trimmed = text.trim();

  // Async: check Supabase cache, then fall back
  lookupCache(trimmed).then((url) => {
    if (url) {
      _playUrl(url, options).then((played) => {
        if (!played) {
          _speakWebSpeech(trimmed, options);
        }
      });
    } else {
      _speakWebSpeech(trimmed, options);
    }
  });
}

/**
 * Async version of speak — resolves when audio starts or fallback begins.
 */
export async function playText(text: string, options?: TTSOptions): Promise<void> {
  if (!text.trim()) {
    options?.onError?.();
    return;
  }

  const trimmed = text.trim();
  const url = await lookupCache(trimmed);

  if (url) {
    const played = await _playUrl(url, options);
    if (!played) {
      _speakWebSpeech(trimmed, options);
    }
    return;
  }

  _speakWebSpeech(trimmed, options);
}

// ─── Specialised helpers ──────────────────────────────────────────────────────

/**
 * Speak a single phoneme/sound very slowly and clearly.
 * Checks Supabase cache first; falls back to Web Speech API.
 */
export function speakPhoneme(phoneme: string, options?: Pick<TTSOptions, 'onEnd' | 'onError'>): void {
  if (typeof window === 'undefined') return;

  const clean = phoneme.trim().toLowerCase();

  lookupCache(clean).then((url) => {
    if (url) {
      _playUrl(url, options).then((played) => {
        if (!played) {
          _speakWebSpeech(phoneme, {
            lang: 'en-US',
            rate: 0.5,
            pitch: 1.1,
            volume: 1,
            ...options,
          });
        }
      });
    } else {
      _speakWebSpeech(phoneme, {
        lang: 'en-US',
        rate: 0.5,
        pitch: 1.1,
        volume: 1,
        ...options,
      });
    }
  });
}

/**
 * Speak a word in English then its Turkish translation after a short pause.
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

    window.speechSynthesis.speak(enUtt);
    window.speechSynthesis.speak(trUtt);
  } catch {
    // Silently ignore — iOS autoplay block etc.
  }
}

/**
 * Speak a full sentence at a natural, slightly-slow rate.
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

// ─── Legacy ElevenLabs shim (backwards compatibility) ────────────────────────

/**
 * Previously used ElevenLabs proxy. Now routes through Supabase cache + Web Speech API.
 * Kept for backwards compatibility with callers that import speakElevenLabs.
 */
export async function speakElevenLabs(text: string, _speed = 1.0): Promise<void> {
  return playText(text);
}

/**
 * Narrate story text — same as playText at a slightly slower rate.
 */
export async function narrateText(text: string): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  const url = await lookupCache(trimmed);
  if (url) {
    const played = await _playUrl(url);
    if (!played) {
      _speakWebSpeech(trimmed, { lang: 'en-US', rate: 0.8, pitch: 1.0, volume: 1 });
    }
    return;
  }
  _speakWebSpeech(trimmed, { lang: 'en-US', rate: 0.8, pitch: 1.0, volume: 1 });
}

// ─── Preload words (warms Supabase lookup cache) ─────────────────────────────

export async function preloadWords(words: string[]): Promise<void> {
  await Promise.allSettled(words.map((w) => lookupCache(w.trim())));
}

// ─── Cache management ─────────────────────────────────────────────────────────

/** Clear the in-memory URL cache (does not affect Supabase). */
export function clearTTSCache(): void {
  _urlCache.clear();
}
