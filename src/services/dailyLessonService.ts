/**
 * DAILY LESSON SERVICE
 * MinesMinis — structured "I do, We do, You do" 8-phase learning flow
 *
 * Picks 5 new words from THEMED GROUPS (animals, colors, family, food…)
 * and 3 review words (spaced-repetition due today).
 */

import { getDueWords, updateWordProgress, loadAllProgress } from '../data/spacedRepetition';
import { ALL_SOUNDS } from '../data/phonics';
import {
  curriculumWords,
  getWordsByCategoryAndLevel,
  getNextTheme,
  getGrammarPatternsByLevel,
  THEME_ORDER,
  type CurriculumWord,
} from '../data/curriculumWords';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KidsWord {
  word: string;
  turkish: string;
  emoji: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  exampleSentence: string;
  exampleSentenceTr: string;
  phonicsGroup?: number;
}

export interface DailyLessonPlan {
  date: string;         // YYYY-MM-DD
  newWords: KidsWord[];
  reviewWords: KidsWord[];
  themeName: string;    // e.g. "Animals", "Colors"
  grammarPattern: GrammarPattern;
  phrasePair: { english: string; turkish: string }; // for comprehension
  completed: boolean;
  score: number;        // 0-100
}

export interface GrammarPattern {
  pattern: string;      // e.g. "I am..."
  patternTr: string;    // Turkish explanation
  examples: Array<{ sentence: string; sentenceTr: string }>;
  blankTemplate: string; // e.g. "I am ___" — kid fills in blank
  blankChoices: string[];
  blankAnswer: string;
}

// ─── Themed Word Groups ────────────────────────────────────────────────────────

export interface ThemeGroup {
  name: string;
  nameTr: string;
  emoji: string;
  words: KidsWord[];
}

