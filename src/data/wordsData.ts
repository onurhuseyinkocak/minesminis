// Words Data - Phonics-based word list for children's English learning platform
// 200+ words organized by phonics group and thematic category

export interface KidsWord {
    word: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    emoji: string;
    turkish: string;
    example?: string;
    grade?: number;
    image_url?: string | null;
    word_audio_url?: string | null;
    example_audio_url?: string | null;
    phonicsGroup?: number;
}

// ─── PHONICS GROUP 1: s, a, t, i, p, n ───────────────────────────────────────
const phonicsGroup1: KidsWord[] = [
    { word: "sat", level: "beginner", category: "Phonics", emoji: "🪑", turkish: "oturdu", phonicsGroup: 1 },
    { word: "sit", level: "beginner", category: "Phonics", emoji: "🪑", turkish: "oturmak", phonicsGroup: 1 },
    { word: "sip", level: "beginner", category: "Phonics", emoji: "🥤", turkish: "yudum", phonicsGroup: 1 },
    { word: "tip", level: "beginner", category: "Phonics", emoji: "☝️", turkish: "uç", phonicsGroup: 1 },
    { word: "tap", level: "beginner", category: "Phonics", emoji: "🚰", turkish: "musluk", phonicsGroup: 1 },
    { word: "tin", level: "beginner", category: "Phonics", emoji: "🥫", turkish: "teneke", phonicsGroup: 1 },
    { word: "pin", level: "beginner", category: "Phonics", emoji: "📌", turkish: "iğne", phonicsGroup: 1 },
    { word: "pan", level: "beginner", category: "Phonics", emoji: "🍳", turkish: "tava", phonicsGroup: 1 },
    { word: "nap", level: "beginner", category: "Phonics", emoji: "😴", turkish: "şekerleme", phonicsGroup: 1 },
    { word: "nit", level: "beginner", category: "Phonics", emoji: "🔍", turkish: "sirke", phonicsGroup: 1 },
    { word: "pit", level: "beginner", category: "Phonics", emoji: "🕳️", turkish: "çukur", phonicsGroup: 1 },
    { word: "pat", level: "beginner", category: "Phonics", emoji: "🤚", turkish: "hafifçe vurmak", phonicsGroup: 1 },
    { word: "tan", level: "beginner", category: "Phonics", emoji: "🌅", turkish: "bronzluk", phonicsGroup: 1 },
    { word: "ant", level: "beginner", category: "Animals", emoji: "🐜", turkish: "karınca", phonicsGroup: 1 },
    { word: "snap", level: "beginner", category: "Phonics", emoji: "🫰", turkish: "şıklatmak", phonicsGroup: 1 },
    { word: "spin", level: "beginner", category: "Phonics", emoji: "🌀", turkish: "dönmek", phonicsGroup: 1 },
    { word: "spit", level: "beginner", category: "Phonics", emoji: "💦", turkish: "tükürmek", phonicsGroup: 1 },
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
    { word: "cat", level: "beginner", category: "Animals", emoji: "🐱", turkish: "kedi", phonicsGroup: 2 },
    { word: "cap", level: "beginner", category: "Phonics", emoji: "🧢", turkish: "şapka", phonicsGroup: 2 },
    { word: "car", level: "beginner", category: "Phonics", emoji: "🚗", turkish: "araba", phonicsGroup: 2 },
    { word: "can", level: "beginner", category: "Phonics", emoji: "🥫", turkish: "kutu", phonicsGroup: 2 },
    { word: "cup", level: "beginner", category: "Phonics", emoji: "☕", turkish: "fincan", phonicsGroup: 2 },
    { word: "cut", level: "beginner", category: "Phonics", emoji: "✂️", turkish: "kesmek", phonicsGroup: 2 },
    { word: "hen", level: "beginner", category: "Animals", emoji: "🐔", turkish: "tavuk", phonicsGroup: 2 },
    { word: "hat", level: "beginner", category: "Phonics", emoji: "🎩", turkish: "şapka", phonicsGroup: 2 },
    { word: "hit", level: "beginner", category: "Phonics", emoji: "👊", turkish: "vurmak", phonicsGroup: 2 },
    { word: "hot", level: "beginner", category: "Phonics", emoji: "🔥", turkish: "sıcak", phonicsGroup: 2 },
    { word: "hut", level: "beginner", category: "Phonics", emoji: "🛖", turkish: "kulübe", phonicsGroup: 2 },
    { word: "red", level: "beginner", category: "Colors", emoji: "🔴", turkish: "kırmızı", phonicsGroup: 2 },
    { word: "run", level: "beginner", category: "Phonics", emoji: "🏃", turkish: "koşmak", phonicsGroup: 2 },
    { word: "ram", level: "beginner", category: "Animals", emoji: "🐏", turkish: "koç", phonicsGroup: 2 },
    { word: "rat", level: "beginner", category: "Animals", emoji: "🐀", turkish: "sıçan", phonicsGroup: 2 },
    { word: "rug", level: "beginner", category: "Phonics", emoji: "🟫", turkish: "halı", phonicsGroup: 2 },
    { word: "man", level: "beginner", category: "Phonics", emoji: "👨", turkish: "adam", phonicsGroup: 2 },
    { word: "map", level: "beginner", category: "Phonics", emoji: "🗺️", turkish: "harita", phonicsGroup: 2 },
    { word: "mat", level: "beginner", category: "Phonics", emoji: "🟩", turkish: "paspas", phonicsGroup: 2 },
    { word: "mud", level: "beginner", category: "Phonics", emoji: "🟤", turkish: "çamur", phonicsGroup: 2 },
    { word: "mix", level: "beginner", category: "Phonics", emoji: "🥣", turkish: "karıştırmak", phonicsGroup: 2 },
    { word: "den", level: "beginner", category: "Phonics", emoji: "🏚️", turkish: "in", phonicsGroup: 2 },
    { word: "dim", level: "beginner", category: "Phonics", emoji: "🔅", turkish: "loş", phonicsGroup: 2 },
    { word: "dip", level: "beginner", category: "Phonics", emoji: "🫕", turkish: "batırmak", phonicsGroup: 2 },
    { word: "dot", level: "beginner", category: "Phonics", emoji: "⚫", turkish: "nokta", phonicsGroup: 2 },
];

