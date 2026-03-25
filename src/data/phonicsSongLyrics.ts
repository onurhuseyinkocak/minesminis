// ============================================================
// MinesMinis Phonics Song Lyrics
// Full word-level karaoke lyrics for 7 phonics groups
// Designed for Turkish-speaking children learning English
// ============================================================

export interface SongLine {
  text: string;
  textTr: string;
  startMs: number;
  endMs: number;
  highlightWords: string[];
}

export interface PhonicsLyrics {
  soundGroup: number;
  targetSounds: string[];
  title: string;
  titleTr: string;
  bpm: number;
  lines: SongLine[];
}

// ─── Group 1: s, a, t, p, i, n ─────────────────────────────────────────────

const group1Lyrics: PhonicsLyrics = {
  soundGroup: 1,
  targetSounds: ['s', 'a', 't', 'p', 'i', 'n'],
  title: 'The Sound Safari',
  titleTr: 'Ses Safarisi',
  bpm: 120,
  lines: [
    {
      text: 'Welcome to the Sound Safari, come along with me!',
      textTr: 'Ses Safarisine hoş geldin, benimle gel!',
      startMs: 0,
      endMs: 4000,
      highlightWords: [],
    },
    {
      text: 'S-s-s says the snake, sliding in the sun',
      textTr: 'S-s-s diyor yılan, güneşte kayıyor',
      startMs: 4000,
      endMs: 8000,
      highlightWords: ['snake', 'sun', 'S-s-s', 'sliding'],
    },
    {
      text: 'A-a-a says the ant, having so much fun',
      textTr: 'A-a-a diyor karınca, çok eğleniyor',
      startMs: 8000,
      endMs: 12000,
      highlightWords: ['ant', 'A-a-a'],
    },
    {
      text: 'T-t-t says the tiger, tapping with its tail',
      textTr: 'T-t-t diyor kaplan, kuyruğuyla vuruyor',
      startMs: 12000,
      endMs: 16000,
      highlightWords: ['tiger', 'tail', 'T-t-t', 'tapping'],
    },
    {
      text: 'P-p-p says the penguin, playing in the pale',
      textTr: 'P-p-p diyor penguen, soluk renkte oynuyor',
      startMs: 16000,
      endMs: 20000,
      highlightWords: ['penguin', 'pale', 'P-p-p', 'playing'],
    },
    {
      text: 'I-i-i says the igloo, icy cold inside',
      textTr: 'I-i-i diyor igloo, içerisi buz gibi soğuk',
      startMs: 20000,
      endMs: 24000,
      highlightWords: ['igloo', 'icy', 'inside', 'I-i-i'],
    },
    {
      text: 'N-n-n says the nurse, napping by the slide',
      textTr: 'N-n-n diyor hemşire, kaydırak yanında şekerleme yapıyor',
      startMs: 24000,
      endMs: 28000,
      highlightWords: ['nurse', 'napping', 'N-n-n'],
    },
    {
      text: 'S is for snake and sun and sit and sip',
      textTr: 'S yılan, güneş, oturmak ve yudum almak için',
      startMs: 28000,
      endMs: 32000,
      highlightWords: ['snake', 'sun', 'sit', 'sip'],
    },
    {
      text: 'A is for ant and apple, an and at',
      textTr: 'A karınca ve elma, an ve at için',
      startMs: 32000,
      endMs: 36000,
      highlightWords: ['ant', 'apple', 'an', 'at'],
    },
    {
      text: 'T is for tap and tin and tip and tan',
      textTr: 'T vurmak, teneke, uç ve ten için',
      startMs: 36000,
      endMs: 40000,
      highlightWords: ['tap', 'tin', 'tip', 'tan'],
    },
    {
      text: 'P is for pan and pin and pit and plan',
      textTr: 'P tava, iğne, çukur ve plan için',
      startMs: 40000,
      endMs: 44000,
      highlightWords: ['pan', 'pin', 'pit', 'plan'],
    },
    {
      text: 'Nat sat on a tin, pat pat pat!',
      textTr: 'Nat bir tenekenin üstüne oturdu, pat pat pat!',
      startMs: 44000,
      endMs: 48000,
      highlightWords: ['Nat', 'sat', 'tin', 'pat'],
    },
    {
      text: 'A pin in the pan, nip nip nip!',
      textTr: 'Tavadaki iğne, nip nip nip!',
      startMs: 48000,
      endMs: 52000,
      highlightWords: ['pin', 'pan', 'nip'],
    },
    {
      text: 'S-A-T, P-I-N — these sounds are so great!',
      textTr: 'S-A-T, P-I-N — bu sesler çok harika!',
      startMs: 52000,
      endMs: 56000,
      highlightWords: ['S-A-T', 'P-I-N'],
    },
    {
      text: 'Sing them every day and you will be first rate!',
      textTr: 'Her gün söyle ve birinci sınıf olacaksın!',
      startMs: 56000,
      endMs: 60000,
      highlightWords: [],
    },
    {
      text: 'S-s-s, A-a-a, T-t-t — we know them all!',
      textTr: 'S-s-s, A-a-a, T-t-t — hepsini biliyoruz!',
      startMs: 60000,
      endMs: 64000,
      highlightWords: ['S-s-s', 'A-a-a', 'T-t-t'],
    },
  ],
};