export const THEMED_WORD_GROUPS: ThemeGroup[] = [
  {
    name: 'Animals',
    nameTr: 'Hayvanlar',
    emoji: '🐾',
    words: [
      { word: 'cat',  turkish: 'kedi',    emoji: '🐱', category: 'Animals', level: 'beginner', exampleSentence: 'The cat is on the mat.',      exampleSentenceTr: 'Kedi paspasın üzerinde.' },
      { word: 'dog',  turkish: 'köpek',   emoji: '🐶', category: 'Animals', level: 'beginner', exampleSentence: 'The dog runs fast.',           exampleSentenceTr: 'Köpek hızlı koşuyor.' },
      { word: 'bird', turkish: 'kuş',     emoji: '🐦', category: 'Animals', level: 'beginner', exampleSentence: 'A bird sings in the tree.',    exampleSentenceTr: 'Ağaçta bir kuş şarkı söylüyor.' },
      { word: 'fish', turkish: 'balık',   emoji: '🐟', category: 'Animals', level: 'beginner', exampleSentence: 'The fish swims in water.',     exampleSentenceTr: 'Balık suda yüzüyor.' },
      { word: 'frog', turkish: 'kurbağa', emoji: '🐸', category: 'Animals', level: 'beginner', exampleSentence: 'A frog jumps high.',           exampleSentenceTr: 'Bir kurbağa yüksek zıplıyor.' },
      { word: 'duck', turkish: 'ördek',   emoji: '🦆', category: 'Animals', level: 'beginner', exampleSentence: 'The duck swims on the lake.',  exampleSentenceTr: 'Ördek gölde yüzüyor.' },
      { word: 'cow',  turkish: 'inek',    emoji: '🐄', category: 'Animals', level: 'beginner', exampleSentence: 'A cow eats grass.',            exampleSentenceTr: 'İnek çimen yer.' },
      { word: 'pig',  turkish: 'domuz',   emoji: '🐷', category: 'Animals', level: 'beginner', exampleSentence: 'The pig is pink.',             exampleSentenceTr: 'Domuz pembe renkte.' },
      { word: 'hen',  turkish: 'tavuk',   emoji: '🐔', category: 'Animals', level: 'beginner', exampleSentence: 'The hen lays an egg.',         exampleSentenceTr: 'Tavuk yumurta yumurtluyor.' },
      { word: 'fox',  turkish: 'tilki',   emoji: '🦊', category: 'Animals', level: 'beginner', exampleSentence: 'The fox is clever.',           exampleSentenceTr: 'Tilki zekidir.' },
    ],
  },
  {
    name: 'Colors',
    nameTr: 'Renkler',
    emoji: '🎨',
    words: [
      { word: 'red',    turkish: 'kırmızı', emoji: '🔴', category: 'Colors', level: 'beginner', exampleSentence: 'The apple is red.',          exampleSentenceTr: 'Elma kırmızı.' },
      { word: 'blue',   turkish: 'mavi',    emoji: '🔵', category: 'Colors', level: 'beginner', exampleSentence: 'The sky is blue.',           exampleSentenceTr: 'Gökyüzü mavi.' },
      { word: 'green',  turkish: 'yeşil',   emoji: '🟢', category: 'Colors', level: 'beginner', exampleSentence: 'The frog is green.',         exampleSentenceTr: 'Kurbağa yeşil.' },
      { word: 'yellow', turkish: 'sarı',    emoji: '🟡', category: 'Colors', level: 'beginner', exampleSentence: 'The sun is yellow.',         exampleSentenceTr: 'Güneş sarı.' },
      { word: 'pink',   turkish: 'pembe',   emoji: '🩷', category: 'Colors', level: 'beginner', exampleSentence: 'The flower is pink.',        exampleSentenceTr: 'Çiçek pembe.' },
      { word: 'black',  turkish: 'siyah',   emoji: '⚫', category: 'Colors', level: 'beginner', exampleSentence: 'The cat is black.',          exampleSentenceTr: 'Kedi siyah.' },
      { word: 'white',  turkish: 'beyaz',   emoji: '⚪', category: 'Colors', level: 'beginner', exampleSentence: 'Snow is white.',             exampleSentenceTr: 'Kar beyaz.' },
      { word: 'orange', turkish: 'turuncu', emoji: '🟠', category: 'Colors', level: 'beginner', exampleSentence: 'The carrot is orange.',      exampleSentenceTr: 'Havuç turuncu.' },
      { word: 'purple', turkish: 'mor',     emoji: '🟣', category: 'Colors', level: 'beginner', exampleSentence: 'The grapes are purple.',     exampleSentenceTr: 'Üzümler mor.' },
      { word: 'brown',  turkish: 'kahverengi', emoji: '🟤', category: 'Colors', level: 'beginner', exampleSentence: 'The dog is brown.',     exampleSentenceTr: 'Köpek kahverengi.' },
    ],
  },
  {
    name: 'Family',
    nameTr: 'Aile',
    emoji: '👨‍👩‍👧‍👦',
    words: [
      { word: 'mom',     turkish: 'anne',   emoji: '👩', category: 'Family', level: 'beginner', exampleSentence: 'My mom is kind.',           exampleSentenceTr: 'Annem nazik.' },
      { word: 'dad',     turkish: 'baba',   emoji: '👨', category: 'Family', level: 'beginner', exampleSentence: 'My dad is tall.',           exampleSentenceTr: 'Babam uzun boylu.' },
      { word: 'sister',  turkish: 'kız kardeş', emoji: '👧', category: 'Family', level: 'beginner', exampleSentence: 'My sister is happy.', exampleSentenceTr: 'Kız kardeşim mutlu.' },
      { word: 'brother', turkish: 'erkek kardeş', emoji: '👦', category: 'Family', level: 'beginner', exampleSentence: 'My brother is small.', exampleSentenceTr: 'Erkek kardeşim küçük.' },
      { word: 'baby',    turkish: 'bebek',  emoji: '👶', category: 'Family', level: 'beginner', exampleSentence: 'The baby is cute.',         exampleSentenceTr: 'Bebek tatlı.' },
      { word: 'grandma', turkish: 'büyükannem', emoji: '👵', category: 'Family', level: 'beginner', exampleSentence: 'Grandma bakes bread.', exampleSentenceTr: 'Büyükannem ekmek pişirir.' },
      { word: 'grandpa', turkish: 'büyükbabam', emoji: '👴', category: 'Family', level: 'beginner', exampleSentence: 'Grandpa reads books.', exampleSentenceTr: 'Büyükbabam kitap okur.' },
      { word: 'aunt',    turkish: 'teyze',  emoji: '👩‍🦱', category: 'Family', level: 'beginner', exampleSentence: 'My aunt is funny.',    exampleSentenceTr: 'Teyzemin şakası iyidir.' },
      { word: 'uncle',   turkish: 'amca',   emoji: '👨‍🦱', category: 'Family', level: 'beginner', exampleSentence: 'My uncle drives a car.', exampleSentenceTr: 'Amcam araba kullanır.' },
      { word: 'family',  turkish: 'aile',   emoji: '👨‍👩‍👧‍👦', category: 'Family', level: 'beginner', exampleSentence: 'My family is big.', exampleSentenceTr: 'Ailem büyük.' },
    ],
  },
  {
    name: 'Food',
    nameTr: 'Yiyecekler',
    emoji: '🍎',
    words: [
      { word: 'apple', turkish: 'elma',    emoji: '🍎', category: 'Food', level: 'beginner', exampleSentence: 'I eat an apple.',          exampleSentenceTr: 'Ben elma yerim.' },
      { word: 'bread', turkish: 'ekmek',   emoji: '🍞', category: 'Food', level: 'beginner', exampleSentence: 'I like bread.',            exampleSentenceTr: 'Ekmeği severim.' },
      { word: 'milk',  turkish: 'süt',     emoji: '🥛', category: 'Food', level: 'beginner', exampleSentence: 'Milk is white.',           exampleSentenceTr: 'Süt beyaz.' },
      { word: 'water', turkish: 'su',      emoji: '💧', category: 'Food', level: 'beginner', exampleSentence: 'I drink water.',           exampleSentenceTr: 'Ben su içerim.' },
      { word: 'egg',   turkish: 'yumurta', emoji: '🥚', category: 'Food', level: 'beginner', exampleSentence: 'An egg is round.',         exampleSentenceTr: 'Yumurta yuvarlak.' },
      { word: 'cake',  turkish: 'pasta',   emoji: '🎂', category: 'Food', level: 'beginner', exampleSentence: 'The cake is sweet.',       exampleSentenceTr: 'Pasta tatlı.' },
      { word: 'rice',  turkish: 'pirinç',  emoji: '🍚', category: 'Food', level: 'beginner', exampleSentence: 'I eat rice for lunch.',    exampleSentenceTr: 'Öğle yemeğinde pirinç yerim.' },
      { word: 'soup',  turkish: 'çorba',   emoji: '🍜', category: 'Food', level: 'beginner', exampleSentence: 'The soup is hot.',         exampleSentenceTr: 'Çorba sıcak.' },
      { word: 'fish',  turkish: 'balık',   emoji: '🐟', category: 'Food', level: 'beginner', exampleSentence: 'Fish is healthy.',         exampleSentenceTr: 'Balık sağlıklıdır.' },
      { word: 'pizza', turkish: 'pizza',   emoji: '🍕', category: 'Food', level: 'beginner', exampleSentence: 'Pizza is delicious!',      exampleSentenceTr: 'Pizza lezzetli!' },
    ],
  },
  {
    name: 'Body',
    nameTr: 'Vücut',
    emoji: '🧍',
    words: [
      { word: 'eye',   turkish: 'göz',     emoji: '👁️', category: 'Body', level: 'beginner', exampleSentence: 'I see with my eyes.',      exampleSentenceTr: 'Gözlerimle görürüm.' },
      { word: 'nose',  turkish: 'burun',   emoji: '👃', category: 'Body', level: 'beginner', exampleSentence: 'My nose is small.',        exampleSentenceTr: 'Burnum küçük.' },
      { word: 'ear',   turkish: 'kulak',   emoji: '👂', category: 'Body', level: 'beginner', exampleSentence: 'I hear with my ears.',     exampleSentenceTr: 'Kulaklarımla işitirim.' },
      { word: 'hand',  turkish: 'el',      emoji: '✋', category: 'Body', level: 'beginner', exampleSentence: 'I wave my hand.',          exampleSentenceTr: 'Elimi sallıyorum.' },
      { word: 'foot',  turkish: 'ayak',    emoji: '🦶', category: 'Body', level: 'beginner', exampleSentence: 'I walk on my feet.',       exampleSentenceTr: 'Ayaklarımla yürürüm.' },
      { word: 'head',  turkish: 'baş',     emoji: '🗣️', category: 'Body', level: 'beginner', exampleSentence: 'My head is on top.',       exampleSentenceTr: 'Başım en üstte.' },
      { word: 'mouth', turkish: 'ağız',    emoji: '👄', category: 'Body', level: 'beginner', exampleSentence: 'I eat with my mouth.',     exampleSentenceTr: 'Ağzımla yerim.' },
      { word: 'arm',   turkish: 'kol',     emoji: '💪', category: 'Body', level: 'beginner', exampleSentence: 'My arm is strong.',        exampleSentenceTr: 'Kolum güçlü.' },
      { word: 'leg',   turkish: 'bacak',   emoji: '🦵', category: 'Body', level: 'beginner', exampleSentence: 'I run with my legs.',      exampleSentenceTr: 'Bacaklarımla koşarım.' },
      { word: 'hair',  turkish: 'saç',     emoji: '💇', category: 'Body', level: 'beginner', exampleSentence: 'My hair is long.',         exampleSentenceTr: 'Saçım uzun.' },
    ],
  },
  {
    name: 'Clothes',
    nameTr: 'Kıyafetler',
    emoji: '👕',
    words: [
      { word: 'hat',    turkish: 'şapka',   emoji: '🎩', category: 'Clothes', level: 'beginner', exampleSentence: 'I wear a hat.',         exampleSentenceTr: 'Şapka takıyorum.' },
      { word: 'shirt',  turkish: 'gömlek',  emoji: '👕', category: 'Clothes', level: 'beginner', exampleSentence: 'My shirt is blue.',     exampleSentenceTr: 'Gömleğim mavi.' },
      { word: 'shoes',  turkish: 'ayakkabı', emoji: '👟', category: 'Clothes', level: 'beginner', exampleSentence: 'My shoes are red.',    exampleSentenceTr: 'Ayakkabılarım kırmızı.' },
      { word: 'dress',  turkish: 'elbise',  emoji: '👗', category: 'Clothes', level: 'beginner', exampleSentence: 'The dress is pretty.', exampleSentenceTr: 'Elbise çok güzel.' },
      { word: 'coat',   turkish: 'palto',   emoji: '🧥', category: 'Clothes', level: 'beginner', exampleSentence: 'It is cold — wear a coat.', exampleSentenceTr: 'Hava soğuk — palto giy.' },
      { word: 'socks',  turkish: 'çorap',   emoji: '🧦', category: 'Clothes', level: 'beginner', exampleSentence: 'My socks are white.',   exampleSentenceTr: 'Çoraplarım beyaz.' },
      { word: 'bag',    turkish: 'çanta',   emoji: '🎒', category: 'Clothes', level: 'beginner', exampleSentence: 'My bag is heavy.',      exampleSentenceTr: 'Çantam ağır.' },
      { word: 'pants',  turkish: 'pantolon', emoji: '👖', category: 'Clothes', level: 'beginner', exampleSentence: 'My pants are black.',  exampleSentenceTr: 'Pantolonun siyah.' },
      { word: 'gloves', turkish: 'eldiven', emoji: '🧤', category: 'Clothes', level: 'beginner', exampleSentence: 'Gloves keep my hands warm.', exampleSentenceTr: 'Eldiven ellerimi ısıtıyor.' },
      { word: 'scarf',  turkish: 'atkı',    emoji: '🧣', category: 'Clothes', level: 'beginner', exampleSentence: 'My scarf is cozy.',     exampleSentenceTr: 'Atkım çok sıcak.' },
    ],
  },
  {
    name: 'School',
    nameTr: 'Okul',
    emoji: '🏫',
    words: [
      { word: 'pen',    turkish: 'kalem',   emoji: '✏️', category: 'School', level: 'beginner', exampleSentence: 'I write with a pen.',    exampleSentenceTr: 'Kalemle yazıyorum.' },
      { word: 'book',   turkish: 'kitap',   emoji: '📚', category: 'School', level: 'beginner', exampleSentence: 'I read the book.',       exampleSentenceTr: 'Kitabı okuyorum.' },
      { word: 'desk',   turkish: 'sıra',    emoji: '🪑', category: 'School', level: 'beginner', exampleSentence: 'I sit at my desk.',      exampleSentenceTr: 'Sıramda oturuyorum.' },
      { word: 'class',  turkish: 'sınıf',   emoji: '🏫', category: 'School', level: 'beginner', exampleSentence: 'My class is fun.',       exampleSentenceTr: 'Sınıfım eğlenceli.' },
      { word: 'board',  turkish: 'tahta',   emoji: '🖊️', category: 'School', level: 'beginner', exampleSentence: 'Write on the board.',    exampleSentenceTr: 'Tahtaya yaz.' },
      { word: 'ruler',  turkish: 'cetvel',  emoji: '📏', category: 'School', level: 'beginner', exampleSentence: 'I use a ruler.',         exampleSentenceTr: 'Cetvel kullanıyorum.' },
      { word: 'eraser', turkish: 'silgi',   emoji: '📦', category: 'School', level: 'beginner', exampleSentence: 'I need an eraser.',      exampleSentenceTr: 'Silgiye ihtiyacım var.' },
      { word: 'map',    turkish: 'harita',  emoji: '🗺️', category: 'School', level: 'beginner', exampleSentence: 'Look at the map.',       exampleSentenceTr: 'Haritaya bak.' },
      { word: 'chair',  turkish: 'sandalye', emoji: '🪑', category: 'School', level: 'beginner', exampleSentence: 'Sit on the chair.',     exampleSentenceTr: 'Sandalyeye otur.' },
      { word: 'paint',  turkish: 'boya',    emoji: '🎨', category: 'School', level: 'beginner', exampleSentence: 'I like to paint.',       exampleSentenceTr: 'Boyamayı seviyorum.' },
    ],
  },
  {
    name: 'Home',
    nameTr: 'Ev',
    emoji: '🏠',
    words: [
      { word: 'bed',    turkish: 'yatak',   emoji: '🛏️', category: 'Home', level: 'beginner', exampleSentence: 'I sleep in my bed.',      exampleSentenceTr: 'Yatağımda uyuyorum.' },
      { word: 'door',   turkish: 'kapı',    emoji: '🚪', category: 'Home', level: 'beginner', exampleSentence: 'Open the door.',          exampleSentenceTr: 'Kapıyı aç.' },
      { word: 'window', turkish: 'pencere', emoji: '🪟', category: 'Home', level: 'beginner', exampleSentence: 'The window is open.',     exampleSentenceTr: 'Pencere açık.' },
      { word: 'table',  turkish: 'masa',    emoji: '🪑', category: 'Home', level: 'beginner', exampleSentence: 'Put it on the table.',    exampleSentenceTr: 'Masanın üstüne koy.' },
      { word: 'cup',    turkish: 'fincan',  emoji: '☕', category: 'Home', level: 'beginner', exampleSentence: 'The cup is full.',        exampleSentenceTr: 'Fincan dolu.' },
      { word: 'lamp',   turkish: 'lamba',   emoji: '💡', category: 'Home', level: 'beginner', exampleSentence: 'Turn on the lamp.',       exampleSentenceTr: 'Lambayı aç.' },
      { word: 'box',    turkish: 'kutu',    emoji: '📦', category: 'Home', level: 'beginner', exampleSentence: 'The box is big.',         exampleSentenceTr: 'Kutu büyük.' },
      { word: 'clock',  turkish: 'saat',    emoji: '🕐', category: 'Home', level: 'beginner', exampleSentence: 'Look at the clock.',      exampleSentenceTr: 'Saate bak.' },
      { word: 'floor',  turkish: 'zemin',   emoji: '🏠', category: 'Home', level: 'beginner', exampleSentence: 'Sit on the floor.',       exampleSentenceTr: 'Zemine otur.' },
      { word: 'wall',   turkish: 'duvar',   emoji: '🧱', category: 'Home', level: 'beginner', exampleSentence: 'The wall is white.',      exampleSentenceTr: 'Duvar beyaz.' },
    ],
  },
  {
    name: 'Nature',
    nameTr: 'Doğa',
    emoji: '🌿',
    words: [
      { word: 'sun',   turkish: 'güneş',  emoji: '☀️', category: 'Nature', level: 'beginner', exampleSentence: 'The sun is bright.',       exampleSentenceTr: 'Güneş parlak.' },
      { word: 'rain',  turkish: 'yağmur', emoji: '🌧️', category: 'Nature', level: 'beginner', exampleSentence: 'The rain is cold.',        exampleSentenceTr: 'Yağmur soğuk.' },
      { word: 'tree',  turkish: 'ağaç',   emoji: '🌳', category: 'Nature', level: 'beginner', exampleSentence: 'The tree is tall.',        exampleSentenceTr: 'Ağaç uzun.' },
      { word: 'flower',turkish: 'çiçek',  emoji: '🌸', category: 'Nature', level: 'beginner', exampleSentence: 'The flower is pretty.',    exampleSentenceTr: 'Çiçek güzel.' },
      { word: 'sky',   turkish: 'gökyüzü',emoji: '🌤️', category: 'Nature', level: 'beginner', exampleSentence: 'The sky is blue.',         exampleSentenceTr: 'Gökyüzü mavi.' },
      { word: 'cloud', turkish: 'bulut',  emoji: '☁️', category: 'Nature', level: 'beginner', exampleSentence: 'A cloud is white.',        exampleSentenceTr: 'Bulut beyaz.' },
      { word: 'wind',  turkish: 'rüzgar', emoji: '🌬️', category: 'Nature', level: 'beginner', exampleSentence: 'The wind is strong.',      exampleSentenceTr: 'Rüzgar kuvvetli.' },
      { word: 'snow',  turkish: 'kar',    emoji: '❄️', category: 'Nature', level: 'beginner', exampleSentence: 'Snow is cold and white.',  exampleSentenceTr: 'Kar soğuk ve beyaz.' },
      { word: 'rock',  turkish: 'taş',    emoji: '🪨', category: 'Nature', level: 'beginner', exampleSentence: 'The rock is heavy.',       exampleSentenceTr: 'Taş ağır.' },
      { word: 'leaf',  turkish: 'yaprak', emoji: '🍃', category: 'Nature', level: 'beginner', exampleSentence: 'A green leaf falls.',      exampleSentenceTr: 'Yeşil bir yaprak düşüyor.' },
    ],
  },
  {
    name: 'Actions',
    nameTr: 'Eylemler',
    emoji: '🏃',
    words: [
      { word: 'run',   turkish: 'koşmak', emoji: '🏃', category: 'Actions', level: 'beginner', exampleSentence: 'I run every day.',        exampleSentenceTr: 'Her gün koşarım.' },
      { word: 'jump',  turkish: 'zıplamak',emoji: '⬆️', category: 'Actions', level: 'beginner', exampleSentence: 'I can jump high.',       exampleSentenceTr: 'Yüksek zıplayabilirim.' },
      { word: 'swim',  turkish: 'yüzmek', emoji: '🏊', category: 'Actions', level: 'beginner', exampleSentence: 'I swim in the sea.',      exampleSentenceTr: 'Denizde yüzüyorum.' },
      { word: 'eat',   turkish: 'yemek',  emoji: '🍽️', category: 'Actions', level: 'beginner', exampleSentence: 'I eat breakfast.',        exampleSentenceTr: 'Kahvaltı ediyorum.' },
      { word: 'sleep', turkish: 'uyumak', emoji: '😴', category: 'Actions', level: 'beginner', exampleSentence: 'I sleep at night.',       exampleSentenceTr: 'Geceleri uyurum.' },
      { word: 'read',  turkish: 'okumak', emoji: '📖', category: 'Actions', level: 'beginner', exampleSentence: 'I read a book.',          exampleSentenceTr: 'Kitap okuyorum.' },
      { word: 'draw',  turkish: 'çizmek', emoji: '✏️', category: 'Actions', level: 'beginner', exampleSentence: 'I draw a cat.',           exampleSentenceTr: 'Kedi çiziyorum.' },
      { word: 'play',  turkish: 'oynamak',emoji: '🎮', category: 'Actions', level: 'beginner', exampleSentence: 'I play with my dog.',     exampleSentenceTr: 'Köpeğimle oynuyorum.' },
      { word: 'sing',  turkish: 'şarkı söylemek', emoji: '🎵', category: 'Actions', level: 'beginner', exampleSentence: 'I sing a song.', exampleSentenceTr: 'Şarkı söylüyorum.' },
      { word: 'dance', turkish: 'dans etmek', emoji: '💃', category: 'Actions', level: 'beginner', exampleSentence: 'I love to dance.',    exampleSentenceTr: 'Dans etmeyi seviyorum.' },
    ],
  },
];

