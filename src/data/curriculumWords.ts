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
  { english: 'cat', turkish: 'kedi', emoji: '🐱', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'The cat is sleeping.', exampleTr: 'Kedi uyuyor.', phonics: 'short-a' },
  { english: 'dog', turkish: 'köpek', emoji: '🐶', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'My dog is big.', exampleTr: 'Benim köpeğim büyük.', phonics: 'short-o' },
  { english: 'bird', turkish: 'kuş', emoji: '🐦', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'The bird can fly.', exampleTr: 'Kuş uçabilir.', phonics: 'r-blend' },
  { english: 'fish', turkish: 'balık', emoji: '🐟', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'I have a fish.', exampleTr: 'Benim bir balığım var.', phonics: 'digraph-sh' },
  { english: 'frog', turkish: 'kurbağa', emoji: '🐸', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'The frog is green.', exampleTr: 'Kurbağa yeşil.', phonics: 'r-blend' },
  { english: 'duck', turkish: 'ördek', emoji: '🦆', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'The duck is in the pond.', exampleTr: 'Ördek gölette.', phonics: 'short-u' },
  { english: 'hen', turkish: 'tavuk', emoji: '🐔', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'The hen has eggs.', exampleTr: 'Tavuğun yumurtaları var.', phonics: 'short-e' },
  { english: 'pig', turkish: 'domuz', emoji: '🐷', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'The pig is pink.', exampleTr: 'Domuz pembe.', phonics: 'short-i' },
  { english: 'cow', turkish: 'inek', emoji: '🐄', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'The cow is in the field.', exampleTr: 'İnek tarlada.', phonics: 'vowel-ow' },
  { english: 'horse', turkish: 'at', emoji: '🐴', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'The horse runs fast.', exampleTr: 'At hızlı koşar.', phonics: 'r-controlled' },
  { english: 'sheep', turkish: 'koyun', emoji: '🐑', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'The sheep is white.', exampleTr: 'Koyun beyaz.', phonics: 'digraph-ee' },
  { english: 'rabbit', turkish: 'tavşan', emoji: '🐰', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'The rabbit is soft.', exampleTr: 'Tavşan yumuşak.', phonics: 'short-a' },
  { english: 'mouse', turkish: 'fare', emoji: '🐭', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'The mouse is small.', exampleTr: 'Fare küçük.', phonics: 'vowel-ou' },
  { english: 'bee', turkish: 'arı', emoji: '🐝', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'The bee makes honey.', exampleTr: 'Arı bal yapar.', phonics: 'digraph-ee' },
  { english: 'ant', turkish: 'karınca', emoji: '🐜', category: 'Animals', level: 1, partOfSpeech: 'noun', exampleEn: 'The ant is tiny.', exampleTr: 'Karınca çok küçük.', phonics: 'short-a' },
];

// ─── LEVEL 1 — THEME 2: Colors ────────────────────────────────────────────────
const level1Colors: CurriculumWord[] = [
  { english: 'red', turkish: 'kırmızı', emoji: '🔴', category: 'Colors', level: 1, partOfSpeech: 'adjective', exampleEn: 'I like red apples.', exampleTr: 'Kırmızı elmaları severim.', phonics: 'short-e' },
  { english: 'blue', turkish: 'mavi', emoji: '🔵', category: 'Colors', level: 1, partOfSpeech: 'adjective', exampleEn: 'The sky is blue.', exampleTr: 'Gökyüzü mavi.', phonics: 'long-u' },
  { english: 'green', turkish: 'yeşil', emoji: '🟢', category: 'Colors', level: 1, partOfSpeech: 'adjective', exampleEn: 'Grass is green.', exampleTr: 'Çimen yeşil.', phonics: 'digraph-ee' },
  { english: 'yellow', turkish: 'sarı', emoji: '🟡', category: 'Colors', level: 1, partOfSpeech: 'adjective', exampleEn: 'The sun is yellow.', exampleTr: 'Güneş sarı.', phonics: 'digraph-ow' },
  { english: 'pink', turkish: 'pembe', emoji: '🩷', category: 'Colors', level: 1, partOfSpeech: 'adjective', exampleEn: 'Her dress is pink.', exampleTr: 'Onun elbisesi pembe.', phonics: 'short-i' },
  { english: 'orange', turkish: 'turuncu', emoji: '🟠', category: 'Colors', level: 1, partOfSpeech: 'adjective', exampleEn: 'Carrots are orange.', exampleTr: 'Havuçlar turuncu.', phonics: 'r-controlled' },
  { english: 'purple', turkish: 'mor', emoji: '🟣', category: 'Colors', level: 1, partOfSpeech: 'adjective', exampleEn: 'I have a purple bag.', exampleTr: 'Benim mor bir çantam var.', phonics: 'r-controlled' },
  { english: 'black', turkish: 'siyah', emoji: '⚫', category: 'Colors', level: 1, partOfSpeech: 'adjective', exampleEn: 'The cat is black.', exampleTr: 'Kedi siyah.', phonics: 'l-blend' },
  { english: 'white', turkish: 'beyaz', emoji: '⚪', category: 'Colors', level: 1, partOfSpeech: 'adjective', exampleEn: 'Snow is white.', exampleTr: 'Kar beyaz.', phonics: 'long-i' },
  { english: 'brown', turkish: 'kahverengi', emoji: '🟤', category: 'Colors', level: 1, partOfSpeech: 'adjective', exampleEn: 'The bear is brown.', exampleTr: 'Ayı kahverengi.', phonics: 'vowel-ow' },
  { english: 'gray', turkish: 'gri', emoji: '🩶', category: 'Colors', level: 1, partOfSpeech: 'adjective', exampleEn: 'Elephants are gray.', exampleTr: 'Filler gri.', phonics: 'long-a' },
  { english: 'rainbow', turkish: 'gökkuşağı', emoji: '🌈', category: 'Colors', level: 1, partOfSpeech: 'noun', exampleEn: 'I see a rainbow!', exampleTr: 'Gökkuşağı görüyorum!', phonics: 'long-a' },
];