// ─── PHONICS GROUP 3: g, o, u, l, f, b ───────────────────────────────────────
const phonicsGroup3: KidsWord[] = [
    { word: "got", level: "beginner", category: "Phonics", emoji: "🤲", turkish: "aldı", phonicsGroup: 3 },
    { word: "gun", level: "beginner", category: "Phonics", emoji: "🔫", turkish: "silah", phonicsGroup: 3 },
    { word: "gum", level: "beginner", category: "Phonics", emoji: "🫧", turkish: "sakız", phonicsGroup: 3 },
    { word: "gap", level: "beginner", category: "Phonics", emoji: "🕳️", turkish: "boşluk", phonicsGroup: 3 },
    { word: "gas", level: "beginner", category: "Phonics", emoji: "⛽", turkish: "gaz", phonicsGroup: 3 },
    { word: "log", level: "beginner", category: "Phonics", emoji: "🪵", turkish: "kütük", phonicsGroup: 3 },
    { word: "lot", level: "beginner", category: "Phonics", emoji: "📦", turkish: "çok", phonicsGroup: 3 },
    { word: "lip", level: "beginner", category: "Body", emoji: "👄", turkish: "dudak", phonicsGroup: 3 },
    { word: "leg", level: "beginner", category: "Body", emoji: "🦵", turkish: "bacak", phonicsGroup: 3 },
    { word: "lid", level: "beginner", category: "Phonics", emoji: "🫙", turkish: "kapak", phonicsGroup: 3 },
    { word: "fog", level: "beginner", category: "Nature", emoji: "🌫️", turkish: "sis", phonicsGroup: 3 },
    { word: "fun", level: "beginner", category: "Phonics", emoji: "🎉", turkish: "eğlence", phonicsGroup: 3 },
    { word: "fit", level: "beginner", category: "Phonics", emoji: "💪", turkish: "uygun", phonicsGroup: 3 },
    { word: "fig", level: "beginner", category: "Food", emoji: "🫒", turkish: "incir", phonicsGroup: 3 },
    { word: "fan", level: "beginner", category: "Phonics", emoji: "🪭", turkish: "vantilatör", phonicsGroup: 3 },
    { word: "big", level: "beginner", category: "Phonics", emoji: "🐘", turkish: "büyük", phonicsGroup: 3 },
    { word: "bed", level: "beginner", category: "Phonics", emoji: "🛏️", turkish: "yatak", phonicsGroup: 3 },
    { word: "bat", level: "beginner", category: "Animals", emoji: "🦇", turkish: "yarasa", phonicsGroup: 3 },
    { word: "box", level: "beginner", category: "Phonics", emoji: "📦", turkish: "kutu", phonicsGroup: 3 },
    { word: "bit", level: "beginner", category: "Phonics", emoji: "🔹", turkish: "parça", phonicsGroup: 3 },
    { word: "bus", level: "beginner", category: "Phonics", emoji: "🚌", turkish: "otobüs", phonicsGroup: 3 },
    { word: "bug", level: "beginner", category: "Animals", emoji: "🐛", turkish: "böcek", phonicsGroup: 3 },
    { word: "bun", level: "beginner", category: "Food", emoji: "🍞", turkish: "çörek", phonicsGroup: 3 },
    { word: "but", level: "beginner", category: "Phonics", emoji: "🔄", turkish: "ama", phonicsGroup: 3 },
    { word: "bull", level: "beginner", category: "Animals", emoji: "🐂", turkish: "boğa", phonicsGroup: 3 },
];