// Flat list of all themed words (for compatibility with spaced-rep system)
export const allThemedWords: KidsWord[] = THEMED_WORD_GROUPS.flatMap((g) => g.words);

// ─── Grammar Patterns (30 rotating) ─────────────────────────────────────────

export const GRAMMAR_PATTERNS: GrammarPattern[] = [
  {
    pattern: 'I am...',
    patternTr: '"Ben ...im/yim" — kendin hakkında konuş',
    examples: [
      { sentence: 'I am happy.', sentenceTr: 'Ben mutluyum.' },
      { sentence: 'I am a student.', sentenceTr: 'Ben bir öğrenciyim.' },
    ],
    blankTemplate: 'I am ___.',
    blankChoices: ['happy', 'sad', 'big', 'small'],
    blankAnswer: 'happy',
  },
  {
    pattern: 'This is a...',
    patternTr: '"Bu bir ..." — bir şeyi göster',
    examples: [
      { sentence: 'This is a cat.', sentenceTr: 'Bu bir kedi.' },
      { sentence: 'This is a dog.', sentenceTr: 'Bu bir köpek.' },
    ],
    blankTemplate: 'This is a ___.',
    blankChoices: ['cat', 'bird', 'flower', 'table'],
    blankAnswer: 'cat',
  },
  {
    pattern: 'I like...',
    patternTr: '"Ben ...i severim" — sevdiklerini söyle',
    examples: [
      { sentence: 'I like apples.', sentenceTr: 'Elma severim.' },
      { sentence: 'I like milk.', sentenceTr: 'Süt severim.' },
    ],
    blankTemplate: 'I like ___.',
    blankChoices: ['cats', 'rain', 'school', 'music'],
    blankAnswer: 'cats',
  },
  {
    pattern: 'The ___ is ___.',
    patternTr: '"The ... ...dır" — bir şeyi tanımla',
    examples: [
      { sentence: 'The cat is big.', sentenceTr: 'Kedi büyük.' },
      { sentence: 'The sky is blue.', sentenceTr: 'Gökyüzü mavi.' },
    ],
    blankTemplate: 'The dog is ___.',
    blankChoices: ['big', 'small', 'blue', 'fast'],
    blankAnswer: 'big',
  },
  {
    pattern: 'I can...',
    patternTr: '"Ben ...ebilirim" — yeteneklerini anlat',
    examples: [
      { sentence: 'I can swim.', sentenceTr: 'Yüzebilirim.' },
      { sentence: 'I can jump.', sentenceTr: 'Zıplayabilirim.' },
    ],
    blankTemplate: 'I can ___.',
    blankChoices: ['swim', 'eat', 'sleep', 'walk'],
    blankAnswer: 'swim',
  },
  {
    pattern: 'I have a...',
    patternTr: '"Benim bir ...im var" — sahip olduklarını anlat',
    examples: [
      { sentence: 'I have a cat.', sentenceTr: 'Bir kedim var.' },
      { sentence: 'I have a book.', sentenceTr: 'Bir kitabım var.' },
    ],
    blankTemplate: 'I have a ___.',
    blankChoices: ['dog', 'hat', 'bed', 'door'],
    blankAnswer: 'dog',
  },
  {
    pattern: 'It is...',
    patternTr: '"O ...dır" — bir şeyi tanımla',
    examples: [
      { sentence: 'It is red.', sentenceTr: 'O kırmızı.' },
      { sentence: 'It is big.', sentenceTr: 'O büyük.' },
    ],
    blankTemplate: 'It is ___.',
    blankChoices: ['red', 'cold', 'fast', 'small'],
    blankAnswer: 'red',
  },
  {
    pattern: 'I see a...',
    patternTr: '"Bir ... görüyorum" — ne gördüğünü söyle',
    examples: [
      { sentence: 'I see a bird.', sentenceTr: 'Bir kuş görüyorum.' },
      { sentence: 'I see a tree.', sentenceTr: 'Bir ağaç görüyorum.' },
    ],
    blankTemplate: 'I see a ___.',
    blankChoices: ['dog', 'cloud', 'fish', 'hat'],
    blankAnswer: 'dog',
  },
  {
    pattern: 'Where is the...?',
    patternTr: '"... nerede?" — bir şeyin yerini sor',
    examples: [
      { sentence: 'Where is the cat?', sentenceTr: 'Kedi nerede?' },
      { sentence: 'Where is my book?', sentenceTr: 'Kitabım nerede?' },
    ],
    blankTemplate: 'Where is the ___?',
    blankChoices: ['dog', 'ball', 'bed', 'door'],
    blankAnswer: 'dog',
  },
  {
    pattern: 'My ___ is ___.',
    patternTr: '"Benim ...im ...dır" — sahip olduğunu tanımla',
    examples: [
      { sentence: 'My cat is white.', sentenceTr: 'Kedim beyaz.' },
      { sentence: 'My bag is red.', sentenceTr: 'Çantam kırmızı.' },
    ],
    blankTemplate: 'My dog is ___.',
    blankChoices: ['big', 'pink', 'green', 'loud'],
    blankAnswer: 'big',
  },
];

