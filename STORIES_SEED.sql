-- ============================================================
-- MinesMinis — STORIES SEED DATA
-- 5 production-quality bilingual stories for children ages 4-9
-- Run AFTER supabase-migration.sql and MISSING_TABLES.sql
-- Safe to re-run: uses ON CONFLICT DO NOTHING
-- ============================================================

-- ─── STORY 1: Mimi ve Kayıp Yıldız / Mimi and the Lost Star ─────────────────

DO $$
DECLARE
  s1_id uuid := 'a1000000-0000-0000-0000-000000000001';
  sc1_1 uuid := 'b1000000-0000-0000-0001-000000000001';
  sc1_2 uuid := 'b1000000-0000-0000-0001-000000000002';
  sc1_3 uuid := 'b1000000-0000-0000-0001-000000000003';
  sc1_4 uuid := 'b1000000-0000-0000-0001-000000000004';
  sc1_5 uuid := 'b1000000-0000-0000-0001-000000000005';
  sc1_6 uuid := 'b1000000-0000-0000-0001-000000000006';
BEGIN

INSERT INTO public.stories
  (id, title, title_tr, summary, summary_tr, cover_scene, target_age,
   characters, location, theme, moral, moral_tr, published)
VALUES (
  s1_id,
  'Mimi and the Lost Star',
  'Mimi ve Kayıp Yıldız',
  'A small star falls from the sky and Mimi the cat must help it find its way home through a magical forest.',
  'Küçük bir yıldız gökten düşer ve kedi Mimi, onu büyülü ormandan geçerek evine döndürmelidir.',
  'forest-clearing',
  ARRAY[4, 7],
  ARRAY['Mimi', 'Stella the Star', 'Breezy the Wind'],
  'Enchanted Forest',
  'Friendship and Courage',
  'True friends help each other find their way home.',
  'Gerçek arkadaşlar birbirlerinin evine giden yolu bulmasına yardımcı olur.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.story_scenes
  (id, story_id, scene_order, text, text_tr, location, characters, mood,
   camera_angle, sound_effect, animation_cue, vocabulary, choices)
VALUES
(
  sc1_1, s1_id, 1,
  'One quiet night, Mimi the little cat was sitting in the forest clearing, watching the stars twinkle above. Suddenly — WHOOSH! — a tiny golden star came tumbling down from the sky and landed right in front of her with a soft glow.',
  'Sessiz bir gecede, küçük kedi Mimi orman açıklığında oturmuş, yukarıda parlayan yıldızlara bakıyordu. Birden — VIIŞ! — küçücük altın bir yıldız gökten aşağı yuvarlanarak tam önüne inerken yumuşak bir ışıltıyla parladı.',
  'Enchanted Forest Clearing',
  ARRAY['Mimi'],
  'mysterious',
  'wide',
  'whoosh',
  'star-falling',
  '[
    {"word": "twinkle", "word_tr": "parlamak", "emoji": "✨"},
    {"word": "tumbling", "word_tr": "yuvarlanmak", "emoji": "🌀"},
    {"word": "glow",    "word_tr": "ışıltı",     "emoji": "💡"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc1_2, s1_id, 2,
  '"Oh no!" squeaked a tiny voice. It was the star! Her name was Stella. "I was dancing too fast and fell off the sky! Now I cannot find my way back home." Mimi looked up at the thousands of stars and felt a little worried. But she smiled bravely and said, "Do not worry, Stella. I will help you!"',
  '"Ah hayır!" diye seslendi minik bir ses. Yıldızdı bu! Adı Stella''ydı. "Çok hızlı dans ediyordum ve gökyüzünden düştüm! Artık eve giden yolu bulamıyorum." Mimi binlerce yıldıza baktı ve biraz endişelendi. Ama cesurca gülümsedi ve dedi ki: "Merak etme, Stella. Sana yardım edeceğim!"',
  'Enchanted Forest Clearing',
  ARRAY['Mimi', 'Stella the Star'],
  'worried',
  'close-up',
  'magic-chime',
  'star-sparkle',
  '[
    {"word": "squeaked", "word_tr": "ciyakladı",    "emoji": "🗣️"},
    {"word": "bravely",  "word_tr": "cesurca",      "emoji": "🦁"},
    {"word": "worried",  "word_tr": "endişeli",     "emoji": "😟"}
  ]'::jsonb,
  '[
    {"text": "Ask the wise owl for directions", "text_tr": "Bilge baykuştan yol sor", "next_scene_id": "b1000000-0000-0000-0001-000000000003"},
    {"text": "Climb the tallest tree to see better", "text_tr": "Daha iyi görmek için en uzun ağaca tırman", "next_scene_id": "b1000000-0000-0000-0001-000000000003"}
  ]'::jsonb
),
(
  sc1_3, s1_id, 3,
  'Mimi carried little Stella through the deep, dark forest. The trees were so tall they tickled the clouds! Glowing mushrooms lit the path like tiny lanterns. Then they heard a friendly hoot — it was Oliver the Owl, sitting on a mossy branch. "To return a star to the sky," said Oliver wisely, "you must climb to the very top of Starlight Mountain!"',
  'Mimi, küçük Stella''yı derin, karanlık ormandan taşıdı. Ağaçlar o kadar uzundu ki bulutları gıdıklıyorlardı! Parlayan mantarlar yolu minik fenerler gibi aydınlatıyordu. Sonra dostane bir "Hu hu" sesi duydular — yosunlu bir dalda oturan Oliver Baykuş''tu bu. "Bir yıldızı gökyüzüne geri göndermek için," dedi Oliver bilgece, "Yıldız Işığı Dağı''nın ta tepesine tırmanmalısın!"',
  'Deep Forest',
  ARRAY['Mimi', 'Stella the Star', 'Oliver Owl'],
  'adventurous',
  'medium',
  'owl-hoot',
  'leaves-rustle',
  '[
    {"word": "lanterns",  "word_tr": "fenerler",    "emoji": "🏮"},
    {"word": "mossy",     "word_tr": "yosunlu",     "emoji": "🌿"},
    {"word": "wisely",    "word_tr": "bilgece",     "emoji": "🦉"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc1_4, s1_id, 4,
  'Mimi and Stella climbed and climbed. The mountain was steep and the wind was cold. Stella was getting dimmer — she was losing her light! "I am so tired," she whispered sadly. Mimi held her tight and said, "You are the brightest star I have ever seen. Just a little more!" And as Mimi said those kind words, Stella began to glow stronger.',
  'Mimi ve Stella tırmandı ve tırmandı. Dağ dik ve rüzgar soğuktu. Stella''nın ışığı giderek sönüyordu — ışığını kaybediyordu! "Çok yoruldum," diye fısıldadı üzgünce. Mimi onu sıkıca tuttu ve dedi ki: "Sen gördüğüm en parlak yıldızsın. Biraz daha!" Ve Mimi bu nazik sözleri söylerken Stella daha güçlü parlamaya başladı.',
  'Mountain Path',
  ARRAY['Mimi', 'Stella the Star'],
  'determined',
  'wide',
  'wind-blow',
  'star-pulse',
  '[
    {"word": "steep",    "word_tr": "dik",         "emoji": "⛰️"},
    {"word": "dimmer",   "word_tr": "daha sönük",  "emoji": "🔅"},
    {"word": "brightest","word_tr": "en parlak",   "emoji": "⭐"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc1_5, s1_id, 5,
  'At last they reached the very top! The whole sky stretched out before them, glittering with a million stars. "This is where you belong!" said Mimi, gently tossing Stella up into the sky. Stella shot upward like a golden arrow — higher, higher, higher — until she found her perfect spot right in the middle of the sky.',
  'Sonunda ta tepesine ulaştılar! Tüm gökyüzü önlerinde uzanıyordu, milyonlarca yıldızla parıl parıl. "İşte burası senin yerin!" dedi Mimi, Stella''yı nazikçe gökyüzüne fırlatarak. Stella altın bir ok gibi yukarı fırladı — daha yükseğe, daha yükseğe, daha yükseğe — ta ki gökyüzünün tam ortasındaki mükemmel yerini bulana dek.',
  'Mountain Peak',
  ARRAY['Mimi', 'Stella the Star'],
  'joyful',
  'wide',
  'magic-sparkle',
  'star-launch',
  '[
    {"word": "glittering","word_tr": "parıldayan",  "emoji": "✨"},
    {"word": "gently",    "word_tr": "nazikçe",     "emoji": "🤲"},
    {"word": "belong",    "word_tr": "ait olmak",   "emoji": "🏠"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc1_6, s1_id, 6,
  '"Thank you, Mimi!" Stella''s voice drifted down like tiny bells. "Whenever you feel alone at night, look up — I will always be there, shining just for you!" Mimi smiled and looked up at the sky. And there, twinkling brighter than all the others, was her new best friend — Stella the Star. From that night on, Mimi never felt alone again.',
  '"Teşekkür ederim, Mimi!" Stella''nın sesi minik çanlar gibi aşağıya süzüldü. "Geceleri yalnız hissettiğinde, yukarı bak — ben her zaman orada olacağım, sadece senin için parlayacağım!" Mimi gülümsedi ve gökyüzüne baktı. Ve orada, diğerlerinden daha parlak ışıldayan, yeni en iyi arkadaşı vardı — Yıldız Stella. O geceden itibaren Mimi artık hiç yalnız hissetmedi.',
  'Mountain Peak',
  ARRAY['Mimi'],
  'peaceful',
  'wide',
  'gentle-music',
  'stars-appear',
  '[
    {"word": "drifted",  "word_tr": "süzüldü",    "emoji": "🌬️"},
    {"word": "shining",  "word_tr": "parlayan",   "emoji": "⭐"},
    {"word": "forever",  "word_tr": "sonsuza dek","emoji": "♾️"}
  ]'::jsonb,
  '[]'::jsonb
);

END $$;


-- ─── STORY 2: Cesur Balık Finn / Finn the Brave Fish ────────────────────────

DO $$
DECLARE
  s2_id uuid := 'a1000000-0000-0000-0000-000000000002';
  sc2_1 uuid := 'b1000000-0000-0000-0002-000000000001';
  sc2_2 uuid := 'b1000000-0000-0000-0002-000000000002';
  sc2_3 uuid := 'b1000000-0000-0000-0002-000000000003';
  sc2_4 uuid := 'b1000000-0000-0000-0002-000000000004';
  sc2_5 uuid := 'b1000000-0000-0000-0002-000000000005';
BEGIN

INSERT INTO public.stories
  (id, title, title_tr, summary, summary_tr, cover_scene, target_age,
   characters, location, theme, moral, moral_tr, published)
VALUES (
  s2_id,
  'Finn the Brave Fish',
  'Cesur Balık Finn',
  'Little Finn is afraid of the dark deep ocean, but when his friends need help, he discovers a courage he never knew he had.',
  'Küçük Finn karanlık derin okyanusta olmaktan korkar, ama arkadaşları yardıma ihtiyaç duyduğunda, hiç bilmediği bir cesaret keşfeder.',
  'ocean-shore',
  ARRAY[4, 6],
  ARRAY['Finn the Fish', 'Pearl the Turtle', 'Captain Crab'],
  'Coral Kingdom',
  'Courage and Friendship',
  'Being brave does not mean you are not scared — it means doing it anyway!',
  'Cesur olmak korkmamak değildir — yine de yapmaktır!',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.story_scenes
  (id, story_id, scene_order, text, text_tr, location, characters, mood,
   camera_angle, sound_effect, animation_cue, vocabulary, choices)
VALUES
(
  sc2_1, s2_id, 1,
  'Deep in the warm, colorful Coral Kingdom lived a small blue fish named Finn. He loved playing among the pink corals and chasing bubbles. But there was one thing Finn was afraid of — the dark water far, far below. "What if there are monsters down there?" he would whisper to himself.',
  'Sıcak, renkli Mercan Krallığı''nın derinliklerinde Finn adında küçük mavi bir balık yaşıyordu. Pembe mercanlar arasında oynamayı ve balonları kovalamayı severdi. Ama Finn''in korktuğu bir şey vardı — çok çok aşağıdaki karanlık su. "Ya orada canavarlar varsa?" diye fısıldardı kendi kendine.',
  'Coral Kingdom',
  ARRAY['Finn the Fish'],
  'cozy',
  'wide',
  'ocean-waves',
  'fish-swim',
  '[
    {"word": "coral",    "word_tr": "mercan",     "emoji": "🪸"},
    {"word": "bubbles",  "word_tr": "baloncuklar","emoji": "🫧"},
    {"word": "whisper",  "word_tr": "fısıldamak", "emoji": "🤫"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc2_2, s2_id, 2,
  'One morning, Finn''s best friend Pearl the sea turtle swam up to him looking very worried. "Finn! Our friend Captain Crab fell into the Deep Dark Trench! He is stuck and cannot swim back up. We need someone brave to swim down and help him!" All the other fish looked at each other and shook their heads. The Deep Dark Trench was too scary.',
  'Bir sabah, Finn''in en iyi arkadaşı deniz kaplumbağası Pearl çok endişeli bir ifadeyle yüzerek yanına geldi. "Finn! Arkadaşımız Kaptan Yengeç Derin Karanlık Çukur''a düştü! Sıkışıp kaldı ve yukarı yüzemiyor. Birinin cesurca aşağı dalıp ona yardım etmesi gerekiyor!" Diğer balıkların hepsi birbirlerine baktı ve başlarını salladı. Derin Karanlık Çukur çok korkutucuydu.',
  'Coral Kingdom',
  ARRAY['Finn the Fish', 'Pearl the Turtle'],
  'worried',
  'medium',
  'ocean-current',
  'ripple',
  '[
    {"word": "trench",   "word_tr": "çukur",      "emoji": "🕳️"},
    {"word": "stuck",    "word_tr": "sıkışmış",   "emoji": "😰"},
    {"word": "brave",    "word_tr": "cesur",      "emoji": "🦁"}
  ]'::jsonb,
  '[
    {"text": "Swim down to help Captain Crab!", "text_tr": "Kaptan Yengeç''e yardım etmek için dal!", "next_scene_id": "b1000000-0000-0000-0002-000000000003"},
    {"text": "Ask Pearl to come with you", "text_tr": "Pearl''den seninle gelmesini iste", "next_scene_id": "b1000000-0000-0000-0002-000000000003"}
  ]'::jsonb
),
(
  sc2_3, s2_id, 3,
  'Finn''s heart was beating very fast. He was SO scared. But he looked at Pearl''s worried face and took a deep breath. "I will go," he said in a small but steady voice. "Being brave does not mean you are not scared. It means doing it anyway!" And with that, he plunged into the dark water below.',
  'Finn''in kalbi çok hızlı atıyordu. ÇOK korkuyordu. Ama Pearl''in endişeli yüzüne baktı ve derin bir nefes aldı. "Ben gideceğim," dedi küçük ama kararlı bir sesle. "Cesur olmak korkmamak değildir. Yine de yapmaktır!" Ve bununla birlikte, aşağıdaki karanlık suya daldı.',
  'Ocean Shore',
  ARRAY['Finn the Fish', 'Pearl the Turtle'],
  'determined',
  'close-up',
  'splash',
  'dive-down',
  '[
    {"word": "steady",   "word_tr": "kararlı",    "emoji": "💪"},
    {"word": "plunged",  "word_tr": "daldı",      "emoji": "🤿"},
    {"word": "courage",  "word_tr": "cesaret",    "emoji": "🌟"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc2_4, s2_id, 4,
  'Down in the deep dark water, Finn could barely see. But then — he noticed something wonderful! The deeper he swam, the more he saw tiny glowing creatures lighting up the dark like a million fireflies. It was the most beautiful thing he had ever seen! And there was Captain Crab, his claw stuck under a rock. "Finn! You came!" cried the Captain.',
  'Derin karanlık suda Finn neredeyse hiç göremiyordu. Ama sonra — harika bir şey fark etti! Ne kadar derine yüzerse, karanlığı milyonlarca ateşböceği gibi aydınlatan o kadar çok minik parlayan yaratık görüyordu. Hayatında gördüğü en güzel şeydi bu! Ve işte Kaptan Yengeç, kıskacı bir kayanın altında sıkışmış halde duruyordu. "Finn! Geldin!" diye bağırdı Kaptan.',
  'Ocean Deep',
  ARRAY['Finn the Fish', 'Captain Crab'],
  'magical',
  'wide',
  'deep-ocean',
  'glow-appear',
  '[
    {"word": "noticed",  "word_tr": "fark etti",  "emoji": "👀"},
    {"word": "glowing",  "word_tr": "parlayan",   "emoji": "💡"},
    {"word": "creatures","word_tr": "yaratıklar", "emoji": "🦑"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc2_5, s2_id, 5,
  'Together, Finn and the glowing creatures pushed the rock, and Captain Crab was free! They swam back up to the coral kingdom where everyone was waiting. Pearl hugged them both. "You were so brave, Finn!" she said. Finn smiled. "The deep water is not scary at all — it is full of wonderful things! Next time, I will show you all!" And he did.',
  'Finn ve parlayan yaratıklar birlikte kayayı ittiler ve Kaptan Yengeç özgürdü! Herkesin beklediği mercan krallığına geri yüzdüler. Pearl ikisini de kucakladı. "Çok cesurdan, Finn!" dedi. Finn gülümsedi. "Derin su hiç de korkutucu değil — harika şeylerle dolu! Bir dahaki sefere, hepsini size göstereceğim!" Ve gerçekten gösterdi.',
  'Coral Kingdom',
  ARRAY['Finn the Fish', 'Pearl the Turtle', 'Captain Crab'],
  'joyful',
  'wide',
  'celebration',
  'bubbles-rise',
  '[
    {"word": "free",     "word_tr": "özgür",      "emoji": "🕊️"},
    {"word": "hugged",   "word_tr": "kucakladı",  "emoji": "🤗"},
    {"word": "wonderful","word_tr": "harika",     "emoji": "🌈"}
  ]'::jsonb,
  '[]'::jsonb
);

END $$;


-- ─── STORY 3: Nova''nın Uzay Yolculuğu / Nova's Space Journey ────────────────

DO $$
DECLARE
  s3_id uuid := 'a1000000-0000-0000-0000-000000000003';
  sc3_1 uuid := 'b1000000-0000-0000-0003-000000000001';
  sc3_2 uuid := 'b1000000-0000-0000-0003-000000000002';
  sc3_3 uuid := 'b1000000-0000-0000-0003-000000000003';
  sc3_4 uuid := 'b1000000-0000-0000-0003-000000000004';
  sc3_5 uuid := 'b1000000-0000-0000-0003-000000000005';
BEGIN

INSERT INTO public.stories
  (id, title, title_tr, summary, summary_tr, cover_scene, target_age,
   characters, location, theme, moral, moral_tr, published)
VALUES (
  s3_id,
  'Nova''s Space Journey',
  'Nova''nın Uzay Yolculuğu',
  'Nova the little robot explorer blasts off from the space station and discovers that the universe is full of new friends waiting to be met.',
  'Küçük robot kaşif Nova, uzay istasyonundan fırlar ve evrenin tanışmayı bekleyen yeni arkadaşlarla dolu olduğunu keşfeder.',
  'space-station',
  ARRAY[5, 9],
  ARRAY['Nova the Robot', 'Cosmo the Alien', 'Blink the Meteor'],
  'Star Station Alpha',
  'Curiosity and Kindness',
  'The best discoveries are made with an open heart and a curious mind.',
  'En iyi keşifler açık bir kalp ve meraklı bir zihinle yapılır.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.story_scenes
  (id, story_id, scene_order, text, text_tr, location, characters, mood,
   camera_angle, sound_effect, animation_cue, vocabulary, choices)
VALUES
(
  sc3_1, s3_id, 1,
  'Nova the little robot lived on Star Station Alpha, high above planet Earth. Every day she looked out the porthole window at the endless stars and wondered: "What is out there? What amazing things are waiting to be found?" Today was the day she would finally find out. Her rocket was ready. 3... 2... 1... BLAST OFF!',
  'Küçük robot Nova, Dünya gezegeninin çok üzerindeki Yıldız İstasyonu Alfa''da yaşıyordu. Her gün lomboz penceresinden sonsuz yıldızlara bakarak merak ederdi: "Orada ne var? Keşfedilmeyi bekleyen ne muhteşem şeyler var?" Bugün sonunda öğreneceği gündü. Roketi hazırdı. 3... 2... 1... KALKIŞ!',
  'Space Station',
  ARRAY['Nova the Robot'],
  'excited',
  'wide',
  'rocket-launch',
  'countdown',
  '[
    {"word": "porthole",  "word_tr": "lomboz",     "emoji": "🔭"},
    {"word": "endless",   "word_tr": "sonsuz",     "emoji": "♾️"},
    {"word": "blast off", "word_tr": "kalkış",     "emoji": "🚀"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc3_2, s3_id, 2,
  'Nova zoomed past colorful nebulas that looked like giant cotton candy clouds! She spotted a bright blue asteroid and landed on it carefully. On the asteroid she found something surprising — a little green alien sitting all alone, looking very sad. "Hello!" said Nova. "My name is Nova. What is your name?" The alien''s eyes went wide. Nobody had ever talked to him before.',
  'Nova renkli bulutsuların yanından geçerek uçtu — bunlar dev pamuk şekeri bulutlarına benziyordu! Parlak mavi bir asteroid gördü ve dikkatlice üzerine indi. Asteroidin üzerinde şaşırtıcı bir şey buldu — tek başına oturan, çok üzgün görünen küçük yeşil bir uzaylı. "Merhaba!" dedi Nova. "Benim adım Nova. Senin adın ne?" Uzaylının gözleri açıldı. Daha önce kimse onunla konuşmamıştı.',
  'Space Asteroid',
  ARRAY['Nova the Robot', 'Cosmo the Alien'],
  'curious',
  'medium',
  'space-ambient',
  'float',
  '[
    {"word": "nebula",   "word_tr": "bulutsu",    "emoji": "🌌"},
    {"word": "asteroid", "word_tr": "asteroid",   "emoji": "☄️"},
    {"word": "alien",    "word_tr": "uzaylı",     "emoji": "👾"}
  ]'::jsonb,
  '[
    {"text": "Invite Cosmo to explore together!", "text_tr": "Cosmo''yu birlikte keşfetmeye davet et!", "next_scene_id": "b1000000-0000-0000-0003-000000000003"},
    {"text": "Share your snacks with the sad alien", "text_tr": "Üzgün uzaylıyla atıştırmalıklarını paylaş", "next_scene_id": "b1000000-0000-0000-0003-000000000003"}
  ]'::jsonb
),
(
  sc3_3, s3_id, 3,
  '"I am Cosmo," said the little alien shyly. "I have been alone here for a very long time. All the other asteroids drifted away." Nova smiled with her glowing eyes. "Then come with me! The universe is huge and full of amazing things. Let us explore it together!" Cosmo had never had a friend before. He reached out his tiny green hand, and Nova took it.',
  '"Ben Cosmo''yum," dedi küçük uzaylı utangaçça. "Çok uzun zamandır burada yalnız bekliyorum. Diğer tüm asteroidler sürüklendi gitti." Nova parlayan gözleriyle gülümsedi. "O zaman benimle gel! Evren çok büyük ve harika şeylerle dolu. Birlikte keşfedelim!" Cosmo''nun daha önce hiç arkadaşı olmamıştı. Küçük yeşil elini uzattı ve Nova onu tuttu.',
  'Space Asteroid',
  ARRAY['Nova the Robot', 'Cosmo the Alien'],
  'warm',
  'close-up',
  'gentle-ping',
  'hand-shake',
  '[
    {"word": "shyly",    "word_tr": "utangaçça",  "emoji": "😊"},
    {"word": "drifted",  "word_tr": "sürüklendi", "emoji": "🌊"},
    {"word": "explore",  "word_tr": "keşfetmek",  "emoji": "🗺️"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc3_4, s3_id, 4,
  'Nova and Cosmo flew through a spectacular rainbow nebula. Inside, the colors danced like music you could see! They met a tiny meteor named Blink who wanted to show them the most beautiful view in the galaxy. He led them to the edge of a spiral galaxy where a billion stars swirled around like a glowing whirlpool.',
  'Nova ve Cosmo muhteşem bir gökkuşağı bulutsusu içinden uçtu. İçeride renkler görebileceğiniz bir müzik gibi dans ediyordu! Onlara galaksideki en güzel manzarayı göstermek isteyen Blink adında küçük bir meteora tanıştılar. Blink onları, milyar yıldızın parlayan bir girdap gibi döndüğü sarmal galaksinin kenarına götürdü.',
  'Space Nebula',
  ARRAY['Nova the Robot', 'Cosmo the Alien', 'Blink the Meteor'],
  'magical',
  'wide',
  'cosmic-hum',
  'galaxy-spin',
  '[
    {"word": "spectacular","word_tr": "muhteşem",  "emoji": "🤩"},
    {"word": "spiral",    "word_tr": "sarmal",     "emoji": "🌀"},
    {"word": "whirlpool", "word_tr": "girdap",     "emoji": "💫"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc3_5, s3_id, 5,
  '"This is the most beautiful thing I have ever seen," whispered Nova. "And you know what the most amazing thing in the universe is?" said Blink. "It is not the stars or the nebulas. It is friendship — finding someone who makes even the biggest universe feel like home." Nova looked at Cosmo. Cosmo looked at Nova. They both knew it was true. The universe was their home now, and they had each other.',
  '"Bu hayatımda gördüğüm en güzel şey," diye fısıldadı Nova. "Peki evrende en muhteşem şeyin ne olduğunu biliyor musun?" dedi Blink. "Yıldızlar ya da bulutsuların değil. Arkadaşlık — en büyük evreni bile ev gibi hissettiren birini bulmak." Nova Cosmo''ya baktı. Cosmo Nova''ya baktı. İkisi de bunun doğru olduğunu biliyordu. Evren artık onların eviydi ve birbirlerini vardı.',
  'Space Nebula',
  ARRAY['Nova the Robot', 'Cosmo the Alien', 'Blink the Meteor'],
  'peaceful',
  'wide',
  'soft-chime',
  'stars-twinkle',
  '[
    {"word": "universe",  "word_tr": "evren",      "emoji": "🌌"},
    {"word": "friendship","word_tr": "arkadaşlık", "emoji": "🤝"},
    {"word": "amazing",   "word_tr": "muhteşem",   "emoji": "🌟"}
  ]'::jsonb,
  '[]'::jsonb
);

END $$;


-- ─── STORY 4: Çöldeki Sır / The Desert Secret ───────────────────────────────

DO $$
DECLARE
  s4_id uuid := 'a1000000-0000-0000-0000-000000000004';
  sc4_1 uuid := 'b1000000-0000-0000-0004-000000000001';
  sc4_2 uuid := 'b1000000-0000-0000-0004-000000000002';
  sc4_3 uuid := 'b1000000-0000-0000-0004-000000000003';
  sc4_4 uuid := 'b1000000-0000-0000-0004-000000000004';
  sc4_5 uuid := 'b1000000-0000-0000-0004-000000000005';
BEGIN

INSERT INTO public.stories
  (id, title, title_tr, summary, summary_tr, cover_scene, target_age,
   characters, location, theme, moral, moral_tr, published)
VALUES (
  s4_id,
  'The Desert Secret',
  'Çöldeki Sır',
  'Rocky the camel and Zara the zebra search for a legendary oasis, and discover that sharing water — and kindness — makes it multiply.',
  'Deve Rocky ve zebra Zara efsanevi bir vaha arayışına çıkar ve su paylaşmanın — ve nezaketin — onu çoğalttığını keşfeder.',
  'desert-dunes',
  ARRAY[5, 8],
  ARRAY['Rocky the Camel', 'Zara the Zebra', 'Pip the Sandpiper'],
  'Golden Desert',
  'Sharing and Kindness',
  'When you share what little you have, it grows into something wonderful.',
  'Sahip olduğunun azını paylaştığında, harika bir şeye dönüşür.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.story_scenes
  (id, story_id, scene_order, text, text_tr, location, characters, mood,
   camera_angle, sound_effect, animation_cue, vocabulary, choices)
VALUES
(
  sc4_1, s4_id, 1,
  'In the golden desert, where the sand dunes rippled like waves, lived Rocky the camel. Rocky had one special ability — his hump could store water for many days. But there was a great drought and all the water holes had dried up. Rocky had only a little water left in his hump. "If I share," he thought, "I might not have enough for myself."',
  'Kum tepelerinin dalgalar gibi kıvrıldığı altın çölde deve Rocky yaşıyordu. Rocky''nin özel bir yeteneği vardı — hörgücü birkaç günlük su saklayabiliyordu. Ama büyük bir kuraklık vardı ve tüm su gözleri kurumuştu. Rocky''nin hörgücünde yalnızca az su kalmıştı. "Paylaşırsam," diye düşündü, "kendime yetmeyebilir."',
  'Desert Dunes',
  ARRAY['Rocky the Camel'],
  'worried',
  'wide',
  'desert-wind',
  'sand-blow',
  '[
    {"word": "drought",  "word_tr": "kuraklık",   "emoji": "☀️"},
    {"word": "hump",     "word_tr": "hörgüç",     "emoji": "🐪"},
    {"word": "rippled",  "word_tr": "kıvrıldı",   "emoji": "🌊"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc4_2, s4_id, 2,
  'As Rocky walked through the hot desert, he found Zara the zebra collapsed by a dried riverbed. "Please..." Zara whispered weakly. "Just a tiny drop of water." Rocky looked at his last water. He looked at Zara. His heart made the decision before his head could argue. He knelt down and gave Zara a long cool drink of his precious water.',
  'Rocky sıcak çölde yürürken, kurumuş bir nehir yatağının yanında yere yığılmış Zara zebrayla karşılaştı. "Lütfen..." diye fısıldadı Zara bitkin bir şekilde. "Sadece küçücük bir damla su." Rocky son suyuna baktı. Zara''ya baktı. Kalbi, kafası tartışmaya başlamadan kararı verdi. Diz çöktü ve Zara''ya değerli suyundan uzun, serin bir yudum verdi.',
  'Desert Dunes',
  ARRAY['Rocky the Camel', 'Zara the Zebra'],
  'tense',
  'close-up',
  'parched-wind',
  'collapse',
  '[
    {"word": "collapsed","word_tr": "yığıldı",    "emoji": "😓"},
    {"word": "precious", "word_tr": "değerli",    "emoji": "💎"},
    {"word": "knelt",    "word_tr": "diz çöktü",  "emoji": "🙏"}
  ]'::jsonb,
  '[
    {"text": "Share all your water with Zara", "text_tr": "Tüm suyunu Zara ile paylaş", "next_scene_id": "b1000000-0000-0000-0004-000000000003"},
    {"text": "Share just a little and keep looking for the oasis", "text_tr": "Azını paylaş ve vahayı aramaya devam et", "next_scene_id": "b1000000-0000-0000-0004-000000000003"}
  ]'::jsonb
),
(
  sc4_3, s4_id, 3,
  'Zara stood up, her strength returning. "You gave me your last water," she said in wonder. "You could have kept it all for yourself." "We animals must take care of each other," said Rocky simply. Just then, a small bird called Pip landed on Rocky''s head. "I heard what you did! I know where the hidden oasis is — follow me!" he chirped.',
  'Zara ayağa kalktı, gücü geri geliyordu. "Son suyunu bana verdin," dedi hayretle. "Hepsini kendine saklayabilirdin." "Biz hayvanlar birbirimize bakmalıyız," dedi Rocky sadelikle. Tam o sırada Pip adlı küçük bir kuş Rocky''nin başına kondu. "Ne yaptığını duydum! Gizli vahanın nerede olduğunu biliyorum — beni takip edin!" diye cıvıldadı.',
  'Desert Dunes',
  ARRAY['Rocky the Camel', 'Zara the Zebra', 'Pip the Sandpiper'],
  'hopeful',
  'medium',
  'bird-chirp',
  'fly-flutter',
  '[
    {"word": "wonder",   "word_tr": "hayret",     "emoji": "😲"},
    {"word": "hidden",   "word_tr": "gizli",      "emoji": "🔍"},
    {"word": "oasis",    "word_tr": "vaha",       "emoji": "🌴"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc4_4, s4_id, 4,
  'Pip led them over three giant dunes and into a secret valley. And there it was — a beautiful oasis with crystal clear water, tall palm trees, and colorful flowers blooming everywhere! "But wait," said Rocky in surprise. "There is enough water here for EVERY animal in the desert!" "That is the desert''s secret," said Pip proudly. "Kindness always finds the way to more."',
  'Pip onları üç dev kum tepesinin üzerinden geçirip gizli bir vadiye götürdü. Ve işte oradaydı — berrak suyu, uzun hurma ağaçları ve her yerde açan renkli çiçekleriyle güzel bir vaha! "Ama bekle," dedi Rocky şaşkınlıkla. "Burada çöldeki HER hayvan için yetecek kadar su var!" "Bu çölün sırrı," dedi Pip gururla. "Nezaket her zaman daha fazlasının yolunu bulur."',
  'Desert Oasis',
  ARRAY['Rocky the Camel', 'Zara the Zebra', 'Pip the Sandpiper'],
  'joyful',
  'wide',
  'water-flowing',
  'oasis-reveal',
  '[
    {"word": "crystal",  "word_tr": "kristal",    "emoji": "💎"},
    {"word": "blooming", "word_tr": "açan",       "emoji": "🌸"},
    {"word": "kindness", "word_tr": "nezaket",    "emoji": "💝"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc4_5, s4_id, 5,
  'Rocky and Zara told every animal in the desert about the oasis. Soon, elephants, lions, rabbits, and birds of all colors came to drink the cool, sweet water. Rocky realized something wonderful: by giving away his last little bit of water, he had found enough water for everyone. "When you share what little you have," he told his new friends, "it always grows into something wonderful."',
  'Rocky ve Zara çöldeki tüm hayvanlara vahayı anlattı. Kısa süre içinde filler, aslanlar, tavşanlar ve her renkten kuşlar serin, tatlı suyu içmeye geldi. Rocky harika bir şey fark etti: son az suyunu vererek, herkes için yetecek kadar su bulmuştu. "Sahip olduğunun azını paylaştığında," dedi yeni arkadaşlarına, "her zaman harika bir şeye dönüşür."',
  'Desert Oasis',
  ARRAY['Rocky the Camel', 'Zara the Zebra', 'Pip the Sandpiper'],
  'peaceful',
  'wide',
  'celebration',
  'animals-gather',
  '[
    {"word": "realized", "word_tr": "fark etti",  "emoji": "💡"},
    {"word": "share",    "word_tr": "paylaşmak",  "emoji": "🤝"},
    {"word": "grows",    "word_tr": "büyür",      "emoji": "🌱"}
  ]'::jsonb,
  '[]'::jsonb
);

END $$;


-- ─── STORY 5: Dağdaki Gizemli Işık / The Mountain Mystery ───────────────────

DO $$
DECLARE
  s5_id uuid := 'a1000000-0000-0000-0000-000000000005';
  sc5_1 uuid := 'b1000000-0000-0000-0005-000000000001';
  sc5_2 uuid := 'b1000000-0000-0000-0005-000000000002';
  sc5_3 uuid := 'b1000000-0000-0000-0005-000000000003';
  sc5_4 uuid := 'b1000000-0000-0000-0005-000000000004';
  sc5_5 uuid := 'b1000000-0000-0000-0005-000000000005';
BEGIN

INSERT INTO public.stories
  (id, title, title_tr, summary, summary_tr, cover_scene, target_age,
   characters, location, theme, moral, moral_tr, published)
VALUES (
  s5_id,
  'The Mountain Mystery',
  'Dağdaki Gizemli Işık',
  'Two siblings, Sam and Luna, follow a mysterious light up a snowy mountain and learn that working as a team unlocks secrets no one person can discover alone.',
  'İki kardeş Sam ve Luna, karlı bir dağda gizemli bir ışığı takip eder ve takım olarak çalışmanın tek başına kimsenin keşfedemeyeceği sırları açtığını öğrenir.',
  'mountain-base',
  ARRAY[6, 9],
  ARRAY['Sam', 'Luna', 'The Mountain Spirit'],
  'Crystal Mountains',
  'Teamwork and Perseverance',
  'Two people working together can go twice as far as one alone.',
  'Birlikte çalışan iki kişi, tek başına gidenden iki kat daha uzağa gidebilir.',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.story_scenes
  (id, story_id, scene_order, text, text_tr, location, characters, mood,
   camera_angle, sound_effect, animation_cue, vocabulary, choices)
VALUES
(
  sc5_1, s5_id, 1,
  'High in the Crystal Mountains, siblings Sam and Luna were hiking through deep snow when they spotted something unusual — a soft blue light pulsing from somewhere near the mountain peak. "What IS that?" breathed Sam. "I do not know," said Luna, pulling out her notebook, "but I am going to find out. Are you coming?" Sam grinned. "Always."',
  'Kristal Dağları''nda, kardeşler Sam ve Luna derin karda yürürken olağandışı bir şey gördüler — dağ zirvesinin yakınından yumuşak mavi bir ışık titreşiyordu. "Bu NE?" diye nefes nefese kaldı Sam. "Bilmiyorum," dedi Luna not defterini çıkararak, "ama öğreneceğim. Geliyor musun?" Sam sırıttı. "Her zaman."',
  'Mountain Base',
  ARRAY['Sam', 'Luna'],
  'curious',
  'wide',
  'mountain-wind',
  'light-pulse',
  '[
    {"word": "pulsing",  "word_tr": "titreşen",   "emoji": "💙"},
    {"word": "unusual",  "word_tr": "olağandışı", "emoji": "🤔"},
    {"word": "siblings", "word_tr": "kardeşler",  "emoji": "👫"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc5_2, s5_id, 2,
  'They climbed through the clouds to find a frozen bridge over a deep chasm. Sam was brave and strong — he went first, testing each step. But the bridge was very long and Sam got scared halfway across. "I cannot do it alone," he called back. Luna had an idea. She told Sam to look at her feet and match her steps. Together they crossed, step by step, until they both stood safely on the other side.',
  'Derin bir uçurumun üzerindeki donmuş bir köprüyü bulmak için bulutlar arasından tırmandılar. Sam cesur ve güçlüydü — önce o geçti, her adımı test ederek. Ama köprü çok uzundu ve Sam yarı yolda korktu. "Bunu yalnız yapamam," diye seslendi geri. Luna''nın bir fikri vardı. Sam''e ayaklarına bakmasını ve adımlarını eşleştirmesini söyledi. Birlikte adım adım geçtiler, ta ki ikisi de öte tarafta güvenle durana dek.',
  'Mountain Bridge',
  ARRAY['Sam', 'Luna'],
  'tense',
  'wide',
  'creaking-bridge',
  'bridge-sway',
  '[
    {"word": "chasm",    "word_tr": "uçurum",     "emoji": "🕳️"},
    {"word": "halfway",  "word_tr": "yarı yolda", "emoji": "🔀"},
    {"word": "match",    "word_tr": "eşleştirmek","emoji": "🎯"}
  ]'::jsonb,
  '[
    {"text": "Cross the bridge together carefully", "text_tr": "Köprüyü birlikte dikkatlice geçin", "next_scene_id": "b1000000-0000-0000-0005-000000000003"},
    {"text": "Look for another way around", "text_tr": "Başka bir yol arayın", "next_scene_id": "b1000000-0000-0000-0005-000000000003"}
  ]'::jsonb
),
(
  sc5_3, s5_id, 3,
  'Near the peak they found a massive ice door with two keyholes side by side. Sam pushed with all his strength — nothing. Luna pulled — nothing. "Wait," said Luna, noticing the keyholes. "We have to use them at the SAME TIME." Sam pushed left, Luna pulled right — and with a magnificent CRACK the door swung open, revealing the source of the blue light inside.',
  'Zirvenin yakınında yan yana iki anahtar deliği olan devasa bir buz kapısı buldular. Sam tüm gücüyle itti — hiçbir şey. Luna çekti — hiçbir şey. "Dur," dedi Luna, anahtar deliklerini fark ederek. "AYNI ANDA kullanmamız gerekiyor." Sam soldan itti, Luna sağdan çekti — ve muhteşem bir ÇATIRTIY ile kapı açıldı ve içerideki mavi ışığın kaynağını ortaya koydu.',
  'Mountain Peak',
  ARRAY['Sam', 'Luna'],
  'determined',
  'medium',
  'ice-crack',
  'door-open',
  '[
    {"word": "massive",  "word_tr": "devasa",     "emoji": "🏔️"},
    {"word": "keyhole",  "word_tr": "anahtar deliği","emoji": "🔑"},
    {"word": "reveal",   "word_tr": "ortaya çıkmak","emoji": "✨"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc5_4, s5_id, 4,
  'Inside was a magical cave filled with thousands of glowing blue crystals! In the center floated a gentle spirit made of moonlight. "I have been waiting," said the Mountain Spirit softly, "for two people who could work as one. These crystals have been frozen in sadness. Your teamwork has the power to set them singing again." The spirit touched Sam and Luna''s joined hands — and all the crystals burst into joyful music.',
  'İçeride binlerce parlayan mavi kristalle dolu büyülü bir mağara vardı! Ortada ay ışığından yapılmış nazik bir ruh süzülüyordu. "Bekliyordum," dedi Dağ Ruhu yumuşakça, "bir olarak çalışabilecek iki kişiyi. Bu kristaller üzüntüyle donmuş. Takım çalışmanız onları yeniden şarkı söyletme gücüne sahip." Ruh Sam ve Luna''nın birleşik ellerine dokundu — ve tüm kristaller neşeli bir müzikle patladı.',
  'Mountain Cave',
  ARRAY['Sam', 'Luna', 'The Mountain Spirit'],
  'magical',
  'wide',
  'crystal-song',
  'crystals-glow',
  '[
    {"word": "crystals", "word_tr": "kristaller", "emoji": "💎"},
    {"word": "spirit",   "word_tr": "ruh",        "emoji": "👻"},
    {"word": "teamwork", "word_tr": "takım çalışması","emoji": "🤝"}
  ]'::jsonb,
  '[]'::jsonb
),
(
  sc5_5, s5_id, 5,
  'The Mountain Spirit gave each of them a small glowing crystal to take home. "Remember," she said, "a crystal alone is just a rock. But two crystals together create light that never fades." Sam and Luna looked at their crystals, then at each other, then at the whole mountain glowing with new blue light. "We make a pretty good team," said Sam. Luna laughed. "The best."',
  'Dağ Ruhu, eve götürsünler diye her birine küçük bir parlayan kristal verdi. "Unutmayın," dedi, "tek başına bir kristal sadece bir taştır. Ama iki kristal birlikte hiç solmayan bir ışık yaratır." Sam ve Luna kristallerine, sonra birbirlerine, sonra yeni mavi ışıkla parlayan tüm dağa baktılar. "Oldukça iyi bir takımız," dedi Sam. Luna güldü. "En iyisi."',
  'Mountain Peak',
  ARRAY['Sam', 'Luna', 'The Mountain Spirit'],
  'peaceful',
  'wide',
  'crystal-hum',
  'glow-pulse',
  '[
    {"word": "fades",    "word_tr": "solar",       "emoji": "🌅"},
    {"word": "together", "word_tr": "birlikte",    "emoji": "🤝"},
    {"word": "glowing",  "word_tr": "parlayan",    "emoji": "✨"}
  ]'::jsonb,
  '[]'::jsonb
);

END $$;


-- ─── VERIFY ─────────────────────────────────────────────────────────────────
SELECT s.title, s.title_tr, COUNT(sc.id) AS scene_count
FROM public.stories s
LEFT JOIN public.story_scenes sc ON sc.story_id = s.id
GROUP BY s.id, s.title, s.title_tr
ORDER BY s.title;
