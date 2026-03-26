import { supabase } from '../config/supabase';
import { LS_PET_PREFIX } from '../config/storageKeys';

// Virtual Pet System - gerçek hayvanlar: kedi, köpek, kuş
export type PetType = 'cat' | 'dog' | 'bird';

export interface VirtualPet {
    id: string; // user_id
    name: string;
    type: PetType;
    emoji: string;
    level: number;
    experience: number;
    happiness: number;
    hunger: number;
    energy: number;
    lastFed: string;
    lastPlayed: string;
    createdAt: string;
}

// Map mascot types to pet types
const LEGACY_TO_PET: Record<string, PetType> = {
    mimi_cat: 'cat', mimi_dragon: 'cat', nova_fox: 'dog', bubbles_octo: 'bird', sparky_alien: 'cat',
    // Legacy mappings for old users
    mimi_panda: 'dog', mimi_fox: 'dog', mimi_bunny: 'bird',
    mimi_monster: 'dog', mimi_robot: 'cat',
    ruby_fox: 'dog', moss_panda: 'dog', indigo_bunny: 'bird', volt_monster: 'dog', luna_cat: 'cat', atlas_robot: 'cat'
};

// Lottie JSON URLs - gerçekçi animasyonlar (LottieFiles ücretsiz). Fallback: component'ta CSS animasyon.
export const PET_TYPES: { type: PetType; name: string; lottieIdle: string; lottiePlay: string }[] = [
    { type: 'cat', name: 'Cat', lottieIdle: 'https://assets10.lottiefiles.com/packages/lf20_1pxAhN.json', lottiePlay: 'https://assets10.lottiefiles.com/packages/lf20_1pxAhN.json' },
    { type: 'dog', name: 'Dog', lottieIdle: 'https://assets6.lottiefiles.com/packages/lf20_ndgnq7gg.json', lottiePlay: 'https://assets6.lottiefiles.com/packages/lf20_ndgnq7gg.json' },
    { type: 'bird', name: 'Bird', lottieIdle: 'https://assets2.lottiefiles.com/packages/lf20_touohxv0.json', lottiePlay: 'https://assets2.lottiefiles.com/packages/lf20_touohxv0.json' },
];

const PET_EMOJI: Record<PetType, string> = { cat: '🐱', dog: '🐕', bird: '🐦' };

export const createPet = async (userId: string, mascotOrType: string, customName?: string): Promise<VirtualPet> => {
    const type: PetType = LEGACY_TO_PET[mascotOrType] || (['cat', 'dog', 'bird'].includes(mascotOrType) ? mascotOrType as PetType : 'cat');
    const petType = PET_TYPES.find(p => p.type === type);
    const now = new Date().toISOString();

    const newPet: VirtualPet = {
        id: userId,
        name: customName || petType?.name || 'Pet',
        type,
        emoji: PET_EMOJI[type],
        level: 1,
        experience: 0,
        happiness: 100,
        hunger: 50,
        energy: 100,
        lastFed: now,
        lastPlayed: now,
        createdAt: now,
    };

    try {
        await supabase.from('pets').upsert({
            id: newPet.id,
            name: newPet.name,
            type: newPet.type,
            emoji: newPet.emoji,
            level: newPet.level,
            experience: newPet.experience,
            happiness: newPet.happiness,
            hunger: newPet.hunger,
            energy: newPet.energy,
            last_fed: newPet.lastFed,
            last_played: newPet.lastPlayed,
            created_at: newPet.createdAt
        });
    } catch {
        // pets table may not exist - store locally
        localStorage.setItem(`${LS_PET_PREFIX}${newPet.id}`, JSON.stringify(newPet));
    }

    return newPet;
};

export const getUserPet = async (userId: string): Promise<VirtualPet | null> => {
    const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

    if (error || !data) {
        // Fallback to localStorage
        const local = localStorage.getItem(`${LS_PET_PREFIX}${userId}`);
        if (local) {
            try { return JSON.parse(local) as VirtualPet; } catch { /* corrupted */ }
        }
        return null;
    }

    const dbData = data as {
        id: string; name: string; type: string; level: number; experience: number;
        happiness: number; hunger: number; energy: number; last_fed: string;
        last_played: string; created_at: string;
    };
    const type: PetType = LEGACY_TO_PET[dbData.type] || (['cat', 'dog', 'bird'].includes(dbData.type) ? dbData.type as PetType : 'cat');
    const emoji = PET_EMOJI[type];
    return {
        id: dbData.id,
        name: dbData.name,
        type,
        emoji,
        level: dbData.level,
        experience: dbData.experience,
        happiness: dbData.happiness,
        hunger: dbData.hunger,
        energy: dbData.energy,
        lastFed: dbData.last_fed,
        lastPlayed: dbData.last_played,
        createdAt: dbData.created_at
    };
};

