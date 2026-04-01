-- ============================================================
-- MinesMinis Phonics Sounds Seed Data
-- 42 English letter sounds in 7 groups (Jolly Phonics order)
-- Adapted for Turkish-speaking children
-- Generated from src/data/phonics.ts
-- ============================================================

INSERT INTO phonics_sounds (
  id, group_number, letters, ipa, display_name, display_name_tr,
  action_text, action_text_tr, story_text, story_text_tr,
  turkish_note, keywords, blendable_words, sort_order
) VALUES

-- ===================== GROUP 1: First Sounds (İlk Sesler) =====================

(
  'g1_s', 1, 's', '/s/', 's', 's',
  'Weave your hand like a snake and say sssss',
  'Elini yılan gibi kıvır ve sssss de',
  'The snake slithers through the sunny grass, making a ssssss sound.',
  'Yılan güneşli çimlerin arasında sürünüyor ve ssssss sesi çıkartıyor.',
  'Türkçe''de de bu ses var — ''su'' kelimesindeki ''s'' gibi. Çok tanıdık!',
  ARRAY['sun', 'sit', 'sat', 'sip', 'sad', 'six', 'set', 'see'],
  ARRAY['sat', 'sit', 'sip', 'tip', 'tap', 'tin', 'pin', 'pan', 'nap', 'nip', 'pit', 'pat', 'tan', 'ant', 'snap', 'spin', 'spot', 'pant'],
  1
),
(
  'g1_a', 1, 'a', '/æ/', 'a', 'a',
  'Wiggle your fingers on your arm like ants and say a-a-a',
  'Parmaklarını kolunda karıncalar gibi gezdirip a-a-a de',
  'Oh no! Ants are crawling up your arm! A, a, a!',
  'Eyvah! Karıncalar koluna tırmanıyorlar! A, a, a!',
  'Bu kısa ''a'', Türkçe ''a''sından farklı. ''a'' ile ''e'' arasında bir sestir. Ağzını daha geniş aç.',
  ARRAY['ant', 'at', 'an', 'and', 'add', 'app', 'am', 'as'],
  ARRAY['sat', 'sit', 'sip', 'tip', 'tap', 'tin', 'pin', 'pan', 'nap', 'nip', 'pit', 'pat', 'tan', 'ant', 'snap', 'spin', 'spot', 'pant'],
  2
),
(
  'g1_t', 1, 't', '/t/', 't', 't',
  'Turn your head side to side like watching tennis and say t, t, t',
  'Başını tenis izler gibi sağa sola çevir ve t, t, t de',
  'Watch the tennis ball go back and forth: t, t, t!',
  'Tenis topunu ileri geri izle: t, t, t!',
  'Türkçe ''t''ye benzer ama küçük bir hava üflemesiyle. Hissetmek için elini ağzının önünde tut.',
  ARRAY['tap', 'tin', 'ten', 'top', 'tip', 'tan', 'tub', 'tag'],
  ARRAY['sat', 'sit', 'sip', 'tip', 'tap', 'tin', 'pin', 'pan', 'nap', 'nip', 'pit', 'pat', 'tan', 'ant', 'snap', 'spin', 'spot', 'pant'],
  3
),
(
  'g1_i', 1, 'i', '/ɪ/', 'i', 'i',
  'Pretend to be a mouse, wiggle your whiskers and say i-i-i',
  'Fare gibi davran, bıyıklarını kıpırdat ve i-i-i de',
  'A tiny mouse squeaks i-i-i as it nibbles cheese.',
  'Minik bir fare peynir kemirirken i-i-i diye cıyaklıyor.',
  'Bu kısa ''i'', Türkçe ''i''siyle benzerdir ama daha gevşek ve kısa söylenir. Kaslarını fazla germe — sadece kısa bir ''i'' de. ''bit'', ''sit'', ''it'' kelimelerini dinle.',
  ARRAY['in', 'it', 'is', 'if', 'ill', 'ink', 'inn', 'itch'],
  ARRAY['sat', 'sit', 'sip', 'tip', 'tap', 'tin', 'pin', 'pan', 'nap', 'nip', 'pit', 'pat', 'tan', 'ant', 'snap', 'spin', 'spot', 'pant'],
  4
),
(
  'g1_p', 1, 'p', '/p/', 'p', 'p',
  'Pretend to blow out birthday candles: p, p, p',
  'Doğum günü mumlarını üfler gibi yap: p, p, p',
  'Pop! Pop! Pop! goes the popcorn in the pan!',
  'Pat! Pat! Pat! diye patlak mısır tavada patlıyor!',
  'Türkçe ''p''ye benzer ama daha güçlü hava üflemesiyle. Elinde havayı hisset!',
  ARRAY['pan', 'pin', 'pat', 'pit', 'pip', 'pad', 'peg', 'pen'],
  ARRAY['sat', 'sit', 'sip', 'tip', 'tap', 'tin', 'pin', 'pan', 'nap', 'nip', 'pit', 'pat', 'tan', 'ant', 'snap', 'spin', 'spot', 'pant'],
  5
),
(
  'g1_n', 1, 'n', '/n/', 'n', 'n',
  'Hold your arms out like an airplane and say nnnnnn',
  'Kollarını uçak gibi aç ve nnnnnn de',
  'The airplane flies through the sky: nnnnnn!',
  'Uçak gökyüzünde uçuyor: nnnnnn!',
  'Türkçe ''n'' ile aynı. Bu sesi zaten biliyorsun!',
  ARRAY['nap', 'nut', 'net', 'nip', 'not', 'nub', 'nab', 'nag'],
  ARRAY['sat', 'sit', 'sip', 'tip', 'tap', 'tin', 'pin', 'pan', 'nap', 'nip', 'pit', 'pat', 'tan', 'ant', 'snap', 'spin', 'spot', 'pant'],
  6
),

