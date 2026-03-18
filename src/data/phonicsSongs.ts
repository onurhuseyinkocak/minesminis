// ============================================================
// MinesMinis Phonics Songs Data
// Karaoke-style songs for each of the 7 phonics groups
// Designed for Turkish-speaking children learning English
// ============================================================

// --- TYPES ---

export interface SongLine {
  text: string;
  textTr: string;
  startMs: number;
  durationMs: number;
  highlightSounds: string[];
  actions?: string;
  /** Array of frequencies (Hz) forming a melody for this line */
  melody?: number[];
}

export interface PhonicsSong {
  id: string;
  groupNumber: number;
  title: string;
  titleTr: string;
  emoji: string;
  lyrics: SongLine[];
  tempo: 'slow' | 'medium' | 'fast';
  style: 'nursery' | 'chant' | 'rap' | 'lullaby';
}

// --- GROUP 1 SONG: "The Sound Safari" ---

const group1Song: PhonicsSong = {
  id: 'song-g1-sound-safari',
  groupNumber: 1,
  title: 'The Sound Safari',
  titleTr: 'Ses Safarisi',
  emoji: '\u{1F418}',
  tempo: 'medium',
  style: 'nursery',
  lyrics: [
    {
      text: 'Welcome to the Sound Safari, come along with me!',
      textTr: 'Ses Safarisine hosgeldin, benimle gel!',
      startMs: 0,
      durationMs: 4000,
      highlightSounds: [],
      actions: 'Wave hello and march in place!',
      melody: [261.63, 293.66, 329.63, 349.23, 392.00],  // ascending C4-G4
    },
    {
      text: 'S-s-s says the snake, sliding in the sun',
      textTr: 'S-s-s diyor yilan, guneste kayiyor',
      startMs: 4000,
      durationMs: 4000,
      highlightSounds: ['s'],
      actions: 'Weave your hand like a snake!',
      melody: [392.00, 349.23, 329.63, 293.66, 261.63],  // descending G4-C4 (slithering)
    },
    {
      text: 'A-a-a says the apple, having so much fun',
      textTr: 'A-a-a diyor elma, cok egleniyor',
      startMs: 8000,
      durationMs: 4000,
      highlightSounds: ['a'],
      actions: 'Wiggle fingers on your arm like ants!',
      melody: [261.63, 329.63, 392.00, 329.63, 261.63],  // bouncy C4-E4-G4-E4-C4
    },
    {
      text: 'T-t-t says the tiger, tapping with its tail',
      textTr: 'T-t-t diyor kaplan, kuyrugu ile vuruyor',
      startMs: 12000,
      durationMs: 4000,
      highlightSounds: ['t'],
      actions: 'Turn your head side to side like watching tennis!',
      melody: [261.63, 329.63, 392.00, 392.00, 329.63, 261.63],  // call-response
    },
    {
      text: 'I-i-i says the igloo, hiding from the hail',
      textTr: 'I-i-i diyor igloo, dolundan saklaniyorum',
      startMs: 16000,
      durationMs: 4000,
      highlightSounds: ['i'],
      actions: 'Pretend to be a little mouse!',
      melody: [329.63, 293.66, 261.63, 293.66, 329.63],  // gentle lullaby phrase
    },
    {
      text: 'P-p-p says the penguin, playing in the pool',
      textTr: 'P-p-p diyor penguen, havuzda oynuyor',
      startMs: 20000,
      durationMs: 4000,
      highlightSounds: ['p'],
      actions: 'Blow out birthday candles: p, p, p!',
      melody: [261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00],  // marching
    },
    {
      text: 'N-n-n says the newt, learning things at school',
      textTr: 'N-n-n diyor semender, okulda ogreniyor',
      startMs: 24000,
      durationMs: 4000,
      highlightSounds: ['n'],
      actions: 'Hold your arms out like an airplane!',
      melody: [261.63, 293.66, 329.63, 349.23, 392.00],  // ascending again
    },
    {
      text: 'S, A, T, I, P, N — those are the sounds we know!',
      textTr: 'S, A, T, I, P, N — bunlar bildigimiz sesler!',
      startMs: 28000,
      durationMs: 4000,
      highlightSounds: ['s', 'a', 't', 'i', 'p', 'n'],
      actions: 'Clap for each letter!',
      melody: [261.63, 329.63, 392.00, 523.25],  // fanfare C4-E4-G4-C5
    },
    {
      text: 'S, A, T, I, P, N — sing them high and low!',
      textTr: 'S, A, T, I, P, N — yuksek ve alcak soyle!',
      startMs: 32000,
      durationMs: 4000,
      highlightSounds: ['s', 'a', 't', 'i', 'p', 'n'],
      actions: 'Reach up high, then crouch down low!',
      melody: [523.25, 440.00, 392.00, 329.63, 261.63],  // descending C5-C4
    },
    {
      text: 'We sat and sipped and tapped today, hooray for Group One sounds!',
      textTr: 'Bugün oturduk, yudumladik ve tiklatik, yasasin Grup Bir sesleri!',
      startMs: 36000,
      durationMs: 5000,
      highlightSounds: ['s', 'a', 't', 'i', 'p', 'n'],
      actions: 'Jump up and cheer!',
      melody: [261.63, 329.63, 392.00, 392.00, 523.25],  // triumphant finish
    },
  ],
};

