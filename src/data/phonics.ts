// ============================================================
// MinesMinis Phonics Data
// 42 English letter sounds in 7 groups (Jolly Phonics order)
// Adapted for Turkish-speaking children
// ============================================================

// --- TYPES ---

export interface PhonicsSound {
  id: string;
  sound: string;
  grapheme: string;
  ipa: string;
  group: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  action: string;
  actionTr: string;
  story: string;
  storyTr: string;
  keywords: string[];
  mnemonicEmoji: string;
  turkishNote: string;
  order: number;
}

export interface PhonicsGroup {
  group: number;
  name: string;
  nameTr: string;
  sounds: PhonicsSound[];
  blendableWords: string[];
  decodableText: string;
  tprCommands: string[];
}

// --- GROUP 1: s, a, t, i, p, n ---

const group1Sounds: PhonicsSound[] = [
  {
    id: 'g1_s',
    sound: 's',
    grapheme: 's',
    ipa: '/s/',
    group: 1,
    action: 'Weave your hand like a snake and say sssss',
    actionTr: 'Elini yılan gibi kıvır ve sssss de',
    story: 'The snake slithers through the sunny grass, making a ssssss sound.',
    storyTr: 'Yılan güneşli çimlerin arasında sürünüyor ve ssssss sesi çıkartıyor.',
    keywords: ['sun', 'sit', 'sat', 'sip', 'sad', 'six', 'set', 'see'],
    mnemonicEmoji: '\u{1F40D}',
    turkishNote: "Türkçe'de de bu ses var — 'su' kelimesindeki 's' gibi. Çok tanıdık!",
    order: 1,
  },
  {
    id: 'g1_a',
    sound: 'a',
    grapheme: 'a',
    ipa: '/\u00E6/',
    group: 1,
    action: 'Wiggle your fingers on your arm like ants and say a-a-a',
    actionTr: 'Parmaklarını kolunda karıncalar gibi gezdirip a-a-a de',
    story: 'Oh no! Ants are crawling up your arm! A, a, a!',
    storyTr: 'Eyvah! Karıncalar koluna tırmanıyorlar! A, a, a!',
    keywords: ['ant', 'at', 'an', 'and', 'add', 'app', 'am', 'as'],
    mnemonicEmoji: '\u{1F41C}',
    turkishNote: "Bu kısa 'a', Türkçe 'a'sından farklı. 'a' ile 'e' arasında bir sestir. Ağzını daha geniş aç.",
    order: 2,
  },
  {
    id: 'g1_t',
    sound: 't',
    grapheme: 't',
    ipa: '/t/',
    group: 1,
    action: 'Turn your head side to side like watching tennis and say t, t, t',
    actionTr: 'Başını tenis izler gibi sağa sola çevir ve t, t, t de',
    story: 'Watch the tennis ball go back and forth: t, t, t!',
    storyTr: 'Tenis topunu ileri geri izle: t, t, t!',
    keywords: ['tap', 'tin', 'ten', 'top', 'tip', 'tan', 'tub', 'tag'],
    mnemonicEmoji: '\u{1F3BE}',
    turkishNote: "Türkçe 't'ye benzer ama küçük bir hava üflemesiyle. Hissetmek için elini ağzının önünde tut.",
    order: 3,
  },
  {
    id: 'g1_i',
    sound: 'i',
    grapheme: 'i',
    ipa: '/\u026A/',
    group: 1,
    action: 'Pretend to be a mouse, wiggle your whiskers and say i-i-i',
    actionTr: 'Fare gibi davran, bıyıklarını kıpırdat ve i-i-i de',
    story: 'A tiny mouse squeaks i-i-i as it nibbles cheese.',
    storyTr: 'Minik bir fare peynir kemirirken i-i-i diye cıyaklıyor.',
    keywords: ['in', 'it', 'is', 'if', 'ill', 'ink', 'inn', 'itch'],
    mnemonicEmoji: '\u{1F42D}',
    turkishNote: "Bu kısa 'i', Türkçe 'i'siyle benzerdir ama daha gevşek ve kısa söylenir. Kaslarını fazla germe — sadece kısa bir 'i' de. 'bit', 'sit', 'it' kelimelerini dinle.",
    order: 4,
  },
  {
    id: 'g1_p',
    sound: 'p',
    grapheme: 'p',
    ipa: '/p/',
    group: 1,
    action: 'Pretend to blow out birthday candles: p, p, p',
    actionTr: 'Doğum günü mumlarını üfler gibi yap: p, p, p',
    story: 'Pop! Pop! Pop! goes the popcorn in the pan!',
    storyTr: 'Pat! Pat! Pat! diye patlak mısır tavada patlıyor!',
    keywords: ['pan', 'pin', 'pat', 'pit', 'pip', 'pad', 'peg', 'pen'],
    mnemonicEmoji: '\u{1F382}',
    turkishNote: "Türkçe 'p'ye benzer ama daha güçlü hava üflemesiyle. Elinde havayı hisset!",
    order: 5,
  },
  {
    id: 'g1_n',
    sound: 'n',
    grapheme: 'n',
    ipa: '/n/',
    group: 1,
    action: 'Hold your arms out like an airplane and say nnnnnn',
    actionTr: 'Kollarını uçak gibi aç ve nnnnnn de',
    story: 'The airplane flies through the sky: nnnnnn!',
    storyTr: 'Uçak gökyüzünde uçuyor: nnnnnn!',
    keywords: ['nap', 'nut', 'net', 'nip', 'not', 'nub', 'nab', 'nag'],
    mnemonicEmoji: '\u{2708}\u{FE0F}',
    turkishNote: "Türkçe 'n' ile aynı. Bu sesi zaten biliyorsun!",
    order: 6,
  },
];