// ─── LEVEL 1 — THEME 3: Numbers ───────────────────────────────────────────────
const level1Numbers: CurriculumWord[] = [
  { english: 'one', turkish: 'bir', emoji: '1️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun', exampleEn: 'I have one cat.', exampleTr: 'Benim bir kedim var.', phonics: 'long-o' },
  { english: 'two', turkish: 'iki', emoji: '2️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun', exampleEn: 'I have two hands.', exampleTr: 'İki elim var.', phonics: 'long-oo' },
  { english: 'three', turkish: 'üç', emoji: '3️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun', exampleEn: 'I see three birds.', exampleTr: 'Üç kuş görüyorum.', phonics: 'digraph-ee' },
  { english: 'four', turkish: 'dört', emoji: '4️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun', exampleEn: 'A dog has four legs.', exampleTr: 'Bir köpeğin dört ayağı var.', phonics: 'r-controlled' },
  { english: 'five', turkish: 'beş', emoji: '5️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun', exampleEn: 'I have five fingers.', exampleTr: 'Beş parmağım var.', phonics: 'long-i' },
  { english: 'six', turkish: 'altı', emoji: '6️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun', exampleEn: 'Six eggs are in the box.', exampleTr: 'Kutuda altı yumurta var.', phonics: 'short-i' },
  { english: 'seven', turkish: 'yedi', emoji: '7️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun', exampleEn: 'There are seven days.', exampleTr: 'Yedi gün var.', phonics: 'short-e' },
  { english: 'eight', turkish: 'sekiz', emoji: '8️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun', exampleEn: 'She is eight years old.', exampleTr: 'O sekiz yaşında.', phonics: 'long-a' },
  { english: 'nine', turkish: 'dokuz', emoji: '9️⃣', category: 'Numbers', level: 1, partOfSpeech: 'noun', exampleEn: 'Nine stars in the sky.', exampleTr: 'Gökyüzünde dokuz yıldız.', phonics: 'long-i' },
  { english: 'ten', turkish: 'on', emoji: '🔟', category: 'Numbers', level: 1, partOfSpeech: 'noun', exampleEn: 'Count to ten!', exampleTr: 'One kadar say!', phonics: 'short-e' },
  { english: 'first', turkish: 'birinci', emoji: '🥇', category: 'Numbers', level: 1, partOfSpeech: 'adjective', exampleEn: 'She is first in class.', exampleTr: 'O sınıfta birinci.', phonics: 'r-blend' },
  { english: 'second', turkish: 'ikinci', emoji: '🥈', category: 'Numbers', level: 1, partOfSpeech: 'adjective', exampleEn: 'He is second.', exampleTr: 'O ikinci.', phonics: 'short-e' },
  { english: 'last', turkish: 'son', emoji: '🔚', category: 'Numbers', level: 1, partOfSpeech: 'adjective', exampleEn: 'This is the last cookie.', exampleTr: 'Bu son kurabiye.', phonics: 'l-blend' },
  { english: 'many', turkish: 'çok', emoji: '✨', category: 'Numbers', level: 1, partOfSpeech: 'adjective', exampleEn: 'There are many stars.', exampleTr: 'Çok yıldız var.', phonics: 'short-a' },
  { english: 'few', turkish: 'birkaç', emoji: '🔢', category: 'Numbers', level: 1, partOfSpeech: 'adjective', exampleEn: 'A few dogs play.', exampleTr: 'Birkaç köpek oynuyor.', phonics: 'long-u' },
];

// ─── LEVEL 1 — THEME 4: Family ────────────────────────────────────────────────
const level1Family: CurriculumWord[] = [
  { english: 'mom', turkish: 'anne', emoji: '👩', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'My mom is kind.', exampleTr: 'Annem çok iyi kalpli.', phonics: 'short-o' },
  { english: 'dad', turkish: 'baba', emoji: '👨', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'My dad is tall.', exampleTr: 'Babam uzun boylu.', phonics: 'short-a' },
  { english: 'sister', turkish: 'kız kardeş', emoji: '👧', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'My sister sings.', exampleTr: 'Kız kardeşim şarkı söyler.', phonics: 'r-controlled' },
  { english: 'brother', turkish: 'erkek kardeş', emoji: '👦', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'My brother plays football.', exampleTr: 'Erkek kardeşim futbol oynar.', phonics: 'r-blend' },
  { english: 'baby', turkish: 'bebek', emoji: '👶', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'The baby is sleeping.', exampleTr: 'Bebek uyuyor.', phonics: 'long-a' },
  { english: 'grandma', turkish: 'büyükanne', emoji: '👵', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'Grandma makes cookies.', exampleTr: 'Büyükanne kurabiye yapar.', phonics: 'r-blend' },
  { english: 'grandpa', turkish: 'büyükbaba', emoji: '👴', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'Grandpa reads books.', exampleTr: 'Büyükbaba kitap okur.', phonics: 'r-blend' },
  { english: 'family', turkish: 'aile', emoji: '👨‍👩‍👧‍👦', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'I love my family.', exampleTr: 'Ailemi seviyorum.', phonics: 'long-a' },
  { english: 'friend', turkish: 'arkadaş', emoji: '🤝', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'She is my best friend.', exampleTr: 'O benim en iyi arkadaşım.', phonics: 'r-blend' },
  { english: 'boy', turkish: 'erkek çocuk', emoji: '👦', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'The boy is happy.', exampleTr: 'Erkek çocuk mutlu.', phonics: 'vowel-oy' },
  { english: 'girl', turkish: 'kız çocuk', emoji: '👧', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'The girl has a doll.', exampleTr: 'Kız çocuğunun bir bebeği var.', phonics: 'r-controlled' },
  { english: 'teacher', turkish: 'öğretmen', emoji: '👩‍🏫', category: 'Family', level: 1, partOfSpeech: 'noun', exampleEn: 'My teacher is nice.', exampleTr: 'Öğretmenim çok güzel.', phonics: 'digraph-ea' },
];

// ─── LEVEL 1 — THEME 5: Body ──────────────────────────────────────────────────
const level1Body: CurriculumWord[] = [
  { english: 'head', turkish: 'baş', emoji: '🧠', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'I put the hat on my head.', exampleTr: 'Şapkayı başıma koydum.', phonics: 'digraph-ea' },
  { english: 'eye', turkish: 'göz', emoji: '👁️', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'I have two eyes.', exampleTr: 'İki gözüm var.', phonics: 'long-i' },
  { english: 'ear', turkish: 'kulak', emoji: '👂', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'I hear with my ear.', exampleTr: 'Kulağımla duyarım.', phonics: 'digraph-ear' },
  { english: 'nose', turkish: 'burun', emoji: '👃', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'My nose is cold.', exampleTr: 'Burnum soğuk.', phonics: 'long-o' },
  { english: 'mouth', turkish: 'ağız', emoji: '👄', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'I eat with my mouth.', exampleTr: 'Ağzımla yerim.', phonics: 'vowel-ou' },
  { english: 'hand', turkish: 'el', emoji: '✋', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'Wash your hands.', exampleTr: 'Ellerini yıka.', phonics: 'short-a' },
  { english: 'foot', turkish: 'ayak', emoji: '🦶', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'My foot hurts.', exampleTr: 'Ayağım acıyor.', phonics: 'long-oo' },
  { english: 'leg', turkish: 'bacak', emoji: '🦵', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'Dogs have four legs.', exampleTr: 'Köpeklerin dört bacağı var.', phonics: 'short-e' },
  { english: 'arm', turkish: 'kol', emoji: '💪', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'I can carry with my arm.', exampleTr: 'Kolumla taşıyabilirim.', phonics: 'r-controlled' },
  { english: 'hair', turkish: 'saç', emoji: '💇', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'Her hair is long.', exampleTr: 'Onun saçı uzun.', phonics: 'r-controlled' },
  { english: 'face', turkish: 'yüz', emoji: '😊', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'She has a happy face.', exampleTr: 'Onun mutlu bir yüzü var.', phonics: 'long-a' },
  { english: 'tooth', turkish: 'diş', emoji: '🦷', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'Brush your teeth.', exampleTr: 'Dişlerini fırçala.', phonics: 'long-oo' },
  { english: 'finger', turkish: 'parmak', emoji: '☝️', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'I have ten fingers.', exampleTr: 'On parmağım var.', phonics: 'r-controlled' },
  { english: 'knee', turkish: 'diz', emoji: '🦵', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'My knee is sore.', exampleTr: 'Dizim ağrıyor.', phonics: 'digraph-ee' },
  { english: 'tummy', turkish: 'göbek/karın', emoji: '🫃', category: 'Body', level: 1, partOfSpeech: 'noun', exampleEn: 'My tummy is full.', exampleTr: 'Karnım dolu.', phonics: 'short-u' },
];