-- ===================== GROUP 2: More Letters (Daha Fazla Harf) =====================

(
  'g2_ck', 2, 'c/k', '/k/', 'c/k', 'c/k',
  'Click imaginary castanets and say c, c, c',
  'Hayali kastanyetler çal ve k, k, k de',
  'The cat plays with a clicking castanet: c, c, c!',
  'Kedi tıklayan bir kastanyetle oynuyor: k, k, k!',
  'Türkçe ''k'' ile aynı. İngilizce''de hem ''c'' hem ''k'' bu sesi çıkarabilir.',
  ARRAY['cat', 'cap', 'can', 'kit', 'kid', 'kip', 'cup', 'cut'],
  ARRAY['cat', 'hat', 'mat', 'red', 'hen', 'men', 'den', 'ran', 'mad', 'dad', 'dim', 'him', 'mid', 'kid', 'hid', 'met', 'set', 'pet', 'pen', 'map', 'cap', 'ram', 'dip', 'rip', 'hid', 'kit', 'kit', 'hum', 'drum'],
  7
),
(
  'g2_e', 2, 'e', '/ɛ/', 'e', 'e',
  'Crack open an egg and say eh, eh, eh',
  'Bir yumurta kır ve eh, eh, eh de',
  'Crack! The egg breaks open: eh, eh, eh!',
  'Çıirt! Yumurta kırılıyor: eh, eh, eh!',
  'Türkçe ''e''ye benzer ama biraz daha açık. ''e'' derken hafifçe esnermiş gibi düşün.',
  ARRAY['egg', 'end', 'elf', 'get', 'set', 'net', 'pet', 'pen'],
  ARRAY['cat', 'hat', 'mat', 'red', 'hen', 'men', 'den', 'ran', 'mad', 'dad', 'dim', 'him', 'mid', 'kid', 'hid', 'met', 'set', 'pet', 'pen', 'map', 'cap', 'ram', 'dip', 'rip', 'hid', 'kit', 'kit', 'hum', 'drum'],
  8
),
(
  'g2_h', 2, 'h', '/h/', 'h', 'h',
  'Pant like a tired dog after running: h, h, h',
  'Koşmaktan yorulmuş bir köpek gibi soluya: h, h, h',
  'The happy dog is panting after a big run: h, h, h!',
  'Mutlu köpek uzun bir koşunun ardından soluyuyor: h, h, h!',
  'Türkçe ''h''ye benzer ama daha yumuşak ve nefesli. Sadece ağzın açıkken nefes ver.',
  ARRAY['hat', 'hid', 'him', 'his', 'hen', 'hip', 'hug', 'hut'],
  ARRAY['cat', 'hat', 'mat', 'red', 'hen', 'men', 'den', 'ran', 'mad', 'dad', 'dim', 'him', 'mid', 'kid', 'hid', 'met', 'set', 'pet', 'pen', 'map', 'cap', 'ram', 'dip', 'rip', 'hid', 'kit', 'kit', 'hum', 'drum'],
  9
),
(
  'g2_r', 2, 'r', '/ɹ/', 'r', 'r',
  'Pretend you''re a puppy growling gently — rrrr! Keep your tongue floating, don''t let it touch!',
  'Yavru bir köpek gibi hafifçe hırlıyormuş gibi yap — rrrr! Dilini havada tut, hiçbir yere değdirme!',
  'The little lion cub learns to roar: rrrrrr!',
  'Küçük aslan yavrusu kükrümeyi öğreniyor: rrrrrr!',
  'Türkçe yuvarlanma ''r''sından çok farklı! Dil ucunu hafifçe kıvır ama damağına DOKUNDURMA. Dudakların hafifçe yuvarlansın.',
  ARRAY['rat', 'ran', 'rip', 'rag', 'red', 'rug', 'run', 'rut'],
  ARRAY['cat', 'hat', 'mat', 'red', 'hen', 'men', 'den', 'ran', 'mad', 'dad', 'dim', 'him', 'mid', 'kid', 'hid', 'met', 'set', 'pet', 'pen', 'map', 'cap', 'ram', 'dip', 'rip', 'hid', 'kit', 'kit', 'hum', 'drum'],
  10
),
(
  'g2_m', 2, 'm', '/m/', 'm', 'm',
  'Rub your tummy like eating yummy food: mmmmm',
  'Karnını lezzetli yemek yerken ovuşturur gibi yap: mmmmm',
  'Mmmm, this muffin is so delicious! Mmmmm!',
  'Mmmm, bu muffin çok lezzetli! Mmmmm!',
  'Türkçe ''m'' ile aynı. Dudaklarını birleştir ve uğulda. Kolay!',
  ARRAY['man', 'map', 'mat', 'met', 'mix', 'mug', 'mud', 'mum'],
  ARRAY['cat', 'hat', 'mat', 'red', 'hen', 'men', 'den', 'ran', 'mad', 'dad', 'dim', 'him', 'mid', 'kid', 'hid', 'met', 'set', 'pet', 'pen', 'map', 'cap', 'ram', 'dip', 'rip', 'hid', 'kit', 'kit', 'hum', 'drum'],
  11
),
(
  'g2_d', 2, 'd', '/d/', 'd', 'd',
  'Beat a drum with your hands: d, d, d',
  'Ellerinle davul çal: d, d, d',
  'Bang the drum loudly: d, d, d!',
  'Davulu güçlüce çal: d, d, d!',
  'Türkçe ''d'' ile aynı. Dilin üst dişlerinin arkasına dokunur.',
  ARRAY['dad', 'did', 'dig', 'dip', 'den', 'dim', 'dug', 'dam'],
  ARRAY['cat', 'hat', 'mat', 'red', 'hen', 'men', 'den', 'ran', 'mad', 'dad', 'dim', 'him', 'mid', 'kid', 'hid', 'met', 'set', 'pet', 'pen', 'map', 'cap', 'ram', 'dip', 'rip', 'hid', 'kit', 'kit', 'hum', 'drum'],
  12
),