// ─── Group 2: c/k, e, h, r, m, d ────────────────────────────────────────────

const group2Lyrics: PhonicsLyrics = {
  soundGroup: 2,
  targetSounds: ['k', 'e', 'h', 'r', 'm', 'd'],
  title: 'Kitchen Sounds',
  titleTr: 'Mutfak Sesleri',
  bpm: 116,
  lines: [
    {
      text: 'Come into the kitchen, what sounds can you hear?',
      textTr: 'Mutfağa gel, hangi sesleri duyabilirsin?',
      startMs: 0,
      endMs: 4000,
      highlightWords: ['Come', 'kitchen'],
    },
    {
      text: 'C-c-c the cat is cooking, stirring something near',
      textTr: 'K-k-k kedi yemek pişiriyor, yakında karıştırıyor',
      startMs: 4000,
      endMs: 8000,
      highlightWords: ['cat', 'cooking', 'C-c-c'],
    },
    {
      text: 'E-e-e the egg is ready, cracking in the pan',
      textTr: 'E-e-e yumurta hazır, tavada çatlıyor',
      startMs: 8000,
      endMs: 12000,
      highlightWords: ['egg', 'E-e-e'],
    },
    {
      text: 'H-h-h the hungry dog is panting — happy is the plan!',
      textTr: 'H-h-h aç köpek soluyuyor — mutlu bir plan!',
      startMs: 12000,
      endMs: 16000,
      highlightWords: ['hungry', 'happy', 'H-h-h'],
    },
    {
      text: 'R-r-r the lion roars for dinner, he wants more to eat',
      textTr: 'R-r-r aslan akşam yemeği için kükreyor, daha fazla yemek istiyor',
      startMs: 16000,
      endMs: 20000,
      highlightWords: ['roars', 'R-r-r'],
    },
    {
      text: 'M-m-m the muffin smells so yummy, what a tasty treat!',
      textTr: 'M-m-m muffin çok güzel kokuyor, ne lezzetli!',
      startMs: 20000,
      endMs: 24000,
      highlightWords: ['muffin', 'M-m-m'],
    },
    {
      text: 'D-d-d the drum goes bang, Dad is drumming near',
      textTr: 'D-d-d davul çalıyor, Baba yakında davul çalıyor',
      startMs: 24000,
      endMs: 28000,
      highlightWords: ['drum', 'Dad', 'drumming', 'D-d-d'],
    },
    {
      text: 'K is for kit and kid and kin and key',
      textTr: 'K set, çocuk, akraba ve anahtar için',
      startMs: 28000,
      endMs: 32000,
      highlightWords: ['kit', 'kid', 'kin', 'key'],
    },
    {
      text: 'E is for egg and end and elf and me',
      textTr: 'E yumurta, son, elf ve ben için',
      startMs: 32000,
      endMs: 36000,
      highlightWords: ['egg', 'end', 'elf', 'me'],
    },
    {
      text: 'H is for hat and hen and him and hug',
      textTr: 'H şapka, tavuk, o ve sarılmak için',
      startMs: 36000,
      endMs: 40000,
      highlightWords: ['hat', 'hen', 'him', 'hug'],
    },
    {
      text: 'Red cat met a mad hen, ran ran ran!',
      textTr: 'Kırmızı kedi deli bir tavukla karşılaştı, koştu koştu koştu!',
      startMs: 40000,
      endMs: 44000,
      highlightWords: ['Red', 'cat', 'met', 'mad', 'hen', 'ran'],
    },
    {
      text: 'Mum had a drum and dim red hut',
      textTr: 'Annenin davulu ve loş kırmızı kulübesi vardı',
      startMs: 44000,
      endMs: 48000,
      highlightWords: ['Mum', 'drum', 'dim', 'red', 'hut'],
    },
    {
      text: 'C, E, H, R, M, D — clap them in the kitchen!',
      textTr: 'C, E, H, R, M, D — mutfakta alkışla!',
      startMs: 48000,
      endMs: 52000,
      highlightWords: [],
    },
    {
      text: 'Every letter makes a sound — now we\'re on a mission!',
      textTr: 'Her harf bir ses çıkarır — şimdi bir görevdeyiz!',
      startMs: 52000,
      endMs: 56000,
      highlightWords: [],
    },
  ],
};

