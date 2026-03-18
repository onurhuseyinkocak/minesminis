// ============================================================
// MinesMinis Melody Player — Web Audio API based musical notes
// Plays real melodies instead of relying on TTS for singing
// ============================================================

export interface Note {
  frequency: number; // Hz
  duration: number;  // ms
  type?: OscillatorType;
}

// ─── Note Frequencies ────────────────────────────────────────
const FREQ = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
  A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25,
} as const;

// ─── Melody Patterns ────────────────────────────────────────
// Each pattern is an array of frequencies forming a musical phrase

/** Pattern A — ascending, happy & upbeat */
const PATTERN_A: number[] = [FREQ.C4, FREQ.D4, FREQ.E4, FREQ.F4, FREQ.G4];

/** Pattern B — descending, calming */
const PATTERN_B: number[] = [FREQ.G4, FREQ.F4, FREQ.E4, FREQ.D4, FREQ.C4];

/** Pattern C — bouncy, playful */
const PATTERN_C: number[] = [FREQ.C4, FREQ.E4, FREQ.G4, FREQ.E4, FREQ.C4];

/** Pattern D — call-response */
const PATTERN_D: number[] = [FREQ.C4, FREQ.E4, FREQ.G4, FREQ.G4, FREQ.E4, FREQ.C4];

/** Pattern E — fanfare/celebration */
const PATTERN_E: number[] = [FREQ.C4, FREQ.E4, FREQ.G4, FREQ.C5];

/** Pattern F — gentle lullaby phrase */
const PATTERN_F: number[] = [FREQ.E4, FREQ.D4, FREQ.C4, FREQ.D4, FREQ.E4];

/** Pattern G — marching rhythm */
const PATTERN_G: number[] = [FREQ.C4, FREQ.C4, FREQ.G4, FREQ.G4, FREQ.A4, FREQ.A4, FREQ.G4];

/** Pattern H — twinkle-style */
const PATTERN_H: number[] = [FREQ.C4, FREQ.C4, FREQ.G4, FREQ.G4, FREQ.A4, FREQ.A4, FREQ.G4];

const ALL_PATTERNS = [PATTERN_A, PATTERN_B, PATTERN_C, PATTERN_D, PATTERN_E, PATTERN_F, PATTERN_G, PATTERN_H];

// ─── State ──────────────────────────────────────────────────
let audioCtx: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];
let activeGains: GainNode[] = [];
let isStopRequested = false;
let kickInterval: ReturnType<typeof setInterval> | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// ─── Core: Play a single note ───────────────────────────────
function playNote(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3,
): { osc: OscillatorNode; gain: GainNode } {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);

  // Envelope: attack 20ms, sustain, release 50ms
  const attackEnd = startTime + 0.02;
  const releaseStart = startTime + duration / 1000 - 0.05;
  const noteEnd = startTime + duration / 1000;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, attackEnd);
  gain.gain.setValueAtTime(volume, Math.max(attackEnd, releaseStart));
  gain.gain.linearRampToValueAtTime(0, noteEnd);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(noteEnd + 0.01);

  return { osc, gain };
}

// ─── Play a melody (array of Notes) ─────────────────────────
export function playMelody(notes: Note[]): Promise<void> {
  return new Promise((resolve) => {
    isStopRequested = false;
    const ctx = getAudioContext();
    let offset = ctx.currentTime + 0.05;

    for (const note of notes) {
      if (isStopRequested) break;
      const { osc, gain } = playNote(
        ctx,
        note.frequency,
        offset,
        note.duration,
        note.type || 'sine',
      );
      activeOscillators.push(osc);
      activeGains.push(gain);
      offset += note.duration / 1000;
    }

    const totalMs = notes.reduce((sum, n) => sum + n.duration, 0);
    setTimeout(() => {
      cleanupFinished();
      resolve();
    }, totalMs + 100);
  });
}

// ─── Play a nursery melody for a given line index ────────────
export function playNurseryMelody(lineIndex: number, tempo: number = 200): Promise<void> {
  const pattern = ALL_PATTERNS[lineIndex % ALL_PATTERNS.length];
  const notes: Note[] = pattern.map((freq) => ({
    frequency: freq,
    duration: tempo,
    type: 'sine' as OscillatorType,
  }));
  return playMelody(notes);
}

// ─── Play from a custom frequency array ─────────────────────
export function playFrequencyArray(frequencies: number[], tempo: number = 250): Promise<void> {
  const notes: Note[] = frequencies.map((freq) => ({
    frequency: freq,
    duration: tempo,
    type: 'sine' as OscillatorType,
  }));
  return playMelody(notes);
}

// ─── Background kick drum pattern ───────────────────────────
export function startBackgroundRhythm(bpm: number = 60): void {
  stopBackgroundRhythm();
  const intervalMs = (60 / bpm) * 1000;

  const playKick = () => {
    if (isStopRequested) return;
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Kick: short burst of noise through low-pass filter
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  };

  playKick();
  kickInterval = setInterval(playKick, intervalMs);
}

export function stopBackgroundRhythm(): void {
  if (kickInterval !== null) {
    clearInterval(kickInterval);
    kickInterval = null;
  }
}

// ─── Stop everything ────────────────────────────────────────
export function stopMelody(): void {
  isStopRequested = true;
  stopBackgroundRhythm();

  const ctx = audioCtx;
  if (!ctx) return;

  const now = ctx.currentTime;
  for (const gain of activeGains) {
    try {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0, now);
    } catch {
      // already stopped
    }
  }
  for (const osc of activeOscillators) {
    try {
      osc.stop(now);
    } catch {
      // already stopped
    }
  }
  activeOscillators = [];
  activeGains = [];
}

function cleanupFinished(): void {
  activeOscillators = activeOscillators.filter((osc) => {
    try {
      // If we can read the frequency, it may still be active
      return osc.frequency.value > 0;
    } catch {
      return false;
    }
  });
}

// ─── Exported constants for song data ───────────────────────
export const MELODY_FREQUENCIES = FREQ;
export const MELODY_PATTERNS = {
  ascending: PATTERN_A,
  descending: PATTERN_B,
  bouncy: PATTERN_C,
  callResponse: PATTERN_D,
  fanfare: PATTERN_E,
  lullaby: PATTERN_F,
  marching: PATTERN_G,
  twinkle: PATTERN_H,
} as const;
