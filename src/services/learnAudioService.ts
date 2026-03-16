/**
 * Learn Audio Service - DB-backed pre-generated TTS, SFX, music
 * Tries DB first, falls back to TTS API for missing entries
 */

import { supabase } from '../config/supabase';

export type SFXType = 'pop' | 'click' | 'win' | 'countdown' | 'wrong';
export type MusicKey = 'matching' | 'spelling' | 'memory' | 'speed' | 'listen' | 'sentence' | 'bubble';

const memoryCache = new Map<string, string>();

function dbKey(type: 'word_en' | 'word_tr' | 'sfx' | 'music' | 'phrase', value: string): string {
  return `${type}:${value}`.toLowerCase().trim();
}

/**
 * Fetch audio base64 from DB. Returns null if not found.
 */
export async function getLearnAudio(key: string): Promise<string | null> {
  const cached = memoryCache.get(key);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('learn_audio')
      .select('audio_base64')
      .eq('key', key)
      .single();

    if (error || !data?.audio_base64) return null;
    memoryCache.set(key, data.audio_base64);
    return data.audio_base64;
  } catch {
    return null;
  }
}

/**
 * Get key for English word (e.g. "Apple")
 */
export function keyForWordEn(word: string): string {
  return dbKey('word_en', word);
}

/**
 * Get key for Turkish translation (e.g. "Elma")
 */
export function keyForWordTr(translation: string): string {
  return dbKey('word_tr', translation);
}

/**
 * Get key for SFX
 */
export function keyForSFX(type: SFXType): string {
  return dbKey('sfx', type);
}

/**
 * Get key for game music
 */
export function keyForMusic(game: MusicKey): string {
  return dbKey('music', game);
}

/**
 * Play audio from base64. Returns the Audio element for control.
 */
export function playBase64Audio(base64: string, format = 'mp3'): HTMLAudioElement {
  const url = `data:audio/${format};base64,${base64}`;
  const audio = new Audio(url);
  audio.play().catch(() => {});
  return audio;
}

/**
 * Try to play word from DB. Returns true if played, false if not found.
 */
export async function playWordFromDB(
  text: string,
  lang: 'en' | 'tr'
): Promise<boolean> {
  const key = lang === 'en' ? keyForWordEn(text) : keyForWordTr(text);
  const base64 = await getLearnAudio(key);
  if (!base64) return false;
  playBase64Audio(base64);
  return true;
}

/**
 * Try to play SFX from DB. Falls back to Web Audio beep if not in DB.
 */
export async function playSFXFromDB(type: SFXType): Promise<boolean> {
  const key = keyForSFX(type);
  const base64 = await getLearnAudio(key);
  if (base64) {
    playBase64Audio(base64);
    return true;
  }
  // Fallback: simple Web Audio beep when DB has no SFX
  try {
    const ctx = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = type === 'win' ? 880 : type === 'wrong' ? 220 : type === 'countdown' ? 440 : 660;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch { /* no Web Audio support */ }
  return false;
}
