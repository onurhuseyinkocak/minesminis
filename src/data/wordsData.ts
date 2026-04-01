// Words Data - Phonics-based word list for children's English learning platform
// 200+ words organized by phonics group and thematic category

export interface KidsWord {
    word: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    emoji: string;
    turkish: string;
    example?: string;
    exampleSentence?: string;
    exampleSentenceTr?: string;
    grade?: number;
    image_url?: string | null;
    word_audio_url?: string | null;
    example_audio_url?: string | null;
    phonicsGroup?: number;
    /** IPA transcription — used by phonetic-trap and phoneme-manipulation games */
    phonetic?: string;
}

// ─── PHONICS GROUP 1: s, a, t, i, p, n ───────────────────────────────────────
const phonicsGroup1: KidsWord[] = [
    { word: "sat", level: "beginner", category: "Phonics", emoji: "🪑", turkish: "oturdu", phonicsGroup: 1, example: "sat on a mat", exampleSentence: "The cat sat on a mat.", exampleSentenceTr: "Kedi paspasın üstüne oturdu." },
    { word: "sit", level: "beginner", category: "Phonics", emoji: "🪑", turkish: "oturmak", phonicsGroup: 1, example: "sit down", exampleSentence: "Please sit down.", exampleSentenceTr: "Lütfen otur." },
    { word: "sip", level: "beginner", category: "Phonics", emoji: "🥤", turkish: "yudum", phonicsGroup: 1, example: "sip of water", exampleSentence: "Take a sip of water.", exampleSentenceTr: "Bir yudum su iç." },
    { word: "tip", level: "beginner", category: "Phonics", emoji: "☝️", turkish: "uç", phonicsGroup: 1, example: "tip of finger", exampleSentence: "Touch the tip of your finger.", exampleSentenceTr: "Parmağının ucuna dokun." },
    { word: "tap", level: "beginner", category: "Phonics", emoji: "🚰", turkish: "musluk", phonicsGroup: 1, example: "tap the drum", exampleSentence: "Tap the drum.", exampleSentenceTr: "Davula vur." },
    { word: "tin", level: "beginner", category: "Phonics", emoji: "🥫", turkish: "teneke", phonicsGroup: 1, example: "tin can", exampleSentence: "The tin can is on the shelf.", exampleSentenceTr: "Teneke kutu rafta." },
    { word: "pin", level: "beginner", category: "Phonics", emoji: "📌", turkish: "iğne", phonicsGroup: 1, example: "pin it up", exampleSentence: "Pin the paper on the board.", exampleSentenceTr: "Kağıdı tahtaya iğnele." },
    { word: "pan", level: "beginner", category: "Phonics", emoji: "🍳", turkish: "tava", phonicsGroup: 1, example: "frying pan", exampleSentence: "Put the egg in the pan.", exampleSentenceTr: "Yumurtayı tavaya koy." },
    { word: "nap", level: "beginner", category: "Phonics", emoji: "😴", turkish: "şekerleme", phonicsGroup: 1, example: "take a nap", exampleSentence: "The baby takes a nap.", exampleSentenceTr: "Bebek kestiriyor." },
    { word: "nut", level: "beginner", category: "Phonics", emoji: "🥜", turkish: "fındık", phonicsGroup: 1 },
    { word: "pit", level: "beginner", category: "Phonics", emoji: "🕳️", turkish: "çukur", phonicsGroup: 1 },
    { word: "pat", level: "beginner", category: "Phonics", emoji: "🤚", turkish: "hafifçe vurmak", phonicsGroup: 1 },
    { word: "tan", level: "beginner", category: "Phonics", emoji: "🌅", turkish: "bronzluk", phonicsGroup: 1 },
    { word: "ant", level: "beginner", category: "Animals", emoji: "🐜", turkish: "karınca", phonicsGroup: 1, example: "tiny ant", exampleSentence: "An ant is very small.", exampleSentenceTr: "Karınca çok küçük." },
    { word: "snap", level: "beginner", category: "Phonics", emoji: "🫰", turkish: "şıklatmak", phonicsGroup: 1 },
    { word: "spin", level: "beginner", category: "Phonics", emoji: "🌀", turkish: "dönmek", phonicsGroup: 1 },
    { word: "pant", level: "beginner", category: "Phonics", emoji: "😮‍💨", turkish: "solumak", phonicsGroup: 1 },
    { word: "satin", level: "intermediate", category: "Phonics", emoji: "🧵", turkish: "saten", phonicsGroup: 1 },
    { word: "paint", level: "intermediate", category: "Phonics", emoji: "🎨", turkish: "boya", phonicsGroup: 1 },
    { word: "saint", level: "intermediate", category: "Phonics", emoji: "😇", turkish: "aziz", phonicsGroup: 1 },
    { word: "pants", level: "beginner", category: "Phonics", emoji: "👖", turkish: "pantolon", phonicsGroup: 1 },
    { word: "stamp", level: "intermediate", category: "Phonics", emoji: "📮", turkish: "pul", phonicsGroup: 1 },
    { word: "sting", level: "intermediate", category: "Phonics", emoji: "🐝", turkish: "sokmak", phonicsGroup: 1 },
    { word: "snip", level: "beginner", category: "Phonics", emoji: "✂️", turkish: "kesmek", phonicsGroup: 1 },
];

