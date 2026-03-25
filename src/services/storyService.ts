/**
 * STORY SERVICE - Persistence for story progress
 * Tries Supabase first, falls back to localStorage if table doesn't exist
 */

import { supabase } from '../config/supabase';
import type { StoryState } from '../data/storyEngine';
import { createDefaultState } from '../data/storyEngine';

const LS_KEY = 'mimi_story_progress';
let useLocalStorage = false;
let lastFallbackTime = 0;
const FALLBACK_RETRY_MS = 60_000;

// ─────────── LOCAL STORAGE HELPERS ───────────

function loadFromLS(userId: string): StoryState | null {
  try {
    const raw = localStorage.getItem(`${LS_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToLS(state: StoryState): boolean {
  try {
    localStorage.setItem(`${LS_KEY}_${state.userId}`, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

function deleteFromLS(userId: string): boolean {
  try {
    localStorage.removeItem(`${LS_KEY}_${userId}`);
    return true;
  } catch {
    return false;
  }
}

// ─────────── LOAD ───────────

export async function loadStoryState(userId: string): Promise<StoryState | null> {
  if (useLocalStorage && Date.now() - lastFallbackTime > FALLBACK_RETRY_MS) {
    useLocalStorage = false;
  }
  if (useLocalStorage) return loadFromLS(userId);

  try {
    const { data, error } = await supabase
      .from('story_progress')
      .select('user_id, character_name, mascot_id, current_world, current_node_id, traits, inventory, visited_node_ids, total_xp, choice_history, session_count, created_at, updated_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      // Table doesn't exist or connection issue - switch to localStorage
      // Supabase story_progress unavailable — fall back to localStorage
      useLocalStorage = true;
      lastFallbackTime = Date.now();
      return loadFromLS(userId);
    }

    if (!data) return null;

    return {
      userId: data.user_id,
      characterName: data.character_name,
      mascotId: data.mascot_id,
      currentWorld: data.current_world,
      currentNodeId: data.current_node_id,
      traits: data.traits,
      inventory: data.inventory || [],
      visitedNodeIds: data.visited_node_ids || [],
      totalXP: data.total_xp || 0,
      choiceHistory: data.choice_history || [],
      sessionCount: data.session_count || 1,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    useLocalStorage = true;
    lastFallbackTime = Date.now();
    return loadFromLS(userId);
  }
}

// ─────────── SAVE ───────────

export async function saveStoryState(state: StoryState): Promise<boolean> {
  // Always save to localStorage as backup
  saveToLS(state);

  if (useLocalStorage) return true;

  try {
    const payload = {
      user_id: state.userId,
      character_name: state.characterName,
      mascot_id: state.mascotId,
      current_world: state.currentWorld,
      current_node_id: state.currentNodeId,
      traits: state.traits,
      inventory: state.inventory,
      visited_node_ids: state.visitedNodeIds,
      total_xp: state.totalXP,
      choice_history: state.choiceHistory,
      session_count: state.sessionCount,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('story_progress')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      // Supabase save failed — localStorage backup already stored above
      useLocalStorage = true;
      lastFallbackTime = Date.now();
      return true; // localStorage save already done above
    }

    return true;
  } catch {
    useLocalStorage = true;
    lastFallbackTime = Date.now();
    return true;
  }
}

// ─────────── INIT ───────────

export async function initOrLoadStory(
  userId: string,
  characterName: string,
  mascotId: string
): Promise<StoryState> {
  const existing = await loadStoryState(userId);

  if (existing) {
    existing.sessionCount += 1;
    existing.updatedAt = new Date().toISOString();
    if (characterName && characterName !== existing.characterName) {
      existing.characterName = characterName;
    }
    await saveStoryState(existing);
    return existing;
  }

  const newState = createDefaultState(userId, characterName, mascotId);
  await saveStoryState(newState);
  return newState;
}

// ─────────── DELETE (reset story) ───────────

export async function resetStoryProgress(userId: string): Promise<boolean> {
  deleteFromLS(userId);

  if (useLocalStorage) return true;

  try {
    const { error } = await supabase
      .from('story_progress')
      .delete()
      .eq('user_id', userId);

    if (error) {
      // Supabase delete failed — localStorage already cleared above
      useLocalStorage = true;
      lastFallbackTime = Date.now();
    }
  } catch {
    useLocalStorage = true;
    lastFallbackTime = Date.now();
  }
  return true;
}
