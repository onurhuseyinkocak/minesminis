// ============================================================
// MinesMinis Decodable Story Service
// Generates phonics-constrained stories for children.
// Only uses words from groups 1-N (child's current level).
// ============================================================

import {
  DECODABLE_WORDS,
  SIGHT_WORDS,
  findWord,
  getWordsByPos,
  type DecodableWord,
} from '../data/decodableWordbank';
import { GENERATED_STORIES } from '../data/generatedStories';

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface HighlightedWord {
  word: string;
  type: 'decodable' | 'sight' | 'tricky';
}

export interface DecodableScene {
  text: string;
  textTr: string;
  highlightedWords: HighlightedWord[];
  location: string;
}

export interface DecodableStory {
  id: string;
  title: string;
  titleTr: string;
  phonicsGroup: number;
  scenes: DecodableScene[];
  wordCount: number;
  sightWordCount: number;
  decodableWordCount: number;
  decodabilityScore: number; // 0-100, % of words that are fully decodable
  topic: string;
  mascotId: string;
  comprehensionQuestion: string;
  comprehensionQuestionTr: string;
  comprehensionAnswers: string[];
  comprehensionAnswersTr: string[];
  correctAnswerIndex: number;
}

// ─── BUILT-IN STORIES ─────────────────────────────────────────────────────────

