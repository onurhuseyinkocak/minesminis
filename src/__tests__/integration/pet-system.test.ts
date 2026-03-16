import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Supabase mock
// ---------------------------------------------------------------------------

const mockUpsert = vi.fn().mockResolvedValue({ error: null });
const mockUpdate = vi.fn().mockReturnValue({
  eq: vi.fn().mockResolvedValue({ error: null }),
});
const mockSelect = vi.fn().mockReturnValue({
  eq: vi.fn().mockReturnValue({
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  }),
});

vi.mock('../../config/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: mockUpsert,
      update: mockUpdate,
      select: mockSelect,
    })),
  },
}));

import {
  createPet,
  feedPet,
  playWithPet,
  sleepPet,
  getPetMood,
  renamePet,
  updatePetStats,
  type VirtualPet,
} from '../../services/petService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePet(overrides: Partial<VirtualPet> = {}): VirtualPet {
  const hourAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  return {
    id: 'user-pet-1',
    name: 'Kitty',
    type: 'cat',
    emoji: '🐱',
    level: 1,
    experience: 0,
    happiness: 70,
    hunger: 50,
    energy: 80,
    lastFed: hourAgo,
    lastPlayed: hourAgo,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Pet System Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // 1. Creating pet from mascot selection
  it('creates a pet from mascot selection', async () => {
    const pet = await createPet('user-1', 'mimi_dragon', 'Flame');
    expect(pet.id).toBe('user-1');
    expect(pet.name).toBe('Flame');
    expect(pet.type).toBe('cat'); // mimi_dragon -> cat
    expect(pet.level).toBe(1);
    expect(pet.happiness).toBe(100);
    expect(pet.energy).toBe(100);
  });

  // 2. Pet type mapping (dragon->cat, fox->dog, etc.)
  it('maps mascot types to pet types correctly', async () => {
    const dragonPet = await createPet('u1', 'mimi_dragon');
    expect(dragonPet.type).toBe('cat');

    const foxPet = await createPet('u2', 'nova_fox');
    expect(foxPet.type).toBe('dog');

    const octoPet = await createPet('u3', 'bubbles_octo');
    expect(octoPet.type).toBe('bird');

    const alienPet = await createPet('u4', 'sparky_alien');
    expect(alienPet.type).toBe('cat');
  });

  // 3. Feed -> hunger increases, happiness increases
  it('feeding increases hunger and happiness', async () => {
    const pet = makePet({ hunger: 50, happiness: 60 });
    const fed = await feedPet(pet);

    expect(fed.hunger).toBe(80);          // 50 + 30
    expect(fed.happiness).toBe(70);        // 60 + 10
    expect(fed.experience).toBeGreaterThan(0);
  });

  // 4. Play -> happiness increases, energy decreases
  it('playing increases happiness and decreases energy', async () => {
    const pet = makePet({ happiness: 60, energy: 80 });
    const played = await playWithPet(pet);

    expect(played.happiness).toBe(80);     // 60 + 20
    expect(played.energy).toBe(65);        // 80 - 15
    expect(played.experience).toBeGreaterThan(0);
  });

  // 5. Sleep -> energy recovers
  it('sleeping recovers energy', async () => {
    const pet = makePet({ energy: 40, hunger: 50 });
    const slept = await sleepPet(pet);

    expect(slept.energy).toBe(80);         // 40 + 40
    expect(slept.hunger).toBe(45);         // 50 - 5
  });

  // 6. Cooldown prevents rapid feed/play
  it('throws error when feeding too soon (< 0.5 hours)', async () => {
    const pet = makePet({ lastFed: new Date().toISOString() }); // just now
    await expect(feedPet(pet)).rejects.toThrow('not hungry yet');
  });

  it('throws error when playing too soon (< 0.5 hours)', async () => {
    const pet = makePet({ lastPlayed: new Date().toISOString() }); // just now
    await expect(playWithPet(pet)).rejects.toThrow('needs to rest');
  });

  // 7. Stats decay over time
  it('hunger decays over time via updatePetStats', async () => {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    const pet = makePet({ hunger: 80, happiness: 70, energy: 90, lastFed: sixHoursAgo, lastPlayed: sixHoursAgo });

    const updated = await updatePetStats(pet);

    // hunger decreases: 80 - floor(6 * 5) = 80 - 30 = 50
    expect(updated.hunger).toBe(50);
    // energy decreases: 90 - floor(6 * 2) = 90 - 12 = 78
    expect(updated.energy).toBe(78);
  });

  it('happiness decays after 24h without play', async () => {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const pet = makePet({ happiness: 60, lastPlayed: twoDaysAgo, lastFed: twoDaysAgo });

    const updated = await updatePetStats(pet);
    expect(updated.happiness).toBe(50); // 60 - 10
  });

  // 8. Level up from XP accumulation
  it('pet levels up when experience exceeds level * 100', async () => {
    // level 1: need 100 XP to level up
    const pet = makePet({ level: 1, experience: 95 });
    // Feed gives +5 XP -> 100 -> level up
    const fed = await feedPet(pet);
    expect(fed.level).toBe(2);
    expect(fed.experience).toBe(0); // 100 - 100 = 0
  });

  it('pet does not level up when XP insufficient', async () => {
    const pet = makePet({ level: 1, experience: 50 });
    const fed = await feedPet(pet);
    expect(fed.level).toBe(1);
    expect(fed.experience).toBe(55); // 50 + 5
  });

  // 9. Pet mood reflects happiness
  it('returns correct mood based on happiness', () => {
    expect(getPetMood(makePet({ happiness: 90 }))).toContain('Very Happy');
    expect(getPetMood(makePet({ happiness: 70 }))).toContain('Happy');
    expect(getPetMood(makePet({ happiness: 50 }))).toContain('Okay');
    expect(getPetMood(makePet({ happiness: 30 }))).toContain('Sad');
    expect(getPetMood(makePet({ happiness: 10 }))).toContain('Very Sad');
  });

  // 10. Rename persists to DB and localStorage
  it('rename persists to localStorage', async () => {
    const pet = makePet({ id: 'rename-user' });
    localStorage.setItem(`pet_${pet.id}`, JSON.stringify(pet));

    await renamePet('rename-user', 'NewName');

    const stored = JSON.parse(localStorage.getItem('pet_rename-user')!);
    expect(stored.name).toBe('NewName');
  });

  // 11. localStorage fallback when DB unavailable
  it('falls back to localStorage when DB is unavailable', async () => {
    const pet = makePet({ id: 'fallback-user', name: 'LocalPet' });
    localStorage.setItem(`pet_fallback-user`, JSON.stringify(pet));

    // The default mock returns null from DB, so getUserPet should check localStorage
    // We need to import getUserPet
    const { getUserPet } = await import('../../services/petService');
    const result = await getUserPet('fallback-user');

    expect(result).not.toBeNull();
    expect(result?.name).toBe('LocalPet');
  });

  // Edge cases
  it('stats are clamped to 0 minimum', async () => {
    const longAgo = new Date(Date.now() - 100 * 60 * 60 * 1000).toISOString();
    const pet = makePet({ hunger: 10, energy: 5, lastFed: longAgo, lastPlayed: longAgo });

    const updated = await updatePetStats(pet);
    expect(updated.hunger).toBe(0); // can't go below 0
    expect(updated.energy).toBe(0);
  });

  it('stats are clamped to 100 maximum on feed', async () => {
    const pet = makePet({ hunger: 90, happiness: 95 });
    const fed = await feedPet(pet);
    expect(fed.hunger).toBeLessThanOrEqual(100);
    expect(fed.happiness).toBeLessThanOrEqual(100);
  });

  it('sleep energy is clamped to 100', async () => {
    const pet = makePet({ energy: 80 });
    const slept = await sleepPet(pet);
    expect(slept.energy).toBe(100); // 80 + 40 clamped
  });

  it('createPet uses default name when none given', async () => {
    const pet = await createPet('u-default', 'cat');
    expect(pet.name).toBe('Cat');
  });

  it('createPet stores in localStorage when DB upsert throws', async () => {
    mockUpsert.mockRejectedValueOnce(new Error('DB down'));
    await createPet('u-offline', 'mimi_dragon', 'OfflinePet');

    const stored = localStorage.getItem('pet_u-offline');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!).name).toBe('OfflinePet');
  });

  it('play gives more experience than feed', async () => {
    const petA = makePet({ experience: 0 });
    const petB = makePet({ experience: 0 });

    const fedPet = await feedPet(petA);
    const playedPet = await playWithPet(petB);

    expect(playedPet.experience).toBeGreaterThan(fedPet.experience);
  });
});