// ─── Storage keys ─────────────────────────────────────────────────────────────

function dailyKey(userId: string, date: string): string {
  return `mm_daily_${userId}_${date}`;
}

function learnedKey(userId: string): string {
  return `mm_learned_${userId}`;
}

// ─── Learned word tracking ────────────────────────────────────────────────────

export function getLearnedWords(userId: string): string[] {
  try {
    const raw = localStorage.getItem(learnedKey(userId));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markWordLearned(userId: string, english: string): void {
  const learned = getLearnedWords(userId);
  if (!learned.includes(english)) {
    learned.push(english);
    try {
      localStorage.setItem(learnedKey(userId), JSON.stringify(learned));
    } catch {
      // storage full — ignore
    }
  }
}

// ─── Review word resolver ─────────────────────────────────────────────────────

function getDueReviewWords(limit: number): KidsWord[] {
  const due = getDueWords(limit * 3);
  const wordMap = new Map(allThemedWords.map((w) => [w.word.toLowerCase(), w]));
  return due
    .map((p) => wordMap.get(p.wordId.toLowerCase()))
    .filter((w): w is KidsWord => w !== undefined)
    .slice(0, limit);
}

// ─── Warm-up: yesterday's words ──────────────────────────────────────────────

export function getYesterdayWords(userId: string): KidsWord[] {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const key = dailyKey(userId, yesterday.toISOString().split('T')[0]);
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return [];
    const plan = JSON.parse(saved) as DailyLessonPlan;
    return plan.newWords.slice(0, 3);
  } catch {
    return [];
  }
}

// ─── Adaptive difficulty ──────────────────────────────────────────────────────

export function getAdaptiveWordCount(userId: string): number {
  const scores: number[] = [];
  for (let i = 1; i <= 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dailyKey(userId, d.toISOString().split('T')[0]);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const data = JSON.parse(saved) as DailyLessonPlan;
        if (data.score !== undefined) scores.push(data.score);
      } catch {
        // ignore
      }
    }
  }
  if (scores.length === 0) return 5;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (avg >= 90) return 7;
  if (avg >= 70) return 5;
  if (avg >= 50) return 4;
  return 3;
}