// --- GROUP 2: c/k, e, h, r, m, d ---

const group2Sounds: PhonicsSound[] = [
  {
    id: 'g2_ck',
    sound: 'k',
    grapheme: 'c/k',
    ipa: '/k/',
    group: 2,
    action: 'Click imaginary castanets and say c, c, c',
    actionTr: 'Hayali kastanyetler çal ve k, k, k de',
    story: 'The cat plays with a clicking castanet: c, c, c!',
    storyTr: 'Kedi tıklayan bir kastanyetle oynuyor: k, k, k!',
    keywords: ['cat', 'cap', 'can', 'kit', 'kid', 'kip', 'cup', 'cut'],
    mnemonicEmoji: '\u{1F408}',
    turkishNote: "Türkçe 'k' ile aynı. İngilizce'de hem 'c' hem 'k' bu sesi çıkarabilir.",
    order: 1,
  },
  {
    id: 'g2_e',
    sound: 'e',
    grapheme: 'e',
    ipa: '/\u025B/',
    group: 2,
    action: 'Crack open an egg and say eh, eh, eh',
    actionTr: 'Bir yumurta kır ve eh, eh, eh de',
    story: 'Crack! The egg breaks open: eh, eh, eh!',
    storyTr: 'Çıirt! Yumurta kırılıyor: eh, eh, eh!',
    keywords: ['egg', 'end', 'elf', 'get', 'set', 'net', 'pet', 'pen'],
    mnemonicEmoji: '\u{1F95A}',
    turkishNote: "Türkçe 'e'ye benzer ama biraz daha açık. 'e' derken hafifçe esnermiş gibi düşün.",
    order: 2,
  },
  {
    id: 'g2_h',
    sound: 'h',
    grapheme: 'h',
    ipa: '/h/',
    group: 2,
    action: 'Pant like a tired dog after running: h, h, h',
    actionTr: 'Koşmaktan yorulmuş bir köpek gibi soluya: h, h, h',
    story: 'The happy dog is panting after a big run: h, h, h!',
    storyTr: 'Mutlu köpek uzun bir koşunun ardından soluyuyor: h, h, h!',
    keywords: ['hat', 'hid', 'him', 'his', 'hen', 'hip', 'hug', 'hut'],
    mnemonicEmoji: '\u{1F436}',
    turkishNote: "Türkçe 'h'ye benzer ama daha yumuşak ve nefesli. Sadece ağzın açıkken nefes ver.",
    order: 3,
  },
  {
    id: 'g2_r',
    sound: 'r',
    grapheme: 'r',
    ipa: '/\u0279/',
    group: 2,
    action: "Pretend you're a puppy growling gently — rrrr! Keep your tongue floating, don't let it touch!",
    actionTr: "Yavru bir köpek gibi hafifçe hırlıyormuş gibi yap — rrrr! Dilini havada tut, hiçbir yere değdirme!",
    story: 'The little lion cub learns to roar: rrrrrr!',
    storyTr: 'Küçük aslan yavrusu kükrümeyi öğreniyor: rrrrrr!',
    keywords: ['rat', 'ran', 'rip', 'rag', 'red', 'rug', 'run', 'rut'],
    mnemonicEmoji: '\u{1F981}',
    turkishNote: "Türkçe yuvarlanma 'r'sından çok farklı! Dil ucunu hafifçe kıvır ama damağına DOKUNDURMA. Dudakların hafifçe yuvarlansın.",
    order: 4,
  },
  {
    id: 'g2_m',
    sound: 'm',
    grapheme: 'm',
    ipa: '/m/',
    group: 2,
    action: 'Rub your tummy like eating yummy food: mmmmm',
    actionTr: 'Karnını lezzetli yemek yerken ovuşturur gibi yap: mmmmm',
    story: 'Mmmm, this muffin is so delicious! Mmmmm!',
    storyTr: 'Mmmm, bu muffin çok lezzetli! Mmmmm!',
    keywords: ['man', 'map', 'mat', 'met', 'mix', 'mug', 'mud', 'mum'],
    mnemonicEmoji: '\u{1F9C1}',
    turkishNote: "Türkçe 'm' ile aynı. Dudaklarını birleştir ve uğulda. Kolay!",
    order: 5,
  },
  {
    id: 'g2_d',
    sound: 'd',
    grapheme: 'd',
    ipa: '/d/',
    group: 2,
    action: 'Beat a drum with your hands: d, d, d',
    actionTr: 'Ellerinle davul çal: d, d, d',
    story: 'Bang the drum loudly: d, d, d!',
    storyTr: 'Davulu güçlüce çal: d, d, d!',
    keywords: ['dad', 'did', 'dig', 'dip', 'den', 'dim', 'dug', 'dam'],
    mnemonicEmoji: '\u{1FA98}',
    turkishNote: "Türkçe 'd' ile aynı. Dilin üst dişlerinin arkasına dokunur.",
    order: 6,
  },
];

// --- GROUP 3: g, o, u, l, f, b ---