// --- GROUP 2 SONG: "Kitchen Sounds" ---

const group2Song: PhonicsSong = {
  id: 'song-g2-kitchen-sounds',
  groupNumber: 2,
  title: 'Kitchen Sounds',
  titleTr: 'Mutfak Sesleri',
  emoji: '\u{1F373}',
  tempo: 'medium',
  style: 'chant',
  lyrics: [
    {
      text: 'Come into the kitchen, what sounds can you hear?',
      textTr: 'Mutfaga gel, hangi sesleri duyabilirsin?',
      startMs: 0,
      durationMs: 4000,
      highlightSounds: [],
      actions: 'Pretend to open a door!',
      melody: [261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00],  // twinkle
    },
    {
      text: 'C-c-c the cat is cooking, stirring something near',
      textTr: 'K-k-k kedi yemek pisiyor, yakindan karistiriyor',
      startMs: 4000,
      durationMs: 4000,
      highlightSounds: ['c'],
      actions: 'Click imaginary castanets!',
      melody: [261.63, 329.63, 392.00, 329.63, 261.63],  // bouncy
    },
    {
      text: 'E-e-e the egg is ready, cracking in the pan',
      textTr: 'E-e-e yumurta hazir, tavada catlak',
      startMs: 8000,
      durationMs: 4000,
      highlightSounds: ['e'],
      actions: 'Crack an egg in the air!',
      melody: [329.63, 293.66, 261.63, 293.66, 329.63],  // gentle lullaby
    },
    {
      text: 'H-h-h the hungry dog is panting, what a happy plan!',
      textTr: 'H-h-h ac kopek soluyuyor, ne guzel plan!',
      startMs: 12000,
      durationMs: 4000,
      highlightSounds: ['h'],
      actions: 'Pant like a happy dog!',
      melody: [261.63, 293.66, 329.63, 349.23, 392.00],  // ascending
    },
    {
      text: 'R-r-r the lion roars for dinner, he wants more to eat',
      textTr: 'R-r-r aslan akam yemegi icin kukreyor, daha fazla yemek istiyor',
      startMs: 16000,
      durationMs: 4000,
      highlightSounds: ['r'],
      actions: 'Pretend to roar like a lion!',
      melody: [392.00, 349.23, 329.63, 293.66, 261.63],  // descending (powerful)
    },
    {
      text: 'M-m-m the muffin smells so yummy, what a tasty treat!',
      textTr: 'M-m-m muffin cok guzel kokuyor, ne lezzetli!',
      startMs: 20000,
      durationMs: 4000,
      highlightSounds: ['m'],
      actions: 'Rub your tummy!',
      melody: [261.63, 329.63, 392.00, 392.00, 329.63, 261.63],  // call-response
    },
    {
      text: 'D-d-d the drum is beating loudly, dinner time is here!',
      textTr: 'D-d-d davul yuksek sesle caliyor, yemek zamani geldi!',
      startMs: 24000,
      durationMs: 4000,
      highlightSounds: ['d'],
      actions: 'Beat an imaginary drum!',
      melody: [261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00],  // marching
    },
    {
      text: 'C, E, H, R, M, D — kitchen sounds are great!',
      textTr: 'C, E, H, R, M, D — mutfak sesleri harika!',
      startMs: 28000,
      durationMs: 4000,
      highlightSounds: ['c', 'e', 'h', 'r', 'm', 'd'],
      actions: 'Clap along with each letter!',
      melody: [261.63, 329.63, 392.00, 523.25],  // fanfare
    },
    {
      text: 'C, E, H, R, M, D — put them on your plate!',
      textTr: 'C, E, H, R, M, D — onlari tabagina koy!',
      startMs: 32000,
      durationMs: 4000,
      highlightSounds: ['c', 'e', 'h', 'r', 'm', 'd'],
      actions: 'Pretend to serve food on a plate!',
      melody: [523.25, 440.00, 392.00, 329.63, 261.63],  // descending from C5
    },
    {
      text: 'The cat cooked eggs with Mum and Dad, the kitchen song is done!',
      textTr: 'Kedi anne ve babayla yumurta pisirdi, mutfak sarkisi bitti!',
      startMs: 36000,
      durationMs: 5000,
      highlightSounds: ['c', 'e', 'h', 'r', 'm', 'd'],
      actions: 'Take a bow!',
      melody: [261.63, 329.63, 392.00, 392.00, 523.25],  // triumphant
    },
  ],
};