// ─── Group 3: g, o, u, l, f, b ─────────────────────────────────────────────

const group3Lyrics: PhonicsLyrics = {
  soundGroup: 3,
  targetSounds: ['g', 'o', 'u', 'l', 'f', 'b'],
  title: 'Jungle Jump',
  titleTr: 'Orman Zıplaması',
  bpm: 124,
  lines: [
    {
      text: 'Jump into the jungle — let\'s learn sounds today!',
      textTr: 'Ormana zıpla — bugün ses öğrenelim!',
      startMs: 0,
      endMs: 4000,
      highlightWords: ['Jump', 'jungle'],
    },
    {
      text: 'G-g-g says the gorilla, gulp gulp gulp away',
      textTr: 'G-g-g diyor goril, yudumla yudumla',
      startMs: 4000,
      endMs: 8000,
      highlightWords: ['gorilla', 'gulp', 'G-g-g'],
    },
    {
      text: 'O-o-o says the octopus, oh what a surprise!',
      textTr: 'O-o-o diyor ahtapot, oh ne sürpriz!',
      startMs: 8000,
      endMs: 12000,
      highlightWords: ['octopus', 'O-o-o'],
    },
    {
      text: 'U-u-u says the umbrella, under cloudy skies',
      textTr: 'U-u-u diyor şemsiye, bulutlu göklerin altında',
      startMs: 12000,
      endMs: 16000,
      highlightWords: ['umbrella', 'under', 'U-u-u'],
    },
    {
      text: 'L-l-l lick the lollipop, lovely, long and tall',
      textTr: 'L-l-l lolipopı yala, güzel, uzun ve ince',
      startMs: 16000,
      endMs: 20000,
      highlightWords: ['lollipop', 'lovely', 'long', 'L-l-l'],
    },
    {
      text: 'F-f-f the flat tire hisses — hear the air fall',
      textTr: 'F-f-f düz lastik ıslık çalıyor — havanın düştüğünü duy',
      startMs: 20000,
      endMs: 24000,
      highlightWords: ['flat', 'fall', 'F-f-f'],
    },
    {
      text: 'B-b-b bounce the ball, big and bouncy too',
      textTr: 'B-b-b topu zıplat, büyük ve yaylanır da',
      startMs: 24000,
      endMs: 28000,
      highlightWords: ['bounce', 'ball', 'big', 'bouncy', 'B-b-b'],
    },
    {
      text: 'G is for gas and gap and gum and gig',
      textTr: 'G gaz, boşluk, sakız ve küçük için',
      startMs: 28000,
      endMs: 32000,
      highlightWords: ['gas', 'gap', 'gum', 'gig'],
    },
    {
      text: 'O is for on and off and odd and big',
      textTr: 'O açık, kapalı, garip ve büyük için',
      startMs: 32000,
      endMs: 36000,
      highlightWords: ['on', 'off', 'odd'],
    },
    {
      text: 'U is for up and us and cup and fun',
      textTr: 'U yukarı, biz, bardak ve eğlence için',
      startMs: 36000,
      endMs: 40000,
      highlightWords: ['up', 'us', 'cup', 'fun'],
    },
    {
      text: 'A big dog got on a bus in the fog',
      textTr: 'Büyük bir köpek siste otobüse bindi',
      startMs: 40000,
      endMs: 44000,
      highlightWords: ['big', 'dog', 'got', 'bus', 'fog'],
    },
    {
      text: 'A bug on a log said flop and flap!',
      textTr: 'Kütükteki böcek flop ve flap dedi!',
      startMs: 44000,
      endMs: 48000,
      highlightWords: ['bug', 'log', 'flop', 'flap'],
    },
    {
      text: 'G, O, U, L, F, B — the jungle song!',
      textTr: 'G, O, U, L, F, B — orman şarkısı!',
      startMs: 48000,
      endMs: 52000,
      highlightWords: [],
    },
    {
      text: 'Sing it loud and sing it proud — you\'ve known it all along!',
      textTr: 'Yüksek sesle ve gururla söyle — hep biliyordun zaten!',
      startMs: 52000,
      endMs: 56000,
      highlightWords: [],
    },
  ],
};