const group3Sounds: PhonicsSound[] = [
  {
    id: 'g3_g',
    sound: 'g',
    grapheme: 'g',
    ipa: '/\u0261/',
    group: 3,
    action: 'Gulp water from a glass: g, g, g',
    actionTr: 'Bir bardaktan su iç gibi yap: g, g, g',
    story: 'Glug, glug! Drink a big glass of water: g, g, g!',
    storyTr: 'Glu glu! Büyük bir bardak su iç: g, g, g!',
    keywords: ['gap', 'gas', 'get', 'got', 'gum', 'gig'],
    mnemonicEmoji: '\u{1F95B}',
    turkishNote: "Türkçe 'g' (sert g) ile aynı. Bu alıştırmalarda her zaman sert bir sestir.",
    order: 1,
  },
  {
    id: 'g3_o',
    sound: 'o',
    grapheme: 'o',
    ipa: '/ɑ/',
    group: 3,
    action: 'Make an O with your mouth as if surprised: o, o, o',
    actionTr: 'Şaşırmış gibi ağzınla O yap: o, o, o',
    story: 'Oh! Look at the octopus! O, o, o!',
    storyTr: 'Ah! Ahtapota bak! O, o, o!',
    keywords: ['on', 'off', 'odd', 'hot', 'pot', 'dog', 'log', 'top'],
    mnemonicEmoji: '\u{1F419}',
    turkishNote: "İngilizce kısa 'o', Türkçe 'o'dan daha yuvarlak ve derin. Çeneni daha çok düşür.",
    order: 2,
  },
  {
    id: 'g3_u',
    sound: 'u',
    grapheme: 'u',
    ipa: '/\u028C/',
    group: 3,
    action: 'Open and close an umbrella: u, u, u',
    actionTr: 'Bir şemsiye aç ve kapat: u, u, u',
    story: "It's raining! Quick, open the umbrella: uh, uh, uh!",
    storyTr: 'Yağmur yağıyor! Çabuk, şemsiyeyi aç: u, u, u!',
    keywords: ['up', 'us', 'cup', 'cut', 'but', 'bus', 'bug', 'fun'],
    mnemonicEmoji: '\u{2602}\u{FE0F}',
    turkishNote: "Bu ses Türkçe'de yok! En yakın ses kısa bir 'a'dır. Ağzını 'a' der gibi aç ama dil ortada kalsın, geriye gitmesın. 'cup', 'bug', 'fun' kelimelerini dinle — bu 'u' Türkçe 'u'dan çok farklı!",
    order: 3,
  },
  {
    id: 'g3_l',
    sound: 'l',
    grapheme: 'l',
    ipa: '/l/',
    group: 3,
    action: 'Lick a lollipop and say llllll',
    actionTr: 'Bir lolipop yalar gibi yap ve llllll de',
    story: 'Lovely! Lick the lemon lollipop: llllll!',
    storyTr: 'Harika! Limonlu lolipopı yala: llllll!',
    keywords: ['lap', 'lit', 'let', 'lip', 'lid', 'leg', 'lot', 'log'],
    mnemonicEmoji: '\u{1F36D}',
    turkishNote: "Türkçe 'l'ye benzer ama İngilizce'de iki 'l' sesi vardır. Başta gelen açık 'l', Türkçe 'l' gibidir. Kelime sonundaki koyu 'l' daha derindir.",
    order: 4,
  },
  {
    id: 'g3_f',
    sound: 'f',
    grapheme: 'f',
    ipa: '/f/',
    group: 3,
    action: 'Let air out of a tire slowly: fffff',
    actionTr: 'Bir lastikten hava boşaltıyor gibi yap: fffff',
    story: 'Oh no, the tire is flat! Hear the air escape: fffff!',
    storyTr: 'Eyvah, lastik patlamış! Havanın kaçışını dinle: fffff!',
    keywords: ['fan', 'fat', 'fin', 'fit', 'fig', 'fun', 'fog', 'fuss'],
    mnemonicEmoji: '\u{1F4A8}',
    turkishNote: "Türkçe 'f' ile aynı. Alt dudağını hafifçe ısır ve üfle.",
    order: 5,
  },
  {
    id: 'g3_b',
    sound: 'b',
    grapheme: 'b',
    ipa: '/b/',
    group: 3,
    action: 'Bounce a big ball with a bat: b, b, b',
    actionTr: 'Bir sopayla topa vuruyormuş gibi yap: b, b, b',
    story: 'Bounce the ball: b, b, b!',
    storyTr: 'Topu zıpplat: b, b, b!',
    keywords: ['bat', 'bit', 'big', 'bin', 'bed', 'bud', 'bun', 'bus'],
    mnemonicEmoji: '\u{26BE}',
    turkishNote: "Türkçe 'b' ile aynı. Dudaklarını patlatır gibi birleştir!",
    order: 6,
  },
];

// --- GROUP 4: ai, j, oa, ie, ee, or ---