const BUILT_IN_STORIES: DecodableStory[] = [
  // ── Group 1: s, a, t, i, p, n ──────────────────────────────────────────────
  {
    id: 'story_g1_nap',
    title: 'Nat and the Ant',
    titleTr: 'Nat ve Karınca',
    phonicsGroup: 1,
    topic: 'nature',
    mascotId: 'mimi',
    scenes: [
      {
        text: 'Nat sat in a pit.',
        textTr: 'Nat çukurda oturdu.',
        highlightedWords: [],
        location: 'garden',
      },
      {
        text: 'An ant sat on Nat.',
        textTr: 'Bir karınca Nat\'ın üzerine oturdu.',
        highlightedWords: [],
        location: 'garden',
      },
      {
        text: 'Nat can tap, tap, tap!',
        textTr: 'Nat dokuna, dokuna, dokunabilir!',
        highlightedWords: [],
        location: 'garden',
      },
      {
        text: 'The ant ran. Nat sat and sat.',
        textTr: 'Karınca koştu. Nat oturdu ve oturdu.',
        highlightedWords: [],
        location: 'garden',
      },
    ],
    wordCount: 0,
    sightWordCount: 0,
    decodableWordCount: 0,
    decodabilityScore: 0,
    comprehensionQuestion: 'What did Nat do in the pit?',
    comprehensionQuestionTr: 'Nat çukurda ne yaptı?',
    comprehensionAnswers: ['Sat', 'Ran', 'Napped'],
    comprehensionAnswersTr: ['Oturdu', 'Koştu', 'Uyudu'],
    correctAnswerIndex: 0,
  },

  // ── Group 2: adds c/k, e, h, r, m, d ───────────────────────────────────────
  {
    id: 'story_g2_hen',
    title: 'The Red Hen',
    titleTr: 'Kırmızı Tavuk',
    phonicsGroup: 2,
    topic: 'animals',
    mascotId: 'mimi',
    scenes: [
      {
        text: 'A red hen met a cat.',
        textTr: 'Kırmızı bir tavuk bir kediyle tanıştı.',
        highlightedWords: [],
        location: 'farm',
      },
      {
        text: 'The cat hid in a den.',
        textTr: 'Kedi inde saklandı.',
        highlightedWords: [],
        location: 'farm',
      },
      {
        text: 'The hen had a map. She ran and ran.',
        textTr: 'Tavuğun haritası vardı. Koştu ve koştu.',
        highlightedWords: [],
        location: 'farm',
      },
      {
        text: 'Dad hit a drum. The hen came home!',
        textTr: 'Baba davulu çaldı. Tavuk eve geldi!',
        highlightedWords: [],
        location: 'farm',
      },
    ],
    wordCount: 0,
    sightWordCount: 0,
    decodableWordCount: 0,
    decodabilityScore: 0,
    comprehensionQuestion: 'Where did the cat hide?',
    comprehensionQuestionTr: 'Kedi nerede saklandı?',
    comprehensionAnswers: ['In a den', 'In a hat', 'On a mat'],
    comprehensionAnswersTr: ['İnde', 'Şapkada', 'Paspasta'],
    correctAnswerIndex: 0,
  },

  // ── Group 3: adds g, o, u, l, f, b ─────────────────────────────────────────
  {
    id: 'story_g3_dog_bus',
    title: 'The Dog on the Bus',
    titleTr: 'Otobüsteki Köpek',
    phonicsGroup: 3,
    topic: 'adventure',
    mascotId: 'mimi',
    scenes: [
      {
        text: 'A big dog got on a bus.',
        textTr: 'Büyük bir köpek otobüse bindi.',
        highlightedWords: [],
        location: 'town',
      },
      {
        text: '"Sit!" said the man. But the dog did not sit.',
        textTr: '"Otur!" dedi adam. Ama köpek oturmadı.',
        highlightedWords: [],
        location: 'town',
      },
      {
        text: 'The dog got on the rug and had fun.',
        textTr: 'Köpek halıya geçti ve eğlendi.',
        highlightedWords: [],
        location: 'town',
      },
      {
        text: 'A bug sat on a log in the fog. Splat!',
        textTr: 'Bir böcek sisteki kütükte oturdu. Çat!',
        highlightedWords: [],
        location: 'forest',
      },
    ],
    wordCount: 0,
    sightWordCount: 0,
    decodableWordCount: 0,
    decodabilityScore: 0,
    comprehensionQuestion: 'What did the big dog do on the bus?',
    comprehensionQuestionTr: 'Büyük köpek otobüste ne yaptı?',
    comprehensionAnswers: ['Got on the rug', 'Sat down', 'Got off'],
    comprehensionAnswersTr: ['Halıya geçti', 'Oturdu', 'İndi'],
    correctAnswerIndex: 0,
  },

  // ── Group 4: adds ai, j, oa, ie, ee, or ────────────────────────────────────
  {
    id: 'story_g4_goat_boat',
    title: 'The Goat on a Boat',
    titleTr: 'Teknedeki Keçi',
    phonicsGroup: 4,
    topic: 'adventure',
    mascotId: 'mimi',
    scenes: [
      {
        text: 'It began to rain. A goat got on a boat.',
        textTr: 'Yağmur yağmaya başladı. Bir keçi tekneye bindi.',
        highlightedWords: [],
        location: 'ocean',
      },
      {
        text: 'The goat sailed up the road to see a tree.',
        textTr: 'Keçi bir ağaç görmek için yolda yelken açtı.',
        highlightedWords: [],
        location: 'ocean',
      },
      {
        text: 'A bee sat on the tail of the goat. "Ouch!"',
        textTr: 'Bir arı keçinin kuyruğuna kondu. "Ayyy!"',
        highlightedWords: [],
        location: 'forest',
      },
      {
        text: 'The goat ran for the corn. A green tie was on the tree!',
        textTr: 'Keçi mısıra koştu. Ağaçta yeşil bir kravat vardı!',
        highlightedWords: [],
        location: 'forest',
      },
    ],
    wordCount: 0,
    sightWordCount: 0,
    decodableWordCount: 0,
    decodabilityScore: 0,
    comprehensionQuestion: 'Why did the goat get on the boat?',
    comprehensionQuestionTr: 'Keçi neden tekneye bindi?',
    comprehensionAnswers: ['It was raining', 'To see the bee', 'To get corn'],
    comprehensionAnswersTr: ['Yağmur yağıyordu', 'Arıyı görmek için', 'Mısır almak için'],
    correctAnswerIndex: 0,
  },

  // ── Group 5: adds z, w, ng, v, oo ──────────────────────────────────────────
  {
    id: 'story_g5_king_zoo',
    title: 'The King and the Zoo',
    titleTr: 'Kral ve Hayvanat Bahçesi',
    phonicsGroup: 5,
    topic: 'animals',
    mascotId: 'mimi',
    scenes: [
      {
        text: 'A king went to the zoo. He took a long look.',
        textTr: 'Bir kral hayvanat bahçesine gitti. Uzun uzun baktı.',
        highlightedWords: [],
        location: 'zoo',
      },
      {
        text: 'A bee went buzz! "Zing!" sang the king.',
        textTr: 'Bir arı vız dedi! "Zing!" diye şarkı söyledi kral.',
        highlightedWords: [],
        location: 'zoo',
      },
      {
        text: 'He looked at the cool moon pool. A van was near the wood.',
        textTr: 'Serin ay havuzuna baktı. Yakınlarda ahşabın yanında bir minibüs vardı.',
        highlightedWords: [],
        location: 'zoo',
      },
      {
        text: '"I need food!" He cooked a good meal in the moonlight.',
        textTr: '"Yemek istiyorum!" Ay ışığında güzel bir yemek pişirdi.',
        highlightedWords: [],
        location: 'zoo',
      },
    ],
    wordCount: 0,
    sightWordCount: 0,
    decodableWordCount: 0,
    decodabilityScore: 0,
    comprehensionQuestion: 'What sound did the bee make?',
    comprehensionQuestionTr: 'Arı nasıl ses çıkardı?',
    comprehensionAnswers: ['Buzz', 'Zing', 'Zoom'],
    comprehensionAnswersTr: ['Vız', 'Zing', 'Vın'],
    correctAnswerIndex: 0,
  },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────

/**
 * Check if a word (raw string) is a sight word.
 */
function isSightWordStr(word: string): boolean {
  return SIGHT_WORDS.includes(word.toLowerCase());
}

/**
 * Check if a word is decodable at a given phonics group level.
 * Returns true if all phonics IDs used by the word have maxGroup <= given group.
 */
export function isWordDecodable(word: string, maxGroup: number): boolean {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (isSightWordStr(clean)) return true;

  const entry = findWord(clean);
  if (!entry) return false; // unknown word — treat as tricky
  return entry.maxGroup <= maxGroup;
}

/**
 * Classify a raw word token for a given group level.
 */
function classifyWord(word: string, maxGroup: number): HighlightedWord['type'] {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 'decodable';
  if (isSightWordStr(clean)) return 'sight';

  const entry = findWord(clean);
  if (!entry) return 'tricky';
  return entry.maxGroup <= maxGroup ? 'decodable' : 'tricky';
}

/**
 * Build highlighted word list from a sentence.
 */
function buildHighlights(text: string, maxGroup: number): HighlightedWord[] {
  return text
    .split(/\s+/)
    .filter(t => t.length > 0)
    .map(token => {
      const bare = token.replace(/[^a-zA-Z]/g, '');
      return {
        word: token,
        type: bare ? classifyWord(bare, maxGroup) : 'decodable',
      };
    });
}

/**
 * Calculate decodability score (0-100) of a full text at given group level.
 */
export function calculateDecodability(text: string, maxGroup: number): number {
  const tokens = text
    .split(/\s+/)
    .map(t => t.replace(/[^a-zA-Z]/g, ''))
    .filter(t => t.length > 0);

  if (tokens.length === 0) return 100;

  const decodableCount = tokens.filter(t => {
    const lower = t.toLowerCase();
    return isSightWordStr(lower) || isWordDecodable(lower, maxGroup);
  }).length;

  return Math.round((decodableCount / tokens.length) * 100);
}

/**
 * Count word-type stats in a set of scenes.
 */
function calcStats(scenes: DecodableScene[], maxGroup: number): {
  wordCount: number;
  sightWordCount: number;
  decodableWordCount: number;
  decodabilityScore: number;
} {
  const allText = scenes.map(s => s.text).join(' ');
  const tokens = allText
    .split(/\s+/)
    .map(t => t.replace(/[^a-zA-Z]/g, ''))
    .filter(t => t.length > 0);

  let sight = 0;
  let decodable = 0;

  for (const t of tokens) {
    const lower = t.toLowerCase();
    if (isSightWordStr(lower)) {
      sight++;
    } else if (isWordDecodable(lower, maxGroup)) {
      decodable++;
    }
  }

  const total = tokens.length;
  const score = total > 0 ? Math.round(((sight + decodable) / total) * 100) : 100;

  return {
    wordCount: total,
    sightWordCount: sight,
    decodableWordCount: decodable,
    decodabilityScore: score,
  };
}

/**
 * Enrich scenes with highlighted words and compute stats for a built-in story.
 */
function enrichStory(story: DecodableStory): DecodableStory {
  const enrichedScenes = story.scenes.map(scene => ({
    ...scene,
    highlightedWords: buildHighlights(scene.text, story.phonicsGroup),
  }));

  const stats = calcStats(enrichedScenes, story.phonicsGroup);

  return {
    ...story,
    scenes: enrichedScenes,
    ...stats,
  };
}

// Pre-enrich all built-in stories at module load time
const ENRICHED_BUILT_IN_STORIES = [
  ...BUILT_IN_STORIES,
  ...GENERATED_STORIES,
].map(enrichStory);

// ─── TEMPLATES ────────────────────────────────────────────────────────────────

interface StoryTemplate {
  scenes: Array<{
    template: string;
    templateTr: string;
    location: string;
  }>;
  comprehensionQuestion: string;
  comprehensionQuestionTr: string;
  correctAnswerKey: 'NOUN' | 'VERB' | 'ADJ';
}

const STORY_TEMPLATES: StoryTemplate[] = [
  {
    scenes: [
      {
        template: 'A [ADJ] [NOUN] sat on a [NOUN].',
        templateTr: '[ADJ] bir [NOUN] bir [NOUN] üzerine oturdu.',
        location: 'garden',
      },
      {
        template: 'It can [VERB] and [VERB]!',
        templateTr: 'O [VERB]ebilir ve [VERB]ebilir!',
        location: 'garden',
      },
      {
        template: 'The [NOUN] had fun.',
        templateTr: '[NOUN] eğlendi.',
        location: 'garden',
      },
    ],
    comprehensionQuestion: 'What did the [NOUN] do?',
    comprehensionQuestionTr: '[NOUN] ne yaptı?',
    correctAnswerKey: 'VERB',
  },
  {
    scenes: [
      {
        template: 'A [NOUN] ran to the [NOUN].',
        templateTr: 'Bir [NOUN] [NOUN]\'a koştu.',
        location: 'forest',
      },
      {
        template: 'The [NOUN] was [ADJ] and [ADJ].',
        templateTr: '[NOUN] [ADJ] ve [ADJ] idi.',
        location: 'forest',
      },
      {
        template: 'It can [VERB]. What fun!',
        templateTr: 'O [VERB]ebilir. Ne eğlenceli!',
        location: 'forest',
      },
    ],
    comprehensionQuestion: 'Where did the [NOUN] go?',
    comprehensionQuestionTr: '[NOUN] nereye gitti?',
    correctAnswerKey: 'NOUN',
  },
];

// ─── GENERATE STORY ────────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickHighFreq<T extends { frequency: number }>(arr: T[]): T {
  const sorted = [...arr].sort((a, b) => b.frequency - a.frequency);
  const top = sorted.slice(0, Math.max(3, Math.floor(sorted.length / 2)));
  return pickRandom(top);
}