// ─── PHONICS GROUP 2: c/k, e, h, r, m, d ─────────────────────────────────────
const phonicsGroup2: KidsWord[] = [
    { word: "cat", level: "beginner", category: "Animals", emoji: "🐱", turkish: "kedi", phonicsGroup: 2, example: "my cat", exampleSentence: "My cat is soft.", exampleSentenceTr: "Kedim yumuşak." },
    { word: "cap", level: "beginner", category: "Phonics", emoji: "🧢", turkish: "şapka", phonicsGroup: 2, example: "red cap", exampleSentence: "I wear a red cap.", exampleSentenceTr: "Kırmızı şapka takıyorum." },
    { word: "car", level: "beginner", category: "Phonics", emoji: "🚗", turkish: "araba", phonicsGroup: 2 },
    { word: "can", level: "beginner", category: "Phonics", emoji: "🫙", turkish: "kutu", phonicsGroup: 2 },
    { word: "cup", level: "beginner", category: "Phonics", emoji: "☕", turkish: "fincan", phonicsGroup: 2 },
    { word: "cut", level: "beginner", category: "Phonics", emoji: "✂️", turkish: "kesmek", phonicsGroup: 2 },
    { word: "hen", level: "beginner", category: "Animals", emoji: "🐔", turkish: "tavuk", phonicsGroup: 2, example: "farm hen", exampleSentence: "The hen lays eggs.", exampleSentenceTr: "Tavuk yumurtluyor." },
    { word: "hat", level: "beginner", category: "Phonics", emoji: "🎩", turkish: "şapka", phonicsGroup: 2 },
    { word: "hid", level: "beginner", category: "Phonics", emoji: "🙈", turkish: "saklandı", phonicsGroup: 2 },
    { word: "hot", level: "beginner", category: "Phonics", emoji: "🔥", turkish: "sıcak", phonicsGroup: 2, example: "hot soup", exampleSentence: "The soup is hot.", exampleSentenceTr: "Çorba sıcak." },
    { word: "hut", level: "beginner", category: "Phonics", emoji: "🛖", turkish: "kulübe", phonicsGroup: 2 },
    { word: "red", level: "beginner", category: "Colors", emoji: "🔴", turkish: "kırmızı", phonicsGroup: 2, example: "red apple", exampleSentence: "The apple is red.", exampleSentenceTr: "Elma kırmızı." },
    { word: "run", level: "beginner", category: "Phonics", emoji: "🏃", turkish: "koşmak", phonicsGroup: 2 },
    { word: "ram", level: "beginner", category: "Animals", emoji: "🐏", turkish: "koç", phonicsGroup: 2 },
    { word: "rat", level: "beginner", category: "Animals", emoji: "🐀", turkish: "sıçan", phonicsGroup: 2 },
    { word: "rug", level: "beginner", category: "Phonics", emoji: "🏠", turkish: "halı", phonicsGroup: 2 },
    { word: "man", level: "beginner", category: "Phonics", emoji: "👨", turkish: "adam", phonicsGroup: 2, example: "tall man", exampleSentence: "The man is tall.", exampleSentenceTr: "Adam uzun." },
    { word: "map", level: "beginner", category: "Phonics", emoji: "🗺️", turkish: "harita", phonicsGroup: 2, example: "treasure map", exampleSentence: "I have a treasure map.", exampleSentenceTr: "Hazine haritam var." },
    { word: "mat", level: "beginner", category: "Phonics", emoji: "🟫", turkish: "paspas", phonicsGroup: 2 },
    { word: "mud", level: "beginner", category: "Phonics", emoji: "🟤", turkish: "çamur", phonicsGroup: 2, example: "dirty mud", exampleSentence: "My boots are full of mud.", exampleSentenceTr: "Botlarım çamurla dolu." },
    { word: "mix", level: "beginner", category: "Phonics", emoji: "🥣", turkish: "karıştırmak", phonicsGroup: 2, exampleSentence: "Mix the flour and eggs.", exampleSentenceTr: "Un ve yumurtaları karıştır." },
    { word: "den", level: "beginner", category: "Phonics", emoji: "🏚️", turkish: "in", phonicsGroup: 2 },
    { word: "dim", level: "beginner", category: "Phonics", emoji: "🔅", turkish: "loş", phonicsGroup: 2, example: "dim light", exampleSentence: "The room is dim.", exampleSentenceTr: "Oda loş." },
    { word: "dip", level: "beginner", category: "Phonics", emoji: "🫕", turkish: "batırmak", phonicsGroup: 2 },
    { word: "dot", level: "beginner", category: "Phonics", emoji: "⚫", turkish: "nokta", phonicsGroup: 2 },
];

// ─── PHONICS GROUP 3: g, o, u, l, f, b ───────────────────────────────────────
const phonicsGroup3: KidsWord[] = [
    { word: "got", level: "beginner", category: "Phonics", emoji: "🤲", turkish: "aldı", phonicsGroup: 3, example: "got a gift", exampleSentence: "I got a gift.", exampleSentenceTr: "Bir hediye aldım." },
    { word: "gum", level: "beginner", category: "Phonics", emoji: "🫧", turkish: "sakız", phonicsGroup: 3 },
    { word: "gap", level: "beginner", category: "Phonics", emoji: "🕳️", turkish: "boşluk", phonicsGroup: 3 },
    { word: "gas", level: "beginner", category: "Phonics", emoji: "⛽", turkish: "gaz", phonicsGroup: 3 },
    { word: "log", level: "beginner", category: "Phonics", emoji: "🪵", turkish: "kütük", phonicsGroup: 3, example: "wooden log", exampleSentence: "Sit on the log.", exampleSentenceTr: "Kütüğe otur." },
    { word: "lot", level: "beginner", category: "Phonics", emoji: "🔢", turkish: "çok", phonicsGroup: 3 },
    { word: "lip", level: "beginner", category: "Body", emoji: "👄", turkish: "dudak", phonicsGroup: 3, example: "wet lip", exampleSentence: "I lick my lip.", exampleSentenceTr: "Dudağımı yalıyorum." },
    { word: "leg", level: "beginner", category: "Body", emoji: "🦵", turkish: "bacak", phonicsGroup: 3 },
    { word: "lid", level: "beginner", category: "Phonics", emoji: "🫙", turkish: "kapak", phonicsGroup: 3, example: "jar lid", exampleSentence: "Put the lid on the jar.", exampleSentenceTr: "Kavanozun kapağını koy." },
    { word: "fog", level: "beginner", category: "Nature", emoji: "🌫️", turkish: "sis", phonicsGroup: 3 },
    { word: "fun", level: "beginner", category: "Phonics", emoji: "🎉", turkish: "eğlence", phonicsGroup: 3, example: "so much fun", exampleSentence: "This game is fun!", exampleSentenceTr: "Bu oyun çok eğlenceli!" },
    { word: "fit", level: "beginner", category: "Phonics", emoji: "💪", turkish: "uygun", phonicsGroup: 3 },
    { word: "fig", level: "beginner", category: "Food", emoji: "🟣", turkish: "incir", phonicsGroup: 3 },
    { word: "fan", level: "beginner", category: "Phonics", emoji: "🪭", turkish: "vantilatör", phonicsGroup: 3 },
    { word: "big", level: "beginner", category: "Phonics", emoji: "🐘", turkish: "büyük", phonicsGroup: 3, example: "big tree", exampleSentence: "The tree is big.", exampleSentenceTr: "Ağaç büyük." },
    { word: "bed", level: "beginner", category: "Phonics", emoji: "🛏️", turkish: "yatak", phonicsGroup: 3, example: "soft bed", exampleSentence: "My bed is soft.", exampleSentenceTr: "Yatağım yumuşak." },
    { word: "bat", level: "beginner", category: "Animals", emoji: "🦇", turkish: "yarasa", phonicsGroup: 3, example: "flying bat", exampleSentence: "A bat flies at night.", exampleSentenceTr: "Yarasa geceleri uçar." },
    { word: "box", level: "beginner", category: "Phonics", emoji: "📦", turkish: "kutu", phonicsGroup: 3, exampleSentence: "The box is full.", exampleSentenceTr: "Kutu dolu." },
    { word: "bit", level: "beginner", category: "Phonics", emoji: "🔹", turkish: "parça", phonicsGroup: 3, phonetic: "/bɪt/" },
    { word: "bus", level: "beginner", category: "Phonics", emoji: "🚌", turkish: "otobüs", phonicsGroup: 3, example: "yellow bus", exampleSentence: "I ride the yellow bus.", exampleSentenceTr: "Sarı otobüse biniyorum." },
    { word: "bug", level: "beginner", category: "Animals", emoji: "🐛", turkish: "böcek", phonicsGroup: 3, example: "little bug", exampleSentence: "A bug is on the leaf.", exampleSentenceTr: "Yaprakta bir böcek var." },
    { word: "bun", level: "beginner", category: "Food", emoji: "🍞", turkish: "çörek", phonicsGroup: 3 },
    { word: "but", level: "beginner", category: "Phonics", emoji: "↔️", turkish: "ama", phonicsGroup: 3 },
    { word: "bull", level: "beginner", category: "Animals", emoji: "🐂", turkish: "boğa", phonicsGroup: 3 },
];