// ─── PHONICS GROUP 4: ai, j, oa, ie, ee, or ──────────────────────────────────
const phonicsGroup4: KidsWord[] = [
    { word: "rain", level: "beginner", category: "Nature", emoji: "🌧️", turkish: "yağmur", phonicsGroup: 4 },
    { word: "tail", level: "beginner", category: "Animals", emoji: "🐕", turkish: "kuyruk", phonicsGroup: 4 },
    { word: "mail", level: "beginner", category: "Phonics", emoji: "📬", turkish: "posta", phonicsGroup: 4 },
    { word: "pain", level: "intermediate", category: "Phonics", emoji: "🤕", turkish: "acı", phonicsGroup: 4 },
    { word: "train", level: "beginner", category: "Phonics", emoji: "🚂", turkish: "tren", phonicsGroup: 4 },
    { word: "jet", level: "beginner", category: "Phonics", emoji: "✈️", turkish: "jet", phonicsGroup: 4 },
    { word: "jam", level: "beginner", category: "Food", emoji: "🍯", turkish: "reçel", phonicsGroup: 4 },
    { word: "jug", level: "beginner", category: "Phonics", emoji: "🫗", turkish: "sürahi", phonicsGroup: 4 },
    { word: "jump", level: "beginner", category: "Phonics", emoji: "🤸", turkish: "zıplamak", phonicsGroup: 4 },
    { word: "joy", level: "intermediate", category: "Phonics", emoji: "😄", turkish: "sevinç", phonicsGroup: 4 },
    { word: "boat", level: "beginner", category: "Phonics", emoji: "⛵", turkish: "tekne", phonicsGroup: 4 },
    { word: "coat", level: "beginner", category: "Phonics", emoji: "🧥", turkish: "palto", phonicsGroup: 4 },
    { word: "goat", level: "beginner", category: "Animals", emoji: "🐐", turkish: "keçi", phonicsGroup: 4 },
    { word: "road", level: "beginner", category: "Phonics", emoji: "🛤️", turkish: "yol", phonicsGroup: 4 },
    { word: "soap", level: "beginner", category: "Phonics", emoji: "🧼", turkish: "sabun", phonicsGroup: 4 },
    { word: "pie", level: "beginner", category: "Food", emoji: "🥧", turkish: "turta", phonicsGroup: 4 },
    { word: "tie", level: "beginner", category: "Phonics", emoji: "👔", turkish: "kravat", phonicsGroup: 4 },
    { word: "lie", level: "intermediate", category: "Phonics", emoji: "🤥", turkish: "yalan", phonicsGroup: 4 },
    { word: "die", level: "intermediate", category: "Phonics", emoji: "🎲", turkish: "zar", phonicsGroup: 4 },
    { word: "bee", level: "beginner", category: "Animals", emoji: "🐝", turkish: "arı", phonicsGroup: 4 },
    { word: "see", level: "beginner", category: "Phonics", emoji: "👀", turkish: "görmek", phonicsGroup: 4 },
    { word: "tree", level: "beginner", category: "Nature", emoji: "🌳", turkish: "ağaç", phonicsGroup: 4 },
    { word: "free", level: "intermediate", category: "Phonics", emoji: "🕊️", turkish: "özgür", phonicsGroup: 4 },
    { word: "corn", level: "beginner", category: "Food", emoji: "🌽", turkish: "mısır", phonicsGroup: 4 },
    { word: "fork", level: "beginner", category: "Phonics", emoji: "🍴", turkish: "çatal", phonicsGroup: 4 },
];

