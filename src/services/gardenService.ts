// ============================================================
// Garden Service
// Manages garden state in localStorage
// Tracks plant growth as children master phonics sounds
// ============================================================

import { GARDEN_PLANTS, getPlantStage } from '../data/gardenData';
import type { GardenPlant, PlantStage } from '../data/gardenData';
import { LS_MASTERED_SOUNDS } from '../config/storageKeys';

const STORAGE_KEY = 'mimi_garden_state';
const WATER_KEY = 'mimi_water_drops';

export interface GardenPlantState {
  soundId: string;
  mastery: number;         // 0-100
  currentStage: string;    // stage name
  lastUpdated: string;     // ISO date
  waterCount: number;      // times watered
}

export interface PlantGrowthEvent {
  soundId: string;
  plant: GardenPlant;
  previousStage: PlantStage;
  newStage: PlantStage;
  mastery: number;
}

export interface GardenStats {
  blooming: number;    // mastery >= 95
  growing: number;     // mastery 20-94
  seeds: number;       // mastery 0-19
  total: number;       // total plants with any progress
}

/** Load all garden state from localStorage */
export function getGardenState(): Record<string, GardenPlantState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Record<string, GardenPlantState>;
    }
  } catch {
    // ignore
  }
  return {};
}

/** Save garden state to localStorage */
function saveGardenState(state: Record<string, GardenPlantState>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

/**
 * Update plant growth based on new mastery value.
 * Returns a PlantGrowthEvent if the plant advanced to a new stage, null otherwise.
 */
export function updatePlantGrowth(soundId: string, mastery: number): PlantGrowthEvent | null {
  const plant = GARDEN_PLANTS.find((p) => p.soundId === soundId);
  if (!plant) return null;

  const state = getGardenState();
  const existing = state[soundId];

  const previousMastery = existing?.mastery ?? 0;
  const newMastery = Math.max(previousMastery, mastery); // never decrease

  const previousStage = getPlantStage(plant, previousMastery);
  const newStage = getPlantStage(plant, newMastery);

  // Update state
  state[soundId] = {
    soundId,
    mastery: newMastery,
    currentStage: newStage.name,
    lastUpdated: new Date().toISOString(),
    waterCount: existing?.waterCount ?? 0,
  };

  saveGardenState(state);

  // Return growth event only if stage changed
  if (newStage.name !== previousStage.name) {
    return {
      soundId,
      plant,
      previousStage,
      newStage,
      mastery: newMastery,
    };
  }

  return null;
}

/** Get garden statistics */
export function getGardenStats(): GardenStats {
  const state = getGardenState();
  const entries = Object.values(state);

  let blooming = 0;
  let growing = 0;
  let seeds = 0;

  for (const entry of entries) {
    if (entry.mastery >= 95) {
      blooming++;
    } else if (entry.mastery >= 20) {
      growing++;
    } else {
      seeds++;
    }
  }

  return {
    blooming,
    growing,
    seeds,
    total: entries.length,
  };
}

/** Get current water drops count */
export function getWaterDrops(): number {
  try {
    const raw = localStorage.getItem(WATER_KEY);
    if (raw) return parseInt(raw, 10) || 0;
  } catch {
    // ignore
  }
  return 0;
}

/** Add water drops (earned from activities) */
export function addWaterDrops(count: number): void {
  const current = getWaterDrops();
  try {
    localStorage.setItem(WATER_KEY, String(current + count));
  } catch {
    // ignore
  }
}

/** Water a plant (purely visual, uses water drops) */
export function waterPlant(soundId: string): boolean {
  // Read drops first, validate, then do all writes together to reduce race window
  const drops = getWaterDrops();
  if (drops <= 0) return false;

  const state = getGardenState();
  const existing = state[soundId];
  if (!existing) return false;

  // Perform both writes together to minimize inconsistency window
  try {
    localStorage.setItem(WATER_KEY, String(drops - 1));
  } catch {
    return false;
  }

  existing.waterCount = (existing.waterCount || 0) + 1;
  existing.lastUpdated = new Date().toISOString();
  state[soundId] = existing;
  saveGardenState(state);

  return true;
}

/** Initialize garden from mastered sounds (for migration from existing data) */
export function initGardenFromMasteredSounds(): void {
  try {
    const mastered = JSON.parse(localStorage.getItem(LS_MASTERED_SOUNDS) || '[]') as string[];
    if (mastered.length === 0) return;

    const state = getGardenState();
    let changed = false;

    for (const soundId of mastered) {
      if (!state[soundId]) {
        const plant = GARDEN_PLANTS.find((p) => p.soundId === soundId);
        if (plant) {
          const stage = getPlantStage(plant, 100);
          state[soundId] = {
            soundId,
            mastery: 100,
            currentStage: stage.name,
            lastUpdated: new Date().toISOString(),
            waterCount: 0,
          };
          changed = true;
        }
      }
    }

    if (changed) {
      saveGardenState(state);
    }
  } catch {
    // ignore
  }
}