// ─── Theme selection ──────────────────────────────────────────────────────────

/**
 * Picks today's theme group based on date (cycles through all groups).
 * Deterministic per day so the same theme shows all day.
 */
function getTodayTheme(userId: string, date: string): ThemeGroup {
  // Seed with date + userId for stability
  const seed = date.replace(/-/g, '') + userId.slice(0, 4);
  const dayNum = parseInt(seed.slice(-6), 10) || 0;
  const idx = dayNum % THEMED_WORD_GROUPS.length;
  return THEMED_WORD_GROUPS[idx];
}

// ─── Grammar pattern for today ───────────────────────────────────────────────

function getTodayGrammarPattern(date: string): GrammarPattern {
  const dayNum = parseInt(date.replace(/-/g, ''), 10) % GRAMMAR_PATTERNS.length;
  return GRAMMAR_PATTERNS[dayNum % GRAMMAR_PATTERNS.length];
}

// ─── Comprehension phrase pairs ──────────────────────────────────────────────

const PHRASE_PAIRS: Array<{ english: string; turkish: string }> = [
  { english: 'The cat is black.', turkish: 'Kedi siyah.' },
  { english: 'I like red apples.', turkish: 'Kırmızı elmaları severim.' },
  { english: 'The dog runs fast.', turkish: 'Köpek hızlı koşuyor.' },
  { english: 'She has a blue bag.', turkish: 'Onun mavi bir çantası var.' },
  { english: 'The bird sings.', turkish: 'Kuş şarkı söylüyor.' },
  { english: 'My hand is small.', turkish: 'Elim küçük.' },
  { english: 'The sun is yellow.', turkish: 'Güneş sarı.' },
  { english: 'I eat an apple.', turkish: 'Bir elma yiyorum.' },
  { english: 'The frog is green.', turkish: 'Kurbağa yeşil.' },
  { english: 'She likes flowers.', turkish: 'Çiçekleri seviyor.' },
];

