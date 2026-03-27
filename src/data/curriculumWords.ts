// ============================================================
// MinesMinis Curriculum Words
// Structured, themed vocabulary for Turkish children ages 6-11
// 500+ words across 10 themes, 5 grade levels
// ============================================================

export interface CurriculumWord {
  english: string;
  turkish: string;
  emoji: string;
  category: string;
  level: 1 | 2 | 3 | 4 | 5;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'pronoun';
  exampleEn: string;
  exampleTr: string;
  phonics: string;
  /** 3 varied example sentences for richer context (required for first 50 words) */
  examples?: Array<{ en: string; tr: string }>;
  /** English word this word is commonly confused with */
  confusingWith?: string;
  /** Sound or spelling trap specific to Turkish speakers */
  turkishTrap?: string;
  /** Frequency rank 1–100: how common the word is in everyday English (higher = more common) */
  frequency?: number;
}

export interface GrammarPattern {
  id: string;
  pattern: string;
  patternTr: string;
  level: 1 | 2 | 3 | 4 | 5;
  examples: Array<{ en: string; tr: string }>;
  blank: string;
}

// ─── LEVEL 1 — THEME 1: Animals ───────────────────────────────────────────────
const level1Animals: CurriculumWord[] = [
  {
    english: 'cat', turkish: 'kedi', emoji: '🐱', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'The cat is sleeping.', exampleTr: 'Kedi uyuyor.', phonics: 'short-a', frequency: 72,
    examples: [
      { en: 'I have a cat.', tr: 'Bir kedim var.' },
      { en: 'The cat is sleeping.', tr: 'Kedi uyuyor.' },
      { en: 'My cat is black.', tr: 'Kedim siyah.' },
    ],
    confusingWith: 'cut',
    turkishTrap: "'cat' ve 'cut' sesi farklı: cat=kısa a (kedi), cut=kısa u (kesmek)",
  },
  {
    english: 'dog', turkish: 'köpek', emoji: '🐶', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'My dog is big.', exampleTr: 'Köpeğim büyük.', phonics: 'short-o', frequency: 78,
    examples: [
      { en: 'I have a dog.', tr: 'Bir köpeğim var.' },
      { en: 'My dog is big.', tr: 'Köpeğim büyük.' },
      { en: 'The dog is running.', tr: 'Köpek koşuyor.' },
    ],
    turkishTrap: "Türkçede 'the' yoktur; 'köpek koşuyor' dersin ama İngilizce'de 'The dog is running' demen şart.",
  },
  {
    english: 'bird', turkish: 'kuş', emoji: '🐦', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'The bird can fly.', exampleTr: 'Kuş uçabilir.', phonics: 'r-blend', frequency: 65,
    examples: [
      { en: 'I see a bird.', tr: 'Bir kuş görüyorum.' },
      { en: 'The bird can fly.', tr: 'Kuş uçabilir.' },
      { en: 'The bird is in the tree.', tr: 'Kuş ağaçta.' },
    ],
    turkishTrap: "'bird' kelimesinde 'ir' sesi Türkçe 'ir'den farklıdır — dudaklar yuvarlak değil, ses boğazdan gelir: 'bırd' gibi.",
  },
  {
    english: 'fish', turkish: 'balık', emoji: '🐟', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'I have a fish.', exampleTr: 'Bir balığım var.', phonics: 'digraph-sh', frequency: 62,
    examples: [
      { en: 'I have a fish.', tr: 'Bir balığım var.' },
      { en: 'The fish is in the water.', tr: 'Balık suda.' },
      { en: 'I like fish.', tr: 'Balığı severim.' },
    ],
    turkishTrap: "'fish' kelimesindeki 'sh' sesi Türkçede 'ş' harfidir — telaffuzu doğrudur; asıl tuzak makale: 'I have a fish' değil 'I have fish' de denilebilir çünkü balık sayılamayan isim olarak da kullanılır.",
  },
  {
    english: 'frog', turkish: 'kurbağa', emoji: '🐸', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'The frog is green.', exampleTr: 'Kurbağa yeşil.', phonics: 'r-blend', frequency: 44,
    examples: [
      { en: 'The frog is green.', tr: 'Kurbağa yeşil.' },
      { en: 'The frog can jump.', tr: 'Kurbağa zıplayabilir.' },
      { en: 'I see a frog.', tr: 'Bir kurbağa görüyorum.' },
    ],
    turkishTrap: "'frog' kelimesi 'fr' ünsüz kümesiyle başlar — Türkçede kelime başında iki ünsüz yan yana gelmez, bu yüzden 'f-rog' gibi araya sesli sokmak isteyebilirsin; sokmadan söyle.",
  },
  {
    english: 'duck', turkish: 'ördek', emoji: '🦆', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'The duck is in the pond.', exampleTr: 'Ördek gölette.', phonics: 'short-u', frequency: 46,
    examples: [
      { en: 'The duck is in the pond.', tr: 'Ördek gölette.' },
      { en: 'The duck is yellow.', tr: 'Ördek sarı.' },
      { en: 'I see a duck.', tr: 'Bir ördek görüyorum.' },
    ],
    turkishTrap: "'duck' kısa u sesiyle söylenir ('dak' değil, 'duk') — Türkçe 'u' harfinden biraz daha kısa ve gevşek bir ses.",
  },
  {
    english: 'hen', turkish: 'tavuk', emoji: '🐔', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'The hen has eggs.', exampleTr: 'Tavuğun yumurtaları var.', phonics: 'short-e', frequency: 35,
    examples: [
      { en: 'The hen has eggs.', tr: 'Tavuğun yumurtaları var.' },
      { en: 'The hen is on the farm.', tr: 'Tavuk çiftlikte.' },
      { en: 'I see a hen.', tr: 'Bir tavuk görüyorum.' },
    ],
    turkishTrap: "'hen' kısa e sesiyle söylenir — 'han' değil, 'hen'; Türkçedeki 'e' sesine benzer ama daha kısa.",
  },
  {
    english: 'pig', turkish: 'domuz', emoji: '🐷', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'The pig is pink.', exampleTr: 'Domuz pembe.', phonics: 'short-i', frequency: 48,
    examples: [
      { en: 'The pig is pink.', tr: 'Domuz pembe.' },
      { en: 'The pig is on the farm.', tr: 'Domuz çiftlikte.' },
      { en: 'I see a pig.', tr: 'Bir domuz görüyorum.' },
    ],
    turkishTrap: "'pig' kısa i sesiyle söylenir — Türkçe 'i'den kısa ve gevşek; 'peek' (uzun ee) ile karıştırma.",
  },
  {
    english: 'cow', turkish: 'inek', emoji: '🐄', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'The cow is in the field.', exampleTr: 'İnek tarlada.', phonics: 'vowel-ow', frequency: 55,
    examples: [
      { en: 'The cow is in the field.', tr: 'İnek tarlada.' },
      { en: 'The cow gives milk.', tr: 'İnek süt verir.' },
      { en: 'I see a cow.', tr: 'Bir inek görüyorum.' },
    ],
    turkishTrap: "'cow' kelimesindeki 'ow' sesi 'au' gibi okunur (inek = 'kau') — Türkçede böyle bir çift sesli yoktur, dikkat et.",
  },
  {
    english: 'horse', turkish: 'at', emoji: '🐴', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'The horse runs fast.', exampleTr: 'At hızlı koşar.', phonics: 'r-controlled', frequency: 60,
    examples: [
      { en: 'The horse runs fast.', tr: 'At hızlı koşar.' },
      { en: 'I like horses.', tr: 'Atları severim.' },
      { en: 'The horse is big.', tr: 'At büyük.' },
    ],
    turkishTrap: "'horse' sonunda sesli harf yok ama Türkler sona 'e' ekleyip 'horse-e' diyebilir — kelime 'hors' gibi biter, fazladan ses çıkarma.",
  },
  {
    english: 'sheep', turkish: 'koyun', emoji: '🐑', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'The sheep is white.', exampleTr: 'Koyun beyaz.', phonics: 'digraph-ee', frequency: 50,
    examples: [
      { en: 'The sheep is white.', tr: 'Koyun beyaz.' },
      { en: 'I see two sheep.', tr: 'İki koyun görüyorum.' },
      { en: 'The sheep is on the farm.', tr: 'Koyun çiftlikte.' },
    ],
    confusingWith: 'ship',
    turkishTrap: "'sheep' uzun ee sesi (koyun), 'ship' kısa i sesi (gemi) — Türkçede ikisi de kısa gelir",
  },
  {
    english: 'rabbit', turkish: 'tavşan', emoji: '🐰', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'The rabbit is soft.', exampleTr: 'Tavşan yumuşak.', phonics: 'short-a', frequency: 52,
    examples: [
      { en: 'The rabbit is soft.', tr: 'Tavşan yumuşak.' },
      { en: 'My rabbit is white.', tr: 'Tavşanım beyaz.' },
      { en: 'The rabbit can jump.', tr: 'Tavşan zıplayabilir.' },
    ],
    turkishTrap: "'rabbit' iki heceli: 'rab-bit' — her iki b de tek ses verir, ikinci hece 'beet' değil kısa 'bit' sesidir.",
  },
  {
    english: 'mouse', turkish: 'fare', emoji: '🐭', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'The mouse is small.', exampleTr: 'Fare küçük.', phonics: 'vowel-ou', frequency: 53,
    examples: [
      { en: 'The mouse is small.', tr: 'Fare küçük.' },
      { en: 'I see a mouse.', tr: 'Bir fare görüyorum.' },
      { en: 'The mouse is gray.', tr: 'Fare gri.' },
    ],
    turkishTrap: "'mouse' 'maus' gibi okunur — 'muz' değil; 'ou' harfleri birlikte 'au' sesini verir.",
  },
  {
    english: 'bee', turkish: 'arı', emoji: '🐝', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'The bee makes honey.', exampleTr: 'Arı bal yapar.', phonics: 'digraph-ee', frequency: 45,
    examples: [
      { en: 'The bee makes honey.', tr: 'Arı bal yapar.' },
      { en: 'I see a bee.', tr: 'Bir arı görüyorum.' },
      { en: 'The bee is yellow.', tr: 'Arı sarı.' },
    ],
    turkishTrap: "'bee' uzun ee sesiyle söylenir — Türkçe 'bi' gibi; 'be' değil 'bii' de ama zaten Türkçe 'i'ye yakın, çok uzatmayı unutma.",
  },
  {
    english: 'ant', turkish: 'karınca', emoji: '🐜', category: 'Animals', level: 1, partOfSpeech: 'noun',
    exampleEn: 'The ant is tiny.', exampleTr: 'Karınca çok küçük.', phonics: 'short-a', frequency: 42,
    examples: [
      { en: 'The ant is tiny.', tr: 'Karınca çok küçük.' },
      { en: 'I see an ant.', tr: 'Bir karınca görüyorum.' },
      { en: 'Ants are small.', tr: 'Karıncalar küçük.' },
    ],
    turkishTrap: "'an ant' — 'a' yerine 'an' kullanılır çünkü 'ant' sesliyle başlar; Türkçede böyle bir kural yoktur ama İngilizce'de çok önemli.",
  },
];

