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
    id: 'mimi_dragon',
    name: 'Mimi Dragon',
    nameTr: 'Ejderha Mimi',
    description: 'Your loyal dragon companion — always ready to learn!',
    descriptionTr: 'Sadık ejderha arkadaşın — öğrenmeye her zaman hazır!',
    unlockRequirement: {
      type: 'level',
      value: 1,
      description: 'Available from the start',
      descriptionTr: 'Başlangıçtan itibaren mevcut',
    },
    primaryColor: 'var(--primary)',
    accentColor: 'var(--secondary)',
  },
  {
    id: 'nova_fox',
    name: 'Nova Fox',
    nameTr: 'Tilki Nova',
    description: 'Quick and clever — Nova loves word puzzles!',
    descriptionTr: 'Hızlı ve zeki — Nova kelime bulmacalarını sever!',
    unlockRequirement: {
      type: 'level',
      value: 5,
      description: 'Reach Level 5',
      descriptionTr: "Seviye 5'e ulaş",
    },
    primaryColor: 'var(--accent, #f97316)',
    accentColor: 'var(--warning, #f59e0b)',
  },
  {
    id: 'bubbles_octo',
    name: 'Bubbles the Octopus',
    nameTr: 'Ahtapot Bubbles',
    description: 'Bubbles has 8 arms — and loves giving high-fives!',
    descriptionTr: "Bubbles'ın 8 kolu var — çak beşlik yapmayı sever!",
    unlockRequirement: {
      type: 'streak',
      value: 14,
      description: 'Reach a 14-day streak',
      descriptionTr: '14 günlük seri yap',
    },
    primaryColor: 'var(--info, #3b82f6)',
    accentColor: 'var(--primary)',
  },
  {
    id: 'sparky_alien',
    name: 'Sparky the Alien',
    nameTr: 'Uzaylı Sparky',
    description: 'Sparky came from Planet Vocab to master Earth words!',
    descriptionTr: 'Sparky, Dünya kelimelerini öğrenmek için Kelime Gezegeninden geldi!',
    unlockRequirement: {
      type: 'words',
      value: 100,
      description: 'Learn 100 words',
      descriptionTr: '100 kelime öğren',
    },
    primaryColor: 'var(--success, #22c55e)',
    accentColor: 'var(--info, #3b82f6)',
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