export const savePet = async (pet: VirtualPet): Promise<void> => {
    try {
        await supabase.from('pets').update({
            name: pet.name,
            type: pet.type,
            emoji: pet.emoji,
            level: pet.level,
            experience: pet.experience,
            happiness: pet.happiness,
            hunger: pet.hunger,
            energy: pet.energy,
            last_fed: pet.lastFed,
            last_played: pet.lastPlayed
        }).eq('id', pet.id);
    } catch {
        // Fallback to localStorage
    }
    localStorage.setItem(`${LS_PET_PREFIX}${pet.id}`, JSON.stringify(pet));
};

export const renamePet = async (userId: string, newName: string): Promise<void> => {
    try {
        await supabase.from('pets').update({ name: newName }).eq('id', userId);
    } catch { /* table may not exist */ }
    const local = localStorage.getItem(`${LS_PET_PREFIX}${userId}`);
    if (local) {
        try {
            const pet = JSON.parse(local) as VirtualPet;
            pet.name = newName;
            localStorage.setItem(`${LS_PET_PREFIX}${userId}`, JSON.stringify(pet));
        } catch { /* corrupted */ }
    }
};

export const feedPet = async (pet: VirtualPet): Promise<VirtualPet> => {
    const now = new Date();
    const lastFed = new Date(pet.lastFed);
    const hoursSinceLastFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastFed < 0.5) { // Reduced for better UX
        throw new Error('Your pet is not hungry yet! Wait a bit. 🍽️');
    }

    pet.hunger = Math.min(100, pet.hunger + 30);
    pet.happiness = Math.min(100, pet.happiness + 10);
    pet.lastFed = now.toISOString();
    pet.experience += 5;

    await checkLevelUp(pet);
    await savePet(pet);

    return pet;
};

export const playWithPet = async (pet: VirtualPet): Promise<VirtualPet> => {
    const now = new Date();
    const lastPlayed = new Date(pet.lastPlayed);
    const hoursSinceLastPlayed = (now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastPlayed < 0.5) { // Reduced for better UX
        throw new Error('Your pet needs to rest! Try again later. 😴');
    }

    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.energy = Math.max(0, pet.energy - 15);
    pet.lastPlayed = now.toISOString();
    pet.experience += 10;

    await checkLevelUp(pet);
    await savePet(pet);

    return pet;
};

/** Uyku / dinlenme: enerji artar, açlık hafif düser. */
export const sleepPet = async (pet: VirtualPet): Promise<VirtualPet> => {
    pet.energy = Math.min(100, pet.energy + 40);
    pet.hunger = Math.max(0, pet.hunger - 5);
    await savePet(pet);
    return pet;
};

const checkLevelUp = async (pet: VirtualPet): Promise<void> => {
    const expNeeded = pet.level * 100;

    if (pet.experience >= expNeeded) {
        pet.level += 1;
        pet.experience = pet.experience - expNeeded;
        // Celebration logic moved to component for better UI control
    }
};

export const updatePetStats = async (pet: VirtualPet): Promise<VirtualPet> => {
    const now = new Date();
    const lastFed = new Date(pet.lastFed);
    const lastPlayed = new Date(pet.lastPlayed);

    const hoursSinceLastFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);
    const hoursSinceLastPlayed = (now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60);

    // Decrease hunger over time (5% per hour) – yemek yiyince artar
    pet.hunger = Math.max(0, pet.hunger - Math.floor(hoursSinceLastFed * 5));

    // Decrease happiness if not played with (24h threshold)
    if (hoursSinceLastPlayed > 24) {
        pet.happiness = Math.max(0, pet.happiness - 10);
    }

    // Enerji: zamanla yavaşça düşer (saatte %2); uyku ile artar (sleepPet).
    pet.energy = Math.max(0, pet.energy - Math.floor(hoursSinceLastPlayed * 2));

    await savePet(pet);
    return pet;
};

export const getPetMood = (pet: VirtualPet): string => {
    if (pet.happiness > 80) return 'Very Happy! 😊';
    if (pet.happiness > 60) return 'Happy 🙂';
    if (pet.happiness > 40) return 'Okay 😐';
    if (pet.happiness > 20) return 'Sad 😢';
    return 'Very Sad 😭';
};