// ─── LEVEL 1 — THEME 2: Colors ────────────────────────────────────────────────
const level1Colors: CurriculumWord[] = [
  {
    english: 'red', turkish: 'kırmızı', emoji: '🔴', category: 'Colors', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'I like red apples.', exampleTr: 'Kırmızı elmaları severim.', phonics: 'short-e', frequency: 80,
    examples: [
      { en: 'I like red apples.', tr: 'Kırmızı elmaları severim.' },
      { en: 'The rose is red.', tr: 'Gül kırmızı.' },
      { en: 'My bag is red.', tr: 'Çantam kırmızı.' },
    ],
    turkishTrap: "Sıfatlar İngilizce'de isimden önce gelir: 'red apple' (kırmızı elma) — Türkçe'de de aynı sıra, bu yüzden bu kural kolay!",
  },
  {
    english: 'blue', turkish: 'mavi', emoji: '🔵', category: 'Colors', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'The sky is blue.', exampleTr: 'Gökyüzü mavi.', phonics: 'long-u', frequency: 79,
    examples: [
      { en: 'The sky is blue.', tr: 'Gökyüzü mavi.' },
      { en: 'I like blue.', tr: 'Maviyi severim.' },
      { en: 'My pencil is blue.', tr: 'Kalemim mavi.' },
    ],
    turkishTrap: "'blue' sonu sessiz harf gibi görünse de 'e' okunmaz — telaffuzu 'bluu' değil 'blu'; 'bl' kümesini birleşik söyle.",
  },
  {
    english: 'green', turkish: 'yeşil', emoji: '🟢', category: 'Colors', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'Grass is green.', exampleTr: 'Çimen yeşil.', phonics: 'digraph-ee', frequency: 78,
    examples: [
      { en: 'Grass is green.', tr: 'Çimen yeşil.' },
      { en: 'The frog is green.', tr: 'Kurbağa yeşil.' },
      { en: 'I have a green book.', tr: 'Yeşil bir kitabım var.' },
    ],
    turkishTrap: "'green' uzun ee sesiyle söylenir — 'grin' değil 'griin'; 'gr' kümesini araya sesli sokmadan söyle.",
  },
  {
    english: 'yellow', turkish: 'sarı', emoji: '🟡', category: 'Colors', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'The sun is yellow.', exampleTr: 'Güneş sarı.', phonics: 'digraph-ow', frequency: 72,
    examples: [
      { en: 'The sun is yellow.', tr: 'Güneş sarı.' },
      { en: 'I like yellow.', tr: 'Sarıyı severim.' },
      { en: 'The banana is yellow.', tr: 'Muz sarı.' },
    ],
    turkishTrap: "'yellow' iki heceli: 'yel-lo' — sondaki 'w' okunmaz, 'yelo' gibi söyle; başındaki 'y' Türkçe 'y' gibi.",
  },
  {
    english: 'pink', turkish: 'pembe', emoji: '🩷', category: 'Colors', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'Her dress is pink.', exampleTr: 'Elbisesi pembe.', phonics: 'short-i', frequency: 62,
    examples: [
      { en: 'Her dress is pink.', tr: 'Elbisesi pembe.' },
      { en: 'The pig is pink.', tr: 'Domuz pembe.' },
      { en: 'I have a pink flower.', tr: 'Pembe bir çiçeğim var.' },
    ],
    turkishTrap: "'pink' kısa i sesiyle söylenir — Türkçe 'pink' yazarken 'piynk' gibi okuma, 'pınk' kısacasına söyle.",
  },
  {
    english: 'orange', turkish: 'turuncu', emoji: '🟠', category: 'Colors', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'Carrots are orange.', exampleTr: 'Havuçlar turuncu.', phonics: 'r-controlled', frequency: 60,
    examples: [
      { en: 'Carrots are orange.', tr: 'Havuçlar turuncu.' },
      { en: 'The ball is orange.', tr: 'Top turuncu.' },
      { en: 'I like orange.', tr: 'Turuncu rengini severim.' },
    ],
    turkishTrap: "'orange' hem renk hem meyve — renk olarak 'orange car' (turuncu araba), meyve olarak 'an orange' (bir portakal) dersin.",
  },
  {
    english: 'purple', turkish: 'mor', emoji: '🟣', category: 'Colors', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'I have a purple bag.', exampleTr: 'Mor bir çantam var.', phonics: 'r-controlled', frequency: 55,
    examples: [
      { en: 'I have a purple bag.', tr: 'Mor bir çantam var.' },
      { en: 'The flower is purple.', tr: 'Çiçek mor.' },
      { en: 'Purple is my favorite color.', tr: 'Mor en sevdiğim renk.' },
    ],
    turkishTrap: "'purple' 'pur-ple' — sonundaki 'le' Türkçe 'l' ile bitmez, hafifçe 'ıl' sesi çıkar; 'purp-ul' gibi.",
  },
  {
    english: 'black', turkish: 'siyah', emoji: '⚫', category: 'Colors', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'The cat is black.', exampleTr: 'Kedi siyah.', phonics: 'l-blend', frequency: 82,
    examples: [
      { en: 'The cat is black.', tr: 'Kedi siyah.' },
      { en: 'I have a black pen.', tr: 'Siyah bir kalemim var.' },
      { en: 'The night is black.', tr: 'Gece siyah.' },
    ],
    turkishTrap: "'black' 'bl' kümesiyle başlar — araya 'ı' veya 'e' ekleme, Türkçe gibi 'bılaek' deme; 'blæk' olarak bir hecede söyle.",
  },
  {
    english: 'white', turkish: 'beyaz', emoji: '⚪', category: 'Colors', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'Snow is white.', exampleTr: 'Kar beyaz.', phonics: 'long-i', frequency: 80,
    examples: [
      { en: 'Snow is white.', tr: 'Kar beyaz.' },
      { en: 'The sheep is white.', tr: 'Koyun beyaz.' },
      { en: 'I have a white shirt.', tr: 'Beyaz bir gömleğim var.' },
    ],
    turkishTrap: "'white' başındaki 'wh' sesi sadece 'w' gibi okunur — 'hw' ya da 'v' değil; Türklerin 'v' deme eğilimi var, 'w' sesi daha yuvarlak dudakla yapılır.",
  },
  {
    english: 'brown', turkish: 'kahverengi', emoji: '🟤', category: 'Colors', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'The bear is brown.', exampleTr: 'Ayı kahverengi.', phonics: 'vowel-ow', frequency: 65,
    examples: [
      { en: 'The bear is brown.', tr: 'Ayı kahverengi.' },
      { en: 'My hair is brown.', tr: 'Saçım kahverengi.' },
      { en: 'The door is brown.', tr: 'Kapı kahverengi.' },
    ],
    turkishTrap: "'brown' 'braun' gibi okunur — 'brovn' değil; 'ow' burada çift seslidir, Türkçe 'o' ile karıştırma.",
  },
  {
    english: 'gray', turkish: 'gri', emoji: '🩶', category: 'Colors', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'Elephants are gray.', exampleTr: 'Filler gri.', phonics: 'long-a', frequency: 58,
    examples: [
      { en: 'Elephants are gray.', tr: 'Filler gri.' },
      { en: 'The sky is gray today.', tr: 'Gökyüzü bugün gri.' },
      { en: 'My cat is gray.', tr: 'Kedim gri.' },
    ],
    turkishTrap: "'gray' İngiliz İngilizcesinde 'grey' olarak da yazılır — ikisi de doğrudur; telaffuz aynıdır: 'grey'.",
  },
  {
    english: 'rainbow', turkish: 'gökkuşağı', emoji: '🌈', category: 'Colors', level: 1, partOfSpeech: 'noun',
    exampleEn: 'I see a rainbow!', exampleTr: 'Gökkuşağı görüyorum!', phonics: 'long-a', frequency: 40,
    examples: [
      { en: 'I see a rainbow!', tr: 'Gökkuşağı görüyorum!' },
      { en: 'The rainbow is beautiful.', tr: 'Gökkuşağı çok güzel.' },
      { en: 'A rainbow has many colors.', tr: 'Gökkuşağının çok rengi var.' },
    ],
    turkishTrap: "'rainbow' birleşik kelime: 'rain' (yağmur) + 'bow' (yay) — 'bow' burada 'bo' gibi okunur, 'bov' değil.",
  },
];

// ─── LEVEL 1 — THEME 3: Numbers ───────────────────────────────────────────────
const level1Numbers: CurriculumWord[] = [
  {
    english: 'one', turkish: 'bir', emoji: '1️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun',
    exampleEn: 'I have one cat.', exampleTr: 'Bir kedim var.', phonics: 'irregular', frequency: 95,
    examples: [
      { en: 'I have one cat.', tr: 'Bir kedim var.' },
      { en: 'One fish is in the bowl.', tr: 'Kasede bir balık var.' },
      { en: 'I eat one apple.', tr: 'Bir elma yiyorum.' },
    ],
    confusingWith: 'won',
    turkishTrap: "'one' telaffuzu 'van' gibi — 'o-ne' değil",
  },
  {
    english: 'two', turkish: 'iki', emoji: '2️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun',
    exampleEn: 'I have two hands.', exampleTr: 'İki elim var.', phonics: 'long-oo', frequency: 92,
    examples: [
      { en: 'I have two hands.', tr: 'İki elim var.' },
      { en: 'I see two birds.', tr: 'İki kuş görüyorum.' },
      { en: 'Two dogs are running.', tr: 'İki köpek koşuyor.' },
    ],
    confusingWith: 'too',
    turkishTrap: "'two' telaffuzu 'tu' — 'w' harfi okunmaz",
  },
  {
    english: 'three', turkish: 'üç', emoji: '3️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun',
    exampleEn: 'I see three birds.', exampleTr: 'Üç kuş görüyorum.', phonics: 'digraph-ee', frequency: 88,
    examples: [
      { en: 'I see three birds.', tr: 'Üç kuş görüyorum.' },
      { en: 'I have three cats.', tr: 'Üç kedim var.' },
      { en: 'Three is my favorite number.', tr: 'Üç en sevdiğim sayı.' },
    ],
    confusingWith: 'tree',
    turkishTrap: "'three' başındaki 'th' sesi Türkçede yoktur — dil dişlere değmeli, 'sri' değil",
  },
  {
    english: 'four', turkish: 'dört', emoji: '4️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun',
    exampleEn: 'A dog has four legs.', exampleTr: 'Bir köpeğin dört ayağı var.', phonics: 'r-controlled', frequency: 85,
    examples: [
      { en: 'A dog has four legs.', tr: 'Bir köpeğin dört ayağı var.' },
      { en: 'I have four books.', tr: 'Dört kitabım var.' },
      { en: 'There are four chairs.', tr: 'Dört sandalye var.' },
    ],
    turkishTrap: "'four' telaffuzu 'for' gibidir — 'u' okunmaz; 'fo-ur' diye iki hecede okuma.",
  },
  {
    english: 'five', turkish: 'beş', emoji: '5️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun',
    exampleEn: 'I have five fingers.', exampleTr: 'Beş parmağım var.', phonics: 'long-i', frequency: 84,
    examples: [
      { en: 'I have five fingers.', tr: 'Beş parmağım var.' },
      { en: 'I eat five apples.', tr: 'Beş elma yiyorum.' },
      { en: 'There are five birds.', tr: 'Beş kuş var.' },
    ],
    turkishTrap: "'five' uzun i sesiyle söylenir — sonu 'v' ile biter, Türkler sona 'ı' ekleyip 'fayvı' diyebilir; 'fayv' olarak bırak.",
  },
  {
    english: 'six', turkish: 'altı', emoji: '6️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun',
    exampleEn: 'Six eggs are in the box.', exampleTr: 'Kutuda altı yumurta var.', phonics: 'short-i', frequency: 80,
    examples: [
      { en: 'Six eggs are in the box.', tr: 'Kutuda altı yumurta var.' },
      { en: 'I have six crayons.', tr: 'Altı boya kalemim var.' },
      { en: 'There are six dogs.', tr: 'Altı köpek var.' },
    ],
    turkishTrap: "'six' kısa i sesiyle tek hecedir — 'siks'; Türkler sona sesli ekleyip 'sikis' diyebilir, ekleme.",
  },
  {
    english: 'seven', turkish: 'yedi', emoji: '7️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun',
    exampleEn: 'There are seven days in a week.', exampleTr: 'Bir haftada yedi gün var.', phonics: 'short-e', frequency: 78,
    examples: [
      { en: 'There are seven days in a week.', tr: 'Bir haftada yedi gün var.' },
      { en: 'I am seven years old.', tr: 'Yedi yaşındayım.' },
      { en: 'I see seven stars.', tr: 'Yedi yıldız görüyorum.' },
    ],
    turkishTrap: "'seven' iki heceli: 'sev-en' — ikinci 'e' çok kısa söylenir, 'seviyen' değil.",
  },
  {
    english: 'eight', turkish: 'sekiz', emoji: '8️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun',
    exampleEn: 'She is eight years old.', exampleTr: 'O sekiz yaşında.', phonics: 'long-a', frequency: 75,
    examples: [
      { en: 'She is eight years old.', tr: 'O sekiz yaşında.' },
      { en: 'A spider has eight legs.', tr: 'Bir örümceğin sekiz bacağı var.' },
      { en: 'I have eight crayons.', tr: 'Sekiz boya kalemim var.' },
    ],
    turkishTrap: "'eight' telaffuzu 'eyt' — 'gh' ve 't' harfleri birlikte sadece 't' sesi verir; 'ei-ght' diye okuma.",
  },
  {
    english: 'nine', turkish: 'dokuz', emoji: '9️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun',
    exampleEn: 'I see nine stars in the sky.', exampleTr: 'Gökyüzünde dokuz yıldız görüyorum.', phonics: 'long-i', frequency: 73,
    examples: [
      { en: 'I see nine stars in the sky.', tr: 'Gökyüzünde dokuz yıldız görüyorum.' },
      { en: 'I have nine books.', tr: 'Dokuz kitabım var.' },
      { en: 'Nine cats are sleeping.', tr: 'Dokuz kedi uyuyor.' },
    ],
    turkishTrap: "'nine' uzun i sesiyle söylenir — 'nayn'; sonu 'n' ile biter, Türkler sona sesli eklemez; 'naynı' değil.",
  },
  {
    english: 'ten', turkish: 'on', emoji: '🔟', category: 'Numbers', level: 1, partOfSpeech: 'noun',
    exampleEn: 'Count to ten!', exampleTr: 'Ona kadar say!', phonics: 'short-e', frequency: 82,
    examples: [
      { en: 'Count to ten!', tr: 'Ona kadar say!' },
      { en: 'I have ten fingers.', tr: 'On parmağım var.' },
      { en: 'There are ten apples.', tr: 'On elma var.' },
    ],
    turkishTrap: "'ten' kısa e sesiyle söylenir — 'ten'; Türkçe 'ten' (cilt) ile aynı yazılır ama İngilizcede anlamı farklı, bağlama dikkat et.",
  },
  {
    english: 'first', turkish: 'birinci', emoji: '🥇', category: 'Numbers', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'She is first in class.', exampleTr: 'O sınıfta birinci.', phonics: 'r-blend', frequency: 85,
    examples: [
      { en: 'She is first in class.', tr: 'O sınıfta birinci.' },
      { en: 'I am first!', tr: 'Ben birinciyim!' },
      { en: 'This is the first page.', tr: 'Bu birinci sayfa.' },
    ],
    turkishTrap: "'first' 'fr' ve 'st' kümeleri içerir — Türkçede böyle yığılmalar olmaz; 'fırst' diye araya sesli sokmadan söyle.",
  },
  {
    english: 'second', turkish: 'ikinci', emoji: '🥈', category: 'Numbers', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'He is second.', exampleTr: 'O ikinci.', phonics: 'short-e', frequency: 82,
    examples: [
      { en: 'He is second.', tr: 'O ikinci.' },
      { en: 'This is my second book.', tr: 'Bu benim ikinci kitabım.' },
      { en: 'I am second today.', tr: 'Bugün ikinciyim.' },
    ],
    turkishTrap: "'second' telaffuzda 'c' okunmaz — 'sek-und'; 'sek-ond' değil; son ek '-nd' birlikte söylenir.",
  },
  {
    english: 'last', turkish: 'son', emoji: '🔚', category: 'Numbers', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'This is the last cookie.', exampleTr: 'Bu son kurabiye.', phonics: 'short-a', frequency: 88,
    examples: [
      { en: 'This is the last cookie.', tr: 'Bu son kurabiye.' },
      { en: 'I am last.', tr: 'Ben sonuncuyum.' },
      { en: 'This is the last page.', tr: 'Bu son sayfa.' },
    ],
    turkishTrap: "Türkçe'de sıra sıfatları '-ıncı/-inci' ekiyle yapılır ama İngilizce'de ayrı kelimeler: first, second, third, last — bunları ezberlemek gerek.",
  },
  {
    english: 'many', turkish: 'çok', emoji: '✨', category: 'Numbers', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'There are many stars.', exampleTr: 'Çok yıldız var.', phonics: 'short-a', frequency: 87,
    examples: [
      { en: 'There are many stars.', tr: 'Çok yıldız var.' },
      { en: 'I have many friends.', tr: 'Çok arkadaşım var.' },
      { en: 'There are many cats.', tr: 'Çok kedi var.' },
    ],
    turkishTrap: "'many' sayılabilen isimlerle kullanılır — 'many cats' (çok kedi); sayılamayan isimlerle 'much' denir: 'much water' (çok su). Türkçede ikisi için de 'çok' kullanılır.",
  },
  {
    english: 'few', turkish: 'birkaç', emoji: '🔢', category: 'Numbers', level: 1, partOfSpeech: 'adjective',
    exampleEn: 'A few dogs play.', exampleTr: 'Birkaç köpek oynuyor.', phonics: 'long-u', frequency: 75,
    examples: [
      { en: 'A few dogs play.', tr: 'Birkaç köpek oynuyor.' },
      { en: 'I have a few books.', tr: 'Birkaç kitabım var.' },
      { en: 'A few birds are singing.', tr: 'Birkaç kuş şarkı söylüyor.' },
    ],
    turkishTrap: "'a few' sayılabilenlerle kullanılır — 'a few books'; az miktarda sayılamayan için 'a little' denir: 'a little water'. Türkçede ikisi de 'biraz' olur.",
  },
];