// ─── PHONICS GROUP 5: z, w, ng, v, oo ────────────────────────────────────────
const phonicsGroup5: KidsWord[] = [
    { word: "zoo", level: "beginner", category: "Phonics", emoji: "🦁", turkish: "hayvanat bahçesi", phonicsGroup: 5 },
    { word: "zip", level: "beginner", category: "Phonics", emoji: "🤐", turkish: "fermuar", phonicsGroup: 5 },
    { word: "zig", level: "beginner", category: "Phonics", emoji: "↗️", turkish: "zikzak", phonicsGroup: 5 },
    { word: "zag", level: "beginner", category: "Phonics", emoji: "↘️", turkish: "zikzak", phonicsGroup: 5 },
    { word: "win", level: "beginner", category: "Phonics", emoji: "🏆", turkish: "kazanmak", phonicsGroup: 5 },
    { word: "wet", level: "beginner", category: "Phonics", emoji: "💧", turkish: "ıslak", phonicsGroup: 5 },
    { word: "wig", level: "beginner", category: "Phonics", emoji: "💇", turkish: "peruk", phonicsGroup: 5 },
    { word: "web", level: "beginner", category: "Phonics", emoji: "🕸️", turkish: "ağ", phonicsGroup: 5 },
    { word: "ring", level: "beginner", category: "Phonics", emoji: "💍", turkish: "yüzük", phonicsGroup: 5 },
    { word: "sing", level: "beginner", category: "Phonics", emoji: "🎤", turkish: "şarkı söylemek", phonicsGroup: 5 },
    { word: "king", level: "beginner", category: "Phonics", emoji: "👑", turkish: "kral", phonicsGroup: 5 },
    { word: "song", level: "beginner", category: "Phonics", emoji: "🎵", turkish: "şarkı", phonicsGroup: 5 },
    { word: "long", level: "beginner", category: "Phonics", emoji: "📏", turkish: "uzun", phonicsGroup: 5 },
    { word: "van", level: "beginner", category: "Phonics", emoji: "🚐", turkish: "minibüs", phonicsGroup: 5 },
    { word: "vet", level: "beginner", category: "Phonics", emoji: "👨‍⚕️", turkish: "veteriner", phonicsGroup: 5 },
    { word: "vine", level: "intermediate", category: "Nature", emoji: "🌿", turkish: "asma", phonicsGroup: 5 },
    { word: "book", level: "beginner", category: "Phonics", emoji: "📖", turkish: "kitap", phonicsGroup: 5 },
    { word: "look", level: "beginner", category: "Phonics", emoji: "👁️", turkish: "bakmak", phonicsGroup: 5 },
    { word: "cook", level: "beginner", category: "Phonics", emoji: "👨‍🍳", turkish: "pişirmek", phonicsGroup: 5 },
    { word: "moon", level: "beginner", category: "Nature", emoji: "🌙", turkish: "ay", phonicsGroup: 5 },
];