// ─── Group 4: ai, j, oa, ie, ee, or ─────────────────────────────────────────

const group4Lyrics: PhonicsLyrics = {
  soundGroup: 4,
  targetSounds: ['ai', 'j', 'oa', 'ie', 'ee', 'or'],
  title: 'Long Vowel Adventure',
  titleTr: 'Uzun Sesli Macera',
  bpm: 112,
  lines: [
    {
      text: 'We know short sounds, now let\'s learn long ones too!',
      textTr: 'Kısa sesleri biliyoruz, şimdi uzunları da öğrenelim!',
      startMs: 0,
      endMs: 4000,
      highlightWords: [],
    },
    {
      text: 'Ai-ai-ai! It\'s raining! Rain is falling through',
      textTr: 'Ay-ay-ay! Yağmur yağıyor! Yağmur düşüyor',
      startMs: 4000,
      endMs: 8000,
      highlightWords: ['raining', 'Rain', 'Ai-ai-ai'],
    },
    {
      text: 'J-j-j the jelly jiggles on the plate',
      textTr: 'C-c-c jöle tabakta titriyor',
      startMs: 8000,
      endMs: 12000,
      highlightWords: ['jelly', 'jiggles', 'J-j-j'],
    },
    {
      text: 'Oa-oa-oa the goat floats — isn\'t that great!',
      textTr: 'Oa-oa-oa keçi yüzüyor — bu harika değil mi!',
      startMs: 12000,
      endMs: 16000,
      highlightWords: ['goat', 'floats', 'Oa-oa-oa'],
    },
    {
      text: 'Ie-ie-ie the kite flies high up in the sky',
      textTr: 'Ay-ay-ay uçurtma gökte yüksekten uçuyor',
      startMs: 16000,
      endMs: 20000,
      highlightWords: ['kite', 'flies', 'high', 'sky', 'Ie-ie-ie'],
    },
    {
      text: 'Ee-ee-ee the bee sits on the tree nearby',
      textTr: 'Ii-ii-ii arı yakındaki ağaçta oturuyor',
      startMs: 20000,
      endMs: 24000,
      highlightWords: ['bee', 'tree', 'Ee-ee-ee'],
    },
    {
      text: 'Or-or-or! Row the boat to shore, or-or-or!',
      textTr: 'Or-or-or! Tekneyi kıyıya yönelikle, or-or-or!',
      startMs: 24000,
      endMs: 28000,
      highlightWords: ['Row', 'boat', 'shore', 'Or-or-or'],
    },
    {
      text: 'Rain on the plain! Mail in the tail!',
      textTr: 'Ovalarda yağmur! Kuyrukta posta!',
      startMs: 28000,
      endMs: 32000,
      highlightWords: ['Rain', 'plain', 'Mail', 'tail'],
    },
    {
      text: 'The goat in a coat sailed on the road!',
      textTr: 'Palto giyen keçi yolda gitti!',
      startMs: 32000,
      endMs: 36000,
      highlightWords: ['goat', 'coat', 'sailed', 'road'],
    },
    {
      text: 'The tie and pie are flying high in the sky',
      textTr: 'Kravat ve pasta gökyüzünde yüksek uçuyor',
      startMs: 36000,
      endMs: 40000,
      highlightWords: ['tie', 'pie', 'flying', 'high', 'sky'],
    },
    {
      text: 'See the bee in the tree — ee-ee-ee!',
      textTr: 'Ağaçtaki arıyı gör — ii-ii-ii!',
      startMs: 40000,
      endMs: 44000,
      highlightWords: ['See', 'bee', 'tree'],
    },
    {
      text: 'For the store, sort the corn on the floor',
      textTr: 'Mağaza için, yerdeki mısırı ayıkla',
      startMs: 44000,
      endMs: 48000,
      highlightWords: ['store', 'sort', 'corn', 'floor'],
    },
    {
      text: 'Ai, j, oa, ie, ee, or — long sounds, explore!',
      textTr: 'Ay, c, oa, ay, ii, or — uzun sesler, keşfet!',
      startMs: 48000,
      endMs: 52000,
      highlightWords: [],
    },
    {
      text: 'Practice every day and you\'ll read more and more!',
      textTr: 'Her gün pratik yap ve daha fazla okuyacaksın!',
      startMs: 52000,
      endMs: 56000,
      highlightWords: ['more'],
    },
  ],
};