// ─── LEVEL 1 — THEME 4: Family ────────────────────────────────────────────────
const level1Family: CurriculumWord[] = [
  {
    english: 'mom', turkish: 'anne', emoji: '👩', category: 'Family', level: 1, partOfSpeech: 'noun',
    exampleEn: 'My mom is kind.', exampleTr: 'Annem çok iyi kalpli.', phonics: 'short-o', frequency: 88,
    examples: [
      { en: 'My mom is kind.', tr: 'Annem çok iyi kalpli.' },
      { en: 'My mom is in the kitchen.', tr: 'Annem mutfakta.' },
      { en: 'I love my mom.', tr: 'Annemi seviyorum.' },
    ],
    turkishTrap: "Türkçede 'annem' derken iyelik eki kullanırız; İngilizce'de 'my mom' demek zorundasın — 'mom' tek başına kimsenin annesi değildir.",
  },
  {
    english: 'dad', turkish: 'baba', emoji: '👨', category: 'Family', level: 1, partOfSpeech: 'noun',
    exampleEn: 'My dad is tall.', exampleTr: 'Babam uzun boylu.', phonics: 'short-a', frequency: 86,
    examples: [
      { en: 'My dad is tall.', tr: 'Babam uzun boylu.' },
      { en: 'My dad reads books.', tr: 'Babam kitap okur.' },
      { en: 'I love my dad.', tr: 'Babamı seviyorum.' },
    ],
    turkishTrap: "'dad' kısa a sesiyle söylenir — 'ded' değil 'dad'; Türkçe 'baba'dan farklı, ağzı geniş aç.",
  },
  {
    english: 'sister', turkish: 'kız kardeş', emoji: '👧', category: 'Family', level: 1, partOfSpeech: 'noun',
    exampleEn: 'My sister sings.', exampleTr: 'Kız kardeşim şarkı söyler.', phonics: 'r-controlled', frequency: 74,
    examples: [
      { en: 'My sister sings.', tr: 'Kız kardeşim şarkı söyler.' },
      { en: 'I have a sister.', tr: 'Bir kız kardeşim var.' },
      { en: 'My sister is happy.', tr: 'Kız kardeşim mutlu.' },
    ],
    turkishTrap: "Türkçede 'kardeş' hemcinsi belirtmez ama İngilizce'de 'sister' (kız) ve 'brother' (erkek) ayrıdır — doğrusunu seçmeyi unutma.",
  },
  {
    english: 'brother', turkish: 'erkek kardeş', emoji: '👦', category: 'Family', level: 1, partOfSpeech: 'noun',
    exampleEn: 'My brother plays football.', exampleTr: 'Erkek kardeşim futbol oynar.', phonics: 'r-blend', frequency: 74,
    examples: [
      { en: 'My brother plays football.', tr: 'Erkek kardeşim futbol oynar.' },
      { en: 'I have a brother.', tr: 'Bir erkek kardeşim var.' },
      { en: 'My brother is big.', tr: 'Erkek kardeşim büyük.' },
    ],
    turkishTrap: "'brother' 'th' sesi içerir — 'broder' değil; dil dişlere değdirerek 'ð' sesi çıkar, Türkçede bu ses yoktur.",
  },
  {
    english: 'baby', turkish: 'bebek', emoji: '👶', category: 'Family', level: 1, partOfSpeech: 'noun',
    exampleEn: 'The baby is sleeping.', exampleTr: 'Bebek uyuyor.', phonics: 'long-a', frequency: 70,
    examples: [
      { en: 'The baby is sleeping.', tr: 'Bebek uyuyor.' },
      { en: 'The baby is cute.', tr: 'Bebek sevimli.' },
      { en: 'I have a baby sister.', tr: 'Bebek bir kız kardeşim var.' },
    ],
    turkishTrap: "'baby' uzun a ile 'bey-bi' okunur — 'babi' değil; Türkçede 'bebek' uzun e içerir ama İngilizce telaffuz farklıdır.",
  },
  {
    english: 'grandma', turkish: 'büyükanne', emoji: '👵', category: 'Family', level: 1, partOfSpeech: 'noun',
    exampleEn: 'Grandma makes cookies.', exampleTr: 'Büyükanne kurabiye yapar.', phonics: 'r-blend', frequency: 65,
    examples: [
      { en: 'Grandma makes cookies.', tr: 'Büyükanne kurabiye yapar.' },
      { en: 'I love my grandma.', tr: 'Büyükannemi seviyorum.' },
      { en: 'My grandma is kind.', tr: 'Büyükannem iyi kalpli.' },
    ],
    turkishTrap: "'grandma' birleşik kelime: 'grand' (büyük) + 'ma' (anne) — Türkçe 'büyükanne' gibi mantıklı; telaffuzda 'grandmä' değil 'grænmə'.",
  },
  {
    english: 'grandpa', turkish: 'büyükbaba', emoji: '👴', category: 'Family', level: 1, partOfSpeech: 'noun',
    exampleEn: 'Grandpa reads books.', exampleTr: 'Büyükbaba kitap okur.', phonics: 'r-blend', frequency: 60,
    examples: [
      { en: 'Grandpa reads books.', tr: 'Büyükbaba kitap okur.' },
      { en: 'I love my grandpa.', tr: 'Büyükbabamı seviyorum.' },
      { en: 'My grandpa drinks tea.', tr: 'Büyükbabam çay içer.' },
    ],
    turkishTrap: "'grandpa' 'grand' + 'pa' (baba) — 'granpa' diye yazılmaz; iki n ve d harfi yazılır.",
  },
  {
    english: 'family', turkish: 'aile', emoji: '👨‍👩‍👧‍👦', category: 'Family', level: 1, partOfSpeech: 'noun',
    exampleEn: 'I love my family.', exampleTr: 'Ailemi seviyorum.', phonics: 'long-a', frequency: 82,
    examples: [
      { en: 'I love my family.', tr: 'Ailemi seviyorum.' },
      { en: 'My family is big.', tr: 'Ailem büyük.' },
      { en: 'We eat together as a family.', tr: 'Aile olarak birlikte yiyoruz.' },
    ],
    turkishTrap: "'family' üç heceli: 'fam-i-ly' — orta 'i' çok kısa söylenir; 'faamily' diye uzatma.",
  },
  { english: 'friend', turkish: 'arkadaş', emoji: '🤝', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'She is my best friend.', exampleTr: 'O benim en iyi arkadaşım.', phonics: 'r-blend', frequency: 85, turkishTrap: "'friend' sonu 'nd' ile biter — Türkler 'frend' derken sona 'i' ekleyip 'frendi' diyebilir; bırakma." },
  { english: 'boy', turkish: 'erkek çocuk', emoji: '👦', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'The boy is happy.', exampleTr: 'Erkek çocuk mutlu.', phonics: 'vowel-oy', frequency: 78, turkishTrap: "'boy' 'oy' çift sesiyle söylenir — Türkçe 'oy' ile aynı; ama Türkçede hem 'boy' (kişi) hem 'oy' (ses) anlamına gelir, karışmasın." },
  { english: 'girl', turkish: 'kız çocuk', emoji: '👧', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'The girl has a doll.', exampleTr: 'Kız çocuğunun bir bebeği var.', phonics: 'r-controlled', frequency: 78, turkishTrap: "'girl' sesi 'gırl' — 'girl' içindeki 'ir' Türkçe 'ir'den farklı, daha derin ve yumuşak; Türkler 'gerl' diyebilir ama 'gırl' daha doğru." },
  { english: 'teacher', turkish: 'öğretmen', emoji: '👩‍🏫', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'My teacher is nice.', exampleTr: 'Öğretmenim çok iyi.', phonics: 'digraph-ea', frequency: 75, turkishTrap: "'teacher' 'ea' harfleri uzun ee sesi verir — 'tee-cher'; sondaki 'er' Türkçe 'er'den daha gevşek, 'ır' gibi söylenir." },
];

// ─── LEVEL 1 — THEME 5: Body ──────────────────────────────────────────────────
const level1Body: CurriculumWord[] = [
  { english: 'head', turkish: 'baş', emoji: '🗣️', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'I put the hat on my head.', exampleTr: 'Şapkayı başıma koydum.', phonics: 'digraph-ea', frequency: 85, turkishTrap: "'head' kısa e sesiyle söylenir — 'hed'; 'ea' harfleri burada uzun değil kısa okunur, 'heed' değil." },
  { english: 'eye', turkish: 'göz', emoji: '👁️', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'I have two eyes.', exampleTr: 'İki gözüm var.', phonics: 'long-i', frequency: 82, turkishTrap: "'eye' telaffuzu 'ay' — tek heceli; 'e-ye' diye iki hece okuma. Çoğulu 'eyes' = 'ayz'." },
  { english: 'ear', turkish: 'kulak', emoji: '👂', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'I hear with my ears.', exampleTr: 'Kulaklarımla duyarım.', phonics: 'digraph-ear', frequency: 75, turkishTrap: "'ear' (kulak) ve 'year' (yıl) benzer görünür ama farklı seslerle başlar — dikkatli ol." },
  { english: 'nose', turkish: 'burun', emoji: '👃', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'My nose is cold.', exampleTr: 'Burnum soğuk.', phonics: 'long-o', frequency: 70, turkishTrap: "'nose' sonu sessiz 'e' — okunmaz; 'noze' değil 'noz'; Türkler sona sesli ekleyip 'nozi' diyebilir, söyleme." },
  { english: 'mouth', turkish: 'ağız', emoji: '👄', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'I eat with my mouth.', exampleTr: 'Ağzımla yerim.', phonics: 'vowel-ou', frequency: 72, turkishTrap: "'mouth' 'th' ile biter — dil dişlere değer, 'mauθ'; 'maut' ya da 'maus' deme." },
  { english: 'hand', turkish: 'el', emoji: '✋', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'Wash your hands.', exampleTr: 'Ellerini yıka.', phonics: 'short-a', frequency: 88, turkishTrap: "'hand' sonu sessiz 'd' ile biter — Türkler sona 'ı' ekleyip 'handi' diyebilir; 'hænd' olarak bırak." },
  { english: 'foot', turkish: 'ayak', emoji: '🦶', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'My foot hurts.', exampleTr: 'Ayağım acıyor.', phonics: 'short-oo', frequency: 76, turkishTrap: "'foot' tekili 'fut', çoğulu 'feet' — düzensiz çoğul; Türkçede '-lar' ekleriz ama İngilizce'de 'foots' denmez." },
  { english: 'leg', turkish: 'bacak', emoji: '🦵', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'Dogs have four legs.', exampleTr: 'Köpeklerin dört bacağı var.', phonics: 'short-e', frequency: 78, turkishTrap: "'leg' kısa e ile 'leg' — 'lig' değil; 'large' ile karıştırma, tamamen farklı kelimeler." },
  { english: 'arm', turkish: 'kol', emoji: '💪', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'I have two arms.', exampleTr: 'İki kolum var.', phonics: 'r-controlled', frequency: 74, turkishTrap: "'arm' 'ar' sesiyle başlar — Türkçe 'ar' gibi ama biraz daha açık; 'arms' çoğulunda sona eklenen 'z' sesi fark edilmeli." },
  { english: 'hair', turkish: 'saç', emoji: '💇', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'Her hair is long.', exampleTr: 'Saçı uzun.', phonics: 'r-controlled', frequency: 72, turkishTrap: "'hair' sayılamayan isimdir — 'hairs' denmez; 'my hair' der, 'a hair' sadece tek tel için kullanılır." },
  { english: 'face', turkish: 'yüz', emoji: '😊', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'She has a happy face.', exampleTr: 'Mutlu bir yüzü var.', phonics: 'long-a', frequency: 80, turkishTrap: "'face' uzun a sesiyle 'feys' — Türkçe 'fas' deme; sondaki sessiz 'e' uzun a sesini sağlar." },
  { english: 'tooth', turkish: 'diş', emoji: '🦷', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'Brush your teeth.', exampleTr: 'Dişlerini fırçala.', phonics: 'long-oo', frequency: 65, turkishTrap: "'tooth' tekili, 'teeth' çoğulu — düzensiz; 'tooths' denmez. İkisi de 'th' ile biter, dil dişlere değmeli." },
  { english: 'finger', turkish: 'parmak', emoji: '☝️', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'I have ten fingers.', exampleTr: 'On parmağım var.', phonics: 'r-controlled', frequency: 70, turkishTrap: "'finger' 'ng' sesi içerir — 'fing-ger'; bu ses Türkçe 'n' + 'g' değil, tek bir gırtlak sesidir." },
  { english: 'knee', turkish: 'diz', emoji: '🦵', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'My knee is sore.', exampleTr: 'Dizim ağrıyor.', phonics: 'digraph-ee', frequency: 60, turkishTrap: "'knee' başındaki 'k' okunmaz — 'nii' şeklinde söylenir; Türkler 'knee' yazısını görünce 'kni' okuyabilir." },
  { english: 'tummy', turkish: 'karın', emoji: '🫃', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'My tummy is full.', exampleTr: 'Karnım dolu.', phonics: 'short-u', frequency: 58, turkishTrap: "'tummy' çocuk dili; resmi kelime 'stomach' (mide) ya da 'belly' (karın) — büyüklere 'tummy' dersen çok çocukça gelir." },
];