// ─── PHONICS GROUP 6: y, x, ch, sh, th ───────────────────────────────────────
const phonicsGroup6: KidsWord[] = [
    { word: "yes", level: "beginner", category: "Phonics", emoji: "✅", turkish: "evet", phonicsGroup: 6 },
    { word: "yam", level: "beginner", category: "Food", emoji: "🍠", turkish: "tatlı patates", phonicsGroup: 6 },
    { word: "yell", level: "beginner", category: "Phonics", emoji: "🗣️", turkish: "bağırmak", phonicsGroup: 6 },
    { word: "fox", level: "beginner", category: "Animals", emoji: "🦊", turkish: "tilki", phonicsGroup: 6 },
    { word: "six", level: "beginner", category: "Numbers", emoji: "6️⃣", turkish: "altı", phonicsGroup: 6 },
    { word: "chip", level: "beginner", category: "Phonics", emoji: "🍟", turkish: "cips", phonicsGroup: 6 },
    { word: "chat", level: "beginner", category: "Phonics", emoji: "💬", turkish: "sohbet", phonicsGroup: 6 },
    { word: "chin", level: "beginner", category: "Body", emoji: "🤔", turkish: "çene", phonicsGroup: 6 },
    { word: "chop", level: "beginner", category: "Phonics", emoji: "🪓", turkish: "doğramak", phonicsGroup: 6 },
    { word: "ship", level: "beginner", category: "Phonics", emoji: "🚢", turkish: "gemi", phonicsGroup: 6 },
    { word: "shop", level: "beginner", category: "Phonics", emoji: "🏪", turkish: "dükkan", phonicsGroup: 6 },
    { word: "shut", level: "beginner", category: "Phonics", emoji: "🚪", turkish: "kapatmak", phonicsGroup: 6 },
    { word: "shed", level: "beginner", category: "Phonics", emoji: "🏚️", turkish: "kulübe", phonicsGroup: 6 },
    { word: "thin", level: "beginner", category: "Phonics", emoji: "🧍", turkish: "ince", phonicsGroup: 6 },
    { word: "thick", level: "beginner", category: "Phonics", emoji: "🟫", turkish: "kalın", phonicsGroup: 6 },
    { word: "this", level: "beginner", category: "Phonics", emoji: "👉", turkish: "bu", phonicsGroup: 6 },
    { word: "that", level: "beginner", category: "Phonics", emoji: "👈", turkish: "şu", phonicsGroup: 6 },
    { word: "bath", level: "beginner", category: "Phonics", emoji: "🛁", turkish: "banyo", phonicsGroup: 6 },
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
    { word: "cloud", level: "beginner", category: "Nature", emoji: "☁️", turkish: "bulut", phonicsGroup: 7 },
    { word: "oil", level: "beginner", category: "Phonics", emoji: "🛢️", turkish: "yağ", phonicsGroup: 7 },
    { word: "coin", level: "beginner", category: "Phonics", emoji: "🪙", turkish: "madeni para", phonicsGroup: 7 },
    { word: "soil", level: "intermediate", category: "Nature", emoji: "🌱", turkish: "toprak", phonicsGroup: 7 },
    { word: "join", level: "intermediate", category: "Phonics", emoji: "🤝", turkish: "katılmak", phonicsGroup: 7 },
    { word: "blue", level: "beginner", category: "Colors", emoji: "🔵", turkish: "mavi", phonicsGroup: 7 },
    { word: "true", level: "intermediate", category: "Phonics", emoji: "✅", turkish: "doğru", phonicsGroup: 7 },
    { word: "clue", level: "intermediate", category: "Phonics", emoji: "🔎", turkish: "ipucu", phonicsGroup: 7 },
    { word: "glue", level: "beginner", category: "Phonics", emoji: "🧴", turkish: "yapıştırıcı", phonicsGroup: 7 },
    { word: "her", level: "beginner", category: "Phonics", emoji: "👩", turkish: "onun", phonicsGroup: 7 },
    { word: "fern", level: "intermediate", category: "Nature", emoji: "🌿", turkish: "eğreltiotu", phonicsGroup: 7 },
    { word: "star", level: "beginner", category: "Nature", emoji: "⭐", turkish: "yıldız", phonicsGroup: 7 },
];