// ─── Curriculum level helpers ─────────────────────────────────────────────────

/** Get user's curriculum grade level (1-5). Defaults to 1. */
export function getCurriculumLevel(userId: string): 1 | 2 | 3 | 4 | 5 {
  try {
    const raw = localStorage.getItem(`mm_curriculum_level_${userId}`);
    if (!raw) return 1;
    const n = parseInt(raw, 10);
    if (n >= 1 && n <= 5) return n as 1 | 2 | 3 | 4 | 5;
  } catch {
    // ignore
  }
  return 1;
}

/** Set user's curriculum grade level */
export function setCurriculumLevel(userId: string, level: 1 | 2 | 3 | 4 | 5): void {
  try {
    localStorage.setItem(`mm_curriculum_level_${userId}`, String(level));
  } catch {
    // ignore
  }
}

/** Get the next incomplete curriculum theme for this user */
export function getNextCurriculumTheme(
  userId: string,
): { category: string; level: 1 | 2 | 3 | 4 | 5 } | null {
  const learned = getLearnedWords(userId);
  return getNextTheme(learned);
}

/** Get how many curriculum themes this user has completed */
export function getCompletedThemesCount(userId: string): number {
  const learned = getLearnedWords(userId);
  const learnedSet = new Set(learned.map((w) => w.toLowerCase()));
  return THEME_ORDER.filter(({ category, level }) => {
    const words = getWordsByCategoryAndLevel(category, level);
    return words.every((w) => learnedSet.has(w.english.toLowerCase()));
  }).length;
}

