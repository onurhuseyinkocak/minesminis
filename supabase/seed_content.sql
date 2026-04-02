-- ============================================================
-- MinesMinis Seed Content Data
-- Generated from src/data/*.ts source files
-- Uses ON CONFLICT DO UPDATE for idempotent inserts
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. SONGS TABLE
-- ────────────────────────────────────────────────────────────

INSERT INTO songs (id, phonics_group, title, title_tr, emoji, tempo, style, lyrics, sort_order) VALUES
(
  'song-g1-sound-safari', 1, 'The Sound Safari', 'Ses Safarisi', '🐘', 'medium', 'nursery',
  '[{"text":"Welcome to the Sound Safari, come along with me!","textTr":"Ses Safarisine hoşgeldin, benimle gel!","startMs":0,"durationMs":4000,"highlightSounds":[]},{"text":"S-s-s says the snake, sliding in the sun","textTr":"S-s-s diyor yılan, güneşte kayıyor","startMs":4000,"durationMs":4000,"highlightSounds":["s"]},{"text":"A-a-a says the apple, having so much fun","textTr":"A-a-a diyor elma, çok eğleniyor","startMs":8000,"durationMs":4000,"highlightSounds":["a"]},{"text":"T-t-t says the tiger, tapping with its tail","textTr":"T-t-t diyor kaplan, kuyruğu ile vuruyor","startMs":12000,"durationMs":4000,"highlightSounds":["t"]},{"text":"I-i-i says the igloo, hiding from the hail","textTr":"I-i-i diyor igloo, doludan saklanıyorum","startMs":16000,"durationMs":4000,"highlightSounds":["i"]},{"text":"P-p-p says the penguin, playing in the pool","textTr":"P-p-p diyor penguen, havuzda oynuyor","startMs":20000,"durationMs":4000,"highlightSounds":["p"]},{"text":"N-n-n says the newt, learning things at school","textTr":"N-n-n diyor semender, okulda öğreniyor","startMs":24000,"durationMs":4000,"highlightSounds":["n"]},{"text":"S, A, T, I, P, N — those are the sounds we know!","textTr":"S, A, T, I, P, N — bunlar bildiğimiz sesler!","startMs":28000,"durationMs":4000,"highlightSounds":["s","a","t","i","p","n"]},{"text":"S, A, T, I, P, N — sing them high and low!","textTr":"S, A, T, I, P, N — yüksek ve alçak söyle!","startMs":32000,"durationMs":4000,"highlightSounds":["s","a","t","i","p","n"]},{"text":"We sat and sipped and tapped today, hooray for Group One sounds!","textTr":"Bugün oturduk, yudumladık ve tıklattık, yaşasın Grup Bir sesleri!","startMs":36000,"durationMs":5000,"highlightSounds":["s","a","t","i","p","n"]}]'::jsonb,
  1
),
(
  'song-g2-kitchen-sounds', 2, 'Kitchen Sounds', 'Mutfak Sesleri', '🍳', 'medium', 'chant',
  '[{"text":"Come into the kitchen, what sounds can you hear?","textTr":"Mutfağa gel, hangi sesleri duyabilirsin?","startMs":0,"durationMs":4000,"highlightSounds":[]},{"text":"C-c-c the cat is cooking, stirring something near","textTr":"K-k-k kedi yemek pişiriyor, yakından karıştırıyor","startMs":4000,"durationMs":4000,"highlightSounds":["c"]},{"text":"E-e-e the egg is ready, cracking in the pan","textTr":"E-e-e yumurta hazır, tavada çatlak","startMs":8000,"durationMs":4000,"highlightSounds":["e"]},{"text":"H-h-h the hungry dog is panting, what a happy plan!","textTr":"H-h-h aç köpek soluyuyor, ne güzel plan!","startMs":12000,"durationMs":4000,"highlightSounds":["h"]},{"text":"R-r-r the lion roars for dinner, he wants more to eat","textTr":"R-r-r aslan akşam yemeği için kükreyor, daha fazla yemek istiyor","startMs":16000,"durationMs":4000,"highlightSounds":["r"]},{"text":"M-m-m the muffin smells so yummy, what a tasty treat!","textTr":"M-m-m muffin çok güzel kokuyor, ne lezzetli!","startMs":20000,"durationMs":4000,"highlightSounds":["m"]},{"text":"D-d-d the drum is beating loudly, dinner time is here!","textTr":"D-d-d davul yüksek sesle çalıyor, yemek zamanı geldi!","startMs":24000,"durationMs":4000,"highlightSounds":["d"]},{"text":"C, E, H, R, M, D — kitchen sounds are great!","textTr":"C, E, H, R, M, D — mutfak sesleri harika!","startMs":28000,"durationMs":4000,"highlightSounds":["c","e","h","r","m","d"]},{"text":"C, E, H, R, M, D — put them on your plate!","textTr":"C, E, H, R, M, D — onları tabağına koy!","startMs":32000,"durationMs":4000,"highlightSounds":["c","e","h","r","m","d"]},{"text":"The cat cooked eggs with Mum and Dad, the kitchen song is done!","textTr":"Kedi anne ve babayla yumurta pişirdi, mutfak şarkısı bitti!","startMs":36000,"durationMs":5000,"highlightSounds":["c","e","h","r","m","d"]}]'::jsonb,
  2
),
(
  'song-g3-playground-bounce', 3, 'Playground Bounce', 'Oyun Alanı Zıplatması', '🏀', 'fast', 'rap',
  '[{"text":"Bounce, bounce, at the playground, let us go go go!","textTr":"Zıpla, zıpla, oyun alanında, hadi gidelim!","startMs":0,"durationMs":3500,"highlightSounds":[]},{"text":"G-g-g gulp the water, drinking nice and slow","textTr":"G-g-g suyu yudumla, yavaş yavaş iç","startMs":3500,"durationMs":3500,"highlightSounds":["g"]},{"text":"O-o-o the octopus is jumping, oh oh oh!","textTr":"O-o-o ahtapot zıplıyor, oh oh oh!","startMs":7000,"durationMs":3500,"highlightSounds":["o"]},{"text":"U-u-u umbrella up, the rain begins to flow","textTr":"U-u-u şemsiye aç, yağmur başlıyor","startMs":10500,"durationMs":3500,"highlightSounds":["u"]},{"text":"L-l-l lollipop lick, so sweet upon my tongue","textTr":"L-l-l lolipop yala, dilimde çok tatlı","startMs":14000,"durationMs":3500,"highlightSounds":["l"]},{"text":"F-f-f the tire is flat, the air has almost gone","textTr":"F-f-f lastik patlak, hava neredeyse bitti","startMs":17500,"durationMs":3500,"highlightSounds":["f"]},{"text":"B-b-b bounce the ball, we are having fun!","textTr":"B-b-b topu zıpplat, eğlenceye devam!","startMs":21000,"durationMs":3500,"highlightSounds":["b"]},{"text":"G, O, U, L, F, B — playground sounds rock!","textTr":"G, O, U, L, F, B — oyun alanı sesleri harika!","startMs":24500,"durationMs":3500,"highlightSounds":["g","o","u","l","f","b"]},{"text":"G, O, U, L, F, B — tick-tock, tick-tock!","textTr":"G, O, U, L, F, B — tik-tak, tik-tak!","startMs":28000,"durationMs":3500,"highlightSounds":["g","o","u","l","f","b"]},{"text":"A big dog and a bug on a log, having fun in the fog!","textTr":"Büyük bir köpek ve bir böcek kütük üzerinde, siste eğleniyor!","startMs":31500,"durationMs":5000,"highlightSounds":["g","o","u","l","f","b"]}]'::jsonb,
  3
),
(
  'song-g4-vowel-voyage', 4, 'The Vowel Voyage', 'Sesli Harf Yolculuğu', '⛵', 'slow', 'nursery',
  '[{"text":"Set sail on the vowel voyage, long sounds here we come!","textTr":"Sesli harf yolculuğuna yelken aç, uzun sesler geliyoruz!","startMs":0,"durationMs":4500,"highlightSounds":[]},{"text":"AI-AI-AI the rain is falling, splashing everyone","textTr":"AY-AY-AY yağmur yağıyor, herkesi ıslatıyor","startMs":4500,"durationMs":4500,"highlightSounds":["ai"]},{"text":"J-j-j the jelly wobbles, wibbly wobbly fun","textTr":"C-c-c jöle titriyor, titreşen eğlence","startMs":9000,"durationMs":4500,"highlightSounds":["j"]},{"text":"OA-OA-OA the goat is on a boat, sailing in the sun","textTr":"OA-OA-OA keçi teknede, güneşte yelken açıyor","startMs":13500,"durationMs":4500,"highlightSounds":["oa"]},{"text":"IE-IE-IE the kite is flying high, way up in the sky","textTr":"AY-AY-AY uçurtma yüksekte uçuyor, gökyüzünde","startMs":18000,"durationMs":4500,"highlightSounds":["ie"]},{"text":"EE-EE-EE the buzzy little bee, flying way up high","textTr":"EE-EE-EE vızıldayan küçük arı, yüksekte uçuyor","startMs":22500,"durationMs":4500,"highlightSounds":["ee"]},{"text":"OR-OR-OR we row the boat to shore, resting by the corn","textTr":"OR-OR-OR tekneyi kıyıya çekelim, mısırların yanında dinlenelim","startMs":27000,"durationMs":4500,"highlightSounds":["or"]},{"text":"AI, J, OA, IE, EE, OR — long vowels are the best!","textTr":"AI, J, OA, IE, EE, OR — uzun sesliler en iyisi!","startMs":31500,"durationMs":4500,"highlightSounds":["ai","j","oa","ie","ee","or"]},{"text":"Rain and boats and bees, oh my — we sailed and passed the test!","textTr":"Yağmur, tekneler ve arılar, ohhh — yelken açtık ve sınavı geçtik!","startMs":36000,"durationMs":5000,"highlightSounds":["ai","oa","ee","or"]}]'::jsonb,
  4
),
(
  'song-g5-zoo-groove', 5, 'Zoo Groove', 'Hayvanat Bahçesi Ritmi', '🦁', 'medium', 'chant',
  '[{"text":"Let us groove at the zoo, with some tricky sounds to say!","textTr":"Hayvanat bahçesinde dans edelim, bazı zor seslerle!","startMs":0,"durationMs":4000,"highlightSounds":[]},{"text":"Z-z-z the bee goes buzzing, zig-zag all the way","textTr":"Z-z-z arı vızıldayarak gidiyor, zikzak yaparak","startMs":4000,"durationMs":4000,"highlightSounds":["z"]},{"text":"W-w-w the wind is blowing, whoooosh across the bay","textTr":"W-w-w rüzgar esiyor, vuuuuus koyun içinden","startMs":8000,"durationMs":4000,"highlightSounds":["w"]},{"text":"NG-NG-NG the king is singing, ding dong ring the bell!","textTr":"NG-NG-NG kral şarkı söylüyor, ding dong zili çal!","startMs":12000,"durationMs":4000,"highlightSounds":["ng"]},{"text":"V-v-v the van goes vroom vroom, racing really well","textTr":"V-v-v minibüs viiin diyor, gerçekten iyi yarışıyor","startMs":16000,"durationMs":4000,"highlightSounds":["v"]},{"text":"OO-OO short says the book, look look look around","textTr":"OO-OO kısa diyor kitap, bak bak bak etrafına","startMs":20000,"durationMs":4000,"highlightSounds":["oo"]},{"text":"OO-OO long says the moon, howling wolf makes the sound","textTr":"OO-OO uzun diyor ay, uluyan kurt sesi çıkarıyor","startMs":24000,"durationMs":4000,"highlightSounds":["oo"]},{"text":"Z, W, NG, V, OO, OO — tricky sounds, we groove!","textTr":"Z, W, NG, V, OO, OO — zor sesler, dans ediyoruz!","startMs":28000,"durationMs":4000,"highlightSounds":["z","w","ng","v","oo"]},{"text":"A king at the zoo sang a cool moon song, we love the zoo groove!","textTr":"Hayvanat bahçesindeki kral havalı bir ay şarkısı söyledi, dans etmeyi seviyoruz!","startMs":32000,"durationMs":5000,"highlightSounds":["z","w","ng","v","oo"]}]'::jsonb,
  5
),
(
  'song-g6-special-express', 6, 'The Special Sound Express', 'Özel Ses Ekspresi', '🚂', 'medium', 'nursery',
  '[{"text":"All aboard the sound express, special sounds today!","textTr":"Hepiniz ses ekspresine binin, bugün özel sesler!","startMs":0,"durationMs":4000,"highlightSounds":[]},{"text":"Y-y-y says yummy yogurt, hooray hooray hooray!","textTr":"Y-y-y diyor lezzetli yoğurt, yaşasın yaşasın yaşasın!","startMs":4000,"durationMs":4000,"highlightSounds":["y"]},{"text":"X-x-x the fox is in a box, ks ks ks he says!","textTr":"X-x-x tilki kutunun içinde, ks ks ks diyor!","startMs":8000,"durationMs":4000,"highlightSounds":["x"]},{"text":"CH-CH-CH the train goes choo-choo, chugging on its way","textTr":"Ç-Ç-Ç tren çuf-çuf gidiyor, yolunda ilerliyor","startMs":12000,"durationMs":4000,"highlightSounds":["ch"]},{"text":"SH-SH-SH the baby sleeps, shh be quiet please!","textTr":"Ş-Ş-Ş bebek uyuyor, şus sessiz ol lütfen!","startMs":16000,"durationMs":4000,"highlightSounds":["sh"]},{"text":"TH-TH-TH this and that, stick your tongue out with ease","textTr":"TH-TH-TH bu ve şu, dilini rahatça çıkar","startMs":20000,"durationMs":4000,"highlightSounds":["th"]},{"text":"TH-TH-TH think of three, thin things upon the breeze","textTr":"TH-TH-TH üç tane düşün, rüzgardaki ince şeyler","startMs":24000,"durationMs":4000,"highlightSounds":["th"]},{"text":"Y, X, CH, SH, TH, TH — special sounds express!","textTr":"Y, X, Ç, Ş, TH, TH — özel ses ekspresi!","startMs":28000,"durationMs":4000,"highlightSounds":["y","x","ch","sh","th"]},{"text":"The fox said shh and the train went choo, we are the very best!","textTr":"Tilki şus dedi ve tren çuf çuf gitti, biz en iyisiyiz!","startMs":32000,"durationMs":5000,"highlightSounds":["y","x","ch","sh","th"]}]'::jsonb,
  6
),
(
  'song-g7-treasure-quest', 7, 'The Treasure Quest Chant', 'Hazine Görevi Tezahüratı', '🏆', 'medium', 'chant',
  '[{"text":"Quest! Quest! On a treasure quest, the final sounds to find!","textTr":"Görev! Görev! Hazine görevindeyiz, son sesleri bulalım!","startMs":0,"durationMs":4000,"highlightSounds":[]},{"text":"QU-QU-QU the queen says quick, the duck says quack behind","textTr":"KU-KU-KU kraliçe çabuk diyor, ördek arkadan vaklıyor","startMs":4000,"durationMs":4000,"highlightSounds":["qu"]},{"text":"OU-OU-OU ouch that hurts! A cloud rolls through the sky","textTr":"AV-AV-AV ayyy acıdı! Bir bulut gökyüzünde yuvarlanır","startMs":8000,"durationMs":4000,"highlightSounds":["ou"]},{"text":"OI-OI-OI the pirate shouts, a golden coin nearby!","textTr":"OY-OY-OY korsan bağırır, yakınlarda altın bir para!","startMs":12000,"durationMs":4000,"highlightSounds":["oi"]},{"text":"UE-UE-UE the sky is blue, a beautiful blue view","textTr":"YU-YU-YU gökyüzü mavi, güzel bir mavi manzara","startMs":16000,"durationMs":4000,"highlightSounds":["ue"]},{"text":"ER-ER-ER the mixer stirs, her butter turning too","textTr":"ER-ER-ER mikser karıştırıyor, onun tereyağı da dönüyor","startMs":20000,"durationMs":4000,"highlightSounds":["er"]},{"text":"AR-AR-AR a pirate star, shining from afar","textTr":"AR-AR-AR bir korsan yıldızı, uzaktan parlıyor","startMs":24000,"durationMs":4000,"highlightSounds":["ar"]},{"text":"QU, OU, OI, UE, ER, AR — the final sounds are here!","textTr":"QU, OU, OI, UE, ER, AR — son sesler burada!","startMs":28000,"durationMs":4000,"highlightSounds":["qu","ou","oi","ue","er","ar"]},{"text":"We found the treasure, every sound! Now give a mighty cheer!","textTr":"Hazineyi bulduk, her sesi! Şimdi güçlü bir tezahürat yapın!","startMs":32000,"durationMs":4000,"highlightSounds":["qu","ou","oi","ue","er","ar"]},{"text":"All 42 sounds we know, from s to ar and more — phonics champions forevermore!","textTr":"42 sesin hepsini biliyoruz, s''ten ar''a ve ötesine — sonsuza dek fonetik şampiyonları!","startMs":36000,"durationMs":6000,"highlightSounds":[]}]'::jsonb,
  7
)
ON CONFLICT (id) DO UPDATE SET
  phonics_group = EXCLUDED.phonics_group,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  emoji = EXCLUDED.emoji,
  tempo = EXCLUDED.tempo,
  style = EXCLUDED.style,
  lyrics = EXCLUDED.lyrics,
  sort_order = EXCLUDED.sort_order;


-- ────────────────────────────────────────────────────────────
-- 2. WORLDS TABLE
-- Curriculum worlds (w1-w20) + Adventure story worlds
-- ────────────────────────────────────────────────────────────

INSERT INTO worlds (id, type, name, name_tr, description, description_tr, emoji, color, sort_order, is_active) VALUES
-- Curriculum worlds
('w1',  'curriculum', 'Hello World',       'Merhaba Dünya',       'Learn to say hello, goodbye, and introduce yourself in English!', 'İngilizce merhaba, hoşça kal demeyi ve kendini tanıtmayı öğren!', '🌍', '#4CAF50', 1, true),
('w2',  'curriculum', 'My Family',         'Benim Ailem',         'Meet the family and explore the house!', 'Aileyle tanış ve evi keşfet!', '🏠', '#E91E63', 2, true),
('w3',  'curriculum', 'Animal Kingdom',    'Hayvanlar Alemi',     'Discover animals from pets to wild creatures!', 'Evcil hayvanlardan vahşi hayvanlara kadar keşfet!', '🦁', '#FF9800', 3, true),
('w4',  'curriculum', 'Rainbow Colors',    'Gökkuşağı Renkleri',  'Paint with all the colors and learn shapes!', 'Tüm renklerle boya ve şekilleri öğren!', '🌈', '#9C27B0', 4, true),
('w5',  'curriculum', 'Yummy Food',        'Lezzetli Yemekler',   'Explore delicious foods and drinks!', 'Lezzetli yemekleri ve içecekleri keşfet!', '🍎', '#F44336', 5, true),
('w6',  'curriculum', 'My Body',           'Vücudum',             'Learn about your body and staying healthy!', 'Vücudun ve sağlıklı kalma hakkında öğren!', '🧒', '#00BCD4', 6, true),
('w7',  'curriculum', 'Nature Explorer',   'Doğa Kaşifi',         'Explore nature and learn about weather!', 'Doğayı keşfet ve hava durumunu öğren!', '🌳', '#43A047', 7, true),
('w8',  'curriculum', 'Toy Town',          'Oyuncak Şehri',       'Play with toys and learn action words!', 'Oyuncaklarla oyna ve eylem kelimeleri öğren!', '🧸', '#FF5722', 8, true),
('w9',  'curriculum', 'School Days',       'Okul Günleri',        'Everything about school and learning!', 'Okul ve öğrenme hakkında her şey!', '📚', '#3F51B5', 9, true),
('w10', 'curriculum', 'Around Town',       'Şehir Turu',          'Discover places in town and how to get there!', 'Şehirdeki yerleri ve ulaşımı keşfet!', '🏙️', '#607D8B', 10, true),
('w11', 'curriculum', 'Story Time',        'Hikaye Zamanı',       'Enter a world of fairy tales and adventures!', 'Masal ve macera dünyasına gir!', '📖', '#673AB7', 11, true),
('w12', 'curriculum', 'World Traveler',    'Dünya Gezgini',       'Travel the world and learn about different cultures!', 'Dünyayı gez ve farklı kültürleri öğren!', '✈️', '#009688', 12, true),
('w14', 'curriculum', 'Weather World',     'Hava Dünyası',        'Discover weather, seasons, and the world around you!', 'Hava durumunu, mevsimleri ve çevreni keşfet!', '🌦️', '#2196F3', 13, true),
('w15', 'curriculum', 'My Town',           'Şehrim',              'Explore your town and meet community helpers!', 'Şehrini keşfet ve toplum kahramanlarıyla tanış!', '🏙️', '#795548', 14, true),
('w16', 'curriculum', 'Time & Routines',   'Zaman ve Rutinler',   'Learn daily routines and how to talk about time!', 'Günlük rutinleri ve zamanı konuşmayı öğren!', '⏰', '#FF9800', 15, true),
('w17', 'curriculum', 'The Ocean',         'Okyanus',             'Dive into the ocean and meet amazing sea creatures!', 'Okyanuslara dal ve muhteşem deniz canlılarıyla tanış!', '🌊', '#1565C0', 16, true),
('w18', 'curriculum', 'My Feelings',       'Duygularım',          'Understand your feelings and be kind to others!', 'Duygularını anla ve başkalarına nazik ol!', '💛', '#E91E63', 17, true),
('w19', 'curriculum', 'Science & Nature',  'Bilim ve Doğa',       'Explore plants, insects, rocks, and the wonders of nature!', 'Bitkileri, böcekleri, kayaları ve doğanın harikalarını keşfet!', '🔬', '#558B2F', 18, true),
('w20', 'curriculum', 'Let''s Celebrate!', 'Kutlayalım!',         'Party, sing, dance, and celebrate every achievement!', 'Parti yap, şarkı söyle, dans et ve her başarını kutla!', '🎉', '#F9A825', 19, true),

-- Adventure / story worlds
('forest',   'adventure', 'Whispering Woods', 'Fısıldayan Orman',   'A magical forest where trees whisper secrets and fireflies light the way.', 'Ağaçların sır fısıldadığı ve ateşböceklerinin yolu aydınlattığı büyülü bir orman.', '🌲', 'var(--world-forest)',   20, true),
('ocean',    'adventure', 'Sapphire Seas',    'Safir Denizler',     'An endless ocean of wonder, with coral cities and friendly sea creatures.', 'Mercan şehirleri ve dost deniz canlılarıyla dolu sonsuz bir okyanus.', '🌊', 'var(--world-ocean)',    21, true),
('mountain', 'adventure', 'Starlight Summit', 'Yıldız Işığı Zirvesi', 'Towering peaks that touch the clouds, where eagles soar and stars feel close.', 'Bulutlara dokunan devasa zirveler, kartalların süzüldüğü ve yıldızların yakın hissedildiği yer.', '🏔️', 'var(--world-mountain)', 22, true),
('desert',   'adventure', 'Golden Sands',     'Altın Kumlar',       'Ancient deserts with hidden treasures, wise merchants, and starlit nights.', 'Gizli hazineler, bilge tüccarlar ve yıldızlı geceler ile kadim çöller.', '🏜️', 'var(--world-desert)',   23, true),
('space',    'adventure', 'Cosmic Voyage',    'Kozmik Yolculuk',    'The stars are calling! Explore planets, meet aliens, and discover the universe.', 'Yıldızlar çağırıyor! Gezegenleri keşfet, uzaylılarla tanış ve evreni keşfet.', '🚀', 'var(--world-space)',    24, true)
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  name = EXCLUDED.name,
  name_tr = EXCLUDED.name_tr,
  description = EXCLUDED.description,
  description_tr = EXCLUDED.description_tr,
  emoji = EXCLUDED.emoji,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;


-- ────────────────────────────────────────────────────────────
-- 3. CURRICULUM_PHASES TABLE
-- ────────────────────────────────────────────────────────────

INSERT INTO curriculum_phases (id, name, name_tr, age_min, age_max, description, description_tr, sort_order) VALUES
('little-ears',      'Little Ears',      'Küçük Kulaklar',        3.0, 5.0, 'Discover the first 18 English sounds through play, actions, and stories. Build your first words by blending sounds together.', 'Oyun, hareketler ve hikayeler aracılığıyla ilk 18 İngilizce sesi keşfet. Sesleri birleştirerek ilk kelimelerini oluştur.', 1),
('word-builders',    'Word Builders',    'Kelime İnşaatçıları',   4.0, 6.0, 'Master long vowels, digraphs, and tricky sounds. Build longer words and read simple stories independently.', 'Uzun seslileri, çifte harfleri ve zor sesleri ustala. Daha uzun kelimeler oluştur ve basit hikayeleri bağımsız oku.', 2),
('story-makers',     'Story Makers',     'Hikaye Yapıcılar',      5.0, 7.0, 'Learn all 42 sounds including the trickiest ones for Turkish speakers. Read and create your own stories!', 'Türkçe konuşanlar için en zor sesler dahil 42 sesin tamamını öğren. Kendi hikayelerini oku ve oluştur!', 3),
('young-explorers',  'Young Explorers',  'Genç Kaşifler',         6.0, 8.0, 'Read with expression, understand stories deeply, and write your own tales. You are a phonics champion!', 'İfadeyle oku, hikayeleri derinlemesine anla ve kendi hikayelerini yaz. Sen bir fonetik şampiyonusun!', 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_tr = EXCLUDED.name_tr,
  age_min = EXCLUDED.age_min,
  age_max = EXCLUDED.age_max,
  description = EXCLUDED.description,
  description_tr = EXCLUDED.description_tr,
  sort_order = EXCLUDED.sort_order;


-- ────────────────────────────────────────────────────────────
-- 4. TURKISH_PHONETIC_TRAPS TABLE (9 traps)
-- ────────────────────────────────────────────────────────────

INSERT INTO turkish_phonetic_traps (id, trap_name, trap_name_tr, target_sound_ipa, error_sound_ipa, description, description_tr, mouth_position, mouth_position_tr, minimal_pairs, exercises, difficulty, sort_order) VALUES
(
  'th-voiceless', 'TH (voiceless)', 'TH (sessiz)', '/θ/', '/t/',
  'Turkish learners say "t" instead of "θ" — tongue stays behind teeth',
  'Türk öğrenciler "θ" yerine "t" der — dil dişlerin arasına girmez',
  'Put the tip of your tongue lightly between your upper and lower teeth. Blow air out gently — like you are blowing dust. Do NOT press hard.',
  'Dil ucunu hafifçe üst ve alt dişlerin arasına koy. Havayı nazikçe üfle — toz üflüyormuş gibi. Sert basma!',
  '[{"english":"think","errorVersion":"tink","meaning":"to use your mind","meaningTr":"düşünmek"},{"english":"three","errorVersion":"tree","meaning":"the number 3","meaningTr":"üç sayısı"},{"english":"thank","errorVersion":"tank","meaning":"to express gratitude","meaningTr":"teşekkür etmek"},{"english":"thin","errorVersion":"tin","meaning":"not thick","meaningTr":"ince"},{"english":"thumb","errorVersion":"tum","meaning":"the big finger","meaningTr":"baş parmak"}]'::jsonb,
  '[{"id":"th-v-mc1","type":"multiple_choice","prompt":"Which word means \"the number 3\"?","promptTr":"\"3 sayısı\" anlamına gelen kelime hangisi?","targetWord":"three","options":["tree","three","free"],"correctOption":"three"},{"id":"th-v-mc2","type":"multiple_choice","prompt":"You keep fish in this — it is NOT \"thank\":","promptTr":"Balıkları bunda tutarsın — \"thank\" DEĞİL:","targetWord":"tank","options":["thank","tank","rank"],"correctOption":"tank"},{"id":"th-v-ld1","type":"listen_distinguish","prompt":"Your big finger is your ___","promptTr":"Büyük parmağın ___","targetWord":"thumb","options":["tum","thumb","gum"],"correctOption":"thumb"}]'::jsonb,
  3, 1
),
(
  'th-voiced', 'TH (voiced)', 'TH (sesli)', '/ð/', '/d/',
  'Turkish learners say "d" instead of "ð" — "the" sounds like "de"',
  'Türk öğrenciler "ð" yerine "d" der — "the" kelimesi "de" gibi çıkar',
  'Same as voiceless TH but now make your voice vibrate! Tongue between teeth, blow air, and add your voice (like a bee buzzing).',
  'Sessiz TH ile aynı ama şimdi sesinle titret! Dil dişlerin arasında, hava üfle ve sesini ekle (arı vızıltısı gibi).',
  '[{"english":"they","errorVersion":"day","meaning":"a group of people","meaningTr":"onlar"},{"english":"though","errorVersion":"dough","meaning":"even so / despite","meaningTr":"yine de / her ne kadar"},{"english":"there","errorVersion":"dare","meaning":"in that place","meaningTr":"orada"},{"english":"breathe","errorVersion":"breed","meaning":"to take in air","meaningTr":"nefes almak"},{"english":"soothe","errorVersion":"sued","meaning":"to calm down","meaningTr":"sakinleştirmek"}]'::jsonb,
  '[{"id":"th-voiced-mc1","type":"multiple_choice","prompt":"Which word means \"in that place\"?","promptTr":"\"Orada\" anlamına gelen kelime hangisi?","targetWord":"there","options":["dare","there","bare"],"correctOption":"there"},{"id":"th-voiced-mc2","type":"multiple_choice","prompt":"What do you do every second with your lungs?","promptTr":"Akciğerlerinle her saniye ne yapıyorsun?","targetWord":"breathe","options":["breed","breathe","bream"],"correctOption":"breathe"},{"id":"th-voiced-ld1","type":"listen_distinguish","prompt":"A group of friends — we call them ___","promptTr":"Bir grup arkadaş — onlara ___ deriz","targetWord":"they","options":["day","dey","they"],"correctOption":"they"}]'::jsonb,
  3, 2
),
(
  'w-vs-v', 'W sound', 'W sesi', '/w/', '/v/',
  'Turkish has /v/ but no /w/. "west" is said as "vest", "we" as "ve"',
  'Türkçede /v/ var ama /w/ yok. "west" kelimesi "vest" olarak söylenir',
  'Round your lips like you are kissing or blowing a candle. Do NOT touch your teeth with your lip! Air flows freely — it is a smooth "oo" start.',
  'Dudaklarını yuvarlak yap, öpüyor ya da mum üflüyormuş gibi. Üst dişlerin alt dudağa değmemeli! Hava serbestçe akar.',
  '[{"english":"west","errorVersion":"vest","meaning":"the direction where the sun sets","meaningTr":"güneşin battığı yön (batı)"},{"english":"wail","errorVersion":"veil","meaning":"to cry loudly","meaningTr":"yüksek sesle ağlamak"},{"english":"wet","errorVersion":"vet","meaning":"covered with water","meaningTr":"ıslak"},{"english":"wow","errorVersion":"vow","meaning":"expression of surprise","meaningTr":"şaşırma ifadesi"},{"english":"wheel","errorVersion":"veal","meaning":"a round rolling object","meaningTr":"yuvarlak dönen nesne"}]'::jsonb,
  '[{"id":"wv-mc1","type":"multiple_choice","prompt":"Your bicycle has two of these round things:","promptTr":"Bisikletinin iki tane yuvarlak şeyi var:","targetWord":"wheel","options":["veal","wheel","weal"],"correctOption":"wheel"},{"id":"wv-mc2","type":"multiple_choice","prompt":"After rain, the grass is ___","promptTr":"Yağmurdan sonra çimen ___","targetWord":"wet","options":["vet","wet","net"],"correctOption":"wet"},{"id":"wv-ld1","type":"listen_distinguish","prompt":"The sun sets in the ___","promptTr":"Güneş ___ de batar","targetWord":"west","options":["vest","best","west"],"correctOption":"west"}]'::jsonb,
  2, 3
),
(
  'short-i', 'Short I', 'Kısa I', '/ɪ/', '/iː/',
  'Turkish /i/ is longer and tenser. "bit" sounds like "beat", "ship" like "sheep"',
  'Türkçe /i/ daha uzun ve gergin. "bit" kelimesi "beat" gibi çıkar',
  'Open your mouth just a little. Your tongue is high but relaxed. Say it FAST and SHORT — like a quick "ih" not a long "ee".',
  'Ağzını biraz aç. Dilin yukarıda ama gevşek olsun. Hızlı ve kısa söyle — uzun "ii" değil, kısa "ıh" gibi.',
  '[{"english":"bit","errorVersion":"beat","meaning":"a small piece / past tense of bite","meaningTr":"küçük parça / ısırmak geçmiş zaman"},{"english":"ship","errorVersion":"sheep","meaning":"a large boat","meaningTr":"büyük gemi"},{"english":"fit","errorVersion":"feet","meaning":"the right size / to be healthy","meaningTr":"doğru boyut / sağlıklı olmak"},{"english":"live","errorVersion":"leave","meaning":"to be alive / to reside","meaningTr":"yaşamak / oturmak"},{"english":"sit","errorVersion":"seat","meaning":"to lower yourself onto a chair","meaningTr":"sandalyeye oturmak"}]'::jsonb,
  '[{"id":"si-mc1","type":"multiple_choice","prompt":"A large boat that crosses the ocean is a ___","promptTr":"Okyanusları geçen büyük gemi:","targetWord":"ship","options":["sheep","ship","shop"],"correctOption":"ship"},{"id":"si-mc2","type":"multiple_choice","prompt":"When clothes are the right size, they ___","promptTr":"Kıyafetler doğru boyutta olunca ___","targetWord":"fit","options":["feet","feat","fit"],"correctOption":"fit"},{"id":"si-ld1","type":"listen_distinguish","prompt":"Please ___ down on the chair","promptTr":"Lütfen sandalyeye ___","targetWord":"sit","options":["seat","sit","set"],"correctOption":"sit"}]'::jsonb,
  2, 4
),
(
  'consonant-clusters', 'Consonant Clusters', 'Ünsüz Kümeleri', '/str/ /spl/ /spr/', 'added vowel',
  'Turkish (CV language) inserts a vowel between consonants — "street" → "istereet"',
  'Türkçe (CV dili) ünsüzlerin arasına sesli ekler — "street" → "istereet" olur',
  'Keep consonants GLUED together — no vowel sneaks in! Practice slowly: S...T...R then speed up. Hold your breath between sounds.',
  'Ünsüzleri birbirine YAPIŞTIR — araya sesli girmesin! Yavaş başla: S...T...R sonra hızlan. Sesler arasında nefes tutma.',
  '[{"english":"street","errorVersion":"istereet","meaning":"a road in a city","meaningTr":"şehirde yol"},{"english":"splash","errorVersion":"ısplash","meaning":"water hitting something","meaningTr":"suyu bir şeye çarpmak"},{"english":"spring","errorVersion":"ıspring","meaning":"the season after winter","meaningTr":"kış sonrası mevsim (bahar)"},{"english":"strong","errorVersion":"ıstrong","meaning":"having great power","meaningTr":"güçlü"},{"english":"screen","errorVersion":"ıscreen","meaning":"a flat display surface","meaningTr":"düz ekran yüzeyi"}]'::jsonb,
  '[{"id":"cc-mc1","type":"multiple_choice","prompt":"The season after winter — flowers bloom!","promptTr":"Kıştan sonra gelen mevsim — çiçekler açar!","targetWord":"spring","options":["ıspring","spring","spiring"],"correctOption":"spring"},{"id":"cc-mc2","type":"multiple_choice","prompt":"You walk along this in a city","promptTr":"Şehirde boyunca yürüdüğün yer","targetWord":"street","options":["istereet","street","streat"],"correctOption":"street"},{"id":"cc-ld1","type":"listen_distinguish","prompt":"A superhero is very ___","promptTr":"Bir süper kahraman çok ___","targetWord":"strong","options":["ıstrong","strong","strung"],"correctOption":"strong"}]'::jsonb,
  3, 5
),
(
  'final-consonants', 'Final Consonants', 'Son Ünsüzler', '/t/ /d/ /k/ (word-final)', 'added schwa',
  'Turkish adds a vowel sound after final consonants — "cat" → "cate", "bed" → "bede"',
  'Türkçe son ünsüzden sonra sesli ekler — "cat" → "cate", "bed" → "bede" olur',
  'STOP the sound — do not add anything after! Close your mouth fully at the end. Imagine biting the word off cleanly.',
  'Sesi DURDUR — sonrasına hiçbir şey ekleme! Sonda ağzını tam kapat. Kelimeyi temizce kesiyormuş gibi düşün.',
  '[{"english":"cat","errorVersion":"cate","meaning":"a furry pet animal","meaningTr":"tüylü evcil hayvan"},{"english":"bed","errorVersion":"bede","meaning":"furniture for sleeping","meaningTr":"uyku mobilyası (yatak)"},{"english":"back","errorVersion":"backe","meaning":"the rear / return","meaningTr":"arka / geri dönmek"},{"english":"map","errorVersion":"mape","meaning":"a drawing of an area","meaningTr":"harita"},{"english":"hot","errorVersion":"hote","meaning":"high temperature","meaningTr":"yüksek sıcaklık"}]'::jsonb,
  '[{"id":"fc-mc1","type":"multiple_choice","prompt":"You sleep on a ___","promptTr":"___ üzerinde uyursun","targetWord":"bed","options":["bede","bed","bad"],"correctOption":"bed"},{"id":"fc-mc2","type":"multiple_choice","prompt":"A furry animal that says \"meow\"","promptTr":"\"Miyav\" diyen tüylü hayvan","targetWord":"cat","options":["cate","cat","cut"],"correctOption":"cat"},{"id":"fc-ld1","type":"listen_distinguish","prompt":"A drawing that shows roads and cities","promptTr":"Yolları ve şehirleri gösteren çizim","targetWord":"map","options":["mape","map","mop"],"correctOption":"map"}]'::jsonb,
  2, 6
),
(
  'english-r', 'English R', 'İngilizce R', '/r/ (retroflex)', 'r (trilled/tapped)',
  'Turkish /r/ is trilled (tongue vibrates). English /r/ is retroflex — tongue curls back, no vibration.',
  'Türkçe /r/ titreşimlidir (dil titrer). İngilizce /r/ retroflex — dil geriye kıvrılır, titreşim olmaz.',
  'Curl your tongue tip UP and BACK without touching anything. Round your lips slightly. NO tongue vibration — just curl and hold.',
  'Dil ucunu yukarı ve geriye KIVIR, hiçbir şeye değmeden. Dudaklarını hafifçe yuvarla. Dil TİTREŞMEMELİ — sadece kıvır ve tut.',
  '[{"english":"rice","errorVersion":"r̈ice","meaning":"a grain food","meaningTr":"tahıl yiyeceği (pirinç)"},{"english":"rain","errorVersion":"r̈ain","meaning":"water falling from the sky","meaningTr":"gökten düşen su (yağmur)"},{"english":"run","errorVersion":"r̈un","meaning":"to move fast on foot","meaningTr":"ayakla hızlı hareket etmek (koşmak)"},{"english":"road","errorVersion":"r̈oad","meaning":"a path for vehicles","meaningTr":"araçlar için yol"},{"english":"read","errorVersion":"r̈ead","meaning":"to look at text","meaningTr":"metne bakmak (okumak)"}]'::jsonb,
  '[{"id":"er-mc1","type":"visual_mouth","prompt":"For English R, where does your tongue go?","promptTr":"İngilizce R için dilin nereye gider?","targetWord":"run","options":["Tongue vibrates fast","Tongue curls up and back","Tongue touches top teeth"],"correctOption":"Tongue curls up and back"},{"id":"er-mc2","type":"multiple_choice","prompt":"Water falling from the sky:","promptTr":"Gökten düşen su:","targetWord":"rain","options":["lane","rain","rein"],"correctOption":"rain"},{"id":"er-ld1","type":"multiple_choice","prompt":"You cook this grain with curry or stir-fry:","promptTr":"Körili ya da karıştırma kızartmasıyla pişirilen tahıl:","targetWord":"rice","options":["nice","rice","mice"],"correctOption":"rice"}]'::jsonb,
  2, 7
),
(
  'ng-sound', 'NG sound', 'NG sesi', '/ŋ/', '/n/',
  'Turkish does not end words with /ŋ/. "sing" → "sin", "ring" → "rin"',
  'Türkçe kelimeler /ŋ/ ile bitmez. "sing" → "sin", "ring" → "rin" olur',
  'The back of your tongue presses against the soft palate (the back part of the roof of your mouth). Air comes through your NOSE, not mouth. Hold this position!',
  'Dilin arkası damağın yumuşak kısmına (damağın arka bölümü) baskı yapar. Hava ağzından değil BURNUNDAN çıkar. Bu pozisyonu tut!',
  '[{"english":"sing","errorVersion":"sin","meaning":"to make music with your voice","meaningTr":"sesle müzik yapmak (şarkı söylemek)"},{"english":"ring","errorVersion":"rin","meaning":"a circular piece of jewellery","meaningTr":"yuvarlak mücevher (yüzük)"},{"english":"long","errorVersion":"lon","meaning":"great in length","meaningTr":"uzun"},{"english":"king","errorVersion":"kin","meaning":"a male ruler","meaningTr":"erkek hükümdar (kral)"},{"english":"song","errorVersion":"son","meaning":"a piece of music","meaningTr":"müzik parçası (şarkı)"}]'::jsonb,
  '[{"id":"ng-mc1","type":"multiple_choice","prompt":"You wear this circle on your finger:","promptTr":"Parmağında taktığın bu daire:","targetWord":"ring","options":["rin","ring","rink"],"correctOption":"ring"},{"id":"ng-mc2","type":"multiple_choice","prompt":"A male ruler with a crown:","promptTr":"Taçlı erkek hükümdar:","targetWord":"king","options":["kin","king","kind"],"correctOption":"king"},{"id":"ng-ld1","type":"listen_distinguish","prompt":"You love to ___ your favourite song!","promptTr":"Sevdiğin şarkıyı ___ çok seviyorsun!","targetWord":"sing","options":["sin","sing","sink"],"correctOption":"sing"}]'::jsonb,
  2, 8
),
(
  'ae-vs-uh', 'Short A /æ/ vs Short U /ʌ/', 'Kısa A /æ/ vs Kısa U /ʌ/', '/æ/ vs /ʌ/', '/a/',
  'Turkish /a/ maps to both /æ/ and /ʌ/ — "cat" and "cut" sound identical to Turkish ears',
  'Türkçe /a/ hem /æ/ hem /ʌ/ yerine geçer — Türk kulağına "cat" ve "cut" aynı duyulur',
  'For /æ/ (cat): open your mouth wide, jaw drops, tongue is low and flat. For /ʌ/ (cut): mouth is less open, tongue is mid-central — like a short grunt "uh".',
  '/æ/ (cat) için: ağzını geniş aç, çene aşağı iner, dil aşağıda ve düzdür. /ʌ/ (cut) için: ağız daha az açık, dil orta-merkezdedir — kısa "ah" gibi.',
  '[{"english":"cat","errorVersion":"cut","meaning":"a pet animal (meow)","meaningTr":"evcil hayvan (miyav)"},{"english":"bad","errorVersion":"bud","meaning":"not good","meaningTr":"kötü"},{"english":"hat","errorVersion":"hut","meaning":"a head covering","meaningTr":"başlık"},{"english":"man","errorVersion":"mun","meaning":"an adult male","meaningTr":"yetişkin erkek"},{"english":"ban","errorVersion":"bun","meaning":"to forbid something","meaningTr":"bir şeyi yasaklamak"}]'::jsonb,
  '[{"id":"ae-uh-mc1","type":"multiple_choice","prompt":"The animal that says \"meow\" — is it \"cat\" or \"cut\"?","promptTr":"\"Miyav\" diyen hayvan — \"cat\" mi \"cut\" mi?","targetWord":"cat","options":["cut","cat","cot"],"correctOption":"cat"},{"id":"ae-uh-mc2","type":"multiple_choice","prompt":"You wear this on your head — is it \"hat\" or \"hut\"?","promptTr":"Başına taktığın şey — \"hat\" mi \"hut\" mu?","targetWord":"hat","options":["hut","hat","hid"],"correctOption":"hat"},{"id":"ae-uh-ld1","type":"listen_distinguish","prompt":"The opposite of \"good\" — is it \"bad\" or \"bud\"?","promptTr":"\"İyi''nin zıttı — \"bad\" mi \"bud\" mu?","targetWord":"bad","options":["bud","bad","bed"],"correctOption":"bad"}]'::jsonb,
  2, 9
)
ON CONFLICT (id) DO UPDATE SET
  trap_name = EXCLUDED.trap_name,
  trap_name_tr = EXCLUDED.trap_name_tr,
  target_sound_ipa = EXCLUDED.target_sound_ipa,
  error_sound_ipa = EXCLUDED.error_sound_ipa,
  description = EXCLUDED.description,
  description_tr = EXCLUDED.description_tr,
  mouth_position = EXCLUDED.mouth_position,
  mouth_position_tr = EXCLUDED.mouth_position_tr,
  minimal_pairs = EXCLUDED.minimal_pairs,
  exercises = EXCLUDED.exercises,
  difficulty = EXCLUDED.difficulty,
  sort_order = EXCLUDED.sort_order;


-- ────────────────────────────────────────────────────────────
-- 5. MASCOTS TABLE
-- ────────────────────────────────────────────────────────────

INSERT INTO mascots (id, name, name_tr, emoji, unlock_type, unlock_value, sort_order) VALUES
('mimi_cat', 'Mimi', 'Mimi', '🐱', 'level', 1, 1)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_tr = EXCLUDED.name_tr,
  emoji = EXCLUDED.emoji,
  unlock_type = EXCLUDED.unlock_type,
  unlock_value = EXCLUDED.unlock_value,
  sort_order = EXCLUDED.sort_order;


-- ────────────────────────────────────────────────────────────
-- 6. BADGES_DEF TABLE (30 badges)
-- ────────────────────────────────────────────────────────────

INSERT INTO badges_def (id, name, name_tr, description, description_tr, icon, category, requirement_type, requirement_value, sort_order) VALUES
-- Streak badges
('streak_3',     '3 Day Streak',       '3 Günlük Seri',       'Login 3 days in a row',                      '3 gün üst üste giriş yaptın',                       'fire',    'streak',      'streak',               3,   1),
('streak_7',     'Week Warrior',       'Hafta Savaşçısı',     'Login 7 days in a row',                      '7 gün üst üste giriş yaptın',                       'fire',    'streak',      'streak',               7,   2),
('streak_30',    'Monthly Master',     'Aylık Usta',          'Login 30 days in a row',                     '30 gün üst üste giriş yaptın',                      'fire',    'streak',      'streak',              30,   3),
('streak_100',   'Century Champion',   'Asır Şampiyonu',      'Login 100 days in a row',                    '100 gün üst üste giriş yaptın',                     'fire',    'streak',      'streak',             100,   4),

-- Learning badges - Words
('words_10',     'Word Explorer',      'Kelime Kaşifi',       'Learn 10 words',                             '10 kelime öğrendin',                                 'book',    'learning',    'words',               10,   5),
('words_50',     'Word Collector',     'Kelime Koleksiyoncusu','Learn 50 words',                             '50 kelime öğrendin',                                 'book',    'learning',    'words',               50,   6),
('words_100',    'Word Master',        'Kelime Ustası',       'Learn 100 words',                            '100 kelime öğrendin',                                'reading', 'learning',    'words',              100,   7),
('words_500',    'Word Genius',        'Kelime Dahisi',       'Learn 500 words',                            '500 kelime öğrendin',                                'library', 'learning',    'words',              500,   8),

-- Learning badges - Games
('games_5',      'Game Starter',       'Oyun Başlangıcı',     'Play 5 games',                               '5 oyun oynadın',                                     'games',   'learning',    'games',                5,   9),
('games_25',     'Game Player',        'Oyuncu',              'Play 25 games',                              '25 oyun oynadın',                                    'games',   'learning',    'games',               25,  10),
('games_100',    'Game Champion',      'Oyun Şampiyonu',      'Play 100 games',                             '100 oyun oynadın',                                   'trophy',  'learning',    'games',              100,  11),

-- Learning badges - Videos
('videos_5',     'Video Viewer',       'Video İzleyici',      'Watch 5 videos',                             '5 video izledin',                                    'video',   'learning',    'videos',               5,  12),
('videos_25',    'Video Fan',          'Video Hayranı',       'Watch 25 videos',                            '25 video izledin',                                   'video',   'learning',    'videos',              25,  13),
('videos_100',   'Video Expert',       'Video Uzmanı',        'Watch 100 videos',                           '100 video izledin',                                  'video',   'learning',    'videos',             100,  14),

-- Achievement badges
('level_5',      'Rising Star',        'Yükselen Yıldız',     'Reach level 5',                              '5. seviyeye ulaştın',                                'star',    'achievement', 'level',                5,  15),
('level_10',     'Shining Star',       'Parlayan Yıldız',     'Reach level 10',                             '10. seviyeye ulaştın',                               'star',    'achievement', 'level',               10,  16),
('level_25',     'Superstar',          'Süperyıldız',         'Reach level 25',                             '25. seviyeye ulaştın',                               'star',    'achievement', 'level',               25,  17),
('level_50',     'Legend',             'Efsane',              'Reach level 50',                             '50. seviyeye ulaştın',                               'trophy',  'achievement', 'level',               50,  18),

-- Special badges
('weekly_starter',   'Weekly Starter',     'Haftalık Başlangıç',       'Claim 5 daily rewards',                         '5 günlük ödül aldın',                             'star',    'special',  'daily',                5,  19),
('week_champion',    'Week Champion',      'Hafta Şampiyonu',          'Claim 7 daily rewards in a row',                '7 günlük ödülü üst üste aldın',                   'trophy',  'special',  'daily',                7,  20),
('first_favorite',   'First Favorite',     'İlk Favori',              'Add your first favorite',                       'İlk favorini ekledin',                            'heart',   'special',  'favorites',            1,  21),
('premium_member',   'Premium Member',     'Premium Üye',             'Become a premium member',                       'Premium üye oldun',                               'trophy',  'special',  'premium',              1,  22),

-- New learning badges
('first_story',      'Story Starter',      'Hikaye Başlangıcı',       'Read your first story',                         'İlk hikayeni okudun',                             'stories', 'learning', 'stories',              1,  23),
('story_master',     'Story Master',       'Hikaye Ustası',           'Read 10 stories',                               '10 hikaye okudun',                                'stories', 'learning', 'stories',             10,  24),
('dialogue_star',    'Dialogue Star',      'Diyalog Yıldızı',        'Complete 5 dialogue exercises',                  '5 diyalog alıştırması tamamladın',                'mic',     'learning', 'dialogues',            5,  25),
('pronunciation_pro','Pronunciation Pro',  'Telaffuz Ustası',         'Score 100% on 3 pronunciation exercises',        '3 telaffuz alıştırmasında tam puan aldın',        'mic',     'learning', 'perfect_pronunciation', 3,  26),

-- Social badges
('first_friend',     'First Friend',       'İlk Arkadaş',            'Add your first friend',                         'İlk arkadaşını ekledin',                          'heart',   'social',   'friends',              1,  27),
('top_leaderboard',  'Top 10',             'İlk 10',                 'Reach top 10 in weekly leaderboard',            'Haftalık sıralamada ilk 10''a girdin',            'trophy',  'social',   'leaderboard',         10,  28),

-- Time-based special badges
('early_bird',       'Early Bird',         'Erken Kuş',              'Complete a lesson before 9am',                  'Sabah 9''dan önce bir ders tamamladın',           'star',    'special',  'early_lesson',         1,  29),
('night_owl',        'Night Owl',          'Gece Kuşu',              'Complete a lesson after 9pm',                   'Gece 9''dan sonra bir ders tamamladın',           'star',    'special',  'night_lesson',         1,  30),
('weekend_warrior',  'Weekend Warrior',    'Hafta Sonu Savaşçısı',   'Complete lessons on both Saturday and Sunday',  'Hem Cumartesi hem Pazar ders tamamladın',          'trophy',  'special',  'weekend_lesson',       2,  31)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_tr = EXCLUDED.name_tr,
  description = EXCLUDED.description,
  description_tr = EXCLUDED.description_tr,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  requirement_type = EXCLUDED.requirement_type,
  requirement_value = EXCLUDED.requirement_value,
  sort_order = EXCLUDED.sort_order;

-- ============================================================
-- SEED COMPLETE
-- ============================================================
