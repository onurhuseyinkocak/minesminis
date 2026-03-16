import { describe, it, expect } from 'vitest';
import {
  createDefaultState,
  substituteText,
  getDominantTrait,
  getStoryProgress,
} from '../../data/storyEngine';
import type { StoryState } from '../../data/storyEngine';
import type { TraitId, WorldId } from '../../data/storyWorlds';

// ============================================================
// createDefaultState
// ============================================================
describe('createDefaultState', () => {
  it('should set the correct userId', () => {
    const state = createDefaultState('user-123', 'Mimi', 'mimi_dragon');
    expect(state.userId).toBe('user-123');
  });

  it('should set the correct characterName', () => {
    const state = createDefaultState('user-123', 'TestChar', 'mimi_dragon');
    expect(state.characterName).toBe('TestChar');
  });

  it('should set the correct mascotId', () => {
    const state = createDefaultState('user-123', 'Mimi', 'nova_fox');
    expect(state.mascotId).toBe('nova_fox');
  });

  it('should start in the forest world', () => {
    const state = createDefaultState('u1', 'Name', 'mimi_dragon');
    expect(state.currentWorld).toBe('forest');
  });

  it('should have a currentNodeId set', () => {
    const state = createDefaultState('u1', 'Name', 'mimi_dragon');
    expect(state.currentNodeId).toBeTruthy();
    expect(typeof state.currentNodeId).toBe('string');
  });

  it('should initialize all traits to 0', () => {
    const state = createDefaultState('u1', 'Name', 'mimi_dragon');
    expect(state.traits.courage).toBe(0);
    expect(state.traits.wisdom).toBe(0);
    expect(state.traits.kindness).toBe(0);
    expect(state.traits.curiosity).toBe(0);
  });

  it('should have exactly 4 traits', () => {
    const state = createDefaultState('u1', 'Name', 'mimi_dragon');
    expect(Object.keys(state.traits)).toHaveLength(4);
  });

  it('should start with empty inventory', () => {
    const state = createDefaultState('u1', 'Name', 'mimi_dragon');
    expect(state.inventory).toEqual([]);
  });

  it('should start with empty visitedNodeIds', () => {
    const state = createDefaultState('u1', 'Name', 'mimi_dragon');
    expect(state.visitedNodeIds).toEqual([]);
  });

  it('should start with 0 totalXP', () => {
    const state = createDefaultState('u1', 'Name', 'mimi_dragon');
    expect(state.totalXP).toBe(0);
  });

  it('should start with empty choiceHistory', () => {
    const state = createDefaultState('u1', 'Name', 'mimi_dragon');
    expect(state.choiceHistory).toEqual([]);
  });

  it('should set sessionCount to 1', () => {
    const state = createDefaultState('u1', 'Name', 'mimi_dragon');
    expect(state.sessionCount).toBe(1);
  });

  it('should have createdAt as a valid ISO date string', () => {
    const state = createDefaultState('u1', 'Name', 'mimi_dragon');
    expect(new Date(state.createdAt).toISOString()).toBe(state.createdAt);
  });

  it('should have updatedAt as a valid ISO date string', () => {
    const state = createDefaultState('u1', 'Name', 'mimi_dragon');
    expect(new Date(state.updatedAt).toISOString()).toBe(state.updatedAt);
  });
});