// ─── THEMATIC: Animals ────────────────────────────────────────────────────────
const animalsWords: KidsWord[] = [
    { word: "dog", level: "beginner", category: "Animals", emoji: "🐶", turkish: "köpek" },
    { word: "bird", level: "beginner", category: "Animals", emoji: "🐦", turkish: "kuş" },
    { word: "fish", level: "beginner", category: "Animals", emoji: "🐟", turkish: "balık" },
    { word: "frog", level: "beginner", category: "Animals", emoji: "🐸", turkish: "kurbağa" },
    { word: "pig", level: "beginner", category: "Animals", emoji: "🐷", turkish: "domuz" },
    { word: "cow", level: "beginner", category: "Animals", emoji: "🐄", turkish: "inek" },
    { word: "duck", level: "beginner", category: "Animals", emoji: "🦆", turkish: "ördek" },
    { word: "lamb", level: "beginner", category: "Animals", emoji: "🐑", turkish: "kuzu" },
    { word: "owl", level: "intermediate", category: "Animals", emoji: "🦉", turkish: "baykuş" },
    { word: "snail", level: "beginner", category: "Animals", emoji: "🐌", turkish: "salyangoz" },
    { word: "shark", level: "intermediate", category: "Animals", emoji: "🦈", turkish: "köpekbalığı" },
];

// ─── THEMATIC: Colors ─────────────────────────────────────────────────────────
const colorsWords: KidsWord[] = [
    { word: "green", level: "beginner", category: "Colors", emoji: "🟢", turkish: "yeşil" },
    { word: "pink", level: "beginner", category: "Colors", emoji: "🩷", turkish: "pembe" },
    { word: "black", level: "beginner", category: "Colors", emoji: "⚫", turkish: "siyah" },
    { word: "white", level: "beginner", category: "Colors", emoji: "⚪", turkish: "beyaz" },
    { word: "brown", level: "beginner", category: "Colors", emoji: "🟤", turkish: "kahverengi" },
    { word: "gold", level: "intermediate", category: "Colors", emoji: "🥇", turkish: "altın", },
    { word: "gray", level: "beginner", category: "Colors", emoji: "🩶", turkish: "gri" },
    { word: "orange", level: "beginner", category: "Colors", emoji: "🟠", turkish: "turuncu" },
];

// ─── THEMATIC: Family ─────────────────────────────────────────────────────────
const familyWords: KidsWord[] = [
    { word: "mom", level: "beginner", category: "Family", emoji: "👩", turkish: "anne" },
    { word: "dad", level: "beginner", category: "Family", emoji: "👨", turkish: "baba" },
    { word: "baby", level: "beginner", category: "Family", emoji: "👶", turkish: "bebek" },
    { word: "sister", level: "beginner", category: "Family", emoji: "👧", turkish: "kız kardeş" },
    { word: "brother", level: "beginner", category: "Family", emoji: "👦", turkish: "erkek kardeş" },
    { word: "grandma", level: "beginner", category: "Family", emoji: "👵", turkish: "büyükanne" },
    { word: "grandpa", level: "beginner", category: "Family", emoji: "👴", turkish: "büyükbaba" },
    { word: "family", level: "beginner", category: "Family", emoji: "👨‍👩‍👧‍👦", turkish: "aile" },
];