const group4Sounds: PhonicsSound[] = [
  {
    id: 'g4_ai',
    sound: 'ai',
    grapheme: 'ai',
    ipa: '/e\u026A/',
    group: 4,
    action: 'Cup your hand to your ear in the rain and say ai-ai-ai',
    actionTr: 'Yağmurda elini kulağına koy ve ay-ay-ay de',
    story: "Oh no, it's raining! Put your hand out: ai, ai, ai!",
    storyTr: 'Eyvah, yağmur yağıyor! Elini uzat: ay, ay, ay!',
    keywords: ['rain', 'pail', 'tail', 'mail', 'sail', 'paid', 'main', 'fail'],
    mnemonicEmoji: '\u{1F327}\u{FE0F}',
    turkishNote: "Bu uzun bir ünlü sestir, Türkçe 'ey' demek gibi. İki bölümü var: e + i.",
    order: 1,
  },
  {
    id: 'g4_j',
    sound: 'j',
    grapheme: 'j',
    ipa: '/d\u0292/',
    group: 4,
    action: 'Pretend to wobble like a jelly: j, j, j',
    actionTr: "Bir jöle gibi titreyerek sallan: 'cam'daki gibi c, c, c",
    story: 'The jelly wobbles on the plate: j, j, j!',
    storyTr: "Jöle tabakta titriyor — 'cam'daki 'c' gibi söyle: c, c, c!",
    keywords: ['jam', 'jet', 'jig', 'jog', 'jug', 'job', 'jot', 'jab'],
    mnemonicEmoji: '\u{1F36E}',
    turkishNote: "Türkçe 'c' gibi ('cam' kelimesindeki gibi). Yumuşak, vızıltılı bir sestir. Türkçe 'j' değil!",
    order: 2,
  },
  {
    id: 'g4_oa',
    sound: 'oa',
    grapheme: 'oa',
    ipa: '/o\u028A/',
    group: 4,
    action: 'Pretend you stubbed your toe: oh! oh! oh!',
    actionTr: 'Ayak parmağını çarptın gibi yap: oh! oh! oh!',
    story: 'The goat goes on a boat: oa, oa, oa!',
    storyTr: 'Keçi tekneye biniyor: oa, oa, oa!',
    keywords: ['goat', 'boat', 'coat', 'road', 'load', 'soap', 'oak', 'foam'],
    mnemonicEmoji: '\u{1F410}',
    turkishNote: "Bu, 'ou'yu yavaşça söylemek gibidir. 'o'dan başlar ve 'u'ya kayar. Türkçe 'o'dan farklıdır.",
    order: 3,
  },
  {
    id: 'g4_ie',
    sound: 'ie',
    grapheme: 'ie',
    ipa: '/a\u026A/',
    group: 4,
    action: 'Stand like a soldier and salute: ie! ie!',
    actionTr: 'Asker gibi dimdik dur ve selam ver: ay! ay!',
    story: 'The kite flies high in the sky: ie, ie, ie!',
    storyTr: 'Uçurtma gökte yüksekten uçuyor: ay, ay, ay!',
    keywords: ['tie', 'pie', 'lie', 'kite', 'tried', 'cried', 'dried', 'fried'],
    mnemonicEmoji: '\u{1FA81}',
    turkishNote: "Bu, Türkçe 'ay' gibi sesler. 'a'dan başla ve 'y'ye kay.",
    order: 4,
  },
  {
    id: 'g4_ee',
    sound: 'ee',
    grapheme: 'ee',
    ipa: '/i\u02D0/',
    group: 4,
    action: 'Put your hands on your knees and say eee like a donkey',
    actionTr: 'Ellerini dizlerine koy ve eşek gibi eee de',
    story: 'The donkey says eee-ooor, eee-ooor!',
    storyTr: 'Eşek eee-ooor, eee-ooor diyor!',
    keywords: ['see', 'bee', 'tree', 'free', 'feet', 'seed', 'need', 'feed'],
    mnemonicEmoji: '\u{1F41D}',
    turkishNote: "Bu uzun bir 'i' sesidir, Türkçe 'i' gibi ama daha uzun tutulur. Uzat: iiii!",
    order: 5,
  },
  {
    id: 'g4_or',
    sound: 'or',
    grapheme: 'or',
    ipa: '/\u0254\u02D0/',
    group: 4,
    action: 'Row a boat and say or, or, or',
    actionTr: 'Bir tekne kürek çek ve or, or, or de',
    story: 'Row, row the boat to the shore: or, or, or!',
    storyTr: 'Kürek çek, kürek çek kıyıya: or, or, or!',
    keywords: ['for', 'or', 'corn', 'fork', 'torn', 'born', 'sort', 'port'],
    mnemonicEmoji: '\u{1F6A3}',
    turkishNote: "Bu uzun 'or' Türkçe'de yok. Dudaklarını yuvarla ve 'o' de, ardından yumuşak bir İngilizce 'r' ekle.",
    order: 6,
  },
];

// --- GROUP 5: z, w, ng, v, oo(short), oo(long) ---

