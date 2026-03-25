/**
 * STORY ASSETS — Comprehensive asset library for AI story generation
 * Characters, locations, themes, moods, and sound effects for children ages 3-10
 * All data is pure TypeScript — no external fetches required
 */

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export interface StoryCharacter {
  id: string;
  name: string;
  nameTr: string;
  type: 'animal' | 'human' | 'magical' | 'robot';
  emoji: string;
  color: string; // SVG fill color
  personality: string;
  catchphrase: string;
  catchphraseTr: string;
}

export interface StoryLocation {
  id: string;
  name: string;
  nameTr: string;
  type: 'forest' | 'ocean' | 'mountain' | 'space' | 'desert' | 'city' | 'farm' | 'castle';
  emoji: string;
  bgGradient: [string, string]; // CSS gradient colors
  elements: string[]; // SVG elements to render
  ambiance: string; // description for AI
}

export interface StoryTheme {
  id: string;
  title: string;
  titleTr: string;
  moral: string;
  moralTr: string;
  targetAge: [number, number];
  vocabularyFocus: string[]; // word categories
}

export interface StoryMood {
  id: string;
  emoji: string;
  color: string;
}

export interface StorySoundEffect {
  id: string;
  name: string;
  emoji: string;
}

export interface StoryTemplate {
  characters: StoryCharacter[];
  locations: StoryLocation[];
  themes: StoryTheme[];
  moods: StoryMood[];
  soundEffects: StorySoundEffect[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CHARACTERS (22 total)
// ─────────────────────────────────────────────────────────────────────────────

export const STORY_CHARACTERS: StoryCharacter[] = [
  {
    id: 'mimi',
    name: 'Mimi',
    nameTr: 'Mimi',
    type: 'magical',
    emoji: '🐲',
    color: '#4CAF50',
    personality: 'curious, brave, and loves to learn new words',
    catchphrase: 'Every word is a new adventure!',
    catchphraseTr: 'Her kelime yeni bir macera!',
  },
  {
    id: 'luna',
    name: 'Luna',
    nameTr: 'Luna',
    type: 'animal',
    emoji: '🐰',
    color: '#E8D5C4',
    personality: 'gentle, kind, and always shares with friends',
    catchphrase: 'Sharing makes everything sweeter!',
    catchphraseTr: 'Paylaşmak her şeyi daha güzel yapar!',
  },
  {
    id: 'captain_wave',
    name: 'Captain Wave',
    nameTr: 'Kaptan Dalga',
    type: 'animal',
    emoji: '🦀',
    color: '#FF6B6B',
    personality: 'bold, adventurous, and loves the ocean',
    catchphrase: 'Full speed ahead, matey!',
    catchphraseTr: 'Tam hız ileri, arkadaş!',
  },
  {
    id: 'breezy',
    name: 'Breezy',
    nameTr: 'Esintili',
    type: 'animal',
    emoji: '🐦',
    color: '#87CEEB',
    personality: 'free-spirited, cheerful, and loves to sing',
    catchphrase: 'The sky is always full of music!',
    catchphraseTr: 'Gökyüzü her zaman müzikle dolu!',
  },
  {
    id: 'rocky',
    name: 'Rocky',
    nameTr: 'Kayalık',
    type: 'animal',
    emoji: '🐻',
    color: '#8B6914',
    personality: 'strong, reliable, and incredibly gentle',
    catchphrase: 'Big hugs solve big problems!',
    catchphraseTr: 'Büyük sarılmalar büyük sorunları çözer!',
  },
  {
    id: 'pixel',
    name: 'Pixel',
    nameTr: 'Piksel',
    type: 'robot',
    emoji: '🤖',
    color: '#607D8B',
    personality: 'logical, helpful, and loves solving puzzles',
    catchphrase: 'Error 404: frowning not found!',
    catchphraseTr: 'Hata 404: üzüntü bulunamadı!',
  },
  {
    id: 'sparkle',
    name: 'Sparkle',
    nameTr: 'Işıltı',
    type: 'magical',
    emoji: '🦄',
    color: '#E91E8C',
    personality: 'magical, optimistic, and sprinkles joy everywhere',
    catchphrase: 'Believe in your magic!',
    catchphraseTr: 'Sihrine inan!',
  },
  {
    id: 'finn',
    name: 'Finn',
    nameTr: 'Fin',
    type: 'animal',
    emoji: '🐬',
    color: '#00BCD4',
    personality: 'playful, fast, and loves making friends laugh',
    catchphrase: 'Splash! Every day is a fun day!',
    catchphraseTr: 'Çapraza! Her gün eğlenceli bir gün!',
  },
  {
    id: 'oliver',
    name: 'Oliver',
    nameTr: 'Oliver',
    type: 'animal',
    emoji: '🦉',
    color: '#795548',
    personality: 'wise, patient, and loves sharing knowledge',
    catchphrase: 'The more you know, the further you go!',
    catchphraseTr: 'Ne kadar çok bilirsen, o kadar ilerlersin!',
  },
  {
    id: 'zara',
    name: 'Zara',
    nameTr: 'Zara',
    type: 'human',
    emoji: '👧',
    color: '#FF8A65',
    personality: 'creative, imaginative, and always asks "why?"',
    catchphrase: 'I wonder what happens if…',
    catchphraseTr: 'Şuna bakalım…',
  },
  {
    id: 'sam',
    name: 'Sam',
    nameTr: 'Sam',
    type: 'human',
    emoji: '👦',
    color: '#42A5F5',
    personality: 'determined, helpful, and never gives up',
    catchphrase: 'We can do it together!',
    catchphraseTr: 'Birlikte yapabiliriz!',
  },
  {
    id: 'fern',
    name: 'Fern',
    nameTr: 'Eğrelti',
    type: 'animal',
    emoji: '🦌',
    color: '#A5D6A7',
    personality: 'shy at first but incredibly brave inside',
    catchphrase: 'One small step at a time!',
    catchphraseTr: 'Her seferinde bir küçük adım!',
  },
  {
    id: 'coco',
    name: 'Coco',
    nameTr: 'Koko',
    type: 'animal',
    emoji: '🐒',
    color: '#FF7043',
    personality: 'energetic, funny, and loves swinging through trees',
    catchphrase: 'Life is better when you\'re upside down!',
    catchphraseTr: 'Hayat baş aşağı daha güzel!',
  },
  {
    id: 'pearl',
    name: 'Pearl',
    nameTr: 'İnci',
    type: 'animal',
    emoji: '🐠',
    color: '#EF9A9A',
    personality: 'colorful, curious, and loves exploring coral reefs',
    catchphrase: 'The ocean has so many secrets!',
    catchphraseTr: 'Okyanusun pek çok sırrı var!',
  },
  {
    id: 'snowy',
    name: 'Snowy',
    nameTr: 'Karlı',
    type: 'animal',
    emoji: '🐺',
    color: '#E0E0E0',
    personality: 'loyal, protective, and loves cold adventures',
    catchphrase: 'Friends stand together through any storm!',
    catchphraseTr: 'Arkadaşlar her fırtınada birlikte durur!',
  },
  {
    id: 'pip',
    name: 'Pip',
    nameTr: 'Pip',
    type: 'animal',
    emoji: '🐭',
    color: '#F8BBD0',
    personality: 'tiny but mighty, brave, and full of big ideas',
    catchphrase: 'Small size, BIG heart!',
    catchphraseTr: 'Küçük beden, BÜYÜK kalp!',
  },
  {
    id: 'nova',
    name: 'Nova',
    nameTr: 'Nova',
    type: 'magical',
    emoji: '⭐',
    color: '#FFC107',
    personality: 'ancient, wise, and glows with warmth and light',
    catchphrase: 'Every star has its own story!',
    catchphraseTr: 'Her yıldızın kendi hikayesi var!',
  },
  {
    id: 'buzz',
    name: 'Buzz',
    nameTr: 'Biz',
    type: 'animal',
    emoji: '🐝',
    color: '#FFD600',
    personality: 'hardworking, sweet, and loves teamwork',
    catchphrase: 'Together we make the sweetest honey!',
    catchphraseTr: 'Birlikte en tatlı balı yaparız!',
  },
  {
    id: 'terra',
    name: 'Terra',
    nameTr: 'Terra',
    type: 'magical',
    emoji: '🌱',
    color: '#66BB6A',
    personality: 'nurturing, patient, and loves growing things',
    catchphrase: 'Give it time, sunshine, and love!',
    catchphraseTr: 'Zaman, güneş ve sevgi ver!',
  },
  {
    id: 'cosmo',
    name: 'Cosmo',
    nameTr: 'Kozmo',
    type: 'robot',
    emoji: '🚀',
    color: '#9C27B0',
    personality: 'adventurous, scientific, and loves exploring new worlds',
    catchphrase: 'To infinity and beyond breakfast!',
    catchphraseTr: 'Sonsuza ve kahvaltının ötesine!',
  },
  {
    id: 'gigi',
    name: 'Gigi',
    nameTr: 'Gigi',
    type: 'animal',
    emoji: '🦒',
    color: '#FFCC80',
    personality: 'tall, gentle, and has the best view of everything',
    catchphrase: 'See the big picture!',
    catchphraseTr: 'Büyük resmi gör!',
  },
  {
    id: 'patches',
    name: 'Patches',
    nameTr: 'Desenli',
    type: 'animal',
    emoji: '🐄',
    color: '#ECEFF1',
    personality: 'calm, steady, and gives the best advice on the farm',
    catchphrase: 'Slow and steady wins the race!',
    catchphraseTr: 'Yavaş ve kararlı yarışı kazanır!',
  },
  {
    id: 'captain_crab',
    name: 'Captain Crab',
    nameTr: 'Kaptan Yengeç',
    type: 'animal',
    emoji: '🦀',
    color: '#E74C3C',
    personality: 'wise old sailor who has sailed every ocean and loves telling tales',
    catchphrase: 'Every shore hides a new story!',
    catchphraseTr: 'Her kıyı yeni bir hikaye saklar!',
  },
  {
    id: 'bella_butterfly',
    name: 'Bella Butterfly',
    nameTr: 'Bella Kelebek',
    type: 'animal',
    emoji: '🦋',
    color: '#9B59B6',
    personality: 'gentle, colorful, and believes every change is beautiful',
    catchphrase: 'Change your wings, change your world!',
    catchphraseTr: 'Kanatlarını değiştir, dünyayı değiştir!',
  },
  {
    id: 'zara_zebra',
    name: 'Zara Zebra',
    nameTr: 'Zara Zebra',
    type: 'animal',
    emoji: '🦓',
    color: '#34495E',
    personality: 'loves patterns, counting, and finding order in everything',
    catchphrase: 'Every stripe tells a number story!',
    catchphraseTr: 'Her çizgi bir sayı hikayesi anlatır!',
  },
  {
    id: 'oliver_owl',
    name: 'Oliver Owl',
    nameTr: 'Oliver Baykuş',
    type: 'animal',
    emoji: '🦉',
    color: '#6C5CE7',
    personality: 'bookworm and night student who reads under moonlight',
    catchphrase: 'The night is full of wonderful words!',
    catchphraseTr: 'Gece harika kelimelerle dolu!',
  },
  {
    id: 'penny_penguin',
    name: 'Penny Penguin',
    nameTr: 'Penny Penguen',
    type: 'animal',
    emoji: '🐧',
    color: '#00B5FF',
    personality: 'cool, logical, and keeps calm in any situation',
    catchphrase: 'Stay cool and think it through!',
    catchphraseTr: 'Sakin kal ve iyice düşün!',
  },
  {
    id: 'sam_squirrel',
    name: 'Sam Squirrel',
    nameTr: 'Sam Sincap',
    type: 'animal',
    emoji: '🐿️',
    color: '#E67E22',
    personality: 'energetic collector who saves words like treasures for winter',
    catchphrase: 'Store a word today, use it tomorrow!',
    catchphraseTr: 'Bugün bir kelime biriktir, yarın kullan!',
  },
  {
    id: 'leo_lion',
    name: 'Leo Lion',
    nameTr: 'Leo Aslan',
    type: 'animal',
    emoji: '🦁',
    color: '#F39C12',
    personality: 'brave and strong leader who encourages everyone to try their best',
    catchphrase: 'Roar with confidence!',
    catchphraseTr: 'Güvenle kükre!',
  },
  {
    id: 'rosie_rabbit',
    name: 'Rosie Rabbit',
    nameTr: 'Rosie Tavşan',
    type: 'animal',
    emoji: '🐰',
    color: '#FF6B9D',
    personality: 'quick learner who hops from one new word to the next with joy',
    catchphrase: 'One hop at a time gets you far!',
    catchphraseTr: 'Her seferinde bir sıçrayış seni uzağa götürür!',
  },
  {
    id: 'dino_dino',
    name: 'Dino',
    nameTr: 'Dino',
    type: 'magical',
    emoji: '🦕',
    color: '#2ECC71',
    personality: 'fun prehistoric friend who finds modern words delightfully puzzling',
    catchphrase: 'Even dinosaurs love learning new words!',
    catchphraseTr: 'Dinozorlar bile yeni kelime öğrenmeyi sever!',
  },
  {
    id: 'cosmo_robot',
    name: 'Cosmo',
    nameTr: 'Kozmo Robot',
    type: 'robot',
    emoji: '🤖',
    color: '#74B9FF',
    personality: 'curious robot from space who asks questions about every Earth word',
    catchphrase: 'Scanning… new word found! Processing joy!',
    catchphraseTr: 'Tarama yapılıyor… yeni kelime bulundu! Sevinç işleniyor!',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOCATIONS (14 total)
// ─────────────────────────────────────────────────────────────────────────────

export const STORY_LOCATIONS: StoryLocation[] = [
  {
    id: 'enchanted_forest',
    name: 'Enchanted Forest',
    nameTr: 'Büyülü Orman',
    type: 'forest',
    emoji: '🌲',
    bgGradient: ['#1B5E20', '#81C784'],
    elements: ['tall trees', 'glowing mushrooms', 'fireflies', 'a babbling brook', 'colorful flowers'],
    ambiance: 'A magical forest where trees whisper secrets, mushrooms glow in rainbow colors, and fireflies dance at dusk. The air smells of pine and magic.',
  },
  {
    id: 'coral_kingdom',
    name: 'Coral Kingdom',
    nameTr: 'Mercan Krallığı',
    type: 'ocean',
    emoji: '🪸',
    bgGradient: ['#006064', '#4DD0E1'],
    elements: ['colorful coral', 'tropical fish', 'sea turtles', 'waving seaweed', 'pearl oysters'],
    ambiance: 'An underwater paradise with towering coral castles, schools of rainbow-colored fish, and friendly sea creatures who love visitors.',
  },
  {
    id: 'snowy_peaks',
    name: 'Snowy Peaks',
    nameTr: 'Karlı Doruklar',
    type: 'mountain',
    emoji: '🏔️',
    bgGradient: ['#37474F', '#B0BEC5'],
    elements: ['snow-capped peaks', 'ice crystals', 'cozy cave', 'eagle nests', 'frozen waterfall'],
    ambiance: 'Majestic mountain peaks draped in snow, where eagles soar and ice crystals catch the sunlight like tiny rainbows.',
  },
  {
    id: 'star_station',
    name: 'Star Station',
    nameTr: 'Yıldız İstasyonu',
    type: 'space',
    emoji: '🚀',
    bgGradient: ['#0D0D2B', '#3F51B5'],
    elements: ['twinkling stars', 'colorful planets', 'rocket ships', 'floating asteroids', 'nebula clouds'],
    ambiance: 'A friendly space station floating among the stars, where astronaut animals and helpful robots explore the cosmos together.',
  },
  {
    id: 'sandy_oasis',
    name: 'Sandy Oasis',
    nameTr: 'Kumlu Vaha',
    type: 'desert',
    emoji: '🌴',
    bgGradient: ['#E65100', '#FFE0B2'],
    elements: ['swaying palm trees', 'cool blue pool', 'colorful market tents', 'sand dunes', 'desert flowers'],
    ambiance: 'A lush oasis in the golden desert, with cool refreshing water, tall palm trees, and a cheerful market full of bright colors and music.',
  },
  {
    id: 'rainbow_village',
    name: 'Rainbow Village',
    nameTr: 'Gökkuşağı Köyü',
    type: 'city',
    emoji: '🌈',
    bgGradient: ['#7B1FA2', '#E040FB'],
    elements: ['colorful houses', 'flower gardens', 'playground', 'rainbow bridge', 'friendly neighbors'],
    ambiance: 'A cheerful village where every house is a different color of the rainbow. Children laugh and play while neighbors share homemade treats.',
  },
  {
    id: 'mimis_treehouse',
    name: "Mimi's Treehouse",
    nameTr: "Mimi'nin Ağaç Evi",
    type: 'forest',
    emoji: '🏠',
    bgGradient: ['#2E7D32', '#A5D6A7'],
    elements: ['cozy treehouse', 'rope ladder', 'viewing telescope', 'book corner', 'fairy lights'],
    ambiance: "A warm and cozy treehouse high in a giant oak tree, filled with books, twinkling lights, and the best views of the enchanted forest.",
  },
  {
    id: 'crystal_cave',
    name: 'Crystal Cave',
    nameTr: 'Kristal Mağara',
    type: 'mountain',
    emoji: '💎',
    bgGradient: ['#311B92', '#9575CD'],
    elements: ['glowing crystals', 'underground lake', 'sparkling stalactites', 'hidden doorways', 'treasure chest'],
    ambiance: 'A hidden cave where crystals of every color light up the darkness, casting magical rainbows on the walls and ceiling.',
  },
  {
    id: 'sunny_farm',
    name: 'Sunny Farm',
    nameTr: 'Güneşli Çiftlik',
    type: 'farm',
    emoji: '🌻',
    bgGradient: ['#F9A825', '#FFFDE7'],
    elements: ['red barn', 'vegetable patch', 'apple orchard', 'friendly animals', 'windmill'],
    ambiance: 'A warm and busy farm with red barns, rows of vegetables, fruit trees, and friendly animals who all pitch in to help each other.',
  },
  {
    id: 'cloud_castle',
    name: 'Cloud Castle',
    nameTr: 'Bulut Kalesi',
    type: 'castle',
    emoji: '🏰',
    bgGradient: ['#1565C0', '#90CAF9'],
    elements: ['fluffy cloud towers', 'rainbow drawbridge', 'sky garden', 'wind chimes', 'friendly cloud giants'],
    ambiance: 'A magnificent castle made entirely of clouds, floating high above the world, where the wind sings and the sky is always a perfect blue.',
  },
  {
    id: 'flower_meadow',
    name: 'Flower Meadow',
    nameTr: 'Çiçek Çayırı',
    type: 'forest',
    emoji: '🌸',
    bgGradient: ['#AD1457', '#F8BBD0'],
    elements: ['wildflowers', 'buzzing bees', 'butterfly garden', 'sunny clearing', 'picnic blanket'],
    ambiance: 'A sunlit meadow filled with every kind of flower imaginable, where butterflies dance and bees hum their happy songs all day long.',
  },
  {
    id: 'deep_ocean',
    name: 'Deep Ocean City',
    nameTr: 'Derin Okyanus Şehri',
    type: 'ocean',
    emoji: '🐙',
    bgGradient: ['#0A237A', '#1565C0'],
    elements: ['glowing sea creatures', 'pearl towers', 'underwater market', 'whale song plaza', 'current highways'],
    ambiance: 'A bustling underwater city where octopuses run shops, mermaids deliver mail, and everyone travels by riding ocean currents.',
  },
  {
    id: 'galaxy_garden',
    name: 'Galaxy Garden',
    nameTr: 'Galaksi Bahçesi',
    type: 'space',
    emoji: '🌌',
    bgGradient: ['#1A0033', '#6A1B9A'],
    elements: ['floating flowers', 'star fruits', 'comet pathways', 'nebula swings', 'constellation statues'],
    ambiance: 'An impossibly beautiful garden floating in space, where flowers bloom in zero gravity, star fruits glow on crystal trees, and comets leave glittering trails.',
  },
  {
    id: 'ancient_castle',
    name: 'Ancient Castle',
    nameTr: 'Antik Kale',
    type: 'castle',
    emoji: '🏯',
    bgGradient: ['#4A148C', '#9C27B0'],
    elements: ['stone towers', 'secret passages', 'magic library', 'dragon roost', 'enchanted garden'],
    ambiance: 'An ancient stone castle full of mystery and wonder, with secret passages behind bookcases, a magical library, and a friendly dragon who lives in the east tower.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// THEMES (16 total)
// ─────────────────────────────────────────────────────────────────────────────

export const STORY_THEMES: StoryTheme[] = [
  {
    id: 'friendship',
    title: 'The Power of Friendship',
    titleTr: 'Dostluğun Gücü',
    moral: 'True friends help each other and make life more wonderful.',
    moralTr: 'Gerçek arkadaşlar birbirine yardım eder ve hayatı daha güzel kılar.',
    targetAge: [3, 7],
    vocabularyFocus: ['friend', 'together', 'help', 'share', 'play', 'kind'],
  },
  {
    id: 'sharing',
    title: 'Sharing is Caring',
    titleTr: 'Paylaşmak Sevgidir',
    moral: 'When we share, everyone becomes happier.',
    moralTr: 'Paylaşınca herkes daha mutlu olur.',
    targetAge: [3, 6],
    vocabularyFocus: ['share', 'give', 'receive', 'together', 'happy', 'more'],
  },
  {
    id: 'bravery',
    title: 'Being Brave',
    titleTr: 'Cesur Olmak',
    moral: 'Bravery is not about being fearless — it is doing it even when you are scared.',
    moralTr: 'Cesaret korkmamak değildir — korksan bile yapmaktır.',
    targetAge: [4, 8],
    vocabularyFocus: ['brave', 'scared', 'try', 'strong', 'courage', 'believe'],
  },
  {
    id: 'curiosity',
    title: 'The Curious Explorer',
    titleTr: 'Meraklı Kaşif',
    moral: 'Questions are the keys that open all doors.',
    moralTr: 'Sorular tüm kapıları açan anahtarlardır.',
    targetAge: [4, 9],
    vocabularyFocus: ['explore', 'discover', 'question', 'learn', 'find', 'wonder'],
  },
  {
    id: 'kindness_animals',
    title: 'Kindness to Animals',
    titleTr: 'Hayvanlara Şefkat',
    moral: 'Every creature deserves love and care.',
    moralTr: 'Her canlı sevgi ve ilgiyi hak eder.',
    targetAge: [3, 7],
    vocabularyFocus: ['animal', 'gentle', 'care', 'feed', 'protect', 'love'],
  },
  {
    id: 'first_day_school',
    title: 'First Day at School',
    titleTr: 'Okulun İlk Günü',
    moral: 'New beginnings can be scary, but they are always exciting.',
    moralTr: 'Yeni başlangıçlar korkutucu olabilir ama her zaman heyecan vericidir.',
    targetAge: [4, 7],
    vocabularyFocus: ['school', 'teacher', 'learn', 'new', 'friend', 'class'],
  },
  {
    id: 'lost_and_found',
    title: 'Lost and Found',
    titleTr: 'Kayıp ve Bulunan',
    moral: 'When we are lost, asking for help shows wisdom, not weakness.',
    moralTr: 'Kaybolduğumuzda yardım istemek zayıflık değil, akıllılıktır.',
    targetAge: [3, 8],
    vocabularyFocus: ['lost', 'find', 'ask', 'help', 'safe', 'home'],
  },
  {
    id: 'helping_others',
    title: 'Helping Others',
    titleTr: 'Başkalarına Yardım',
    moral: 'The best way to feel happy is to make someone else happy.',
    moralTr: 'Mutlu hissetmenin en iyi yolu başka birini mutlu etmektir.',
    targetAge: [3, 8],
    vocabularyFocus: ['help', 'need', 'give', 'work', 'together', 'smile'],
  },
  {
    id: 'being_different',
    title: 'Being Different is OK',
    titleTr: 'Farklı Olmak İyidir',
    moral: 'Our differences make the world a more colorful and beautiful place.',
    moralTr: 'Farklılıklarımız dünyayı daha renkli ve güzel bir yer yapar.',
    targetAge: [4, 9],
    vocabularyFocus: ['different', 'special', 'unique', 'color', 'beautiful', 'same'],
  },
  {
    id: 'overcoming_fear',
    title: 'Facing Your Fears',
    titleTr: 'Korkularınla Yüzleşmek',
    moral: 'Fears get smaller when you face them with a friend.',
    moralTr: 'Korkular bir arkadaşla karşı karşıya gelince küçülür.',
    targetAge: [4, 9],
    vocabularyFocus: ['fear', 'dark', 'try', 'safe', 'breathe', 'calm'],
  },
  {
    id: 'teamwork',
    title: 'Better Together',
    titleTr: 'Birlikte Daha İyi',
    moral: 'Together we can achieve things that are impossible alone.',
    moralTr: 'Birlikte, tek başına imkansız olan şeyleri başarabiliriz.',
    targetAge: [4, 10],
    vocabularyFocus: ['team', 'together', 'each', 'build', 'strong', 'goal'],
  },
  {
    id: 'patience',
    title: 'Good Things Take Time',
    titleTr: 'İyi Şeyler Zaman Alır',
    moral: 'Patience helps great things grow.',
    moralTr: 'Sabır, büyük şeylerin büyümesine yardımcı olur.',
    targetAge: [4, 8],
    vocabularyFocus: ['wait', 'grow', 'time', 'seed', 'slowly', 'ready'],
  },
  {
    id: 'honesty',
    title: 'Telling the Truth',
    titleTr: 'Doğruyu Söylemek',
    moral: 'Honesty keeps friendships strong and hearts light.',
    moralTr: 'Dürüstlük, arkadaşlıkları güçlü ve kalpleri hafif tutar.',
    targetAge: [4, 9],
    vocabularyFocus: ['true', 'honest', 'sorry', 'trust', 'right', 'wrong'],
  },
  {
    id: 'environment',
    title: 'Taking Care of Our Planet',
    titleTr: 'Gezegenimize Özen Göstermek',
    moral: 'Even small actions can make a big difference for our Earth.',
    moralTr: 'Küçük eylemler bile Dünyamız için büyük fark yaratabilir.',
    targetAge: [5, 10],
    vocabularyFocus: ['recycle', 'plant', 'clean', 'nature', 'water', 'tree'],
  },
  {
    id: 'creativity',
    title: 'The Magic of Imagination',
    titleTr: 'Hayal Gücünün Sihri',
    moral: 'Your imagination is the most powerful magic of all.',
    moralTr: 'Hayal gücün en güçlü sihirdir.',
    targetAge: [4, 10],
    vocabularyFocus: ['imagine', 'create', 'draw', 'dream', 'make', 'invent'],
  },
  {
    id: 'gratitude',
    title: 'Saying Thank You',
    titleTr: 'Teşekkür Etmek',
    moral: 'Gratitude turns what we have into enough, and more.',
    moralTr: 'Minnettarlık, sahip olduklarımızı yeterli ve daha fazlasına dönüştürür.',
    targetAge: [3, 8],
    vocabularyFocus: ['thank', 'grateful', 'happy', 'give', 'receive', 'kind'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOODS (9 total)
// ─────────────────────────────────────────────────────────────────────────────

export const STORY_MOODS: StoryMood[] = [
  { id: 'happy',      emoji: '😄', color: '#FFC107' },
  { id: 'mysterious', emoji: '🔮', color: '#7C4DFF' },
  { id: 'exciting',   emoji: '🎉', color: '#FF5722' },
  { id: 'calm',       emoji: '😌', color: '#4CAF50' },
  { id: 'silly',      emoji: '🤪', color: '#E91E63' },
  { id: 'magical',    emoji: '✨', color: '#9C27B0' },
  { id: 'brave',      emoji: '🦁', color: '#F44336' },
  { id: 'cozy',       emoji: '🌙', color: '#3F51B5' },
  { id: 'adventurous',emoji: '🌟', color: '#FF9800' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SOUND EFFECTS (18 total)
// ─────────────────────────────────────────────────────────────────────────────

export const STORY_SOUND_EFFECTS: StorySoundEffect[] = [
  { id: 'birds',    name: 'Birds Chirping',    emoji: '🐦' },
  { id: 'splash',   name: 'Water Splash',      emoji: '💧' },
  { id: 'wind',     name: 'Wind Blowing',      emoji: '💨' },
  { id: 'sparkle',  name: 'Magic Sparkle',     emoji: '✨' },
  { id: 'thunder',  name: 'Thunder Rumble',    emoji: '⛈️' },
  { id: 'waves',    name: 'Ocean Waves',       emoji: '🌊' },
  { id: 'crunch',   name: 'Leaves Crunching',  emoji: '🍂' },
  { id: 'bells',    name: 'Bells Ringing',     emoji: '🔔' },
  { id: 'roar',     name: 'Animal Roar',       emoji: '🦁' },
  { id: 'beep',     name: 'Robot Beeping',     emoji: '🤖' },
  { id: 'rain',     name: 'Rain Falling',      emoji: '🌧️' },
  { id: 'trumpet',  name: 'Trumpet Fanfare',   emoji: '🎺' },
  { id: 'giggle',   name: 'Happy Giggling',    emoji: '😄' },
  { id: 'whoosh',   name: 'Flying Whoosh',     emoji: '🚀' },
  { id: 'chime',    name: 'Wind Chime',        emoji: '🎐' },
  { id: 'drums',    name: 'Jungle Drums',      emoji: '🥁' },
  { id: 'harp',     name: 'Magical Harp',      emoji: '🎵' },
  { id: 'crickets', name: 'Night Crickets',    emoji: '🌙' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STORY TEMPLATE (assembled collection)
// ─────────────────────────────────────────────────────────────────────────────

export const STORY_TEMPLATE: StoryTemplate = {
  characters: STORY_CHARACTERS,
  locations: STORY_LOCATIONS,
  themes: STORY_THEMES,
  moods: STORY_MOODS,
  soundEffects: STORY_SOUND_EFFECTS,
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Get characters suitable for a target age range */
export function getCharactersForAge(minAge: number, maxAge: number): StoryCharacter[] {
  // All characters work for all ages — this is intentional
  void minAge; void maxAge;
  return STORY_CHARACTERS;
}

/** Get themes suitable for a target age range */
export function getThemesForAge(minAge: number, maxAge: number): StoryTheme[] {
  return STORY_THEMES.filter(
    t => t.targetAge[0] <= maxAge && t.targetAge[1] >= minAge
  );
}

/** Get characters by type */
export function getCharactersByType(type: StoryCharacter['type']): StoryCharacter[] {
  return STORY_CHARACTERS.filter(c => c.type === type);
}

/** Get locations by type */
export function getLocationsByType(type: StoryLocation['type']): StoryLocation[] {
  return STORY_LOCATIONS.filter(l => l.type === type);
}

/** Get a random selection of N characters */
export function getRandomCharacters(count: number): StoryCharacter[] {
  const shuffled = [...STORY_CHARACTERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** Get a random location */
export function getRandomLocation(): StoryLocation {
  return STORY_LOCATIONS[Math.floor(Math.random() * STORY_LOCATIONS.length)];
}

/** Get a random theme for a given age */
export function getRandomThemeForAge(age: number): StoryTheme {
  const suitable = getThemesForAge(age, age);
  if (suitable.length === 0) return STORY_THEMES[0];
  return suitable[Math.floor(Math.random() * suitable.length)];
}