// --- GROUP 3 SONG: "Playground Bounce" ---

const group3Song: PhonicsSong = {
  id: 'song-g3-playground-bounce',
  groupNumber: 3,
  title: 'Playground Bounce',
  titleTr: 'Oyun Alani Ziplatmasi',
  emoji: '\u{1F3C0}',
  tempo: 'fast',
  style: 'rap',
  lyrics: [
    {
      text: 'Bounce, bounce, at the playground, let us go go go!',
      textTr: 'Zipla, zipla, oyun alaninda, hadi gidelim!',
      startMs: 0,
      durationMs: 3500,
      highlightSounds: [],
      actions: 'Bounce up and down!',
      melody: [261.63, 392.00, 261.63, 392.00, 523.25],  // bouncy high energy
    },
    {
      text: 'G-g-g gulp the water, drinking nice and slow',
      textTr: 'G-g-g suyu yudumla, yavas yavas ic',
      startMs: 3500,
      durationMs: 3500,
      highlightSounds: ['g'],
      actions: 'Pretend to gulp water!',
      melody: [392.00, 349.23, 329.63, 293.66, 261.63],  // descending (gulping down)
    },
    {
      text: 'O-o-o the octopus is jumping, oh oh oh!',
      textTr: 'O-o-o ahtapot zipliyor, oh oh oh!',
      startMs: 7000,
      durationMs: 3500,
      highlightSounds: ['o'],
      actions: 'Make a surprised O face!',
      melody: [261.63, 329.63, 392.00, 329.63, 261.63],  // bouncy
    },
    {
      text: 'U-u-u umbrella up, the rain begins to flow',
      textTr: 'U-u-u semsiye ac, yagmur basliyor',
      startMs: 10500,
      durationMs: 3500,
      highlightSounds: ['u'],
      actions: 'Open an imaginary umbrella!',
      melody: [261.63, 293.66, 329.63, 349.23, 392.00],  // ascending (umbrella going up)
    },
    {
      text: 'L-l-l lollipop lick, so sweet upon my tongue',
      textTr: 'L-l-l lolipop yala, dilimde cok tatli',
      startMs: 14000,
      durationMs: 3500,
      highlightSounds: ['l'],
      actions: 'Lick an imaginary lollipop!',
      melody: [329.63, 293.66, 261.63, 293.66, 329.63],  // lullaby gentle
    },
    {
      text: 'F-f-f the tire is flat, the air has almost gone',
      textTr: 'F-f-f lastik patlak, hava neredeyse bitti',
      startMs: 17500,
      durationMs: 3500,
      highlightSounds: ['f'],
      actions: 'Let air out slowly: fffff!',
      melody: [523.25, 440.00, 392.00, 329.63, 261.63],  // descending (air going out)
    },
    {
      text: 'B-b-b bounce the ball, we are having fun!',
      textTr: 'B-b-b topu zipplat, eglenceye devam!',
      startMs: 21000,
      durationMs: 3500,
      highlightSounds: ['b'],
      actions: 'Bounce an imaginary ball!',
      melody: [261.63, 392.00, 261.63, 392.00, 261.63],  // bouncing pattern
    },
    {
      text: 'G, O, U, L, F, B — playground sounds rock!',
      textTr: 'G, O, U, L, F, B — oyun alani sesleri harika!',
      startMs: 24500,
      durationMs: 3500,
      highlightSounds: ['g', 'o', 'u', 'l', 'f', 'b'],
      actions: 'Air guitar and jump!',
      melody: [261.63, 329.63, 392.00, 523.25],  // fanfare
    },
    {
      text: 'G, O, U, L, F, B — tick-tock, tick-tock!',
      textTr: 'G, O, U, L, F, B — tik-tak, tik-tak!',
      startMs: 28000,
      durationMs: 3500,
      highlightSounds: ['g', 'o', 'u', 'l', 'f', 'b'],
      actions: 'Sway side to side!',
      melody: [261.63, 329.63, 392.00, 392.00, 329.63, 261.63],  // call-response
    },
    {
      text: 'A big dog and a bug on a log, having fun in the fog!',
      textTr: 'Buyuk bir kopek ve bir bocek kutuk uzerinde, siste egleniyor!',
      startMs: 31500,
      durationMs: 5000,
      highlightSounds: ['g', 'o', 'u', 'l', 'f', 'b'],
      actions: 'Freeze like a statue, then cheer!',
      melody: [261.63, 329.63, 392.00, 392.00, 523.25],  // triumphant finish
    },
  ],
};