-- ===================== GROUP 3: Growing Letters (Büyüyen Harfler) =====================

(
  'g3_g', 3, 'g', '/ɡ/', 'g', 'g',
  'Gulp water from a glass: g, g, g',
  'Bir bardaktan su iç gibi yap: g, g, g',
  'Glug, glug! Drink a big glass of water: g, g, g!',
  'Glu glu! Büyük bir bardak su iç: g, g, g!',
  'Türkçe ''g'' (sert g) ile aynı. Bu alıştırmalarda her zaman sert bir sestir.',
  ARRAY['gap', 'gas', 'get', 'got', 'gum', 'gig'],
  ARRAY['dog', 'log', 'fog', 'big', 'bug', 'rug', 'fun', 'sun', 'bus', 'but', 'bun', 'gum', 'lot', 'got', 'hot', 'not', 'cut', 'lip', 'leg', 'let', 'fit', 'fig', 'dug', 'fuss', 'flap', 'blob', 'flag', 'plug', 'slug', 'glad', 'blot'],
  13
),
(
  'g3_o', 3, 'o', '/ɑ/', 'o', 'o',
  'Make an O with your mouth as if surprised: o, o, o',
  'Şaşırmış gibi ağzınla O yap: o, o, o',
  'Oh! Look at the octopus! O, o, o!',
  'Ah! Ahtapota bak! O, o, o!',
  'İngilizce kısa ''o'', Türkçe ''o''dan daha yuvarlak ve derin. Çeneni daha çok düşür.',
  ARRAY['on', 'off', 'odd', 'hot', 'pot', 'dog', 'log', 'top'],
  ARRAY['dog', 'log', 'fog', 'big', 'bug', 'rug', 'fun', 'sun', 'bus', 'but', 'bun', 'gum', 'lot', 'got', 'hot', 'not', 'cut', 'lip', 'leg', 'let', 'fit', 'fig', 'dug', 'fuss', 'flap', 'blob', 'flag', 'plug', 'slug', 'glad', 'blot'],
  14
),
(
  'g3_u', 3, 'u', '/ʌ/', 'u', 'u',
  'Open and close an umbrella: u, u, u',
  'Bir şemsiye aç ve kapat: u, u, u',
  'It''s raining! Quick, open the umbrella: uh, uh, uh!',
  'Yağmur yağıyor! Çabuk, şemsiyeyi aç: u, u, u!',
  'Bu ses Türkçe''de yok! En yakın ses kısa bir ''a''dır. Ağzını ''a'' der gibi aç ama dil ortada kalsın, geriye gitmesın. ''cup'', ''bug'', ''fun'' kelimelerini dinle — bu ''u'' Türkçe ''u''dan çok farklı!',
  ARRAY['up', 'us', 'cup', 'cut', 'but', 'bus', 'bug', 'fun'],
  ARRAY['dog', 'log', 'fog', 'big', 'bug', 'rug', 'fun', 'sun', 'bus', 'but', 'bun', 'gum', 'lot', 'got', 'hot', 'not', 'cut', 'lip', 'leg', 'let', 'fit', 'fig', 'dug', 'fuss', 'flap', 'blob', 'flag', 'plug', 'slug', 'glad', 'blot'],
  15
),
(
  'g3_l', 3, 'l', '/l/', 'l', 'l',
  'Lick a lollipop and say llllll',
  'Bir lolipop yalar gibi yap ve llllll de',
  'Lovely! Lick the lemon lollipop: llllll!',
  'Harika! Limonlu lolipopı yala: llllll!',
  'Türkçe ''l''ye benzer ama İngilizce''de iki ''l'' sesi vardır. Başta gelen açık ''l'', Türkçe ''l'' gibidir. Kelime sonundaki koyu ''l'' daha derindir.',
  ARRAY['lap', 'lit', 'let', 'lip', 'lid', 'leg', 'lot', 'log'],
  ARRAY['dog', 'log', 'fog', 'big', 'bug', 'rug', 'fun', 'sun', 'bus', 'but', 'bun', 'gum', 'lot', 'got', 'hot', 'not', 'cut', 'lip', 'leg', 'let', 'fit', 'fig', 'dug', 'fuss', 'flap', 'blob', 'flag', 'plug', 'slug', 'glad', 'blot'],
  16
),
(
  'g3_f', 3, 'f', '/f/', 'f', 'f',
  'Let air out of a tire slowly: fffff',
  'Bir lastikten hava boşaltıyor gibi yap: fffff',
  'Oh no, the tire is flat! Hear the air escape: fffff!',
  'Eyvah, lastik patlamış! Havanın kaçışını dinle: fffff!',
  'Türkçe ''f'' ile aynı. Alt dudağını hafifçe ısır ve üfle.',
  ARRAY['fan', 'fat', 'fin', 'fit', 'fig', 'fun', 'fog', 'fuss'],
  ARRAY['dog', 'log', 'fog', 'big', 'bug', 'rug', 'fun', 'sun', 'bus', 'but', 'bun', 'gum', 'lot', 'got', 'hot', 'not', 'cut', 'lip', 'leg', 'let', 'fit', 'fig', 'dug', 'fuss', 'flap', 'blob', 'flag', 'plug', 'slug', 'glad', 'blot'],
  17
),
(
  'g3_b', 3, 'b', '/b/', 'b', 'b',
  'Bounce a big ball with a bat: b, b, b',
  'Bir sopayla topa vuruyormuş gibi yap: b, b, b',
  'Bounce the ball: b, b, b!',
  'Topu zıpplat: b, b, b!',
  'Türkçe ''b'' ile aynı. Dudaklarını patlatır gibi birleştir!',
  ARRAY['bat', 'bit', 'big', 'bin', 'bed', 'bud', 'bun', 'bus'],
  ARRAY['dog', 'log', 'fog', 'big', 'bug', 'rug', 'fun', 'sun', 'bus', 'but', 'bun', 'gum', 'lot', 'got', 'hot', 'not', 'cut', 'lip', 'leg', 'let', 'fit', 'fig', 'dug', 'fuss', 'flap', 'blob', 'flag', 'plug', 'slug', 'glad', 'blot'],
  18
),