const group5Sounds: PhonicsSound[] = [
  {
    id: 'g5_z',
    sound: 'z',
    grapheme: 'z',
    ipa: '/z/',
    group: 5,
    action: 'Flap your arms like a buzzing bee: zzzzz',
    actionTr: 'Kollarını vızıldayan arı gibi çırp: zzzzz',
    story: 'The busy bee buzzes around the flowers: zzzzz!',
    storyTr: 'Meşgul arı çiçeklerin etrafında vızıldanıyor: zzzzz!',
    keywords: ['zip', 'zoo', 'zap', 'zig', 'zag', 'buzz', 'fizz', 'jazz'],
    mnemonicEmoji: '\u{26A1}',
    turkishNote: "Türkçe 'z' ile aynı. 'ssss' derken boğazını titret. Vızıltıyı hisset!",
    order: 1,
  },
  {
    id: 'g5_w',
    sound: 'w',
    grapheme: 'w',
    ipa: '/w/',
    group: 5,
    action: 'Blow out a candle slowly and say wuh, wuh, wuh',
    actionTr: "Yavaşça mum üfle ve 'wuh, wuh, wuh' de — dudakların önce yuvarlansın!",
    story: 'Whoosh! The wind blows: wuh, wuh, wuh!',
    storyTr: "Wuuush! Rüzgar esiyor: wuh, wuh, wuh! (Türkçe 'v' değil, W sesi!)",
    keywords: ['win', 'wet', 'wig', 'wag', 'web', 'will', 'wax', 'wish'],
    mnemonicEmoji: '\u{1F32C}\u{FE0F}',
    turkishNote: "Türkçe'de bu ses yok! Dudaklarını küçük bir daire yap ('u' der gibi) sonra aç. Türkçe 'v' değil!",
    order: 2,
  },
  {
    id: 'g5_ng',
    sound: 'ng',
    grapheme: 'ng',
    ipa: '/\u014B/',
    group: 5,
    action: 'Lift weights and say ng, ng, ng like a strongman',
    actionTr: 'Ağırlık kaldırır gibi yap ve ng, ng, ng de',
    story: 'The strong man lifts: nnng, nnng! Ring the bell: ng!',
    storyTr: 'Güçlü adam kaldırıyor: nnng, nnng! Zili çal: ng!',
    keywords: ['ring', 'sing', 'king', 'song', 'long', 'bang', 'hung', 'thing'],
    mnemonicEmoji: '\u{1F4AA}',
    turkishNote: "Bu nazal ses Türkçe'de var! 'denk' kelimesindeki 'n' gibi. Dilinizin arkası ağzınızın arkasına dokunur.",
    order: 3,
  },
  {
    id: 'g5_v',
    sound: 'v',
    grapheme: 'v',
    ipa: '/v/',
    group: 5,
    action: 'Drive a van and hold the vibrating steering wheel: vvvvv',
    actionTr: 'Bir minibüs sür ve titreşen direksiyonu tut: vvvvv',
    story: 'Vroom vroom! The van drives fast: vvvvv!',
    storyTr: 'Viiin viiin! Minibüs hızla gidiyor: vvvvv!',
    keywords: ['van', 'vet', 'vim', 'vat', 'vast', 'vest', 'vine', 'vote'],
    mnemonicEmoji: '\u{1F690}',
    turkishNote: "Türkçe 'v' ile aynı. Alt dudağını hafifçe ısır ve sesinle vızıltı çıkar.",
    order: 4,
  },
  {
    id: 'g5_oo_short',
    sound: 'oo(short)',
    grapheme: 'oo (book)',
    ipa: '/\u028A/',
    group: 5,
    action: 'Push a heavy box and say oo, oo (short) like in "book"',
    actionTr: 'Ağır bir kutu it ve kitaptaki gibi kısa oo, oo de',
    story: 'Look! Take a good look at the book: oo, oo!',
    storyTr: 'Bak! Kitaba iyi bak: oo, oo!',
    keywords: ['book', 'look', 'cook', 'good', 'foot', 'hook', 'wood', 'took'],
    mnemonicEmoji: '\u{1F4D6}',
    turkishNote: "Bu kısa 'oo', Türkçe 'u' ile 'o' arasındadır. Dudaklarını fazla yuvarlama. Kısa tut!",
    order: 5,
  },
  {
    id: 'g5_oo_long',
    sound: 'oo(long)',
    grapheme: 'oo (moon)',
    ipa: '/u\u02D0/',
    group: 5,
    action: 'Point at the moon and say ooooo (long) like a wolf',
    actionTr: 'Aya işaret et ve kurt gibi uzun ooooo de',
    story: 'The wolf howls at the moon: ooooo!',
    storyTr: 'Kurt aya uluyor: ooooo!',
    keywords: ['moon', 'zoo', 'food', 'cool', 'pool', 'room', 'boot', 'tool'],
    mnemonicEmoji: '\u{1F31D}',
    turkishNote: "Bu uzun 'oo', Türkçe 'u'ya yakın ama daha uzun. Dudaklarını sıkıca yuvarla ve tut.",
    order: 6,
  },
];

// --- GROUP 6: y, x, ch, sh, th(voiced), th(unvoiced) ---