// --- GROUP 4 SONG: "The Vowel Voyage" ---

const group4Song: PhonicsSong = {
  id: 'song-g4-vowel-voyage',
  groupNumber: 4,
  title: 'The Vowel Voyage',
  titleTr: 'Sesli Harf Yolculugu',
  emoji: '\u{26F5}',
  tempo: 'slow',
  style: 'nursery',
  lyrics: [
    {
      text: 'Set sail on the vowel voyage, long sounds here we come!',
      textTr: 'Sesli harf yolculuguna yelken ac, uzun sesler geliyoruz!',
      startMs: 0,
      durationMs: 4500,
      highlightSounds: [],
      actions: 'Pretend to steer a ship!',
      melody: [261.63, 293.66, 329.63, 349.23, 392.00],
    },
    {
      text: 'AI-AI-AI the rain is falling, splashing everyone',
      textTr: 'AY-AY-AY yagmur yagiyor, herkesi islatiyor',
      startMs: 4500,
      durationMs: 4500,
      highlightSounds: ['ai'],
      actions: 'Cup your hand and feel the rain!',
      melody: [392.00, 349.23, 329.63, 293.66, 261.63],
    },
    {
      text: 'J-j-j the jelly wobbles, wibbly wobbly fun',
      textTr: 'C-c-c jole titriyor, titresen eglence',
      startMs: 9000,
      durationMs: 4500,
      highlightSounds: ['j'],
      actions: 'Wobble like a jelly!',
      melody: [261.63, 329.63, 392.00, 329.63, 261.63],
    },
    {
      text: 'OA-OA-OA the goat is on a boat, sailing in the sun',
      textTr: 'OA-OA-OA keci teknede, guneste yelken aciyor',
      startMs: 13500,
      durationMs: 4500,
      highlightSounds: ['oa'],
      actions: 'Pretend to row a boat!',
      melody: [261.63, 293.66, 329.63, 349.23, 392.00],
    },
    {
      text: 'IE-IE-IE the kite is flying high, way up in the sky',
      textTr: 'AY-AY-AY ucurtma yuksekte ucuyor, gokyuzunde',
      startMs: 18000,
      durationMs: 4500,
      highlightSounds: ['ie'],
      actions: 'Hold a kite string and look up!',
      melody: [261.63, 329.63, 392.00, 523.25, 659.25],
    },
    {
      text: 'EE-EE-EE the buzzy little bee, flying way up high',
      textTr: 'EE-EE-EE vizildayan kucuk ari, yuksekte ucuyor',
      startMs: 22500,
      durationMs: 4500,
      highlightSounds: ['ee'],
      actions: 'Flap your arms like a bee!',
      melody: [329.63, 293.66, 261.63, 293.66, 329.63],
    },
    {
      text: 'OR-OR-OR we row the boat to shore, resting by the corn',
      textTr: 'OR-OR-OR tekneyi kiyiya cekelim, misirlarin yaninda dinlenelim',
      startMs: 27000,
      durationMs: 4500,
      highlightSounds: ['or'],
      actions: 'Row your imaginary oars!',
      melody: [261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00],
    },
    {
      text: 'AI, J, OA, IE, EE, OR — long vowels are the best!',
      textTr: 'AI, J, OA, IE, EE, OR — uzun sesliler en iyisi!',
      startMs: 31500,
      durationMs: 4500,
      highlightSounds: ['ai', 'j', 'oa', 'ie', 'ee', 'or'],
      actions: 'Give a thumbs up for each sound!',
      melody: [261.63, 329.63, 392.00, 523.25],
    },
    {
      text: 'Rain and boats and bees, oh my — we sailed and passed the test!',
      textTr: 'Yagmur, tekneler ve arilar, ohhh — yelken actik ve sinavi gectik!',
      startMs: 36000,
      durationMs: 5000,
      highlightSounds: ['ai', 'oa', 'ee', 'or'],
      actions: 'Take a bow from the ship!',
      melody: [261.63, 329.63, 392.00, 392.00, 523.25],
    },
  ],
};