// ─── PHONICS GROUP 4: ai, j, oa, ie, ee, or ──────────────────────────────────
const phonicsGroup4: KidsWord[] = [
    { word: "rain", level: "beginner", category: "Nature", emoji: "🌧️", turkish: "yağmur", phonicsGroup: 4, example: "heavy rain", exampleSentence: "I hear the rain.", exampleSentenceTr: "Yağmuru duyuyorum." },
    { word: "tail", level: "beginner", category: "Animals", emoji: "🐕", turkish: "kuyruk", phonicsGroup: 4, example: "cat tail", exampleSentence: "The cat wags its tail.", exampleSentenceTr: "Kedi kuyruğunu sallıyor." },
    { word: "mail", level: "beginner", category: "Phonics", emoji: "📬", turkish: "posta", phonicsGroup: 4 },
    { word: "paid", level: "intermediate", category: "Phonics", emoji: "💰", turkish: "ödendi", phonicsGroup: 4 },
    { word: "train", level: "beginner", category: "Phonics", emoji: "🚂", turkish: "tren", phonicsGroup: 4 },
    { word: "jet", level: "beginner", category: "Phonics", emoji: "✈️", turkish: "jet", phonicsGroup: 4, example: "fast jet", exampleSentence: "The jet flies fast.", exampleSentenceTr: "Jet uçağı hızlı uçar." },
    { word: "jam", level: "beginner", category: "Food", emoji: "🍯", turkish: "reçel", phonicsGroup: 4, example: "strawberry jam", exampleSentence: "I like strawberry jam.", exampleSentenceTr: "Çilek reçelini seviyorum." },
    { word: "jug", level: "beginner", category: "Phonics", emoji: "🫗", turkish: "sürahi", phonicsGroup: 4 },
    { word: "jump", level: "beginner", category: "Phonics", emoji: "🤸", turkish: "zıplamak", phonicsGroup: 4 },
    { word: "joy", level: "intermediate", category: "Phonics", emoji: "😄", turkish: "sevinç", phonicsGroup: 4 },
    { word: "boat", level: "beginner", category: "Phonics", emoji: "⛵", turkish: "tekne", phonicsGroup: 4, example: "little boat", exampleSentence: "The boat is on the lake.", exampleSentenceTr: "Tekne gölde." },
    { word: "coat", level: "beginner", category: "Phonics", emoji: "🧥", turkish: "palto", phonicsGroup: 4, example: "warm coat", exampleSentence: "Wear your coat.", exampleSentenceTr: "Montunu giy." },
    { word: "goat", level: "beginner", category: "Animals", emoji: "🐐", turkish: "keçi", phonicsGroup: 4 },
    { word: "road", level: "beginner", category: "Phonics", emoji: "🛤️", turkish: "yol", phonicsGroup: 4 },
    { word: "soap", level: "beginner", category: "Phonics", emoji: "🧼", turkish: "sabun", phonicsGroup: 4 },
    { word: "pie", level: "beginner", category: "Food", emoji: "🥧", turkish: "turta", phonicsGroup: 4 },
    { word: "tie", level: "beginner", category: "Phonics", emoji: "👔", turkish: "kravat", phonicsGroup: 4 },
    { word: "lie", level: "intermediate", category: "Phonics", emoji: "🤥", turkish: "yalan", phonicsGroup: 4 },
    { word: "tie", level: "intermediate", category: "Phonics", emoji: "👔", turkish: "kravat", phonicsGroup: 4 },
    { word: "bee", level: "beginner", category: "Animals", emoji: "🐝", turkish: "arı", phonicsGroup: 4, example: "busy bee", exampleSentence: "The bee makes honey.", exampleSentenceTr: "Arı bal yapar." },
    { word: "see", level: "beginner", category: "Phonics", emoji: "👀", turkish: "görmek", phonicsGroup: 4 },
    { word: "tree", level: "beginner", category: "Nature", emoji: "🌳", turkish: "ağaç", phonicsGroup: 4, example: "tall tree", exampleSentence: "The tree is very tall.", exampleSentenceTr: "Ağaç çok uzun." },
    { word: "free", level: "intermediate", category: "Phonics", emoji: "🕊️", turkish: "özgür", phonicsGroup: 4 },
    { word: "corn", level: "beginner", category: "Food", emoji: "🌽", turkish: "mısır", phonicsGroup: 4, example: "sweet corn", exampleSentence: "I eat sweet corn.", exampleSentenceTr: "Tatlı mısır yiyorum." },
    { word: "fork", level: "beginner", category: "Phonics", emoji: "🍴", turkish: "çatal", phonicsGroup: 4, example: "dinner fork", exampleSentence: "Use a fork to eat.", exampleSentenceTr: "Yemek için çatal kullan." },
];