const group6Sounds: PhonicsSound[] = [
  {
    id: 'g6_y',
    sound: 'y',
    grapheme: 'y',
    ipa: '/j/',
    group: 6,
    action: 'Eat yummy yogurt and say y, y, y',
    actionTr: 'Lezzetli yoğurt ye ve y, y, y de',
    story: 'Yummy! Yes, I love yellow yogurt: y, y, y!',
    storyTr: 'Lezzetli! Evet, sarı yoğurdu seviyorum: y, y, y!',
    keywords: ['yes', 'yet', 'yam', 'yell', 'yawn', 'yoga', 'yolk', 'yard'],
    mnemonicEmoji: '\u{1F60B}',
    turkishNote: "Türkçe 'y' ile aynı. 'yemek' kelimesindeki 'y' gibi. Sana kolay!",
    order: 1,
  },
  {
    id: 'g6_x',
    sound: 'x',
    grapheme: 'x',
    ipa: '/ks/',
    group: 6,
    action: 'Cross your arms like an X and say ks, ks, ks',
    actionTr: 'Kollarını X gibi çaprazla ve ks, ks, ks de',
    story: 'X marks the spot on the treasure map: ks, ks!',
    storyTr: 'X hazine haritasında yeri işaretliyor: ks, ks!',
    keywords: ['fox', 'box', 'mix', 'six', 'fix', 'wax', 'max', 'Rex'],
    mnemonicEmoji: '\u{274C}',
    turkishNote: "'x' harfi 'ks' sesi çıkarır. Türkçe bu harfi kullanmaz ama 'k' ve 's' seslerini zaten biliyorsun, sadece hızlıca birleştir!",
    order: 2,
  },
  {
    id: 'g6_ch',
    sound: 'ch',
    grapheme: 'ch',
    ipa: '/t\u0283/',
    group: 6,
    action: 'Mime a choo-choo train moving: ch, ch, ch, ch',
    actionTr: 'Çuf çuf tren gibi hareket et: ç, ç, ç, ç',
    story: 'The train goes choo-choo: ch, ch, ch!',
    storyTr: 'Tren çuf çuf gidiyor: ç, ç, ç!',
    keywords: ['chip', 'chop', 'chin', 'chat', 'chest', 'check', 'child', 'much'],
    mnemonicEmoji: '\u{1F682}',
    turkishNote: "Bu tam olarak Türkçe 'ç' gibi ('çocuk' kelimesindeki gibi). Bu sesi zaten mükemmel biliyorsun!",
    order: 3,
  },
  {
    id: 'g6_sh',
    sound: 'sh',
    grapheme: 'sh',
    ipa: '/\u0283/',
    group: 6,
    action: 'Put your finger on your lips and say shhhh, be quiet!',
    actionTr: 'Parmağını dudağına koy ve shhhh, sessiz ol de!',
    story: 'Shhh! The baby is sleeping! Be quiet: shhh!',
    storyTr: 'Shhh! Bebek uyuyor! Sessiz ol: shhh!',
    keywords: ['ship', 'shop', 'shed', 'shin', 'shut', 'fish', 'wish', 'push'],
    mnemonicEmoji: '\u{1F92B}',
    turkishNote: "Bu tam olarak Türkçe 'ş' gibi ('şeker' kelimesindeki gibi). Mükemmel — bunu zaten biliyorsun!",
    order: 4,
  },
  {
    id: 'g6_th_voiced',
    sound: 'th',
    grapheme: 'th',
    ipa: '/\u00F0/',
    group: 6,
    action: 'Stick your tongue out a tiny bit and hum: thhhh (buzzy)',
    actionTr: 'Dilini biraz çıkar ve mırılda: thhhh (vızıltılı)',
    story: 'This, that, the, them \u2014 feel your throat buzz: th, th!',
    storyTr: 'This, that, the, them \u2014 boğazının titreşimini hisset: th, th!',
    keywords: ['the', 'this', 'that', 'them', 'then', 'with', 'than', 'those'],
    mnemonicEmoji: '\u{1F445}',
    turkishNote: "Türkçe'de bu ses YOK! Dilini dişlerinin arasına koy ve sesinle titret. 'the' ile alıştırma yap.",
    order: 5,
  },
  {
    id: 'g6_th_unvoiced',
    sound: 'th',
    grapheme: 'th',
    ipa: '/\u03B8/',
    group: 6,
    action: 'Stick your tongue out a tiny bit and blow air: thhh (quiet)',
    actionTr: 'Dilini biraz çıkar ve hava üfle: thhh (sessiz)',
    story: 'Think of three thin things: th, th, th! (no buzzing)',
    storyTr: 'Üç ince şey düşün: th, th, th! (vızıltısız)',
    keywords: ['thin', 'thick', 'think', 'thing', 'three', 'moth', 'path', 'math'],
    mnemonicEmoji: '\u{1F9E0}',
    turkishNote: "Türkçe'de bu ses de YOK! Sesli 'th' ile aynı dil pozisyonu ama SES YOK — sadece hava. Sessiz bir 'th' gibi.",
    order: 6,
  },
];

// --- GROUP 7: qu, ou, oi, ue, er, ar ---

