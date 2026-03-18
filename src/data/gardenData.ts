// ============================================================
// Learning Garden Data
// Maps each of the 42 phonics sounds to a unique plant
// Plants grow as children master sounds
// ============================================================

export interface PlantStage {
  name: 'seed' | 'sprout' | 'growing' | 'blooming' | 'flowering';
  emoji: string;
  masteryThreshold: number; // 0, 20, 50, 80, 95
  description: string;
}

export interface GardenPlant {
  soundId: string;
  plantType: string;
  emoji: string;
  stages: PlantStage[];
  color: string;
}

const FLOWER_STAGES: PlantStage[] = [
  { name: 'seed', emoji: '\uD83E\uDED8', masteryThreshold: 0, description: 'A tiny seed in the soil' },
  { name: 'sprout', emoji: '\uD83C\uDF31', masteryThreshold: 20, description: 'A green sprout peeks out!' },
  { name: 'growing', emoji: '\uD83E\uDEB4', masteryThreshold: 50, description: 'Growing taller every day' },
  { name: 'blooming', emoji: '\uD83C\uDF38', masteryThreshold: 80, description: 'Beautiful buds are forming' },
  { name: 'flowering', emoji: '\uD83C\uDF3A', masteryThreshold: 95, description: 'Fully bloomed and gorgeous!' },
];

const TREE_STAGES: PlantStage[] = [
  { name: 'seed', emoji: '\uD83E\uDED8', masteryThreshold: 0, description: 'An acorn in the ground' },
  { name: 'sprout', emoji: '\uD83C\uDF31', masteryThreshold: 20, description: 'A tiny seedling appears!' },
  { name: 'growing', emoji: '\uD83E\uDEB4', masteryThreshold: 50, description: 'The sapling grows strong' },
  { name: 'blooming', emoji: '\uD83C\uDF33', masteryThreshold: 80, description: 'Branches reach for the sky' },
  { name: 'flowering', emoji: '\uD83C\uDF32', masteryThreshold: 95, description: 'A mighty tree stands tall!' },
];

const FRUIT_STAGES: PlantStage[] = [
  { name: 'seed', emoji: '\uD83E\uDED8', masteryThreshold: 0, description: 'A fruit seed planted' },
  { name: 'sprout', emoji: '\uD83C\uDF31', masteryThreshold: 20, description: 'A green shoot emerges!' },
  { name: 'growing', emoji: '\uD83E\uDEB4', masteryThreshold: 50, description: 'Leaves are spreading' },
  { name: 'blooming', emoji: '\uD83C\uDF3C', masteryThreshold: 80, description: 'Flowers appear on branches' },
  { name: 'flowering', emoji: '\uD83C\uDF4E', masteryThreshold: 95, description: 'Delicious fruit is ripe!' },
];

const VEGGIE_STAGES: PlantStage[] = [
  { name: 'seed', emoji: '\uD83E\uDED8', masteryThreshold: 0, description: 'A veggie seed underground' },
  { name: 'sprout', emoji: '\uD83C\uDF31', masteryThreshold: 20, description: 'Green leaves pop up!' },
  { name: 'growing', emoji: '\uD83E\uDEB4', masteryThreshold: 50, description: 'The plant grows bushy' },
  { name: 'blooming', emoji: '\uD83C\uDF3F', masteryThreshold: 80, description: 'Almost ready to harvest' },
  { name: 'flowering', emoji: '\uD83E\uDD55', masteryThreshold: 95, description: 'Fresh veggies to pick!' },
];

const MUSHROOM_STAGES: PlantStage[] = [
  { name: 'seed', emoji: '\uD83E\uDED8', masteryThreshold: 0, description: 'Spores in the earth' },
  { name: 'sprout', emoji: '\uD83C\uDF31', masteryThreshold: 20, description: 'Something stirs below!' },
  { name: 'growing', emoji: '\uD83E\uDEB4', masteryThreshold: 50, description: 'Mossy growth appears' },
  { name: 'blooming', emoji: '\uD83C\uDF3F', masteryThreshold: 80, description: 'Lush and green' },
  { name: 'flowering', emoji: '\uD83C\uDF44', masteryThreshold: 95, description: 'A magical mushroom!' },
];

const CACTUS_STAGES: PlantStage[] = [
  { name: 'seed', emoji: '\uD83E\uDED8', masteryThreshold: 0, description: 'A desert seed waiting' },
  { name: 'sprout', emoji: '\uD83C\uDF31', masteryThreshold: 20, description: 'A tiny succulent appears!' },
  { name: 'growing', emoji: '\uD83E\uDEB4', masteryThreshold: 50, description: 'Getting prickly and strong' },
  { name: 'blooming', emoji: '\uD83C\uDF3B', masteryThreshold: 80, description: 'An exotic bloom opens' },
  { name: 'flowering', emoji: '\uD83C\uDF35', masteryThreshold: 95, description: 'A stunning desert beauty!' },
];