// --- GROUP 5 SONG: "Zoo Groove" ---

const group5Song: PhonicsSong = {
  id: 'song-g5-zoo-groove',
  groupNumber: 5,
  title: 'Zoo Groove',
  titleTr: 'Hayvanat Bahcesi Ritmi',
  emoji: '\u{1F981}',
  tempo: 'medium',
  style: 'chant',
  lyrics: [
    {
      text: 'Let us groove at the zoo, with some tricky sounds to say!',
      textTr: 'Hayvanat bahcesinde dans edelim, bazi zor seslerle!',
      startMs: 0,
      durationMs: 4000,
      highlightSounds: [],
      actions: 'Dance in place!',
      melody: [261.63, 293.66, 329.63, 349.23, 392.00],
    },
    {
      text: 'Z-z-z the bee goes buzzing, zig-zag all the way',
      textTr: 'Z-z-z ari vizildayarak gidiyor, zikzak yaparak',
      startMs: 4000,
      durationMs: 4000,
      highlightSounds: ['z'],
      actions: 'Flap your arms and zig-zag!',
      melody: [261.63, 329.63, 392.00, 329.63, 261.63],
    },
    {
      text: 'W-w-w the wind is blowing, whoooosh across the bay',
      textTr: 'W-w-w ruzgar esiyor, vuuuuus koyun icinden',
      startMs: 8000,
      durationMs: 4000,
      highlightSounds: ['w'],
      actions: 'Blow and wave your arms like wind!',
      melody: [523.25, 440.00, 392.00, 329.63, 261.63],
    },
    {
      text: 'NG-NG-NG the king is singing, ding dong ring the bell!',
      textTr: 'NG-NG-NG kral sarki soyluyor, ding dong zili cal!',
      startMs: 12000,
      durationMs: 4000,
      highlightSounds: ['ng'],
      actions: 'Pretend to ring a big bell!',
      melody: [392.00, 349.23, 329.63, 293.66, 261.63],
    },
    {
      text: 'V-v-v the van goes vroom vroom, racing really well',
      textTr: 'V-v-v minibus viiin diyor, gercekten iyi yarisiyor',
      startMs: 16000,
      durationMs: 4000,
      highlightSounds: ['v'],
      actions: 'Hold a steering wheel and drive!',
      melody: [261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00],
    },
    {
      text: 'OO-OO short says the book, look look look around',
      textTr: 'OO-OO kisa diyor kitap, bak bak bak etrafina',
      startMs: 20000,
      durationMs: 4000,
      highlightSounds: ['oo'],
      actions: 'Open an imaginary book!',
      melody: [329.63, 293.66, 261.63, 293.66, 329.63],
    },
    {
      text: 'OO-OO long says the moon, howling wolf makes the sound',
      textTr: 'OO-OO uzun diyor ay, uluyan kurt sesi cikariyor',
      startMs: 24000,
      durationMs: 4000,
      highlightSounds: ['oo'],
      actions: 'Howl at the moon: ooooo!',
      melody: [261.63, 293.66, 329.63, 349.23, 392.00],
    },
    {
      text: 'Z, W, NG, V, OO, OO — tricky sounds, we groove!',
      textTr: 'Z, W, NG, V, OO, OO — zor sesler, dans ediyoruz!',
      startMs: 28000,
      durationMs: 4000,
      highlightSounds: ['z', 'w', 'ng', 'v', 'oo'],
      actions: 'Groove and snap fingers!',
      melody: [261.63, 329.63, 392.00, 523.25],
    },
    {
      text: 'A king at the zoo sang a cool moon song, we love the zoo groove!',
      textTr: 'Hayvanat bahcesindeki kral havalai bir ay sarkisi soyledi, dans etmeyi seviyoruz!',
      startMs: 32000,
      durationMs: 5000,
      highlightSounds: ['z', 'w', 'ng', 'v', 'oo'],
      actions: 'Final big dance move!',
      melody: [261.63, 329.63, 392.00, 392.00, 523.25],
    },
  ],
};

