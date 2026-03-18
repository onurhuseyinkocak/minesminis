/**
 * Sound Library - Procedural (Web Audio) - Works without external files
 * Ses efektleri ve müzik: Web Audio API ile üretilir, dosya gerektirmez.
 */

// ============================================================
// AUDIO CONTEXT (lazy singleton)
// ============================================================

let _ctx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!_ctx || _ctx.state === 'closed') {
    _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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

/** Pleasant ascending tone C5 -> E5, 200ms */
function playCorrect(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playFreqSweep(NOTE.C5, NOTE.E5, now, 0.2, ctx, ctx.destination, 'sine');
  } catch { /* audio unavailable */ }
}

/** Descending tone E4 -> C4, 300ms */
function playWrong(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playFreqSweep(NOTE.E4, NOTE.C4, now, 0.3, ctx, ctx.destination, 'triangle');
  } catch { /* audio unavailable */ }
}

/** Celebratory ascending arpeggio C5 -> E5 -> G5 -> C6, 400ms */
function playLevelUp(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const step = 0.1;
    playTone(NOTE.C5, now, step, ctx, ctx.destination, 'sine');
    playTone(NOTE.E5, now + step, step, ctx, ctx.destination, 'sine');
    playTone(NOTE.G5, now + step * 2, step, ctx, ctx.destination, 'sine');
    playTone(NOTE.C6, now + step * 3, step, ctx, ctx.destination, 'sine');
  } catch { /* audio unavailable */ }
}

/** Short click, 1000Hz 50ms */
function playClick(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playTone(1000, now, 0.05, ctx, ctx.destination, 'square');
  } catch { /* audio unavailable */ }
}

/** Quick ascending scale C5 -> D5 -> E5, 300ms */
function playStreak(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const step = 0.1;
    playTone(NOTE.C5, now, step, ctx, ctx.destination, 'sine');
    playTone(NOTE.D5, now + step, step, ctx, ctx.destination, 'sine');
    playTone(NOTE.E5, now + step * 2, step, ctx, ctx.destination, 'sine');
  } catch { /* audio unavailable */ }
}

/** Fanfare-style chord C5 + E5 + G5, 500ms */
function playCelebration(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playTone(NOTE.C5, now, 0.5, ctx, ctx.destination, 'sine');
    playTone(NOTE.E5, now, 0.5, ctx, ctx.destination, 'sine');
    playTone(NOTE.G5, now, 0.5, ctx, ctx.destination, 'sine');
  } catch { /* audio unavailable */ }
}

/** Tick sound 800Hz, 30ms */
function playCountdown(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playTone(800, now, 0.03, ctx, ctx.destination, 'square');
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
