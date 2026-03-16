/**
 * Sound Library - Procedural (Web Audio) - Works without external files
 * Ses efektleri ve müzik: Web Audio API ile üretilir, dosya gerektirmez.
 */

import {
  playBirds,
  playFootsteps,
  playMagicSparkle,
  playGiggle,
  playSneeze,
  playSlideWhistle,
  playBoing,
  playPageTurn,
  createAmbientLoop,
} from '../utils/soundGenerator';

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

/** Sound effects */
const SFX_HANDLERS: Record<SFXKey, () => void> = {
  birdsMorning: playBirds,
  forestAmbient: playBirds,
  footstepsGrass: playFootsteps,
  splashWater: playFootsteps,
  magicSparkle: playMagicSparkle,
  giggle: playGiggle,
  sneeze: playSneeze,
  slideWhistle: playSlideWhistle,
  boing: playBoing,
  pageTurn: playPageTurn,
};

export function playSFX(key: SFXKey): void {
  SFX_HANDLERS[key]?.();
}