// ─── LEVEL 1 — THEME 6: Food ──────────────────────────────────────────────────
const level1Food: CurriculumWord[] = [
  { english: 'apple', turkish: 'elma', emoji: '🍎', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'I eat an apple.', exampleTr: 'Bir elma yiyorum.', phonics: 'short-a', frequency: 78, turkishTrap: "'an apple' — 'apple' sesliyle başladığı için 'a' değil 'an' kullanılır; Türkçede böyle bir kural yoktur." },
  { english: 'bread', turkish: 'ekmek', emoji: '🍞', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'I eat bread every day.', exampleTr: 'Her gün ekmek yerim.', phonics: 'r-blend', frequency: 80, turkishTrap: "'bread' sayılamayan isim — 'I eat bread' dersin, 'a bread' veya 'breads' çoğunlukla yanlış; dilim için 'a slice of bread' dersin." },
  { english: 'milk', turkish: 'süt', emoji: '🥛', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'Milk is good for you.', exampleTr: 'Süt sağlıklıdır.', phonics: 'l-blend', frequency: 80, turkishTrap: "'milk' sayılamayan isim — 'a milk' denmez, 'a glass of milk' (bir bardak süt) dersin; Türkçede de 'bir süt' yerine 'bir bardak süt' denilebilir." },
  { english: 'water', turkish: 'su', emoji: '💧', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'Drink your water.', exampleTr: 'Suyunu iç.', phonics: 'r-controlled', frequency: 92, turkishTrap: "'water' 'waw-ter' okunur — 'w' Türkçe 'v' değil, dudak yuvarlak; 'vater' deme." },
  { english: 'egg', turkish: 'yumurta', emoji: '🥚', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'I eat an egg for breakfast.', exampleTr: 'Kahvaltıda yumurta yerim.', phonics: 'short-e', frequency: 76, turkishTrap: "'an egg' — sesliyle başladığı için 'an' kullanılır; 'I eat an egg' doğru, 'a egg' yanlış." },
  { english: 'cheese', turkish: 'peynir', emoji: '🧀', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'I like cheese.', exampleTr: 'Peyniri severim.', phonics: 'digraph-ee', frequency: 70, turkishTrap: "'cheese' 'ch' harfleri 'ç' gibi okunur — 'çiiz'; 'sh' sesi değil. Türkçe 'ş' ile karıştırma." },
  { english: 'rice', turkish: 'pirinç', emoji: '🍚', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'We eat rice for dinner.', exampleTr: 'Akşam yemeğinde pilav yeriz.', phonics: 'long-i', frequency: 72, turkishTrap: "'rice' sayılamayan isim — 'rices' veya 'a rice' denmez; 'some rice' ya da 'a bowl of rice' dersin." },
  { english: 'chicken', turkish: 'tavuk eti', emoji: '🍗', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'I like chicken soup.', exampleTr: 'Tavuk çorbasını severim.', phonics: 'short-i', frequency: 74, turkishTrap: "'chicken' hem hayvan (canlı tavuk) hem yiyecek (tavuk eti) anlamına gelir — 'a chicken' dersen hayvan, 'some chicken' dersen et demektir." },
  { english: 'banana', turkish: 'muz', emoji: '🍌', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'Monkeys eat bananas.', exampleTr: 'Maymunlar muz yer.', phonics: 'short-a', frequency: 68, turkishTrap: "'banana' üç heceli: 'bə-NA-nə' — vurgu ortadadır; 'BA-na-na' deme." },
  { english: 'orange', turkish: 'portakal', emoji: '🍊', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'I drink orange juice.', exampleTr: 'Portakal suyu içiyorum.', phonics: 'r-controlled', frequency: 68, turkishTrap: "'orange' hem meyve hem renk — 'an orange' (portakal), 'orange juice' (portakal suyu), 'orange color' (turuncu renk); bağlama göre değişir." },
  { english: 'cake', turkish: 'pasta', emoji: '🎂', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'We have cake on birthdays.', exampleTr: 'Doğum günlerinde pasta yeriz.', phonics: 'long-a', frequency: 66, turkishTrap: "Türkçe 'pasta' ve İngilizce 'cake' farklı kelimeler — 'pasta' İngilizce'de makarna ürününü ifade eder, kafa karışıklığına dikkat et." },
  { english: 'cookie', turkish: 'kurabiye', emoji: '🍪', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'The cookie is sweet.', exampleTr: 'Kurabiye tatlı.', phonics: 'short-oo', frequency: 62, turkishTrap: "'cookie' İngiliz İngilizcesinde 'biscuit' denir — Amerikan İngilizcesinde 'cookie' kullanılır; ikisi de doğrudur, ülkeye göre değişir." },
  { english: 'juice', turkish: 'meyve suyu', emoji: '🧃', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'I drink juice.', exampleTr: 'Meyve suyu içiyorum.', phonics: 'long-u', frequency: 70, turkishTrap: "'juice' 'cuus' gibi okunur — İngilizce 'j' Türkçe 'c' sesi gibidir ('cam' kelimesindeki gibi); uzun oo sesiyle 'cuus'; 'orange juice' = 'orincuus'." },
  { english: 'soup', turkish: 'çorba', emoji: '🍲', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'Mom makes soup.', exampleTr: 'Annem çorba yapar.', phonics: 'long-oo', frequency: 68, turkishTrap: "'soup' 'suup' gibi okunur — 'p' sesi var ama çok hafif; 'su:p'; Türkler 'soup' yazısını 'sowp' diye okuyabilir." },
  { english: 'tea', turkish: 'çay', emoji: '🍵', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'Grandpa drinks tea.', exampleTr: 'Büyükbaba çay içer.', phonics: 'digraph-ea', frequency: 72, turkishTrap: "'tea' uzun ee sesiyle 'tii' — 'te' değil; 'ea' harfleri birlikte uzun ee sesi verir." },
];

// ─── LEVEL 1 — THEME 7: Classroom ─────────────────────────────────────────────
const level1Classroom: CurriculumWord[] = [
  { english: 'book', turkish: 'kitap', emoji: '📖', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'I read a book.', exampleTr: 'Kitap okuyorum.', phonics: 'short-oo', frequency: 90, turkishTrap: "'book' 'buk' gibi okunur — kısa oo; 'buuk' (uzun) değil. 'food' ve 'book' ikisi de 'oo' içerir ama farklı sesler verir." },
  { english: 'pen', turkish: 'tükenmez kalem', emoji: '🖊️', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'I write with a pen.', exampleTr: 'Tükenmez kalemle yazıyorum.', phonics: 'short-e', frequency: 75, turkishTrap: "'pen' (kalem) ve 'pan' (tava) benzer görünür — 'pen' kısa e, 'pan' kısa a; sesi değişince anlam değişir." },
  { english: 'desk', turkish: 'sıra/masa', emoji: '🖥️', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'I sit at my desk.', exampleTr: 'Sıramda oturuyorum.', phonics: 'short-e', frequency: 72, turkishTrap: "'desk' sonu 'sk' kümesiyle biter — Türkler sona sesli ekleyip 'deskı' diyebilir; 'desk' olarak bırak." },
  { english: 'chair', turkish: 'sandalye', emoji: '🪑', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'The chair is red.', exampleTr: 'Sandalye kırmızı.', phonics: 'r-controlled', frequency: 74, turkishTrap: "'chair' 'çer' gibi okunur — 'ch' harfleri 'ç' sesi verir; 'shair' değil." },
  { english: 'bag', turkish: 'çanta', emoji: '🎒', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'My bag is heavy.', exampleTr: 'Çantam ağır.', phonics: 'short-a', frequency: 78, turkishTrap: "'bag' kısa a ile 'bæg' — 'beg' değil (beg=yalvarmak); sesli değişince anlam tamamen değişir." },
  { english: 'door', turkish: 'kapı', emoji: '🚪', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'Open the door.', exampleTr: 'Kapıyı aç.', phonics: 'r-controlled', frequency: 82, turkishTrap: "'door' 'dor' gibi okunur — 'oo' burada tek uzun 'o' sesi verir; 'do-or' diye iki hecede okuma." },
  { english: 'board', turkish: 'tahta', emoji: '🟫', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'Write on the board.', exampleTr: 'Tahtaya yaz.', phonics: 'r-controlled', frequency: 68, turkishTrap: "'board' 'bord' gibi okunur — 'oa' harfleri uzun 'o' sesi verir; 'bored' (sıkılmış) ile aynı sesle söylenir, bağlama dikkat." },
  { english: 'class', turkish: 'sınıf', emoji: '🏫', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'We are in class.', exampleTr: 'Sınıftayız.', phonics: 'l-blend', frequency: 80, turkishTrap: "'in class' — 'at class' değil; sınıftayken 'in class', sınıfa gidiyorken 'to class' dersin." },
  { english: 'school', turkish: 'okul', emoji: '🏫', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'I like school.', exampleTr: 'Okulu seviyorum.', phonics: 'long-oo', frequency: 85, turkishTrap: "'I go to school' — makalesiz; 'I go to the school' dersen bina olarak o binayı kastediyorsun, okul için gidiyorsan 'to school' yeter." },
  { english: 'paper', turkish: 'kağıt', emoji: '📄', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'I draw on paper.', exampleTr: 'Kağıda çiziyorum.', phonics: 'long-a', frequency: 78, turkishTrap: "'paper' sayılamayan isim olarak 'kağıt malzeme' anlamında kullanılır — 'a paper' dersen 'bir gazete/sayfa'; 'some paper' dersen 'biraz kağıt'." },
  { english: 'ruler', turkish: 'cetvel', emoji: '📏', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'Use a ruler to draw a line.', exampleTr: 'Çizgi çizmek için cetvel kullan.', phonics: 'long-u', frequency: 58, turkishTrap: "'ruler' hem cetvel hem yönetici/lider anlamına gelir — bağlamda cetveldir, ama tarih dersinde 'a ruler' dersen 'bir hükümdar' anlamına gelir." },
  { english: 'eraser', turkish: 'silgi', emoji: '✏️', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'I use the eraser.', exampleTr: 'Silgiyi kullanıyorum.', phonics: 'long-a', frequency: 55, turkishTrap: "'eraser' Amerikan İngilizcesi; İngiliz İngilizcesinde 'rubber' denir — 'rubber' duyarsan 'eraser' aklına gelsin." },
];

// ─── LEVEL 1 — THEME 8: Home ──────────────────────────────────────────────────
const level1Home: CurriculumWord[] = [
  { english: 'house', turkish: 'ev', emoji: '🏠', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'I live in a house.', exampleTr: 'Bir evde yaşıyorum.', phonics: 'vowel-ou', frequency: 88, turkishTrap: "'house' (bina) ve 'home' (yuva/ev) farklı — 'house' fiziksel yapı, 'home' içinde yaşadığın, sevdiğin yer; ikisi zaman zaman birbirinin yerine kullanılabilir." },
  { english: 'room', turkish: 'oda', emoji: '🛋️', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'My room is clean.', exampleTr: 'Odam temiz.', phonics: 'long-oo', frequency: 82, turkishTrap: "'room' hem 'oda' hem 'yer/alan' anlamına gelir — 'There is no room' dersen 'yer yok' demektir, 'oda yok' değil." },
  { english: 'bed', turkish: 'yatak', emoji: '🛏️', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'I sleep in my bed.', exampleTr: 'Yatağımda uyuyorum.', phonics: 'short-e', frequency: 80,
    confusingWith: 'bad',
    turkishTrap: "'bed' kısa e sesi (yatak), 'bad' kısa a sesi (kötü) — Türkler ikisini aynı okur",
  },
  { english: 'table', turkish: 'masa', emoji: '🍽️', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'We eat at the table.', exampleTr: 'Masada yiyoruz.', phonics: 'long-a', frequency: 82, turkishTrap: "'at the table' — 'on the table' değil; yemek yiyince 'at', bir şey bırakınca 'on the table' dersin." },
  { english: 'window', turkish: 'pencere', emoji: '🪟', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'Open the window.', exampleTr: 'Pencereyi aç.', phonics: 'short-i', frequency: 78 },
  { english: 'kitchen', turkish: 'mutfak', emoji: '🍳', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'Mom is in the kitchen.', exampleTr: 'Annem mutfakta.', phonics: 'short-i', frequency: 75 },
  { english: 'garden', turkish: 'bahçe', emoji: '🌻', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'I play in the garden.', exampleTr: 'Bahçede oynuyorum.', phonics: 'r-controlled', frequency: 72 },
  { english: 'toy', turkish: 'oyuncak', emoji: '🧸', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'I love my toys.', exampleTr: 'Oyuncaklarımı seviyorum.', phonics: 'vowel-oy', frequency: 70 },
  { english: 'ball', turkish: 'top', emoji: '⚽', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'I kick the ball.', exampleTr: 'Topa vuruyorum.', phonics: 'vowel-all', frequency: 78 },
  { english: 'doll', turkish: 'oyuncak bebek', emoji: '🪆', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'She plays with her doll.', exampleTr: 'Oyuncak bebeğiyle oynuyor.', phonics: 'short-o', frequency: 60 },
  { english: 'car', turkish: 'araba', emoji: '🚗', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'I have a toy car.', exampleTr: 'Oyuncak arabam var.', phonics: 'r-controlled', frequency: 85 },
  { english: 'teddy', turkish: 'oyuncak ayı', emoji: '🧸', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'I hug my teddy.', exampleTr: 'Oyuncak ayıma sarılıyorum.', phonics: 'short-e', frequency: 55 },
];