/**
 * Generate a decodable story at a given phonics group level.
 * Uses templates filled from the word bank.
 */
export function generateDecodableStory(
  maxGroup: number,
  topic: string,
  mascotId: string,
): DecodableStory {
  const nouns = getWordsByPos(maxGroup, 'noun').filter(w => !w.isSightWord);
  const verbs = getWordsByPos(maxGroup, 'verb').filter(w => !w.isSightWord);
  const adjs = getWordsByPos(maxGroup, 'adjective').filter(w => !w.isSightWord);

  const noun1 = nouns.length > 0 ? pickHighFreq(nouns) : fallback('noun');
  const noun2 = nouns.length > 1
    ? pickHighFreq(nouns.filter(n => n.word !== noun1.word))
    : noun1;
  const verb1 = verbs.length > 0 ? pickHighFreq(verbs) : fallback('verb');
  const verb2 = verbs.length > 1
    ? pickHighFreq(verbs.filter(v => v.word !== verb1.word))
    : verb1;
  const adj1 = adjs.length > 0 ? pickHighFreq(adjs) : fallback('adj');
  const adj2 = adjs.length > 1
    ? pickHighFreq(adjs.filter(a => a.word !== adj1.word))
    : adj1;

  const template = pickRandom(STORY_TEMPLATES);

  function fillTemplate(text: string): string {
    return text
      .replace(/\[NOUN\]/g, noun1.word)
      .replace(/\[NOUN2\]/g, noun2.word)
      .replace(/\[VERB\]/g, verb1.word)
      .replace(/\[VERB2\]/g, verb2.word)
      .replace(/\[ADJ\]/g, adj1.word)
      .replace(/\[ADJ2\]/g, adj2.word);
  }

  function fillTemplateTr(text: string): string {
    return text
      .replace(/\[NOUN\]/g, noun1.wordTr)
      .replace(/\[NOUN2\]/g, noun2.wordTr)
      .replace(/\[VERB\]/g, verb1.wordTr)
      .replace(/\[VERB2\]/g, verb2.wordTr)
      .replace(/\[ADJ\]/g, adj1.wordTr)
      .replace(/\[ADJ2\]/g, adj2.wordTr);
  }

  const scenes: DecodableScene[] = template.scenes.map(s => {
    const text = fillTemplate(s.template);
    const textTr = fillTemplateTr(s.templateTr);
    return {
      text,
      textTr,
      highlightedWords: buildHighlights(text, maxGroup),
      location: s.location,
    };
  });

  const stats = calcStats(scenes, maxGroup);

  const answerWord = template.correctAnswerKey === 'NOUN'
    ? noun1.word
    : template.correctAnswerKey === 'VERB'
    ? verb1.word
    : adj1.word;

  const correctAnswerIndex = 0;
  const wrongAnswers = [noun2.word, adj1.word, verb2.word]
    .filter(w => w !== answerWord)
    .slice(0, 2);

  const comprehensionAnswers = [answerWord, ...wrongAnswers].slice(0, 3);
  const comprehensionAnswersTr = comprehensionAnswers.map(a => {
    const found = DECODABLE_WORDS.find(w => w.word === a);
    return found ? found.wordTr : a;
  });

  return {
    id: `story_gen_g${maxGroup}_${Date.now()}`,
    title: `${adj1.word.charAt(0).toUpperCase() + adj1.word.slice(1)} ${noun1.word.charAt(0).toUpperCase() + noun1.word.slice(1)}`,
    titleTr: `${adj1.wordTr.charAt(0).toUpperCase() + adj1.wordTr.slice(1)} ${noun1.wordTr.charAt(0).toUpperCase() + noun1.wordTr.slice(1)}`,
    phonicsGroup: maxGroup,
    scenes,
    topic,
    mascotId,
    comprehensionQuestion: fillTemplate(template.comprehensionQuestion),
    comprehensionQuestionTr: fillTemplateTr(template.comprehensionQuestionTr),
    comprehensionAnswers,
    comprehensionAnswersTr,
    correctAnswerIndex,
    ...stats,
  };
}

