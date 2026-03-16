/**
 * STORY WORLDS - World definitions for Mimi's Infinite Adventure
 * Each world has locations, NPCs, items, music, and visual config
 */

export type WorldId = 'forest' | 'ocean' | 'mountain' | 'space' | 'desert';
export type TraitId = 'courage' | 'wisdom' | 'kindness' | 'curiosity';
export type BackgroundId =
  | 'forest-clearing' | 'forest-deep' | 'forest-lake' | 'forest-cave' | 'forest-treehouse'
  | 'ocean-shore' | 'ocean-coral' | 'ocean-deep' | 'ocean-ship' | 'ocean-palace'
  | 'mountain-base' | 'mountain-clouds' | 'mountain-peak' | 'mountain-cave' | 'mountain-bridge'
  | 'space-station' | 'space-asteroid' | 'space-nebula' | 'space-moon' | 'space-comet'
  | 'desert-oasis' | 'desert-dunes' | 'desert-temple' | 'desert-market' | 'desert-night';

export interface WorldNPC {
  id: string;
  name: string;
  emoji: string;
  personality: string;
}

export interface WorldItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export interface WorldConfig {
  id: WorldId;
  name: string;
  emoji: string;
  description: string;
  color: string;
  gradient: string;
  entryTrait: TraitId;
  entryThreshold: number;
  locations: string[];
  npcs: WorldNPC[];
  items: WorldItem[];
  ambientSounds: string[];
}

