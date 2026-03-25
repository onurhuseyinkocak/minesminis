/**
 * STORY TEMPLATES - All narrative nodes for Mimi's Infinite Adventure
 * Each node = one scene with text, background, music, and choices
 */

import type { WorldId, BackgroundId, TraitId } from './storyWorlds';

export interface StoryChoice {
  id: string;
  text: string;
  emoji: string;
  traitEffects: Partial<Record<TraitId, number>>;
  xpReward: number;
  nextTags: string[];
  nextWorld?: WorldId;
  itemReward?: string;
}

export interface VocabularyWord {
  word: string;
  turkish: string;
  emoji: string;
}

export interface StoryNode {
  id: string;
  world: WorldId;
  tags: string[];
  location: string;
  background: BackgroundId;
  text: string;
  npcId?: string;
  music: string;
  sfx?: string[];
  choices: StoryChoice[];
  conditions?: { trait: TraitId; min?: number }[];
  vocabulary?: VocabularyWord[];
}

// ─────────── FOREST NODES ───────────

const forestNodes: StoryNode[] = [
  {
    id: 'f_start',
    world: 'forest',
    tags: ['start', 'entry'],
    location: 'Mushroom Clearing',
    background: 'forest-clearing',
    text: 'The morning sun filters through the tall trees. {{name}} steps into a clearing full of colorful mushrooms. Each one glows a different color. A tiny path leads deeper into the woods, and a gentle stream sparkles nearby.',
    music: 'magicForest',
    sfx: ['birds', 'stream'],
    vocabulary: [
      { word: 'tree', turkish: 'ağaç', emoji: '🌳' },
      { word: 'mushroom', turkish: 'mantar', emoji: '🍄' },
      { word: 'path', turkish: 'patika', emoji: '🛤️' },
    ],
    choices: [
      { id: 'f_s1', text: 'Follow the glowing mushrooms', emoji: '🍄', traitEffects: { curiosity: 3 }, xpReward: 5, nextTags: ['forest-explore'] },
      { id: 'f_s2', text: 'Walk to the sparkling stream', emoji: '💧', traitEffects: { wisdom: 2 }, xpReward: 5, nextTags: ['forest-lake'] },
      { id: 'f_s3', text: 'Listen to the birds singing', emoji: '🐦', traitEffects: { kindness: 3 }, xpReward: 5, nextTags: ['forest-encounter'] },
    ],
  },
  {
    id: 'f_explore1',
    world: 'forest',
    tags: ['forest-explore'],
    location: 'Deep Woods Path',
    background: 'forest-deep',
    text: 'The mushrooms lead {{name}} along a winding path. The trees grow taller and their leaves form a green ceiling above. Strange flowers open as {{name}} walks past them, releasing tiny sparkles into the air.',
    music: 'magicForest',
    sfx: ['footsteps', 'sparkle'],
    vocabulary: [
      { word: 'flower', turkish: 'çiçek', emoji: '🌸' },
      { word: 'leaf', turkish: 'yaprak', emoji: '🍃' },
    ],
    choices: [
      { id: 'f_e1a', text: 'Touch one of the sparkly flowers', emoji: '✨', traitEffects: { curiosity: 4 }, xpReward: 8, nextTags: ['forest-discovery'], itemReward: 'glowing_acorn' },
      { id: 'f_e1b', text: 'Keep walking quietly', emoji: '🚶', traitEffects: { wisdom: 3 }, xpReward: 5, nextTags: ['forest-deep'] },
    ],
  },
  {
    id: 'f_explore2',
    world: 'forest',
    tags: ['forest-explore', 'forest-deep'],
    location: 'Ancient Tree Circle',
    background: 'forest-deep',
    text: 'Seven enormous trees stand in a perfect circle. Their roots form natural seats, and in the center, a tiny fountain of golden water bubbles up from the ground. {{name}} can feel magic in the air.',
    music: 'magicForest',
    sfx: ['sparkle', 'water'],
    vocabulary: [
      { word: 'root', turkish: 'kök', emoji: '🌿' },
      { word: 'magic', turkish: 'büyü', emoji: '✨' },
      { word: 'circle', turkish: 'daire', emoji: '⭕' },
    ],
    choices: [
      { id: 'f_e2a', text: 'Drink from the golden fountain', emoji: '🥤', traitEffects: { courage: 5 }, xpReward: 10, nextTags: ['forest-magic'] },
      { id: 'f_e2b', text: 'Sit on a root and rest', emoji: '🪵', traitEffects: { wisdom: 4 }, xpReward: 8, nextTags: ['forest-encounter'] },
      { id: 'f_e2c', text: 'Count the trees carefully', emoji: '🔢', traitEffects: { wisdom: 3, curiosity: 2 }, xpReward: 8, nextTags: ['forest-discovery'] },
    ],
  },
  {
    id: 'f_lake1',
    world: 'forest',
    tags: ['forest-lake'],
    location: 'Firefly Lake',
    background: 'forest-lake',
    text: 'The stream leads to a beautiful lake. Hundreds of fireflies dance above the water, creating patterns of light. A family of ducks swims peacefully, and on the far shore, {{name}} can see a cozy treehouse.',
    music: 'calmEnding',
    sfx: ['water', 'crickets'],
    vocabulary: [
      { word: 'river', turkish: 'nehir', emoji: '🏞️' },
      { word: 'bird', turkish: 'kuş', emoji: '🐦' },
      { word: 'bridge', turkish: 'köprü', emoji: '🌉' },
    ],
    choices: [
      { id: 'f_l1a', text: 'Swim across to the treehouse', emoji: '🏊', traitEffects: { courage: 4 }, xpReward: 8, nextTags: ['forest-treehouse'] },
      { id: 'f_l1b', text: 'Watch the firefly patterns', emoji: '✨', traitEffects: { wisdom: 3, curiosity: 2 }, xpReward: 8, nextTags: ['forest-magic'] },
      { id: 'f_l1c', text: 'Feed the ducks', emoji: '🦆', traitEffects: { kindness: 5 }, xpReward: 8, nextTags: ['forest-encounter'] },
    ],
  },
  {
    id: 'f_encounter1',
    world: 'forest',
    tags: ['forest-encounter'],
    location: 'Mushroom Clearing',
    background: 'forest-clearing',
    npcId: 'oliver',
    text: '"Hello there, young one!" Oliver the Owl lands softly on a branch. His big golden eyes look at {{name}} kindly. "I have been watching you explore. You have a good heart. Would you like to learn a forest secret?"',
    music: 'magicForest',
    sfx: ['owl'],
    vocabulary: [
      { word: 'owl', turkish: 'baykuş', emoji: '🦉' },
      { word: 'branch', turkish: 'dal', emoji: '🌿' },
    ],
    choices: [
      { id: 'f_enc1a', text: '"Yes please, teach me!"', emoji: '📚', traitEffects: { wisdom: 5 }, xpReward: 10, nextTags: ['forest-discovery'] },
      { id: 'f_enc1b', text: '"Can we be friends first?"', emoji: '🤝', traitEffects: { kindness: 5 }, xpReward: 10, nextTags: ['forest-friend'] },
    ],
  },
  {
    id: 'f_encounter2',
    world: 'forest',
    tags: ['forest-encounter', 'forest-friend'],
    location: 'Treehouse Village',
    background: 'forest-treehouse',
    npcId: 'nutkin',
    text: 'Nutkin the Squirrel zooms down from a tree! "Oh oh oh! A new friend! Come see my collection!" Nutkin shows {{name}} a pile of shiny things: buttons, bottle caps, and one very sparkly stone.',
    music: 'cheerfulMorning',
    sfx: ['squirrel', 'sparkle'],
    choices: [
      { id: 'f_enc2a', text: 'Trade something for the sparkly stone', emoji: '💎', traitEffects: { curiosity: 4 }, xpReward: 8, nextTags: ['forest-discovery'], itemReward: 'glowing_acorn' },
      { id: 'f_enc2b', text: 'Help Nutkin organize the collection', emoji: '📦', traitEffects: { kindness: 4, wisdom: 2 }, xpReward: 10, nextTags: ['forest-treehouse'] },
      { id: 'f_enc2c', text: 'Race Nutkin through the trees', emoji: '🏃', traitEffects: { courage: 4 }, xpReward: 8, nextTags: ['forest-explore'] },
    ],
  },
  {
    id: 'f_discovery1',
    world: 'forest',
    tags: ['forest-discovery'],
    location: 'Crystal Cave',
    background: 'forest-cave',
    text: 'Behind a curtain of ivy, {{name}} discovers a hidden cave! The walls are covered in crystals that glow pink, blue, and green. In the center, there is an old book with strange symbols on the cover.',
    music: 'magicForest',
    sfx: ['sparkle', 'echo'],
    choices: [
      { id: 'f_d1a', text: 'Open the mysterious book', emoji: '📖', traitEffects: { wisdom: 5, curiosity: 3 }, xpReward: 12, nextTags: ['forest-magic'], itemReward: 'forest_map' },
      { id: 'f_d1b', text: 'Take a crystal from the wall', emoji: '💎', traitEffects: { courage: 3 }, xpReward: 8, nextTags: ['forest-treehouse'] },
      { id: 'f_d1c', text: 'Draw a picture of the cave', emoji: '🎨', traitEffects: { wisdom: 3, kindness: 2 }, xpReward: 8, nextTags: ['forest-explore'] },
    ],
  },
  {
    id: 'f_magic1',
    world: 'forest',
    tags: ['forest-magic'],
    location: 'Old Oak Library',
    background: 'forest-deep',
    text: 'The book reveals a secret: "When the seven trees sing together, a doorway opens." {{name}} remembers the seven trees in the circle! The forest seems to be waiting for something magical to happen.',
    music: 'softAdventure',
    sfx: ['sparkle', 'chime'],
    choices: [
      { id: 'f_m1a', text: 'Go back to the seven trees', emoji: '🌳', traitEffects: { courage: 5, curiosity: 3 }, xpReward: 15, nextTags: ['forest-portal'] },
      { id: 'f_m1b', text: 'Ask Oliver about this secret', emoji: '🦉', traitEffects: { wisdom: 5 }, xpReward: 10, nextTags: ['forest-encounter'] },
    ],
  },
  {
    id: 'f_treehouse1',
    world: 'forest',
    tags: ['forest-treehouse'],
    location: 'Treehouse Village',
    background: 'forest-treehouse',
    text: 'The treehouse village is amazing! Little houses connected by rope bridges sit in the treetops. Other forest animals wave at {{name}} from their windows. A sign says: "Welcome to Canopy Town!"',
    music: 'cheerfulMorning',
    sfx: ['birds', 'children'],
    choices: [
      { id: 'f_t1a', text: 'Visit the tiny school', emoji: '🏫', traitEffects: { wisdom: 4 }, xpReward: 8, nextTags: ['forest-friend'] },
      { id: 'f_t1b', text: 'Climb to the highest treehouse', emoji: '🧗', traitEffects: { courage: 5 }, xpReward: 10, nextTags: ['forest-discovery'] },
      { id: 'f_t1c', text: 'Help fix a broken bridge', emoji: '🔧', traitEffects: { kindness: 5, courage: 2 }, xpReward: 12, nextTags: ['forest-friend'] },
    ],
  },
  {
    id: 'f_friend1',
    world: 'forest',
    tags: ['forest-friend'],
    location: 'Firefly Lake',
    background: 'forest-lake',
    npcId: 'fern',
    text: 'Fern the Deer appears from behind some bushes. She looks nervous but takes a step toward {{name}}. "I... I heard you helped the village. You must be very kind. I know a secret place... would you like to see it?"',
    music: 'calmEnding',
    sfx: ['deer', 'leaves'],
    choices: [
      { id: 'f_fr1a', text: '"I would love to! Lead the way!"', emoji: '🌟', traitEffects: { kindness: 3, curiosity: 3 }, xpReward: 10, nextTags: ['forest-portal'] },
      { id: 'f_fr1b', text: '"Are you okay? You look scared"', emoji: '🤗', traitEffects: { kindness: 6 }, xpReward: 10, nextTags: ['forest-magic'] },
    ],
  },
  {
    id: 'f_portal1',
    world: 'forest',
    tags: ['forest-portal'],
    location: 'Ancient Tree Circle',
    background: 'forest-deep',
    text: 'Back at the seven trees, something has changed. The golden fountain glows brighter, and the trees hum a soft melody. A shimmering doorway of light appears between two of the trees! Through it, {{name}} can see... another world!',
    music: 'softAdventure',
    sfx: ['sparkle', 'chime', 'magic'],
    choices: [
      { id: 'f_p1a', text: 'Step through to the ocean world', emoji: '🌊', traitEffects: { courage: 5 }, xpReward: 20, nextTags: ['start'], nextWorld: 'ocean' },
      { id: 'f_p1b', text: 'Step through to the mountains', emoji: '🏔️', traitEffects: { courage: 5 }, xpReward: 20, nextTags: ['start'], nextWorld: 'mountain' },
      { id: 'f_p1c', text: 'Stay and explore the forest more', emoji: '🌲', traitEffects: { wisdom: 3 }, xpReward: 10, nextTags: ['forest-explore'] },
    ],
    conditions: [{ trait: 'courage', min: 10 }],
  },
  // Extra forest variety nodes
  {
    id: 'f_explore3',
    world: 'forest',
    tags: ['forest-explore'],
    location: 'Mushroom Clearing',
    background: 'forest-clearing',
    text: 'A rainbow appears after a light rain! {{name}} follows it through the forest. The end of the rainbow lands on a patch of four-leaf clovers. Each clover seems to whisper a tiny word.',
    music: 'cheerfulMorning',
    sfx: ['rain', 'sparkle'],
    choices: [
      { id: 'f_e3a', text: 'Pick a clover and listen', emoji: '🍀', traitEffects: { wisdom: 4, curiosity: 2 }, xpReward: 10, nextTags: ['forest-magic'] },
      { id: 'f_e3b', text: 'Dance in the rain', emoji: '💃', traitEffects: { courage: 3, kindness: 2 }, xpReward: 8, nextTags: ['forest-encounter'] },
    ],
  },
  {
    id: 'f_encounter3',
    world: 'forest',
    tags: ['forest-encounter'],
    location: 'Deep Woods Path',
    background: 'forest-deep',
    text: 'A tiny hedgehog sits on the path, looking lost. "Excuse me," it squeaks. "I cannot find my way home. Everything looks the same!" The little hedgehog\'s eyes are full of tears.',
    music: 'calmEnding',
    sfx: ['squeak'],
    choices: [
      { id: 'f_enc3a', text: 'Help the hedgehog find home', emoji: '🏠', traitEffects: { kindness: 6 }, xpReward: 12, nextTags: ['forest-friend'] },
      { id: 'f_enc3b', text: 'Make a map together', emoji: '🗺️', traitEffects: { wisdom: 4, kindness: 2 }, xpReward: 10, nextTags: ['forest-discovery'], itemReward: 'forest_map' },
    ],
  },
];