// ─── PHONICS GROUP 5: z, w, ng, v, oo ────────────────────────────────────────
const phonicsGroup5: KidsWord[] = [
    { word: "zoo", level: "beginner", category: "Phonics", emoji: "🦁", turkish: "hayvanat bahçesi", phonicsGroup: 5, exampleSentence: "We go to the zoo.", exampleSentenceTr: "Hayvanat bahçesine gidiyoruz." },
    { word: "zip", level: "beginner", category: "Phonics", emoji: "🤐", turkish: "fermuar", phonicsGroup: 5, exampleSentence: "Zip up your jacket.", exampleSentenceTr: "Ceketin fermuarını kapat." },
    { word: "zig", level: "beginner", category: "Phonics", emoji: "↗️", turkish: "zikzak", phonicsGroup: 5 },
    { word: "zag", level: "beginner", category: "Phonics", emoji: "↘️", turkish: "zikzak", phonicsGroup: 5 },
    { word: "win", level: "beginner", category: "Phonics", emoji: "🏆", turkish: "kazanmak", phonicsGroup: 5, phonetic: "/wɪn/" },
    { word: "wet", level: "beginner", category: "Phonics", emoji: "💧", turkish: "ıslak", phonicsGroup: 5, phonetic: "/wɛt/", exampleSentence: "My hair is wet.", exampleSentenceTr: "Saçım ıslak." },
    { word: "wig", level: "beginner", category: "Phonics", emoji: "💇", turkish: "peruk", phonicsGroup: 5 },
    { word: "web", level: "beginner", category: "Phonics", emoji: "🕸️", turkish: "ağ", phonicsGroup: 5, exampleSentence: "A spider makes a web.", exampleSentenceTr: "Örümcek ağ örer." },
    { word: "ring", level: "beginner", category: "Phonics", emoji: "💍", turkish: "yüzük", phonicsGroup: 5 },
    { word: "sing", level: "beginner", category: "Phonics", emoji: "🎤", turkish: "şarkı söylemek", phonicsGroup: 5 },
    { word: "king", level: "beginner", category: "Phonics", emoji: "👑", turkish: "kral", phonicsGroup: 5 },
    { word: "song", level: "beginner", category: "Phonics", emoji: "🎵", turkish: "şarkı", phonicsGroup: 5 },
    { word: "long", level: "beginner", category: "Phonics", emoji: "📏", turkish: "uzun", phonicsGroup: 5 },
    { word: "van", level: "beginner", category: "Phonics", emoji: "🚐", turkish: "minibüs", phonicsGroup: 5, phonetic: "/væn/", exampleSentence: "The van is big.", exampleSentenceTr: "Minibüs büyük." },
    { word: "vet", level: "beginner", category: "Phonics", emoji: "👨‍⚕️", turkish: "veteriner", phonicsGroup: 5, exampleSentence: "The vet helps sick animals.", exampleSentenceTr: "Veteriner hasta hayvanlara yardım eder." },
    { word: "vine", level: "intermediate", category: "Nature", emoji: "🌿", turkish: "asma", phonicsGroup: 5, phonetic: "/vaɪn/" },
    { word: "book", level: "beginner", category: "Phonics", emoji: "📖", turkish: "kitap", phonicsGroup: 5 },
    { word: "look", level: "beginner", category: "Phonics", emoji: "👁️", turkish: "bakmak", phonicsGroup: 5 },
    { word: "cook", level: "beginner", category: "Phonics", emoji: "👨‍🍳", turkish: "pişirmek", phonicsGroup: 5 },
    { word: "moon", level: "beginner", category: "Nature", emoji: "🌙", turkish: "ay", phonicsGroup: 5, exampleSentence: "The moon is round.", exampleSentenceTr: "Ay yuvarlak." },
];

// ─── PHONICS GROUP 6: y, x, ch, sh, th ───────────────────────────────────────
const phonicsGroup6: KidsWord[] = [
    { word: "yes", level: "beginner", category: "Phonics", emoji: "✅", turkish: "evet", phonicsGroup: 6 },
    { word: "yam", level: "beginner", category: "Food", emoji: "🍠", turkish: "tatlı patates", phonicsGroup: 6, exampleSentence: "I eat yam for dinner.", exampleSentenceTr: "Akşam yemeğinde tatlı patates yerim." },
    { word: "yell", level: "beginner", category: "Phonics", emoji: "🗣️", turkish: "bağırmak", phonicsGroup: 6 },
    { word: "fox", level: "beginner", category: "Animals", emoji: "🦊", turkish: "tilki", phonicsGroup: 6, exampleSentence: "The fox is clever.", exampleSentenceTr: "Tilki akıllı." },
    { word: "six", level: "beginner", category: "Numbers", emoji: "6️⃣", turkish: "altı", phonicsGroup: 6, exampleSentence: "I have six apples.", exampleSentenceTr: "Altı elmam var." },
    { word: "chip", level: "beginner", category: "Phonics", emoji: "🍟", turkish: "cips", phonicsGroup: 6 },
    { word: "chat", level: "beginner", category: "Phonics", emoji: "💬", turkish: "sohbet", phonicsGroup: 6 },
    { word: "chin", level: "beginner", category: "Body", emoji: "🤔", turkish: "çene", phonicsGroup: 6 },
    { word: "chop", level: "beginner", category: "Phonics", emoji: "🪓", turkish: "doğramak", phonicsGroup: 6 },
    { word: "ship", level: "beginner", category: "Phonics", emoji: "🚢", turkish: "gemi", phonicsGroup: 6, phonetic: "/ʃɪp/" },
    { word: "shop", level: "beginner", category: "Phonics", emoji: "🏪", turkish: "dükkan", phonicsGroup: 6 },
    { word: "shut", level: "beginner", category: "Phonics", emoji: "🚪", turkish: "kapatmak", phonicsGroup: 6 },
    { word: "shed", level: "beginner", category: "Phonics", emoji: "🏚️", turkish: "kulübe", phonicsGroup: 6 },
    { word: "thin", level: "beginner", category: "Phonics", emoji: "🧍", turkish: "ince", phonicsGroup: 6, phonetic: "/θɪn/" },
    { word: "thick", level: "beginner", category: "Phonics", emoji: "🟫", turkish: "kalın", phonicsGroup: 6, phonetic: "/θɪk/" },
    { word: "this", level: "beginner", category: "Phonics", emoji: "👉", turkish: "bu", phonicsGroup: 6, phonetic: "/ðɪs/" },
    { word: "that", level: "beginner", category: "Phonics", emoji: "👈", turkish: "şu", phonicsGroup: 6, phonetic: "/ðæt/" },
    { word: "bath", level: "beginner", category: "Phonics", emoji: "🛁", turkish: "banyo", phonicsGroup: 6, phonetic: "/bɑːθ/" },
];