// ─── LEVEL 1 — THEME 6: Food ──────────────────────────────────────────────────
const level1Food: CurriculumWord[] = [
  { english: 'apple', turkish: 'elma', emoji: '🍎', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'I eat an apple.', exampleTr: 'Bir elma yiyorum.', phonics: 'short-a' },
  { english: 'bread', turkish: 'ekmek', emoji: '🍞', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'I eat bread every day.', exampleTr: 'Her gün ekmek yerim.', phonics: 'r-blend' },
  { english: 'milk', turkish: 'süt', emoji: '🥛', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'Milk is good for you.', exampleTr: 'Süt sağlıklıdır.', phonics: 'l-blend' },
  { english: 'water', turkish: 'su', emoji: '💧', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'Drink your water.', exampleTr: 'Suyunu iç.', phonics: 'r-controlled' },
  { english: 'egg', turkish: 'yumurta', emoji: '🥚', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'I eat an egg for breakfast.', exampleTr: 'Kahvaltıda yumurta yerim.', phonics: 'short-e' },
  { english: 'cheese', turkish: 'peynir', emoji: '🧀', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'I like cheese.', exampleTr: 'Peyniri severim.', phonics: 'digraph-ee' },
  { english: 'rice', turkish: 'pilav', emoji: '🍚', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'We eat rice for dinner.', exampleTr: 'Akşam yemeğinde pilav yeriz.', phonics: 'long-i' },
  { english: 'chicken', turkish: 'tavuk', emoji: '🍗', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'I like chicken soup.', exampleTr: 'Tavuk çorbasını severim.', phonics: 'short-i' },
  { english: 'banana', turkish: 'muz', emoji: '🍌', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'Monkeys eat bananas.', exampleTr: 'Maymunlar muz yer.', phonics: 'short-a' },
  { english: 'orange', turkish: 'portakal', emoji: '🍊', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'I drink orange juice.', exampleTr: 'Portakal suyu içiyorum.', phonics: 'r-controlled' },
  { english: 'cake', turkish: 'pasta', emoji: '🎂', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'We have cake on birthdays.', exampleTr: 'Doğum günlerinde pasta yeriz.', phonics: 'long-a' },
  { english: 'cookie', turkish: 'kurabiye', emoji: '🍪', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'The cookie is sweet.', exampleTr: 'Kurabiye tatlı.', phonics: 'long-oo' },
  { english: 'juice', turkish: 'meyve suyu', emoji: '🧃', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'I drink juice.', exampleTr: 'Meyve suyu içiyorum.', phonics: 'long-u' },
  { english: 'soup', turkish: 'çorba', emoji: '🍲', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'Mom makes soup.', exampleTr: 'Annem çorba yapar.', phonics: 'long-oo' },
  { english: 'tea', turkish: 'çay', emoji: '🍵', category: 'Food', level: 1, partOfSpeech: 'noun', exampleEn: 'Grandpa drinks tea.', exampleTr: 'Büyükbaba çay içer.', phonics: 'digraph-ea' },
];

// ─── LEVEL 1 — THEME 7: Classroom ─────────────────────────────────────────────
const level1Classroom: CurriculumWord[] = [
  { english: 'book', turkish: 'kitap', emoji: '📖', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'I read a book.', exampleTr: 'Kitap okuyorum.', phonics: 'long-oo' },
  { english: 'pen', turkish: 'kalem', emoji: '🖊️', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'I write with a pen.', exampleTr: 'Kalemle yazıyorum.', phonics: 'short-e' },
  { english: 'desk', turkish: 'sıra', emoji: '🪑', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'I sit at my desk.', exampleTr: 'Sıramda oturuyorum.', phonics: 'short-e' },
  { english: 'chair', turkish: 'sandalye', emoji: '🪑', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'The chair is red.', exampleTr: 'Sandalye kırmızı.', phonics: 'r-controlled' },
  { english: 'bag', turkish: 'çanta', emoji: '🎒', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'My bag is heavy.', exampleTr: 'Çantam ağır.', phonics: 'short-a' },
  { english: 'door', turkish: 'kapı', emoji: '🚪', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'Open the door.', exampleTr: 'Kapıyı aç.', phonics: 'r-controlled' },
  { english: 'board', turkish: 'tahta', emoji: '📋', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'Write on the board.', exampleTr: 'Tahtaya yaz.', phonics: 'r-controlled' },
  { english: 'class', turkish: 'sınıf', emoji: '🏫', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'We are in class.', exampleTr: 'Sınıftayız.', phonics: 'l-blend' },
  { english: 'school', turkish: 'okul', emoji: '🏫', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'I like school.', exampleTr: 'Okulu seviyorum.', phonics: 'long-oo' },
  { english: 'paper', turkish: 'kağıt', emoji: '📄', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'I draw on paper.', exampleTr: 'Kağıda çiziyorum.', phonics: 'long-a' },
  { english: 'ruler', turkish: 'cetvel', emoji: '📏', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'Use a ruler to draw a line.', exampleTr: 'Çizgi çizmek için cetvel kullan.', phonics: 'long-u' },
  { english: 'eraser', turkish: 'silgi', emoji: '🧹', category: 'Classroom', level: 1, partOfSpeech: 'noun', exampleEn: 'I use the eraser.', exampleTr: 'Silgiyi kullanıyorum.', phonics: 'long-a' },
];

// ─── LEVEL 1 — THEME 8: Home ──────────────────────────────────────────────────
const level1Home: CurriculumWord[] = [
  { english: 'house', turkish: 'ev', emoji: '🏠', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'I live in a house.', exampleTr: 'Bir evde yaşıyorum.', phonics: 'vowel-ou' },
  { english: 'room', turkish: 'oda', emoji: '🛋️', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'My room is clean.', exampleTr: 'Odam temiz.', phonics: 'long-oo' },
  { english: 'bed', turkish: 'yatak', emoji: '🛏️', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'I sleep in my bed.', exampleTr: 'Yatağımda uyuyorum.', phonics: 'short-e' },
  { english: 'table', turkish: 'masa', emoji: '🪑', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'We eat at the table.', exampleTr: 'Masada yiyoruz.', phonics: 'long-a' },
  { english: 'window', turkish: 'pencere', emoji: '🪟', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'Open the window.', exampleTr: 'Pencereyi aç.', phonics: 'short-i' },
  { english: 'kitchen', turkish: 'mutfak', emoji: '🍳', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'Mom is in the kitchen.', exampleTr: 'Annem mutfakta.', phonics: 'short-i' },
  { english: 'garden', turkish: 'bahçe', emoji: '🌻', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'I play in the garden.', exampleTr: 'Bahçede oynuyorum.', phonics: 'r-controlled' },
  { english: 'toy', turkish: 'oyuncak', emoji: '🧸', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'I love my toys.', exampleTr: 'Oyuncaklarımı seviyorum.', phonics: 'vowel-oy' },
  { english: 'ball', turkish: 'top', emoji: '⚽', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'I kick the ball.', exampleTr: 'Topa vuruyorum.', phonics: 'vowel-all' },
  { english: 'doll', turkish: 'bebek', emoji: '🪆', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'She plays with her doll.', exampleTr: 'Bebeğiyle oynuyor.', phonics: 'short-o' },
  { english: 'car', turkish: 'araba', emoji: '🚗', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'I have a toy car.', exampleTr: 'Oyuncak arabam var.', phonics: 'r-controlled' },
  { english: 'teddy', turkish: 'oyuncak ayı', emoji: '🧸', category: 'Home', level: 1, partOfSpeech: 'noun', exampleEn: 'I hug my teddy.', exampleTr: 'Oyuncak ayıma sarılıyorum.', phonics: 'short-e' },
];