const group7Sounds: PhonicsSound[] = [
  {
    id: 'g7_qu',
    sound: 'qu',
    grapheme: 'qu',
    ipa: '/kw/',
    group: 7,
    action: 'Quack like a duck: qu, qu, qu',
    actionTr: 'Ördek gibi vakla: kvu, kvu, kvu',
    story: 'The queen\u2019s duck says quack, quack: qu, qu!',
    storyTr: 'Kraliçenin ördeği vakladı: kvu, kvu!',
    keywords: ['queen', 'quick', 'quiz', 'quit', 'quack', 'quest', 'quote', 'quad'],
    mnemonicEmoji: '\u{1F986}',
    turkishNote: "'qu' her zaman 'kw' sesi çıkarır. Türkçe bu kombinasyonu kullanmaz. 'k' de sonra hızlıca 'w' ekle. 'ku' gibi ama İngilizce 'w' ile.",
    order: 1,
  },
  {
    id: 'g7_ou',
    sound: 'ou',
    grapheme: 'ou',
    ipa: '/a\u028A/',
    group: 7,
    action: 'Pretend you pricked your finger: OW! ou, ou!',
    actionTr: 'Parmağını batırmış gibi yap: AV! av, av!',
    story: 'Ouch! The mouse ran out of the house: ou, ou!',
    storyTr: 'Ayyy! Fare evden kaçtı: av, av!',
    keywords: ['out', 'our', 'loud', 'round', 'found', 'cloud', 'mouse', 'house'],
    mnemonicEmoji: '\u{1F4A5}',
    turkishNote: "Bu, Türkçe 'av' gibi sesler. Geniş bir 'a' sesiyle başla, sonra hızlıca 'u'ya kapat.",
    order: 2,
  },
  {
    id: 'g7_oi',
    sound: 'oi',
    grapheme: 'oi',
    ipa: '/\u0254\u026A/',
    group: 7,
    action: 'Point at something and say oi! oi! like a pirate',
    actionTr: 'Bir şeyi işaret et ve korsan gibi oy! oy! de',
    story: 'Ahoy! The pirate found a coin: oi, oi!',
    storyTr: 'Ahoy! Korsan bir bozuk para buldu: oy, oy!',
    keywords: ['oil', 'coin', 'join', 'boil', 'foil', 'soil', 'coil', 'toil'],
    mnemonicEmoji: '\u{1FA99}',
    turkishNote: "Bu, Türkçe 'oy' gibidir ('oy vermek' gibi). Yuvarlak bir 'o'dan başla ve 'y'ye kay.",
    order: 3,
  },
  {
    id: 'g7_ue',
    sound: 'ue',
    grapheme: 'ue',
    ipa: '/ju\u02D0/',
    group: 7,
    action: 'Point out the window at the view: ue, ue, ue',
    actionTr: 'Pencereden manzarayı göster: yu, yu, yu',
    story: 'What a beautiful view! Look at the blue: ue, ue!',
    storyTr: 'Ne güzel manzara! Maviye bak: yu, yu!',
    keywords: ['blue', 'clue', 'glue', 'true', 'due', 'Sue', 'cue', 'hue'],
    mnemonicEmoji: '\u{1F535}',
    turkishNote: "Bu 'yu' ya da sadece uzun 'u' gibi sesler. Bazen 'yoo', bazen sadece 'oo' denir. Her kelimede dikkatlice dinle.",
    order: 4,
  },
  {
    id: 'g7_er',
    sound: 'er',
    grapheme: 'er',
    ipa: '/\u025C\u02D0/',
    group: 7,
    action: 'Stir a mixer and say errrr, errrr',
    actionTr: 'Mikser karıştır ve errrr, errrr de',
    story: 'The mixer goes errrr as it stirs the butter: er, er!',
    storyTr: 'Mikser tereyağını karıştırırken errrr diyor: er, er!',
    keywords: ['her', 'fern', 'term', 'verb', 'herd', 'after', 'better', 'sister'],
    mnemonicEmoji: '\u{1F964}',
    turkishNote: "Bu ünlü Türkçe'de YOK! 'e' der gibi ama dili hafifçe geriye kıvırarak. İngilizce kelime sonlarında (-er, -ir, -ur hepsi bu şekilde sesler) çok yaygın.",
    order: 5,
  },
  {
    id: 'g7_ar',
    sound: 'ar',
    grapheme: 'ar',
    ipa: '/\u0251\u02D0/',
    group: 7,
    action: 'Open your mouth wide like at the doctor and say ahhh-r',
    actionTr: 'Doktordaymış gibi ağzını aç ve ahhh-r de',
    story: 'The pirate says: ar, ar, ar! Stars are far!',
    storyTr: 'Korsan diyor ki: ar, ar, ar! Yıldızlar uzakta!',
    keywords: ['car', 'far', 'star', 'jar', 'farm', 'park', 'dark', 'art'],
    mnemonicEmoji: '\u{2B50}',
    turkishNote: "Uzun bir Türkçe 'a'dan sonra yumuşak bir İngilizce 'r' ekle. 'a' açık ve uzun olmalı, kısa değil.",
    order: 6,
  },
];

// --- BUILD GROUPS ---

const group1: PhonicsGroup = {
  group: 1,
  name: 'First Sounds',
  nameTr: 'İlk Sesler',
  sounds: group1Sounds,
  blendableWords: ['sat', 'sit', 'sip', 'tip', 'tap', 'tin', 'pin', 'pan', 'nap', 'nip', 'pit', 'pat', 'tan', 'ant', 'snap', 'spin', 'spot', 'pant'],
  decodableText: 'Nat sat in a pit. Nat can tap a tin. A pin is in a pan. Nat can nap. Sit, Nat, sit! Pat a cat. Snap! Tip tap, tip tap.',
  tprCommands: ['Sit!', 'Tap the tin!', 'Nap!', 'Spin!', 'Pat it!', 'Snap!', 'Sip it!', 'Stand up!'],
};

const group2: PhonicsGroup = {
  group: 2,
  name: 'More Letters',
  nameTr: 'Daha Fazla Harf',
  sounds: group2Sounds,
  blendableWords: ['cat', 'hat', 'mat', 'red', 'hen', 'men', 'den', 'ran', 'mad', 'dad', 'dim', 'him', 'mid', 'kid', 'hid', 'met', 'set', 'pet', 'pen', 'map', 'cap', 'ram', 'dip', 'rip', 'hid', 'kit', 'kit', 'hum', 'drum'],
  decodableText: 'A red hen met a cat. The cat hid in a den. "Come here!" said the hen. Dad ran and ran. He had a map. Mum and Dad sat in the dim hut. The kid can hug a drum.',
  tprCommands: ['Run!', 'Clap!', 'Hum!', 'March!', 'Kick!', 'Drum!', 'Dance!', 'Creep!'],
};

const group3: PhonicsGroup = {
  group: 3,
  name: 'Growing Letters',
  nameTr: 'Büyüyen Harfler',
  sounds: group3Sounds,
  blendableWords: ['dog', 'log', 'fog', 'big', 'bug', 'rug', 'fun', 'sun', 'bus', 'but', 'bun', 'gum', 'lot', 'got', 'hot', 'not', 'cut', 'lip', 'leg', 'let', 'fit', 'fig', 'dug', 'fuss', 'flap', 'blob', 'flag', 'plug', 'slug', 'glad', 'blot'],
  decodableText: 'A big dog got on a bus. "Sit!" said the man. But the dog did not sit. It got up on the rug and had fun. A bug sat on a log in the fog. "Get off!" said a frog. The bug did a flip and fell in the mud. Splat!',
  tprCommands: ['Jump!', 'Flap!', 'Gallop!', 'Lift!', 'Bend!', 'Hug!', 'Grab!', 'Bounce!'],
};