// ============================================================
// substituteText
// ============================================================
describe('substituteText', () => {
  const mockState: StoryState = {
    userId: 'u1',
    characterName: 'Mimi',
    mascotId: 'mimi_dragon',
    currentWorld: 'forest',
    currentNodeId: 'f_start',
    traits: { courage: 0, wisdom: 0, kindness: 0, curiosity: 0 },
    inventory: [],
    visitedNodeIds: [],
    totalXP: 0,
    choiceHistory: [],
    sessionCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('should replace {{name}} with characterName', () => {
    expect(substituteText('Hello {{name}}!', mockState)).toBe('Hello Mimi!');
  });

  it('should replace multiple {{name}} occurrences', () => {
    expect(substituteText('{{name}} and {{name}}', mockState)).toBe('Mimi and Mimi');
  });

  it('should return text unchanged when no placeholder exists', () => {
    expect(substituteText('No placeholder here', mockState)).toBe('No placeholder here');
  });

  it('should return empty string for empty text', () => {
    expect(substituteText('', mockState)).toBe('');
  });

  it('should handle text with only the placeholder', () => {
    expect(substituteText('{{name}}', mockState)).toBe('Mimi');
  });

  it('should not replace other placeholders', () => {
    expect(substituteText('{{other}} text', mockState)).toBe('{{other}} text');
  });

  it('should handle special characters in characterName', () => {
    const stateWithSpecial = { ...mockState, characterName: 'O\'Brien' };
    expect(substituteText('Hello {{name}}', stateWithSpecial)).toBe("Hello O'Brien");
  });
});

// ============================================================
// getDominantTrait
// ============================================================
describe('getDominantTrait', () => {
  it('should return the trait with highest value', () => {
    const traits: Record<TraitId, number> = { courage: 10, wisdom: 5, kindness: 3, curiosity: 1 };
    expect(getDominantTrait(traits)).toBe('courage');
  });

  it('should return wisdom when it is highest', () => {
    const traits: Record<TraitId, number> = { courage: 1, wisdom: 20, kindness: 3, curiosity: 5 };
    expect(getDominantTrait(traits)).toBe('wisdom');
  });

  it('should return kindness when it is highest', () => {
    const traits: Record<TraitId, number> = { courage: 1, wisdom: 1, kindness: 10, curiosity: 5 };
    expect(getDominantTrait(traits)).toBe('kindness');
  });

  it('should return curiosity when it is highest', () => {
    const traits: Record<TraitId, number> = { courage: 0, wisdom: 0, kindness: 0, curiosity: 5 };
    expect(getDominantTrait(traits)).toBe('curiosity');
  });

  it('should return the first max trait when tied', () => {
    // When all are 0, the iteration order determines the winner.
    // The function starts with maxVal = -1, so the first trait encountered > -1 wins.
    const traits: Record<TraitId, number> = { courage: 0, wisdom: 0, kindness: 0, curiosity: 0 };
    const result = getDominantTrait(traits);
    // Any of the four is valid since they are all 0 (all > -1)
    expect(['courage', 'wisdom', 'kindness', 'curiosity']).toContain(result);
  });

  it('should handle negative values', () => {
    const traits: Record<TraitId, number> = { courage: -5, wisdom: -2, kindness: -10, curiosity: -1 };
    expect(getDominantTrait(traits)).toBe('curiosity');
  });

  it('should handle mixed positive and negative', () => {
    const traits: Record<TraitId, number> = { courage: -5, wisdom: 3, kindness: -10, curiosity: 2 };
    expect(getDominantTrait(traits)).toBe('wisdom');
  });

  it('should handle very large values', () => {
    const traits: Record<TraitId, number> = { courage: 999999, wisdom: 0, kindness: 0, curiosity: 0 };
    expect(getDominantTrait(traits)).toBe('courage');
  });
});

// ============================================================
// getStoryProgress
// ============================================================
describe('getStoryProgress', () => {
  const baseState: StoryState = {
    userId: 'u1',
    characterName: 'Test',
    mascotId: 'mimi_dragon',
    currentWorld: 'forest',
    currentNodeId: 'f_start',
    traits: { courage: 0, wisdom: 0, kindness: 0, curiosity: 0 },
    inventory: [],
    visitedNodeIds: [],
    totalXP: 0,
    choiceHistory: [],
    sessionCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('should return 0 nodesVisited for empty state', () => {
    const progress = getStoryProgress(baseState);
    expect(progress.nodesVisited).toBe(0);
  });

  it('should return empty worldsExplored for empty state', () => {
    const progress = getStoryProgress(baseState);
    expect(progress.worldsExplored).toEqual([]);
  });

  it('should return 0 itemsCollected for empty state', () => {
    const progress = getStoryProgress(baseState);
    expect(progress.itemsCollected).toBe(0);
  });

  it('should return 0 totalChoices for empty state', () => {
    const progress = getStoryProgress(baseState);
    expect(progress.totalChoices).toBe(0);
  });

  it('should count visited nodes', () => {
    const state = { ...baseState, visitedNodeIds: ['n1', 'n2', 'n3'] };
    expect(getStoryProgress(state).nodesVisited).toBe(3);
  });

  it('should count items collected', () => {
    const state = { ...baseState, inventory: ['sword', 'shield'] };
    expect(getStoryProgress(state).itemsCollected).toBe(2);
  });

  it('should count total choices', () => {
    const state = {
      ...baseState,
      choiceHistory: [
        { nodeId: 'n1', choiceId: 'c1', world: 'forest' as WorldId, timestamp: '' },
        { nodeId: 'n2', choiceId: 'c2', world: 'forest' as WorldId, timestamp: '' },
      ],
    };
    expect(getStoryProgress(state).totalChoices).toBe(2);
  });

  it('should return unique worlds explored', () => {
    const state = {
      ...baseState,
      choiceHistory: [
        { nodeId: 'n1', choiceId: 'c1', world: 'forest' as WorldId, timestamp: '' },
        { nodeId: 'n2', choiceId: 'c2', world: 'ocean' as WorldId, timestamp: '' },
        { nodeId: 'n3', choiceId: 'c3', world: 'forest' as WorldId, timestamp: '' },
      ],
    };
    const progress = getStoryProgress(state);
    expect(progress.worldsExplored).toHaveLength(2);
    expect(progress.worldsExplored).toContain('forest');
    expect(progress.worldsExplored).toContain('ocean');
  });

  it('should not duplicate worlds in worldsExplored', () => {
    const state = {
      ...baseState,
      choiceHistory: [
        { nodeId: 'n1', choiceId: 'c1', world: 'forest' as WorldId, timestamp: '' },
        { nodeId: 'n2', choiceId: 'c2', world: 'forest' as WorldId, timestamp: '' },
        { nodeId: 'n3', choiceId: 'c3', world: 'forest' as WorldId, timestamp: '' },
      ],
    };
    expect(getStoryProgress(state).worldsExplored).toHaveLength(1);
  });
});