// ─────────── OCEAN NODES ───────────

const oceanNodes: StoryNode[] = [
  {
    id: 'o_start',
    world: 'ocean',
    tags: ['start', 'entry'],
    location: 'Coral Garden',
    background: 'ocean-shore',
    text: 'The portal opens on a beautiful beach. Crystal-clear water stretches to the horizon. {{name}} can see colorful fish swimming near the shore, and far away, something sparkles beneath the waves.',
    music: 'calmEnding',
    sfx: ['waves', 'seagulls'],
    vocabulary: [
      { word: 'fish', turkish: 'balık', emoji: '🐟' },
      { word: 'wave', turkish: 'dalga', emoji: '🌊' },
      { word: 'sand', turkish: 'kum', emoji: '🏖️' },
    ],
    choices: [
      { id: 'o_s1', text: 'Dive into the water', emoji: '🏊', traitEffects: { courage: 4 }, xpReward: 8, nextTags: ['ocean-explore'] },
      { id: 'o_s2', text: 'Look for shells on the beach', emoji: '🐚', traitEffects: { curiosity: 3 }, xpReward: 5, nextTags: ['ocean-discovery'] },
      { id: 'o_s3', text: 'Wave at the fish', emoji: '👋', traitEffects: { kindness: 3 }, xpReward: 5, nextTags: ['ocean-encounter'] },
    ],
  },
  {
    id: 'o_explore1',
    world: 'ocean',
    tags: ['ocean-explore'],
    location: 'Coral Garden',
    background: 'ocean-coral',
    text: 'Under the water, everything is amazing! A garden of coral stretches in every direction — red, purple, yellow, orange. Fish of every color swim around {{name}} like a living rainbow.',
    music: 'calmEnding',
    sfx: ['bubbles', 'whale'],
    vocabulary: [
      { word: 'coral', turkish: 'mercan', emoji: '🪸' },
      { word: 'shell', turkish: 'deniz kabuğu', emoji: '🐚' },
    ],
    choices: [
      { id: 'o_e1a', text: 'Swim deeper', emoji: '⬇️', traitEffects: { courage: 4 }, xpReward: 8, nextTags: ['ocean-deep'] },
      { id: 'o_e1b', text: 'Follow a golden fish', emoji: '🐠', traitEffects: { curiosity: 4 }, xpReward: 8, nextTags: ['ocean-discovery'] },
      { id: 'o_e1c', text: 'Clean trash from the coral', emoji: '♻️', traitEffects: { kindness: 5 }, xpReward: 10, nextTags: ['ocean-encounter'] },
    ],
  },
  {
    id: 'o_encounter1',
    world: 'ocean',
    tags: ['ocean-encounter'],
    location: 'Coral Garden',
    background: 'ocean-coral',
    npcId: 'splash',
    text: '"Hey hey hey!" Splash the Dolphin does a flip! "A land friend! I LOVE land friends! Want to ride on my back? I can show you the WHOLE ocean! Please please please?"',
    music: 'cheerfulMorning',
    sfx: ['dolphin', 'splash'],
    vocabulary: [
      { word: 'dolphin', turkish: 'yunus', emoji: '🐬' },
      { word: 'boat', turkish: 'tekne', emoji: '⛵' },
    ],
    choices: [
      { id: 'o_enc1a', text: '"Let\'s go! Show me everything!"', emoji: '🐬', traitEffects: { courage: 3, curiosity: 3 }, xpReward: 10, nextTags: ['ocean-explore'] },
      { id: 'o_enc1b', text: '"Can we visit the Sunken Ship?"', emoji: '🚢', traitEffects: { curiosity: 5 }, xpReward: 10, nextTags: ['ocean-ship'] },
    ],
  },
  {
    id: 'o_deep1',
    world: 'ocean',
    tags: ['ocean-deep'],
    location: 'Deep Ocean',
    background: 'ocean-deep',
    text: 'The deeper {{name}} goes, the darker it gets. But then — lights! Creatures that glow in the dark swim past. A giant jellyfish floats by like a living lantern, its tentacles trailing soft blue light.',
    music: 'softAdventure',
    sfx: ['bubbles', 'deep'],
    vocabulary: [
      { word: 'deep', turkish: 'derin', emoji: '🌊' },
      { word: 'light', turkish: 'ışık', emoji: '💡' },
      { word: 'jellyfish', turkish: 'denizanası', emoji: '🪼' },
    ],
    choices: [
      { id: 'o_d1a', text: 'Follow the jellyfish', emoji: '🪼', traitEffects: { curiosity: 5 }, xpReward: 10, nextTags: ['ocean-discovery'] },
      { id: 'o_d1b', text: 'Look for the Pearl Palace', emoji: '🏰', traitEffects: { courage: 4, wisdom: 2 }, xpReward: 12, nextTags: ['ocean-palace'] },
    ],
  },
  {
    id: 'o_ship1',
    world: 'ocean',
    tags: ['ocean-ship'],
    location: 'Sunken Ship',
    background: 'ocean-ship',
    npcId: 'captain',
    text: 'The Sunken Ship is an old pirate vessel covered in barnacles and seaweed. Captain Seahorse stands guard at the entrance. "Ahoy! Only the brave may enter. This ship holds ancient treasures — and ancient puzzles!"',
    music: 'softAdventure',
    sfx: ['creak', 'bubbles'],
    vocabulary: [
      { word: 'treasure', turkish: 'hazine', emoji: '💰' },
      { word: 'ship', turkish: 'gemi', emoji: '🚢' },
    ],
    choices: [
      { id: 'o_sh1a', text: 'Accept the challenge', emoji: '⚔️', traitEffects: { courage: 5 }, xpReward: 12, nextTags: ['ocean-discovery'], itemReward: 'pearl_necklace' },
      { id: 'o_sh1b', text: 'Ask about the ship\'s history', emoji: '📜', traitEffects: { wisdom: 5 }, xpReward: 10, nextTags: ['ocean-encounter'] },
    ],
  },
  {
    id: 'o_discovery1',
    world: 'ocean',
    tags: ['ocean-discovery'],
    location: 'Mermaid Cove',
    background: 'ocean-coral',
    text: '{{name}} finds a hidden cove where the water glows emerald green. Carved into the rock wall is a message in an ancient language. A small shell next to it seems to be some kind of key.',
    music: 'magicForest',
    sfx: ['sparkle', 'waves'],
    choices: [
      { id: 'o_dis1a', text: 'Try the shell key on the rock', emoji: '🔑', traitEffects: { curiosity: 5, courage: 2 }, xpReward: 15, nextTags: ['ocean-palace'], itemReward: 'water_shell' },
      { id: 'o_dis1b', text: 'Copy the message carefully', emoji: '✏️', traitEffects: { wisdom: 5 }, xpReward: 10, nextTags: ['ocean-encounter'] },
    ],
  },
  {
    id: 'o_palace1',
    world: 'ocean',
    tags: ['ocean-palace'],
    location: 'Pearl Palace',
    background: 'ocean-palace',
    npcId: 'inky',
    text: 'The Pearl Palace is breathtaking! Walls made of shimmering pearls, gardens of sea flowers, and in the throne room, Inky the Octopus paints a mural. "Welcome! I paint the history of our ocean. Would you like to add your story?"',
    music: 'calmEnding',
    sfx: ['sparkle', 'harp'],
    choices: [
      { id: 'o_pal1a', text: 'Paint your adventure so far', emoji: '🎨', traitEffects: { wisdom: 3, kindness: 3 }, xpReward: 12, nextTags: ['ocean-encounter'] },
      { id: 'o_pal1b', text: 'Explore the palace gardens', emoji: '🌺', traitEffects: { curiosity: 4 }, xpReward: 10, nextTags: ['ocean-discovery'] },
      { id: 'o_pal1c', text: 'Ask about other worlds', emoji: '🌍', traitEffects: { curiosity: 5, courage: 2 }, xpReward: 15, nextTags: ['ocean-portal'] },
    ],
  },
  {
    id: 'o_portal1',
    world: 'ocean',
    tags: ['ocean-portal'],
    location: 'Whirlpool Gate',
    background: 'ocean-deep',
    text: 'Deep beneath the palace, a gentle whirlpool spins. It\'s not dangerous — it\'s a portal! Through the swirling water, {{name}} can see glimpses of other worlds. The whirlpool hums a welcoming song.',
    music: 'softAdventure',
    sfx: ['magic', 'water'],
    choices: [
      { id: 'o_p1a', text: 'Travel to the mountains', emoji: '🏔️', traitEffects: { courage: 5 }, xpReward: 20, nextTags: ['start'], nextWorld: 'mountain' },
      { id: 'o_p1b', text: 'Travel to the desert', emoji: '🏜️', traitEffects: { wisdom: 5 }, xpReward: 20, nextTags: ['start'], nextWorld: 'desert' },
      { id: 'o_p1c', text: 'Keep exploring the ocean', emoji: '🌊', traitEffects: { curiosity: 3 }, xpReward: 10, nextTags: ['ocean-explore'] },
    ],
    conditions: [{ trait: 'kindness', min: 15 }],
  },
  {
    id: 'o_explore2',
    world: 'ocean',
    tags: ['ocean-explore'],
    location: 'Coral Garden',
    background: 'ocean-coral',
    text: 'A sea turtle slowly swims past, carrying a tiny crab on its shell. The crab waves at {{name}} with its little claw. "Going to the Turtle Express? Hop on, the next stop is Starfish Station!"',
    music: 'cheerfulMorning',
    sfx: ['bubbles'],
    choices: [
      { id: 'o_e2a', text: 'Ride the turtle', emoji: '🐢', traitEffects: { courage: 3, curiosity: 2 }, xpReward: 8, nextTags: ['ocean-discovery'] },
      { id: 'o_e2b', text: 'Help the crab find its home', emoji: '🦀', traitEffects: { kindness: 5 }, xpReward: 10, nextTags: ['ocean-encounter'] },
    ],
  },
];