const group4: PhonicsGroup = {
  group: 4,
  name: 'Long Vowels',
  nameTr: 'Uzun Sesli Harfler',
  sounds: group4Sounds,
  blendableWords: ['rain', 'tail', 'mail', 'pail', 'boat', 'goat', 'coat', 'road', 'tree', 'bee', 'see', 'need', 'seed', 'feet', 'tie', 'pie', 'lie', 'for', 'corn', 'fork', 'born', 'sort', 'jet', 'jam', 'jog', 'jug'],
  decodableText: 'It began to rain. The goat got on a boat and sailed up the road. "I need to see a tree!" said the goat. A bee sat on the tail of the goat. "Ouch!" The goat ran for the corn. Three pies sat on a fork. I tied a green tie and met a friend at the oak tree.',
  tprCommands: ['Sail!', 'Fly!', 'Jog!', 'Tie!', 'See!', 'Reach!', 'Row!', 'Peek!'],
};

const group5: PhonicsGroup = {
  group: 5,
  name: 'Tricky Sounds',
  nameTr: 'Zor Sesler',
  sounds: group5Sounds,
  blendableWords: ['zoo', 'zip', 'buzz', 'fizz', 'ring', 'sing', 'king', 'song', 'long', 'wing', 'win', 'van', 'vest', 'book', 'look', 'cook', 'good', 'moon', 'food', 'cool', 'pool', 'zoom'],
  decodableText: 'A king went to the zoo. He took a long look at the cool moon. A bee went buzz! "Zing!" said the king. He sang a song and did a zig-zag. A good book sat on the van. The wind blew and the king put on his vest. "I need food!" he said. He cooked in the moonlight.',
  tprCommands: ['Zig-zag!', 'Sing!', 'Buzz!', 'Look!', 'Cook!', 'Zoom!', 'Ring!', 'Wave!'],
};

const group6: PhonicsGroup = {
  group: 6,
  name: 'Special Sounds',
  nameTr: 'Özel Sesler',
  sounds: group6Sounds,
  blendableWords: ['ship', 'shop', 'shut', 'shed', 'fish', 'wish', 'push', 'chip', 'chat', 'chin', 'chop', 'thin', 'thick', 'thing', 'think', 'this', 'that', 'them', 'with', 'the', 'yes', 'yet', 'yell', 'fox', 'box', 'mix', 'six'],
  decodableText: 'Shh! Think of this: a fox in a box. The fox can chat with a fish. "I wish for a chip," said the fish. "Yes!" said the fox. They chopped and mixed six thin things. Then the fox shut the shed and yelled, "That is the best shop!"',
  tprCommands: ['Shh!', 'Chop!', 'Think!', 'Push!', 'Yell!', 'Wish!', 'Chat!', 'Mix!'],
};

const group7: PhonicsGroup = {
  group: 7,
  name: 'Final Sounds',
  nameTr: 'Son Sesler',
  sounds: group7Sounds,
  blendableWords: ['queen', 'quick', 'quiz', 'quack', 'out', 'loud', 'round', 'cloud', 'house', 'oil', 'coin', 'join', 'boil', 'blue', 'clue', 'glue', 'true', 'car', 'star', 'far', 'park', 'farm', 'her', 'fern', 'after'],
  decodableText: 'The queen took her car to the farm. "Quack!" said a duck in the dark park. She found a round coin near a blue fern. "A clue!" she said out loud. She joined the quest. Oil and soil led her far to a star. "This is true!" she said. After a long march, she found the treasure under a cloud.',
  tprCommands: ['Quack!', 'March!', 'Point!', 'Clap loud!', 'Stir!', 'Drive!', 'Search!', 'Join!'],
};

// --- EXPORTS ---

export const PHONICS_GROUPS: PhonicsGroup[] = [
  group1,
  group2,
  group3,
  group4,
  group5,
  group6,
  group7,
];

export const ALL_SOUNDS: PhonicsSound[] = PHONICS_GROUPS.flatMap((g) => g.sounds);

/**
 * Returns all sounds up to and including the given group number.
 */
export function getSoundsUpToGroup(group: number): PhonicsSound[] {
  return PHONICS_GROUPS
    .filter((g) => g.group <= group)
    .flatMap((g) => g.sounds);
}

/**
 * Returns words that can be built from a given set of mastered sound IDs.
 * Checks all groups' blendableWords against the mastered sounds.
 */
export function getBlendableWords(masteredSounds: string[]): string[] {
  const masteredGraphemes = new Set(
    ALL_SOUNDS
      .filter((s) => masteredSounds.includes(s.id))
      .flatMap((s) => {
        const graphemeLower = s.grapheme.toLowerCase();
        // For compound graphemes like "c/k", expand to all individual variants
        if (graphemeLower.includes('/')) {
          return graphemeLower.split('/').map((g) => g.trim());
        }
        // For graphemes with parenthetical qualifiers like "oo (book)", use only the base
        const base = graphemeLower.split(' ')[0];
        return [base];
      })
  );

  const allBlendable = PHONICS_GROUPS.flatMap((g) => g.blendableWords);

  return allBlendable.filter((word) => {
    const lowerWord = word.toLowerCase();
    let i = 0;
    while (i < lowerWord.length) {
      // Check for digraphs first (2-char matches)
      if (i + 1 < lowerWord.length) {
        const digraph = lowerWord.slice(i, i + 2);
        if (masteredGraphemes.has(digraph)) {
          i += 2;
          continue;
        }
      }
      // Check single character
      const char = lowerWord[i];
      if (masteredGraphemes.has(char)) {
        i += 1;
        continue;
      }
      return false;
    }
    return true;
  });
}