// ─── Group 5: z, w, ng, v, oo(short), oo(long) ──────────────────────────────

const group5Lyrics: PhonicsLyrics = {
  soundGroup: 5,
  targetSounds: ['z', 'w', 'ng', 'v', 'oo'],
  title: 'The Buzz and the Wind',
  titleTr: 'Vızıltı ve Rüzgar',
  bpm: 118,
  lines: [
    {
      text: 'Listen to the buzz, listen to the wind!',
      textTr: 'Vızıltıyı dinle, rüzgarı dinle!',
      startMs: 0,
      endMs: 4000,
      highlightWords: ['buzz', 'wind'],
    },
    {
      text: 'Z-z-z the bee is buzzing where the flowers begin',
      textTr: 'Z-z-z arı çiçeklerin başladığı yerde vızıldıyor',
      startMs: 4000,
      endMs: 8000,
      highlightWords: ['bee', 'buzzing', 'Z-z-z'],
    },
    {
      text: 'W-w-w the wind goes whoosh around the tree',
      textTr: 'V-v-v rüzgar ağacın etrafında vıvılar',
      startMs: 8000,
      endMs: 12000,
      highlightWords: ['wind', 'whoosh', 'tree', 'W-w-w'],
    },
    {
      text: 'Ng-ng-ng the king is ringing his big bell free',
      textTr: 'Ng-ng-ng kral büyük çanını özgürce çalıyor',
      startMs: 12000,
      endMs: 16000,
      highlightWords: ['king', 'ringing', 'ring', 'Ng-ng-ng'],
    },
    {
      text: 'V-v-v the van goes vroom past the vet',
      textTr: 'V-v-v minibüs veterinerin yanından vroom diye geçiyor',
      startMs: 16000,
      endMs: 20000,
      highlightWords: ['van', 'vroom', 'vet', 'V-v-v'],
    },
    {
      text: 'Oo-oo look at the book — a good cook yet!',
      textTr: 'Oo-oo kitaba bak — iyi bir aşçı henüz!',
      startMs: 20000,
      endMs: 24000,
      highlightWords: ['look', 'book', 'good', 'cook', 'Oo-oo'],
    },
    {
      text: 'Oooo the moon is full tonight, the wolf cries too',
      textTr: 'Oooo bu gece ay dolunay, kurt da ağlıyor',
      startMs: 24000,
      endMs: 28000,
      highlightWords: ['moon', 'wolf', 'Oooo'],
    },
    {
      text: 'Z is for zip and zoo and zap and jazz',
      textTr: 'Z fermuar, hayvanat bahçesi, zap ve caz için',
      startMs: 28000,
      endMs: 32000,
      highlightWords: ['zip', 'zoo', 'zap', 'jazz'],
    },
    {
      text: 'W is for win and wet and web and was',
      textTr: 'V kazanmak, ıslak, örümcek ağı ve idi için',
      startMs: 32000,
      endMs: 36000,
      highlightWords: ['win', 'wet', 'web', 'was'],
    },
    {
      text: 'Ring and sing and king and song and long!',
      textTr: 'Çan ve şarkı söyle ve kral ve şarkı ve uzun!',
      startMs: 36000,
      endMs: 40000,
      highlightWords: ['Ring', 'sing', 'king', 'song', 'long'],
    },
    {
      text: 'The van went past the vine at the village',
      textTr: 'Minibüs köydeki üzüm bağının yanından geçti',
      startMs: 40000,
      endMs: 44000,
      highlightWords: ['van', 'vine', 'village'],
    },
    {
      text: 'Look in the book — what a good cook!',
      textTr: 'Kitaba bak — ne iyi bir aşçı!',
      startMs: 44000,
      endMs: 48000,
      highlightWords: ['Look', 'book', 'good', 'cook'],
    },
    {
      text: 'The moon in the pool — cool, cool, cool!',
      textTr: 'Havuzdaki ay — harika, harika, harika!',
      startMs: 48000,
      endMs: 52000,
      highlightWords: ['moon', 'pool', 'cool'],
    },
    {
      text: 'Z, W, Ng, V, Oo — now you know the buzz!',
      textTr: 'Z, V, Ng, V, Oo — şimdi vızıltıyı biliyorsun!',
      startMs: 52000,
      endMs: 56000,
      highlightWords: [],
    },
  ],
};