// ─── LEVEL 1 — THEME 9: Clothes ───────────────────────────────────────────────
const level1Clothes: CurriculumWord[] = [
  { english: 'shirt', turkish: 'gömlek', emoji: '👕', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'I wear a shirt.', exampleTr: 'Gömlek giyiyorum.', phonics: 'digraph-ir' },
  { english: 'pants', turkish: 'pantolon', emoji: '👖', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'My pants are blue.', exampleTr: 'Pantolonu mavi.', phonics: 'short-a' },
  { english: 'shoes', turkish: 'ayakkabı', emoji: '👟', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'I put on my shoes.', exampleTr: 'Ayakkabımı giyiyorum.', phonics: 'long-oo' },
  { english: 'hat', turkish: 'şapka', emoji: '🎩', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'I wear a hat.', exampleTr: 'Şapka takıyorum.', phonics: 'short-a' },
  { english: 'coat', turkish: 'palto', emoji: '🧥', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'Wear your coat — it is cold.', exampleTr: 'Paltonu giy, hava soğuk.', phonics: 'long-o' },
  { english: 'dress', turkish: 'elbise', emoji: '👗', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'She wears a pretty dress.', exampleTr: 'Güzel bir elbise giyiyor.', phonics: 'r-blend' },
  { english: 'socks', turkish: 'çorap', emoji: '🧦', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'My socks are warm.', exampleTr: 'Çoraplarım sıcak.', phonics: 'short-o' },
  { english: 'boots', turkish: 'bot', emoji: '🥾', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'I wear boots in winter.', exampleTr: 'Kışın bot giyerim.', phonics: 'long-oo' },
  { english: 'scarf', turkish: 'atkı', emoji: '🧣', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'My scarf is red.', exampleTr: 'Atkım kırmızı.', phonics: 'r-controlled' },
  { english: 'gloves', turkish: 'eldiven', emoji: '🧤', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'I wear gloves outside.', exampleTr: 'Dışarıda eldiven giyiyorum.', phonics: 'l-blend' },
  { english: 'jacket', turkish: 'ceket', emoji: '🧥', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'Put on your jacket.', exampleTr: 'Ceketini giy.', phonics: 'short-a' },
  { english: 'umbrella', turkish: 'şemsiye', emoji: '☂️', category: 'Clothes', level: 1, partOfSpeech: 'noun', exampleEn: 'Take your umbrella.', exampleTr: 'Şemsiyeni al.', phonics: 'short-u' },
];

// ─── LEVEL 1 — THEME 10: Nature ───────────────────────────────────────────────
const level1Nature: CurriculumWord[] = [
  { english: 'sun', turkish: 'güneş', emoji: '☀️', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'The sun is bright.', exampleTr: 'Güneş parlıyor.', phonics: 'short-u' },
  { english: 'moon', turkish: 'ay', emoji: '🌙', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'The moon is full.', exampleTr: 'Ay dolunay.', phonics: 'long-oo' },
  { english: 'star', turkish: 'yıldız', emoji: '⭐', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'I see a star.', exampleTr: 'Bir yıldız görüyorum.', phonics: 'r-controlled' },
  { english: 'tree', turkish: 'ağaç', emoji: '🌳', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'The tree is tall.', exampleTr: 'Ağaç uzun boylu.', phonics: 'digraph-ee' },
  { english: 'flower', turkish: 'çiçek', emoji: '🌸', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'The flower is pretty.', exampleTr: 'Çiçek güzel.', phonics: 'vowel-ow' },
  { english: 'rain', turkish: 'yağmur', emoji: '🌧️', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'I like the rain.', exampleTr: 'Yağmuru severim.', phonics: 'long-a' },
  { english: 'snow', turkish: 'kar', emoji: '❄️', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'Snow is cold and white.', exampleTr: 'Kar soğuk ve beyaz.', phonics: 'long-o' },
  { english: 'wind', turkish: 'rüzgar', emoji: '💨', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'The wind is blowing.', exampleTr: 'Rüzgar esiyor.', phonics: 'short-i' },
  { english: 'cloud', turkish: 'bulut', emoji: '☁️', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'A big cloud is in the sky.', exampleTr: 'Gökyüzünde büyük bir bulut var.', phonics: 'vowel-ou' },
  { english: 'sky', turkish: 'gökyüzü', emoji: '🌌', category: 'Nature', level: 1, partOfSpeech: 'noun', exampleEn: 'The sky is blue.', exampleTr: 'Gökyüzü mavi.', phonics: 'long-i' },
];