const MAGIC_STAGES: PlantStage[] = [
  { name: 'seed', emoji: '\uD83E\uDED8', masteryThreshold: 0, description: 'A glowing seed of magic' },
  { name: 'sprout', emoji: '\uD83C\uDF31', masteryThreshold: 20, description: 'Sparkles appear from the soil!' },
  { name: 'growing', emoji: '\uD83E\uDEB4', masteryThreshold: 50, description: 'Magic energy grows' },
  { name: 'blooming', emoji: '\u2728', masteryThreshold: 80, description: 'Dazzling light shines' },
  { name: 'flowering', emoji: '\uD83C\uDF1F', masteryThreshold: 95, description: 'A star flower of pure magic!' },
];

// Group 1: Flowers (s, a, t, i, p, n)
// Group 2: Trees (ck, e, h, r, m, d)
// Group 3: Fruits (g, o, u, l, f, b)
// Group 4: Vegetables (ai, j, oa, ie, ee, or)
// Group 5: Mushrooms & moss (z, w, ng, v, oo_short, oo_long)
// Group 6: Cacti & exotic (y, x, ch, sh, th_voiced, th_unvoiced)
// Group 7: Magic flowers (qu, ou, oi, ue, er, ar)

export const GARDEN_PLANTS: GardenPlant[] = [
  // ── Group 1: Flowers ──
  { soundId: 'g1_s', plantType: 'sunflower', emoji: '\uD83C\uDF3B', stages: FLOWER_STAGES, color: '#FFD700' },
  { soundId: 'g1_a', plantType: 'rose', emoji: '\uD83C\uDF39', stages: FLOWER_STAGES, color: '#E11D48' },
  { soundId: 'g1_t', plantType: 'tulip', emoji: '\uD83C\uDF37', stages: FLOWER_STAGES, color: '#F472B6' },
  { soundId: 'g1_i', plantType: 'cherry_blossom', emoji: '\uD83C\uDF38', stages: FLOWER_STAGES, color: '#FBCFE8' },
  { soundId: 'g1_p', plantType: 'bouquet', emoji: '\uD83D\uDC90', stages: FLOWER_STAGES, color: '#A855F7' },
  { soundId: 'g1_n', plantType: 'hibiscus', emoji: '\uD83C\uDF3A', stages: FLOWER_STAGES, color: '#EC4899' },

  // ── Group 2: Trees ──
  { soundId: 'g2_ck', plantType: 'deciduous_tree', emoji: '\uD83C\uDF33', stages: TREE_STAGES, color: '#16A34A' },
  { soundId: 'g2_e', plantType: 'evergreen_tree', emoji: '\uD83C\uDF32', stages: TREE_STAGES, color: '#15803D' },
  { soundId: 'g2_h', plantType: 'palm_tree', emoji: '\uD83C\uDF34', stages: TREE_STAGES, color: '#22C55E' },
  { soundId: 'g2_r', plantType: 'tanabata_tree', emoji: '\uD83C\uDF8B', stages: TREE_STAGES, color: '#4ADE80' },
  { soundId: 'g2_m', plantType: 'christmas_tree', emoji: '\uD83C\uDF84', stages: TREE_STAGES, color: '#166534' },
  { soundId: 'g2_d', plantType: 'clover', emoji: '\uD83C\uDF40', stages: TREE_STAGES, color: '#86EFAC' },

  // ── Group 3: Fruits ──
  { soundId: 'g3_g', plantType: 'apple', emoji: '\uD83C\uDF4E', stages: FRUIT_STAGES, color: '#EF4444' },
  { soundId: 'g3_o', plantType: 'orange', emoji: '\uD83C\uDF4A', stages: FRUIT_STAGES, color: '#F97316' },
  { soundId: 'g3_u', plantType: 'lemon', emoji: '\uD83C\uDF4B', stages: FRUIT_STAGES, color: '#FACC15' },
  { soundId: 'g3_l', plantType: 'grapes', emoji: '\uD83C\uDF47', stages: FRUIT_STAGES, color: '#7C3AED' },
  { soundId: 'g3_f', plantType: 'strawberry', emoji: '\uD83C\uDF53', stages: FRUIT_STAGES, color: '#DC2626' },
  { soundId: 'g3_b', plantType: 'blueberry', emoji: '\uD83E\uDED0', stages: FRUIT_STAGES, color: '#3B82F6' },

  // ── Group 4: Vegetables ──
  { soundId: 'g4_ai', plantType: 'carrot', emoji: '\uD83E\uDD55', stages: VEGGIE_STAGES, color: '#EA580C' },
  { soundId: 'g4_j', plantType: 'corn', emoji: '\uD83C\uDF3D', stages: VEGGIE_STAGES, color: '#EAB308' },
  { soundId: 'g4_oa', plantType: 'cucumber', emoji: '\uD83E\uDD52', stages: VEGGIE_STAGES, color: '#65A30D' },
  { soundId: 'g4_ie', plantType: 'tomato', emoji: '\uD83C\uDF45', stages: VEGGIE_STAGES, color: '#DC2626' },
  { soundId: 'g4_ee', plantType: 'broccoli', emoji: '\uD83E\uDD66', stages: VEGGIE_STAGES, color: '#16A34A' },
  { soundId: 'g4_or', plantType: 'hot_pepper', emoji: '\uD83C\uDF36\uFE0F', stages: VEGGIE_STAGES, color: '#B91C1C' },

  // ── Group 5: Mushrooms & moss ──
  { soundId: 'g5_z', plantType: 'mushroom', emoji: '\uD83C\uDF44', stages: MUSHROOM_STAGES, color: '#92400E' },
  { soundId: 'g5_w', plantType: 'herb', emoji: '\uD83C\uDF3F', stages: MUSHROOM_STAGES, color: '#22C55E' },
  { soundId: 'g5_ng', plantType: 'leaf', emoji: '\uD83C\uDF43', stages: MUSHROOM_STAGES, color: '#84CC16' },
  { soundId: 'g5_v', plantType: 'rock', emoji: '\uD83E\uDEA8', stages: MUSHROOM_STAGES, color: '#78716C' },
  { soundId: 'g5_oo_short', plantType: 'wheat', emoji: '\uD83C\uDF3E', stages: MUSHROOM_STAGES, color: '#CA8A04' },
  { soundId: 'g5_oo_long', plantType: 'bamboo', emoji: '\uD83C\uDF8D', stages: MUSHROOM_STAGES, color: '#4ADE80' },

  // ── Group 6: Cacti & exotic ──
  { soundId: 'g6_y', plantType: 'cactus', emoji: '\uD83C\uDF35', stages: CACTUS_STAGES, color: '#16A34A' },
  { soundId: 'g6_x', plantType: 'hyacinth', emoji: '\uD83E\uDEBB', stages: CACTUS_STAGES, color: '#A855F7' },
  { soundId: 'g6_ch', plantType: 'blossom', emoji: '\uD83C\uDF3C', stages: CACTUS_STAGES, color: '#FBBF24' },
  { soundId: 'g6_sh', plantType: 'white_flower', emoji: '\uD83D\uDCAE', stages: CACTUS_STAGES, color: '#F9FAFB' },
  { soundId: 'g6_th_voiced', plantType: 'rosette', emoji: '\uD83C\uDFF5\uFE0F', stages: CACTUS_STAGES, color: '#F43F5E' },
  { soundId: 'g6_th_unvoiced', plantType: 'circus_tent', emoji: '\uD83C\uDFAA', stages: CACTUS_STAGES, color: '#EF4444' },

  // ── Group 7: Magic flowers ──
  { soundId: 'g7_qu', plantType: 'sparkles', emoji: '\u2728', stages: MAGIC_STAGES, color: '#FBBF24' },
  { soundId: 'g7_ou', plantType: 'glowing_star', emoji: '\uD83C\uDF1F', stages: MAGIC_STAGES, color: '#F59E0B' },
  { soundId: 'g7_oi', plantType: 'dizzy', emoji: '\uD83D\uDCAB', stages: MAGIC_STAGES, color: '#FBBF24' },
  { soundId: 'g7_ue', plantType: 'star', emoji: '\u2B50', stages: MAGIC_STAGES, color: '#EAB308' },
  { soundId: 'g7_er', plantType: 'crystal_ball', emoji: '\uD83D\uDD2E', stages: MAGIC_STAGES, color: '#8B5CF6' },
  { soundId: 'g7_ar', plantType: 'lotus', emoji: '\uD83E\uDEB7', stages: MAGIC_STAGES, color: '#EC4899' },
];