// ─────────── MOUNTAIN NODES ───────────

const mountainNodes: StoryNode[] = [
  {
    id: 'm_start',
    world: 'mountain',
    tags: ['start', 'entry'],
    location: 'Cloud Bridge',
    background: 'mountain-base',
    text: '{{name}} stands at the base of the tallest mountain in the world. Snow-capped peaks touch the clouds. A narrow bridge made of clouds stretches across a deep valley. An eagle circles overhead.',
    music: 'softAdventure',
    sfx: ['wind', 'eagle'],
    vocabulary: [
      { word: 'rock', turkish: 'kaya', emoji: '🪨' },
      { word: 'eagle', turkish: 'kartal', emoji: '🦅' },
      { word: 'cloud', turkish: 'bulut', emoji: '☁️' },
    ],
    choices: [
      { id: 'm_s1', text: 'Cross the cloud bridge', emoji: '🌉', traitEffects: { courage: 5 }, xpReward: 10, nextTags: ['mountain-explore'] },
      { id: 'm_s2', text: 'Call out to the eagle', emoji: '🦅', traitEffects: { kindness: 3 }, xpReward: 5, nextTags: ['mountain-encounter'] },
      { id: 'm_s3', text: 'Look for a safer path', emoji: '🔍', traitEffects: { wisdom: 3 }, xpReward: 5, nextTags: ['mountain-cave'] },
    ],
  },
  {
    id: 'm_explore1',
    world: 'mountain',
    tags: ['mountain-explore'],
    location: 'Misty Plateau',
    background: 'mountain-clouds',
    text: 'Above the clouds, everything is silent and beautiful. {{name}} can see the sun setting in brilliant orange and pink. Snow crystals float in the air like tiny diamonds. A stone staircase leads even higher.',
    music: 'calmEnding',
    sfx: ['wind', 'chimes'],
    vocabulary: [
      { word: 'snow', turkish: 'kar', emoji: '❄️' },
      { word: 'wind', turkish: 'rüzgar', emoji: '💨' },
      { word: 'climb', turkish: 'tırmanmak', emoji: '🧗' },
      { word: 'staircase', turkish: 'merdiven', emoji: '🪜' },
    ],
    choices: [
      { id: 'm_e1a', text: 'Climb the stone stairs', emoji: '🪜', traitEffects: { courage: 4, curiosity: 2 }, xpReward: 10, nextTags: ['mountain-peak'] },
      { id: 'm_e1b', text: 'Catch snowflakes', emoji: '❄️', traitEffects: { kindness: 3 }, xpReward: 5, nextTags: ['mountain-discovery'] },
    ],
  },
  {
    id: 'm_encounter1',
    world: 'mountain',
    tags: ['mountain-encounter'],
    location: 'Eagle\'s Nest',
    background: 'mountain-peak',
    npcId: 'soar',
    text: 'Soar the Eagle lands gracefully. "Few are brave enough to climb this high. I can see everything from up here — forests, oceans, deserts. What do you seek, little adventurer?"',
    music: 'softAdventure',
    sfx: ['eagle', 'wind'],
    choices: [
      { id: 'm_enc1a', text: '"I want to see the whole world!"', emoji: '🌍', traitEffects: { curiosity: 5 }, xpReward: 10, nextTags: ['mountain-peak'] },
      { id: 'm_enc1b', text: '"I want to help someone"', emoji: '💪', traitEffects: { kindness: 5 }, xpReward: 10, nextTags: ['mountain-friend'] },
      { id: 'm_enc1c', text: '"I want to learn the mountain\'s secrets"', emoji: '🔮', traitEffects: { wisdom: 5 }, xpReward: 10, nextTags: ['mountain-discovery'] },
    ],
  },
  {
    id: 'm_cave1',
    world: 'mountain',
    tags: ['mountain-cave'],
    location: 'Ice Crystal Cavern',
    background: 'mountain-cave',
    npcId: 'flake',
    text: 'Inside the mountain, a cavern glitters with ice crystals. Flake the Snow Bunny hops over. "Oh! You found my secret home! Look — each crystal plays a different musical note when you tap it!"',
    music: 'magicForest',
    sfx: ['chimes', 'sparkle'],
    vocabulary: [
      { word: 'cave', turkish: 'mağara', emoji: '🕳️' },
      { word: 'peak', turkish: 'zirve', emoji: '🏔️' },
    ],
    choices: [
      { id: 'm_c1a', text: 'Play a song on the crystals', emoji: '🎵', traitEffects: { curiosity: 4, wisdom: 2 }, xpReward: 12, nextTags: ['mountain-discovery'], itemReward: 'star_fragment' },
      { id: 'm_c1b', text: 'Ask Flake about the mountain', emoji: '🐇', traitEffects: { wisdom: 4 }, xpReward: 8, nextTags: ['mountain-encounter'] },
    ],
  },
  {
    id: 'm_peak1',
    world: 'mountain',
    tags: ['mountain-peak'],
    location: 'Summit Shrine',
    background: 'mountain-peak',
    text: 'At the very top of the mountain, a small shrine holds a glowing star. The view is incredible — {{name}} can see the entire world below. The stars above seem close enough to touch.',
    music: 'softAdventure',
    sfx: ['sparkle', 'wind'],
    choices: [
      { id: 'm_pk1a', text: 'Make a wish on the star', emoji: '🌟', traitEffects: { wisdom: 4, kindness: 3 }, xpReward: 15, nextTags: ['mountain-portal'], itemReward: 'wind_whistle' },
      { id: 'm_pk1b', text: 'Touch the glowing star', emoji: '✨', traitEffects: { courage: 5, curiosity: 3 }, xpReward: 15, nextTags: ['mountain-portal'] },
    ],
  },
  {
    id: 'm_discovery1',
    world: 'mountain',
    tags: ['mountain-discovery'],
    location: 'Wind Passage',
    background: 'mountain-bridge',
    npcId: 'guru',
    text: 'Guru the Mountain Goat sits meditating on a rock. "Ah, you have found the Wind Passage. The wind carries stories from every corner of the world. Close your eyes and listen..."',
    music: 'calmEnding',
    sfx: ['wind', 'chimes'],
    choices: [
      { id: 'm_d1a', text: 'Close your eyes and listen', emoji: '👁️', traitEffects: { wisdom: 6 }, xpReward: 12, nextTags: ['mountain-friend'] },
      { id: 'm_d1b', text: 'Ask Guru to teach you to meditate', emoji: '🧘', traitEffects: { wisdom: 5, courage: 2 }, xpReward: 12, nextTags: ['mountain-peak'] },
    ],
  },
  {
    id: 'm_friend1',
    world: 'mountain',
    tags: ['mountain-friend'],
    location: 'Ice Crystal Cavern',
    background: 'mountain-cave',
    text: 'All three mountain friends gather — Guru, Flake, and Soar. "We have decided," says Guru. "You are a true friend of the mountain. We want to show you something no one has ever seen."',
    music: 'softAdventure',
    sfx: ['sparkle', 'chimes'],
    choices: [
      { id: 'm_fr1a', text: '"Show me! I am ready!"', emoji: '🎉', traitEffects: { courage: 4, curiosity: 4 }, xpReward: 15, nextTags: ['mountain-portal'] },
      { id: 'm_fr1b', text: '"Thank you for trusting me"', emoji: '🙏', traitEffects: { kindness: 5, wisdom: 3 }, xpReward: 15, nextTags: ['mountain-portal'] },
    ],
  },
  {
    id: 'm_portal1',
    world: 'mountain',
    tags: ['mountain-portal'],
    location: 'Summit Shrine',
    background: 'mountain-peak',
    text: 'The summit star lifts into the air and opens a portal of pure starlight! Through it, {{name}} can see the cosmos stretching endlessly, or golden sands shimmering in the sun. A new adventure awaits!',
    music: 'softAdventure',
    sfx: ['magic', 'sparkle'],
    choices: [
      { id: 'm_p1a', text: 'Fly to the stars', emoji: '🚀', traitEffects: { courage: 5, curiosity: 5 }, xpReward: 25, nextTags: ['start'], nextWorld: 'space' },
      { id: 'm_p1b', text: 'Walk into the desert', emoji: '🏜️', traitEffects: { wisdom: 5 }, xpReward: 20, nextTags: ['start'], nextWorld: 'desert' },
      { id: 'm_p1c', text: 'Stay on the mountain', emoji: '🏔️', traitEffects: { wisdom: 3 }, xpReward: 10, nextTags: ['mountain-explore'] },
    ],
    conditions: [{ trait: 'courage', min: 15 }],
  },
];