-- ===================== GROUP 4: Long Vowels (Uzun Sesli Harfler) =====================

(
  'g4_ai', 4, 'ai', '/eɪ/', 'ai', 'ai',
  'Cup your hand to your ear in the rain and say ai-ai-ai',
  'Yağmurda elini kulağına koy ve ay-ay-ay de',
  'Oh no, it''s raining! Put your hand out: ai, ai, ai!',
  'Eyvah, yağmur yağıyor! Elini uzat: ay, ay, ay!',
  'Bu uzun bir ünlü sestir, Türkçe ''ey'' demek gibi. İki bölümü var: e + i.',
  ARRAY['rain', 'pail', 'tail', 'mail', 'sail', 'paid', 'main', 'fail'],
  ARRAY['rain', 'tail', 'mail', 'pail', 'boat', 'goat', 'coat', 'road', 'tree', 'bee', 'see', 'need', 'seed', 'feet', 'tie', 'pie', 'lie', 'for', 'corn', 'fork', 'born', 'sort', 'jet', 'jam', 'jog', 'jug'],
  19
),
(
  'g4_j', 4, 'j', '/dʒ/', 'j', 'j',
  'Pretend to wobble like a jelly: j, j, j',
  'Bir jöle gibi titreyerek sallan: ''cam''daki gibi c, c, c',
  'The jelly wobbles on the plate: j, j, j!',
  'Jöle tabakta titriyor — ''cam''daki ''c'' gibi söyle: c, c, c!',
  'Türkçe ''c'' gibi (''cam'' kelimesindeki gibi). Yumuşak, vızıltılı bir sestir. Türkçe ''j'' değil!',
  ARRAY['jam', 'jet', 'jig', 'jog', 'jug', 'job', 'jot', 'jab'],
  ARRAY['rain', 'tail', 'mail', 'pail', 'boat', 'goat', 'coat', 'road', 'tree', 'bee', 'see', 'need', 'seed', 'feet', 'tie', 'pie', 'lie', 'for', 'corn', 'fork', 'born', 'sort', 'jet', 'jam', 'jog', 'jug'],
  20
),
(
  'g4_oa', 4, 'oa', '/oʊ/', 'oa', 'oa',
  'Pretend you stubbed your toe: oh! oh! oh!',
  'Ayak parmağını çarptın gibi yap: oh! oh! oh!',
  'The goat goes on a boat: oa, oa, oa!',
  'Keçi tekneye biniyor: oa, oa, oa!',
  'Bu, ''ou''yu yavaşça söylemek gibidir. ''o''dan başlar ve ''u''ya kayar. Türkçe ''o''dan farklıdır.',
  ARRAY['goat', 'boat', 'coat', 'road', 'load', 'soap', 'oak', 'foam'],
  ARRAY['rain', 'tail', 'mail', 'pail', 'boat', 'goat', 'coat', 'road', 'tree', 'bee', 'see', 'need', 'seed', 'feet', 'tie', 'pie', 'lie', 'for', 'corn', 'fork', 'born', 'sort', 'jet', 'jam', 'jog', 'jug'],
  21
),
(
  'g4_ie', 4, 'ie', '/aɪ/', 'ie', 'ie',
  'Stand like a soldier and salute: ie! ie!',
  'Asker gibi dimdik dur ve selam ver: ay! ay!',
  'The kite flies high in the sky: ie, ie, ie!',
  'Uçurtma gökte yüksekten uçuyor: ay, ay, ay!',
  'Bu, Türkçe ''ay'' gibi sesler. ''a''dan başla ve ''y''ye kay.',
  ARRAY['tie', 'pie', 'lie', 'kite', 'tried', 'cried', 'dried', 'fried'],
  ARRAY['rain', 'tail', 'mail', 'pail', 'boat', 'goat', 'coat', 'road', 'tree', 'bee', 'see', 'need', 'seed', 'feet', 'tie', 'pie', 'lie', 'for', 'corn', 'fork', 'born', 'sort', 'jet', 'jam', 'jog', 'jug'],
  22
),
(
  'g4_ee', 4, 'ee', '/iː/', 'ee', 'ee',
  'Put your hands on your knees and say eee like a donkey',
  'Ellerini dizlerine koy ve eşek gibi eee de',
  'The donkey says eee-ooor, eee-ooor!',
  'Eşek eee-ooor, eee-ooor diyor!',
  'Bu uzun bir ''i'' sesidir, Türkçe ''i'' gibi ama daha uzun tutulur. Uzat: iiii!',
  ARRAY['see', 'bee', 'tree', 'free', 'feet', 'seed', 'need', 'feed'],
  ARRAY['rain', 'tail', 'mail', 'pail', 'boat', 'goat', 'coat', 'road', 'tree', 'bee', 'see', 'need', 'seed', 'feet', 'tie', 'pie', 'lie', 'for', 'corn', 'fork', 'born', 'sort', 'jet', 'jam', 'jog', 'jug'],
  23
),
(
  'g4_or', 4, 'or', '/ɔː/', 'or', 'or',
  'Row a boat and say or, or, or',
  'Bir tekne kürek çek ve or, or, or de',
  'Row, row the boat to the shore: or, or, or!',
  'Kürek çek, kürek çek kıyıya: or, or, or!',
  'Bu uzun ''or'' Türkçe''de yok. Dudaklarını yuvarla ve ''o'' de, ardından yumuşak bir İngilizce ''r'' ekle.',
  ARRAY['for', 'or', 'corn', 'fork', 'torn', 'born', 'sort', 'port'],
  ARRAY['rain', 'tail', 'mail', 'pail', 'boat', 'goat', 'coat', 'road', 'tree', 'bee', 'see', 'need', 'seed', 'feet', 'tie', 'pie', 'lie', 'for', 'corn', 'fork', 'born', 'sort', 'jet', 'jam', 'jog', 'jug'],
  24
),

