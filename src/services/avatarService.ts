import { AVATAR_ITEMS } from '../data/avatarItems';
import type { AvatarItem } from '../data/avatarItems';

const LS_KEY = 'mm_avatar';

export interface AvatarConfig {
  color: string;
  hat: string | null;
  accessory: string | null;
  background: string | null;
  frame: string | null;
}

const DEFAULT_AVATAR: AvatarConfig = {
  color: 'color-blue',
  hat: null,
  accessory: null,
  background: null,
  frame: null,
};

export function getAvatarConfig(userId: string): AvatarConfig {
  try {
    const raw = localStorage.getItem(`${LS_KEY}_${userId}`);
    if (!raw) return { ...DEFAULT_AVATAR };
    const parsed = JSON.parse(raw) as Partial<AvatarConfig>;
    return {
      color: parsed.color ?? DEFAULT_AVATAR.color,
      hat: parsed.hat ?? null,
      accessory: parsed.accessory ?? null,
      background: parsed.background ?? null,
      frame: parsed.frame ?? null,
    };
  } catch {
    return { ...DEFAULT_AVATAR };
  }
}

export function saveAvatarConfig(userId: string, config: AvatarConfig): void {
  try {
    localStorage.setItem(`${LS_KEY}_${userId}`, JSON.stringify(config));
  } catch {
    // Storage unavailable — fail silently
  }
}

export interface UnlockStats {
  xp: number;
  streak: number;
  badges: string[];
  level: number;
  isPremium: boolean;
}

export function isItemUnlocked(item: AvatarItem, stats: UnlockStats): boolean {
  switch (item.unlockType) {
    case 'free':
      return true;
    case 'xp':
      return stats.xp >= (item.unlockValue ?? 0);
    case 'streak':
      return stats.streak >= (item.unlockValue ?? 0);
    case 'badge':
      if (item.unlockValue !== undefined) {
        return stats.badges.length >= item.unlockValue;
      }
      return stats.badges.length > 0;
    case 'premium':
      return stats.isPremium;
    default:
      return false;
  }
}

export function getUnlockedItems(stats: UnlockStats): string[] {
  return AVATAR_ITEMS
    .filter((item) => isItemUnlocked(item, stats))
    .map((item) => item.id);
}

export function getUnlockHint(item: AvatarItem): string {
  switch (item.unlockType) {
    case 'xp':
      return `${item.unlockValue} XP kazan`;
    case 'streak':
      return `${item.unlockValue} gün seri yap`;
    case 'badge':
      if (item.unlockValue !== undefined) {
        return `${item.unlockValue} rozet kazan`;
      }
      return 'Rozet kazan';
    case 'premium':
      return 'Premium üye ol';
    default:
      return '';
  }
}