// ─────────── SPACE NODES ───────────

const spaceNodes: StoryNode[] = [
  {
    id: 's_start',
    world: 'space',
    tags: ['start', 'entry'],
    location: 'Space Station Alpha',
    background: 'space-station',
    text: 'The stars surround {{name}} in every direction! A friendly space station floats nearby with blinking lights and a sign: "Welcome to Station Alpha! Population: Awesome." A robot waves from the entrance.',
    music: 'softAdventure',
    sfx: ['beep', 'hum'],
    vocabulary: [
      { word: 'star', turkish: 'yıldız', emoji: '⭐' },
      { word: 'moon', turkish: 'ay', emoji: '🌙' },
      { word: 'planet', turkish: 'gezegen', emoji: '🪐' },
      { word: 'rocket', turkish: 'roket', emoji: '🚀' },
      { word: 'astronaut', turkish: 'astronot', emoji: '👨‍🚀' },
    ],
    choices: [
      { id: 's_s1', text: 'Enter the space station', emoji: '🏠', traitEffects: { curiosity: 3 }, xpReward: 5, nextTags: ['space-station'] },
      { id: 's_s2', text: 'Float toward the asteroids', emoji: '☄️', traitEffects: { courage: 4 }, xpReward: 8, nextTags: ['space-explore'] },
      { id: 's_s3', text: 'Wave back at the robot', emoji: '🤖', traitEffects: { kindness: 3 }, xpReward: 5, nextTags: ['space-encounter'] },
    ],
  },
  {
    id: 's_station1',
    world: 'space',
    tags: ['space-station'],
    location: 'Space Station Alpha',
    background: 'space-station',
    npcId: 'beep',
    text: 'Inside the station, Beep the Robot rolls over excitedly. "SCANNING... SCANNING... NEW FRIEND DETECTED! Welcome! I have snacks, games, and a telescope that can see a million light years! What would you like?"',
    music: 'cheerfulMorning',
    sfx: ['beep', 'whir'],
    vocabulary: [
      { word: 'galaxy', turkish: 'galaksi', emoji: '🌌' },
      { word: 'orbit', turkish: 'yörünge', emoji: '🔄' },
      { word: 'sun', turkish: 'güneş', emoji: '☀️' },
    ],
    choices: [
      { id: 's_st1a', text: 'Use the mega telescope', emoji: '🔭', traitEffects: { curiosity: 5 }, xpReward: 10, nextTags: ['space-discovery'] },
      { id: 's_st1b', text: 'Play a space game with Beep', emoji: '🎮', traitEffects: { kindness: 3, courage: 2 }, xpReward: 8, nextTags: ['space-encounter'] },
      { id: 's_st1c', text: 'Fix Beep\'s broken antenna', emoji: '🔧', traitEffects: { kindness: 5, wisdom: 2 }, xpReward: 12, nextTags: ['space-friend'] },
    ],
  },
  {
    id: 's_explore1',
    world: 'space',
    tags: ['space-explore'],
    location: 'Asteroid Garden',
    background: 'space-asteroid',
    text: 'The asteroids are actually floating gardens! Each one has different plants growing on it — crystal flowers, rainbow grass, and trees with glowing fruit. It is like a park in space!',
    music: 'magicForest',
    sfx: ['sparkle', 'cosmic'],
    vocabulary: [
      { word: 'garden', turkish: 'bahçe', emoji: '🌻' },
      { word: 'fruit', turkish: 'meyve', emoji: '🍎' },
      { word: 'galaxy', turkish: 'galaksi', emoji: '🌌' },
    ],
    choices: [
      { id: 's_e1a', text: 'Taste a glowing fruit', emoji: '🍎', traitEffects: { courage: 4, curiosity: 3 }, xpReward: 10, nextTags: ['space-discovery'], itemReward: 'fuel_crystal' },
      { id: 's_e1b', text: 'Plant a new seed', emoji: '🌱', traitEffects: { kindness: 5 }, xpReward: 10, nextTags: ['space-encounter'] },
    ],
  },
  {
    id: 's_encounter1',
    world: 'space',
    tags: ['space-encounter'],
    location: 'Nebula Library',
    background: 'space-nebula',
    npcId: 'zyx',
    text: 'Zyx the Alien floats down from a colorful nebula! Zyx has three eyes and purple skin, and speaks with a musical voice. "Greetings, Earth friend! I collect stories from every planet. Will you share yours?"',
    music: 'softAdventure',
    sfx: ['alien', 'sparkle'],
    vocabulary: [
      { word: 'astronaut', turkish: 'astronot', emoji: '👨‍🚀' },
      { word: 'orbit', turkish: 'yörünge', emoji: '🔄' },
      { word: 'rocket', turkish: 'roket', emoji: '🚀' },
    ],
    choices: [
      { id: 's_enc1a', text: 'Tell Zyx about your adventures', emoji: '📖', traitEffects: { wisdom: 4, kindness: 3 }, xpReward: 12, nextTags: ['space-friend'] },
      { id: 's_enc1b', text: 'Ask Zyx about other planets', emoji: '🪐', traitEffects: { curiosity: 5 }, xpReward: 10, nextTags: ['space-discovery'] },
    ],
  },
  {
    id: 's_discovery1',
    world: 'space',
    tags: ['space-discovery'],
    location: 'Moon Base',
    background: 'space-moon',
    text: 'On the moon, {{name}} discovers footprints that glow in the dark! They lead to a crater filled with moon dust that sparkles like diamonds. In the center, a crystal map shows the entire galaxy.',
    music: 'softAdventure',
    sfx: ['sparkle', 'hum'],
    vocabulary: [
      { word: 'moon', turkish: 'ay', emoji: '🌙' },
      { word: 'star', turkish: 'yıldız', emoji: '⭐' },
      { word: 'sun', turkish: 'güneş', emoji: '☀️' },
    ],
    choices: [
      { id: 's_d1a', text: 'Study the galaxy map', emoji: '🗺️', traitEffects: { wisdom: 5, curiosity: 3 }, xpReward: 15, nextTags: ['space-portal'], itemReward: 'star_map' },
      { id: 's_d1b', text: 'Follow the glowing footprints', emoji: '👣', traitEffects: { courage: 4, curiosity: 3 }, xpReward: 12, nextTags: ['space-encounter'] },
    ],
  },
  {
    id: 's_friend1',
    world: 'space',
    tags: ['space-friend'],
    location: 'Comet Trail',
    background: 'space-comet',
    npcId: 'nova',
    text: 'A giant but gentle Star Whale named Nova swims through the cosmos. "Little one, you have traveled far. I have swum through the universe for a thousand years. Climb aboard — I will show you wonders."',
    music: 'calmEnding',
    sfx: ['whale', 'cosmic'],
    choices: [
      { id: 's_fr1a', text: 'Ride the Star Whale', emoji: '🐋', traitEffects: { courage: 5, curiosity: 5 }, xpReward: 20, nextTags: ['space-portal'] },
      { id: 's_fr1b', text: 'Sing a song for Nova', emoji: '🎵', traitEffects: { kindness: 6 }, xpReward: 15, nextTags: ['space-discovery'], itemReward: 'gravity_boots' },
    ],
  },
  {
    id: 's_portal1',
    world: 'space',
    tags: ['space-portal'],
    location: 'Comet Trail',
    background: 'space-comet',
    text: 'A comet streaks by, leaving a trail of rainbow light. As {{name}} reaches out, the light wraps around like a warm blanket and begins to carry {{name}} somewhere new. "Where shall we go?" whispers the cosmos.',
    music: 'softAdventure',
    sfx: ['magic', 'cosmic'],
    choices: [
      { id: 's_p1a', text: 'Back to the forest', emoji: '🌲', traitEffects: { wisdom: 3 }, xpReward: 15, nextTags: ['start'], nextWorld: 'forest' },
      { id: 's_p1b', text: 'To the golden desert', emoji: '🏜️', traitEffects: { curiosity: 5 }, xpReward: 20, nextTags: ['start'], nextWorld: 'desert' },
      { id: 's_p1c', text: 'Keep exploring space', emoji: '🚀', traitEffects: { courage: 3 }, xpReward: 10, nextTags: ['space-explore'] },
    ],
  },
];