/** Group labels for the garden layout */
export const GARDEN_GROUP_LABELS: Record<number, { name: string; theme: string; bgColor: string }> = {
  1: { name: 'Flower Garden', theme: 'flowers', bgColor: '#FFF1F2' },
  2: { name: 'Tree Grove', theme: 'trees', bgColor: '#F0FDF4' },
  3: { name: 'Fruit Orchard', theme: 'fruits', bgColor: '#FFF7ED' },
  4: { name: 'Veggie Patch', theme: 'vegetables', bgColor: '#FEFCE8' },
  5: { name: 'Mossy Glen', theme: 'mushrooms', bgColor: '#F0FDF4' },
  6: { name: 'Desert Oasis', theme: 'cacti', bgColor: '#FEF3C7' },
  7: { name: 'Magic Meadow', theme: 'magic', bgColor: '#F5F3FF' },
};

/** Get a plant by soundId */
export function getPlantForSound(soundId: string): GardenPlant | undefined {
  return GARDEN_PLANTS.find((p) => p.soundId === soundId);
}

/** Get the current stage for a given mastery level */
export function getPlantStage(plant: GardenPlant, mastery: number): PlantStage {
  let currentStage = plant.stages[0];
  for (const stage of plant.stages) {
    if (mastery >= stage.masteryThreshold) {
      currentStage = stage;
    }
  }
  return currentStage;
}