// ─── PHONICS GROUP 7: qu, ou, oi, ue, er, ar ─────────────────────────────────
const phonicsGroup7: KidsWord[] = [
    { word: "queen", level: "intermediate", category: "Phonics", emoji: "👸", turkish: "kraliçe", phonicsGroup: 7 },
    { word: "quit", level: "intermediate", category: "Phonics", emoji: "🚪", turkish: "bırakmak", phonicsGroup: 7 },
    { word: "quiz", level: "intermediate", category: "Phonics", emoji: "❓", turkish: "sınav", phonicsGroup: 7 },
    { word: "quick", level: "intermediate", category: "Phonics", emoji: "⚡", turkish: "hızlı", phonicsGroup: 7 },
    { word: "out", level: "beginner", category: "Phonics", emoji: "🚶", turkish: "dışarı", phonicsGroup: 7 },
    { word: "our", level: "beginner", category: "Phonics", emoji: "👥", turkish: "bizim", phonicsGroup: 7 },
    { word: "loud", level: "beginner", category: "Phonics", emoji: "🔊", turkish: "gürültülü", phonicsGroup: 7 },
    { word: "cloud", level: "beginner", category: "Nature", emoji: "☁️", turkish: "bulut", phonicsGroup: 7, exampleSentence: "A cloud is in the sky.", exampleSentenceTr: "Gökyüzünde bir bulut var." },
    { word: "oil", level: "beginner", category: "Phonics", emoji: "🛢️", turkish: "yağ", phonicsGroup: 7 },
    { word: "coin", level: "beginner", category: "Phonics", emoji: "🪙", turkish: "madeni para", phonicsGroup: 7, exampleSentence: "I found a coin.", exampleSentenceTr: "Bir madeni para buldum." },
    { word: "soil", level: "intermediate", category: "Nature", emoji: "🌱", turkish: "toprak", phonicsGroup: 7, exampleSentence: "Plants grow in soil.", exampleSentenceTr: "Bitkiler toprakta büyür." },
    { word: "join", level: "intermediate", category: "Phonics", emoji: "🤝", turkish: "katılmak", phonicsGroup: 7 },
    { word: "blue", level: "beginner", category: "Colors", emoji: "🔵", turkish: "mavi", phonicsGroup: 7, example: "blue sky", exampleSentence: "The sky is blue.", exampleSentenceTr: "Gökyüzü mavi." },
    { word: "true", level: "intermediate", category: "Phonics", emoji: "✅", turkish: "doğru", phonicsGroup: 7 },
    { word: "clue", level: "intermediate", category: "Phonics", emoji: "🔎", turkish: "ipucu", phonicsGroup: 7 },
    { word: "glue", level: "beginner", category: "Phonics", emoji: "🧴", turkish: "yapıştırıcı", phonicsGroup: 7 },
    { word: "her", level: "beginner", category: "Phonics", emoji: "👩", turkish: "onun", phonicsGroup: 7 },
    { word: "fern", level: "intermediate", category: "Nature", emoji: "🌿", turkish: "eğreltiotu", phonicsGroup: 7 },
    { word: "star", level: "beginner", category: "Nature", emoji: "⭐", turkish: "yıldız", phonicsGroup: 7, exampleSentence: "The star shines at night.", exampleSentenceTr: "Yıldız geceleri parlar." },
];