-- ===================== GROUP 5: Tricky Sounds (Zor Sesler) =====================

(
  'g5_z', 5, 'z', '/z/', 'z', 'z',
  'Flap your arms like a buzzing bee: zzzzz',
  'Kollarını vızıldayan arı gibi çırp: zzzzz',
  'The busy bee buzzes around the flowers: zzzzz!',
  'Meşgul arı çiçeklerin etrafında vızıldanıyor: zzzzz!',
  'Türkçe ''z'' ile aynı. ''ssss'' derken boğazını titret. Vızıltıyı hisset!',
  ARRAY['zip', 'zoo', 'zap', 'zig', 'zag', 'buzz', 'fizz', 'jazz'],
  ARRAY['zoo', 'zip', 'buzz', 'fizz', 'ring', 'sing', 'king', 'song', 'long', 'wing', 'win', 'van', 'vest', 'book', 'look', 'cook', 'good', 'moon', 'food', 'cool', 'pool', 'zoom'],
  25
),
(
  'g5_w', 5, 'w', '/w/', 'w', 'w',
  'Blow out a candle slowly and say wuh, wuh, wuh',
  'Yavaşça mum üfle ve ''wuh, wuh, wuh'' de — dudakların önce yuvarlansın!',
  'Whoosh! The wind blows: wuh, wuh, wuh!',
  'Wuuush! Rüzgar esiyor: wuh, wuh, wuh! (Türkçe ''v'' değil, W sesi!)',
  'Türkçe''de bu ses yok! Dudaklarını küçük bir daire yap (''u'' der gibi) sonra aç. Türkçe ''v'' değil!',
  ARRAY['win', 'wet', 'wig', 'wag', 'web', 'will', 'wax', 'wish'],
  ARRAY['zoo', 'zip', 'buzz', 'fizz', 'ring', 'sing', 'king', 'song', 'long', 'wing', 'win', 'van', 'vest', 'book', 'look', 'cook', 'good', 'moon', 'food', 'cool', 'pool', 'zoom'],
  26
),
(
  'g5_ng', 5, 'ng', '/ŋ/', 'ng', 'ng',
  'Lift weights and say ng, ng, ng like a strongman',
  'Ağırlık kaldırır gibi yap ve ng, ng, ng de',
  'The strong man lifts: nnng, nnng! Ring the bell: ng!',
  'Güçlü adam kaldırıyor: nnng, nnng! Zili çal: ng!',
  'Bu nazal ses Türkçe''de var! ''denk'' kelimesindeki ''n'' gibi. Dilinizin arkası ağzınızın arkasına dokunur.',
  ARRAY['ring', 'sing', 'king', 'song', 'long', 'bang', 'hung', 'thing'],
  ARRAY['zoo', 'zip', 'buzz', 'fizz', 'ring', 'sing', 'king', 'song', 'long', 'wing', 'win', 'van', 'vest', 'book', 'look', 'cook', 'good', 'moon', 'food', 'cool', 'pool', 'zoom'],
  27
),
(
  'g5_v', 5, 'v', '/v/', 'v', 'v',
  'Drive a van and hold the vibrating steering wheel: vvvvv',
  'Bir minibüs sür ve titreşen direksiyonu tut: vvvvv',
  'Vroom vroom! The van drives fast: vvvvv!',
  'Viiin viiin! Minibüs hızla gidiyor: vvvvv!',
  'Türkçe ''v'' ile aynı. Alt dudağını hafifçe ısır ve sesinle vızıltı çıkar.',
  ARRAY['van', 'vet', 'vim', 'vat', 'vast', 'vest', 'vine', 'vote'],
  ARRAY['zoo', 'zip', 'buzz', 'fizz', 'ring', 'sing', 'king', 'song', 'long', 'wing', 'win', 'van', 'vest', 'book', 'look', 'cook', 'good', 'moon', 'food', 'cool', 'pool', 'zoom'],
  28
),
(
  'g5_oo_short', 5, 'oo (book)', '/ʊ/', 'oo (short)', 'oo (kısa)',
  'Push a heavy box and say oo, oo (short) like in "book"',
  'Ağır bir kutu it ve kitaptaki gibi kısa oo, oo de',
  'Look! Take a good look at the book: oo, oo!',
  'Bak! Kitaba iyi bak: oo, oo!',
  'Bu kısa ''oo'', Türkçe ''u'' ile ''o'' arasındadır. Dudaklarını fazla yuvarlama. Kısa tut!',
  ARRAY['book', 'look', 'cook', 'good', 'foot', 'hook', 'wood', 'took'],
  ARRAY['zoo', 'zip', 'buzz', 'fizz', 'ring', 'sing', 'king', 'song', 'long', 'wing', 'win', 'van', 'vest', 'book', 'look', 'cook', 'good', 'moon', 'food', 'cool', 'pool', 'zoom'],
  29
),
(
  'g5_oo_long', 5, 'oo (moon)', '/uː/', 'oo (long)', 'oo (uzun)',
  'Point at the moon and say ooooo (long) like a wolf',
  'Aya işaret et ve kurt gibi uzun ooooo de',
  'The wolf howls at the moon: ooooo!',
  'Kurt aya uluyor: ooooo!',
  'Bu uzun ''oo'', Türkçe ''u''ya yakın ama daha uzun. Dudaklarını sıkıca yuvarla ve tut.',
  ARRAY['moon', 'zoo', 'food', 'cool', 'pool', 'room', 'boot', 'tool'],
  ARRAY['zoo', 'zip', 'buzz', 'fizz', 'ring', 'sing', 'king', 'song', 'long', 'wing', 'win', 'van', 'vest', 'book', 'look', 'cook', 'good', 'moon', 'food', 'cool', 'pool', 'zoom'],
  30
),

