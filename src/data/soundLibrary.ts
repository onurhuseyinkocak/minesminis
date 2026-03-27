/**
 * Sound Library - Procedural (Web Audio) - Works without external files
 * Ses efektleri ve müzik: Web Audio API ile üretilir, dosya gerektirmez.
 */

// ============================================================
// GLOBAL MUTE STATE — reads from localStorage, listens for toggle events
// ============================================================

const LS_SOUND_KEY = 'mm_sound_enabled';

function _isSoundEnabled(): boolean {
  try {
    const val = localStorage.getItem(LS_SOUND_KEY);
    return val !== 'false'; // default on
  } catch {
    return true;
  }
}

// Keep an in-memory flag so we don't hit localStorage on every SFX call
let _soundEnabled: boolean = _isSoundEnabled();

if (typeof window !== 'undefined') {
  window.addEventListener('mm-sound-toggle', (e: Event) => {
    const detail = (e as CustomEvent<{ enabled: boolean }>).detail;
    _soundEnabled = detail.enabled;
  });
}

// ============================================================
// AUDIO CONTEXT (lazy singleton)
// ============================================================

let _ctx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!_ctx || _ctx.state === 'closed') {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_ctx.state === 'suspended') {
    _ctx.resume();
  }
  return _ctx;
}

// Note frequencies (Hz)
const NOTE = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392.0,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  C6: 1046.5,
} as const;

// ============================================================
// HELPER: Play a tone with volume envelope
// ============================================================