// ─── THEMATIC: Animals ────────────────────────────────────────────────────────
const animalsWords: KidsWord[] = [
    { word: "dog", level: "beginner", category: "Animals", emoji: "🐶", turkish: "köpek", phonicsGroup: 3, example: "The dog is big.", exampleSentence: "The DOG runs in the yard.", exampleSentenceTr: "KÖPEK bahçede koşuyor." },
    { word: "bird", level: "beginner", category: "Animals", emoji: "🐦", turkish: "kuş", phonicsGroup: 7, example: "A bird can fly.", exampleSentence: "The BIRD sings a song.", exampleSentenceTr: "KUŞ şarkı söylüyor." },
    { word: "fish", level: "beginner", category: "Animals", emoji: "🐟", turkish: "balık", phonicsGroup: 6, example: "Fish live in water.", exampleSentence: "The FISH swims fast.", exampleSentenceTr: "BALIK hızlı yüzüyor." },
    { word: "frog", level: "beginner", category: "Animals", emoji: "🐸", turkish: "kurbağa", phonicsGroup: 3, example: "A frog can jump.", exampleSentence: "The FROG jumps high.", exampleSentenceTr: "KURBAĞA yükseğe zıplar." },
    { word: "pig", level: "beginner", category: "Animals", emoji: "🐷", turkish: "domuz", phonicsGroup: 3, example: "The pig is pink.", exampleSentence: "The PIG likes mud.", exampleSentenceTr: "DOMUZ çamuru sever." },
    { word: "cow", level: "beginner", category: "Animals", emoji: "🐄", turkish: "inek", phonicsGroup: 5, example: "A cow gives milk.", exampleSentence: "The COW is on the farm.", exampleSentenceTr: "İNEK çiftlikte." },
    { word: "duck", level: "beginner", category: "Animals", emoji: "🦆", turkish: "ördek", phonicsGroup: 2, example: "Ducks love water.", exampleSentence: "The DUCK swims on the lake.", exampleSentenceTr: "ÖRDEK gölde yüzüyor." },
    { word: "lamb", level: "beginner", category: "Animals", emoji: "🐑", turkish: "kuzu", phonicsGroup: 3 },
    { word: "owl", level: "intermediate", category: "Animals", emoji: "🦉", turkish: "baykuş", phonicsGroup: 5, exampleSentence: "The owl sleeps during the day.", exampleSentenceTr: "Baykuş gündüzleri uyur." },
    { word: "snail", level: "beginner", category: "Animals", emoji: "🐌", turkish: "salyangoz", phonicsGroup: 4 },
    { word: "shark", level: "intermediate", category: "Animals", emoji: "🦈", turkish: "köpekbalığı", phonicsGroup: 7 },
    { word: "lion", level: "beginner", category: "Animals", emoji: "🦁", turkish: "aslan", phonicsGroup: 4, exampleSentence: "The lion is the king.", exampleSentenceTr: "Aslan kraldır." },
    { word: "tiger", level: "beginner", category: "Animals", emoji: "🐯", turkish: "kaplan", phonicsGroup: 3, exampleSentence: "The tiger is fast.", exampleSentenceTr: "Kaplan hızlı." },
    { word: "bear", level: "beginner", category: "Animals", emoji: "🐻", turkish: "ayı", phonicsGroup: 7, exampleSentence: "The bear is big.", exampleSentenceTr: "Ayı büyük." },
    { word: "rabbit", level: "beginner", category: "Animals", emoji: "🐰", turkish: "tavşan", phonicsGroup: 3, exampleSentence: "The rabbit is white.", exampleSentenceTr: "Tavşan beyaz." },
    { word: "horse", level: "beginner", category: "Animals", emoji: "🐴", turkish: "at", phonicsGroup: 7, exampleSentence: "I ride a horse.", exampleSentenceTr: "Ata biniyorum." },
    { word: "elephant", level: "intermediate", category: "Animals", emoji: "🐘", turkish: "fil", phonicsGroup: 4, exampleSentence: "The elephant is huge.", exampleSentenceTr: "Fil çok büyük." },
    { word: "penguin", level: "intermediate", category: "Animals", emoji: "🐧", turkish: "penguen", phonicsGroup: 3, exampleSentence: "Penguins live in ice.", exampleSentenceTr: "Penguenler buzda yaşar." },
    { word: "butterfly", level: "intermediate", category: "Animals", emoji: "🦋", turkish: "kelebek", phonicsGroup: 3, exampleSentence: "The butterfly is colorful.", exampleSentenceTr: "Kelebek renkli." },
];

// ─── THEMATIC: Colors ─────────────────────────────────────────────────────────
const colorsWords: KidsWord[] = [
    { word: "green", level: "beginner", category: "Colors", emoji: "🟢", turkish: "yeşil", phonicsGroup: 4, example: "green leaf", exampleSentence: "The leaf is green.", exampleSentenceTr: "Yaprak yeşil." },
    { word: "pink", level: "beginner", category: "Colors", emoji: "🩷", turkish: "pembe", phonicsGroup: 3, example: "pink flower", exampleSentence: "The flower is pink.", exampleSentenceTr: "Çiçek pembe." },
    { word: "black", level: "beginner", category: "Colors", emoji: "⚫", turkish: "siyah", phonicsGroup: 2, example: "black hat", exampleSentence: "The hat is black.", exampleSentenceTr: "Şapka siyah." },
    { word: "white", level: "beginner", category: "Colors", emoji: "⚪", turkish: "beyaz", phonicsGroup: 6, example: "white cat", exampleSentence: "The cat is white.", exampleSentenceTr: "Kedi beyaz." },
    { word: "brown", level: "beginner", category: "Colors", emoji: "🟤", turkish: "kahverengi", phonicsGroup: 7 },
    { word: "gold", level: "intermediate", category: "Colors", emoji: "🥇", turkish: "altın", phonicsGroup: 3 },
    { word: "gray", level: "beginner", category: "Colors", emoji: "🩶", turkish: "gri", phonicsGroup: 4 },
    { word: "orange", level: "beginner", category: "Colors", emoji: "🟠", turkish: "turuncu", phonicsGroup: 7, example: "orange ball", exampleSentence: "The ball is orange.", exampleSentenceTr: "Top turuncu." },
    { word: "yellow", level: "beginner", category: "Colors", emoji: "🟡", turkish: "sarı", phonicsGroup: 2, example: "yellow sun", exampleSentence: "The sun is yellow.", exampleSentenceTr: "Güneş sarı." },
    { word: "purple", level: "beginner", category: "Colors", emoji: "🟣", turkish: "mor", phonicsGroup: 7, example: "purple flower", exampleSentence: "The flower is purple.", exampleSentenceTr: "Çiçek mor." },
];

// ─── THEMATIC: Family ─────────────────────────────────────────────────────────
const familyWords: KidsWord[] = [
    { word: "mom", level: "beginner", category: "Family", emoji: "👩", turkish: "anne", phonicsGroup: 2, example: "my mom", exampleSentence: "My mom is kind.", exampleSentenceTr: "Annem nazik." },
    { word: "dad", level: "beginner", category: "Family", emoji: "👨", turkish: "baba", phonicsGroup: 2, example: "my dad", exampleSentence: "My dad is tall.", exampleSentenceTr: "Babam uzun." },
    { word: "baby", level: "beginner", category: "Family", emoji: "👶", turkish: "bebek", phonicsGroup: 4, example: "the baby", exampleSentence: "The baby is sleeping.", exampleSentenceTr: "Bebek uyuyor." },
    { word: "sister", level: "beginner", category: "Family", emoji: "👧", turkish: "kız kardeş", phonicsGroup: 7, example: "my sister", exampleSentence: "My sister likes cats.", exampleSentenceTr: "Kız kardeşim kedileri sever." },
    { word: "brother", level: "beginner", category: "Family", emoji: "👦", turkish: "erkek kardeş", phonicsGroup: 7, example: "my brother", exampleSentence: "My brother plays ball.", exampleSentenceTr: "Erkek kardeşim top oynar." },
    { word: "grandma", level: "beginner", category: "Family", emoji: "👵", turkish: "büyükanne", phonicsGroup: 4 },
    { word: "grandpa", level: "beginner", category: "Family", emoji: "👴", turkish: "büyükbaba", phonicsGroup: 4 },
    { word: "family", level: "beginner", category: "Family", emoji: "👨‍👩‍👧‍👦", turkish: "aile", phonicsGroup: 4 },
    { word: "aunt", level: "beginner", category: "Family", emoji: "👩", turkish: "teyze/hala", phonicsGroup: 7 },
    { word: "uncle", level: "beginner", category: "Family", emoji: "👨", turkish: "amca/dayı", phonicsGroup: 3 },
    { word: "cousin", level: "intermediate", category: "Family", emoji: "🧒", turkish: "kuzen", phonicsGroup: 3 },
];