// ─── LEVEL 1 — THEME 9: Clothes ───────────────────────────────────────────────
const level1Clothes: CurriculumWord[] = [
  { english: 'shirt', turkish: 'gömlek/tişört', emoji: '👕', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'I wear a shirt.', exampleTr: 'Gömlek giyiyorum.', phonics: 'digraph-ir', frequency: 76 },
  { english: 'pants', turkish: 'pantolon', emoji: '👖', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'My pants are blue.', exampleTr: 'Pantalonum mavi.', phonics: 'short-a', frequency: 74 },
  { english: 'shoes', turkish: 'ayakkabı', emoji: '👟', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'I put on my shoes.', exampleTr: 'Ayakkabımı giyiyorum.', phonics: 'long-oo', frequency: 80 },
  { english: 'hat', turkish: 'şapka', emoji: '🧢', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'I wear a hat.', exampleTr: 'Şapka takıyorum.', phonics: 'short-a', frequency: 72 },
  { english: 'coat', turkish: 'palto/mont', emoji: '🧥', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'Wear your coat — it is cold.', exampleTr: 'Paltonu giy, hava soğuk.', phonics: 'long-o', frequency: 70 },
  { english: 'dress', turkish: 'elbise', emoji: '👗', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'She wears a pretty dress.', exampleTr: 'Güzel bir elbise giyiyor.', phonics: 'r-blend', frequency: 72 },
  { english: 'socks', turkish: 'çorap', emoji: '🧦', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'My socks are warm.', exampleTr: 'Çoraplarım sıcak.', phonics: 'short-o', frequency: 68 },
  { english: 'boots', turkish: 'bot/çizme', emoji: '🥾', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'I wear boots in winter.', exampleTr: 'Kışın bot giyerim.', phonics: 'long-oo', frequency: 62 },
  { english: 'scarf', turkish: 'atkı/eşarp', emoji: '🧣', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'My scarf is red.', exampleTr: 'Atkım kırmızı.', phonics: 'r-controlled', frequency: 58 },
  { english: 'gloves', turkish: 'eldiven', emoji: '🧤', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'I wear gloves outside.', exampleTr: 'Dışarıda eldiven giyiyorum.', phonics: 'l-blend', frequency: 56 },
  { english: 'jacket', turkish: 'ceket', emoji: '🧥', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'Put on your jacket.', exampleTr: 'Ceketini giy.', phonics: 'short-a', frequency: 72 },
  { english: 'umbrella', turkish: 'şemsiye', emoji: '☂️', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'Take your umbrella.', exampleTr: 'Şemsiyeni al.', phonics: 'short-u', frequency: 62 },
];

// ─── LEVEL 1 — THEME 10: Nature ───────────────────────────────────────────────
const level1Nature: CurriculumWord[] = [
  { english: 'sun', turkish: 'güneş', emoji: '☀️', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'The sun is bright.', exampleTr: 'Güneş parlak.', phonics: 'short-u', frequency: 85 },
  { english: 'moon', turkish: 'ay', emoji: '🌙', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'The moon is full tonight.', exampleTr: 'Bu gece ay dolunay.', phonics: 'long-oo', frequency: 78 },
  { english: 'star', turkish: 'yıldız', emoji: '⭐', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'I see a star.', exampleTr: 'Bir yıldız görüyorum.', phonics: 'r-controlled', frequency: 80 },
  { english: 'tree', turkish: 'ağaç', emoji: '🌳', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'The tree is tall.', exampleTr: 'Ağaç yüksek.', phonics: 'digraph-ee', frequency: 82,
    confusingWith: 'three',
    turkishTrap: "'tree' iki harfli tr ile başlar, 'three' üç harfli thr ile — 'th' sesi farklı",
  },
  { english: 'flower', turkish: 'çiçek', emoji: '🌸', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'The flower is pretty.', exampleTr: 'Çiçek güzel.', phonics: 'vowel-ow', frequency: 72 },
  { english: 'rain', turkish: 'yağmur', emoji: '🌧️', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'I like the rain.', exampleTr: 'Yağmuru severim.', phonics: 'long-a', frequency: 76 },
  { english: 'snow', turkish: 'kar', emoji: '❄️', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'Snow is cold and white.', exampleTr: 'Kar soğuk ve beyaz.', phonics: 'long-o', frequency: 74 },
  { english: 'wind', turkish: 'rüzgar', emoji: '💨', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'The wind is blowing.', exampleTr: 'Rüzgar esiyor.', phonics: 'short-i', frequency: 72,
    confusingWith: 'wine',
    turkishTrap: "'wind' kısa i sesi (rüzgar), Türkler 'v' ile 'w' farkını duyamaz — her ikisi de 'v' gibi gelir",
  },
  { english: 'cloud', turkish: 'bulut', emoji: '☁️', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'There is a big cloud in the sky.', exampleTr: 'Gökyüzünde büyük bir bulut var.', phonics: 'vowel-ou', frequency: 70 },
  { english: 'sky', turkish: 'gökyüzü', emoji: '🌤️', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'The sky is blue.', exampleTr: 'Gökyüzü mavi.', phonics: 'long-i', frequency: 80 },
];