function playTone(
  freq: number,
  startTime: number,
  duration: number,
  ctx: AudioContext,
  destination: AudioNode,
  waveform: OscillatorType = 'sine',
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = waveform;
  osc.frequency.setValueAtTime(freq, startTime);

  // Envelope: quick attack, sustain, quick release
  const attack = 0.01;
  const release = Math.min(0.05, duration * 0.3);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.25, startTime + attack);
  gain.gain.setValueAtTime(0.25, startTime + duration - release);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(gain);
  gain.connect(destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playFreqSweep(
  freqStart: number,
  freqEnd: number,
  startTime: number,
  duration: number,
  ctx: AudioContext,
  destination: AudioNode,
  waveform: OscillatorType = 'sine',
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = waveform;
  osc.frequency.setValueAtTime(freqStart, startTime);
  osc.frequency.linearRampToValueAtTime(freqEnd, startTime + duration);

  const attack = 0.01;
  const release = Math.min(0.04, duration * 0.25);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.25, startTime + attack);
  gain.gain.setValueAtTime(0.25, startTime + duration - release);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(gain);
  gain.connect(destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

// ============================================================
// SFX IMPLEMENTATIONS
// ============================================================

// ============================================================
// HELPER: Soft noise burst (for tap feedback)
// ============================================================

function playNoiseBurst(ctx: AudioContext, duration: number, freq: number): void {
  const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = 0.8;
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  src.buffer = buf;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start();
  src.stop(ctx.currentTime + duration);
}

/** Two-tone chime: C5 + E5 simultaneously + quick C6 tail, 350ms total */
function playCorrect(): void {
  if (!_soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Root + third chord
    playTone(NOTE.C5, now, 0.25, ctx, ctx.destination, 'sine');
    playTone(NOTE.E5, now, 0.25, ctx, ctx.destination, 'sine');
    // Bright tail
    playTone(NOTE.C6, now + 0.15, 0.18, ctx, ctx.destination, 'sine');
  } catch { /* audio unavailable */ }
}

/** Gentle descending wobble — not punishing */
function playWrong(): void {
  if (!_soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Soft descending step
    playFreqSweep(360, 240, now, 0.18, ctx, ctx.destination, 'triangle');
    playFreqSweep(300, 200, now + 0.1, 0.18, ctx, ctx.destination, 'triangle');
  } catch { /* audio unavailable */ }
}

/** Full arpeggio C5→E5→G5→C6 with harmonic overtones, 600ms */
function playLevelUp(): void {
  if (!_soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const s = 0.11;
    playTone(NOTE.C5, now,         s * 1.5, ctx, ctx.destination, 'sine');
    playTone(NOTE.E5, now + s,     s * 1.5, ctx, ctx.destination, 'sine');
    playTone(NOTE.G5, now + s * 2, s * 1.5, ctx, ctx.destination, 'sine');
    playTone(NOTE.C6, now + s * 3, s * 2,   ctx, ctx.destination, 'sine');
    // Add gentle sub-octave warmth
    playTone(NOTE.C4, now,         s * 4,   ctx, ctx.destination, 'sine');
  } catch { /* audio unavailable */ }
}

/** Soft synthetic tap — wood-block-esque */
function playClick(): void {
  if (!_soundEnabled) return;
  try {
    const ctx = getAudioContext();
    playNoiseBurst(ctx, 0.04, 1200);
  } catch { /* audio unavailable */ }
}

/** Triple ascending chime — streak reward */
function playStreak(): void {
  if (!_soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const s = 0.09;
    playTone(NOTE.E5, now,         s * 1.2, ctx, ctx.destination, 'sine');
    playTone(NOTE.G5, now + s,     s * 1.2, ctx, ctx.destination, 'sine');
    playTone(NOTE.C6, now + s * 2, s * 2,   ctx, ctx.destination, 'sine');
    playTone(NOTE.E5, now,         s * 1.2, ctx, ctx.destination, 'triangle');
  } catch { /* audio unavailable */ }
}

/** Full chord stab + shimmer — big moment */
function playCelebration(): void {
  if (!_soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Major chord
    playTone(NOTE.C5, now, 0.6, ctx, ctx.destination, 'sine');
    playTone(NOTE.E5, now, 0.6, ctx, ctx.destination, 'sine');
    playTone(NOTE.G5, now, 0.6, ctx, ctx.destination, 'sine');
    // Octave boom
    playTone(NOTE.C4, now, 0.4, ctx, ctx.destination, 'sine');
    // Shimmer high arpeggio
    [0, 0.08, 0.16, 0.24, 0.32].forEach((d, i) => {
      const freqs = [NOTE.C6, NOTE.D5, NOTE.E5, NOTE.G5, NOTE.C6];
      playTone(freqs[i], now + d, 0.12, ctx, ctx.destination, 'sine');
    });
  } catch { /* audio unavailable */ }
}

/** Soft metronome tick */
function playCountdown(): void {
  if (!_soundEnabled) return;
  try {
    const ctx = getAudioContext();
    playNoiseBurst(ctx, 0.035, 900);
  } catch { /* audio unavailable */ }
}

/** XP coin collect — bright sparkle */
function playXPGain(): void {
  if (!_soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playFreqSweep(880, 1760, now, 0.12, ctx, ctx.destination, 'sine');
    playFreqSweep(1320, 2200, now + 0.06, 0.1, ctx, ctx.destination, 'sine');
  } catch { /* audio unavailable */ }
}

/** Badge earned — metallic shimmer */
function playBadgeEarned(): void {
  if (!_soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playTone(NOTE.E5, now,        0.15, ctx, ctx.destination, 'sine');
    playTone(NOTE.G5, now + 0.1,  0.15, ctx, ctx.destination, 'sine');
    playTone(NOTE.C6, now + 0.2,  0.3,  ctx, ctx.destination, 'sine');
    playTone(1318.51, now + 0.25, 0.25, ctx, ctx.destination, 'sine');
  } catch { /* audio unavailable */ }
}

/** Page whoosh — subtle */
function playNavigation(): void {
  if (!_soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playFreqSweep(200, 600, now, 0.15, ctx, ctx.destination, 'sine');
  } catch { /* audio unavailable */ }
}

// ============================================================
// EXPORT SFX OBJECT
// ============================================================

export const SFX = {
  correct: playCorrect,
  wrong: playWrong,
  levelUp: playLevelUp,
  click: playClick,
  streak: playStreak,
  celebration: playCelebration,
  countdown: playCountdown,
  xpGain: playXPGain,
  badgeEarned: playBadgeEarned,
  navigation: playNavigation,
} as const;

// ============================================================
// LEGACY EXPORTS (backward compat)
// ============================================================

const noop = () => {};
const createAmbientLoop = (_key: string) => ({ stop: noop });

export type MusicKey = 'cheerfulMorning' | 'funPlayful' | 'magicForest' | 'calmEnding' | 'softAdventure';
export type SFXKey = 'birdsMorning' | 'forestAmbient' | 'footstepsGrass' | 'splashWater' | 'magicSparkle' | 'giggle' | 'sneeze' | 'slideWhistle' | 'boing' | 'pageTurn';

export const MUSIC_KEYS = ['cheerfulMorning', 'funPlayful', 'magicForest', 'calmEnding', 'softAdventure'] as const;
export const SFX_KEYS = ['birdsMorning', 'forestAmbient', 'footstepsGrass', 'splashWater', 'magicSparkle', 'giggle', 'sneeze', 'slideWhistle', 'boing', 'pageTurn'] as const;

let musicLoop: { stop: () => void } | null = null;

/** Background music - returns stop function */
export function playMusic(key: MusicKey): () => void {
  if (musicLoop) musicLoop.stop();
  musicLoop = createAmbientLoop(key);
  return () => {
    if (musicLoop) {
      musicLoop.stop();
      musicLoop = null;
    }
  };
}

export function stopMusic(): void {
  if (musicLoop) {
    musicLoop.stop();
    musicLoop = null;
  }
}

/** Sound effects (legacy key-based API) */
const SFX_HANDLERS: Record<SFXKey, () => void> = {
  birdsMorning: noop,
  forestAmbient: noop,
  footstepsGrass: playClick,
  splashWater: playClick,
  magicSparkle: playCelebration,
  giggle: playCorrect,
  sneeze: playWrong,
  slideWhistle: playStreak,
  boing: playClick,
  pageTurn: playClick,
};

export function playSFX(key: SFXKey): void {
  SFX_HANDLERS[key]?.();
}
