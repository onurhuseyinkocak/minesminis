/**
 * CHILD PROFILE SERVICE
 * Manages multiple child profiles linked to a parent account.
 * Uses localStorage for persistence (no DB migration needed).
 * Family plan supports up to 4 children per parent.
 */

// ============================================================
// TYPES
// ============================================================

export interface ChildProfile {
  id: string;
  name: string;
  age_group: string;
  avatar: string;
  parent_id: string;
  created_at: string;
  // Learning stats (synced from gamification)
  xp: number;
  level: number;
  words_learned: number;
  games_played: number;
  streak_days: number;
}

const MAX_CHILDREN = 4;

const AVATARS = ['🦊', '🐱', '🐶', '🐰', '🐼', '🦁', '🐸', '🦄', '🐧', '🐻', '🐯', '🐮'];

const AGE_GROUPS = ['3-5', '6-8', '9-12'];

// ============================================================
// HELPERS
// ============================================================

function getStorageKey(parentId: string): string {
  return `mimi_children_${parentId}`;
}

function getActiveChildKey(): string {
  return 'mimi_active_child';
}

function loadChildren(parentId: string): ChildProfile[] {
  try {
    const raw = localStorage.getItem(getStorageKey(parentId));
    if (!raw) return [];
    return JSON.parse(raw) as ChildProfile[];
  } catch {
    return [];
  }
}

function saveChildren(parentId: string, children: ChildProfile[]): void {
  localStorage.setItem(getStorageKey(parentId), JSON.stringify(children));
}

function generateId(): string {
  return `child_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ============================================================
// PUBLIC API
// ============================================================

/** Get all children for a parent. */
export function getChildren(parentId: string): ChildProfile[] {
  return loadChildren(parentId);
}

/** Add a new child profile. Throws if max (4) reached. */
export function addChild(
  parentId: string,
  child: Partial<ChildProfile>,
): ChildProfile {
  const children = loadChildren(parentId);
  if (children.length >= MAX_CHILDREN) {
    throw new Error(`Maximum of ${MAX_CHILDREN} child profiles allowed.`);
  }

  const newChild: ChildProfile = {
    id: generateId(),
    name: child.name || 'Learner',
    age_group: child.age_group || '6-8',
    avatar: child.avatar || '🦊',
    parent_id: parentId,
    created_at: new Date().toISOString(),
    xp: child.xp ?? 0,
    level: child.level ?? 1,
    words_learned: child.words_learned ?? 0,
    games_played: child.games_played ?? 0,
    streak_days: child.streak_days ?? 0,
  };

  children.push(newChild);
  saveChildren(parentId, children);

  // Auto-set as active if first child
  if (children.length === 1) {
    switchActiveChild(newChild.id);
  }

  return newChild;
}

/** Remove a child profile by ID. */
export function removeChild(parentId: string, childId: string): void {
  const children = loadChildren(parentId);
  const filtered = children.filter(c => c.id !== childId);
  saveChildren(parentId, filtered);

  // If we removed the active child, switch to first remaining or clear
  const activeId = getActiveChildId();
  if (activeId === childId) {
    if (filtered.length > 0) {
      switchActiveChild(filtered[0].id);
    } else {
      localStorage.removeItem(getActiveChildKey());
    }
  }
}

/** Update stats for a specific child. */
export function updateChildStats(
  parentId: string,
  childId: string,
  statsUpdate: Partial<Pick<ChildProfile, 'xp' | 'level' | 'words_learned' | 'games_played' | 'streak_days'>>,
): void {
  const children = loadChildren(parentId);
  const idx = children.findIndex(c => c.id === childId);
  if (idx === -1) return;

  children[idx] = { ...children[idx], ...statsUpdate };
  saveChildren(parentId, children);
}

/** Set the currently active child in localStorage. */
export function switchActiveChild(childId: string): void {
  localStorage.setItem(getActiveChildKey(), childId);
}

/** Get the currently active child ID. */
export function getActiveChildId(): string | null {
  return localStorage.getItem(getActiveChildKey());
}

/** Exported constants for UI consumption. */
export { AVATARS, AGE_GROUPS, MAX_CHILDREN };