/**
 * Pick curriculum words for today from the next unfinished theme.
 * Respects user's level — only offers themes at or below the user's grade level.
 */
function getCurriculumWordsForToday(userId: string, count: number): CurriculumWord[] {
  const learned = getLearnedWords(userId);
  const learnedSet = new Set(learned.map((w) => w.toLowerCase()));
  const userLevel = getCurriculumLevel(userId);

  // Find the first theme at/below user's level that still has unlearned words
  for (const theme of THEME_ORDER) {
    if (theme.level > userLevel) continue;
    const words = getWordsByCategoryAndLevel(theme.category, theme.level);
    const unlearned = words.filter((w) => !learnedSet.has(w.english.toLowerCase()));
    if (unlearned.length > 0) {
      return unlearned.slice(0, count);
    }
  }

  // All themes at user's level done — advance level if possible
  if (userLevel < 5) {
    const nextLevel = (userLevel + 1) as 1 | 2 | 3 | 4 | 5;
    setCurriculumLevel(userId, nextLevel);
    const words = curriculumWords.filter((w) => w.level === nextLevel);
    return words.slice(0, count);
  }

  // Full completion — recycle level 1 basics
  return getWordsByCategoryAndLevel('Animals', 1).slice(0, count);
}

// ─── Core plan builder ────────────────────────────────────────────────────────