-- ===================== GROUP 6: Special Sounds (Özel Sesler) =====================

(
  'g6_y', 6, 'y', '/j/', 'y', 'y',
  'Eat yummy yogurt and say y, y, y',
  'Lezzetli yoğurt ye ve y, y, y de',
  'Yummy! Yes, I love yellow yogurt: y, y, y!',
  'Lezzetli! Evet, sarı yoğurdu seviyorum: y, y, y!',
  'Türkçe ''y'' ile aynı. ''yemek'' kelimesindeki ''y'' gibi. Sana kolay!',
  ARRAY['yes', 'yet', 'yam', 'yell', 'yawn', 'yoga', 'yolk', 'yard'],
  ARRAY['ship', 'shop', 'shut', 'shed', 'fish', 'wish', 'push', 'chip', 'chat', 'chin', 'chop', 'thin', 'thick', 'thing', 'think', 'this', 'that', 'them', 'with', 'the', 'yes', 'yet', 'yell', 'fox', 'box', 'mix', 'six'],
  31
),
(
  'g6_x', 6, 'x', '/ks/', 'x', 'x',
  'Cross your arms like an X and say ks, ks, ks',
  'Kollarını X gibi çaprazla ve ks, ks, ks de',
  'X marks the spot on the treasure map: ks, ks!',
  'X hazine haritasında yeri işaretliyor: ks, ks!',
  '''x'' harfi ''ks'' sesi çıkarır. Türkçe bu harfi kullanmaz ama ''k'' ve ''s'' seslerini zaten biliyorsun, sadece hızlıca birleştir!',
  ARRAY['fox', 'box', 'mix', 'six', 'fix', 'wax', 'max', 'Rex'],
  ARRAY['ship', 'shop', 'shut', 'shed', 'fish', 'wish', 'push', 'chip', 'chat', 'chin', 'chop', 'thin', 'thick', 'thing', 'think', 'this', 'that', 'them', 'with', 'the', 'yes', 'yet', 'yell', 'fox', 'box', 'mix', 'six'],
  32
),
(
  'g6_ch', 6, 'ch', '/tʃ/', 'ch', 'ch',
  'Mime a choo-choo train moving: ch, ch, ch, ch',
  'Çuf çuf tren gibi hareket et: ç, ç, ç, ç',
  'The train goes choo-choo: ch, ch, ch!',
  'Tren çuf çuf gidiyor: ç, ç, ç!',
  'Bu tam olarak Türkçe ''ç'' gibi (''çocuk'' kelimesindeki gibi). Bu sesi zaten mükemmel biliyorsun!',
  ARRAY['chip', 'chop', 'chin', 'chat', 'chest', 'check', 'child', 'much'],
  ARRAY['ship', 'shop', 'shut', 'shed', 'fish', 'wish', 'push', 'chip', 'chat', 'chin', 'chop', 'thin', 'thick', 'thing', 'think', 'this', 'that', 'them', 'with', 'the', 'yes', 'yet', 'yell', 'fox', 'box', 'mix', 'six'],
  33
),
(
  'g6_sh', 6, 'sh', '/ʃ/', 'sh', 'sh',
  'Put your finger on your lips and say shhhh, be quiet!',
  'Parmağını dudağına koy ve shhhh, sessiz ol de!',
  'Shhh! The baby is sleeping! Be quiet: shhh!',
  'Shhh! Bebek uyuyor! Sessiz ol: shhh!',
  'Bu tam olarak Türkçe ''ş'' gibi (''şeker'' kelimesindeki gibi). Mükemmel — bunu zaten biliyorsun!',
  ARRAY['ship', 'shop', 'shed', 'shin', 'shut', 'fish', 'wish', 'push'],
  ARRAY['ship', 'shop', 'shut', 'shed', 'fish', 'wish', 'push', 'chip', 'chat', 'chin', 'chop', 'thin', 'thick', 'thing', 'think', 'this', 'that', 'them', 'with', 'the', 'yes', 'yet', 'yell', 'fox', 'box', 'mix', 'six'],
  34
),
(
  'g6_th_voiced', 6, 'th', '/ð/', 'th (voiced)', 'th (sesli)',
  'Stick your tongue out a tiny bit and hum: thhhh (buzzy)',
  'Dilini biraz çıkar ve mırılda: thhhh (vızıltılı)',
  'This, that, the, them — feel your throat buzz: th, th!',
  'This, that, the, them — boğazının titreşimini hisset: th, th!',
  'Türkçe''de bu ses YOK! Dilini dişlerinin arasına koy ve sesinle titret. ''the'' ile alıştırma yap.',
  ARRAY['the', 'this', 'that', 'them', 'then', 'with', 'than', 'those'],
  ARRAY['ship', 'shop', 'shut', 'shed', 'fish', 'wish', 'push', 'chip', 'chat', 'chin', 'chop', 'thin', 'thick', 'thing', 'think', 'this', 'that', 'them', 'with', 'the', 'yes', 'yet', 'yell', 'fox', 'box', 'mix', 'six'],
  35
),
(
  'g6_th_unvoiced', 6, 'th', '/θ/', 'th (unvoiced)', 'th (sessiz)',
  'Stick your tongue out a tiny bit and blow air: thhh (quiet)',
  'Dilini biraz çıkar ve hava üfle: thhh (sessiz)',
  'Think of three thin things: th, th, th! (no buzzing)',
  'Üç ince şey düşün: th, th, th! (vızıltısız)',
  'Türkçe''de bu ses de YOK! Sesli ''th'' ile aynı dil pozisyonu ama SES YOK — sadece hava. Sessiz bir ''th'' gibi.',
  ARRAY['thin', 'thick', 'think', 'thing', 'three', 'moth', 'path', 'math'],
  ARRAY['ship', 'shop', 'shut', 'shed', 'fish', 'wish', 'push', 'chip', 'chat', 'chin', 'chop', 'thin', 'thick', 'thing', 'think', 'this', 'that', 'them', 'with', 'the', 'yes', 'yet', 'yell', 'fox', 'box', 'mix', 'six'],
  36
),

-- ===================== GROUP 7: Final Sounds (Son Sesler) =====================

(
  'g7_qu', 7, 'qu', '/kw/', 'qu', 'qu',
  'Quack like a duck: qu, qu, qu',
  'Ördek gibi vakla: kvu, kvu, kvu',
  'The queen''s duck says quack, quack: qu, qu!',
  'Kraliçenin ördeği vakladı: kvu, kvu!',
  '''qu'' her zaman ''kw'' sesi çıkarır. Türkçe bu kombinasyonu kullanmaz. ''k'' de sonra hızlıca ''w'' ekle. ''ku'' gibi ama İngilizce ''w'' ile.',
  ARRAY['queen', 'quick', 'quiz', 'quit', 'quack', 'quest', 'quote', 'quad'],
  ARRAY['queen', 'quick', 'quiz', 'quack', 'out', 'loud', 'round', 'cloud', 'house', 'oil', 'coin', 'join', 'boil', 'blue', 'clue', 'glue', 'true', 'car', 'star', 'far', 'park', 'farm', 'her', 'fern', 'after'],
  37
),
(
  'g7_ou', 7, 'ou', '/aʊ/', 'ou', 'ou',
  'Pretend you pricked your finger: OW! ou, ou!',
  'Parmağını batırmış gibi yap: AV! av, av!',
  'Ouch! The mouse ran out of the house: ou, ou!',
  'Ayyy! Fare evden kaçtı: av, av!',
  'Bu, Türkçe ''av'' gibi sesler. Geniş bir ''a'' sesiyle başla, sonra hızlıca ''u''ya kapat.',
  ARRAY['out', 'our', 'loud', 'round', 'found', 'cloud', 'mouse', 'house'],
  ARRAY['queen', 'quick', 'quiz', 'quack', 'out', 'loud', 'round', 'cloud', 'house', 'oil', 'coin', 'join', 'boil', 'blue', 'clue', 'glue', 'true', 'car', 'star', 'far', 'park', 'farm', 'her', 'fern', 'after'],
  38
),
(
  'g7_oi', 7, 'oi', '/ɔɪ/', 'oi', 'oi',
  'Point at something and say oi! oi! like a pirate',
  'Bir şeyi işaret et ve korsan gibi oy! oy! de',
  'Ahoy! The pirate found a coin: oi, oi!',
  'Ahoy! Korsan bir bozuk para buldu: oy, oy!',
  'Bu, Türkçe ''oy'' gibidir (''oy vermek'' gibi). Yuvarlak bir ''o''dan başla ve ''y''ye kay.',
  ARRAY['oil', 'coin', 'join', 'boil', 'foil', 'soil', 'coil', 'toil'],
  ARRAY['queen', 'quick', 'quiz', 'quack', 'out', 'loud', 'round', 'cloud', 'house', 'oil', 'coin', 'join', 'boil', 'blue', 'clue', 'glue', 'true', 'car', 'star', 'far', 'park', 'farm', 'her', 'fern', 'after'],
  39
),
(
  'g7_ue', 7, 'ue', '/juː/', 'ue', 'ue',
  'Point out the window at the view: ue, ue, ue',
  'Pencereden manzarayı göster: yu, yu, yu',
  'What a beautiful view! Look at the blue: ue, ue!',
  'Ne güzel manzara! Maviye bak: yu, yu!',
  'Bu ''yu'' ya da sadece uzun ''u'' gibi sesler. Bazen ''yoo'', bazen sadece ''oo'' denir. Her kelimede dikkatlice dinle.',
  ARRAY['blue', 'clue', 'glue', 'true', 'due', 'Sue', 'cue', 'hue'],
  ARRAY['queen', 'quick', 'quiz', 'quack', 'out', 'loud', 'round', 'cloud', 'house', 'oil', 'coin', 'join', 'boil', 'blue', 'clue', 'glue', 'true', 'car', 'star', 'far', 'park', 'farm', 'her', 'fern', 'after'],
  40
),
(
  'g7_er', 7, 'er', '/ɜː/', 'er', 'er',
  'Stir a mixer and say errrr, errrr',
  'Mikser karıştır ve errrr, errrr de',
  'The mixer goes errrr as it stirs the butter: er, er!',
  'Mikser tereyağını karıştırırken errrr diyor: er, er!',
  'Bu ünlü Türkçe''de YOK! ''e'' der gibi ama dili hafifçe geriye kıvırarak. İngilizce kelime sonlarında (-er, -ir, -ur hepsi bu şekilde sesler) çok yaygın.',
  ARRAY['her', 'fern', 'term', 'verb', 'herd', 'after', 'better', 'sister'],
  ARRAY['queen', 'quick', 'quiz', 'quack', 'out', 'loud', 'round', 'cloud', 'house', 'oil', 'coin', 'join', 'boil', 'blue', 'clue', 'glue', 'true', 'car', 'star', 'far', 'park', 'farm', 'her', 'fern', 'after'],
  41
),
(
  'g7_ar', 7, 'ar', '/ɑː/', 'ar', 'ar',
  'Open your mouth wide like at the doctor and say ahhh-r',
  'Doktordaymış gibi ağzını aç ve ahhh-r de',
  'The pirate says: ar, ar, ar! Stars are far!',
  'Korsan diyor ki: ar, ar, ar! Yıldızlar uzakta!',
  'Uzun bir Türkçe ''a''dan sonra yumuşak bir İngilizce ''r'' ekle. ''a'' açık ve uzun olmalı, kısa değil.',
  ARRAY['car', 'far', 'star', 'jar', 'farm', 'park', 'dark', 'art'],
  ARRAY['queen', 'quick', 'quiz', 'quack', 'out', 'loud', 'round', 'cloud', 'house', 'oil', 'coin', 'join', 'boil', 'blue', 'clue', 'glue', 'true', 'car', 'star', 'far', 'park', 'farm', 'her', 'fern', 'after'],
  42
)

ON CONFLICT (id) DO UPDATE SET
  group_number = EXCLUDED.group_number,
  letters = EXCLUDED.letters,
  ipa = EXCLUDED.ipa,
  display_name = EXCLUDED.display_name,
  display_name_tr = EXCLUDED.display_name_tr,
  action_text = EXCLUDED.action_text,
  action_text_tr = EXCLUDED.action_text_tr,
  story_text = EXCLUDED.story_text,
  story_text_tr = EXCLUDED.story_text_tr,
  turkish_note = EXCLUDED.turkish_note,
  keywords = EXCLUDED.keywords,
  blendable_words = EXCLUDED.blendable_words,
  sort_order = EXCLUDED.sort_order;
