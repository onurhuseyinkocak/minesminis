/**
 * MASCOT REGISTRY
 * Defines all mascots and unlock logic for MinesMinis.
 */

export interface MascotDefinition {
  id: string;               // used in UnifiedMascot as the id prop
  name: string;
  nameTr: string;
  description: string;
  descriptionTr: string;
  unlockRequirement: {
    type: 'level' | 'streak' | 'words' | 'worlds_completed';
    value: number;
    descriptionTr: string;
    description: string;
  };
  primaryColor: string; // CSS var reference
  accentColor: string;
}

export const ALL_MASCOTS: MascotDefinition[] = [
  {
    id: 'mimi_cat',
    name: 'Mimi',
    nameTr: 'Mimi',
    description: 'Your adorable cat companion — always curious and ready to learn!',
    descriptionTr: 'Sevimli kedi arkadaşın — her zaman meraklı ve öğrenmeye hazır!',
    unlockRequirement: {
      type: 'level',
      value: 1,
      description: 'Available from the start',
      descriptionTr: 'Başlangıçtan itibaren mevcut',
    },
    primaryColor: 'var(--primary)',
    accentColor: '#FFD93D',
  },
];

interface UserStatsSnapshot {
  level: number;
  streakDays: number;
  wordsLearned: number;
  worldsCompleted: number;
}

/** Check if a mascot is unlocked based on user stats */
export function isMascotUnlocked(mascot: MascotDefinition, stats: UserStatsSnapshot): boolean {
  switch (mascot.unlockRequirement.type) {
    case 'level':
      return stats.level >= mascot.unlockRequirement.value;
    case 'streak':
      return stats.streakDays >= mascot.unlockRequirement.value;
    case 'words':
      return stats.wordsLearned >= mascot.unlockRequirement.value;
    case 'worlds_completed':
      return stats.worldsCompleted >= mascot.unlockRequirement.value;
    default:
      return false;
  }
}

/** Get all unlocked mascots for a user */
export function getUnlockedMascots(stats: UserStatsSnapshot): MascotDefinition[] {
  return ALL_MASCOTS.filter((m) => isMascotUnlocked(m, stats));
}

/** Get progress toward unlocking a locked mascot (0–100) */
export function getUnlockProgress(mascot: MascotDefinition, stats: UserStatsSnapshot): number {
  if (isMascotUnlocked(mascot, stats)) return 100;

  let current = 0;
  switch (mascot.unlockRequirement.type) {
    case 'level':
      current = stats.level;
      break;
    case 'streak':
      current = stats.streakDays;
      break;
    case 'words':
      current = stats.wordsLearned;
      break;
    case 'worlds_completed':
      current = stats.worldsCompleted;
      break;
  }

  return Math.min(100, Math.max(0, Math.floor((current / mascot.unlockRequirement.value) * 100)));
}