export function getTodayLesson(userId: string): DailyLessonPlan {
  const today = new Date().toISOString().split('T')[0];

  // Return saved plan if already built today
  try {
    const saved = localStorage.getItem(dailyKey(userId, today));
    if (saved) return JSON.parse(saved) as DailyLessonPlan;
  } catch {
    // ignore — build fresh
  }

  const wordCount = Math.min(getAdaptiveWordCount(userId), 5); // max 5 for themed groups

  // ─── Curriculum-driven word selection ───────────────────────────────────────
  // Use the structured curriculum as the primary word source.
  // Fall back to legacy themed groups if curriculum returns nothing.
  const curriculumNew = getCurriculumWordsForToday(userId, wordCount);

  let newWords: KidsWord[];
  let themeName: string;

  if (curriculumNew.length > 0) {
    // Map CurriculumWord → KidsWord for compatibility with existing UI
    newWords = curriculumNew.map((cw) => ({
      word: cw.english,
      turkish: cw.turkish,
      emoji: cw.emoji,
      category: cw.category,
      level: cw.level <= 2 ? ('beginner' as const) : cw.level <= 3 ? ('intermediate' as const) : ('advanced' as const),
      exampleSentence: cw.exampleEn,
      exampleSentenceTr: cw.exampleTr,
    }));
    themeName = curriculumNew[0].category;
  } else {
    // Legacy fallback
    const theme = getTodayTheme(userId, today);
    const learned = getLearnedWords(userId);
    let legacyWords = theme.words.filter((w) => !learned.includes(w.word.toLowerCase())).slice(0, wordCount);
    if (legacyWords.length < wordCount) legacyWords = theme.words.slice(0, wordCount);
    newWords = legacyWords;
    themeName = theme.name;
  }

  const reviewWords = getDueReviewWords(3);

  // Pick grammar pattern from new curriculum if available, else legacy
  const userLevel = getCurriculumLevel(userId);
  const curriculumPatterns = getGrammarPatternsByLevel(userLevel);
  const dayNum = parseInt(today.replace(/-/g, '').slice(-4), 10);
  const grammarPattern: GrammarPattern = curriculumPatterns.length > 0
    ? (() => {
        const cp = curriculumPatterns[dayNum % curriculumPatterns.length];
        return {
          pattern: cp.pattern,
          patternTr: cp.patternTr,
          examples: cp.examples.map((e) => ({ sentence: e.en, sentenceTr: e.tr })),
          blankTemplate: cp.pattern,
          blankChoices: cp.examples.map((e) => e.en.split(' ').pop()?.replace(/[.,!?]/, '') ?? '').filter(Boolean).slice(0, 4),
          blankAnswer: cp.examples[0]?.en.split(' ').pop()?.replace(/[.,!?]/, '') ?? '',
        };
      })()
    : getTodayGrammarPattern(today);

  const phraseIdx = dayNum % PHRASE_PAIRS.length;
  const phrasePair = PHRASE_PAIRS[phraseIdx];

  const plan: DailyLessonPlan = {
    date: today,
    newWords,
    reviewWords,
    themeName,
    grammarPattern,
    phrasePair,
    completed: false,
    score: 0,
  };

  try {
    localStorage.setItem(dailyKey(userId, today), JSON.stringify(plan));
  } catch {
    // ignore
  }

  return plan;
}

export function isDailyLessonCompletedToday(userId: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  try {
    const saved = localStorage.getItem(dailyKey(userId, today));
    if (!saved) return false;
    return (JSON.parse(saved) as DailyLessonPlan).completed;
  } catch {
    return false;
  }
}

export function completeDailyLesson(
  userId: string,
  plan: DailyLessonPlan,
  score: number,
): void {
  const updated: DailyLessonPlan = { ...plan, completed: true, score };
  try {
    localStorage.setItem(dailyKey(userId, plan.date), JSON.stringify(updated));
  } catch {
    // ignore
  }

  plan.newWords.forEach((w) => markWordLearned(userId, w.word.toLowerCase()));
  const wasGoodScore = score >= 70;
  plan.reviewWords.forEach((w) => updateWordProgress(w.word.toLowerCase(), wasGoodScore));
  plan.newWords.forEach((w) => updateWordProgress(w.word.toLowerCase(), true));
}

// ─── Phonics: next unmastered sound ──────────────────────────────────────────

export function getTodayPhonicsSound(
  userId: string,
): { grapheme: string; phoneme: string; keyword: string; emoji: string; exampleWords: string[] } | null {
  let mastered: string[] = [];
  try {
    mastered = JSON.parse(
      localStorage.getItem(`mm_mastered_sounds_${userId}`) || '[]',
    ) as string[];
  } catch {
    mastered = [];
  }
  const next = ALL_SOUNDS.find((s) => !mastered.includes(s.grapheme));
  if (!next) return null;
  return {
    grapheme: next.grapheme,
    phoneme: next.ipa,
    keyword: next.keywords?.[0] ?? '',
    emoji: next.mnemonicEmoji ?? '',
    exampleWords: (next.keywords ?? []).slice(0, 3),
  };
}

// ─── CVC word blending data ──────────────────────────────────────────────────

export interface CVCWord {
  word: string;
  letters: string[];
}

export function getTodayCVCWords(): CVCWord[] {
  const cvcWords: CVCWord[] = [
    { word: 'cat', letters: ['c', 'a', 't'] },
    { word: 'dog', letters: ['d', 'o', 'g'] },
    { word: 'sun', letters: ['s', 'u', 'n'] },
    { word: 'hen', letters: ['h', 'e', 'n'] },
    { word: 'pig', letters: ['p', 'i', 'g'] },
    { word: 'red', letters: ['r', 'e', 'd'] },
    { word: 'big', letters: ['b', 'i', 'g'] },
    { word: 'map', letters: ['m', 'a', 'p'] },
    { word: 'cup', letters: ['c', 'u', 'p'] },
    { word: 'hop', letters: ['h', 'o', 'p'] },
  ];
  const today = new Date().toISOString().split('T')[0];
  const seed = parseInt(today.replace(/-/g, '').slice(-4), 10);
  const start = seed % (cvcWords.length - 2);
  return cvcWords.slice(start, start + 3);
}

// ─── Streak ───────────────────────────────────────────────────────────────────

export function shouldFreezeStreak(userId: string): boolean {
  const freezeKey = `mm_streak_freeze_${userId}`;
  const lastFreeze = localStorage.getItem(freezeKey);
  if (lastFreeze) {
    const freezeDate = new Date(lastFreeze);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - freezeDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysDiff < 7) return false;
  }
  return true;
}

export function useStreakFreeze(userId: string): void {
  try {
    localStorage.setItem(`mm_streak_freeze_${userId}`, new Date().toISOString());
  } catch {
    // ignore
  }
}

export function getTotalLearnedCount(userId: string): number {
  const srCount = loadAllProgress().length;
  if (srCount > 0) return srCount;
  return getLearnedWords(userId).length;
}