// ─── LEVEL 2 — Actions ────────────────────────────────────────────────────────
const level2Actions: CurriculumWord[] = [
  { english: 'run', turkish: 'koşmak', emoji: '🏃', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I run in the park.', exampleTr: 'Parkta koşuyorum.', phonics: 'short-u', frequency: 82 },
  { english: 'jump', turkish: 'zıplamak', emoji: '🤸', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'Can you jump high?', exampleTr: 'Yüksek zıplayabilir misin?', phonics: 'short-u', frequency: 72 },
  { english: 'walk', turkish: 'yürümek', emoji: '🚶', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I walk to school.', exampleTr: 'Okula yürüyorum.', phonics: 'l-blend', frequency: 85 },
  { english: 'sit', turkish: 'oturmak', emoji: '🪑', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'Please sit down.', exampleTr: 'Lütfen otur.', phonics: 'short-i', frequency: 82 },
  { english: 'eat', turkish: 'yemek', emoji: '🍽️', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I eat breakfast.', exampleTr: 'Kahvaltı yapıyorum.', phonics: 'digraph-ea', frequency: 90 },
  { english: 'drink', turkish: 'içmek', emoji: '🥤', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I drink water.', exampleTr: 'Su içiyorum.', phonics: 'r-blend', frequency: 85 },
  { english: 'sleep', turkish: 'uyumak', emoji: '😴', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I sleep at night.', exampleTr: 'Geceleri uyurum.', phonics: 'digraph-ee', frequency: 83 },
  { english: 'play', turkish: 'oynamak', emoji: '🎮', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'Let us play together.', exampleTr: 'Hadi birlikte oynayalım.', phonics: 'long-a', frequency: 88 },
  { english: 'read', turkish: 'okumak', emoji: '📖', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I read every day.', exampleTr: 'Her gün okuyorum.', phonics: 'digraph-ea', frequency: 86 },
  { english: 'write', turkish: 'yazmak', emoji: '✏️', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I write my name.', exampleTr: 'Adımı yazıyorum.', phonics: 'long-i', frequency: 82 },
  { english: 'sing', turkish: 'şarkı söylemek', emoji: '🎤', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I love to sing.', exampleTr: 'Şarkı söylemeyi seviyorum.', phonics: 'short-i', frequency: 70 },
  { english: 'dance', turkish: 'dans etmek', emoji: '💃', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'She can dance well.', exampleTr: 'Güzel dans edebilir.', phonics: 'long-a', frequency: 68 },
  { english: 'swim', turkish: 'yüzmek', emoji: '🏊', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I swim in the sea.', exampleTr: 'Denizde yüzüyorum.', phonics: 'short-i', frequency: 65 },
  { english: 'fly', turkish: 'uçmak', emoji: '✈️', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'Birds can fly.', exampleTr: 'Kuşlar uçabilir.', phonics: 'long-i', frequency: 72 },
  { english: 'climb', turkish: 'tırmanmak', emoji: '🧗', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I climb the tree.', exampleTr: 'Ağaca tırmanıyorum.', phonics: 'long-i', frequency: 60 },
];

// ─── LEVEL 2 — Feelings ───────────────────────────────────────────────────────
const level2Feelings: CurriculumWord[] = [
  { english: 'happy', turkish: 'mutlu', emoji: '😊', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'I am happy today.', exampleTr: 'Bugün mutluyum.', phonics: 'short-a', frequency: 88 },
  { english: 'sad', turkish: 'üzgün', emoji: '😢', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'The girl is sad.', exampleTr: 'Kız üzgün.', phonics: 'short-a', frequency: 82 },
  { english: 'angry', turkish: 'kızgın', emoji: '😠', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: "Don't be angry.", exampleTr: 'Kızma.', phonics: 'short-a', frequency: 78 },
  { english: 'scared', turkish: 'korkmuş', emoji: '😨', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'I am scared of spiders.', exampleTr: 'Örümceklerden korkuyorum.', phonics: 'r-controlled', frequency: 72 },
  { english: 'tired', turkish: 'yorgun', emoji: '😴', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'I am very tired.', exampleTr: 'Çok yorgunum.', phonics: 'long-i', frequency: 80 },
  { english: 'hungry', turkish: 'aç', emoji: '🍽️', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'I am hungry.', exampleTr: 'Açım.', phonics: 'short-u', frequency: 82 },
  { english: 'thirsty', turkish: 'susuz/susamış', emoji: '💧', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'Are you thirsty?', exampleTr: 'Susamış mısın?', phonics: 'digraph-ir', frequency: 70 },
  { english: 'cold', turkish: 'soğuk/üşümüş', emoji: '🥶', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'I am cold outside.', exampleTr: 'Dışarıda üşüyorum.', phonics: 'long-o', frequency: 82 },
  { english: 'hot', turkish: 'sıcak', emoji: '🥵', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'It is very hot today.', exampleTr: 'Bugün çok sıcak.', phonics: 'short-o', frequency: 80 },
  { english: 'sick', turkish: 'hasta', emoji: '🤒', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'I am sick today.', exampleTr: 'Bugün hastayım.', phonics: 'short-i', frequency: 75 },
];

// ─── LEVEL 2 — Adjectives ─────────────────────────────────────────────────────
const level2Adjectives: CurriculumWord[] = [
  { english: 'big', turkish: 'büyük', emoji: '🐘', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'The elephant is big.', exampleTr: 'Fil büyük.', phonics: 'short-i', frequency: 90 },
  { english: 'small', turkish: 'küçük', emoji: '🐭', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'The mouse is small.', exampleTr: 'Fare küçük.', phonics: 'l-blend', frequency: 88 },
  { english: 'tall', turkish: 'uzun boylu', emoji: '🦒', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'The giraffe is tall.', exampleTr: 'Zürafa uzun boylu.', phonics: 'vowel-all', frequency: 78 },
  { english: 'short', turkish: 'kısa/alçak', emoji: '📏', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'He is short.', exampleTr: 'O kısa boylu.', phonics: 'digraph-sh', frequency: 82 },
  { english: 'long', turkish: 'uzun', emoji: '🐍', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'The snake is long.', exampleTr: 'Yılan uzun.', phonics: 'long-o', frequency: 85 },
  { english: 'old', turkish: 'yaşlı/eski', emoji: '👴', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'Grandpa is old.', exampleTr: 'Büyükbaba yaşlı.', phonics: 'long-o', frequency: 86 },
  { english: 'new', turkish: 'yeni', emoji: '✨', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'I have a new book.', exampleTr: 'Yeni bir kitabım var.', phonics: 'long-u', frequency: 88 },
  { english: 'fast', turkish: 'hızlı', emoji: '🏎️', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'The car is fast.', exampleTr: 'Araba hızlı.', phonics: 'short-a', frequency: 78 },
  { english: 'slow', turkish: 'yavaş', emoji: '🐢', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'The turtle is slow.', exampleTr: 'Kaplumbağa yavaş.', phonics: 'long-o', frequency: 75 },
  { english: 'good', turkish: 'iyi', emoji: '👍', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'You are a good student.', exampleTr: 'İyi bir öğrencisin.', phonics: 'short-oo', frequency: 95 },
  { english: 'bad', turkish: 'kötü', emoji: '👎', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'It is a bad day.', exampleTr: 'Kötü bir gün.', phonics: 'short-a', frequency: 88,
    confusingWith: 'bed',
    turkishTrap: "'bad' kısa a sesi (kötü), 'bed' kısa e sesi (yatak) — Türkçede ikisi aynı gelir",
  },
];

// ─── LEVEL 2 — More Animals & Food ────────────────────────────────────────────
const level2MoreAnimals: CurriculumWord[] = [
  { english: 'lion', turkish: 'aslan', emoji: '🦁', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The lion is the king.', exampleTr: 'Aslan ormanın kralı.', phonics: 'long-i', frequency: 62 },
  { english: 'tiger', turkish: 'kaplan', emoji: '🐯', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The tiger has stripes.', exampleTr: 'Kaplanın çizgileri var.', phonics: 'long-i', frequency: 60 },
  { english: 'bear', turkish: 'ayı', emoji: '🐻', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The bear sleeps in winter.', exampleTr: 'Ayı kışın uyur.', phonics: 'r-controlled', frequency: 65 },
  { english: 'elephant', turkish: 'fil', emoji: '🐘', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'Elephants are big.', exampleTr: 'Filler büyük.', phonics: 'short-e', frequency: 68 },
  { english: 'monkey', turkish: 'maymun', emoji: '🐒', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'Monkeys climb trees.', exampleTr: 'Maymunlar ağaçlara tırmanır.', phonics: 'short-o', frequency: 62 },
  { english: 'penguin', turkish: 'penguen', emoji: '🐧', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'Penguins live in cold places.', exampleTr: 'Penguenler soğuk yerlerde yaşar.', phonics: 'short-e', frequency: 52 },
  { english: 'turtle', turkish: 'kaplumbağa', emoji: '🐢', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The turtle moves slowly.', exampleTr: 'Kaplumbağa yavaş hareket eder.', phonics: 'r-controlled', frequency: 55 },
  { english: 'fox', turkish: 'tilki', emoji: '🦊', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The fox is clever.', exampleTr: 'Tilki zekidir.', phonics: 'short-o', frequency: 55 },
  { english: 'wolf', turkish: 'kurt', emoji: '🐺', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The wolf howls at night.', exampleTr: 'Kurt geceleri ulur.', phonics: 'short-o', frequency: 58 },
  { english: 'giraffe', turkish: 'zürafa', emoji: '🦒', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The giraffe has a long neck.', exampleTr: 'Zürafanın uzun boynu var.', phonics: 'r-controlled', frequency: 50 },
  { english: 'crocodile', turkish: 'timsah', emoji: '🐊', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The crocodile has big teeth.', exampleTr: 'Timsahın büyük dişleri var.', phonics: 'long-o', frequency: 48 },
];

// ─── LEVEL 3 — Time ───────────────────────────────────────────────────────────
const level3Time: CurriculumWord[] = [
  { english: 'morning', turkish: 'sabah', emoji: '🌅', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'I wake up in the morning.', exampleTr: 'Sabahları uyanıyorum.', phonics: 'r-controlled', frequency: 85 },
  { english: 'afternoon', turkish: 'öğleden sonra', emoji: '☀️', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'I play in the afternoon.', exampleTr: 'Öğleden sonra oynuyorum.', phonics: 'r-controlled', frequency: 75 },
  { english: 'evening', turkish: 'akşam', emoji: '🌆', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'We eat dinner in the evening.', exampleTr: 'Akşamları akşam yemeği yeriz.', phonics: 'short-e', frequency: 78 },
  { english: 'night', turkish: 'gece', emoji: '🌙', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'Stars come out at night.', exampleTr: 'Yıldızlar gece çıkar.', phonics: 'long-i', frequency: 85 },
  { english: 'today', turkish: 'bugün', emoji: '📅', category: 'Time', level: 3, partOfSpeech: 'adverb', exampleEn: 'Today is Monday.', exampleTr: 'Bugün Pazartesi.', phonics: 'long-a', frequency: 90 },
  { english: 'tomorrow', turkish: 'yarın', emoji: '📆', category: 'Time', level: 3, partOfSpeech: 'adverb', exampleEn: 'See you tomorrow.', exampleTr: 'Yarın görüşürüz.', phonics: 'r-controlled', frequency: 85 },
  { english: 'yesterday', turkish: 'dün', emoji: '⬅️', category: 'Time', level: 3, partOfSpeech: 'adverb', exampleEn: 'Yesterday was fun.', exampleTr: 'Dün eğlenceliydi.', phonics: 'short-e', frequency: 82 },
  { english: 'week', turkish: 'hafta', emoji: '🗓️', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'There are seven days in a week.', exampleTr: 'Bir haftada yedi gün var.', phonics: 'digraph-ee', frequency: 85 },
  { english: 'month', turkish: 'ay', emoji: '📆', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'There are twelve months in a year.', exampleTr: 'Bir yılda on iki ay var.', phonics: 'vowel-ou', frequency: 83 },
  { english: 'year', turkish: 'yıl', emoji: '🎆', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'A new year is coming.', exampleTr: 'Yeni yıl geliyor.', phonics: 'r-controlled', frequency: 88 },
  { english: 'Monday', turkish: 'Pazartesi', emoji: '1️⃣', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'School starts on Monday.', exampleTr: 'Okul Pazartesi başlar.', phonics: 'short-u', frequency: 72 },
  { english: 'Friday', turkish: 'Cuma', emoji: '5️⃣', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'Friday is the last school day.', exampleTr: 'Cuma okul haftasının son günü.', phonics: 'long-i', frequency: 72 },
  { english: 'weekend', turkish: 'hafta sonu', emoji: '🎉', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'I play on the weekend.', exampleTr: 'Hafta sonu oynuyorum.', phonics: 'short-e', frequency: 78 },
  { english: 'now', turkish: 'şimdi', emoji: '⏱️', category: 'Time', level: 3, partOfSpeech: 'adverb', exampleEn: 'Come here now.', exampleTr: 'Şimdi buraya gel.', phonics: 'vowel-ow', frequency: 92 },
  { english: 'always', turkish: 'her zaman', emoji: '♾️', category: 'Time', level: 3, partOfSpeech: 'adverb', exampleEn: 'I always brush my teeth.', exampleTr: 'Her zaman dişlerimi fırçalarım.', phonics: 'vowel-all', frequency: 85 },
  { english: 'never', turkish: 'asla', emoji: '🚫', category: 'Time', level: 3, partOfSpeech: 'adverb', exampleEn: 'Never give up.', exampleTr: 'Asla vazgeçme.', phonics: 'short-e', frequency: 82 },
  { english: 'sometimes', turkish: 'bazen', emoji: '🔄', category: 'Time', level: 3, partOfSpeech: 'adverb', exampleEn: 'Sometimes I watch TV.', exampleTr: 'Bazen TV izlerim.', phonics: 'short-u', frequency: 80 },
];

// ─── LEVEL 3 — Places ─────────────────────────────────────────────────────────
const level3Places: CurriculumWord[] = [
  { english: 'park', turkish: 'park', emoji: '🌳', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'We play at the park.', exampleTr: 'Parkta oynuyoruz.', phonics: 'r-controlled', frequency: 78 },
  { english: 'store', turkish: 'mağaza', emoji: '🏪', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'We buy food at the store.', exampleTr: 'Mağazadan yiyecek satın alıyoruz.', phonics: 'r-controlled', frequency: 75 },
  { english: 'hospital', turkish: 'hastane', emoji: '🏥', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'Doctors work in a hospital.', exampleTr: 'Doktorlar hastanede çalışır.', phonics: 'short-o', frequency: 72 },
  { english: 'library', turkish: 'kütüphane', emoji: '📚', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'I borrow books from the library.', exampleTr: 'Kütüphaneden kitap alıyorum.', phonics: 'long-i', frequency: 68 },
  { english: 'restaurant', turkish: 'restoran', emoji: '🍽️', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'We eat at the restaurant.', exampleTr: 'Restoranda yiyoruz.', phonics: 'r-controlled', frequency: 70 },
  { english: 'beach', turkish: 'plaj', emoji: '🏖️', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'I swim at the beach.', exampleTr: 'Plajda yüzüyorum.', phonics: 'digraph-ea', frequency: 70 },
  { english: 'mountain', turkish: 'dağ', emoji: '⛰️', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'The mountain is high.', exampleTr: 'Dağ yüksek.', phonics: 'vowel-ou', frequency: 65 },
  { english: 'city', turkish: 'şehir', emoji: '🏙️', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'I live in a big city.', exampleTr: 'Büyük bir şehirde yaşıyorum.', phonics: 'short-i', frequency: 80 },
  { english: 'village', turkish: 'köy', emoji: '🏡', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'Grandma lives in a village.', exampleTr: 'Büyükannem köyde yaşıyor.', phonics: 'short-i', frequency: 62 },
  { english: 'airport', turkish: 'havalimanı', emoji: '✈️', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'We go to the airport.', exampleTr: 'Havalimanına gidiyoruz.', phonics: 'r-controlled', frequency: 65 },
  { english: 'supermarket', turkish: 'süpermarket', emoji: '🛒', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'We buy vegetables at the supermarket.', exampleTr: 'Süpermarketten sebze alıyoruz.', phonics: 'r-controlled', frequency: 68 },
];

// ─── LEVEL 3 — Descriptions ───────────────────────────────────────────────────
const level3Descriptions: CurriculumWord[] = [
  { english: 'beautiful', turkish: 'güzel', emoji: '🌺', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'That is a beautiful flower.', exampleTr: 'Bu çok güzel bir çiçek.', phonics: 'long-u', frequency: 80 },
  { english: 'dangerous', turkish: 'tehlikeli', emoji: '⚠️', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'This road is dangerous.', exampleTr: 'Bu yol tehlikeli.', phonics: 'long-a', frequency: 70 },
  { english: 'important', turkish: 'önemli', emoji: '❗', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'Health is important.', exampleTr: 'Sağlık önemli.', phonics: 'r-controlled', frequency: 85 },
  { english: 'interesting', turkish: 'ilginç', emoji: '🤔', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'This book is interesting.', exampleTr: 'Bu kitap ilginç.', phonics: 'r-controlled', frequency: 75 },
  { english: 'different', turkish: 'farklı', emoji: '🔀', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'We are all different.', exampleTr: 'Hepimiz farklıyız.', phonics: 'short-i', frequency: 80 },
  { english: 'difficult', turkish: 'zor', emoji: '😓', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'Maths is difficult.', exampleTr: 'Matematik zor.', phonics: 'short-i', frequency: 78 },
  { english: 'easy', turkish: 'kolay', emoji: '😊', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'English is easy.', exampleTr: 'İngilizce kolay.', phonics: 'long-e', frequency: 80 },
  { english: 'young', turkish: 'genç', emoji: '👶', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'She is young.', exampleTr: 'O genç.', phonics: 'short-u', frequency: 75 },
  { english: 'clean', turkish: 'temiz', emoji: '🧹', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'My room is clean.', exampleTr: 'Odam temiz.', phonics: 'digraph-ea', frequency: 78 },
  { english: 'dirty', turkish: 'kirli', emoji: '🟤', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'My shoes are dirty.', exampleTr: 'Ayakkabılarım kirli.', phonics: 'short-i', frequency: 72 },
  { english: 'quiet', turkish: 'sessiz', emoji: '🤫', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'Please be quiet.', exampleTr: 'Lütfen sessiz ol.', phonics: 'long-i', frequency: 75 },
  { english: 'loud', turkish: 'gürültülü', emoji: '🔊', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'The music is loud.', exampleTr: 'Müzik gürültülü.', phonics: 'vowel-ou', frequency: 70 },
];

// ─── LEVEL 4 — School Subjects ────────────────────────────────────────────────
const level4Subjects: CurriculumWord[] = [
  { english: 'maths', turkish: 'matematik', emoji: '🔢', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'I like maths.', exampleTr: 'Matematiği severim.', phonics: 'digraph-th', frequency: 72,
    turkishTrap: "'maths' deki 'th' sesi Türkçede yoktur — dil dişlere hafifçe değmeli",
  },
  { english: 'science', turkish: 'fen bilgisi', emoji: '🔬', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'Science is fun.', exampleTr: 'Fen bilgisi eğlenceli.', phonics: 'long-i', frequency: 70 },
  { english: 'history', turkish: 'tarih', emoji: '📜', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'History is interesting.', exampleTr: 'Tarih ilginç.', phonics: 'short-i', frequency: 68 },
  { english: 'art', turkish: 'resim/sanat', emoji: '🎨', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'I love art class.', exampleTr: 'Resim dersini seviyorum.', phonics: 'r-controlled', frequency: 75 },
  { english: 'music', turkish: 'müzik', emoji: '🎵', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'Music makes me happy.', exampleTr: 'Müzik beni mutlu eder.', phonics: 'long-u', frequency: 78 },
  { english: 'sport', turkish: 'spor', emoji: '⚽', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'Sport is healthy.', exampleTr: 'Spor sağlıklı.', phonics: 'r-controlled', frequency: 72 },
  { english: 'geography', turkish: 'coğrafya', emoji: '🗺️', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'Geography teaches us about the world.', exampleTr: 'Coğrafya bize dünyayı öğretir.', phonics: 'long-e', frequency: 58 },
  { english: 'computer', turkish: 'bilgisayar', emoji: '💻', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'I use the computer.', exampleTr: 'Bilgisayar kullanıyorum.', phonics: 'long-u', frequency: 82 },
];

// ─── LEVEL 4 — Hobbies & Sports ───────────────────────────────────────────────
const level4Hobbies: CurriculumWord[] = [
  { english: 'football', turkish: 'futbol', emoji: '⚽', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'I play football on Saturdays.', exampleTr: 'Cumartesi günleri futbol oynarım.', phonics: 'long-oo', frequency: 78 },
  { english: 'basketball', turkish: 'basketbol', emoji: '🏀', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'Basketball is my hobby.', exampleTr: 'Basketbol benim hobim.', phonics: 'short-a', frequency: 68 },
  { english: 'swimming', turkish: 'yüzme', emoji: '🏊', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'I go swimming on weekends.', exampleTr: 'Hafta sonları yüzmeye gidiyorum.', phonics: 'short-i', frequency: 65 },
  { english: 'drawing', turkish: 'resim çizme', emoji: '✏️', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'I love drawing.', exampleTr: 'Resim çizmeyi seviyorum.', phonics: 'vowel-aw', frequency: 62 },
  { english: 'reading', turkish: 'okuma', emoji: '📖', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'Reading is a great hobby.', exampleTr: 'Okuma harika bir hobi.', phonics: 'digraph-ea', frequency: 75 },
  { english: 'cooking', turkish: 'yemek pişirme', emoji: '🍳', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'I enjoy cooking.', exampleTr: 'Yemek pişirmeyi seviyorum.', phonics: 'long-oo', frequency: 68 },
  { english: 'gardening', turkish: 'bahçecilik', emoji: '🌻', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'My mom likes gardening.', exampleTr: 'Annem bahçeciliği sever.', phonics: 'r-controlled', frequency: 55 },
  { english: 'cycling', turkish: 'bisiklet sürme', emoji: '🚴', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'Cycling is fun.', exampleTr: 'Bisiklet sürmek eğlenceli.', phonics: 'long-i', frequency: 58 },
  { english: 'photography', turkish: 'fotoğrafçılık', emoji: '📷', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'Photography is my hobby.', exampleTr: 'Fotoğrafçılık benim hobim.', phonics: 'long-o', frequency: 52 },
  { english: 'hiking', turkish: 'yürüyüş', emoji: '🥾', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'We go hiking in summer.', exampleTr: 'Yazın yürüyüşe gidiyoruz.', phonics: 'long-i', frequency: 55 },
];

// ─── LEVEL 4 — Weather & Comparatives ────────────────────────────────────────
const level4Weather: CurriculumWord[] = [
  { english: 'sunny', turkish: 'güneşli', emoji: '☀️', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'It is a sunny day.', exampleTr: 'Güneşli bir gün.', phonics: 'short-u', frequency: 72 },
  { english: 'rainy', turkish: 'yağmurlu', emoji: '🌧️', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'It is rainy today.', exampleTr: 'Bugün yağmurlu.', phonics: 'long-a', frequency: 68 },
  { english: 'windy', turkish: 'rüzgarlı', emoji: '💨', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'It is windy outside.', exampleTr: 'Dışarısı rüzgarlı.', phonics: 'short-i', frequency: 65 },
  { english: 'cloudy', turkish: 'bulutlu', emoji: '☁️', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'The sky is cloudy.', exampleTr: 'Gökyüzü bulutlu.', phonics: 'vowel-ou', frequency: 65 },
  { english: 'snowy', turkish: 'karlı', emoji: '❄️', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'It is snowy in winter.', exampleTr: 'Kışın karlı.', phonics: 'long-o', frequency: 60 },
  { english: 'foggy', turkish: 'sisli', emoji: '🌫️', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'It is foggy this morning.', exampleTr: 'Bu sabah sisli.', phonics: 'short-o', frequency: 55 },
  { english: 'hotter', turkish: 'daha sıcak', emoji: '🔥', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'Summer is hotter than spring.', exampleTr: 'Yaz ilkbahardan daha sıcak.', phonics: 'short-o', frequency: 65 },
  { english: 'colder', turkish: 'daha soğuk', emoji: '🥶', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'Winter is colder than autumn.', exampleTr: 'Kış sonbahara göre daha soğuk.', phonics: 'long-o', frequency: 62 },
  { english: 'bigger', turkish: 'daha büyük', emoji: '⬆️', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'The elephant is bigger than the horse.', exampleTr: 'Fil attan daha büyük.', phonics: 'short-i', frequency: 68 },
  { english: 'better', turkish: 'daha iyi', emoji: '👍', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'Today is better than yesterday.', exampleTr: 'Bugün dünden daha iyi.', phonics: 'short-e', frequency: 85 },
  { english: 'temperature', turkish: 'sıcaklık', emoji: '🌡️', category: 'Weather', level: 4, partOfSpeech: 'noun', exampleEn: 'The temperature is low.', exampleTr: 'Sıcaklık düşük.', phonics: 'r-controlled', frequency: 70 },
  { english: 'forecast', turkish: 'hava tahmini', emoji: '📺', category: 'Weather', level: 4, partOfSpeech: 'noun', exampleEn: 'The forecast says rain.', exampleTr: 'Hava tahmini yağmur diyor.', phonics: 'r-controlled', frequency: 62 },
];

// ─── LEVEL 5 — Abstract Concepts ──────────────────────────────────────────────
const level5Abstract: CurriculumWord[] = [
  { english: 'freedom', turkish: 'özgürlük', emoji: '🕊️', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Freedom is very important.', exampleTr: 'Özgürlük çok önemli.', phonics: 'long-e', frequency: 75 },
  { english: 'knowledge', turkish: 'bilgi', emoji: '🧠', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Knowledge is power.', exampleTr: 'Bilgi güçtür.', phonics: 'long-o', frequency: 72 },
  { english: 'courage', turkish: 'cesaret', emoji: '🦁', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'You need courage.', exampleTr: 'Cesarete ihtiyacın var.', phonics: 'r-controlled', frequency: 65 },
  { english: 'kindness', turkish: 'iyilik', emoji: '💛', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Show kindness to others.', exampleTr: 'Başkalarına iyilik göster.', phonics: 'long-i', frequency: 68 },
  { english: 'patience', turkish: 'sabır', emoji: '⏳', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Patience is a great quality.', exampleTr: 'Sabır harika bir özelliktir.', phonics: 'long-a', frequency: 65 },
  { english: 'respect', turkish: 'saygı', emoji: '🤝', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Show respect to your elders.', exampleTr: 'Büyüklerine saygı göster.', phonics: 'short-e', frequency: 72 },
  { english: 'responsibility', turkish: 'sorumluluk', emoji: '📋', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Take responsibility.', exampleTr: 'Sorumluluk üstlen.', phonics: 'short-i', frequency: 65 },
  { english: 'trust', turkish: 'güven', emoji: '🤲', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Trust your friends.', exampleTr: 'Arkadaşlarına güven.', phonics: 'r-blend', frequency: 70 },
  { english: 'honesty', turkish: 'dürüstlük', emoji: '✅', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Honesty is the best policy.', exampleTr: 'Dürüstlük en iyi politikadır.', phonics: 'short-o', frequency: 65 },
  { english: 'creativity', turkish: 'yaratıcılık', emoji: '🎨', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Use your creativity.', exampleTr: 'Yaratıcılığını kullan.', phonics: 'long-e', frequency: 60 },
];

// ─── LEVEL 5 — Daily Routines ─────────────────────────────────────────────────
const level5Routines: CurriculumWord[] = [
  { english: 'wake up', turkish: 'uyanmak', emoji: '⏰', category: 'Routines', level: 5, partOfSpeech: 'verb', exampleEn: 'I wake up at seven.', exampleTr: 'Yedide uyanıyorum.', phonics: 'long-a', frequency: 80 },
  { english: 'brush', turkish: 'fırçalamak', emoji: '🪥', category: 'Routines', level: 5, partOfSpeech: 'verb', exampleEn: 'I brush my teeth.', exampleTr: 'Dişlerimi fırçalıyorum.', phonics: 'r-blend', frequency: 68 },
  { english: 'shower', turkish: 'duş almak', emoji: '🚿', category: 'Routines', level: 5, partOfSpeech: 'noun', exampleEn: 'I take a shower.', exampleTr: 'Duş alıyorum.', phonics: 'vowel-ow', frequency: 70 },
  { english: 'breakfast', turkish: 'kahvaltı', emoji: '🍳', category: 'Routines', level: 5, partOfSpeech: 'noun', exampleEn: 'I eat breakfast every morning.', exampleTr: 'Her sabah kahvaltı yapıyorum.', phonics: 'r-blend', frequency: 80 },
  { english: 'commute', turkish: 'yolculuk/işe gidiş', emoji: '🚌', category: 'Routines', level: 5, partOfSpeech: 'noun', exampleEn: 'My commute takes twenty minutes.', exampleTr: 'Yolculuğum yirmi dakika sürer.', phonics: 'long-u', frequency: 52 },
  { english: 'homework', turkish: 'ödev', emoji: '📝', category: 'Routines', level: 5, partOfSpeech: 'noun', exampleEn: 'I do my homework.', exampleTr: 'Ödevlerimi yapıyorum.', phonics: 'r-controlled', frequency: 72 },
  { english: 'dinner', turkish: 'akşam yemeği', emoji: '🍽️', category: 'Routines', level: 5, partOfSpeech: 'noun', exampleEn: 'We eat dinner together.', exampleTr: 'Birlikte akşam yemeği yiyoruz.', phonics: 'short-i', frequency: 78 },
  { english: 'bedtime', turkish: 'uyku vakti', emoji: '🛏️', category: 'Routines', level: 5, partOfSpeech: 'noun', exampleEn: 'Bedtime is at nine.', exampleTr: 'Uyku vakti dokuzda.', phonics: 'long-i', frequency: 60 },
  { english: 'exercise', turkish: 'egzersiz', emoji: '🏋️', category: 'Routines', level: 5, partOfSpeech: 'noun', exampleEn: 'Exercise keeps you healthy.', exampleTr: 'Egzersiz sağlıklı tutar.', phonics: 'r-controlled', frequency: 70 },
  { english: 'relax', turkish: 'dinlenmek', emoji: '😌', category: 'Routines', level: 5, partOfSpeech: 'verb', exampleEn: 'I relax after school.', exampleTr: 'Okuldan sonra dinleniyorum.', phonics: 'long-a', frequency: 68 },
];

// ─── LEVEL 5 — Question Words ────────────────────────────────────────────────
const level5Questions: CurriculumWord[] = [
  { english: 'what', turkish: 'ne', emoji: '❓', category: 'Questions', level: 5, partOfSpeech: 'pronoun', exampleEn: 'What is your name?', exampleTr: 'Adın ne?', phonics: 'digraph-wh', frequency: 95 },
  { english: 'where', turkish: 'nerede', emoji: '📍', category: 'Questions', level: 5, partOfSpeech: 'adverb', exampleEn: 'Where do you live?', exampleTr: 'Nerede yaşıyorsun?', phonics: 'digraph-wh', frequency: 90 },
  { english: 'when', turkish: 'ne zaman', emoji: '⏰', category: 'Questions', level: 5, partOfSpeech: 'adverb', exampleEn: 'When is your birthday?', exampleTr: 'Doğum günün ne zaman?', phonics: 'digraph-wh', frequency: 88 },
  { english: 'who', turkish: 'kim', emoji: '🙋', category: 'Questions', level: 5, partOfSpeech: 'pronoun', exampleEn: 'Who is your teacher?', exampleTr: 'Öğretmenin kim?', phonics: 'digraph-wh', frequency: 90 },
  { english: 'why', turkish: 'neden', emoji: '🤔', category: 'Questions', level: 5, partOfSpeech: 'adverb', exampleEn: 'Why are you sad?', exampleTr: 'Neden üzgünsün?', phonics: 'digraph-wh', frequency: 88 },
  { english: 'how', turkish: 'nasıl', emoji: '💡', category: 'Questions', level: 5, partOfSpeech: 'adverb', exampleEn: 'How are you?', exampleTr: 'Nasılsın?', phonics: 'vowel-ow', frequency: 92 },
  { english: 'which', turkish: 'hangi', emoji: '🔀', category: 'Questions', level: 5, partOfSpeech: 'pronoun', exampleEn: 'Which color do you like?', exampleTr: 'Hangi rengi seviyorsun?', phonics: 'digraph-wh', frequency: 82 },
];

// ─── LEVEL 5 — Past Tense (irregular & regular) ───────────────────────────────
const level5PastTense: CurriculumWord[] = [
  { english: 'walked', turkish: 'yürüdü', emoji: '🚶', category: 'PastTense', level: 5, partOfSpeech: 'verb', exampleEn: 'She walked to school.', exampleTr: 'O okula yürüdü.', phonics: 'vowel-aw', frequency: 75 },
  { english: 'played', turkish: 'oynadı', emoji: '🎮', category: 'PastTense', level: 5, partOfSpeech: 'verb', exampleEn: 'He played football.', exampleTr: 'Futbol oynadı.', phonics: 'long-a', frequency: 78 },
  { english: 'went', turkish: 'gitti', emoji: '🚪', category: 'PastTense', level: 5, partOfSpeech: 'verb', exampleEn: 'We went to the park.', exampleTr: 'Parka gittik.', phonics: 'short-e', frequency: 88 },
  { english: 'ate', turkish: 'yedi', emoji: '🍽️', category: 'PastTense', level: 5, partOfSpeech: 'verb', exampleEn: 'She ate her lunch.', exampleTr: 'Öğle yemeğini yedi.', phonics: 'long-a', frequency: 82 },
  { english: 'saw', turkish: 'gördü', emoji: '👀', category: 'PastTense', level: 5, partOfSpeech: 'verb', exampleEn: 'I saw a rainbow.', exampleTr: 'Bir gökkuşağı gördüm.', phonics: 'vowel-aw', frequency: 85 },
  { english: 'said', turkish: 'dedi', emoji: '💬', category: 'PastTense', level: 5, partOfSpeech: 'verb', exampleEn: 'She said hello.', exampleTr: 'Merhaba dedi.', phonics: 'long-a', frequency: 88 },
  { english: 'came', turkish: 'geldi', emoji: '🏠', category: 'PastTense', level: 5, partOfSpeech: 'verb', exampleEn: 'He came home.', exampleTr: 'Eve geldi.', phonics: 'long-a', frequency: 85 },
  { english: 'found', turkish: 'buldu', emoji: '🔍', category: 'PastTense', level: 5, partOfSpeech: 'verb', exampleEn: 'She found her book.', exampleTr: 'Kitabını buldu.', phonics: 'vowel-ou', frequency: 80 },
];

// ─── MASTER WORD LIST ─────────────────────────────────────────────────────────

export const curriculumWords: CurriculumWord[] = [
  // Level 1
  ...level1Animals,
  ...level1Colors,
  ...level1Numbers,
  ...level1Family,
  ...level1Body,
  ...level1Food,
  ...level1Classroom,
  ...level1Home,
  ...level1Clothes,
  ...level1Nature,
  // Level 2
  ...level2Actions,
  ...level2Feelings,
  ...level2Adjectives,
  ...level2MoreAnimals,
  // Level 3
  ...level3Time,
  ...level3Places,
  ...level3Descriptions,
  // Level 4
  ...level4Subjects,
  ...level4Hobbies,
  ...level4Weather,
  // Level 5
  ...level5Abstract,
  ...level5Routines,
  ...level5Questions,
  ...level5PastTense,
];

// ─── THEME ORDER (for progressive unlocking) ──────────────────────────────────

export const THEME_ORDER: Array<{ category: string; level: 1 | 2 | 3 | 4 | 5 }> = [
  { category: 'Animals', level: 1 },
  { category: 'Colors', level: 1 },
  { category: 'Numbers', level: 1 },
  { category: 'Family', level: 1 },
  { category: 'Body', level: 1 },
  { category: 'Food', level: 1 },
  { category: 'Classroom', level: 1 },
  { category: 'Home', level: 1 },
  { category: 'Clothes', level: 1 },
  { category: 'Nature', level: 1 },
  { category: 'Actions', level: 2 },
  { category: 'Feelings', level: 2 },
  { category: 'Adjectives', level: 2 },
  { category: 'Animals', level: 2 },
  { category: 'Time', level: 3 },
  { category: 'Places', level: 3 },
  { category: 'Descriptions', level: 3 },
  { category: 'Subjects', level: 4 },
  { category: 'Hobbies', level: 4 },
  { category: 'Weather', level: 4 },
  { category: 'Abstract', level: 5 },
  { category: 'Routines', level: 5 },
  { category: 'Questions', level: 5 },
  { category: 'PastTense', level: 5 },
];

// ─── GRAMMAR PATTERNS ────────────────────────────────────────────────────────

export const grammarPatterns: GrammarPattern[] = [
  // Level 1
  {
    id: 'l1-p1',
    pattern: 'I am ___',
    patternTr: 'Ben ___ ım/im/um/üm',
    level: 1,
    examples: [
      { en: 'I am happy.', tr: 'Mutluyum.' },
      { en: 'I am a student.', tr: 'Öğrenciyim.' },
      { en: 'I am tired.', tr: 'Yorgunum.' },
    ],
    blank: 'adjective or noun',
  },
  {
    id: 'l1-p2',
    pattern: 'This is a ___',
    patternTr: 'Bu bir ___',
    level: 1,
    examples: [
      { en: 'This is a cat.', tr: 'Bu bir kedi.' },
      { en: 'This is a book.', tr: 'Bu bir kitap.' },
      { en: 'This is a dog.', tr: 'Bu bir köpek.' },
    ],
    blank: 'noun',
  },
  {
    id: 'l1-p3',
    pattern: 'I like ___',
    patternTr: '___ severim',
    level: 1,
    examples: [
      { en: 'I like apples.', tr: 'Elmaları severim.' },
      { en: 'I like cats.', tr: 'Kedileri severim.' },
      { en: 'I like blue.', tr: 'Maviyi severim.' },
    ],
    blank: 'noun or adjective',
  },
  {
    id: 'l1-p4',
    pattern: 'I have a ___',
    patternTr: 'Benim bir ___ var',
    level: 1,
    examples: [
      { en: 'I have a dog.', tr: 'Bir köpeğim var.' },
      { en: 'I have a sister.', tr: 'Bir kız kardeşim var.' },
      { en: 'I have a book.', tr: 'Bir kitabım var.' },
    ],
    blank: 'noun',
  },
  {
    id: 'l1-p5',
    pattern: 'The ___ is ___',
    patternTr: '___ ___',
    level: 1,
    examples: [
      { en: 'The cat is big.', tr: 'Kedi büyük.' },
      { en: 'The dog is small.', tr: 'Köpek küçük.' },
      { en: 'The sun is yellow.', tr: 'Güneş sarı.' },
    ],
    blank: 'noun + adjective',
  },
  {
    id: 'l1-p6',
    pattern: 'I can ___',
    patternTr: '___ ebilirim/abiliyorum',
    level: 1,
    examples: [
      { en: 'I can run.', tr: 'Koşabilirim.' },
      { en: 'I can jump.', tr: 'Zıplayabilirim.' },
      { en: 'I can swim.', tr: 'Yüzebilirim.' },
    ],
    blank: 'verb',
  },
  // Level 2
  {
    id: 'l2-p1',
    pattern: 'Do you like ___?',
    patternTr: '___ sever misin?',
    level: 2,
    examples: [
      { en: 'Do you like cats? Yes, I do.', tr: 'Kedileri sever misin? Evet, severim.' },
      { en: 'Do you like football? No, I don\'t.', tr: 'Futbolu sever misin? Hayır, sevmem.' },
    ],
    blank: 'noun',
  },
  {
    id: 'l2-p2',
    pattern: 'Where is the ___?',
    patternTr: '___ nerede?',
    level: 2,
    examples: [
      { en: 'Where is the cat? It is under the table.', tr: 'Kedi nerede? Masanın altında.' },
      { en: 'Where is the book? It is on the desk.', tr: 'Kitap nerede? Sıranın üstünde.' },
    ],
    blank: 'noun',
  },
  {
    id: 'l2-p3',
    pattern: 'How many ___?',
    patternTr: 'Kaç tane ___?',
    level: 2,
    examples: [
      { en: 'How many cats? Three cats.', tr: 'Kaç tane kedi? Üç kedi.' },
      { en: 'How many birds? Five birds.', tr: 'Kaç tane kuş? Beş kuş.' },
    ],
    blank: 'plural noun',
  },
  {
    id: 'l2-p4',
    pattern: '___ is my favorite',
    patternTr: '___ en sevdiğim',
    level: 2,
    examples: [
      { en: 'Blue is my favorite color.', tr: 'Mavi en sevdiğim renk.' },
      { en: 'Football is my favorite sport.', tr: 'Futbol en sevdiğim spor.' },
    ],
    blank: 'noun',
  },
  {
    id: 'l2-p5',
    pattern: 'I want to ___',
    patternTr: '___ istiyorum',
    level: 2,
    examples: [
      { en: 'I want to play.', tr: 'Oynamak istiyorum.' },
      { en: 'I want to eat pizza.', tr: 'Pizza yemek istiyorum.' },
      { en: 'I want to sleep.', tr: 'Uyumak istiyorum.' },
    ],
    blank: 'verb',
  },
  {
    id: 'l2-p6',
    pattern: 'Let\'s ___!',
    patternTr: 'Hadi ___!',
    level: 2,
    examples: [
      { en: 'Let\'s play!', tr: 'Hadi oynayalım!' },
      { en: 'Let\'s go!', tr: 'Hadi gidelim!' },
      { en: 'Let\'s eat!', tr: 'Hadi yiyelim!' },
    ],
    blank: 'verb',
  },
  // Level 3
  {
    id: 'l3-p1',
    pattern: 'There is a ___ in ___',
    patternTr: '___de bir ___ var',
    level: 3,
    examples: [
      { en: 'There is a cat in the garden.', tr: 'Bahçede bir kedi var.' },
      { en: 'There is a park in the city.', tr: 'Şehirde bir park var.' },
    ],
    blank: 'noun + place',
  },
  {
    id: 'l3-p2',
    pattern: 'I go to ___ every ___',
    patternTr: 'Her ___ ___e giderim',
    level: 3,
    examples: [
      { en: 'I go to school every morning.', tr: 'Her sabah okula giderim.' },
      { en: 'I go to the park every weekend.', tr: 'Her hafta sonu parka giderim.' },
    ],
    blank: 'place + time',
  },
  {
    id: 'l3-p3',
    pattern: 'It is ___ today',
    patternTr: 'Bugün ___',
    level: 3,
    examples: [
      { en: 'It is sunny today.', tr: 'Bugün güneşli.' },
      { en: 'It is cold today.', tr: 'Bugün soğuk.' },
    ],
    blank: 'weather adjective',
  },
  {
    id: 'l3-p4',
    pattern: 'She/He is ___ than me',
    patternTr: 'O benden daha ___',
    level: 3,
    examples: [
      { en: 'She is taller than me.', tr: 'O benden daha uzun boylu.' },
      { en: 'He is faster than me.', tr: 'O benden daha hızlı.' },
    ],
    blank: 'comparative adjective',
  },
  {
    id: 'l3-p5',
    pattern: 'I usually ___ in the ___',
    patternTr: 'Genellikle ___ de/da ___',
    level: 3,
    examples: [
      { en: 'I usually read in the evening.', tr: 'Genellikle akşamları kitap okurum.' },
      { en: 'I usually play in the morning.', tr: 'Genellikle sabahları oynarım.' },
    ],
    blank: 'verb + time',
  },
  {
    id: 'l3-p6',
    pattern: 'My favorite ___ is ___',
    patternTr: 'En sevdiğim ___ ___',
    level: 3,
    examples: [
      { en: 'My favorite subject is art.', tr: 'En sevdiğim ders resim.' },
      { en: 'My favorite food is pizza.', tr: 'En sevdiğim yemek pizza.' },
    ],
    blank: 'category + item',
  },
  // Level 4
  {
    id: 'l4-p1',
    pattern: 'I have been ___ for ___',
    patternTr: '___ zamandır ___',
    level: 4,
    examples: [
      { en: 'I have been studying for two hours.', tr: 'İki saattir ders çalışıyorum.' },
      { en: 'I have been learning English for a year.', tr: 'Bir yıldır İngilizce öğreniyorum.' },
    ],
    blank: 'verb-ing + time',
  },
  {
    id: 'l4-p2',
    pattern: '___ is better than ___ because ___',
    patternTr: '___ ___ den daha iyi çünkü ___',
    level: 4,
    examples: [
      { en: 'Summer is better than winter because it is warm.', tr: 'Yaz kıştan daha iyi çünkü sıcak.' },
    ],
    blank: 'noun + noun + reason',
  },
  {
    id: 'l4-p3',
    pattern: 'Would you like to ___?',
    patternTr: '___ ister misin?',
    level: 4,
    examples: [
      { en: 'Would you like to play?', tr: 'Oynamak ister misin?' },
      { en: 'Would you like some tea?', tr: 'Biraz çay ister misin?' },
    ],
    blank: 'verb or noun',
  },
  {
    id: 'l4-p4',
    pattern: 'I think ___ because ___',
    patternTr: 'Bence ___ çünkü ___',
    level: 4,
    examples: [
      { en: 'I think reading is fun because you learn new things.', tr: 'Bence okumak eğlenceli çünkü yeni şeyler öğreniyorsun.' },
    ],
    blank: 'opinion + reason',
  },
  {
    id: 'l4-p5',
    pattern: 'When I grow up, I want to be a ___',
    patternTr: 'Büyüyünce ___ olmak istiyorum',
    level: 4,
    examples: [
      { en: 'When I grow up, I want to be a doctor.', tr: 'Büyüyünce doktor olmak istiyorum.' },
      { en: 'When I grow up, I want to be a teacher.', tr: 'Büyüyünce öğretmen olmak istiyorum.' },
    ],
    blank: 'profession',
  },
  {
    id: 'l4-p6',
    pattern: 'If it rains, I will ___',
    patternTr: 'Yağmur yağarsa ___ yapacağım',
    level: 4,
    examples: [
      { en: 'If it rains, I will stay inside.', tr: 'Yağmur yağarsa içeride kalacağım.' },
      { en: 'If it is sunny, I will play outside.', tr: 'Güneşliyse dışarıda oynayacağım.' },
    ],
    blank: 'verb',
  },
  // Level 5
  {
    id: 'l5-p1',
    pattern: 'Yesterday I ___',
    patternTr: 'Dün ___',
    level: 5,
    examples: [
      { en: 'Yesterday I went to the park.', tr: 'Dün parka gittim.' },
      { en: 'Yesterday I ate pizza.', tr: 'Dün pizza yedim.' },
    ],
    blank: 'past tense verb',
  },
  {
    id: 'l5-p2',
    pattern: 'What did you do ___?',
    patternTr: '___ ne yaptın?',
    level: 5,
    examples: [
      { en: 'What did you do yesterday?', tr: 'Dün ne yaptın?' },
      { en: 'What did you do at the weekend?', tr: 'Hafta sonu ne yaptın?' },
    ],
    blank: 'time word',
  },
  {
    id: 'l5-p3',
    pattern: 'I used to ___ when I was young',
    patternTr: 'Küçükken ___ yapardım',
    level: 5,
    examples: [
      { en: 'I used to play with toys when I was young.', tr: 'Küçükken oyuncaklarla oynardım.' },
    ],
    blank: 'verb',
  },
  {
    id: 'l5-p4',
    pattern: 'Could you please ___?',
    patternTr: 'Lütfen ___ yapar mısın?',
    level: 5,
    examples: [
      { en: 'Could you please help me?', tr: 'Lütfen bana yardım eder misin?' },
      { en: 'Could you please open the door?', tr: 'Lütfen kapıyı açar mısın?' },
    ],
    blank: 'verb',
  },
  {
    id: 'l5-p5',
    pattern: 'In my opinion, ___',
    patternTr: 'Benim görüşüme göre ___',
    level: 5,
    examples: [
      { en: 'In my opinion, kindness is the most important value.', tr: 'Benim görüşüme göre iyilik en önemli değerdir.' },
    ],
    blank: 'statement',
  },
  {
    id: 'l5-p6',
    pattern: 'Not only ___ but also ___',
    patternTr: 'Sadece ___ değil aynı zamanda ___',
    level: 5,
    examples: [
      { en: 'Not only is she smart but also kind.', tr: 'O sadece zeki değil aynı zamanda iyi kalpli.' },
    ],
    blank: 'quality + quality',
  },
];

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

/** Get all words for a specific grade level */
export function getWordsByLevel(level: 1 | 2 | 3 | 4 | 5): CurriculumWord[] {
  return curriculumWords.filter((w) => w.level === level);
}

/** Get all words in a specific category at a specific level */
export function getWordsByCategoryAndLevel(
  category: string,
  level: 1 | 2 | 3 | 4 | 5,
): CurriculumWord[] {
  return curriculumWords.filter(
    (w) => w.category === category && w.level === level,
  );
}

/** Get grammar patterns for a specific level */
export function getGrammarPatternsByLevel(level: 1 | 2 | 3 | 4 | 5): GrammarPattern[] {
  return grammarPatterns.filter((p) => p.level === level);
}

/** Get the next incomplete theme in curriculum order for a user,
 *  given an array of already-learned word english strings */
export function getNextTheme(
  learnedWords: string[],
): { category: string; level: 1 | 2 | 3 | 4 | 5 } | null {
  const learnedSet = new Set(learnedWords.map((w) => w.toLowerCase()));

  for (const theme of THEME_ORDER) {
    const themeWords = getWordsByCategoryAndLevel(theme.category, theme.level);
    const allLearned = themeWords.every((w) => learnedSet.has(w.english.toLowerCase()));
    if (!allLearned) return theme;
  }

  return null; // All themes complete!
}

/** Get completed theme count */
export function getCompletedThemeCount(learnedWords: string[]): number {
  const learnedSet = new Set(learnedWords.map((w) => w.toLowerCase()));
  return THEME_ORDER.filter(({ category, level }) => {
    const themeWords = getWordsByCategoryAndLevel(category, level);
    return themeWords.every((w) => learnedSet.has(w.english.toLowerCase()));
  }).length;
}

export const TOTAL_CURRICULUM_WORDS = curriculumWords.length;
export const TOTAL_THEMES = THEME_ORDER.length;
