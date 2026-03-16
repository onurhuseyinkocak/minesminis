/**
 * Procedural Sound Generator - Web Audio API
 * Works without external files. Sinema kalitesi ses efektleri ve ambient müzik.
 */

let audioContext: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

/** Soft ambient music loop - doesn't overpower */
/** @param _ reserved for future use (e.g. theme) */
export function playAmbientMusic(_: string): () => void { // eslint-disable-line @typescript-eslint/no-unused-vars
  const ctx = getContext();
  const gain = ctx.createGain();
  gain.gain.value = 0.15;
  gain.connect(ctx.destination);

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  osc1.type = 'sine';
  osc2.type = 'sine';
  osc1.frequency.value = 261.63;
  osc2.frequency.value = 329.63;
  osc1.connect(gain);
  osc2.connect(gain);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1);
  osc1.start(ctx.currentTime);
  osc2.start(ctx.currentTime);

  const stop = () => {
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    osc1.stop(ctx.currentTime + 0.5);
    osc2.stop(ctx.currentTime + 0.5);
  };
  return stop;
}

/** Bird chirp */
export function playBirds(): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.1);
  osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);
}

/** Footsteps on grass */
export function playFootsteps(): void {
  const ctx = getContext();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.value = 0.12;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start(ctx.currentTime);
}

/** Magic sparkle */
export function playMagicSparkle(): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(2000, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}

/** Giggle / laugh */
export function playGiggle(): void {
  const ctx = getContext();
  const gains = [0.1, 0.08, 0.06];
  [0, 0.15, 0.3].forEach((t, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 800 + i * 200;
    gain.gain.setValueAtTime(0, ctx.currentTime + t);
    gain.gain.linearRampToValueAtTime(gains[i], ctx.currentTime + t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.15);
    osc.start(ctx.currentTime + t);
    osc.stop(ctx.currentTime + t + 0.2);
  });
}

/** Sneeze - comedic */
export function playSneeze(): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.1);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
  gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
}

/** Slide whistle - banana peel slip */
export function playSlideWhistle(): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.35);
}

/** Boing - jump */
export function playBoing(): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.15);
  osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.35);
}

/** Page turn */
export function playPageTurn(): void {
  const ctx = getContext();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08)) * 0.15;
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.value = 0.3;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start(ctx.currentTime);
}

/** Child-friendly ambient music loop - major chords, warm tone */
/** @param _ reserved for future use */
export function createAmbientLoop(_: string): { stop: () => void } { // eslint-disable-line @typescript-eslint/no-unused-vars
  const ctx = getContext();
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);

  // C major chord: C4, E4, G4 (261.63, 329.63, 392)
  const freqs = [261.63, 329.63, 392];
  const oscs = freqs.map((f) => {
    const osc = ctx.createOscillator();
    osc.type = 'triangle'; // Warmer than sine
    osc.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = 0.04; // Soft - child-friendly
    osc.connect(g);
    g.connect(masterGain);
    return { osc, g };
  });

  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2);
  oscs.forEach(({ osc }) => osc.start(ctx.currentTime));

  return {
    stop: () => {
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => oscs.forEach(({ osc }) => osc.stop()), 1100);
    },
  };
}
