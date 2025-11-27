// Virtual Pet System
export interface VirtualPet {
    id: string;
    name: string;
    type: 'cat' | 'dog' | 'dragon' | 'unicorn' | 'bear';
    emoji: string;
    level: number;
    experience: number;
    happiness: number;
    hunger: number;
    energy: number;
    lastFed: Date;
    lastPlayed: Date;
    createdAt: Date;
}

export const PET_TYPES = [
    { type: 'cat', emoji: '🐱', name: 'Kitty' },
    { type: 'dog', emoji: '🐶', name: 'Puppy' },
    { type: 'dragon', emoji: '🐉', name: 'Drake' },
    { type: 'unicorn', emoji: '🦄', name: 'Sparkle' },
    { type: 'bear', emoji: '🐻', name: 'Teddy' },
] as const;

export const createPet = (type: VirtualPet['type'], customName?: string): VirtualPet => {
    const petType = PET_TYPES.find(p => p.type === type);

    return {
        id: `pet_${Date.now()}`,
        name: customName || petType?.name || 'Pet',
        type,
        emoji: petType?.emoji || '🐾',
        level: 1,
        experience: 0,
        happiness: 100,
        hunger: 50,
        energy: 100,
        lastFed: new Date(),
        lastPlayed: new Date(),
        createdAt: new Date(),
    };
};

export const getUserPet = (): VirtualPet | null => {
    const stored = localStorage.getItem('user_pet');
    if (!stored) return null;

    const pet = JSON.parse(stored);
    pet.lastFed = new Date(pet.lastFed);
    pet.lastPlayed = new Date(pet.lastPlayed);
    pet.createdAt = new Date(pet.createdAt);

    return pet;
};

export const savePet = (pet: VirtualPet): void => {
    localStorage.setItem('user_pet', JSON.stringify(pet));
};

export const feedPet = (pet: VirtualPet): VirtualPet => {
    const now = new Date();
    const hoursSinceLastFed = (now.getTime() - pet.lastFed.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastFed < 1) {
        throw new Error('Your pet is not hungry yet! Wait a bit. 🍽️');
    }

    pet.hunger = Math.min(100, pet.hunger + 30);
    pet.happiness = Math.min(100, pet.happiness + 10);
    pet.lastFed = now;
    pet.experience += 5;

    checkLevelUp(pet);
    savePet(pet);

    return pet;
};

export const playWithPet = (pet: VirtualPet): VirtualPet => {
    const now = new Date();
    const hoursSinceLastPlayed = (now.getTime() - pet.lastPlayed.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastPlayed < 2) {
        throw new Error('Your pet needs to rest! Try again later. 😴');
    }

    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.energy = Math.max(0, pet.energy - 15);
    pet.lastPlayed = now;
    pet.experience += 10;

    checkLevelUp(pet);
    savePet(pet);

    return pet;
};

export const earnExperience = (pet: VirtualPet, amount: number): VirtualPet => {
    pet.experience += amount;
    checkLevelUp(pet);
    savePet(pet);
    return pet;
};

const checkLevelUp = (pet: VirtualPet): void => {
    const expNeeded = pet.level * 100;

    if (pet.experience >= expNeeded) {
        pet.level += 1;
        pet.experience = pet.experience - expNeeded;

        // Show level up celebration
        showLevelUpCelebration(pet);
    }
};

const showLevelUpCelebration = (pet: VirtualPet): void => {
    const overlay = document.createElement('div');
    overlay.className = 'pet-levelup-overlay';
    overlay.innerHTML = `
    <div class="pet-levelup">
      <div class="pet-emoji-large">${pet.emoji}</div>
      <h2>🎊 Level Up! 🎊</h2>
      <h3>${pet.name} is now Level ${pet.level}!</h3>
      <p>Keep learning to help ${pet.name} grow! 🌟</p>
      <button class="levelup-close">Amazing!</button>
    </div>
  `;

    document.body.appendChild(overlay);

    overlay.querySelector('.levelup-close')?.addEventListener('click', () => {
        overlay.remove();
    });

    setTimeout(() => {
        if (overlay.parentElement) {
            overlay.remove();
        }
    }, 5000);
};

export const updatePetStats = (pet: VirtualPet): VirtualPet => {
    const now = new Date();
    const hoursSinceLastFed = (now.getTime() - pet.lastFed.getTime()) / (1000 * 60 * 60);
    const hoursSinceLastPlayed = (now.getTime() - pet.lastPlayed.getTime()) / (1000 * 60 * 60);

    // Decrease hunger over time
    pet.hunger = Math.max(0, pet.hunger - (hoursSinceLastFed * 5));

    // Decrease happiness if not played with
    if (hoursSinceLastPlayed > 24) {
        pet.happiness = Math.max(0, pet.happiness - 10);
    }

    // Restore energy over time
    pet.energy = Math.min(100, pet.energy + (hoursSinceLastPlayed * 2));

    savePet(pet);
    return pet;
};

export const getPetMood = (pet: VirtualPet): string => {
    if (pet.happiness > 80) return 'Very Happy! 😊';
    if (pet.happiness > 60) return 'Happy 🙂';
    if (pet.happiness > 40) return 'Okay 😐';
    if (pet.happiness > 20) return 'Sad 😢';
    return 'Very Sad 😭';
};