// ─── THEMATIC: Food ───────────────────────────────────────────────────────────
const foodWords: KidsWord[] = [
    { word: "apple", level: "beginner", category: "Food", emoji: "🍎", turkish: "elma" },
    { word: "bread", level: "beginner", category: "Food", emoji: "🍞", turkish: "ekmek" },
    { word: "milk", level: "beginner", category: "Food", emoji: "🥛", turkish: "süt" },
    { word: "egg", level: "beginner", category: "Food", emoji: "🥚", turkish: "yumurta" },
    { word: "cake", level: "beginner", category: "Food", emoji: "🎂", turkish: "pasta" },
    { word: "rice", level: "beginner", category: "Food", emoji: "🍚", turkish: "pirinç" },
    { word: "meat", level: "beginner", category: "Food", emoji: "🥩", turkish: "et" },
    { word: "soup", level: "beginner", category: "Food", emoji: "🍲", turkish: "çorba" },
    { word: "juice", level: "beginner", category: "Food", emoji: "🧃", turkish: "meyve suyu" },
    { word: "water", level: "beginner", category: "Food", emoji: "💧", turkish: "su" },
    { word: "tea", level: "beginner", category: "Food", emoji: "🍵", turkish: "çay" },
    { word: "fruit", level: "beginner", category: "Food", emoji: "🍇", turkish: "meyve" },
    { word: "nut", level: "beginner", category: "Food", emoji: "🥜", turkish: "fındık" },
];

// ─── THEMATIC: Body ───────────────────────────────────────────────────────────
const bodyWords: KidsWord[] = [
    { word: "hand", level: "beginner", category: "Body", emoji: "✋", turkish: "el" },
    { word: "arm", level: "beginner", category: "Body", emoji: "💪", turkish: "kol" },
    { word: "eye", level: "beginner", category: "Body", emoji: "👁️", turkish: "göz" },
    { word: "ear", level: "beginner", category: "Body", emoji: "👂", turkish: "kulak" },
    { word: "nose", level: "beginner", category: "Body", emoji: "👃", turkish: "burun" },
    { word: "head", level: "beginner", category: "Body", emoji: "🧠", turkish: "baş" },
    { word: "foot", level: "beginner", category: "Body", emoji: "🦶", turkish: "ayak" },
    { word: "back", level: "beginner", category: "Body", emoji: "🔙", turkish: "sırt" },
];

// ─── THEMATIC: Numbers ────────────────────────────────────────────────────────
const numbersWords: KidsWord[] = [
    { word: "one", level: "beginner", category: "Numbers", emoji: "1️⃣", turkish: "bir" },
    { word: "two", level: "beginner", category: "Numbers", emoji: "2️⃣", turkish: "iki" },
    { word: "three", level: "beginner", category: "Numbers", emoji: "3️⃣", turkish: "üç" },
    { word: "four", level: "beginner", category: "Numbers", emoji: "4️⃣", turkish: "dört" },
    { word: "five", level: "beginner", category: "Numbers", emoji: "5️⃣", turkish: "beş" },
    { word: "seven", level: "beginner", category: "Numbers", emoji: "7️⃣", turkish: "yedi" },
    { word: "eight", level: "intermediate", category: "Numbers", emoji: "8️⃣", turkish: "sekiz" },
    { word: "nine", level: "beginner", category: "Numbers", emoji: "9️⃣", turkish: "dokuz" },
    { word: "ten", level: "beginner", category: "Numbers", emoji: "🔟", turkish: "on" },
];

// ─── THEMATIC: Nature ─────────────────────────────────────────────────────────
const natureWords: KidsWord[] = [
    { word: "sun", level: "beginner", category: "Nature", emoji: "☀️", turkish: "güneş" },
    { word: "leaf", level: "beginner", category: "Nature", emoji: "🍃", turkish: "yaprak" },
    { word: "snow", level: "beginner", category: "Nature", emoji: "❄️", turkish: "kar" },
    { word: "wind", level: "beginner", category: "Nature", emoji: "💨", turkish: "rüzgar" },
    { word: "hill", level: "beginner", category: "Nature", emoji: "⛰️", turkish: "tepe" },
    { word: "rock", level: "beginner", category: "Nature", emoji: "🪨", turkish: "kaya" },
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