// ─── Group 6: y, x, ch, sh, th ──────────────────────────────────────────────

const group6Lyrics: PhonicsLyrics = {
  soundGroup: 6,
  targetSounds: ['y', 'x', 'ch', 'sh', 'th'],
  title: 'The Shh and Ch Train',
  titleTr: 'Shh ve Ch Treni',
  bpm: 114,
  lines: [
    {
      text: 'All aboard the sound train — choo choo choo!',
      textTr: 'Ses trenine binin — çuf çuf çuf!',
      startMs: 0,
      endMs: 4000,
      highlightWords: ['choo'],
    },
    {
      text: 'Y-y-y yells the yak eating yellow yam stew',
      textTr: 'Y-y-y yak sarı yer elması yahnisi yerken bağırıyor',
      startMs: 4000,
      endMs: 8000,
      highlightWords: ['yak', 'yellow', 'yam', 'Y-y-y'],
    },
    {
      text: 'X-x-x marks the fox in the box six',
      textTr: 'X-x-x kutudaki tilkiyi altılı ile işaretler',
      startMs: 8000,
      endMs: 12000,
      highlightWords: ['fox', 'box', 'six', 'X-x-x'],
    },
    {
      text: 'Ch-ch-ch the train goes — chop and cheer!',
      textTr: 'Ç-ç-ç tren gidiyor — vur ve neşelen!',
      startMs: 12000,
      endMs: 16000,
      highlightWords: ['chop', 'cheer', 'Ch-ch-ch'],
    },
    {
      text: 'Sh-sh-sh the baby\'s sleeping — shhh right here',
      textTr: 'Şşş bebek uyuyor — burada şşş',
      startMs: 16000,
      endMs: 20000,
      highlightWords: ['Sh-sh-sh', 'sleeping'],
    },
    {
      text: 'Th-th-th poke your tongue and think of this',
      textTr: 'Th-th-th dilini çıkar ve bunu düşün',
      startMs: 20000,
      endMs: 24000,
      highlightWords: ['think', 'this', 'Th-th-th'],
    },
    {
      text: 'That and the and them and those — hear the buzz!',
      textTr: 'Şu ve the ve onlar ve bunlar — vızıltıyı duy!',
      startMs: 24000,
      endMs: 28000,
      highlightWords: ['That', 'the', 'them', 'those'],
    },
    {
      text: 'Y is for yes and yet and yam and yell',
      textTr: 'Y evet, henüz, yer elması ve bağırmak için',
      startMs: 28000,
      endMs: 32000,
      highlightWords: ['yes', 'yet', 'yam', 'yell'],
    },
    {
      text: 'X is for fox and box and wax and mix',
      textTr: 'X tilki, kutu, balmumu ve karıştırmak için',
      startMs: 32000,
      endMs: 36000,
      highlightWords: ['fox', 'box', 'wax', 'mix'],
    },
    {
      text: 'Chip and chop and chin and chat — what a choice!',
      textTr: 'Chip ve kıy ve çene ve sohbet — ne seçim!',
      startMs: 36000,
      endMs: 40000,
      highlightWords: ['Chip', 'chop', 'chin', 'chat'],
    },
    {
      text: 'Ship and shop and shed and fish — hear that noise!',
      textTr: 'Gemi ve dükkan ve sundurma ve balık — o sesi duy!',
      startMs: 40000,
      endMs: 44000,
      highlightWords: ['Ship', 'shop', 'shed', 'fish'],
    },
    {
      text: 'Think of three thin things — th th th!',
      textTr: 'Üç ince şey düşün — th th th!',
      startMs: 44000,
      endMs: 48000,
      highlightWords: ['Think', 'three', 'thin', 'things'],
    },
    {
      text: 'This is the path to math — th th th!',
      textTr: 'Bu matematik yolu — th th th!',
      startMs: 48000,
      endMs: 52000,
      highlightWords: ['This', 'the', 'path', 'math'],
    },
    {
      text: 'Y, X, Ch, Sh, Th — you\'re a reading star!',
      textTr: 'Y, X, Ç, Ş, Th — bir okuma yıldızısın!',
      startMs: 52000,
      endMs: 56000,
      highlightWords: [],
    },
  ],
};