// ─── LEVEL 2 — Actions ────────────────────────────────────────────────────────
const level2Actions: CurriculumWord[] = [
  { english: 'run', turkish: 'koşmak', emoji: '🏃', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I run in the park.', exampleTr: 'Parkta koşuyorum.', phonics: 'short-u' },
  { english: 'jump', turkish: 'zıplamak', emoji: '🤸', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'Can you jump high?', exampleTr: 'Yüksek zıplayabilir misin?', phonics: 'short-u' },
  { english: 'walk', turkish: 'yürümek', emoji: '🚶', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I walk to school.', exampleTr: 'Okula yürüyorum.', phonics: 'l-blend' },
  { english: 'sit', turkish: 'oturmak', emoji: '🪑', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'Please sit down.', exampleTr: 'Lütfen otur.', phonics: 'short-i' },
  { english: 'eat', turkish: 'yemek', emoji: '🍽️', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I eat breakfast.', exampleTr: 'Kahvaltı yapıyorum.', phonics: 'digraph-ea' },
  { english: 'drink', turkish: 'içmek', emoji: '🥤', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I drink water.', exampleTr: 'Su içiyorum.', phonics: 'r-blend' },
  { english: 'sleep', turkish: 'uyumak', emoji: '😴', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I sleep at night.', exampleTr: 'Geceleri uyurum.', phonics: 'digraph-ee' },
  { english: 'play', turkish: 'oynamak', emoji: '🎮', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'Let us play together.', exampleTr: 'Hadi birlikte oynayalım.', phonics: 'long-a' },
  { english: 'read', turkish: 'okumak', emoji: '📖', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I read every day.', exampleTr: 'Her gün okuyorum.', phonics: 'digraph-ea' },
  { english: 'write', turkish: 'yazmak', emoji: '✏️', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I write my name.', exampleTr: 'Adımı yazıyorum.', phonics: 'long-i' },
  { english: 'sing', turkish: 'şarkı söylemek', emoji: '🎤', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I love to sing.', exampleTr: 'Şarkı söylemeyi seviyorum.', phonics: 'short-i' },
  { english: 'dance', turkish: 'dans etmek', emoji: '💃', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'She can dance well.', exampleTr: 'Güzel dans edebilir.', phonics: 'long-a' },
  { english: 'swim', turkish: 'yüzmek', emoji: '🏊', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I swim in the sea.', exampleTr: 'Denizde yüzüyorum.', phonics: 'short-i' },
  { english: 'fly', turkish: 'uçmak', emoji: '✈️', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'Birds can fly.', exampleTr: 'Kuşlar uçabilir.', phonics: 'long-i' },
  { english: 'climb', turkish: 'tırmanmak', emoji: '🧗', category: 'Actions', level: 2, partOfSpeech: 'verb', exampleEn: 'I climb the tree.', exampleTr: 'Ağaca tırmanıyorum.', phonics: 'long-i' },
];

// ─── LEVEL 2 — Feelings ───────────────────────────────────────────────────────
const level2Feelings: CurriculumWord[] = [
  { english: 'happy', turkish: 'mutlu', emoji: '😊', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'I am happy today.', exampleTr: 'Bugün mutluyum.', phonics: 'short-a' },
  { english: 'sad', turkish: 'üzgün', emoji: '😢', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'The girl is sad.', exampleTr: 'Kız üzgün.', phonics: 'short-a' },
  { english: 'angry', turkish: 'kızgın', emoji: '😠', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'Don\'t be angry.', exampleTr: 'Kızma.', phonics: 'short-a' },
  { english: 'scared', turkish: 'korkmuş', emoji: '😨', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'I am scared of spiders.', exampleTr: 'Örümceklerden korkuyorum.', phonics: 'r-controlled' },
  { english: 'tired', turkish: 'yorgun', emoji: '😴', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'I am very tired.', exampleTr: 'Çok yorgunum.', phonics: 'long-i' },
  { english: 'hungry', turkish: 'aç', emoji: '🍽️', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'I am hungry.', exampleTr: 'Açım.', phonics: 'short-u' },
  { english: 'thirsty', turkish: 'susuz', emoji: '💧', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'Are you thirsty?', exampleTr: 'Susamış mısın?', phonics: 'digraph-ir' },
  { english: 'cold', turkish: 'soğuk', emoji: '🥶', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'I am cold outside.', exampleTr: 'Dışarıda üşüyorum.', phonics: 'long-o' },
  { english: 'hot', turkish: 'sıcak', emoji: '🥵', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'It is very hot today.', exampleTr: 'Bugün çok sıcak.', phonics: 'short-o' },
  { english: 'sick', turkish: 'hasta', emoji: '🤒', category: 'Feelings', level: 2, partOfSpeech: 'adjective', exampleEn: 'I am sick today.', exampleTr: 'Bugün hastayım.', phonics: 'short-i' },
];

// ─── LEVEL 2 — Adjectives ─────────────────────────────────────────────────────
const level2Adjectives: CurriculumWord[] = [
  { english: 'big', turkish: 'büyük', emoji: '🐘', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'The elephant is big.', exampleTr: 'Fil büyük.', phonics: 'short-i' },
  { english: 'small', turkish: 'küçük', emoji: '🐭', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'The mouse is small.', exampleTr: 'Fare küçük.', phonics: 'l-blend' },
  { english: 'tall', turkish: 'uzun boylu', emoji: '🦒', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'The giraffe is tall.', exampleTr: 'Zürafa uzun boylu.', phonics: 'vowel-all' },
  { english: 'short', turkish: 'kısa', emoji: '📏', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'He is short.', exampleTr: 'O kısa boylu.', phonics: 'digraph-sh' },
  { english: 'long', turkish: 'uzun', emoji: '🐍', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'The snake is long.', exampleTr: 'Yılan uzun.', phonics: 'long-o' },
  { english: 'old', turkish: 'yaşlı/eski', emoji: '👴', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'Grandpa is old.', exampleTr: 'Büyükbaba yaşlı.', phonics: 'long-o' },
  { english: 'new', turkish: 'yeni', emoji: '✨', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'I have a new book.', exampleTr: 'Yeni bir kitabım var.', phonics: 'long-u' },
  { english: 'fast', turkish: 'hızlı', emoji: '🏎️', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'The car is fast.', exampleTr: 'Araba hızlı.', phonics: 'short-a' },
  { english: 'slow', turkish: 'yavaş', emoji: '🐢', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'The turtle is slow.', exampleTr: 'Kaplumbağa yavaş.', phonics: 'long-o' },
  { english: 'good', turkish: 'iyi', emoji: '👍', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'You are a good student.', exampleTr: 'İyi bir öğrencisin.', phonics: 'long-oo' },
  { english: 'bad', turkish: 'kötü', emoji: '👎', category: 'Adjectives', level: 2, partOfSpeech: 'adjective', exampleEn: 'It is a bad day.', exampleTr: 'Kötü bir gün.', phonics: 'short-a' },
];

// ─── LEVEL 2 — More Animals & Food ────────────────────────────────────────────
const level2MoreAnimals: CurriculumWord[] = [
  { english: 'lion', turkish: 'aslan', emoji: '🦁', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The lion is the king.', exampleTr: 'Aslan kral.', phonics: 'long-i' },
  { english: 'tiger', turkish: 'kaplan', emoji: '🐯', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The tiger has stripes.', exampleTr: 'Kaplanın çizgileri var.', phonics: 'long-i' },
  { english: 'bear', turkish: 'ayı', emoji: '🐻', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The bear sleeps in winter.', exampleTr: 'Ayı kışın uyur.', phonics: 'r-controlled' },
  { english: 'elephant', turkish: 'fil', emoji: '🐘', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'Elephants are big.', exampleTr: 'Filler büyük.', phonics: 'short-e' },
  { english: 'monkey', turkish: 'maymun', emoji: '🐒', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'Monkeys climb trees.', exampleTr: 'Maymunlar ağaçlara tırmanır.', phonics: 'short-o' },
  { english: 'penguin', turkish: 'penguen', emoji: '🐧', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'Penguins live in cold places.', exampleTr: 'Penguenler soğuk yerlerde yaşar.', phonics: 'short-e' },
  { english: 'turtle', turkish: 'kaplumbağa', emoji: '🐢', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The turtle moves slowly.', exampleTr: 'Kaplumbağa yavaş hareket eder.', phonics: 'r-controlled' },
  { english: 'fox', turkish: 'tilki', emoji: '🦊', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The fox is clever.', exampleTr: 'Tilki zekidir.', phonics: 'short-o' },
  { english: 'wolf', turkish: 'kurt', emoji: '🐺', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The wolf howls at night.', exampleTr: 'Kurt geceleri ulur.', phonics: 'short-o' },
  { english: 'giraffe', turkish: 'zürafa', emoji: '🦒', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The giraffe has a long neck.', exampleTr: 'Zürafanın uzun boynu var.', phonics: 'r-controlled' },
  { english: 'crocodile', turkish: 'timsah', emoji: '🐊', category: 'Animals', level: 2, partOfSpeech: 'noun', exampleEn: 'The crocodile has big teeth.', exampleTr: 'Timsahın büyük dişleri var.', phonics: 'long-o' },
];

// ─── LEVEL 3 — Time ───────────────────────────────────────────────────────────
const level3Time: CurriculumWord[] = [
  { english: 'morning', turkish: 'sabah', emoji: '🌅', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'I wake up in the morning.', exampleTr: 'Sabahları uyanıyorum.', phonics: 'r-controlled' },
  { english: 'afternoon', turkish: 'öğleden sonra', emoji: '☀️', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'I play in the afternoon.', exampleTr: 'Öğleden sonra oynuyorum.', phonics: 'r-controlled' },
  { english: 'evening', turkish: 'akşam', emoji: '🌆', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'We eat dinner in the evening.', exampleTr: 'Akşamları akşam yemeği yeriz.', phonics: 'short-e' },
  { english: 'night', turkish: 'gece', emoji: '🌙', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'Stars come out at night.', exampleTr: 'Yıldızlar gece çıkar.', phonics: 'long-i' },
  { english: 'today', turkish: 'bugün', emoji: '📅', category: 'Time', level: 3, partOfSpeech: 'adverb', exampleEn: 'Today is Monday.', exampleTr: 'Bugün Pazartesi.', phonics: 'long-a' },
  { english: 'tomorrow', turkish: 'yarın', emoji: '📆', category: 'Time', level: 3, partOfSpeech: 'adverb', exampleEn: 'See you tomorrow.', exampleTr: 'Yarın görüşürüz.', phonics: 'r-controlled' },
  { english: 'yesterday', turkish: 'dün', emoji: '⬅️', category: 'Time', level: 3, partOfSpeech: 'adverb', exampleEn: 'Yesterday was fun.', exampleTr: 'Dün eğlenceliydi.', phonics: 'short-e' },
  { english: 'week', turkish: 'hafta', emoji: '🗓️', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'There are seven days in a week.', exampleTr: 'Bir haftada yedi gün var.', phonics: 'digraph-ee' },
  { english: 'month', turkish: 'ay', emoji: '📆', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'There are twelve months.', exampleTr: 'On iki ay var.', phonics: 'vowel-ou' },
  { english: 'year', turkish: 'yıl', emoji: '🎆', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'A new year is coming.', exampleTr: 'Yeni yıl geliyor.', phonics: 'r-controlled' },
  { english: 'Monday', turkish: 'Pazartesi', emoji: '1️⃣', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'School starts on Monday.', exampleTr: 'Okul Pazartesi başlar.', phonics: 'short-u' },
  { english: 'Friday', turkish: 'Cuma', emoji: '5️⃣', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'Friday is the last school day.', exampleTr: 'Cuma okul haftasının son günü.', phonics: 'long-i' },
  { english: 'weekend', turkish: 'hafta sonu', emoji: '🎉', category: 'Time', level: 3, partOfSpeech: 'noun', exampleEn: 'I play on the weekend.', exampleTr: 'Hafta sonu oynuyorum.', phonics: 'short-e' },
  { english: 'now', turkish: 'şimdi', emoji: '⏱️', category: 'Time', level: 3, partOfSpeech: 'adverb', exampleEn: 'Come here now.', exampleTr: 'Şimdi buraya gel.', phonics: 'vowel-ow' },
  { english: 'always', turkish: 'her zaman', emoji: '♾️', category: 'Time', level: 3, partOfSpeech: 'adverb', exampleEn: 'I always brush my teeth.', exampleTr: 'Her zaman dişlerimi fırçalarım.', phonics: 'vowel-all' },
  { english: 'never', turkish: 'asla', emoji: '🚫', category: 'Time', level: 3, partOfSpeech: 'adverb', exampleEn: 'Never give up.', exampleTr: 'Asla vazgeçme.', phonics: 'short-e' },
  { english: 'sometimes', turkish: 'bazen', emoji: '🔄', category: 'Time', level: 3, partOfSpeech: 'adverb', exampleEn: 'Sometimes I watch TV.', exampleTr: 'Bazen TV izlerim.', phonics: 'short-u' },
];

// ─── LEVEL 3 — Places ─────────────────────────────────────────────────────────
const level3Places: CurriculumWord[] = [
  { english: 'park', turkish: 'park', emoji: '🌳', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'We play at the park.', exampleTr: 'Parkta oynuyoruz.', phonics: 'r-controlled' },
  { english: 'store', turkish: 'mağaza', emoji: '🏪', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'We buy food at the store.', exampleTr: 'Mağazadan yiyecek satın alıyoruz.', phonics: 'r-controlled' },
  { english: 'hospital', turkish: 'hastane', emoji: '🏥', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'Doctors work in a hospital.', exampleTr: 'Doktorlar hastanede çalışır.', phonics: 'short-o' },
  { english: 'library', turkish: 'kütüphane', emoji: '📚', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'I borrow books from the library.', exampleTr: 'Kütüphaneden kitap alıyorum.', phonics: 'long-i' },
  { english: 'restaurant', turkish: 'restoran', emoji: '🍽️', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'We eat at the restaurant.', exampleTr: 'Restoranda yiyoruz.', phonics: 'r-controlled' },
  { english: 'beach', turkish: 'plaj', emoji: '🏖️', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'I swim at the beach.', exampleTr: 'Plajda yüzüyorum.', phonics: 'digraph-ea' },
  { english: 'mountain', turkish: 'dağ', emoji: '⛰️', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'The mountain is high.', exampleTr: 'Dağ yüksek.', phonics: 'vowel-ou' },
  { english: 'city', turkish: 'şehir', emoji: '🏙️', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'I live in a big city.', exampleTr: 'Büyük bir şehirde yaşıyorum.', phonics: 'short-i' },
  { english: 'village', turkish: 'köy', emoji: '🏡', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'Grandma lives in a village.', exampleTr: 'Büyükannem köyde yaşıyor.', phonics: 'short-i' },
  { english: 'airport', turkish: 'havalimanı', emoji: '✈️', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'We go to the airport.', exampleTr: 'Havalimanına gidiyoruz.', phonics: 'r-controlled' },
  { english: 'supermarket', turkish: 'süpermarket', emoji: '🛒', category: 'Places', level: 3, partOfSpeech: 'noun', exampleEn: 'We buy vegetables at the supermarket.', exampleTr: 'Süpermarketten sebze alıyoruz.', phonics: 'r-controlled' },
];

// ─── LEVEL 3 — Descriptions ───────────────────────────────────────────────────
const level3Descriptions: CurriculumWord[] = [
  { english: 'beautiful', turkish: 'güzel', emoji: '🌺', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'That is a beautiful flower.', exampleTr: 'Bu çok güzel bir çiçek.', phonics: 'long-u' },
  { english: 'dangerous', turkish: 'tehlikeli', emoji: '⚠️', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'This road is dangerous.', exampleTr: 'Bu yol tehlikeli.', phonics: 'long-a' },
  { english: 'important', turkish: 'önemli', emoji: '❗', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'Health is important.', exampleTr: 'Sağlık önemli.', phonics: 'r-controlled' },
  { english: 'interesting', turkish: 'ilginç', emoji: '🤔', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'This book is interesting.', exampleTr: 'Bu kitap ilginç.', phonics: 'r-controlled' },
  { english: 'different', turkish: 'farklı', emoji: '🔀', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'We are all different.', exampleTr: 'Hepimiz farklıyız.', phonics: 'short-i' },
  { english: 'difficult', turkish: 'zor', emoji: '😓', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'Maths is difficult.', exampleTr: 'Matematik zor.', phonics: 'short-i' },
  { english: 'easy', turkish: 'kolay', emoji: '😊', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'English is easy.', exampleTr: 'İngilizce kolay.', phonics: 'long-e' },
  { english: 'young', turkish: 'genç', emoji: '👶', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'She is young.', exampleTr: 'O genç.', phonics: 'short-u' },
  { english: 'clean', turkish: 'temiz', emoji: '🧹', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'My room is clean.', exampleTr: 'Odam temiz.', phonics: 'digraph-ea' },
  { english: 'dirty', turkish: 'kirli', emoji: '🟤', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'My shoes are dirty.', exampleTr: 'Ayakkabılarım kirli.', phonics: 'short-i' },
  { english: 'quiet', turkish: 'sessiz', emoji: '🤫', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'Please be quiet.', exampleTr: 'Lütfen sessiz ol.', phonics: 'long-i' },
  { english: 'loud', turkish: 'gürültülü', emoji: '🔊', category: 'Descriptions', level: 3, partOfSpeech: 'adjective', exampleEn: 'The music is loud.', exampleTr: 'Müzik gürültülü.', phonics: 'vowel-ou' },
];

// ─── LEVEL 4 — School Subjects ────────────────────────────────────────────────
const level4Subjects: CurriculumWord[] = [
  { english: 'maths', turkish: 'matematik', emoji: '🔢', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'I like maths.', exampleTr: 'Matematiği severim.', phonics: 'digraph-th' },
  { english: 'science', turkish: 'fen bilgisi', emoji: '🔬', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'Science is fun.', exampleTr: 'Fen bilgisi eğlenceli.', phonics: 'long-i' },
  { english: 'history', turkish: 'tarih', emoji: '📜', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'History is interesting.', exampleTr: 'Tarih ilginç.', phonics: 'short-i' },
  { english: 'art', turkish: 'resim', emoji: '🎨', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'I love art class.', exampleTr: 'Resim dersini seviyorum.', phonics: 'r-controlled' },
  { english: 'music', turkish: 'müzik', emoji: '🎵', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'Music makes me happy.', exampleTr: 'Müzik beni mutlu eder.', phonics: 'long-u' },
  { english: 'sport', turkish: 'spor', emoji: '⚽', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'Sport is healthy.', exampleTr: 'Spor sağlıklı.', phonics: 'r-controlled' },
  { english: 'geography', turkish: 'coğrafya', emoji: '🗺️', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'Geography teaches us about the world.', exampleTr: 'Coğrafya bize dünyayı öğretir.', phonics: 'long-e' },
  { english: 'computer', turkish: 'bilgisayar', emoji: '💻', category: 'Subjects', level: 4, partOfSpeech: 'noun', exampleEn: 'I use the computer.', exampleTr: 'Bilgisayar kullanıyorum.', phonics: 'long-u' },
];

// ─── LEVEL 4 — Hobbies & Sports ───────────────────────────────────────────────
const level4Hobbies: CurriculumWord[] = [
  { english: 'football', turkish: 'futbol', emoji: '⚽', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'I play football on Saturdays.', exampleTr: 'Cumartesi günleri futbol oynarım.', phonics: 'long-oo' },
  { english: 'basketball', turkish: 'basketbol', emoji: '🏀', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'Basketball is my hobby.', exampleTr: 'Basketbol benim hobim.', phonics: 'short-a' },
  { english: 'swimming', turkish: 'yüzme', emoji: '🏊', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'I go swimming on weekends.', exampleTr: 'Hafta sonları yüzmeye gidiyorum.', phonics: 'short-i' },
  { english: 'drawing', turkish: 'resim çizme', emoji: '✏️', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'I love drawing.', exampleTr: 'Resim çizmeyi seviyorum.', phonics: 'vowel-aw' },
  { english: 'reading', turkish: 'okuma', emoji: '📖', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'Reading is a great hobby.', exampleTr: 'Okuma harika bir hobdir.', phonics: 'digraph-ea' },
  { english: 'cooking', turkish: 'yemek pişirme', emoji: '🍳', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'I enjoy cooking.', exampleTr: 'Yemek pişirmeyi seviyorum.', phonics: 'long-oo' },
  { english: 'gardening', turkish: 'bahçecilik', emoji: '🌻', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'My mom likes gardening.', exampleTr: 'Annem bahçeciliği sever.', phonics: 'r-controlled' },
  { english: 'cycling', turkish: 'bisiklet sürme', emoji: '🚴', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'Cycling is fun.', exampleTr: 'Bisiklet sürmek eğlenceli.', phonics: 'long-i' },
  { english: 'photography', turkish: 'fotoğrafçılık', emoji: '📷', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'Photography is my hobby.', exampleTr: 'Fotoğrafçılık benim hobim.', phonics: 'long-o' },
  { english: 'hiking', turkish: 'yürüyüş', emoji: '🥾', category: 'Hobbies', level: 4, partOfSpeech: 'noun', exampleEn: 'We go hiking in summer.', exampleTr: 'Yazın yürüyüşe gidiyoruz.', phonics: 'long-i' },
];

// ─── LEVEL 4 — Weather & Comparatives ────────────────────────────────────────
const level4Weather: CurriculumWord[] = [
  { english: 'sunny', turkish: 'güneşli', emoji: '☀️', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'It is a sunny day.', exampleTr: 'Güneşli bir gün.', phonics: 'short-u' },
  { english: 'rainy', turkish: 'yağmurlu', emoji: '🌧️', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'It is rainy today.', exampleTr: 'Bugün yağmurlu.', phonics: 'long-a' },
  { english: 'windy', turkish: 'rüzgarlı', emoji: '💨', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'It is windy outside.', exampleTr: 'Dışarısı rüzgarlı.', phonics: 'short-i' },
  { english: 'cloudy', turkish: 'bulutlu', emoji: '☁️', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'The sky is cloudy.', exampleTr: 'Gökyüzü bulutlu.', phonics: 'vowel-ou' },
  { english: 'snowy', turkish: 'karlı', emoji: '❄️', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'It is snowy in winter.', exampleTr: 'Kışın karlı.', phonics: 'long-o' },
  { english: 'foggy', turkish: 'sisli', emoji: '🌫️', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'It is foggy this morning.', exampleTr: 'Bu sabah sisli.', phonics: 'short-o' },
  { english: 'hotter', turkish: 'daha sıcak', emoji: '🔥', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'Summer is hotter than spring.', exampleTr: 'Yaz ilkbahardan daha sıcak.', phonics: 'short-o' },
  { english: 'colder', turkish: 'daha soğuk', emoji: '🥶', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'Winter is colder than autumn.', exampleTr: 'Kış sonbahara göre daha soğuk.', phonics: 'long-o' },
  { english: 'bigger', turkish: 'daha büyük', emoji: '⬆️', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'The elephant is bigger.', exampleTr: 'Fil daha büyük.', phonics: 'short-i' },
  { english: 'better', turkish: 'daha iyi', emoji: '👍', category: 'Weather', level: 4, partOfSpeech: 'adjective', exampleEn: 'Today is better.', exampleTr: 'Bugün daha iyi.', phonics: 'short-e' },
  { english: 'temperature', turkish: 'sıcaklık', emoji: '🌡️', category: 'Weather', level: 4, partOfSpeech: 'noun', exampleEn: 'The temperature is low.', exampleTr: 'Sıcaklık düşük.', phonics: 'r-controlled' },
  { english: 'forecast', turkish: 'hava tahmini', emoji: '📺', category: 'Weather', level: 4, partOfSpeech: 'noun', exampleEn: 'The forecast says rain.', exampleTr: 'Hava tahmini yağmur diyor.', phonics: 'r-controlled' },
];

// ─── LEVEL 5 — Abstract Concepts ──────────────────────────────────────────────
const level5Abstract: CurriculumWord[] = [
  { english: 'freedom', turkish: 'özgürlük', emoji: '🕊️', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Freedom is very important.', exampleTr: 'Özgürlük çok önemli.', phonics: 'long-e' },
  { english: 'knowledge', turkish: 'bilgi', emoji: '🧠', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Knowledge is power.', exampleTr: 'Bilgi güçtür.', phonics: 'long-o' },
  { english: 'courage', turkish: 'cesaret', emoji: '🦁', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'You need courage.', exampleTr: 'Cesarete ihtiyacın var.', phonics: 'r-controlled' },
  { english: 'kindness', turkish: 'iyilik', emoji: '💛', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Show kindness to others.', exampleTr: 'Başkalarına iyilik göster.', phonics: 'long-i' },
  { english: 'patience', turkish: 'sabır', emoji: '⏳', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Patience is a great quality.', exampleTr: 'Sabır harika bir özelliktir.', phonics: 'long-a' },
  { english: 'respect', turkish: 'saygı', emoji: '🤝', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Show respect to your elders.', exampleTr: 'Büyüklerine saygı göster.', phonics: 'short-e' },
  { english: 'responsibility', turkish: 'sorumluluk', emoji: '📋', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Take responsibility.', exampleTr: 'Sorumluluk üstlen.', phonics: 'short-i' },
  { english: 'trust', turkish: 'güven', emoji: '🤲', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Trust your friends.', exampleTr: 'Arkadaşlarına güven.', phonics: 'r-blend' },
  { english: 'honesty', turkish: 'dürüstlük', emoji: '✅', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Honesty is the best policy.', exampleTr: 'Dürüstlük en iyi politikadır.', phonics: 'short-o' },
  { english: 'creativity', turkish: 'yaratıcılık', emoji: '🎨', category: 'Abstract', level: 5, partOfSpeech: 'noun', exampleEn: 'Use your creativity.', exampleTr: 'Yaratıcılığını kullan.', phonics: 'long-e' },
];

// ─── LEVEL 5 — Daily Routines ─────────────────────────────────────────────────
const level5Routines: CurriculumWord[] = [
  { english: 'wake up', turkish: 'uyanmak', emoji: '⏰', category: 'Routines', level: 5, partOfSpeech: 'verb', exampleEn: 'I wake up at seven.', exampleTr: 'Yedide uyanıyorum.', phonics: 'long-a' },
  { english: 'brush', turkish: 'fırçalamak', emoji: '🪥', category: 'Routines', level: 5, partOfSpeech: 'verb', exampleEn: 'I brush my teeth.', exampleTr: 'Dişlerimi fırçalıyorum.', phonics: 'r-blend' },
  { english: 'shower', turkish: 'duş almak', emoji: '🚿', category: 'Routines', level: 5, partOfSpeech: 'noun', exampleEn: 'I take a shower.', exampleTr: 'Duş alıyorum.', phonics: 'vowel-ow' },
  { english: 'breakfast', turkish: 'kahvaltı', emoji: '🍳', category: 'Routines', level: 5, partOfSpeech: 'noun', exampleEn: 'I eat breakfast every morning.', exampleTr: 'Her sabah kahvaltı yapıyorum.', phonics: 'r-blend' },
  { english: 'commute', turkish: 'yolculuk', emoji: '🚌', category: 'Routines', level: 5, partOfSpeech: 'noun', exampleEn: 'My commute takes twenty minutes.', exampleTr: 'Yolculuğum yirmi dakika sürer.', phonics: 'long-u' },
  { english: 'homework', turkish: 'ödev', emoji: '📝', category: 'Routines', level: 5, partOfSpeech: 'noun', exampleEn: 'I do my homework.', exampleTr: 'Ödevlerimi yapıyorum.', phonics: 'r-controlled' },
  { english: 'dinner', turkish: 'akşam yemeği', emoji: '🍽️', category: 'Routines', level: 5, partOfSpeech: 'noun', exampleEn: 'We eat dinner together.', exampleTr: 'Birlikte akşam yemeği yiyoruz.', phonics: 'short-i' },
  { english: 'bedtime', turkish: 'uyku vakti', emoji: '🛏️', category: 'Routines', level: 5, partOfSpeech: 'noun', exampleEn: 'Bedtime is at nine.', exampleTr: 'Uyku vakti dokuzda.', phonics: 'long-i' },
  { english: 'exercise', turkish: 'egzersiz', emoji: '🏋️', category: 'Routines', level: 5, partOfSpeech: 'noun', exampleEn: 'Exercise keeps you healthy.', exampleTr: 'Egzersiz sağlıklı tutar.', phonics: 'r-controlled' },
  { english: 'relax', turkish: 'dinlenmek', emoji: '😌', category: 'Routines', level: 5, partOfSpeech: 'verb', exampleEn: 'I relax after school.', exampleTr: 'Okuldan sonra dinleniyorum.', phonics: 'long-a' },
];

// ─── LEVEL 5 — Question Words & Past Tense ───────────────────────────────────
const level5Questions: CurriculumWord[] = [
  { english: 'what', turkish: 'ne', emoji: '❓', category: 'Questions', level: 5, partOfSpeech: 'pronoun', exampleEn: 'What is your name?', exampleTr: 'Adın ne?', phonics: 'digraph-wh' },
  { english: 'where', turkish: 'nerede', emoji: '📍', category: 'Questions', level: 5, partOfSpeech: 'adverb', exampleEn: 'Where do you live?', exampleTr: 'Nerede yaşıyorsun?', phonics: 'digraph-wh' },
  { english: 'when', turkish: 'ne zaman', emoji: '⏰', category: 'Questions', level: 5, partOfSpeech: 'adverb', exampleEn: 'When is your birthday?', exampleTr: 'Doğum günün ne zaman?', phonics: 'digraph-wh' },
  { english: 'who', turkish: 'kim', emoji: '🙋', category: 'Questions', level: 5, partOfSpeech: 'pronoun', exampleEn: 'Who is your teacher?', exampleTr: 'Öğretmenin kim?', phonics: 'digraph-wh' },
  { english: 'why', turkish: 'neden', emoji: '🤔', category: 'Questions', level: 5, partOfSpeech: 'adverb', exampleEn: 'Why are you sad?', exampleTr: 'Neden üzgünsün?', phonics: 'digraph-wh' },
  { english: 'how', turkish: 'nasıl', emoji: '💡', category: 'Questions', level: 5, partOfSpeech: 'adverb', exampleEn: 'How are you?', exampleTr: 'Nasılsın?', phonics: 'vowel-ow' },
  { english: 'which', turkish: 'hangi', emoji: '🔀', category: 'Questions', level: 5, partOfSpeech: 'pronoun', exampleEn: 'Which color do you like?', exampleTr: 'Hangi rengi seviyorsun?', phonics: 'digraph-wh' },
  { english: 'walked', turkish: 'yürüdü', emoji: '🚶', category: 'Questions', level: 5, partOfSpeech: 'verb', exampleEn: 'She walked to school.', exampleTr: 'O okula yürüdü.', phonics: 'l-blend' },
  { english: 'played', turkish: 'oynadı', emoji: '🎮', category: 'Questions', level: 5, partOfSpeech: 'verb', exampleEn: 'He played football.', exampleTr: 'Futbol oynadı.', phonics: 'long-a' },
  { english: 'went', turkish: 'gitti', emoji: '🚪', category: 'Questions', level: 5, partOfSpeech: 'verb', exampleEn: 'We went to the park.', exampleTr: 'Parka gittik.', phonics: 'short-e' },
  { english: 'ate', turkish: 'yedi', emoji: '🍽️', category: 'Questions', level: 5, partOfSpeech: 'verb', exampleEn: 'She ate her lunch.', exampleTr: 'Öğle yemeğini yedi.', phonics: 'long-a' },
  { english: 'saw', turkish: 'gördü', emoji: '👀', category: 'Questions', level: 5, partOfSpeech: 'verb', exampleEn: 'I saw a rainbow.', exampleTr: 'Bir gökkuşağı gördüm.', phonics: 'vowel-aw' },
  { english: 'said', turkish: 'dedi', emoji: '💬', category: 'Questions', level: 5, partOfSpeech: 'verb', exampleEn: 'She said hello.', exampleTr: 'Merhaba dedi.', phonics: 'long-a' },
  { english: 'came', turkish: 'geldi', emoji: '🏠', category: 'Questions', level: 5, partOfSpeech: 'verb', exampleEn: 'He came home.', exampleTr: 'Eve geldi.', phonics: 'long-a' },
  { english: 'found', turkish: 'buldu', emoji: '🔍', category: 'Questions', level: 5, partOfSpeech: 'verb', exampleEn: 'She found her book.', exampleTr: 'Kitabını buldu.', phonics: 'vowel-ou' },
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