// ─── THEMATIC: Food ───────────────────────────────────────────────────────────
const foodWords: KidsWord[] = [
    { word: "apple", level: "beginner", category: "Food", emoji: "🍎", turkish: "elma", phonicsGroup: 3, example: "I eat an apple.", exampleSentence: "I love red APPLES.", exampleSentenceTr: "Kırmızı ELMALARI seviyorum." },
    { word: "bread", level: "beginner", category: "Food", emoji: "🍞", turkish: "ekmek", phonicsGroup: 4, example: "I eat bread.", exampleSentence: "We have BREAD for breakfast.", exampleSentenceTr: "Kahvaltıda EKMEK yiyoruz." },
    { word: "milk", level: "beginner", category: "Food", emoji: "🥛", turkish: "süt", phonicsGroup: 3, example: "I drink milk.", exampleSentence: "She drinks MILK every day.", exampleSentenceTr: "Her gün SÜT içiyor." },
    { word: "egg", level: "beginner", category: "Food", emoji: "🥚", turkish: "yumurta", phonicsGroup: 2, example: "I eat an egg.", exampleSentence: "I have an EGG for breakfast.", exampleSentenceTr: "Kahvaltıda YUMURTA yiyorum." },
    { word: "cake", level: "beginner", category: "Food", emoji: "🎂", turkish: "pasta", phonicsGroup: 4, example: "I like cake.", exampleSentence: "The CAKE is sweet.", exampleSentenceTr: "PASTA tatlı." },
    { word: "rice", level: "beginner", category: "Food", emoji: "🍚", turkish: "pirinç", phonicsGroup: 4 },
    { word: "meat", level: "beginner", category: "Food", emoji: "🥩", turkish: "et", phonicsGroup: 4 },
    { word: "soup", level: "beginner", category: "Food", emoji: "🍲", turkish: "çorba", phonicsGroup: 5 },
    { word: "juice", level: "beginner", category: "Food", emoji: "🧃", turkish: "meyve suyu", phonicsGroup: 5 },
    { word: "water", level: "beginner", category: "Food", emoji: "💧", turkish: "su", phonicsGroup: 7, example: "I drink water.", exampleSentence: "Please give me some WATER.", exampleSentenceTr: "Lütfen biraz SU ver." },
    { word: "tea", level: "beginner", category: "Food", emoji: "🍵", turkish: "çay", phonicsGroup: 4 },
    { word: "fruit", level: "beginner", category: "Food", emoji: "🍇", turkish: "meyve", phonicsGroup: 5 },
    { word: "nut", level: "beginner", category: "Food", emoji: "🥜", turkish: "kuruyemiş/fındık", phonicsGroup: 3 },
    { word: "banana", level: "beginner", category: "Food", emoji: "🍌", turkish: "muz", phonicsGroup: 4, exampleSentence: "I love bananas.", exampleSentenceTr: "Muzları çok seviyorum." },
    { word: "cookie", level: "beginner", category: "Food", emoji: "🍪", turkish: "kurabiye", phonicsGroup: 5, exampleSentence: "The cookie is sweet.", exampleSentenceTr: "Kurabiye tatlı." },
    { word: "pizza", level: "beginner", category: "Food", emoji: "🍕", turkish: "pizza", phonicsGroup: 3, exampleSentence: "I like cheese pizza.", exampleSentenceTr: "Peynirli pizzayı severim." },
    { word: "cheese", level: "beginner", category: "Food", emoji: "🧀", turkish: "peynir", phonicsGroup: 4, exampleSentence: "I love cheese.", exampleSentenceTr: "Peyniri çok severim." },
    { word: "carrot", level: "beginner", category: "Food", emoji: "🥕", turkish: "havuç", phonicsGroup: 7, exampleSentence: "Rabbits eat carrots.", exampleSentenceTr: "Tavşanlar havuç yer." },
    { word: "potato", level: "beginner", category: "Food", emoji: "🥔", turkish: "patates", phonicsGroup: 4, exampleSentence: "I eat baked potato.", exampleSentenceTr: "Fırın patates yerim." },
    { word: "strawberry", level: "intermediate", category: "Food", emoji: "🍓", turkish: "çilek", phonicsGroup: 7, exampleSentence: "Strawberries are red.", exampleSentenceTr: "Çilekler kırmızıdır." },
];

// ─── THEMATIC: Body ───────────────────────────────────────────────────────────
const bodyWords: KidsWord[] = [
    { word: "hand", level: "beginner", category: "Body", emoji: "✋", turkish: "el", phonicsGroup: 3, example: "my hand", exampleSentence: "I wave my hand.", exampleSentenceTr: "Elimi sallıyorum." },
    { word: "arm", level: "beginner", category: "Body", emoji: "💪", turkish: "kol", phonicsGroup: 7 },
    { word: "eye", level: "beginner", category: "Body", emoji: "👁️", turkish: "göz", phonicsGroup: 4, example: "big eye", exampleSentence: "I have big eyes.", exampleSentenceTr: "Büyük gözlerim var." },
    { word: "ear", level: "beginner", category: "Body", emoji: "👂", turkish: "kulak", phonicsGroup: 7, example: "big ears", exampleSentence: "Rabbits have big ears.", exampleSentenceTr: "Tavşanların büyük kulakları var." },
    { word: "nose", level: "beginner", category: "Body", emoji: "👃", turkish: "burun", phonicsGroup: 4, example: "small nose", exampleSentence: "The dog has a wet nose.", exampleSentenceTr: "Köpeğin burnu ıslak." },
    { word: "head", level: "beginner", category: "Body", emoji: "🗣️", turkish: "baş", phonicsGroup: 4 },
    { word: "foot", level: "beginner", category: "Body", emoji: "🦶", turkish: "ayak", phonicsGroup: 5, example: "my foot", exampleSentence: "My foot is small.", exampleSentenceTr: "Ayağım küçük." },
    { word: "back", level: "beginner", category: "Body", emoji: "🧍", turkish: "sırt", phonicsGroup: 2 },
    { word: "mouth", level: "beginner", category: "Body", emoji: "👄", turkish: "ağız", phonicsGroup: 5, exampleSentence: "Open your mouth.", exampleSentenceTr: "Ağzını aç." },
    { word: "hair", level: "beginner", category: "Body", emoji: "💇", turkish: "saç", phonicsGroup: 7, exampleSentence: "My hair is long.", exampleSentenceTr: "Saçım uzun." },
    { word: "teeth", level: "beginner", category: "Body", emoji: "🦷", turkish: "dişler", phonicsGroup: 4, exampleSentence: "Brush your teeth.", exampleSentenceTr: "Dişlerini fırçala." },
    { word: "finger", level: "beginner", category: "Body", emoji: "☝️", turkish: "parmak", phonicsGroup: 3, exampleSentence: "I have ten fingers.", exampleSentenceTr: "On parmağım var." },
    { word: "tummy", level: "beginner", category: "Body", emoji: "🫃", turkish: "karın", phonicsGroup: 3, exampleSentence: "My tummy is full.", exampleSentenceTr: "Karnım dolu." },
];

