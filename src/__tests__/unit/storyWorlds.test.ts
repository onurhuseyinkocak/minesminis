import { describe, it, expect } from 'vitest';
import {
  WORLDS,
  WORLD_ORDER,
  TRAIT_NAMES,
  getAvailableWorlds,
  WorldId,
  TraitId,
} from '../../data/storyWorlds';

function makeTraits(overrides: Partial<Record<TraitId, number>> = {}): Record<TraitId, number> {
  return {
    courage: 0,
    wisdom: 0,
    kindness: 0,
    curiosity: 0,
    ...overrides,
  };
}

describe('storyWorlds', () => {
  // ─── WORLDS ───────────────────────────────────────────────
  describe('WORLDS', () => {
    it('should contain exactly 5 worlds', () => {
      expect(Object.keys(WORLDS)).toHaveLength(5);
    });

    it('should include forest, ocean, mountain, space, desert', () => {
      expect(WORLDS.forest).toBeDefined();
      expect(WORLDS.ocean).toBeDefined();
      expect(WORLDS.mountain).toBeDefined();
      expect(WORLDS.space).toBeDefined();
      expect(WORLDS.desert).toBeDefined();
    });

    it('each world should have required fields', () => {
      for (const worldId of Object.keys(WORLDS) as WorldId[]) {
        const world = WORLDS[worldId];
        expect(world.id).toBe(worldId);
        expect(world.name).toBeTruthy();
        expect(world.emoji).toBeTruthy();
        expect(world.description).toBeTruthy();
        expect(world.color).toBeTruthy();
        expect(world.gradient).toBeTruthy();
        expect(world.entryTrait).toBeTruthy();
        expect(world.entryThreshold).toBeGreaterThanOrEqual(0);
        expect(world.locations.length).toBeGreaterThan(0);
        expect(world.npcs.length).toBeGreaterThan(0);
        expect(world.items.length).toBeGreaterThan(0);
        expect(world.ambientSounds.length).toBeGreaterThan(0);
      }
    });

    it('forest should require curiosity >= 0', () => {
      expect(WORLDS.forest.entryTrait).toBe('curiosity');
      expect(WORLDS.forest.entryThreshold).toBe(0);
    });

    it('ocean should require kindness >= 15', () => {
      expect(WORLDS.ocean.entryTrait).toBe('kindness');
      expect(WORLDS.ocean.entryThreshold).toBe(15);
    });

    it('mountain should require courage >= 15', () => {
      expect(WORLDS.mountain.entryTrait).toBe('courage');
      expect(WORLDS.mountain.entryThreshold).toBe(15);
    });

    it('space should require curiosity >= 25', () => {
      expect(WORLDS.space.entryTrait).toBe('curiosity');
      expect(WORLDS.space.entryThreshold).toBe(25);
    });

    it('desert should require wisdom >= 15', () => {
      expect(WORLDS.desert.entryTrait).toBe('wisdom');
      expect(WORLDS.desert.entryThreshold).toBe(15);
    });

    it('each world should have 5 locations', () => {
      for (const worldId of Object.keys(WORLDS) as WorldId[]) {
        expect(WORLDS[worldId].locations).toHaveLength(5);
      }
    });

    it('each world should have 3 NPCs', () => {
      for (const worldId of Object.keys(WORLDS) as WorldId[]) {
        expect(WORLDS[worldId].npcs).toHaveLength(3);
      }
    });

    it('each world should have 3 items', () => {
      for (const worldId of Object.keys(WORLDS) as WorldId[]) {
        expect(WORLDS[worldId].items).toHaveLength(3);
      }
    });

    it('items should have common, rare, and legendary rarities', () => {
      for (const worldId of Object.keys(WORLDS) as WorldId[]) {
        const rarities = WORLDS[worldId].items.map(i => i.rarity);
        expect(rarities).toContain('common');
        expect(rarities).toContain('rare');
        expect(rarities).toContain('legendary');
      }
    });
  });

  // ─── WORLD_ORDER ──────────────────────────────────────────
  describe('WORLD_ORDER', () => {
    it('should have 5 entries', () => {
      expect(WORLD_ORDER).toHaveLength(5);
    });

    it('should start with forest', () => {
      expect(WORLD_ORDER[0]).toBe('forest');
    });

    it('should end with space', () => {
      expect(WORLD_ORDER[WORLD_ORDER.length - 1]).toBe('space');
    });

    it('should match the expected order', () => {
      expect(WORLD_ORDER).toEqual(['forest', 'ocean', 'mountain', 'desert', 'space']);
    });
  });

  // ─── TRAIT_NAMES ──────────────────────────────────────────
  describe('TRAIT_NAMES', () => {
    it('should define all 4 traits', () => {
      expect(TRAIT_NAMES.courage).toBeDefined();
      expect(TRAIT_NAMES.wisdom).toBeDefined();
      expect(TRAIT_NAMES.kindness).toBeDefined();
      expect(TRAIT_NAMES.curiosity).toBeDefined();
    });

    it('each trait should have name, emoji, and color', () => {
      for (const trait of Object.values(TRAIT_NAMES)) {
        expect(trait.name).toBeTruthy();
        expect(trait.emoji).toBeTruthy();
        expect(trait.color).toBeTruthy();
      }
    });
  });

  // ─── getAvailableWorlds ───────────────────────────────────
  describe('getAvailableWorlds', () => {
    it('should always include forest (threshold 0)', () => {
      const worlds = getAvailableWorlds(makeTraits());
      expect(worlds).toContain('forest');
    });

    it('should only return forest with all traits at 0', () => {
      const worlds = getAvailableWorlds(makeTraits());
      expect(worlds).toEqual(['forest']);
    });

    it('should unlock ocean when kindness >= 15', () => {
      const worlds = getAvailableWorlds(makeTraits({ kindness: 15 }));
      expect(worlds).toContain('ocean');
    });

    it('should not unlock ocean when kindness < 15', () => {
      const worlds = getAvailableWorlds(makeTraits({ kindness: 14 }));
      expect(worlds).not.toContain('ocean');
    });

    it('should unlock mountain when courage >= 15', () => {
      const worlds = getAvailableWorlds(makeTraits({ courage: 15 }));
      expect(worlds).toContain('mountain');
    });

    it('should not unlock mountain when courage < 15', () => {
      const worlds = getAvailableWorlds(makeTraits({ courage: 10 }));
      expect(worlds).not.toContain('mountain');
    });

    it('should unlock desert when wisdom >= 15', () => {
      const worlds = getAvailableWorlds(makeTraits({ wisdom: 15 }));
      expect(worlds).toContain('desert');
    });

    it('should not unlock desert when wisdom < 15', () => {
      const worlds = getAvailableWorlds(makeTraits({ wisdom: 5 }));
      expect(worlds).not.toContain('desert');
    });

    it('should unlock space when curiosity >= 25', () => {
      const worlds = getAvailableWorlds(makeTraits({ curiosity: 25 }));
      expect(worlds).toContain('space');
    });

    it('should not unlock space when curiosity < 25', () => {
      const worlds = getAvailableWorlds(makeTraits({ curiosity: 24 }));
      expect(worlds).not.toContain('space');
    });

    it('should unlock all worlds with high traits', () => {
      const worlds = getAvailableWorlds(makeTraits({
        courage: 50,
        wisdom: 50,
        kindness: 50,
        curiosity: 50,
      }));
      expect(worlds).toHaveLength(5);
      expect(worlds).toContain('forest');
      expect(worlds).toContain('ocean');
      expect(worlds).toContain('mountain');
      expect(worlds).toContain('desert');
      expect(worlds).toContain('space');
    });

    it('should respect WORLD_ORDER in returned array', () => {
      const worlds = getAvailableWorlds(makeTraits({
        courage: 50,
        wisdom: 50,
        kindness: 50,
        curiosity: 50,
      }));
      expect(worlds).toEqual(['forest', 'ocean', 'mountain', 'desert', 'space']);
    });

    it('should unlock forest and space with curiosity >= 25 only', () => {
      const worlds = getAvailableWorlds(makeTraits({ curiosity: 25 }));
      expect(worlds).toEqual(['forest', 'space']);
    });

    it('should handle exact threshold values', () => {
      const worlds = getAvailableWorlds(makeTraits({
        kindness: 15,
        courage: 15,
        wisdom: 15,
        curiosity: 25,
      }));
      expect(worlds).toHaveLength(5);
    });
  });
});