// --- GROUP 6 SONG: "The Special Sound Express" ---

const group6Song: PhonicsSong = {
  id: 'song-g6-special-express',
  groupNumber: 6,
  title: 'The Special Sound Express',
  titleTr: 'Ozel Ses Ekspresi',
  emoji: '\u{1F682}',
  tempo: 'medium',
  style: 'nursery',
  lyrics: [
    {
      text: 'All aboard the sound express, special sounds today!',
      textTr: 'Hepiniz ses ekspresine binin, bugun ozel sesler!',
      startMs: 0,
      durationMs: 4000,
      highlightSounds: [],
      actions: 'Pretend to board a train!',
      melody: [261.63, 293.66, 329.63, 349.23, 392.00],
    },
    {
      text: 'Y-y-y says yummy yogurt, hooray hooray hooray!',
      textTr: 'Y-y-y diyor lezzetli yogurt, yasasin yasasin yasasin!',
      startMs: 4000,
      durationMs: 4000,
      highlightSounds: ['y'],
      actions: 'Rub your tummy: yummy!',
      melody: [261.63, 329.63, 392.00, 329.63, 261.63],
    },
    {
      text: 'X-x-x the fox is in a box, ks ks ks he says!',
      textTr: 'X-x-x tilki kutunun icinde, ks ks ks diyor!',
      startMs: 8000,
      durationMs: 4000,
      highlightSounds: ['x'],
      actions: 'Cross your arms like an X!',
      melody: [392.00, 349.23, 329.63, 293.66, 261.63],
    },
    {
      text: 'CH-CH-CH the train goes choo-choo, chugging on its way',
      textTr: '\u00C7-\u00C7-\u00C7 tren \u00E7uf-\u00E7uf gidiyor, yolunda ilerliyor',
      startMs: 12000,
      durationMs: 4000,
      highlightSounds: ['ch'],
      actions: 'Move your arms like train wheels!',
      melody: [261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00],
    },
    {
      text: 'SH-SH-SH the baby sleeps, shh be quiet please!',
      textTr: '\u015E-\u015E-\u015E bebek uyuyor, \u015Fus sessiz ol l\u00FCtfen!',
      startMs: 16000,
      durationMs: 4000,
      highlightSounds: ['sh'],
      actions: 'Finger on lips: shhhh!',
      melody: [329.63, 293.66, 261.63, 293.66, 329.63],
    },
    {
      text: 'TH-TH-TH this and that, stick your tongue out with ease',
      textTr: 'TH-TH-TH bu ve su, dilini rahatca cikar',
      startMs: 20000,
      durationMs: 4000,
      highlightSounds: ['th'],
      actions: 'Stick tongue out between teeth!',
      melody: [261.63, 293.66, 329.63, 349.23, 392.00],
    },
    {
      text: 'TH-TH-TH think of three, thin things upon the breeze',
      textTr: 'TH-TH-TH uc tane dusun, ruzgardaki ince seyler',
      startMs: 24000,
      durationMs: 4000,
      highlightSounds: ['th'],
      actions: 'Tap your head and think!',
      melody: [523.25, 440.00, 392.00, 329.63, 261.63],
    },
    {
      text: 'Y, X, CH, SH, TH, TH — special sounds express!',
      textTr: 'Y, X, \u00C7, \u015E, TH, TH — ozel ses ekspresi!',
      startMs: 28000,
      durationMs: 4000,
      highlightSounds: ['y', 'x', 'ch', 'sh', 'th'],
      actions: 'Choo-choo arms and chant!',
      melody: [261.63, 329.63, 392.00, 523.25],
    },
    {
      text: 'The fox said shh and the train went choo, we are the very best!',
      textTr: 'Tilki \u015Fus dedi ve tren \u00E7uf \u00E7uf gitti, biz en iyisiyiz!',
      startMs: 32000,
      durationMs: 5000,
      highlightSounds: ['y', 'x', 'ch', 'sh', 'th'],
      actions: 'Big cheer and take a bow!',
      melody: [261.63, 329.63, 392.00, 392.00, 523.25],
    },
  ],
};