// ─────────── DESERT NODES ───────────

const desertNodes: StoryNode[] = [
  {
    id: 'd_start',
    world: 'desert',
    tags: ['start', 'entry'],
    location: 'Oasis Market',
    background: 'desert-oasis',
    text: 'Golden sand stretches in every direction under a brilliant blue sky. An oasis appears ahead — palm trees, cool water, and a colorful market with tents and flags fluttering in the breeze.',
    music: 'cheerfulMorning',
    sfx: ['wind', 'bells'],
    vocabulary: [
      { word: 'desert', turkish: 'çöl', emoji: '🏜️' },
      { word: 'water', turkish: 'su', emoji: '💧' },
      { word: 'sun', turkish: 'güneş', emoji: '☀️' },
    ],
    choices: [
      { id: 'd_s1', text: 'Explore the market', emoji: '🏪', traitEffects: { curiosity: 3 }, xpReward: 5, nextTags: ['desert-market'] },
      { id: 'd_s2', text: 'Climb the tallest sand dune', emoji: '🏃', traitEffects: { courage: 4 }, xpReward: 8, nextTags: ['desert-explore'] },
      { id: 'd_s3', text: 'Rest by the cool water', emoji: '💧', traitEffects: { wisdom: 3 }, xpReward: 5, nextTags: ['desert-encounter'] },
    ],
  },
  {
    id: 'd_market1',
    world: 'desert',
    tags: ['desert-market'],
    location: 'Oasis Market',
    background: 'desert-market',
    npcId: 'sahara',
    text: 'Sahara the Camel runs the biggest tent in the market. "Welcome, welcome! Everything is for sale! Magic carpets, singing sand, and the famous Oasis Juice! What catches your eye?"',
    music: 'cheerfulMorning',
    sfx: ['bells', 'crowd'],
    choices: [
      { id: 'd_m1a', text: 'Ask about the magic carpet', emoji: '🧞', traitEffects: { curiosity: 4, courage: 2 }, xpReward: 10, nextTags: ['desert-discovery'] },
      { id: 'd_m1b', text: 'Try the singing sand', emoji: '🎵', traitEffects: { curiosity: 4 }, xpReward: 8, nextTags: ['desert-explore'] },
      { id: 'd_m1c', text: 'Help Sahara with customers', emoji: '🤝', traitEffects: { kindness: 5 }, xpReward: 10, nextTags: ['desert-friend'] },
    ],
  },
  {
    id: 'd_explore1',
    world: 'desert',
    tags: ['desert-explore'],
    location: 'Sand Dunes',
    background: 'desert-dunes',
    text: 'From the top of the tallest dune, {{name}} can see for miles. The sand makes beautiful wave patterns. Suddenly, the sand shifts and reveals stone steps leading down into the earth!',
    music: 'softAdventure',
    sfx: ['wind', 'rumble'],
    choices: [
      { id: 'd_e1a', text: 'Go down the stone steps', emoji: '⬇️', traitEffects: { courage: 5, curiosity: 3 }, xpReward: 12, nextTags: ['desert-temple'] },
      { id: 'd_e1b', text: 'Slide down the dune instead', emoji: '🛝', traitEffects: { courage: 3 }, xpReward: 8, nextTags: ['desert-encounter'] },
    ],
  },
  {
    id: 'd_encounter1',
    world: 'desert',
    tags: ['desert-encounter'],
    location: 'Cactus Garden',
    background: 'desert-oasis',
    npcId: 'scout',
    text: 'Scout the Fox appears from behind a cactus! "Psst! I found something amazing. There is a hidden temple under the sand! But I am too small to open the door. Will you help me?"',
    music: 'softAdventure',
    sfx: ['fox'],
    choices: [
      { id: 'd_enc1a', text: '"Of course! Let\'s go together!"', emoji: '🦊', traitEffects: { kindness: 4, courage: 3 }, xpReward: 12, nextTags: ['desert-temple'] },
      { id: 'd_enc1b', text: '"Tell me more about the temple first"', emoji: '🤔', traitEffects: { wisdom: 5 }, xpReward: 10, nextTags: ['desert-discovery'] },
    ],
  },
  {
    id: 'd_temple1',
    world: 'desert',
    tags: ['desert-temple'],
    location: 'Hidden Temple',
    background: 'desert-temple',
    text: 'The hidden temple is magnificent! Golden walls covered in beautiful paintings tell stories of ancient adventurers. In the center, three colored doors stand: red for courage, blue for wisdom, and green for kindness.',
    music: 'magicForest',
    sfx: ['echo', 'sparkle'],
    vocabulary: [
      { word: 'door', turkish: 'kapı', emoji: '🚪' },
      { word: 'gold', turkish: 'altın', emoji: '✨' },
      { word: 'wall', turkish: 'duvar', emoji: '🧱' },
    ],
    choices: [
      { id: 'd_t1a', text: 'Open the red door', emoji: '🔴', traitEffects: { courage: 6 }, xpReward: 15, nextTags: ['desert-discovery'], itemReward: 'magic_lamp' },
      { id: 'd_t1b', text: 'Open the blue door', emoji: '🔵', traitEffects: { wisdom: 6 }, xpReward: 15, nextTags: ['desert-discovery'], itemReward: 'sand_clock' },
      { id: 'd_t1c', text: 'Open the green door', emoji: '🟢', traitEffects: { kindness: 6 }, xpReward: 15, nextTags: ['desert-friend'], itemReward: 'desert_rose' },
    ],
  },
  {
    id: 'd_discovery1',
    world: 'desert',
    tags: ['desert-discovery'],
    location: 'Hidden Temple',
    background: 'desert-temple',
    npcId: 'sage',
    text: 'Behind the door, Sage the Serpent coils around an ancient scroll. "Ah, a seeker of knowledge! This scroll shows the paths between all worlds. Read it carefully, for knowledge is the greatest treasure."',
    music: 'calmEnding',
    sfx: ['hiss', 'sparkle'],
    choices: [
      { id: 'd_d1a', text: 'Read the ancient scroll', emoji: '📜', traitEffects: { wisdom: 6, curiosity: 3 }, xpReward: 20, nextTags: ['desert-portal'] },
      { id: 'd_d1b', text: 'Thank Sage and share your story', emoji: '🙏', traitEffects: { kindness: 5, wisdom: 3 }, xpReward: 15, nextTags: ['desert-friend'] },
    ],
  },
  {
    id: 'd_friend1',
    world: 'desert',
    tags: ['desert-friend'],
    location: 'Oasis Market',
    background: 'desert-market',
    text: 'All the desert friends celebrate under the stars! Sahara cooks a feast, Scout dances, and Sage tells ancient stories. "You have made the desert a brighter place," they say. "We will always remember you."',
    music: 'cheerfulMorning',
    sfx: ['music', 'laughter'],
    choices: [
      { id: 'd_fr1a', text: 'Dance under the stars', emoji: '💃', traitEffects: { kindness: 3, courage: 3 }, xpReward: 15, nextTags: ['desert-portal'] },
      { id: 'd_fr1b', text: 'Make a wish on a shooting star', emoji: '🌠', traitEffects: { wisdom: 4, curiosity: 3 }, xpReward: 15, nextTags: ['desert-portal'] },
    ],
  },
  {
    id: 'd_night1',
    world: 'desert',
    tags: ['desert-explore'],
    location: 'Desert Night Sky',
    background: 'desert-night',
    text: 'Night falls and the desert transforms. Millions of stars fill the sky. The sand cools and small creatures come out to play. Tiny glowing scorpions draw pictures in the sand with their tails.',
    music: 'calmEnding',
    sfx: ['crickets', 'wind'],
    choices: [
      { id: 'd_n1a', text: 'Watch the scorpion art show', emoji: '🦂', traitEffects: { curiosity: 4, wisdom: 2 }, xpReward: 10, nextTags: ['desert-discovery'] },
      { id: 'd_n1b', text: 'Count the constellations', emoji: '⭐', traitEffects: { wisdom: 5 }, xpReward: 10, nextTags: ['desert-portal'] },
    ],
  },
  {
    id: 'd_portal1',
    world: 'desert',
    tags: ['desert-portal'],
    location: 'Mirage Lake',
    background: 'desert-night',
    text: 'Under the starlight, the mirage lake becomes real! Its surface shows reflections of other worlds — trees, waves, snow, and stars. {{name}} can step into any reflection to travel there.',
    music: 'softAdventure',
    sfx: ['magic', 'water'],
    choices: [
      { id: 'd_p1a', text: 'Step into the forest', emoji: '🌲', traitEffects: { wisdom: 3 }, xpReward: 15, nextTags: ['start'], nextWorld: 'forest' },
      { id: 'd_p1b', text: 'Step into the ocean', emoji: '🌊', traitEffects: { kindness: 3 }, xpReward: 15, nextTags: ['start'], nextWorld: 'ocean' },
      { id: 'd_p1c', text: 'Step into space', emoji: '🚀', traitEffects: { curiosity: 5 }, xpReward: 20, nextTags: ['start'], nextWorld: 'space' },
      { id: 'd_p1d', text: 'Keep exploring the desert', emoji: '🏜️', traitEffects: { courage: 3 }, xpReward: 10, nextTags: ['desert-explore'] },
    ],
    conditions: [{ trait: 'wisdom', min: 15 }],
  },
];

// ─────────── ALL NODES ───────────

export const ALL_NODES: StoryNode[] = [
  ...forestNodes,
  ...oceanNodes,
  ...mountainNodes,
  ...spaceNodes,
  ...desertNodes,
];

export function getNodesByWorldAndTags(world: WorldId, tags: string[], traits: Record<TraitId, number>, recentIds: string[]): StoryNode[] {
  return ALL_NODES.filter(node => {
    if (node.world !== world) return false;
    if (!tags.some(t => node.tags.includes(t))) return false;
    if (recentIds.includes(node.id)) return false;
    if (node.conditions) {
      return node.conditions.every(c => traits[c.trait] >= (c.min || 0));
    }
    return true;
  });
}

export function getStartNode(world: WorldId): StoryNode {
  const starts = ALL_NODES.filter(n => n.world === world && n.tags.includes('start'));
  if (starts.length === 0) {
    // Absolute fallback: return the first node for this world, or the very first node
    const worldNodes = ALL_NODES.filter(n => n.world === world);
    return worldNodes[0] ?? ALL_NODES[0];
  }
  return starts[0];
}