// ─── THEMATIC: Numbers ────────────────────────────────────────────────────────
const numbersWords: KidsWord[] = [
    { word: "one", level: "beginner", category: "Numbers", emoji: "1️⃣", turkish: "bir", phonicsGroup: 4 },
    { word: "two", level: "beginner", category: "Numbers", emoji: "2️⃣", turkish: "iki", phonicsGroup: 5 },
    { word: "three", level: "beginner", category: "Numbers", emoji: "3️⃣", turkish: "üç", phonicsGroup: 4 },
    { word: "four", level: "beginner", category: "Numbers", emoji: "4️⃣", turkish: "dört", phonicsGroup: 7 },
    { word: "five", level: "beginner", category: "Numbers", emoji: "5️⃣", turkish: "beş", phonicsGroup: 4 },
    { word: "zero", level: "beginner", category: "Numbers", emoji: "0️⃣", turkish: "sıfır", phonicsGroup: 7, exampleSentence: "Zero means nothing.", exampleSentenceTr: "Sıfır hiç demektir." },
    { word: "seven", level: "beginner", category: "Numbers", emoji: "7️⃣", turkish: "yedi", phonicsGroup: 2 },
    { word: "eight", level: "beginner", category: "Numbers", emoji: "8️⃣", turkish: "sekiz", phonicsGroup: 4 },
    { word: "nine", level: "beginner", category: "Numbers", emoji: "9️⃣", turkish: "dokuz", phonicsGroup: 4 },
    { word: "ten", level: "beginner", category: "Numbers", emoji: "🔟", turkish: "on", phonicsGroup: 2 },
];

// ─── THEMATIC: Nature ─────────────────────────────────────────────────────────
const natureWords: KidsWord[] = [
    { word: "sun", level: "beginner", category: "Nature", emoji: "☀️", turkish: "güneş", phonicsGroup: 3, example: "bright sun", exampleSentence: "The sun is very bright.", exampleSentenceTr: "Güneş çok parlak." },
    { word: "leaf", level: "beginner", category: "Nature", emoji: "🍃", turkish: "yaprak", phonicsGroup: 4, exampleSentence: "The leaf is green.", exampleSentenceTr: "Yaprak yeşil." },
    { word: "snow", level: "beginner", category: "Nature", emoji: "❄️", turkish: "kar", phonicsGroup: 5, exampleSentence: "The snow is white.", exampleSentenceTr: "Kar beyaz." },
    { word: "wind", level: "beginner", category: "Nature", emoji: "💨", turkish: "rüzgar", phonicsGroup: 3, exampleSentence: "The wind blows the leaves.", exampleSentenceTr: "Rüzgar yaprakları savuruyor." },
    { word: "hill", level: "beginner", category: "Nature", emoji: "⛰️", turkish: "tepe", phonicsGroup: 3 },
    { word: "rock", level: "beginner", category: "Nature", emoji: "🪨", turkish: "kaya", phonicsGroup: 2, exampleSentence: "I sit on a rock.", exampleSentenceTr: "Kayanın üstüne oturuyorum." },
    { word: "flower", level: "beginner", category: "Nature", emoji: "🌸", turkish: "çiçek", phonicsGroup: 5, exampleSentence: "The flower smells nice.", exampleSentenceTr: "Çiçek güzel kokuyor." },
    { word: "sky", level: "beginner", category: "Nature", emoji: "🌤️", turkish: "gökyüzü", phonicsGroup: 3, exampleSentence: "The sky is blue.", exampleSentenceTr: "Gökyüzü mavi." },
    { word: "ocean", level: "intermediate", category: "Nature", emoji: "🌊", turkish: "okyanus", phonicsGroup: 4, exampleSentence: "The ocean is deep.", exampleSentenceTr: "Okyanus derin." },
    { word: "river", level: "beginner", category: "Nature", emoji: "🏞️", turkish: "nehir", phonicsGroup: 3, exampleSentence: "Fish live in the river.", exampleSentenceTr: "Balıklar nehirde yaşar." },
    { word: "grass", level: "beginner", category: "Nature", emoji: "🌱", turkish: "çimen", phonicsGroup: 4, exampleSentence: "The grass is green.", exampleSentenceTr: "Çimen yeşil." },
];

// ─── COMBINE ALL WORDS ───────────────────────────────────────────────────────
export const kidsWords: KidsWord[] = [
    ...phonicsGroup1,
    ...phonicsGroup2,
    ...phonicsGroup3,
    ...phonicsGroup4,
    ...phonicsGroup5,
    ...phonicsGroup6,
    ...phonicsGroup7,
    ...animalsWords,
    ...colorsWords,
    ...familyWords,
    ...foodWords,
    ...bodyWords,
    ...numbersWords,
    ...natureWords,
];

// Total count for display
export const TOTAL_WORDS_COUNT = kidsWords.length;

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

/** Get all words belonging to a specific phonics group (1-7) */
export function getWordsByGroup(group: number): KidsWord[] {
    return kidsWords.filter((w) => w.phonicsGroup === group);
}

/** Get all words belonging to a specific thematic category */
export function getWordsByCategory(category: string): KidsWord[] {
    return kidsWords.filter(
        (w) => w.category.toLowerCase() === category.toLowerCase()
    );
}
