/**
 * SOUND EFFECTS HOOK
 * Procedural audio using Web Audio API — no external audio files needed.
 * All sounds are SHORT (< 0.5s), CHEERFUL, and CHILD-FRIENDLY.
 * Uses sine waves for gentle tones, combinations for richer effects.
 */

import { useCallback, useRef } from 'react';

// Shared AudioContext — lazy init to comply with browser autoplay policies
let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!sharedCtx) {
      sharedCtx = new AudioContext();
    }
    // Resume if suspended (browser autoplay policy)
    if (sharedCtx.state === 'suspended') {
      sharedCtx.resume();
    }
    return sharedCtx;
  } catch {
    return null;
  }
}

// ── Utility: play a single tone ─────────────────────────────────────────────

interface ToneConfig {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  delay?: number;
  fadeOut?: number;
}

function playTone(ctx: AudioContext, config: ToneConfig) {
  const {
    frequency,
    duration,
    type = 'sine',
    volume = 0.15,
    delay = 0,
    fadeOut = 0.08,
  } = config;

  const now = ctx.currentTime + delay;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);

  gain.gain.setValueAtTime(volume, now);
  gain.gain.setValueAtTime(volume, now + duration - fadeOut);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

// ── Utility: play a chord (multiple tones at once) ──────────────────────────

function playChord(
  ctx: AudioContext,
  frequencies: number[],
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.1,
  delay = 0,
) {
  frequencies.forEach((freq) => {
    playTone(ctx, { frequency: freq, duration, type, volume, delay });
  });
}

// ── Sound Definitions ───────────────────────────────────────────────────────

/** Cheerful ascending ding — correct answer */
function soundCorrect(ctx: AudioContext) {
  playTone(ctx, { frequency: 523, duration: 0.1, type: 'sine', volume: 0.12 }); // C5
  playTone(ctx, { frequency: 659, duration: 0.1, type: 'sine', volume: 0.12, delay: 0.08 }); // E5
  playTone(ctx, { frequency: 784, duration: 0.2, type: 'sine', volume: 0.15, delay: 0.15 }); // G5
}

/** Gentle "oops" — wrong answer (NOT a harsh buzzer) */
function soundWrong(ctx: AudioContext) {
  // Gentle descending two-note — soft and encouraging
  playTone(ctx, { frequency: 350, duration: 0.15, type: 'sine', volume: 0.08 });
  playTone(ctx, { frequency: 280, duration: 0.2, type: 'sine', volume: 0.06, delay: 0.12 });
}

/** Ascending chime sequence — streak milestone */
function soundStreak(ctx: AudioContext) {
  const notes = [523, 587, 659, 784, 880]; // C5 D5 E5 G5 A5
  notes.forEach((freq, i) => {
    playTone(ctx, {
      frequency: freq,
      duration: 0.12,
      type: 'sine',
      volume: 0.1 + i * 0.02,
      delay: i * 0.06,
    });
  });
}

/** Triumphant fanfare — level up / lesson complete */
function soundLevelUp(ctx: AudioContext) {
  // Triumphant major chord arpeggio
  playTone(ctx, { frequency: 523, duration: 0.15, type: 'sine', volume: 0.12 }); // C5
  playTone(ctx, { frequency: 659, duration: 0.15, type: 'sine', volume: 0.12, delay: 0.1 }); // E5
  playTone(ctx, { frequency: 784, duration: 0.15, type: 'sine', volume: 0.12, delay: 0.2 }); // G5
  playTone(ctx, { frequency: 1047, duration: 0.3, type: 'sine', volume: 0.14, delay: 0.3 }); // C6

  // Add a warm triangle wave for richness
  playTone(ctx, { frequency: 523, duration: 0.5, type: 'triangle', volume: 0.06, delay: 0.3 });
  playTone(ctx, { frequency: 784, duration: 0.5, type: 'triangle', volume: 0.06, delay: 0.3 });
}

/** Soft click — button tap */
function soundClick(ctx: AudioContext) {
  playTone(ctx, { frequency: 800, duration: 0.04, type: 'sine', volume: 0.06 });
}

/** Completion jingle — game finished */
function soundComplete(ctx: AudioContext) {
  // Happy ascending scale with chord finish
  const melody = [392, 440, 494, 523, 587, 659]; // G4 A4 B4 C5 D5 E5
  melody.forEach((freq, i) => {
    playTone(ctx, {
      frequency: freq,
      duration: 0.1,
      type: 'sine',
      volume: 0.1,
      delay: i * 0.08,
    });
  });

  // Final chord
  playChord(ctx, [784, 988, 1175], 0.4, 'sine', 0.08, melody.length * 0.08);
  playChord(ctx, [784, 988, 1175], 0.4, 'triangle', 0.04, melody.length * 0.08);
}

/** Coin/collect sound — XP earned */
function soundXP(ctx: AudioContext) {
  playTone(ctx, { frequency: 1200, duration: 0.06, type: 'sine', volume: 0.08 });
  playTone(ctx, { frequency: 1600, duration: 0.08, type: 'sine', volume: 0.1, delay: 0.05 });
}

// ── Hook ────────────────────────────────────────────────────────────────────

export interface SoundEffects {
  playCorrect: () => void;
  playWrong: () => void;
  playStreak: () => void;
  playLevelUp: () => void;
  playClick: () => void;
  playComplete: () => void;
  playXP: () => void;
}

export function useSoundEffects(): SoundEffects {
  // Debounce tracker to avoid overlapping rapid sounds
  const lastPlayed = useRef<Record<string, number>>({});

  const play = useCallback((key: string, fn: (ctx: AudioContext) => void, minGap = 80) => {
    const now = Date.now();
    if (now - (lastPlayed.current[key] || 0) < minGap) return;
    lastPlayed.current[key] = now;

    const ctx = getAudioContext();
    if (!ctx) return;
    fn(ctx);
  }, []);

  const playCorrect = useCallback(() => play('correct', soundCorrect), [play]);
  const playWrong = useCallback(() => play('wrong', soundWrong), [play]);
  const playStreak = useCallback(() => play('streak', soundStreak, 200), [play]);
  const playLevelUp = useCallback(() => play('levelUp', soundLevelUp, 500), [play]);
  const playClick = useCallback(() => play('click', soundClick, 30), [play]);
  const playComplete = useCallback(() => play('complete', soundComplete, 500), [play]);
  const playXP = useCallback(() => play('xp', soundXP, 100), [play]);

  return {
    playCorrect,
    playWrong,
    playStreak,
    playLevelUp,
    playClick,
    playComplete,
    playXP,
  };
}
