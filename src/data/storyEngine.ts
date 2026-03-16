/**
 * STORY ENGINE - Core logic for Mimi's Infinite Adventure
 * Manages state, node selection, choice resolution, template substitution
 */

import type { WorldId, TraitId } from './storyWorlds';
import type { StoryNode, StoryChoice } from './storyTemplates';
import { getNodesByWorldAndTags, getStartNode, ALL_NODES } from './storyTemplates';
import { WORLDS } from './storyWorlds';

// ─────────── TYPES ───────────

export interface StoryState {
  userId: string;
  characterName: string;
  mascotId: string;
  currentWorld: WorldId;
  currentNodeId: string;
  traits: Record<TraitId, number>;
  inventory: string[];
  visitedNodeIds: string[];
  totalXP: number;
  choiceHistory: ChoiceRecord[];
  sessionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChoiceRecord {
  nodeId: string;
  choiceId: string;
  world: WorldId;
  timestamp: string;
}

// ─────────── DEFAULT STATE ───────────

export function createDefaultState(userId: string, characterName: string, mascotId: string): StoryState {
  const startNode = getStartNode('forest');
  return {
    userId,
    characterName,
    mascotId,
    currentWorld: 'forest',
    currentNodeId: startNode.id,
    traits: { courage: 0, wisdom: 0, kindness: 0, curiosity: 0 },
    inventory: [],
    visitedNodeIds: [],
    totalXP: 0,
    choiceHistory: [],
    sessionCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ─────────── TEMPLATE SUBSTITUTION ───────────

export function substituteText(text: string, state: StoryState): string {
  return text.replace(/\{\{name\}\}/g, state.characterName);
}

// ─────────── NODE SELECTION ───────────

export function getCurrentNode(state: StoryState): StoryNode | null {
  const { currentWorld, currentNodeId } = state;
  const startNode = getStartNode(currentWorld);
  if (startNode && startNode.id === currentNodeId) return startNode;

  // Search in all matching nodes
  const allMatching = getNodesByWorldAndTags(currentWorld, ['start', 'entry', currentNodeId], state.traits, []);
  const exact = allMatching.find(n => n.id === currentNodeId);
  if (exact) return exact;

  // Fallback: search all nodes for exact ID
  return ALL_NODES.find(n => n.id === currentNodeId) || startNode;
}

/**
 * Select the next node based on chosen tags and world
 * Uses weighted random from available candidates to keep things fresh
 */
export function selectNextNode(
  nextTags: string[],
  nextWorld: WorldId | undefined,
  state: StoryState
): StoryNode {
  const world = nextWorld || state.currentWorld;

  // Get recent 10 nodes to avoid immediate repetition
  const recentIds = state.visitedNodeIds.slice(-10);

  let candidates = getNodesByWorldAndTags(world, nextTags, state.traits, recentIds);

  // Fallback: allow recent nodes if no fresh ones
  if (candidates.length === 0) {
    candidates = getNodesByWorldAndTags(world, nextTags, state.traits, []);
  }

  // Double fallback: go to start of world
  if (candidates.length === 0) {
    return getStartNode(world);
  }

  // Weighted random: prefer nodes the user hasn't seen
  const unseenCandidates = candidates.filter(c => !state.visitedNodeIds.includes(c.id));
  const pool = unseenCandidates.length > 0 ? unseenCandidates : candidates;

  return pool[Math.floor(Math.random() * pool.length)];
}

// ─────────── CHOICE RESOLUTION ───────────

export interface ChoiceResult {
  newState: StoryState;
  nextNode: StoryNode;
  xpGained: number;
  traitChanges: Partial<Record<TraitId, number>>;
  itemGained: string | null;
  worldChanged: boolean;
}

export function resolveChoice(state: StoryState, choice: StoryChoice): ChoiceResult {
  const traitChanges = choice.traitEffects;
  const newTraits = { ...state.traits };

  // Apply trait changes
  for (const [trait, delta] of Object.entries(traitChanges)) {
    newTraits[trait as TraitId] = (newTraits[trait as TraitId] || 0) + (delta || 0);
  }

  // Add item to inventory
  const newInventory = [...state.inventory];
  if (choice.itemReward && !newInventory.includes(choice.itemReward)) {
    newInventory.push(choice.itemReward);
  }

  // Select next node
  const nextWorld = choice.nextWorld;
  const worldChanged = !!nextWorld && nextWorld !== state.currentWorld;

  // Check if user can enter the next world
  const targetWorld = nextWorld || state.currentWorld;
  const worldConfig = WORLDS[targetWorld];
  const canEnter = newTraits[worldConfig.entryTrait] >= worldConfig.entryThreshold;

  // If can't enter, stay in current world
  const effectiveWorld = canEnter ? targetWorld : state.currentWorld;
  const effectiveTags = canEnter ? choice.nextTags : ['start'];

  const nextNode = selectNextNode(effectiveTags, effectiveWorld, {
    ...state,
    traits: newTraits,
  });

  const newState: StoryState = {
    ...state,
    currentWorld: effectiveWorld,
    currentNodeId: nextNode.id,
    traits: newTraits,
    inventory: newInventory,
    visitedNodeIds: [...state.visitedNodeIds, state.currentNodeId],
    totalXP: state.totalXP + choice.xpReward,
    choiceHistory: [
      ...state.choiceHistory,
      {
        nodeId: state.currentNodeId,
        choiceId: choice.id,
        world: state.currentWorld,
        timestamp: new Date().toISOString(),
      },
    ],
    updatedAt: new Date().toISOString(),
  };

  return {
    newState,
    nextNode,
    xpGained: choice.xpReward,
    traitChanges,
    itemGained: choice.itemReward || null,
    worldChanged: worldChanged && canEnter,
  };
}

// ─────────── STATS HELPERS ───────────

export function getDominantTrait(traits: Record<TraitId, number>): TraitId {
  let max: TraitId = 'curiosity';
  let maxVal = -1;
  for (const [trait, val] of Object.entries(traits)) {
    if (val > maxVal) {
      maxVal = val;
      max = trait as TraitId;
    }
  }
  return max;
}

export function getStoryProgress(state: StoryState): {
  nodesVisited: number;
  worldsExplored: WorldId[];
  itemsCollected: number;
  totalChoices: number;
} {
  const worldsExplored = [...new Set(state.choiceHistory.map(c => c.world))];
  return {
    nodesVisited: state.visitedNodeIds.length,
    worldsExplored: worldsExplored as WorldId[],
    itemsCollected: state.inventory.length,
    totalChoices: state.choiceHistory.length,
  };
}