// ─── Group 7: qu, ou, oi, ue, er, ar ─────────────────────────────────────────

const group7Lyrics: PhonicsLyrics = {
  soundGroup: 7,
  targetSounds: ['qu', 'ou', 'oi', 'ue', 'er', 'ar'],
  title: 'The Pirate\'s Treasure Song',
  titleTr: 'Korsanın Hazine Şarkısı',
  bpm: 110,
  lines: [
    {
      text: 'Ahoy! The pirate found a treasure far away!',
      textTr: 'Ahoy! Korsan uzakta bir hazine buldu!',
      startMs: 0,
      endMs: 4000,
      highlightWords: ['pirate', 'treasure', 'far'],
    },
    {
      text: 'Qu-qu-qu the queen quacks like a duck all day',
      textTr: 'Kv-kv-kv kraliçe bütün gün ördek gibi vaklıyor',
      startMs: 4000,
      endMs: 8000,
      highlightWords: ['queen', 'quacks', 'Qu-qu-qu'],
    },
    {
      text: 'Ou-ou-ou! The mouse ran out of the house!',
      textTr: 'Av-av-av! Fare evden koştu!',
      startMs: 8000,
      endMs: 12000,
      highlightWords: ['mouse', 'out', 'house', 'Ou-ou-ou'],
    },
    {
      text: 'Oi-oi-oi! The pirate found a coin — rejoice!',
      textTr: 'Oy-oy-oy! Korsan bir bozuk para buldu — sevin!',
      startMs: 12000,
      endMs: 16000,
      highlightWords: ['pirate', 'coin', 'rejoice', 'Oi-oi-oi'],
    },
    {
      text: 'Ue-ue-ue the blue clue led them to a view',
      textTr: 'Yu-yu-yu mavi ipucu onları bir manzaraya götürdü',
      startMs: 16000,
      endMs: 20000,
      highlightWords: ['blue', 'clue', 'view', 'Ue-ue-ue'],
    },
    {
      text: 'Er-er-er the mixer stirs the butter — what a blur!',
      textTr: 'Er-er-er mikser tereyağını karıştırıyor — ne bulanık!',
      startMs: 20000,
      endMs: 24000,
      highlightWords: ['mixer', 'stirs', 'butter', 'blur', 'Er-er-er'],
    },
    {
      text: 'Ar-ar-ar says the pirate star, so near and far!',
      textTr: 'Ar-ar-ar diyor korsan yıldızı, hem yakın hem uzak!',
      startMs: 24000,
      endMs: 28000,
      highlightWords: ['pirate', 'star', 'far', 'Ar-ar-ar'],
    },
    {
      text: 'Qu is for queen and quick and quiz and quack',
      textTr: 'Kv kraliçe ve hızlı ve quiz ve vaklamak için',
      startMs: 28000,
      endMs: 32000,
      highlightWords: ['queen', 'quick', 'quiz', 'quack'],
    },
    {
      text: 'Ou is for out and our and loud and back',
      textTr: 'Av dışarı ve bizim ve yüksek ve geri için',
      startMs: 32000,
      endMs: 36000,
      highlightWords: ['out', 'our', 'loud'],
    },
    {
      text: 'Oil and coin and join and boil — oi oi oi!',
      textTr: 'Yağ ve bozuk para ve katılmak ve kaynatmak — oy oy oy!',
      startMs: 36000,
      endMs: 40000,
      highlightWords: ['Oil', 'coin', 'join', 'boil'],
    },
    {
      text: 'Blue and clue and true and glue — ue ue ue!',
      textTr: 'Mavi ve ipucu ve gerçek ve yapıştırıcı — yu yu yu!',
      startMs: 40000,
      endMs: 44000,
      highlightWords: ['Blue', 'clue', 'true', 'glue'],
    },
    {
      text: 'Her and fern and term and verb — er er er!',
      textTr: 'O ve eğreltiotu ve dönem ve fiil — er er er!',
      startMs: 44000,
      endMs: 48000,
      highlightWords: ['Her', 'fern', 'term', 'verb'],
    },
    {
      text: 'Car and star and far and jar — ar ar ar!',
      textTr: 'Araba ve yıldız ve uzak ve kavanoz — ar ar ar!',
      startMs: 48000,
      endMs: 52000,
      highlightWords: ['Car', 'star', 'far', 'jar'],
    },
    {
      text: 'We know all seven groups — we\'re reading superstars!',
      textTr: 'Yedi grubu biliyoruz — okuma süperyıldızlarıyız!',
      startMs: 52000,
      endMs: 56000,
      highlightWords: [],
    },
    {
      text: 'Qu, Ou, Oi, Ue, Er, Ar — hooray for the stars!',
      textTr: 'Kv, Av, Oy, Yu, Er, Ar — yaşasın yıldızlar!',
      startMs: 56000,
      endMs: 60000,
      highlightWords: [],
    },
  ],
};

// ─── Exports ─────────────────────────────────────────────────────────────────

export const PHONICS_SONG_LYRICS: PhonicsLyrics[] = [
  group1Lyrics,
  group2Lyrics,
  group3Lyrics,
  group4Lyrics,
  group5Lyrics,
  group6Lyrics,
  group7Lyrics,
];

export function getLyricsByGroup(groupNumber: number): PhonicsLyrics | undefined {
  return PHONICS_SONG_LYRICS.find((l) => l.soundGroup === groupNumber);
}