function fallback(pos: string): DecodableWord {
  const map: Record<string, DecodableWord> = {
    noun: {
      word: 'cat',
      wordTr: 'kedi',
      phonics: ['g2_ck', 'g1_a', 'g1_t'],
      maxGroup: 2,
      isSightWord: false,
      syllableCount: 1,
      frequency: 10,
      partOfSpeech: 'noun',
    },
    verb: {
      word: 'ran',
      wordTr: 'koştu',
      phonics: ['g2_r', 'g1_a', 'g1_n'],
      maxGroup: 2,
      isSightWord: false,
      syllableCount: 1,
      frequency: 8,
      partOfSpeech: 'verb',
    },
    adj: {
      word: 'big',
      wordTr: 'büyük',
      phonics: ['g3_b', 'g1_i', 'g3_g'],
      maxGroup: 3,
      isSightWord: false,
      syllableCount: 1,
      frequency: 10,
      partOfSpeech: 'adjective',
    },
  };
  return map[pos] ?? map['noun'];
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

/**
 * Return built-in stories for a child, filtered by their mastered groups.
 * masteredGroups: array of group numbers the child has mastered (e.g. [1, 2, 3]).
 */
export function getStoriesForChild(masteredGroups: number[]): DecodableStory[] {
  const maxGroup = masteredGroups.length > 0 ? Math.max(...masteredGroups) : 1;
  return ENRICHED_BUILT_IN_STORIES.filter(s => s.phonicsGroup <= maxGroup);
}

/**
 * Return all built-in stories (pre-enriched).
 */
export function getAllBuiltInStories(): DecodableStory[] {
  return ENRICHED_BUILT_IN_STORIES;
}

/**
 * Return a single built-in story by ID (pre-enriched).
 */
export function getStoryById(id: string): DecodableStory | undefined {
  return ENRICHED_BUILT_IN_STORIES.find(s => s.id === id);
}
