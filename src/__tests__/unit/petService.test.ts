import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase before importing petService
const mockUpsert = vi.fn().mockResolvedValue({ data: null, error: null });
const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) });
const mockSelectEq = vi.fn().mockReturnValue({
  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
});
const mockSelect = vi.fn().mockReturnValue({ eq: mockSelectEq });
const mockFrom = vi.fn().mockReturnValue({
  upsert: mockUpsert,
  update: mockUpdate,
  select: mockSelect,
});

vi.mock('../../config/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import {
  createPet,
  getUserPet,
  feedPet,
  playWithPet,
  sleepPet,
  updatePetStats,
  getPetMood,
  renamePet,
  PET_TYPES,
  VirtualPet,
} from '../../services/petService';

function makePet(overrides: Partial<VirtualPet> = {}): VirtualPet {
  const now = new Date().toISOString();
  return {
    id: 'user-1',
    name: 'Cat',
    type: 'cat',
    emoji: '\uD83D\uDC31',
    level: 1,
    experience: 0,
    happiness: 50,
    hunger: 50,
    energy: 50,
    lastFed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    lastPlayed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    createdAt: now,
    ...overrides,
  };
}

describe('petService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // ─── PET_TYPES ────────────────────────────────────────────
  describe('PET_TYPES', () => {
    it('should contain exactly 3 pet types', () => {
      expect(PET_TYPES).toHaveLength(3);
    });

    it('should include cat, dog, and bird', () => {
      const types = PET_TYPES.map(p => p.type);
      expect(types).toContain('cat');
      expect(types).toContain('dog');
      expect(types).toContain('bird');
    });

    it('each pet type should have name and lottie URLs', () => {
      for (const pet of PET_TYPES) {
        expect(pet.name).toBeTruthy();
        expect(pet.lottieIdle).toBeTruthy();
        expect(pet.lottiePlay).toBeTruthy();
      }
    });
  });

  // ─── createPet ────────────────────────────────────────────
  describe('createPet', () => {
    it('should map mimi_dragon to cat', async () => {
      const pet = await createPet('user-1', 'mimi_dragon');
      expect(pet.type).toBe('cat');
    });

    it('should map nova_fox to dog', async () => {
      const pet = await createPet('user-1', 'nova_fox');
      expect(pet.type).toBe('dog');
    });

    it('should map bubbles_octo to bird', async () => {
      const pet = await createPet('user-1', 'bubbles_octo');
      expect(pet.type).toBe('bird');
    });

    it('should map sparky_alien to cat', async () => {
      const pet = await createPet('user-1', 'sparky_alien');
      expect(pet.type).toBe('cat');
    });

    it('should accept direct pet type "dog"', async () => {
      const pet = await createPet('user-1', 'dog');
      expect(pet.type).toBe('dog');
    });

    it('should accept direct pet type "bird"', async () => {
      const pet = await createPet('user-1', 'bird');
      expect(pet.type).toBe('bird');
    });

    it('should default to cat for unknown mascot', async () => {
      const pet = await createPet('user-1', 'unknown_thing');
      expect(pet.type).toBe('cat');
    });

    it('should use customName when provided', async () => {
      const pet = await createPet('user-1', 'cat', 'Fluffy');
      expect(pet.name).toBe('Fluffy');
    });

    it('should use default name when customName not provided', async () => {
      const pet = await createPet('user-1', 'dog');
      expect(pet.name).toBe('Dog');
    });

    it('should set initial stats correctly', async () => {
      const pet = await createPet('user-1', 'cat');
      expect(pet.level).toBe(1);
      expect(pet.experience).toBe(0);
      expect(pet.happiness).toBe(100);
      expect(pet.hunger).toBe(50);
      expect(pet.energy).toBe(100);
    });

    it('should set the correct emoji for cat', async () => {
      const pet = await createPet('user-1', 'cat');
      expect(pet.emoji).toBeTruthy();
    });

    it('should call supabase upsert', async () => {
      await createPet('user-1', 'cat');
      expect(mockFrom).toHaveBeenCalledWith('pets');
      expect(mockUpsert).toHaveBeenCalled();
    });

    it('should fallback to localStorage when DB fails', async () => {
      mockUpsert.mockRejectedValueOnce(new Error('DB error'));
      const pet = await createPet('user-1', 'cat');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'pet_user-1',
        expect.any(String)
      );
      expect(pet.type).toBe('cat');
    });

    it('should map legacy mimi_cat to cat', async () => {
      const pet = await createPet('user-1', 'mimi_cat');
      expect(pet.type).toBe('cat');
    });

    it('should map legacy ruby_fox to dog', async () => {
      const pet = await createPet('user-1', 'ruby_fox');
      expect(pet.type).toBe('dog');
    });

    it('should map legacy indigo_bunny to bird', async () => {
      const pet = await createPet('user-1', 'indigo_bunny');
      expect(pet.type).toBe('bird');
    });
  });

  // ─── getUserPet ───────────────────────────────────────────
  describe('getUserPet', () => {
    it('should return null when no pet exists', async () => {
      const result = await getUserPet('user-missing');
      expect(result).toBeNull();
    });

    it('should fallback to localStorage when DB returns error', async () => {
      mockSelectEq.mockReturnValueOnce({
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: 'fail' } }),
      });
      const storedPet = makePet({ id: 'user-local' });
      localStorage.setItem('pet_user-local', JSON.stringify(storedPet));

      const result = await getUserPet('user-local');
      expect(result).toBeTruthy();
      expect(result!.id).toBe('user-local');
    });

    it('should return null when localStorage has corrupted data', async () => {
      mockSelectEq.mockReturnValueOnce({
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: 'fail' } }),
      });
      localStorage.setItem('pet_user-corrupt', '{invalid json');
      const result = await getUserPet('user-corrupt');
      expect(result).toBeNull();
    });

    it('should map DB type through LEGACY_TO_PET when needed', async () => {
      mockSelectEq.mockReturnValueOnce({
        maybeSingle: vi.fn().mockResolvedValue({
          data: {
            id: 'user-1', name: 'Kitty', type: 'cat',
            level: 2, experience: 50, happiness: 80, hunger: 60, energy: 70,
            last_fed: new Date().toISOString(), last_played: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
          error: null,
        }),
      });

      const result = await getUserPet('user-1');
      expect(result).toBeTruthy();
      expect(result!.type).toBe('cat');
    });
  });

  // ─── feedPet ──────────────────────────────────────────────
  describe('feedPet', () => {
    it('should increase hunger by 30', async () => {
      const pet = makePet({ hunger: 50 });
      const result = await feedPet(pet);
      expect(result.hunger).toBe(80);
    });

    it('should increase happiness by 10', async () => {
      const pet = makePet({ happiness: 50 });
      const result = await feedPet(pet);
      expect(result.happiness).toBe(60);
    });

    it('should increase experience by 5', async () => {
      const pet = makePet({ experience: 0 });
      const result = await feedPet(pet);
      expect(result.experience).toBe(5);
    });

    it('should cap hunger at 100', async () => {
      const pet = makePet({ hunger: 90 });
      const result = await feedPet(pet);
      expect(result.hunger).toBe(100);
    });

    it('should cap happiness at 100', async () => {
      const pet = makePet({ happiness: 95 });
      const result = await feedPet(pet);
      expect(result.happiness).toBe(100);
    });

    it('should throw error if fed within 0.5 hours', async () => {
      const pet = makePet({ lastFed: new Date().toISOString() });
      await expect(feedPet(pet)).rejects.toThrow('Your pet is not hungry yet');
    });

    it('should allow feeding after 0.5 hours', async () => {
      const initialHunger = 50;
      const pet = makePet({
        hunger: initialHunger,
        lastFed: new Date(Date.now() - 31 * 60 * 1000).toISOString(),
      });
      const result = await feedPet(pet);
      expect(result.hunger).toBeGreaterThan(initialHunger);
    });

    it('should update lastFed timestamp', async () => {
      const pet = makePet();
      const before = pet.lastFed;
      const result = await feedPet(pet);
      expect(result.lastFed).not.toBe(before);
    });
  });

  // ─── playWithPet ──────────────────────────────────────────
  describe('playWithPet', () => {
    it('should increase happiness by 20', async () => {
      const pet = makePet({ happiness: 50 });
      const result = await playWithPet(pet);
      expect(result.happiness).toBe(70);
    });

    it('should decrease energy by 15', async () => {
      const pet = makePet({ energy: 50 });
      const result = await playWithPet(pet);
      expect(result.energy).toBe(35);
    });

    it('should increase experience by 10', async () => {
      const pet = makePet({ experience: 0 });
      const result = await playWithPet(pet);
      expect(result.experience).toBe(10);
    });

    it('should cap happiness at 100', async () => {
      const pet = makePet({ happiness: 90 });
      const result = await playWithPet(pet);
      expect(result.happiness).toBe(100);
    });

    it('should not let energy go below 0', async () => {
      const pet = makePet({ energy: 5 });
      const result = await playWithPet(pet);
      expect(result.energy).toBe(0);
    });

    it('should throw error if played within 0.5 hours', async () => {
      const pet = makePet({ lastPlayed: new Date().toISOString() });
      await expect(playWithPet(pet)).rejects.toThrow('Your pet needs to rest');
    });

    it('should allow playing after 0.5 hours', async () => {
      const pet = makePet({
        lastPlayed: new Date(Date.now() - 31 * 60 * 1000).toISOString(),
      });
      const result = await playWithPet(pet);
      expect(result.happiness).toBeGreaterThan(50);
    });

    it('should update lastPlayed timestamp', async () => {
      const pet = makePet();
      const before = pet.lastPlayed;
      const result = await playWithPet(pet);
      expect(result.lastPlayed).not.toBe(before);
    });
  });

  // ─── sleepPet ─────────────────────────────────────────────
  describe('sleepPet', () => {
    it('should increase energy by 40', async () => {
      const pet = makePet({ energy: 30 });
      const result = await sleepPet(pet);
      expect(result.energy).toBe(70);
    });

    it('should decrease hunger by 5', async () => {
      const pet = makePet({ hunger: 50 });
      const result = await sleepPet(pet);
      expect(result.hunger).toBe(45);
    });

    it('should cap energy at 100', async () => {
      const pet = makePet({ energy: 80 });
      const result = await sleepPet(pet);
      expect(result.energy).toBe(100);
    });

    it('should not let hunger go below 0', async () => {
      const pet = makePet({ hunger: 3 });
      const result = await sleepPet(pet);
      expect(result.hunger).toBe(0);
    });
  });

  // ─── getPetMood ───────────────────────────────────────────
  describe('getPetMood', () => {
    it('should return "Very Happy!" for happiness > 80', () => {
      expect(getPetMood(makePet({ happiness: 81 }))).toContain('Very Happy');
    });

    it('should return "Very Happy!" for happiness = 100', () => {
      expect(getPetMood(makePet({ happiness: 100 }))).toContain('Very Happy');
    });

    it('should return "Happy" for happiness > 60 and <= 80', () => {
      expect(getPetMood(makePet({ happiness: 70 }))).toContain('Happy');
      expect(getPetMood(makePet({ happiness: 80 }))).toContain('Happy');
    });

    it('should return "Okay" for happiness > 40 and <= 60', () => {
      expect(getPetMood(makePet({ happiness: 50 }))).toContain('Okay');
      expect(getPetMood(makePet({ happiness: 60 }))).toContain('Okay');
    });

    it('should return "Sad" for happiness > 20 and <= 40', () => {
      expect(getPetMood(makePet({ happiness: 30 }))).toContain('Sad');
      expect(getPetMood(makePet({ happiness: 40 }))).toContain('Sad');
    });

    it('should return "Very Sad" for happiness <= 20', () => {
      expect(getPetMood(makePet({ happiness: 20 }))).toContain('Very Sad');
      expect(getPetMood(makePet({ happiness: 0 }))).toContain('Very Sad');
    });

    it('should not return "Very Happy" for exactly 80', () => {
      const mood = getPetMood(makePet({ happiness: 80 }));
      expect(mood).not.toContain('Very Happy');
    });
  });

  // ─── updatePetStats ───────────────────────────────────────
  describe('updatePetStats', () => {
    it('should decrease hunger based on hours since last fed', async () => {
      const pet = makePet({
        hunger: 50,
        lastFed: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      });
      const result = await updatePetStats(pet);
      // 4 hours * 5 = 20 decrease
      expect(result.hunger).toBe(30);
    });

    it('should not let hunger go below 0 during decay', async () => {
      const pet = makePet({
        hunger: 5,
        lastFed: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
      });
      const result = await updatePetStats(pet);
      expect(result.hunger).toBe(0);
    });

    it('should decrease happiness if not played for 24+ hours', async () => {
      const pet = makePet({
        happiness: 50,
        lastPlayed: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago
      });
      const result = await updatePetStats(pet);
      expect(result.happiness).toBe(40);
    });

    it('should not decrease happiness if played within 24 hours', async () => {
      const pet = makePet({
        happiness: 50,
        lastPlayed: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
      });
      const result = await updatePetStats(pet);
      expect(result.happiness).toBe(50);
    });

    it('should decrease energy based on hours since last played', async () => {
      const pet = makePet({
        energy: 50,
        lastPlayed: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      });
      const result = await updatePetStats(pet);
      // 5 hours * 2 = 10 decrease
      expect(result.energy).toBe(40);
    });

    it('should not let energy go below 0 during decay', async () => {
      const pet = makePet({
        energy: 3,
        lastPlayed: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      });
      const result = await updatePetStats(pet);
      expect(result.energy).toBe(0);
    });
  });

  // ─── renamePet ────────────────────────────────────────────
  describe('renamePet', () => {
    it('should update name in localStorage', async () => {
      const pet = makePet({ id: 'user-rename' });
      localStorage.setItem('pet_user-rename', JSON.stringify(pet));

      await renamePet('user-rename', 'NewName');

      const stored = JSON.parse(localStorage.getItem('pet_user-rename')!);
      expect(stored.name).toBe('NewName');
    });

    it('should call supabase update', async () => {
      localStorage.setItem('pet_user-rename2', JSON.stringify(makePet()));
      await renamePet('user-rename2', 'NewName');
      expect(mockFrom).toHaveBeenCalledWith('pets');
    });

    it('should handle missing localStorage data gracefully', async () => {
      await expect(renamePet('user-no-local', 'NewName')).resolves.toBeUndefined();
    });
  });
});