// --- GROUP 7 SONG: "The Treasure Quest Chant" ---

const group7Song: PhonicsSong = {
  id: 'song-g7-treasure-quest',
  groupNumber: 7,
  title: 'The Treasure Quest Chant',
  titleTr: 'Hazine Gorevi Tezahuratu',
  emoji: '\u{1F3C6}',
  tempo: 'medium',
  style: 'chant',
  lyrics: [
    {
      text: 'Quest! Quest! On a treasure quest, the final sounds to find!',
      textTr: 'Gorev! Gorev! Hazine gorevindeyiz, son sesleri bulalim!',
      startMs: 0,
      durationMs: 4000,
      highlightSounds: [],
      actions: 'March in place like an explorer!',
      melody: [261.63, 293.66, 329.63, 349.23, 392.00],
    },
    {
      text: 'QU-QU-QU the queen says quick, the duck says quack behind',
      textTr: 'KU-KU-KU kralice cabuk diyor, ordek arkadan vakliyor',
      startMs: 4000,
      durationMs: 4000,
      highlightSounds: ['qu'],
      actions: 'Quack like a duck!',
      melody: [261.63, 329.63, 392.00, 329.63, 261.63],
    },
    {
      text: 'OU-OU-OU ouch that hurts! A cloud rolls through the sky',
      textTr: 'AV-AV-AV ayyy acidi! Bir bulut gokyuzunde yuvarlanir',
      startMs: 8000,
      durationMs: 4000,
      highlightSounds: ['ou'],
      actions: 'Say ouch and rub your finger!',
      melody: [392.00, 349.23, 329.63, 293.66, 261.63],
    },
    {
      text: 'OI-OI-OI the pirate shouts, a golden coin nearby!',
      textTr: 'OY-OY-OY korsan bagirir, yakinlarda altin bir para!',
      startMs: 12000,
      durationMs: 4000,
      highlightSounds: ['oi'],
      actions: 'Point like a pirate: oi!',
      melody: [261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00],
    },
    {
      text: 'UE-UE-UE the sky is blue, a beautiful blue view',
      textTr: 'YU-YU-YU gokyuzu mavi, guzel bir mavi manzara',
      startMs: 16000,
      durationMs: 4000,
      highlightSounds: ['ue'],
      actions: 'Point out the window at the view!',
      melody: [261.63, 293.66, 329.63, 349.23, 392.00],
    },
    {
      text: 'ER-ER-ER the mixer stirs, her butter turning too',
      textTr: 'ER-ER-ER mikser karistiriyor, onun tereyagi da donuyor',
      startMs: 20000,
      durationMs: 4000,
      highlightSounds: ['er'],
      actions: 'Stir with an imaginary mixer!',
      melody: [329.63, 293.66, 261.63, 293.66, 329.63],
    },
    {
      text: 'AR-AR-AR a pirate star, shining from afar',
      textTr: 'AR-AR-AR bir korsan yildizi, uzaktan parliyot',
      startMs: 24000,
      durationMs: 4000,
      highlightSounds: ['ar'],
      actions: 'Open mouth wide: ahhh-r!',
      melody: [523.25, 440.00, 392.00, 329.63, 261.63],
    },
    {
      text: 'QU, OU, OI, UE, ER, AR — the final sounds are here!',
      textTr: 'QU, OU, OI, UE, ER, AR — son sesler burada!',
      startMs: 28000,
      durationMs: 4000,
      highlightSounds: ['qu', 'ou', 'oi', 'ue', 'er', 'ar'],
      actions: 'Stomp and clap for each sound!',
      melody: [261.63, 329.63, 392.00, 523.25],
    },
    {
      text: 'We found the treasure, every sound! Now give a mighty cheer!',
      textTr: 'Hazineyi bulduk, her sesi! Simdi guclu bir tezahurat yapin!',
      startMs: 32000,
      durationMs: 4000,
      highlightSounds: ['qu', 'ou', 'oi', 'ue', 'er', 'ar'],
      actions: 'Jump and shout: HOORAY!',
      melody: [261.63, 329.63, 392.00, 392.00, 523.25],
    },
    {
      text: 'All 42 sounds we know, from s to ar and more — phonics champions forevermore!',
      textTr: '42 sesin hepsini biliyoruz, s-ten ar-a ve otesine — sonsuza dek fonetik sampiyonlari!',
      startMs: 36000,
      durationMs: 6000,
      highlightSounds: [],
      actions: 'Victory dance!',
      melody: [261.63, 329.63, 392.00, 523.25, 659.25],
    },
  ],
};

// --- EXPORTS ---

export const PHONICS_SONGS: PhonicsSong[] = [
  group1Song,
  group2Song,
  group3Song,
  group4Song,
  group5Song,
  group6Song,
  group7Song,
];

/**
 * Get the song for a specific phonics group number.
 */
export function getSongByGroup(groupNumber: number): PhonicsSong | undefined {
  return PHONICS_SONGS.find((s) => s.groupNumber === groupNumber);
}

/**
 * Get a song by its ID.
 */
export function getSongById(id: string): PhonicsSong | undefined {
  return PHONICS_SONGS.find((s) => s.id === id);
}
