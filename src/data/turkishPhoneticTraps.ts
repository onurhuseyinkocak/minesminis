// ─── Turkish Phonetic Interference Trainer Data ─────────────────────────────
// Turkish children learning English have predictable pronunciation difficulties
// based on Turkish phonology. These 8 traps target the exact trouble spots.

export interface MinimalPair {
  english: string;
  errorVersion: string;
  meaning: string;
  meaningTr: string;
}

export interface TrapExercise {
  id: string;
  type: 'listen_distinguish' | 'multiple_choice' | 'visual_mouth';
  prompt: string;
  promptTr: string;
  targetWord: string;
  options?: string[];
  correctOption?: string;
}

export interface PhoneticTrap {
  id: string;
  targetSound: string;
  targetSoundIPA: string;
  turkishEquivalent: string;
  commonError: string;
  commonErrorTr: string;
  mouthPosition: string;
  mouthPositionTr: string;
  difficulty: 1 | 2 | 3;
  color: string;
  minimalPairs: MinimalPair[];
  exercises: TrapExercise[];
}

export const PHONETIC_TRAPS: PhoneticTrap[] = [
  // ── 1. TH voiceless /θ/ ─────────────────────────────────────────────────
  {
    id: 'th-voiceless',
    targetSound: 'TH (voiceless)',
    targetSoundIPA: '/θ/',
    turkishEquivalent: 't',
    commonError: 'Turkish learners say "t" instead of "θ" — tongue stays behind teeth',
    commonErrorTr: 'Türk öğrenciler "θ" yerine "t" der — dil dişlerin arasına girmez',
    mouthPosition: 'Put the tip of your tongue lightly between your upper and lower teeth. Blow air out gently — like you are blowing dust. Do NOT press hard.',
    mouthPositionTr: 'Dil ucunu hafifçe üst ve alt dişlerin arasına koy. Havayı nazikçe üfle — toz üflüyormuş gibi. Sert basma!',
    difficulty: 3,
    color: '#7C3AED',
    minimalPairs: [
      { english: 'think', errorVersion: 'tink', meaning: 'to use your mind', meaningTr: 'düşünmek' },
      { english: 'three', errorVersion: 'tree', meaning: 'the number 3', meaningTr: 'üç sayısı' },
      { english: 'thank', errorVersion: 'tank', meaning: 'to express gratitude', meaningTr: 'teşekkür etmek' },
      { english: 'thin', errorVersion: 'tin', meaning: 'not thick', meaningTr: 'ince' },
      { english: 'thumb', errorVersion: 'tum', meaning: 'the big finger', meaningTr: 'baş parmak' },
    ],
    exercises: [
      {
        id: 'th-v-mc1',
        type: 'multiple_choice',
        prompt: 'Which word means "the number 3"?',
        promptTr: '"3 sayısı" anlamına gelen kelime hangisi?',
        targetWord: 'three',
        options: ['tree', 'three', 'free'],
        correctOption: 'three',
      },
      {
        id: 'th-v-mc2',
        type: 'multiple_choice',
        prompt: 'A soldier drives this vehicle — it is NOT "thank":',
        promptTr: 'Bir asker bu araçla gider — "thank" DEĞİL:',
        targetWord: 'tank',
        options: ['thank', 'tank', 'rank'],
        correctOption: 'tank',
      },
      {
        id: 'th-v-ld1',
        type: 'listen_distinguish',
        prompt: 'Your big finger is your ___',
        promptTr: 'Büyük parmağın ___',
        targetWord: 'thumb',
        options: ['tum', 'thumb', 'gum'],
        correctOption: 'thumb',
      },
    ],
  },

  // ── 2. TH voiced /ð/ ────────────────────────────────────────────────────
  {
    id: 'th-voiced',
    targetSound: 'TH (voiced)',
    targetSoundIPA: '/ð/',
    turkishEquivalent: 'd',
    commonError: 'Turkish learners say "d" instead of "ð" — "the" sounds like "de"',
    commonErrorTr: 'Türk öğrenciler "ð" yerine "d" der — "the" kelimesi "de" gibi çıkar',
    mouthPosition: 'Same as voiceless TH but now make your voice vibrate! Tongue between teeth, blow air, and add your voice (like a bee buzzing).',
    mouthPositionTr: 'Sessiz TH ile aynı ama şimdi sesinle titret! Dil dişlerin arasında, hava üfle ve sesini ekle (arı vızıltısı gibi).',
    difficulty: 3,
    color: '#6D28D9',
    minimalPairs: [
      { english: 'they', errorVersion: 'day', meaning: 'a group of people', meaningTr: 'onlar' },
      { english: 'though', errorVersion: 'dough', meaning: 'even so / despite', meaningTr: 'yine de / her ne kadar' },
      { english: 'there', errorVersion: 'dare', meaning: 'in that place', meaningTr: 'orada' },
      { english: 'breathe', errorVersion: 'breed', meaning: 'to take in air', meaningTr: 'nefes almak' },
      { english: 'soothe', errorVersion: 'sued', meaning: 'to calm down', meaningTr: 'sakinleştirmek' },
    ],
    exercises: [
      {
        id: 'th-voiced-mc1',
        type: 'multiple_choice',
        prompt: 'Which word means "in that place"?',
        promptTr: '"Orada" anlamına gelen kelime hangisi?',
        targetWord: 'there',
        options: ['dare', 'there', 'bare'],
        correctOption: 'there',
      },
      {
        id: 'th-voiced-mc2',
        type: 'multiple_choice',
        prompt: 'What do you do every second with your lungs?',
        promptTr: 'Akciğerlerinle her saniye ne yapıyorsun?',
        targetWord: 'breathe',
        options: ['breed', 'breathe', 'bream'],
        correctOption: 'breathe',
      },
      {
        id: 'th-voiced-ld1',
        type: 'listen_distinguish',
        prompt: 'A group of friends — we call them ___',
        promptTr: 'Bir grup arkadaş — onlara ___ deriz',
        targetWord: 'they',
        options: ['day', 'dey', 'they'],
        correctOption: 'they',
      },
    ],
  },

  // ── 3. W vs V ────────────────────────────────────────────────────────────
  {
    id: 'w-vs-v',
    targetSound: 'W sound',
    targetSoundIPA: '/w/',
    turkishEquivalent: 'v',
    commonError: 'Turkish has /v/ but no /w/. "wine" is said as "vine", "we" as "ve"',
    commonErrorTr: 'Türkçede /v/ var ama /w/ yok. "wine" kelimesi "vine" olarak söylenir',
    mouthPosition: 'Round your lips like you are kissing or blowing a candle. Do NOT touch your teeth with your lip! Air flows freely — it is a smooth "oo" start.',
    mouthPositionTr: 'Dudaklarını yuvarlak yap, öpüyor ya da mum üflüyormuş gibi. Üst dişlerin alt dudağa değmemeli! Hava serbestçe akar.',
    difficulty: 2,
    color: '#2563EB',
    minimalPairs: [
      { english: 'wine', errorVersion: 'vine', meaning: 'a drink made from grapes', meaningTr: 'üzümden yapılan içecek (şarap)' },
      { english: 'west', errorVersion: 'vest', meaning: 'a compass direction', meaningTr: 'batı yönü' },
      { english: 'wet', errorVersion: 'vet', meaning: 'covered with water', meaningTr: 'ıslak' },
      { english: 'wow', errorVersion: 'vow', meaning: 'expression of surprise', meaningTr: 'şaşırma ifadesi' },
      { english: 'wheel', errorVersion: 'veal', meaning: 'a round rolling object', meaningTr: 'yuvarlak dönen nesne' },
    ],
    exercises: [
      {
        id: 'wv-mc1',
        type: 'multiple_choice',
        prompt: 'Your bicycle has two of these round things:',
        promptTr: 'Bisikletinin iki tane yuvarlak şeyi var:',
        targetWord: 'wheel',
        options: ['veal', 'wheel', 'weal'],
        correctOption: 'wheel',
      },
      {
        id: 'wv-mc2',
        type: 'multiple_choice',
        prompt: 'After rain, the grass is ___',
        promptTr: 'Yağmurdan sonra çimen ___',
        targetWord: 'wet',
        options: ['vet', 'wet', 'net'],
        correctOption: 'wet',
      },
      {
        id: 'wv-ld1',
        type: 'listen_distinguish',
        prompt: 'The sun sets in the ___',
        promptTr: 'Güneş ___ de batar',
        targetWord: 'west',
        options: ['vest', 'best', 'west'],
        correctOption: 'west',
      },
    ],
  },

  // ── 4. Short vowel /ɪ/ ──────────────────────────────────────────────────
  {
    id: 'short-i',
    targetSound: 'Short I',
    targetSoundIPA: '/ɪ/',
    turkishEquivalent: 'iː (long ee)',
    commonError: 'Turkish /i/ is longer and tenser. "bit" sounds like "beat", "ship" like "sheep"',
    commonErrorTr: 'Türkçe /i/ daha uzun ve gergin. "bit" kelimesi "beat" gibi çıkar',
    mouthPosition: 'Open your mouth just a little. Your tongue is high but relaxed. Say it FAST and SHORT — like a quick "ih" not a long "ee".',
    mouthPositionTr: 'Ağzını biraz aç. Dilin yukarıda ama gevşek olsun. Hızlı ve kısa söyle — uzun "ii" değil, kısa "ıh" gibi.',
    difficulty: 2,
    color: '#059669',
    minimalPairs: [
      { english: 'bit', errorVersion: 'beat', meaning: 'a small piece / past tense of bite', meaningTr: 'küçük parça / ısırmak geçmiş zaman' },
      { english: 'ship', errorVersion: 'sheep', meaning: 'a large boat', meaningTr: 'büyük gemi' },
      { english: 'fit', errorVersion: 'feet', meaning: 'the right size / to be healthy', meaningTr: 'doğru boyut / sağlıklı olmak' },
      { english: 'live', errorVersion: 'leave', meaning: 'to be alive / to reside', meaningTr: 'yaşamak / oturmak' },
      { english: 'sit', errorVersion: 'seat', meaning: 'to lower yourself onto a chair', meaningTr: 'sandalyeye oturmak' },
    ],
    exercises: [
      {
        id: 'si-mc1',
        type: 'multiple_choice',
        prompt: 'A large boat that crosses the ocean is a ___',
        promptTr: 'Okyanusları geçen büyük gemi:',
        targetWord: 'ship',
        options: ['sheep', 'ship', 'shop'],
        correctOption: 'ship',
      },
      {
        id: 'si-mc2',
        type: 'multiple_choice',
        prompt: 'When clothes are the right size, they ___',
        promptTr: 'Kıyafetler doğru boyutta olunca ___',
        targetWord: 'fit',
        options: ['feet', 'feat', 'fit'],
        correctOption: 'fit',
      },
      {
        id: 'si-ld1',
        type: 'listen_distinguish',
        prompt: 'Please ___ down on the chair',
        promptTr: 'Lütfen sandalyeye ___',
        targetWord: 'sit',
        options: ['seat', 'sit', 'set'],
        correctOption: 'sit',
      },
    ],
  },

  // ── 5. Consonant clusters ────────────────────────────────────────────────
  {
    id: 'consonant-clusters',
    targetSound: 'Consonant Clusters',
    targetSoundIPA: '/str/ /spl/ /spr/',
    turkishEquivalent: 'added vowel',
    commonError: 'Turkish (CV language) inserts a vowel between consonants — "street" → "istereet"',
    commonErrorTr: 'Türkçe (CV dili) ünsüzlerin arasına sesli ekler — "street" → "istereet" olur',
    mouthPosition: 'Keep consonants GLUED together — no vowel sneaks in! Practice slowly: S...T...R then speed up. Hold your breath between sounds.',
    mouthPositionTr: 'Ünsüzleri birbirine YAPIŞTIR — araya sesli girmesin! Yavaş başla: S...T...R sonra hızlan. Sesler arasında nefes tutma.',
    difficulty: 3,
    color: '#DC2626',
    minimalPairs: [
      { english: 'street', errorVersion: 'istereet', meaning: 'a road in a city', meaningTr: 'şehirde yol' },
      { english: 'splash', errorVersion: 'ısplash', meaning: 'water hitting something', meaningTr: 'suyu bir şeye çarpmak' },
      { english: 'spring', errorVersion: 'ıspring', meaning: 'the season after winter', meaningTr: 'kış sonrası mevsim (bahar)' },
      { english: 'strong', errorVersion: 'ıstrong', meaning: 'having great power', meaningTr: 'güçlü' },
      { english: 'screen', errorVersion: 'ıscreen', meaning: 'a flat display surface', meaningTr: 'düz ekran yüzeyi' },
    ],
    exercises: [
      {
        id: 'cc-mc1',
        type: 'multiple_choice',
        prompt: 'The season after winter — flowers bloom!',
        promptTr: 'Kıştan sonra gelen mevsim — çiçekler açar!',
        targetWord: 'spring',
        options: ['ıspring', 'spring', 'spiring'],
        correctOption: 'spring',
      },
      {
        id: 'cc-mc2',
        type: 'multiple_choice',
        prompt: 'You walk along this in a city',
        promptTr: 'Şehirde boyunca yürüdüğün yer',
        targetWord: 'street',
        options: ['istereet', 'street', 'streat'],
        correctOption: 'street',
      },
      {
        id: 'cc-ld1',
        type: 'listen_distinguish',
        prompt: 'A superhero is very ___',
        promptTr: 'Bir süper kahraman çok ___',
        targetWord: 'strong',
        options: ['ıstrong', 'strong', 'strung'],
        correctOption: 'strong',
      },
    ],
  },

  // ── 6. Final consonants ──────────────────────────────────────────────────
  {
    id: 'final-consonants',
    targetSound: 'Final Consonants',
    targetSoundIPA: '/t/ /d/ /k/ (word-final)',
    turkishEquivalent: 'added schwa',
    commonError: 'Turkish adds a vowel sound after final consonants — "cat" → "cate", "bed" → "bede"',
    commonErrorTr: 'Türkçe son ünsüzden sonra sesli ekler — "cat" → "cate", "bed" → "bede" olur',
    mouthPosition: 'STOP the sound — do not add anything after! Close your mouth fully at the end. Imagine biting the word off cleanly.',
    mouthPositionTr: 'Sesi DURDUR — sonrasına hiçbir şey ekleme! Sonda ağzını tam kapat. Kelimeyi temizce kesiyormuş gibi düşün.',
    difficulty: 2,
    color: '#D97706',
    minimalPairs: [
      { english: 'cat', errorVersion: 'cate', meaning: 'a furry pet animal', meaningTr: 'tüylü evcil hayvan' },
      { english: 'bed', errorVersion: 'bede', meaning: 'furniture for sleeping', meaningTr: 'uyku mobilyası (yatak)' },
      { english: 'back', errorVersion: 'backe', meaning: 'the rear / return', meaningTr: 'arka / geri dönmek' },
      { english: 'map', errorVersion: 'mape', meaning: 'a drawing of an area', meaningTr: 'harita' },
      { english: 'hot', errorVersion: 'hote', meaning: 'high temperature', meaningTr: 'yüksek sıcaklık' },
    ],
    exercises: [
      {
        id: 'fc-mc1',
        type: 'multiple_choice',
        prompt: 'You sleep on a ___',
        promptTr: '___ üzerinde uyursun',
        targetWord: 'bed',
        options: ['bede', 'bed', 'bad'],
        correctOption: 'bed',
      },
      {
        id: 'fc-mc2',
        type: 'multiple_choice',
        prompt: 'A furry animal that says "meow"',
        promptTr: '"Miyav" diyen tüylü hayvan',
        targetWord: 'cat',
        options: ['cate', 'cat', 'cut'],
        correctOption: 'cat',
      },
      {
        id: 'fc-ld1',
        type: 'listen_distinguish',
        prompt: 'A drawing that shows roads and cities',
        promptTr: 'Yolları ve şehirleri gösteren çizim',
        targetWord: 'map',
        options: ['mape', 'map', 'mop'],
        correctOption: 'map',
      },
    ],
  },

  // ── 7. English /r/ ───────────────────────────────────────────────────────
  {
    id: 'english-r',
    targetSound: 'English R',
    targetSoundIPA: '/r/ (retroflex)',
    turkishEquivalent: 'r (trilled/tapped)',
    commonError: 'Turkish /r/ is trilled (tongue vibrates). English /r/ is retroflex — tongue curls back, no vibration.',
    commonErrorTr: 'Türkçe /r/ titreşimlidir (dil titrer). İngilizce /r/ retroflex — dil geriye kıvrılır, titreşim olmaz.',
    mouthPosition: 'Curl your tongue tip UP and BACK without touching anything. Round your lips slightly. NO tongue vibration — just curl and hold.',
    mouthPositionTr: 'Dil ucunu yukarı ve geriye KIVIR, hiçbir şeye değmeden. Dudaklarını hafifçe yuvarla. Dil TİTREŞMEMELİ — sadece kıvır ve tut.',
    difficulty: 2,
    color: '#0891B2',
    minimalPairs: [
      { english: 'rice', errorVersion: 'r̈ice', meaning: 'a grain food', meaningTr: 'tahıl yiyeceği (pirinç)' },
      { english: 'rain', errorVersion: 'r̈ain', meaning: 'water falling from the sky', meaningTr: 'gökten düşen su (yağmur)' },
      { english: 'run', errorVersion: 'r̈un', meaning: 'to move fast on foot', meaningTr: 'ayakla hızlı hareket etmek (koşmak)' },
      { english: 'road', errorVersion: 'r̈oad', meaning: 'a path for vehicles', meaningTr: 'araçlar için yol' },
      { english: 'read', errorVersion: 'r̈ead', meaning: 'to look at text', meaningTr: 'metne bakmak (okumak)' },
    ],
    exercises: [
      {
        id: 'er-mc1',
        type: 'visual_mouth',
        prompt: 'For English R, where does your tongue go?',
        promptTr: 'İngilizce R için dilin nereye gider?',
        targetWord: 'run',
        options: ['Tongue vibrates fast', 'Tongue curls up and back', 'Tongue touches top teeth'],
        correctOption: 'Tongue curls up and back',
      },
      {
        id: 'er-mc2',
        type: 'multiple_choice',
        prompt: 'Water falling from the sky:',
        promptTr: 'Gökten düşen su:',
        targetWord: 'rain',
        options: ['lane', 'rain', 'rein'],
        correctOption: 'rain',
      },
      {
        id: 'er-ld1',
        type: 'multiple_choice',
        prompt: 'You cook this grain with curry or stir-fry:',
        promptTr: 'Körili ya da karıştırma kızartmasıyla pişirilen tahıl:',
        targetWord: 'rice',
        options: ['lice', 'rice', 'mice'],
        correctOption: 'rice',
      },
    ],
  },

  // ── 8. NG sound /ŋ/ ─────────────────────────────────────────────────────
  {
    id: 'ng-sound',
    targetSound: 'NG sound',
    targetSoundIPA: '/ŋ/',
    turkishEquivalent: 'n',
    commonError: 'Turkish does not end words with /ŋ/. "sing" → "sin", "ring" → "rin"',
    commonErrorTr: 'Türkçe kelimeler /ŋ/ ile bitmez. "sing" → "sin", "ring" → "rin" olur',
    mouthPosition: 'The back of your tongue presses against the soft palate (the back part of the roof of your mouth). Air comes through your NOSE, not mouth. Hold this position!',
    mouthPositionTr: 'Dilin arkası damağın yumuşak kısmına (damağın arka bölümü) baskı yapar. Hava ağzından değil BURNUNDAN çıkar. Bu pozisyonu tut!',
    difficulty: 2,
    color: '#BE185D',
    minimalPairs: [
      { english: 'sing', errorVersion: 'sin', meaning: 'to make music with your voice', meaningTr: 'sesle müzik yapmak (şarkı söylemek)' },
      { english: 'ring', errorVersion: 'rin', meaning: 'a circular piece of jewellery', meaningTr: 'yuvarlak mücevher (yüzük)' },
      { english: 'long', errorVersion: 'lon', meaning: 'great in length', meaningTr: 'uzun' },
      { english: 'king', errorVersion: 'kin', meaning: 'a male ruler', meaningTr: 'erkek hükümdar (kral)' },
      { english: 'song', errorVersion: 'son', meaning: 'a piece of music', meaningTr: 'müzik parçası (şarkı)' },
    ],
    exercises: [
      {
        id: 'ng-mc1',
        type: 'multiple_choice',
        prompt: 'You wear this circle on your finger:',
        promptTr: 'Parmağında taktığın bu daire:',
        targetWord: 'ring',
        options: ['rin', 'ring', 'rink'],
        correctOption: 'ring',
      },
      {
        id: 'ng-mc2',
        type: 'multiple_choice',
        prompt: 'A male ruler with a crown:',
        promptTr: 'Taçlı erkek hükümdar:',
        targetWord: 'king',
        options: ['kin', 'king', 'kind'],
        correctOption: 'king',
      },
      {
        id: 'ng-ld1',
        type: 'listen_distinguish',
        prompt: 'You love to ___ your favourite song!',
        promptTr: 'Sevdiğin şarkıyı ___ çok seviyorsun!',
        targetWord: 'sing',
        options: ['sin', 'sing', 'sink'],
        correctOption: 'sing',
      },
    ],
  },

  // ── 9. Short /æ/ vs /ʌ/ — cat/cut confusion ────────────────────────────
  {
    id: 'ae-vs-uh',
    targetSound: 'Short A /æ/ vs Short U /ʌ/',
    targetSoundIPA: '/æ/ vs /ʌ/',
    turkishEquivalent: 'a (single vowel)',
    commonError: 'Turkish /a/ maps to both /æ/ and /ʌ/ — "cat" and "cut" sound identical to Turkish ears',
    commonErrorTr: 'Türkçe /a/ hem /æ/ hem /ʌ/ yerine geçer — Türk kulağına "cat" ve "cut" aynı duyulur',
    mouthPosition: 'For /æ/ (cat): open your mouth wide, jaw drops, tongue is low and flat. For /ʌ/ (cut): mouth is less open, tongue is mid-central — like a short grunt "uh".',
    mouthPositionTr: '/æ/ (cat) için: ağzını geniş aç, çene aşağı iner, dil aşağıda ve düzdür. /ʌ/ (cut) için: ağız daha az açık, dil orta-merkezdedir — kısa "ah" gibi.',
    difficulty: 2,
    color: '#0D9488',
    minimalPairs: [
      { english: 'cat', errorVersion: 'cut', meaning: 'a pet animal (meow)', meaningTr: 'evcil hayvan (miyav)' },
      { english: 'bad', errorVersion: 'bud', meaning: 'not good', meaningTr: 'kötü' },
      { english: 'hat', errorVersion: 'hut', meaning: 'a head covering', meaningTr: 'başlık' },
      { english: 'man', errorVersion: 'mun', meaning: 'an adult male', meaningTr: 'yetişkin erkek' },
      { english: 'ban', errorVersion: 'bun', meaning: 'to forbid something', meaningTr: 'bir şeyi yasaklamak' },
    ],
    exercises: [
      {
        id: 'ae-uh-mc1',
        type: 'multiple_choice',
        prompt: 'The animal that says "meow" — is it "cat" or "cut"?',
        promptTr: '"Miyav" diyen hayvan — "cat" mi "cut" mi?',
        targetWord: 'cat',
        options: ['cut', 'cat', 'cot'],
        correctOption: 'cat',
      },
      {
        id: 'ae-uh-mc2',
        type: 'multiple_choice',
        prompt: 'You wear this on your head — is it "hat" or "hut"?',
        promptTr: 'Başına taktığın şey — "hat" mi "hut" mu?',
        targetWord: 'hat',
        options: ['hut', 'hat', 'hit'],
        correctOption: 'hat',
      },
      {
        id: 'ae-uh-ld1',
        type: 'listen_distinguish',
        prompt: 'The opposite of "good" — is it "bad" or "bud"?',
        promptTr: '"İyi"nin zıttı — "bad" mi "bud" mu?',
        targetWord: 'bad',
        options: ['bud', 'bad', 'bed'],
        correctOption: 'bad',
      },
    ],
  },
];

export const TRAP_STORAGE_KEY = 'mm_phonetic_traps';
