/**
 * Grammar Lessons for Turkish children learning English
 * Focuses on areas where Turkish L1 causes interference
 * Ordered by frequency and difficulty
 */

export interface GrammarLesson {
  id: string;
  topic: string;
  topicTr: string;
  level: 1 | 2 | 3;
  // Turkish speaker note
  turkishNote: string;
  // Main pattern taught
  pattern: string;
  patternTr: string;
  // Examples (EN + TR)
  examples: Array<{ en: string; tr: string; highlight: string }>;
  // Practice sentences (fill-in-the-blank or multiple choice)
  exercises: Array<{
    type: 'fillBlank' | 'multiChoice' | 'reorder';
    question: string;
    questionTr: string;
    options?: string[];
    answer: string;
    explanation: string;
    explanationTr: string;
  }>;
}

export const grammarLessons: GrammarLesson[] = [
  // ─── LEVEL 1: Articles ──────────────────────────────────────────────────────
  {
    id: 'g01_articles_a_an',
    topic: 'A vs An',
    topicTr: 'A mı An mı?',
    level: 1,
    turkishNote: 'Türkçede "bir" her zaman aynı. İngilizcede sesli harften önce "an" kullanılır!',
    pattern: 'a + consonant sound | an + vowel sound',
    patternTr: 'a + ünsüz ses | an + ünlü ses',
    examples: [
      { en: 'I see a cat.', tr: 'Bir kedi görüyorum.', highlight: 'a cat' },
      { en: 'I see an apple.', tr: 'Bir elma görüyorum.', highlight: 'an apple' },
      { en: 'She has a dog.', tr: 'Onun bir köpeği var.', highlight: 'a dog' },
      { en: 'He has an egg.', tr: 'Onun bir yumurtası var.', highlight: 'an egg' },
      { en: 'I want a book.', tr: 'Bir kitap istiyorum.', highlight: 'a book' },
      { en: 'I want an orange.', tr: 'Bir portakal istiyorum.', highlight: 'an orange' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: 'I have ___ apple.',
        questionTr: 'Bir elmam var.',
        options: ['a', 'an', 'the'],
        answer: 'an',
        explanation: '"apple" starts with the vowel A — use "an"',
        explanationTr: '"apple" ünlü A harfiyle başlar — "an" kullanılır',
      },
      {
        type: 'multiChoice',
        question: 'She has ___ cat.',
        questionTr: 'Onun bir kedisi var.',
        options: ['a', 'an', 'the'],
        answer: 'a',
        explanation: '"cat" starts with consonant C — use "a"',
        explanationTr: '"cat" ünsüz C harfiyle başlar — "a" kullanılır',
      },
      {
        type: 'multiChoice',
        question: 'I see ___ elephant.',
        questionTr: 'Bir fil görüyorum.',
        options: ['a', 'an'],
        answer: 'an',
        explanation: '"elephant" starts with vowel E — use "an"',
        explanationTr: '"elephant" ünlü E harfiyle başlar — "an" kullanılır',
      },
      {
        type: 'multiChoice',
        question: 'He eats ___ banana.',
        questionTr: 'O bir muz yer.',
        options: ['a', 'an'],
        answer: 'a',
        explanation: '"banana" starts with consonant B — use "a"',
        explanationTr: '"banana" ünsüz B harfiyle başlar — "a" kullanılır',
      },
    ],
  },

  // ─── LEVEL 1: This/That ─────────────────────────────────────────────────────
  {
    id: 'g02_this_that',
    topic: 'This vs That',
    topicTr: 'This mi That mı?',
    level: 1,
    turkishNote: '"Bu" yakındaki şeyler için, "şu/o" uzaktaki şeyler için',
    pattern: 'this = close to me | that = far from me',
    patternTr: 'this = yakın | that = uzak',
    examples: [
      { en: 'This is my book.', tr: 'Bu benim kitabım.', highlight: 'This' },
      { en: 'That is a big tree.', tr: 'Şu büyük bir ağaç.', highlight: 'That' },
      { en: 'This cat is soft.', tr: 'Bu kedi yumuşak.', highlight: 'This' },
      { en: 'That dog is fast.', tr: 'Şu köpek hızlı.', highlight: 'That' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: '___ is my pencil. (close to you)',
        questionTr: '___ benim kalemim. (yakında)',
        options: ['This', 'That'],
        answer: 'This',
        explanation: 'Close = This',
        explanationTr: 'Yakın = This',
      },
      {
        type: 'multiChoice',
        question: '___ is a mountain far away.',
        questionTr: '___ uzaktaki bir dağ.',
        options: ['This', 'That'],
        answer: 'That',
        explanation: 'Far = That',
        explanationTr: 'Uzak = That',
      },
    ],
  },

  // ─── LEVEL 1: Is/Are ────────────────────────────────────────────────────────
  {
    id: 'g03_is_are',
    topic: 'Is vs Are',
    topicTr: 'Is mi Are mı?',
    level: 1,
    turkishNote: 'Türkçede fark yok — ikisi de "...dir". İngilizcede tekil=is, çoğul=are',
    pattern: 'he/she/it + is | they/we/you + are',
    patternTr: 'o (tek) + is | onlar/biz/siz + are',
    examples: [
      { en: 'The cat is small.', tr: 'Kedi küçük.', highlight: 'is' },
      { en: 'The cats are small.', tr: 'Kediler küçük.', highlight: 'are' },
      { en: 'She is happy.', tr: 'O mutlu.', highlight: 'is' },
      { en: 'They are happy.', tr: 'Onlar mutlu.', highlight: 'are' },
      { en: 'It is a big house.', tr: 'Bu büyük bir ev.', highlight: 'is' },
      { en: 'We are ready!', tr: 'Hazırız!', highlight: 'are' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: 'The dog ___ big.',
        questionTr: 'Köpek büyük.',
        options: ['is', 'are'],
        answer: 'is',
        explanation: 'One dog (singular) → is',
        explanationTr: 'Bir köpek (tekil) → is',
      },
      {
        type: 'multiChoice',
        question: 'The dogs ___ big.',
        questionTr: 'Köpekler büyük.',
        options: ['is', 'are'],
        answer: 'are',
        explanation: 'More than one (plural) → are',
        explanationTr: 'Birden fazla (çoğul) → are',
      },
      {
        type: 'multiChoice',
        question: 'She ___ my friend.',
        questionTr: 'O benim arkadaşım.',
        options: ['is', 'are'],
        answer: 'is',
        explanation: 'She (singular) → is',
        explanationTr: 'She (tekil) → is',
      },
    ],
  },

  // ─── LEVEL 2: Have/Has ──────────────────────────────────────────────────────
  {
    id: 'g04_have_has',
    topic: 'Have vs Has',
    topicTr: 'Have mi Has mı?',
    level: 2,
    turkishNote: '"sahip olmak" → I/You/They=have, He/She/It=has. Türkçede bu ayrım yok!',
    pattern: 'I/you/we/they + have | he/she/it + has',
    patternTr: 'Ben/Sen/Biz/Onlar + have | O + has',
    examples: [
      { en: 'I have a cat.', tr: 'Benim bir kedim var.', highlight: 'have' },
      { en: 'She has a cat.', tr: 'Onun bir kedisi var.', highlight: 'has' },
      { en: 'We have a big house.', tr: 'Bizim büyük bir evimiz var.', highlight: 'have' },
      { en: 'He has a red car.', tr: 'Onun kırmızı bir arabası var.', highlight: 'has' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: 'She ___ a blue pencil.',
        questionTr: 'Onun mavi bir kalemi var.',
        options: ['have', 'has'],
        answer: 'has',
        explanation: 'She → has',
        explanationTr: 'She → has',
      },
      {
        type: 'multiChoice',
        question: 'I ___ two dogs.',
        questionTr: 'Benim iki köpeğim var.',
        options: ['have', 'has'],
        answer: 'have',
        explanation: 'I → have',
        explanationTr: 'I → have',
      },
    ],
  },

  // ─── LEVEL 2: Prepositions ──────────────────────────────────────────────────
  {
    id: 'g05_prepositions',
    topic: 'In, On, Under',
    topicTr: 'In, On, Under (Edat)',
    level: 2,
    turkishNote: 'Türkçede "-de/-da/-in/-ın" ekleri, İngilizcede ayrı kelimeler!',
    pattern: 'in = içinde | on = üzerinde | under = altında',
    patternTr: 'in = içinde | on = üstünde | under = altında',
    examples: [
      { en: 'The cat is in the box.', tr: 'Kedi kutunun içinde.', highlight: 'in' },
      { en: 'The book is on the table.', tr: 'Kitap masanın üstünde.', highlight: 'on' },
      { en: 'The ball is under the chair.', tr: 'Top sandalyenin altında.', highlight: 'under' },
      { en: 'She is in the room.', tr: 'O odada.', highlight: 'in' },
      { en: 'The bird is on the tree.', tr: 'Kuş ağacın üstünde.', highlight: 'on' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: 'The fish is ___ the water.',
        questionTr: 'Balık suyun içinde.',
        options: ['in', 'on', 'under'],
        answer: 'in',
        explanation: 'Fish lives inside water → in',
        explanationTr: 'Balık suyun içinde yaşar → in',
      },
      {
        type: 'multiChoice',
        question: 'The cup is ___ the table.',
        questionTr: 'Fincan masanın üstünde.',
        options: ['in', 'on', 'under'],
        answer: 'on',
        explanation: 'Cup sits on top of table → on',
        explanationTr: 'Fincan masanın üstünde duruyor → on',
      },
      {
        type: 'multiChoice',
        question: 'The dog is ___ the bed.',
        questionTr: 'Köpek yatağın altında.',
        options: ['in', 'on', 'under'],
        answer: 'under',
        explanation: 'Dog is below the bed → under',
        explanationTr: 'Köpek yatağın altında → under',
      },
    ],
  },

  // ─── LEVEL 2: My/Your/His/Her ───────────────────────────────────────────────
  {
    id: 'g06_possessives',
    topic: 'My, Your, His, Her',
    topicTr: 'Benim, Senin, Onun',
    level: 2,
    turkishNote: 'Türkçede ek olarak gelir (-im, -in, -i). İngilizcede ayrı kelimeler!',
    pattern: 'my / your / his / her / our / their',
    patternTr: 'benim / senin / onun (erkek) / onun (kız) / bizim / onların',
    examples: [
      { en: 'This is my dog.', tr: 'Bu benim köpeğim.', highlight: 'my' },
      { en: 'That is your book.', tr: 'Şu senin kitabın.', highlight: 'your' },
      { en: 'He loves his cat.', tr: 'O kedisini seviyor.', highlight: 'his' },
      { en: 'She has her bag.', tr: 'O çantasını taşıyor.', highlight: 'her' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: "Tom has ___ pencil. (Tom's pencil)",
        questionTr: "Tom'un kalemi var. (Tom'ın kalemi)",
        options: ['my', 'his', 'her'],
        answer: 'his',
        explanation: 'Tom is a boy → his',
        explanationTr: 'Tom erkek → his',
      },
      {
        type: 'multiChoice',
        question: "Mia loves ___ cat. (Mia's cat)",
        questionTr: "Mia kedisini seviyor. (Mia'nın kedisi)",
        options: ['my', 'his', 'her'],
        answer: 'her',
        explanation: 'Mia is a girl → her',
        explanationTr: 'Mia kız → her',
      },
    ],
  },

  // ─── LEVEL 3: Simple Present ────────────────────────────────────────────────
  {
    id: 'g07_simple_present',
    topic: 'I like / She likes',
    topicTr: 'Geniş Zaman (-s)',
    level: 3,
    turkishNote: 'He/She/It ile fiilin sonuna -s/-es eklenir! "She like" değil "She likes".',
    pattern: 'I/you/we/they + verb | he/she/it + verb+s',
    patternTr: 'I/you/we/they + fiil | he/she/it + fiil+s',
    examples: [
      { en: 'I like cats.', tr: 'Ben kedileri severim.', highlight: 'like' },
      { en: 'She likes cats.', tr: 'O kedileri sever.', highlight: 'likes' },
      { en: 'We play every day.', tr: 'Her gün oynarız.', highlight: 'play' },
      { en: 'He plays every day.', tr: 'O her gün oynar.', highlight: 'plays' },
      { en: 'They eat apples.', tr: 'Onlar elma yer.', highlight: 'eat' },
      { en: 'It eats apples.', tr: 'O elma yer.', highlight: 'eats' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: 'She ___ fish every day.',
        questionTr: 'O her gün balık yer.',
        options: ['eat', 'eats', 'eating'],
        answer: 'eats',
        explanation: 'She → eat + s = eats',
        explanationTr: 'She → eat + s = eats',
      },
      {
        type: 'multiChoice',
        question: 'I ___ my homework.',
        questionTr: 'Ben ödevimi yapıyorum.',
        options: ['do', 'does', 'doing'],
        answer: 'do',
        explanation: 'I → do (no -s)',
        explanationTr: 'I → do (-s eklenmez)',
      },
    ],
  },

  // ─── LEVEL 3: Can/Can't ─────────────────────────────────────────────────────
  {
    id: 'g08_can_cant',
    topic: "Can / Can't",
    topicTr: 'Yapabilmek / Yapamamak',
    level: 3,
    turkishNote: '"Yapabilmek" = can + fiil (düz hali). "can runs" değil "can run"!',
    pattern: 'can + verb (base form)',
    patternTr: 'can + fiil (yalın hali)',
    examples: [
      { en: 'I can swim.', tr: 'Ben yüzebilirim.', highlight: 'can swim' },
      { en: "She can't fly.", tr: 'O uçamaz.', highlight: "can't fly" },
      { en: 'Birds can sing.', tr: 'Kuşlar şarkı söyleyebilir.', highlight: 'can sing' },
      { en: "Fish can't walk.", tr: 'Balıklar yürüyemez.', highlight: "can't walk" },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: 'She can ___ fast.',
        questionTr: 'O hızlı koşabilir.',
        options: ['runs', 'run', 'running'],
        answer: 'run',
        explanation: 'After "can" → base verb form (no -s)',
        explanationTr: '"can" sonrası → fiilin yalın hali (-s eklenmez)',
      },
    ],
  },

  // ─── LEVEL 2: Past Tense (-ed) ───────────────────────────────────────────
  {
    id: 'g11_past_tense_ed',
    topic: 'Past Tense: -ed',
    topicTr: 'Geçmiş Zaman: -ed',
    level: 2,
    turkishNote: "Türkçede geçmiş zaman 'aldım, gittim' gibi ekin sonuna gelir. İngilizce'de fiil + ed: 'walked', 'played'",
    pattern: 'Subject + verb + ed',
    patternTr: 'Özne + fiil + ed',
    examples: [
      { en: 'I walked to school.', tr: 'Okula yürüyerek gittim.', highlight: 'walked' },
      { en: 'She played with a cat.', tr: 'O bir kediyle oynadı.', highlight: 'played' },
      { en: 'We watched TV.', tr: 'Biz TV izledik.', highlight: 'watched' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: 'Yesterday I ___ to school.',
        questionTr: 'Dün okula yürüyerek gittim.',
        options: ['walk', 'walked', 'walking'],
        answer: 'walked',
        explanation: '"Yesterday" tells us it is the past → walked',
        explanationTr: '"Yesterday" geçmiş zamanı gösterir → walked',
      },
      {
        type: 'multiChoice',
        question: 'She ___ with her friends last week.',
        questionTr: 'Geçen hafta arkadaşlarıyla oynadı.',
        options: ['plays', 'played', 'play'],
        answer: 'played',
        explanation: '"Last week" is in the past → played',
        explanationTr: '"Last week" geçmişe işaret eder → played',
      },
      {
        type: 'multiChoice',
        question: 'We ___ a movie last night.',
        questionTr: 'Dün gece bir film izledik.',
        options: ['watch', 'watches', 'watched'],
        answer: 'watched',
        explanation: '"Last night" is in the past → watched',
        explanationTr: '"Last night" geçmişe işaret eder → watched',
      },
    ],
  },

  // ─── LEVEL 2: Negative Sentences (don't/doesn't) ────────────────────────
  {
    id: 'g12_negative_dont',
    topic: "Negative: don't / doesn't",
    topicTr: "Olumsuzluk: don't / doesn't",
    level: 2,
    turkishNote: "Türkçede olumsuzluk '-me/-ma': 'sevmiyorum'. İngilizce'de 'don't' veya 'doesn't' kullanılır: 'I don't like', 'She doesn't eat'",
    pattern: "Subject + don't/doesn't + verb",
    patternTr: "Özne + don't/doesn't + fiil",
    examples: [
      { en: "I don't like spiders.", tr: 'Ben örümcekleri sevmiyorum.', highlight: "don't like" },
      { en: "He doesn't eat meat.", tr: 'O et yemiyor.', highlight: "doesn't eat" },
      { en: "They don't play football.", tr: 'Onlar futbol oynamıyor.', highlight: "don't play" },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: 'I ___ like spiders.',
        questionTr: 'Ben örümcekleri sevmiyorum.',
        options: ["don't", "doesn't", "not"],
        answer: "don't",
        explanation: 'I → don\'t (first person singular uses don\'t)',
        explanationTr: "I ile → don't kullanılır",
      },
      {
        type: 'multiChoice',
        question: 'She ___ eat vegetables.',
        questionTr: 'O sebze yemiyor.',
        options: ["don't", "doesn't", "not"],
        answer: "doesn't",
        explanation: "She → doesn't (third person singular uses doesn't)",
        explanationTr: "She ile → doesn't kullanılır",
      },
      {
        type: 'multiChoice',
        question: 'They ___ play chess.',
        questionTr: 'Onlar satranç oynamıyor.',
        options: ["don't", "doesn't", "not"],
        answer: "don't",
        explanation: "They (plural) → don't",
        explanationTr: "They (çoğul) → don't kullanılır",
      },
    ],
  },

  // ─── LEVEL 2: Questions with Do/Does ────────────────────────────────────
  {
    id: 'g13_questions_do_does',
    topic: 'Questions: Do / Does?',
    topicTr: 'Soru: Do / Does?',
    level: 2,
    turkishNote: "Türkçede soru 'mi/mı' eki: 'seviyor musun?'. İngilizce'de cümlenin başına 'Do/Does' gelir: 'Do you like?' / 'Does she have?'",
    pattern: 'Do/Does + subject + verb?',
    patternTr: 'Do/Does + özne + fiil?',
    examples: [
      { en: 'Do you like cats?', tr: 'Kedileri sever misin?', highlight: 'Do' },
      { en: 'Does she have a bike?', tr: 'Onun bisikleti var mı?', highlight: 'Does' },
      { en: 'Do they play chess?', tr: 'Onlar satranç oynar mı?', highlight: 'Do' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: '___ you like ice cream?',
        questionTr: 'Dondurma sever misin?',
        options: ['Do', 'Does', 'Is'],
        answer: 'Do',
        explanation: 'With "you" → Do (not Does)',
        explanationTr: '"you" ile → Do kullanılır',
      },
      {
        type: 'multiChoice',
        question: '___ she have a dog?',
        questionTr: 'Onun köpeği var mı?',
        options: ['Do', 'Does', 'Is'],
        answer: 'Does',
        explanation: 'With "she" (third person) → Does',
        explanationTr: '"she" (üçüncü tekil şahıs) ile → Does kullanılır',
      },
      {
        type: 'multiChoice',
        question: '___ they play football?',
        questionTr: 'Onlar futbol oynar mı?',
        options: ['Do', 'Does', 'Are'],
        answer: 'Do',
        explanation: 'With "they" (plural) → Do',
        explanationTr: '"they" (çoğul) ile → Do kullanılır',
      },
    ],
  },

  // ─── LEVEL 2: There is / There are ──────────────────────────────────────
  {
    id: 'g14_there_is_are',
    topic: 'There is / There are',
    topicTr: 'Var: There is / There are',
    level: 2,
    turkishNote: "Türkçede 'var' tek kelime: 'bir kedi var', 'üç kedi var'. İngilizce'de tekil için 'there is', çoğul için 'there are' kullanılır",
    pattern: 'There is + singular / There are + plural',
    patternTr: 'There is + tekil isim / There are + çoğul isim',
    examples: [
      { en: 'There is a cat on the mat.', tr: 'Paspasın üzerinde bir kedi var.', highlight: 'There is' },
      { en: 'There are three birds in the tree.', tr: 'Ağaçta üç kuş var.', highlight: 'There are' },
      { en: 'There is a book on the desk.', tr: 'Masanın üzerinde bir kitap var.', highlight: 'There is' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: '___ a dog in the garden.',
        questionTr: 'Bahçede bir köpek var.',
        options: ['There is', 'There are', 'There be'],
        answer: 'There is',
        explanation: 'One dog (singular) → There is',
        explanationTr: 'Bir köpek (tekil) → There is',
      },
      {
        type: 'multiChoice',
        question: '___ five apples on the table.',
        questionTr: 'Masada beş elma var.',
        options: ['There is', 'There are', 'There be'],
        answer: 'There are',
        explanation: 'Five apples (plural) → There are',
        explanationTr: 'Beş elma (çoğul) → There are',
      },
      {
        type: 'multiChoice',
        question: '___ a rainbow in the sky.',
        questionTr: 'Gökyüzünde bir gökkuşağı var.',
        options: ['There is', 'There are', 'There be'],
        answer: 'There is',
        explanation: 'One rainbow (singular) → There is',
        explanationTr: 'Bir gökkuşağı (tekil) → There is',
      },
    ],
  },

  // ─── LEVEL 2: Adjective Before Noun ─────────────────────────────────────
  {
    id: 'g15_adjective_order',
    topic: 'Adjective Before Noun',
    topicTr: 'Sıfat İsimden Önce Gelir',
    level: 2,
    turkishNote: "Türkçede sıfat isimden önce gelir: 'büyük köpek' = 'big dog'. İngilizce sıralaması aynı: sıfat + isim. Türkçe konuşanlar için kolay!",
    pattern: 'adjective + noun',
    patternTr: 'sıfat + isim',
    examples: [
      { en: 'I have a big dog.', tr: 'Benim büyük bir köpeğim var.', highlight: 'big dog' },
      { en: 'She wears a red hat.', tr: 'O kırmızı bir şapka takıyor.', highlight: 'red hat' },
      { en: 'It is a cute baby.', tr: 'O sevimli bir bebek.', highlight: 'cute baby' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: 'She has a ___ cat.',
        questionTr: 'Onun sarı bir kedisi var.',
        options: ['yellow cat', 'cat yellow', 'cat is yellow'],
        answer: 'yellow cat',
        explanation: 'Adjective comes before the noun: yellow cat',
        explanationTr: 'Sıfat isimden önce gelir: yellow cat',
      },
      {
        type: 'multiChoice',
        question: 'I see ___.',
        questionTr: 'Büyük bir ağaç görüyorum.',
        options: ['tree big', 'a big tree', 'a tree big'],
        answer: 'a big tree',
        explanation: 'Correct order: article + adjective + noun (a big tree)',
        explanationTr: 'Doğru sıra: article + sıfat + isim (a big tree)',
      },
      {
        type: 'multiChoice',
        question: 'He wears a ___ shirt.',
        questionTr: 'O mavi bir gömlek giyiyor.',
        options: ['shirt blue', 'blue shirt', 'shirt is blue'],
        answer: 'blue shirt',
        explanation: 'Adjective before noun: blue shirt',
        explanationTr: 'Sıfat isimden önce: blue shirt',
      },
    ],
  },

  // ─── LEVEL 3: Comparatives ───────────────────────────────────────────────
  {
    id: 'g16_comparatives',
    topic: 'Comparatives: -er / more',
    topicTr: 'Karşılaştırma: -er / more',
    level: 3,
    turkishNote: "Türkçede '-den daha': 'köpek kediden daha büyük'. İngilizce'de kısa sıfatlar 'er' alır: 'bigger'. Uzun sıfatlar 'more' alır: 'more beautiful'",
    pattern: 'adjective + er / more + adjective + than',
    patternTr: 'kısa sıfat + er than / more + uzun sıfat + than',
    examples: [
      { en: 'A dog is bigger than a cat.', tr: 'Köpek kediden daha büyük.', highlight: 'bigger than' },
      { en: 'This book is more interesting than that one.', tr: 'Bu kitap şundan daha ilginç.', highlight: 'more interesting than' },
      { en: 'She runs faster than me.', tr: 'O benden daha hızlı koşuyor.', highlight: 'faster than' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: 'An elephant is ___ a dog.',
        questionTr: 'Bir fil köpekten daha büyük.',
        options: ['bigger than', 'more big than', 'big than'],
        answer: 'bigger than',
        explanation: '"big" is a short adjective → bigger than',
        explanationTr: '"big" kısa sıfat → bigger than',
      },
      {
        type: 'multiChoice',
        question: 'This film is ___ that one.',
        questionTr: 'Bu film şundan daha ilginç.',
        options: ['interestinger than', 'more interesting than', 'interesting than'],
        answer: 'more interesting than',
        explanation: '"interesting" is a long adjective → more interesting than',
        explanationTr: '"interesting" uzun sıfat → more interesting than',
      },
      {
        type: 'multiChoice',
        question: 'A cheetah is ___ a horse.',
        questionTr: 'Bir çita attan daha hızlı.',
        options: ['faster than', 'more fast than', 'fast than'],
        answer: 'faster than',
        explanation: '"fast" is a short adjective → faster than',
        explanationTr: '"fast" kısa sıfat → faster than',
      },
    ],
  },

  // ─── LEVEL 3: Superlatives ───────────────────────────────────────────────
  {
    id: 'g17_superlatives',
    topic: 'Superlatives: -est / most',
    topicTr: 'En üstünlük: -est / most',
    level: 3,
    turkishNote: "Türkçede 'en': 'en büyük', 'en güzel'. İngilizce'de 'the' + sıfat + 'est': 'the biggest'. Uzun sıfatlar 'the most': 'the most beautiful'",
    pattern: 'the + adjective + est / the most + adjective',
    patternTr: 'the + kısa sıfat + est / the most + uzun sıfat',
    examples: [
      { en: 'The elephant is the biggest animal.', tr: 'Fil en büyük hayvan.', highlight: 'the biggest' },
      { en: 'This is the most beautiful flower.', tr: 'Bu en güzel çiçek.', highlight: 'the most beautiful' },
      { en: 'She is the fastest runner.', tr: 'O en hızlı koşucu.', highlight: 'the fastest' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: 'The blue whale is ___ animal.',
        questionTr: 'Mavi balina en büyük hayvan.',
        options: ['the biggest', 'the most big', 'bigger'],
        answer: 'the biggest',
        explanation: '"big" is a short adjective → the biggest',
        explanationTr: '"big" kısa sıfat → the biggest',
      },
      {
        type: 'multiChoice',
        question: 'That was ___ movie I have ever seen.',
        questionTr: 'O gördüğüm en güzel filmdi.',
        options: ['the most beautiful', 'the beautifullest', 'beautifuller'],
        answer: 'the most beautiful',
        explanation: '"beautiful" is a long adjective → the most beautiful',
        explanationTr: '"beautiful" uzun sıfat → the most beautiful',
      },
      {
        type: 'multiChoice',
        question: 'He is ___ student in class.',
        questionTr: 'O sınıfın en zeki öğrencisi.',
        options: ['the smartest', 'the most smart', 'smarter'],
        answer: 'the smartest',
        explanation: '"smart" is a short adjective → the smartest',
        explanationTr: '"smart" kısa sıfat → the smartest',
      },
    ],
  },

  // ─── LEVEL 3: Future (going to) ──────────────────────────────────────────
  {
    id: 'g18_future_going_to',
    topic: 'Future: going to',
    topicTr: 'Gelecek Zaman: going to',
    level: 3,
    turkishNote: "Türkçede gelecek zaman '-ecek/-acak': 'gideceğim'. İngilizce'de 'going to + fiil': 'I am going to go'. Planlı eylemler için kullanılır",
    pattern: 'Subject + am/is/are + going to + verb',
    patternTr: 'Özne + am/is/are + going to + fiil',
    examples: [
      { en: 'I am going to eat lunch.', tr: 'Öğle yemeği yiyeceğim.', highlight: 'am going to eat' },
      { en: 'She is going to visit her friend.', tr: 'O arkadaşını ziyaret edecek.', highlight: 'is going to visit' },
      { en: 'We are going to play football tomorrow.', tr: 'Yarın futbol oynayacağız.', highlight: 'are going to play' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: 'I ___ eat pizza tonight.',
        questionTr: 'Bu gece pizza yiyeceğim.',
        options: ['am going to', 'is going to', 'are going to'],
        answer: 'am going to',
        explanation: 'I → am going to',
        explanationTr: 'I ile → am going to kullanılır',
      },
      {
        type: 'multiChoice',
        question: 'She ___ visit her grandmother.',
        questionTr: 'O büyükannesini ziyaret edecek.',
        options: ['am going to', 'is going to', 'are going to'],
        answer: 'is going to',
        explanation: 'She → is going to',
        explanationTr: 'She ile → is going to kullanılır',
      },
      {
        type: 'multiChoice',
        question: 'We ___ play games after school.',
        questionTr: 'Okuldan sonra oyun oynayacağız.',
        options: ['am going to', 'is going to', 'are going to'],
        answer: 'are going to',
        explanation: 'We → are going to',
        explanationTr: 'We ile → are going to kullanılır',
      },
    ],
  },

  // ─── LEVEL 2: Question Words (Wh-) ──────────────────────────────────────
  {
    id: 'g19_question_words',
    topic: 'Question Words: Wh-',
    topicTr: 'Soru Kelimeleri: Wh-',
    level: 2,
    turkishNote: 'Türkçede soru kelimeleri: ne, nerede, kim, ne zaman, neden, nasıl. İngilizce: what, where, who, when, why, how. Hepsi cümlenin başına gelir',
    pattern: 'Wh- word + do/does/is + subject + verb?',
    patternTr: 'Soru kelimesi + do/does/is + özne + fiil?',
    examples: [
      { en: 'What is your name?', tr: 'Adın ne?', highlight: 'What' },
      { en: 'Where do you live?', tr: 'Nerede yaşıyorsun?', highlight: 'Where' },
      { en: 'Why are you laughing?', tr: 'Neden gülüyorsun?', highlight: 'Why' },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: '___ is your favourite colour?',
        questionTr: 'En sevdiğin renk ne?',
        options: ['What', 'Where', 'Who'],
        answer: 'What',
        explanation: 'Asking about a thing → What',
        explanationTr: 'Bir şey hakkında sorulduğunda → What',
      },
      {
        type: 'multiChoice',
        question: '___ do you live?',
        questionTr: 'Nerede yaşıyorsun?',
        options: ['What', 'Where', 'When'],
        answer: 'Where',
        explanation: 'Asking about a place → Where',
        explanationTr: 'Bir yer hakkında sorulduğunda → Where',
      },
      {
        type: 'multiChoice',
        question: '___ is your best friend?',
        questionTr: 'En iyi arkadaşın kim?',
        options: ['What', 'Where', 'Who'],
        answer: 'Who',
        explanation: 'Asking about a person → Who',
        explanationTr: 'Bir kişi hakkında sorulduğunda → Who',
      },
    ],
  },

  // ─── LEVEL 1: Possessive 's ──────────────────────────────────────────────
  {
    id: 'g20_possessive_s',
    topic: "Possessive: 's",
    topicTr: "İyelik: 's",
    level: 1,
    turkishNote: "Türkçede iyelik eki '-in': 'Mimi'nin kedisi'. İngilizce'de kesme işareti + s: 'Mimi's cat'. Bu ters bir yapı Türkçe'ye göre!",
    pattern: "noun + 's + noun",
    patternTr: "isim + 's + isim",
    examples: [
      { en: "This is Mimi's cat.", tr: "Bu Mimi'nin kedisi.", highlight: "Mimi's" },
      { en: "That is Tom's book.", tr: "Şu Tom'un kitabı.", highlight: "Tom's" },
      { en: "The dog's tail is long.", tr: 'Köpeğin kuyruğu uzun.', highlight: "dog's" },
    ],
    exercises: [
      {
        type: 'multiChoice',
        question: "This is ___ bag. (the bag belongs to Sara)",
        questionTr: "Bu Sara'nın çantası.",
        options: ["Sara's", 'Saras', "of Sara"],
        answer: "Sara's",
        explanation: "To show possession → name + 's (Sara's)",
        explanationTr: "Sahiplik için → isim + 's (Sara's)",
      },
      {
        type: 'multiChoice',
        question: "I like ___ hat. (the hat belongs to Tom)",
        questionTr: "Tom'un şapkasını seviyorum.",
        options: ["Tom's", 'Toms', 'of Tom'],
        answer: "Tom's",
        explanation: "Tom owns the hat → Tom's hat",
        explanationTr: "Şapka Tom'a ait → Tom's hat",
      },
      {
        type: 'multiChoice',
        question: "___ name is Fluffy. (the cat's name)",
        questionTr: 'Kedinin adı Fluffy.',
        options: ["The cat's", 'The cats', 'Of the cat'],
        answer: "The cat's",
        explanation: "The cat owns its name → the cat's name",
        explanationTr: "Ad kediye ait → the cat's name",
      },
    ],
  },
];

// Helper: get grammar lessons by level
export function getGrammarLessonsByLevel(level: 1 | 2 | 3): GrammarLesson[] {
  return grammarLessons.filter(l => l.level === level);
}

// Helper: get a grammar lesson by id
export function getGrammarLesson(id: string): GrammarLesson | undefined {
  return grammarLessons.find(l => l.id === id);
}
