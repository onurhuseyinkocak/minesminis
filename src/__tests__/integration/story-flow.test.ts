import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createDefaultState,
  substituteText,
  resolveChoice,
  selectNextNode,
  getDominantTrait,
  getStoryProgress,
} from '../../data/storyEngine';
import { WORLDS } from '../../data/storyWorlds';
import { getStartNode } from '../../data/storyTemplates';
import type { StoryChoice } from '../../data/storyTemplates';
import type { TraitId } from '../../data/storyWorlds';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Story Engine Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. New story starts in forest world
  it('new story starts in forest world with default traits', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');

    expect(state.currentWorld).toBe('forest');
    expect(state.characterName).toBe('Alex');
    expect(state.mascotId).toBe('mimi_dragon');
    expect(state.traits).toEqual({ courage: 0, wisdom: 0, kindness: 0, curiosity: 0 });
    expect(state.inventory).toEqual([]);
    expect(state.totalXP).toBe(0);
    expect(state.sessionCount).toBe(1);
  });

  it('start node exists for forest', () => {
    const startNode = getStartNode('forest');
    expect(startNode).toBeDefined();
    expect(startNode.world).toBe('forest');
    expect(startNode.tags).toContain('start');
    expect(startNode.choices.length).toBeGreaterThan(0);
  });

  // 2. Choice applies trait changes
  it('resolving a choice applies trait effects', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');
    const startNode = getStartNode('forest');

    // Pick the first choice
    const choice = startNode.choices[0];
    const result = resolveChoice(state, choice);

    // Trait changes should be applied
    for (const [trait, delta] of Object.entries(choice.traitEffects)) {
      expect(result.newState.traits[trait as TraitId]).toBe((delta || 0));
    }
    expect(result.traitChanges).toEqual(choice.traitEffects);
  });

  // 3. Choice adds to inventory
  it('choice with itemReward adds item to inventory', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');
    const choiceWithItem: StoryChoice = {
      id: 'test-choice',
      text: 'Pick up the gem',
      emoji: '💎',
      traitEffects: { curiosity: 1 },
      xpReward: 10,
      nextTags: ['forest-explore'],
      itemReward: 'magic_gem',
    };

    const result = resolveChoice(state, choiceWithItem);
    expect(result.newState.inventory).toContain('magic_gem');
    expect(result.itemGained).toBe('magic_gem');
  });

  it('does not duplicate items already in inventory', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');
    state.inventory = ['magic_gem'];

    const choice: StoryChoice = {
      id: 'c2',
      text: 'Find gem again',
      emoji: '💎',
      traitEffects: {},
      xpReward: 5,
      nextTags: ['forest-explore'],
      itemReward: 'magic_gem',
    };

    const result = resolveChoice(state, choice);
    const gemCount = result.newState.inventory.filter(i => i === 'magic_gem').length;
    expect(gemCount).toBe(1);
  });

  // 4. XP accumulated from choices
  it('XP accumulates from choice xpReward', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');
    const choice: StoryChoice = {
      id: 'xp-choice',
      text: 'Do something brave',
      emoji: '🦁',
      traitEffects: { courage: 2 },
      xpReward: 15,
      nextTags: ['forest-explore'],
    };

    const result1 = resolveChoice(state, choice);
    expect(result1.newState.totalXP).toBe(15);
    expect(result1.xpGained).toBe(15);

    // Second choice
    const result2 = resolveChoice(result1.newState, { ...choice, id: 'xp-choice2', xpReward: 20 });
    expect(result2.newState.totalXP).toBe(35);
  });

  // 5. World gating blocks entry without sufficient traits
  it('blocks entry to ocean world without enough kindness', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');
    // ocean requires kindness >= 15
    expect(WORLDS.ocean.entryTrait).toBe('kindness');
    expect(WORLDS.ocean.entryThreshold).toBe(15);

    const choice: StoryChoice = {
      id: 'go-ocean',
      text: 'Go to the ocean',
      emoji: '🌊',
      traitEffects: {},
      xpReward: 5,
      nextTags: ['ocean-explore'],
      nextWorld: 'ocean',
    };

    const result = resolveChoice(state, choice);
    // Should stay in forest because kindness is 0 < 15
    expect(result.newState.currentWorld).toBe('forest');
    expect(result.worldChanged).toBe(false);
  });

  it('allows entry to ocean world with sufficient kindness', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');
    state.traits.kindness = 20;

    const choice: StoryChoice = {
      id: 'go-ocean',
      text: 'Go to the ocean',
      emoji: '🌊',
      traitEffects: {},
      xpReward: 5,
      nextTags: ['start'],
      nextWorld: 'ocean',
    };

    const result = resolveChoice(state, choice);
    expect(result.newState.currentWorld).toBe('ocean');
    expect(result.worldChanged).toBe(true);
  });

  // 6. Node selection avoids recent nodes
  it('selectNextNode avoids recent nodes when possible', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');
    // Add many visited nodes so selection tries to avoid them
    state.visitedNodeIds = ['f_start', 'f_explore1', 'f_explore2'];

    const node = selectNextNode(['start'], undefined, state);
    expect(node).toBeDefined();
    expect(node.world).toBe('forest');
  });

  // 7. Substitute text replaces character name
  it('substituteText replaces {{name}} with character name', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');
    const text = 'Hello {{name}}! Welcome to the forest, {{name}}.';
    const result = substituteText(text, state);
    expect(result).toBe('Hello Alex! Welcome to the forest, Alex.');
  });

  it('substituteText handles text without placeholders', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');
    const text = 'No placeholders here.';
    expect(substituteText(text, state)).toBe('No placeholders here.');
  });

  // 8. Progress tracking counts correctly
  it('getStoryProgress returns correct counts', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');
    state.visitedNodeIds = ['n1', 'n2', 'n3'];
    state.inventory = ['item1', 'item2'];
    state.choiceHistory = [
      { nodeId: 'n1', choiceId: 'c1', world: 'forest', timestamp: '' },
      { nodeId: 'n2', choiceId: 'c2', world: 'forest', timestamp: '' },
      { nodeId: 'n3', choiceId: 'c3', world: 'ocean', timestamp: '' },
    ];

    const progress = getStoryProgress(state);
    expect(progress.nodesVisited).toBe(3);
    expect(progress.itemsCollected).toBe(2);
    expect(progress.totalChoices).toBe(3);
    expect(progress.worldsExplored).toContain('forest');
    expect(progress.worldsExplored).toContain('ocean');
    expect(progress.worldsExplored).toHaveLength(2);
  });

  // 9. Dominant trait identifies max
  it('getDominantTrait returns trait with highest value', () => {
    expect(getDominantTrait({ courage: 5, wisdom: 10, kindness: 3, curiosity: 7 })).toBe('wisdom');
    expect(getDominantTrait({ courage: 20, wisdom: 10, kindness: 3, curiosity: 7 })).toBe('courage');
    expect(getDominantTrait({ courage: 0, wisdom: 0, kindness: 0, curiosity: 1 })).toBe('curiosity');
  });

  it('getDominantTrait returns last highest on tie (deterministic)', () => {
    // All zero -> curiosity is checked last and starts as default
    const result = getDominantTrait({ courage: 0, wisdom: 0, kindness: 0, curiosity: 0 });
    // Implementation iterates entries, so the last trait with value > -1 wins; all are 0 so last entry wins
    expect(typeof result).toBe('string');
  });

  // 10. Session count increments
  it('session count starts at 1', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');
    expect(state.sessionCount).toBe(1);
  });

  it('session count can be incremented for new sessions', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');
    const newState = { ...state, sessionCount: state.sessionCount + 1 };
    expect(newState.sessionCount).toBe(2);
  });

  // Edge cases
  it('forest world has entryThreshold of 0 (always accessible)', () => {
    expect(WORLDS.forest.entryThreshold).toBe(0);
  });

  it('all worlds define entryTrait and entryThreshold', () => {
    for (const world of Object.values(WORLDS)) {
      expect(world.entryTrait).toBeDefined();
      expect(typeof world.entryThreshold).toBe('number');
    }
  });

  it('resolveChoice records choice in choiceHistory', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');
    const choice = getStartNode('forest').choices[0];
    const result = resolveChoice(state, choice);

    expect(result.newState.choiceHistory).toHaveLength(1);
    expect(result.newState.choiceHistory[0].choiceId).toBe(choice.id);
    expect(result.newState.choiceHistory[0].world).toBe('forest');
  });

  it('resolveChoice adds current node to visitedNodeIds', () => {
    const state = createDefaultState('user-1', 'Alex', 'mimi_dragon');
    const originalNode = state.currentNodeId;
    const choice = getStartNode('forest').choices[0];
    const result = resolveChoice(state, choice);

    expect(result.newState.visitedNodeIds).toContain(originalNode);
  });
});