export const WORLDS: Record<WorldId, WorldConfig> = {
  forest: {
    id: 'forest',
    name: 'Whispering Woods',
    emoji: '🌲',
    description: 'A magical forest where trees whisper secrets and fireflies light the way.',
    color: '#2D5A27',
    gradient: 'linear-gradient(180deg, #87CEEB 0%, #4A8B3F 40%, #2D5A27 100%)',
    entryTrait: 'curiosity',
    entryThreshold: 0,
    locations: ['Mushroom Clearing', 'Old Oak Library', 'Firefly Lake', 'Crystal Cave', 'Treehouse Village'],
    npcs: [
      { id: 'oliver', name: 'Oliver the Owl', emoji: '🦉', personality: 'wise and patient' },
      { id: 'nutkin', name: 'Nutkin the Squirrel', emoji: '🐿️', personality: 'playful and quick' },
      { id: 'fern', name: 'Fern the Deer', emoji: '🦌', personality: 'shy but brave' },
    ],
    items: [
      { id: 'glowing_acorn', name: 'Glowing Acorn', emoji: '🌰', description: 'A tiny acorn that shines in the dark', rarity: 'common' },
      { id: 'forest_map', name: 'Forest Map', emoji: '🗺️', description: 'Shows hidden paths in the woods', rarity: 'rare' },
      { id: 'mushroom_compass', name: 'Mushroom Compass', emoji: '🧭', description: 'Always points to the next adventure', rarity: 'legendary' },
    ],
    ambientSounds: ['birds', 'wind', 'stream'],
  },
  ocean: {
    id: 'ocean',
    name: 'Sapphire Seas',
    emoji: '🌊',
    description: 'An endless ocean of wonder, with coral cities and friendly sea creatures.',
    color: '#1A5276',
    gradient: 'linear-gradient(180deg, #87CEEB 0%, #2E86C1 30%, #1A5276 100%)',
    entryTrait: 'kindness',
    entryThreshold: 15,
    locations: ['Coral Garden', 'Sunken Ship', 'Mermaid Cove', 'Pearl Palace', 'Whirlpool Gate'],
    npcs: [
      { id: 'splash', name: 'Splash the Dolphin', emoji: '🐬', personality: 'cheerful and helpful' },
      { id: 'captain', name: 'Captain Seahorse', emoji: '🐴', personality: 'brave and organized' },
      { id: 'inky', name: 'Inky the Octopus', emoji: '🐙', personality: 'creative and clever' },
    ],
    items: [
      { id: 'pearl_necklace', name: 'Pearl Necklace', emoji: '📿', description: 'Lets you talk to fish', rarity: 'common' },
      { id: 'water_shell', name: 'Breathing Shell', emoji: '🐚', description: 'Breathe underwater forever', rarity: 'rare' },
      { id: 'trident_piece', name: 'Trident Fragment', emoji: '🔱', description: 'A piece of the ancient Sea Trident', rarity: 'legendary' },
    ],
    ambientSounds: ['waves', 'bubbles', 'whale'],
  },
  mountain: {
    id: 'mountain',
    name: 'Starlight Summit',
    emoji: '🏔️',
    description: 'Towering peaks that touch the clouds, where eagles soar and stars feel close.',
    color: '#6C3483',
    gradient: 'linear-gradient(180deg, #2C3E50 0%, #6C3483 40%, #8E44AD 100%)',
    entryTrait: 'courage',
    entryThreshold: 15,
    locations: ['Cloud Bridge', 'Eagle\'s Nest', 'Ice Crystal Cavern', 'Summit Shrine', 'Wind Passage'],
    npcs: [
      { id: 'guru', name: 'Guru the Mountain Goat', emoji: '🐐', personality: 'calm and wise' },
      { id: 'flake', name: 'Flake the Snow Bunny', emoji: '🐇', personality: 'gentle and kind' },
      { id: 'soar', name: 'Soar the Eagle', emoji: '🦅', personality: 'proud and protective' },
    ],
    items: [
      { id: 'star_fragment', name: 'Star Fragment', emoji: '⭐', description: 'A tiny piece of a fallen star', rarity: 'common' },
      { id: 'wind_whistle', name: 'Wind Whistle', emoji: '🎵', description: 'Controls the mountain winds', rarity: 'rare' },
      { id: 'cloud_map', name: 'Cloud Map', emoji: '☁️', description: 'A map drawn on clouds', rarity: 'legendary' },
    ],
    ambientSounds: ['wind', 'eagle', 'chimes'],
  },
  space: {
    id: 'space',
    name: 'Cosmic Voyage',
    emoji: '🚀',
    description: 'The stars are calling! Explore planets, meet aliens, and discover the universe.',
    color: '#0B0E2D',
    gradient: 'linear-gradient(180deg, #0B0E2D 0%, #1A1A4E 50%, #2D1B69 100%)',
    entryTrait: 'curiosity',
    entryThreshold: 25,
    locations: ['Space Station Alpha', 'Asteroid Garden', 'Nebula Library', 'Moon Base', 'Comet Trail'],
    npcs: [
      { id: 'beep', name: 'Beep the Robot', emoji: '🤖', personality: 'logical and funny' },
      { id: 'zyx', name: 'Zyx the Alien', emoji: '👽', personality: 'friendly and curious' },
      { id: 'nova', name: 'Nova the Star Whale', emoji: '🐋', personality: 'ancient and gentle' },
    ],
    items: [
      { id: 'fuel_crystal', name: 'Fuel Crystal', emoji: '💎', description: 'Powers your space ship', rarity: 'common' },
      { id: 'star_map', name: 'Star Map', emoji: '🌌', description: 'Shows every constellation', rarity: 'rare' },
      { id: 'gravity_boots', name: 'Gravity Boots', emoji: '👢', description: 'Walk on any planet', rarity: 'legendary' },
    ],
    ambientSounds: ['hum', 'beep', 'cosmic'],
  },
  desert: {
    id: 'desert',
    name: 'Golden Sands',
    emoji: '🏜️',
    description: 'Ancient deserts with hidden treasures, wise merchants, and starlit nights.',
    color: '#B7950B',
    gradient: 'linear-gradient(180deg, #F39C12 0%, #D4AC0D 40%, #B7950B 100%)',
    entryTrait: 'wisdom',
    entryThreshold: 15,
    locations: ['Oasis Market', 'Sand Castle', 'Hidden Temple', 'Mirage Lake', 'Cactus Garden'],
    npcs: [
      { id: 'sahara', name: 'Sahara the Camel', emoji: '🐪', personality: 'patient and funny' },
      { id: 'scout', name: 'Scout the Fox', emoji: '🦊', personality: 'quick and clever' },
      { id: 'sage', name: 'Sage the Serpent', emoji: '🐍', personality: 'mysterious and kind' },
    ],
    items: [
      { id: 'magic_lamp', name: 'Magic Lamp', emoji: '🪔', description: 'Grants one small wish', rarity: 'common' },
      { id: 'sand_clock', name: 'Sand Clock', emoji: '⏳', description: 'Can slow down time', rarity: 'rare' },
      { id: 'desert_rose', name: 'Desert Rose', emoji: '🌹', description: 'A flower that never wilts', rarity: 'legendary' },
    ],
    ambientSounds: ['wind', 'bells', 'crickets'],
  },
};

export const WORLD_ORDER: WorldId[] = ['forest', 'ocean', 'mountain', 'desert', 'space'];

export const TRAIT_NAMES: Record<TraitId, { name: string; emoji: string; color: string }> = {
  courage: { name: 'Courage', emoji: '🦁', color: '#E74C3C' },
  wisdom: { name: 'Wisdom', emoji: '🦉', color: '#3498DB' },
  kindness: { name: 'Kindness', emoji: '💚', color: '#2ECC71' },
  curiosity: { name: 'Curiosity', emoji: '🔭', color: '#9B59B6' },
};

export function getAvailableWorlds(traits: Record<TraitId, number>): WorldId[] {
  return WORLD_ORDER.filter(wid => {
    const world = WORLDS[wid];
    return traits[world.entryTrait] >= world.entryThreshold;
  });
}
