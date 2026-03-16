// ============================================================
// MinesMinis Curriculum Data
// Children's English Education App
// ============================================================

// --- TYPES ---

export interface VocabularyWord {
  english: string;
  turkish: string;
  emoji: string;
  category: string;
  phonetic: string;
  exampleSentence: string;
}

export interface Activity {
  id: string;
  type: 'word-match' | 'phonics-builder' | 'sentence-scramble' | 'listening-challenge' | 'spelling-bee' | 'quick-quiz' | 'story-choices';
  title: string;
  instructions: string;
  duration: number;
  xpReward: number;
}

export interface Lesson {
  id: string;
  worldId: string;
  number: number;
  title: string;
  titleTr: string;
  objective: string;
  type: 'vocabulary' | 'phonics' | 'grammar' | 'story' | 'review';
  duration: number;
  activities: Activity[];
  targetWords: string[];
  xpReward: number;
}

export interface World {
  id: string;
  number: number;
  name: string;
  nameTr: string;
  theme: string;
  description: string;
  descriptionTr: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  ageGroups: string[];
  lessons: Lesson[];
  vocabulary: VocabularyWord[];
  grammarFocus: string;
  totalXp: number;
}

// --- HELPER: make activities ---
function a(lessonId: string, n: number, type: Activity['type'], title: string, instructions: string, duration: number, xp: number): Activity {
  return { id: `${lessonId}-a${n}`, type, title, instructions, duration, xpReward: xp };
}

// --- HELPER: make lesson ---
function L(worldId: string, worldNum: number, num: number, title: string, titleTr: string, objective: string, type: Lesson['type'], duration: number, acts: [Activity['type'], string, string, number, number][], targetWords: string[], xp: number): Lesson {
  const id = `w${worldNum}-l${num}`;
  return {
    id, worldId, number: num, title, titleTr, objective, type, duration,
    activities: acts.map((ac, i) => a(id, i + 1, ac[0], ac[1], ac[2], ac[3], ac[4])),
    targetWords, xpReward: xp,
  };
}

// --- WORLD 1: Hello World ---
const w1Vocab: VocabularyWord[] = [
  { english: 'hello', turkish: 'merhaba', emoji: '👋', category: 'greetings', phonetic: '/həˈloʊ/', exampleSentence: 'Hello! How are you?' },
  { english: 'goodbye', turkish: 'hoşça kal', emoji: '👋', category: 'greetings', phonetic: '/ɡʊdˈbaɪ/', exampleSentence: 'Goodbye, see you tomorrow!' },
  { english: 'please', turkish: 'lütfen', emoji: '🙏', category: 'greetings', phonetic: '/pliːz/', exampleSentence: 'Can I have water, please?' },
  { english: 'thank you', turkish: 'teşekkür ederim', emoji: '😊', category: 'greetings', phonetic: '/θæŋk juː/', exampleSentence: 'Thank you for the gift!' },
  { english: 'yes', turkish: 'evet', emoji: '✅', category: 'greetings', phonetic: '/jɛs/', exampleSentence: 'Yes, I like ice cream.' },
  { english: 'no', turkish: 'hayır', emoji: '❌', category: 'greetings', phonetic: '/noʊ/', exampleSentence: 'No, I don\'t want that.' },
  { english: 'friend', turkish: 'arkadaş', emoji: '🤝', category: 'greetings', phonetic: '/frɛnd/', exampleSentence: 'She is my best friend.' },
  { english: 'name', turkish: 'isim', emoji: '📛', category: 'greetings', phonetic: '/neɪm/', exampleSentence: 'My name is Ali.' },
  { english: 'good morning', turkish: 'günaydın', emoji: '🌅', category: 'greetings', phonetic: '/ɡʊd ˈmɔːrnɪŋ/', exampleSentence: 'Good morning, teacher!' },
  { english: 'good night', turkish: 'iyi geceler', emoji: '🌙', category: 'greetings', phonetic: '/ɡʊd naɪt/', exampleSentence: 'Good night, sleep well!' },
  { english: 'sorry', turkish: 'özür dilerim', emoji: '😔', category: 'greetings', phonetic: '/ˈsɒri/', exampleSentence: 'I am sorry for being late.' },
  { english: 'welcome', turkish: 'hoş geldiniz', emoji: '🤗', category: 'greetings', phonetic: '/ˈwɛlkəm/', exampleSentence: 'Welcome to our school!' },
  { english: 'how are you', turkish: 'nasılsın', emoji: '💬', category: 'greetings', phonetic: '/haʊ ɑːr juː/', exampleSentence: 'Hi! How are you today?' },
  { english: 'fine', turkish: 'iyiyim', emoji: '👍', category: 'greetings', phonetic: '/faɪn/', exampleSentence: 'I am fine, thanks!' },
  { english: 'happy', turkish: 'mutlu', emoji: '😃', category: 'greetings', phonetic: '/ˈhæpi/', exampleSentence: 'I am happy to see you.' },
  { english: 'sad', turkish: 'üzgün', emoji: '😢', category: 'greetings', phonetic: '/sæd/', exampleSentence: 'She looks sad today.' },
  { english: 'hi', turkish: 'selam', emoji: '🙋', category: 'greetings', phonetic: '/haɪ/', exampleSentence: 'Hi there, friend!' },
  { english: 'bye', turkish: 'güle güle', emoji: '✋', category: 'greetings', phonetic: '/baɪ/', exampleSentence: 'Bye, see you later!' },
  { english: 'nice', turkish: 'güzel', emoji: '🌟', category: 'greetings', phonetic: '/naɪs/', exampleSentence: 'Nice to meet you!' },
  { english: 'meet', turkish: 'tanışmak', emoji: '🤝', category: 'greetings', phonetic: '/miːt/', exampleSentence: 'Let me meet your sister.' },
];

const w1Lessons: Lesson[] = [
  L('world-1', 1, 1, 'Say Hello!', 'Merhaba De!', 'Learn basic greetings', 'vocabulary', 5, [['word-match', 'Match Greetings', 'Match English greetings with Turkish', 3, 10], ['listening-challenge', 'Listen & Tap', 'Listen and tap the correct greeting', 2, 15]], ['hello', 'hi', 'goodbye', 'bye'], 30),
  L('world-1', 1, 2, 'What\'s Your Name?', 'Adın Ne?', 'Introduce yourself', 'vocabulary', 5, [['phonics-builder', 'Build Names', 'Drag letters to spell names', 3, 10], ['sentence-scramble', 'My Name Is...', 'Put the words in order', 2, 15]], ['name', 'meet', 'nice', 'friend'], 30),
  L('world-1', 1, 3, 'Please & Thank You', 'Lütfen ve Teşekkürler', 'Learn polite words', 'vocabulary', 5, [['word-match', 'Polite Match', 'Match polite words', 3, 10], ['quick-quiz', 'Polite Quiz', 'Choose the polite response', 2, 15]], ['please', 'thank you', 'sorry', 'welcome'], 30),
  L('world-1', 1, 4, 'Morning & Night', 'Sabah ve Gece', 'Time-of-day greetings', 'vocabulary', 5, [['listening-challenge', 'When Do We Say?', 'Match greeting to time of day', 3, 15], ['word-match', 'Day & Night Match', 'Match morning/night words', 2, 10]], ['good morning', 'good night'], 25),
  L('world-1', 1, 5, 'How Are You?', 'Nasılsın?', 'Ask and answer about feelings', 'grammar', 6, [['sentence-scramble', 'Build a Question', 'Arrange words to ask how are you', 3, 15], ['quick-quiz', 'Feelings Quiz', 'Pick the right feeling', 3, 15]], ['how are you', 'fine', 'happy', 'sad'], 35),
  L('world-1', 1, 6, 'Yes or No?', 'Evet mi Hayır mı?', 'Learn yes/no answers', 'grammar', 5, [['quick-quiz', 'Yes/No Quiz', 'Answer yes or no questions', 3, 15], ['listening-challenge', 'Listen & Answer', 'Listen and answer yes or no', 2, 10]], ['yes', 'no', 'fine', 'happy'], 30),
  L('world-1', 1, 7, 'Greeting Sounds', 'Selam Sesleri', 'Phonics of greeting words', 'phonics', 5, [['phonics-builder', 'Sound It Out', 'Build greeting words from sounds', 3, 15], ['spelling-bee', 'Spell Hello', 'Spell greeting words', 2, 15]], ['hello', 'please', 'name'], 35),
  L('world-1', 1, 8, 'Friendly Story', 'Arkadaşlık Hikayesi', 'Read a short greeting story', 'story', 7, [['story-choices', 'New Friend Story', 'Read and choose what to say', 4, 20], ['word-match', 'Story Words', 'Match words from the story', 3, 10]], ['friend', 'hello', 'name', 'nice', 'meet'], 40),
  L('world-1', 1, 9, 'Greeting Bee', 'Selam Arısı', 'Spelling challenge', 'review', 5, [['spelling-bee', 'Spell It!', 'Spell all the greeting words', 3, 15], ['quick-quiz', 'Quick Greeting Quiz', 'Review all greeting words', 2, 15]], ['goodbye', 'welcome', 'sorry', 'happy'], 35),
  L('world-1', 1, 10, 'Hello World Review', 'Merhaba Dünya Tekrarı', 'Review everything', 'review', 8, [['quick-quiz', 'Big Review Quiz', 'Answer questions about all greetings', 4, 20], ['sentence-scramble', 'Build Sentences', 'Make greeting sentences', 4, 20]], ['hello', 'goodbye', 'please', 'thank you', 'how are you'], 50),
];

// --- WORLD 2: My Family ---
const w2Vocab: VocabularyWord[] = [
  { english: 'mother', turkish: 'anne', emoji: '👩', category: 'family', phonetic: '/ˈmʌðər/', exampleSentence: 'My mother is kind.' },
  { english: 'father', turkish: 'baba', emoji: '👨', category: 'family', phonetic: '/ˈfɑːðər/', exampleSentence: 'My father is tall.' },
  { english: 'sister', turkish: 'kız kardeş', emoji: '👧', category: 'family', phonetic: '/ˈsɪstər/', exampleSentence: 'My sister likes to draw.' },
  { english: 'brother', turkish: 'erkek kardeş', emoji: '👦', category: 'family', phonetic: '/ˈbrʌðər/', exampleSentence: 'My brother plays football.' },
  { english: 'baby', turkish: 'bebek', emoji: '👶', category: 'family', phonetic: '/ˈbeɪbi/', exampleSentence: 'The baby is sleeping.' },
  { english: 'grandmother', turkish: 'büyükanne', emoji: '👵', category: 'family', phonetic: '/ˈɡrænˌmʌðər/', exampleSentence: 'My grandmother bakes cookies.' },
  { english: 'grandfather', turkish: 'büyükbaba', emoji: '👴', category: 'family', phonetic: '/ˈɡrænˌfɑːðər/', exampleSentence: 'My grandfather tells stories.' },
  { english: 'family', turkish: 'aile', emoji: '👨‍👩‍👧‍👦', category: 'family', phonetic: '/ˈfæməli/', exampleSentence: 'I love my family.' },
  { english: 'house', turkish: 'ev', emoji: '🏠', category: 'family', phonetic: '/haʊs/', exampleSentence: 'Our house is big.' },
  { english: 'room', turkish: 'oda', emoji: '🚪', category: 'family', phonetic: '/ruːm/', exampleSentence: 'This is my room.' },
  { english: 'kitchen', turkish: 'mutfak', emoji: '🍳', category: 'family', phonetic: '/ˈkɪtʃɪn/', exampleSentence: 'Mom cooks in the kitchen.' },
  { english: 'garden', turkish: 'bahçe', emoji: '🌻', category: 'family', phonetic: '/ˈɡɑːrdən/', exampleSentence: 'We play in the garden.' },
  { english: 'bed', turkish: 'yatak', emoji: '🛏️', category: 'family', phonetic: '/bɛd/', exampleSentence: 'I sleep in my bed.' },
  { english: 'door', turkish: 'kapı', emoji: '🚪', category: 'family', phonetic: '/dɔːr/', exampleSentence: 'Please close the door.' },
  { english: 'window', turkish: 'pencere', emoji: '🪟', category: 'family', phonetic: '/ˈwɪndoʊ/', exampleSentence: 'Open the window, please.' },
  { english: 'love', turkish: 'sevgi', emoji: '❤️', category: 'family', phonetic: '/lʌv/', exampleSentence: 'I love my family.' },
  { english: 'home', turkish: 'yuva', emoji: '🏡', category: 'family', phonetic: '/hoʊm/', exampleSentence: 'There is no place like home.' },
  { english: 'uncle', turkish: 'amca', emoji: '👨', category: 'family', phonetic: '/ˈʌŋkəl/', exampleSentence: 'My uncle lives in Istanbul.' },
  { english: 'aunt', turkish: 'teyze', emoji: '👩', category: 'family', phonetic: '/ænt/', exampleSentence: 'My aunt has a cat.' },
  { english: 'cousin', turkish: 'kuzen', emoji: '🧒', category: 'family', phonetic: '/ˈkʌzən/', exampleSentence: 'My cousin is my age.' },
];

const w2Lessons: Lesson[] = [
  L('world-2', 2, 1, 'Mom & Dad', 'Anne ve Baba', 'Learn parent words', 'vocabulary', 5, [['word-match', 'Family Match', 'Match family words', 3, 10], ['listening-challenge', 'Who Is It?', 'Listen and pick the family member', 2, 15]], ['mother', 'father', 'family'], 30),
  L('world-2', 2, 2, 'Brothers & Sisters', 'Kardeşler', 'Learn sibling words', 'vocabulary', 5, [['word-match', 'Sibling Match', 'Match sibling words', 3, 10], ['phonics-builder', 'Spell Sister', 'Build sibling words', 2, 15]], ['sister', 'brother', 'baby'], 30),
  L('world-2', 2, 3, 'Grandparents', 'Büyükanne ve Büyükbaba', 'Learn grandparent words', 'vocabulary', 5, [['word-match', 'Grand Match', 'Match grandparent words', 3, 10], ['quick-quiz', 'Who Said That?', 'Pick the right grandparent', 2, 15]], ['grandmother', 'grandfather', 'uncle', 'aunt'], 30),
  L('world-2', 2, 4, 'My House', 'Benim Evim', 'Learn house parts', 'vocabulary', 5, [['word-match', 'House Match', 'Match house words', 3, 10], ['listening-challenge', 'Where Is It?', 'Listen and find the room', 2, 15]], ['house', 'room', 'kitchen', 'garden'], 30),
  L('world-2', 2, 5, 'In My Room', 'Odamda', 'Learn room items', 'grammar', 6, [['sentence-scramble', 'This Is My...', 'Build sentences about your room', 3, 15], ['quick-quiz', 'Room Quiz', 'Answer questions about rooms', 3, 15]], ['bed', 'door', 'window', 'room'], 35),
  L('world-2', 2, 6, 'I Love My Family', 'Ailemi Seviyorum', 'Express love and family', 'grammar', 5, [['sentence-scramble', 'Love Sentences', 'Build loving sentences', 3, 15], ['word-match', 'Love Match', 'Match feelings to family', 2, 10]], ['love', 'family', 'home'], 30),
  L('world-2', 2, 7, 'Family Sounds', 'Aile Sesleri', 'Phonics of family words', 'phonics', 5, [['phonics-builder', 'Sound Families', 'Build family words from sounds', 3, 15], ['spelling-bee', 'Spell Family', 'Spell family words', 2, 15]], ['mother', 'father', 'brother'], 35),
  L('world-2', 2, 8, 'Family Story', 'Aile Hikayesi', 'A family adventure story', 'story', 7, [['story-choices', 'Family Day', 'Read about a family day out', 4, 20], ['word-match', 'Story Review', 'Match story words', 3, 10]], ['family', 'house', 'love', 'cousin', 'home'], 40),
  L('world-2', 2, 9, 'Family Spelling', 'Aile Hecelemesi', 'Spelling challenge', 'review', 5, [['spelling-bee', 'Family Bee', 'Spell family words', 3, 15], ['quick-quiz', 'Family Quick Quiz', 'Review family words', 2, 15]], ['grandmother', 'kitchen', 'window', 'garden'], 35),
  L('world-2', 2, 10, 'Family Review', 'Aile Tekrarı', 'Review all family words', 'review', 8, [['quick-quiz', 'Big Family Quiz', 'Review all family and home words', 4, 20], ['sentence-scramble', 'Family Sentences', 'Build sentences about family', 4, 20]], ['mother', 'father', 'sister', 'brother', 'house'], 50),
];

// --- WORLD 3: Animal Kingdom ---
const w3Vocab: VocabularyWord[] = [
  { english: 'cat', turkish: 'kedi', emoji: '🐱', category: 'animals', phonetic: '/kæt/', exampleSentence: 'The cat is sleeping.' },
  { english: 'dog', turkish: 'köpek', emoji: '🐶', category: 'animals', phonetic: '/dɒɡ/', exampleSentence: 'The dog is running.' },
  { english: 'bird', turkish: 'kuş', emoji: '🐦', category: 'animals', phonetic: '/bɜːrd/', exampleSentence: 'The bird can fly.' },
  { english: 'fish', turkish: 'balık', emoji: '🐟', category: 'animals', phonetic: '/fɪʃ/', exampleSentence: 'The fish swims in water.' },
  { english: 'lion', turkish: 'aslan', emoji: '🦁', category: 'animals', phonetic: '/ˈlaɪən/', exampleSentence: 'The lion is the king.' },
  { english: 'elephant', turkish: 'fil', emoji: '🐘', category: 'animals', phonetic: '/ˈɛlɪfənt/', exampleSentence: 'The elephant is big.' },
  { english: 'rabbit', turkish: 'tavşan', emoji: '🐰', category: 'animals', phonetic: '/ˈræbɪt/', exampleSentence: 'The rabbit jumps fast.' },
  { english: 'monkey', turkish: 'maymun', emoji: '🐒', category: 'animals', phonetic: '/ˈmʌŋki/', exampleSentence: 'The monkey eats bananas.' },
  { english: 'horse', turkish: 'at', emoji: '🐴', category: 'animals', phonetic: '/hɔːrs/', exampleSentence: 'The horse runs fast.' },
  { english: 'cow', turkish: 'inek', emoji: '🐄', category: 'animals', phonetic: '/kaʊ/', exampleSentence: 'The cow gives milk.' },
  { english: 'sheep', turkish: 'koyun', emoji: '🐑', category: 'animals', phonetic: '/ʃiːp/', exampleSentence: 'The sheep has soft wool.' },
  { english: 'duck', turkish: 'ördek', emoji: '🦆', category: 'animals', phonetic: '/dʌk/', exampleSentence: 'The duck swims in the pond.' },
  { english: 'bear', turkish: 'ayı', emoji: '🐻', category: 'animals', phonetic: '/bɛr/', exampleSentence: 'The bear loves honey.' },
  { english: 'frog', turkish: 'kurbağa', emoji: '🐸', category: 'animals', phonetic: '/frɒɡ/', exampleSentence: 'The frog can jump high.' },
  { english: 'butterfly', turkish: 'kelebek', emoji: '🦋', category: 'animals', phonetic: '/ˈbʌtərflaɪ/', exampleSentence: 'The butterfly is beautiful.' },
  { english: 'turtle', turkish: 'kaplumbağa', emoji: '🐢', category: 'animals', phonetic: '/ˈtɜːrtəl/', exampleSentence: 'The turtle walks slowly.' },
  { english: 'snake', turkish: 'yılan', emoji: '🐍', category: 'animals', phonetic: '/sneɪk/', exampleSentence: 'The snake is long.' },
  { english: 'penguin', turkish: 'penguen', emoji: '🐧', category: 'animals', phonetic: '/ˈpɛŋɡwɪn/', exampleSentence: 'The penguin lives in the cold.' },
  { english: 'giraffe', turkish: 'zürafa', emoji: '🦒', category: 'animals', phonetic: '/dʒɪˈræf/', exampleSentence: 'The giraffe has a long neck.' },
  { english: 'tiger', turkish: 'kaplan', emoji: '🐯', category: 'animals', phonetic: '/ˈtaɪɡər/', exampleSentence: 'The tiger has stripes.' },
];

const w3Lessons: Lesson[] = [
  L('world-3', 3, 1, 'Pet Friends', 'Evcil Dostlar', 'Learn pet animal words', 'vocabulary', 5, [['word-match', 'Pet Match', 'Match pet animals', 3, 10], ['listening-challenge', 'Animal Sounds', 'Listen to sounds and pick the animal', 2, 15]], ['cat', 'dog', 'bird', 'fish'], 30),
  L('world-3', 3, 2, 'Farm Animals', 'Çiftlik Hayvanları', 'Learn farm animals', 'vocabulary', 5, [['word-match', 'Farm Match', 'Match farm animals', 3, 10], ['phonics-builder', 'Spell Animals', 'Build animal words', 2, 15]], ['cow', 'sheep', 'horse', 'duck'], 30),
  L('world-3', 3, 3, 'Wild Animals', 'Vahşi Hayvanlar', 'Learn wild animals', 'vocabulary', 5, [['word-match', 'Wild Match', 'Match wild animals', 3, 10], ['quick-quiz', 'Wild Quiz', 'Pick the wild animal', 2, 15]], ['lion', 'tiger', 'bear', 'elephant'], 30),
  L('world-3', 3, 4, 'Small Creatures', 'Küçük Yaratıklar', 'Learn small animal words', 'vocabulary', 5, [['word-match', 'Tiny Match', 'Match small creatures', 3, 10], ['listening-challenge', 'Tiny Sounds', 'Listen and identify', 2, 15]], ['frog', 'butterfly', 'rabbit', 'turtle'], 30),
  L('world-3', 3, 5, 'What Can They Do?', 'Ne Yapabilirler?', 'Animals and their actions', 'grammar', 6, [['sentence-scramble', 'Animal Actions', 'Build animal action sentences', 3, 15], ['quick-quiz', 'Can It...?', 'Answer what animals can do', 3, 15]], ['bird', 'fish', 'frog', 'horse'], 35),
  L('world-3', 3, 6, 'Big and Small', 'Büyük ve Küçük', 'Compare animal sizes', 'grammar', 5, [['quick-quiz', 'Size Quiz', 'Pick the bigger animal', 3, 15], ['word-match', 'Size Match', 'Match animals to sizes', 2, 10]], ['elephant', 'giraffe', 'monkey', 'snake'], 30),
  L('world-3', 3, 7, 'Animal Phonics', 'Hayvan Sesleri', 'Phonics of animal words', 'phonics', 5, [['phonics-builder', 'Animal Sounds', 'Build animal words from sounds', 3, 15], ['spelling-bee', 'Animal Bee', 'Spell animal names', 2, 15]], ['cat', 'dog', 'duck', 'bear'], 35),
  L('world-3', 3, 8, 'Jungle Story', 'Orman Hikayesi', 'A jungle adventure', 'story', 7, [['story-choices', 'Jungle Adventure', 'Choose your path in the jungle', 4, 20], ['word-match', 'Story Animals', 'Match animals from the story', 3, 10]], ['lion', 'monkey', 'snake', 'butterfly', 'penguin'], 40),
  L('world-3', 3, 9, 'Animal Spelling', 'Hayvan Hecelemesi', 'Spelling challenge', 'review', 5, [['spelling-bee', 'Spell All Animals', 'Spell all animal words', 3, 15], ['quick-quiz', 'Animal Quick Quiz', 'Review animals', 2, 15]], ['elephant', 'giraffe', 'penguin', 'butterfly'], 35),
  L('world-3', 3, 10, 'Animal Kingdom Review', 'Hayvan Krallığı Tekrarı', 'Review all animals', 'review', 8, [['quick-quiz', 'Big Animal Quiz', 'Review all animal words', 4, 20], ['sentence-scramble', 'Animal Sentences', 'Build sentences about animals', 4, 20]], ['cat', 'lion', 'elephant', 'bird', 'fish'], 50),
];

// --- WORLD 4: Rainbow Colors ---
const w4Vocab: VocabularyWord[] = [
  { english: 'red', turkish: 'kırmızı', emoji: '🔴', category: 'colors', phonetic: '/rɛd/', exampleSentence: 'The apple is red.' },
  { english: 'blue', turkish: 'mavi', emoji: '🔵', category: 'colors', phonetic: '/bluː/', exampleSentence: 'The sky is blue.' },
  { english: 'green', turkish: 'yeşil', emoji: '🟢', category: 'colors', phonetic: '/ɡriːn/', exampleSentence: 'The grass is green.' },
  { english: 'yellow', turkish: 'sarı', emoji: '🟡', category: 'colors', phonetic: '/ˈjɛloʊ/', exampleSentence: 'The sun is yellow.' },
  { english: 'orange', turkish: 'turuncu', emoji: '🟠', category: 'colors', phonetic: '/ˈɔːrɪndʒ/', exampleSentence: 'The orange is orange.' },
  { english: 'purple', turkish: 'mor', emoji: '🟣', category: 'colors', phonetic: '/ˈpɜːrpəl/', exampleSentence: 'I like purple flowers.' },
  { english: 'pink', turkish: 'pembe', emoji: '🩷', category: 'colors', phonetic: '/pɪŋk/', exampleSentence: 'Her dress is pink.' },
  { english: 'black', turkish: 'siyah', emoji: '⚫', category: 'colors', phonetic: '/blæk/', exampleSentence: 'The cat is black.' },
  { english: 'white', turkish: 'beyaz', emoji: '⚪', category: 'colors', phonetic: '/waɪt/', exampleSentence: 'Snow is white.' },
  { english: 'brown', turkish: 'kahverengi', emoji: '🟤', category: 'colors', phonetic: '/braʊn/', exampleSentence: 'The bear is brown.' },
  { english: 'circle', turkish: 'daire', emoji: '⭕', category: 'shapes', phonetic: '/ˈsɜːrkəl/', exampleSentence: 'Draw a circle.' },
  { english: 'square', turkish: 'kare', emoji: '⬜', category: 'shapes', phonetic: '/skwɛr/', exampleSentence: 'The box is a square.' },
  { english: 'triangle', turkish: 'üçgen', emoji: '🔺', category: 'shapes', phonetic: '/ˈtraɪæŋɡəl/', exampleSentence: 'A triangle has three sides.' },
  { english: 'star', turkish: 'yıldız', emoji: '⭐', category: 'shapes', phonetic: '/stɑːr/', exampleSentence: 'I see a star in the sky.' },
  { english: 'heart', turkish: 'kalp', emoji: '❤️', category: 'shapes', phonetic: '/hɑːrt/', exampleSentence: 'Draw a red heart.' },
  { english: 'rainbow', turkish: 'gökkuşağı', emoji: '🌈', category: 'colors', phonetic: '/ˈreɪnboʊ/', exampleSentence: 'Look at the rainbow!' },
  { english: 'color', turkish: 'renk', emoji: '🎨', category: 'colors', phonetic: '/ˈkʌlər/', exampleSentence: 'What color do you like?' },
  { english: 'paint', turkish: 'boya', emoji: '🖌️', category: 'colors', phonetic: '/peɪnt/', exampleSentence: 'Let\'s paint a picture.' },
  { english: 'diamond', turkish: 'eşkenar dörtgen', emoji: '💎', category: 'shapes', phonetic: '/ˈdaɪmənd/', exampleSentence: 'A diamond has four sides.' },
  { english: 'rectangle', turkish: 'dikdörtgen', emoji: '▬', category: 'shapes', phonetic: '/ˈrɛktæŋɡəl/', exampleSentence: 'The door is a rectangle.' },
];

const w4Lessons: Lesson[] = [
  L('world-4', 4, 1, 'Primary Colors', 'Ana Renkler', 'Learn red, blue, yellow', 'vocabulary', 5, [['word-match', 'Color Match', 'Match colors to names', 3, 10], ['listening-challenge', 'Color Listen', 'Listen and tap the color', 2, 15]], ['red', 'blue', 'yellow'], 30),
  L('world-4', 4, 2, 'More Colors', 'Daha Fazla Renk', 'Learn green, orange, purple', 'vocabulary', 5, [['word-match', 'More Color Match', 'Match more colors', 3, 10], ['phonics-builder', 'Color Builder', 'Build color words', 2, 15]], ['green', 'orange', 'purple', 'pink'], 30),
  L('world-4', 4, 3, 'Light & Dark', 'Açık ve Koyu', 'Learn black, white, brown', 'vocabulary', 5, [['word-match', 'Light Dark Match', 'Match black white brown', 3, 10], ['quick-quiz', 'What Color Is It?', 'Identify colors in pictures', 2, 15]], ['black', 'white', 'brown'], 30),
  L('world-4', 4, 4, 'Basic Shapes', 'Temel Şekiller', 'Learn circle, square, triangle', 'vocabulary', 5, [['word-match', 'Shape Match', 'Match shapes', 3, 10], ['listening-challenge', 'Shape Listen', 'Listen and find the shape', 2, 15]], ['circle', 'square', 'triangle', 'rectangle'], 30),
  L('world-4', 4, 5, 'Fun Shapes', 'Eğlenceli Şekiller', 'Learn star, heart, diamond', 'vocabulary', 6, [['word-match', 'Fun Shape Match', 'Match fun shapes', 3, 15], ['quick-quiz', 'Shape Quiz', 'Pick the right shape', 3, 15]], ['star', 'heart', 'diamond'], 35),
  L('world-4', 4, 6, 'Colorful Sentences', 'Renkli Cümleler', 'Use colors in sentences', 'grammar', 5, [['sentence-scramble', 'Color Sentences', 'Build sentences with colors', 3, 15], ['quick-quiz', 'What Color?', 'Answer color questions', 2, 10]], ['color', 'rainbow', 'paint'], 30),
  L('world-4', 4, 7, 'Color Phonics', 'Renk Sesleri', 'Phonics of color words', 'phonics', 5, [['phonics-builder', 'Color Sounds', 'Build colors from sounds', 3, 15], ['spelling-bee', 'Color Bee', 'Spell color names', 2, 15]], ['purple', 'orange', 'yellow'], 35),
  L('world-4', 4, 8, 'Rainbow Story', 'Gökkuşağı Hikayesi', 'A colorful adventure', 'story', 7, [['story-choices', 'Rainbow Quest', 'Find all rainbow colors', 4, 20], ['word-match', 'Story Colors', 'Match story words', 3, 10]], ['rainbow', 'red', 'blue', 'green', 'yellow'], 40),
  L('world-4', 4, 9, 'Shape Spelling', 'Şekil Hecelemesi', 'Spell shapes and colors', 'review', 5, [['spelling-bee', 'Shape & Color Bee', 'Spell shapes and colors', 3, 15], ['quick-quiz', 'Quick Color Quiz', 'Review colors', 2, 15]], ['triangle', 'rectangle', 'diamond', 'circle'], 35),
  L('world-4', 4, 10, 'Rainbow Review', 'Gökkuşağı Tekrarı', 'Review all colors and shapes', 'review', 8, [['quick-quiz', 'Big Color Quiz', 'Review everything', 4, 20], ['sentence-scramble', 'Color Shape Sentences', 'Build sentences', 4, 20]], ['red', 'blue', 'circle', 'star', 'rainbow'], 50),
];

// --- WORLD 5: Yummy Food ---
const w5Vocab: VocabularyWord[] = [
  { english: 'apple', turkish: 'elma', emoji: '🍎', category: 'food', phonetic: '/ˈæpəl/', exampleSentence: 'I eat an apple every day.' },
  { english: 'banana', turkish: 'muz', emoji: '🍌', category: 'food', phonetic: '/bəˈnænə/', exampleSentence: 'The monkey loves bananas.' },
  { english: 'bread', turkish: 'ekmek', emoji: '🍞', category: 'food', phonetic: '/brɛd/', exampleSentence: 'I have bread for breakfast.' },
  { english: 'milk', turkish: 'süt', emoji: '🥛', category: 'food', phonetic: '/mɪlk/', exampleSentence: 'I drink milk every morning.' },
  { english: 'water', turkish: 'su', emoji: '💧', category: 'food', phonetic: '/ˈwɔːtər/', exampleSentence: 'Can I have some water?' },
  { english: 'cheese', turkish: 'peynir', emoji: '🧀', category: 'food', phonetic: '/tʃiːz/', exampleSentence: 'I like cheese on my bread.' },
  { english: 'egg', turkish: 'yumurta', emoji: '🥚', category: 'food', phonetic: '/ɛɡ/', exampleSentence: 'I eat an egg for breakfast.' },
  { english: 'rice', turkish: 'pirinç', emoji: '🍚', category: 'food', phonetic: '/raɪs/', exampleSentence: 'We have rice for lunch.' },
  { english: 'chicken', turkish: 'tavuk', emoji: '🍗', category: 'food', phonetic: '/ˈtʃɪkɪn/', exampleSentence: 'Chicken is my favorite food.' },
  { english: 'cake', turkish: 'pasta', emoji: '🎂', category: 'food', phonetic: '/keɪk/', exampleSentence: 'I love chocolate cake.' },
  { english: 'ice cream', turkish: 'dondurma', emoji: '🍦', category: 'food', phonetic: '/aɪs kriːm/', exampleSentence: 'I want ice cream, please!' },
  { english: 'pizza', turkish: 'pizza', emoji: '🍕', category: 'food', phonetic: '/ˈpiːtsə/', exampleSentence: 'We eat pizza on Fridays.' },
  { english: 'soup', turkish: 'çorba', emoji: '🍲', category: 'food', phonetic: '/suːp/', exampleSentence: 'Hot soup is yummy.' },
  { english: 'juice', turkish: 'meyve suyu', emoji: '🧃', category: 'food', phonetic: '/dʒuːs/', exampleSentence: 'I like orange juice.' },
  { english: 'strawberry', turkish: 'çilek', emoji: '🍓', category: 'food', phonetic: '/ˈstrɔːbəri/', exampleSentence: 'Strawberries are sweet.' },
  { english: 'grape', turkish: 'üzüm', emoji: '🍇', category: 'food', phonetic: '/ɡreɪp/', exampleSentence: 'I love purple grapes.' },
  { english: 'carrot', turkish: 'havuç', emoji: '🥕', category: 'food', phonetic: '/ˈkærət/', exampleSentence: 'Rabbits like carrots.' },
  { english: 'tomato', turkish: 'domates', emoji: '🍅', category: 'food', phonetic: '/təˈmeɪtoʊ/', exampleSentence: 'The tomato is red.' },
  { english: 'hungry', turkish: 'aç', emoji: '😋', category: 'food', phonetic: '/ˈhʌŋɡri/', exampleSentence: 'I am hungry!' },
  { english: 'yummy', turkish: 'lezzetli', emoji: '😊', category: 'food', phonetic: '/ˈjʌmi/', exampleSentence: 'This cake is yummy!' },
];

const w5Lessons: Lesson[] = [
  L('world-5', 5, 1, 'Fruits', 'Meyveler', 'Learn fruit words', 'vocabulary', 5, [['word-match', 'Fruit Match', 'Match fruits', 3, 10], ['listening-challenge', 'Fruit Listen', 'Listen and pick the fruit', 2, 15]], ['apple', 'banana', 'strawberry', 'grape'], 30),
  L('world-5', 5, 2, 'Vegetables', 'Sebzeler', 'Learn vegetable words', 'vocabulary', 5, [['word-match', 'Veggie Match', 'Match vegetables', 3, 10], ['phonics-builder', 'Veggie Builder', 'Build veggie words', 2, 15]], ['carrot', 'tomato'], 25),
  L('world-5', 5, 3, 'Breakfast Time', 'Kahvaltı Zamanı', 'Breakfast food words', 'vocabulary', 5, [['word-match', 'Breakfast Match', 'Match breakfast foods', 3, 10], ['quick-quiz', 'Breakfast Quiz', 'What do you eat?', 2, 15]], ['bread', 'milk', 'egg', 'cheese'], 30),
  L('world-5', 5, 4, 'Lunch & Dinner', 'Öğle ve Akşam', 'Meal words', 'vocabulary', 5, [['word-match', 'Meal Match', 'Match meal foods', 3, 10], ['listening-challenge', 'Food Listen', 'Listen and pick the food', 2, 15]], ['chicken', 'rice', 'soup', 'pizza'], 30),
  L('world-5', 5, 5, 'Drinks & Treats', 'İçecekler ve Tatlılar', 'Learn drink and dessert words', 'vocabulary', 6, [['word-match', 'Drink Match', 'Match drinks and treats', 3, 15], ['quick-quiz', 'Treat Quiz', 'Pick the yummy treat', 3, 15]], ['water', 'juice', 'cake', 'ice cream'], 35),
  L('world-5', 5, 6, 'I Am Hungry!', 'Acıktım!', 'Express hunger and preferences', 'grammar', 5, [['sentence-scramble', 'Hungry Sentences', 'Build food sentences', 3, 15], ['quick-quiz', 'Food Feelings', 'Express food feelings', 2, 10]], ['hungry', 'yummy', 'water'], 30),
  L('world-5', 5, 7, 'Food Phonics', 'Yemek Sesleri', 'Phonics of food words', 'phonics', 5, [['phonics-builder', 'Food Sounds', 'Build food words from sounds', 3, 15], ['spelling-bee', 'Food Bee', 'Spell food words', 2, 15]], ['apple', 'bread', 'cheese'], 35),
  L('world-5', 5, 8, 'Kitchen Story', 'Mutfak Hikayesi', 'A cooking adventure', 'story', 7, [['story-choices', 'Cooking Fun', 'Help cook a meal', 4, 20], ['word-match', 'Story Foods', 'Match story foods', 3, 10]], ['cake', 'egg', 'milk', 'strawberry', 'yummy'], 40),
  L('world-5', 5, 9, 'Food Spelling', 'Yemek Hecelemesi', 'Spelling challenge', 'review', 5, [['spelling-bee', 'Food Spell', 'Spell food words', 3, 15], ['quick-quiz', 'Quick Food Quiz', 'Review food words', 2, 15]], ['banana', 'chicken', 'pizza', 'juice'], 35),
  L('world-5', 5, 10, 'Yummy Review', 'Lezzetli Tekrar', 'Review all food words', 'review', 8, [['quick-quiz', 'Big Food Quiz', 'Review everything', 4, 20], ['sentence-scramble', 'Food Sentences', 'Build food sentences', 4, 20]], ['apple', 'milk', 'chicken', 'cake', 'hungry'], 50),
];

// --- WORLD 6: My Body ---
const w6Vocab: VocabularyWord[] = [
  { english: 'head', turkish: 'baş', emoji: '🗣️', category: 'body', phonetic: '/hɛd/', exampleSentence: 'Touch your head!' },
  { english: 'hand', turkish: 'el', emoji: '✋', category: 'body', phonetic: '/hænd/', exampleSentence: 'Raise your hand.' },
  { english: 'foot', turkish: 'ayak', emoji: '🦶', category: 'body', phonetic: '/fʊt/', exampleSentence: 'I hurt my foot.' },
  { english: 'eye', turkish: 'göz', emoji: '👁️', category: 'body', phonetic: '/aɪ/', exampleSentence: 'I have brown eyes.' },
  { english: 'ear', turkish: 'kulak', emoji: '👂', category: 'body', phonetic: '/ɪr/', exampleSentence: 'I hear with my ears.' },
  { english: 'nose', turkish: 'burun', emoji: '👃', category: 'body', phonetic: '/noʊz/', exampleSentence: 'I smell with my nose.' },
  { english: 'mouth', turkish: 'ağız', emoji: '👄', category: 'body', phonetic: '/maʊθ/', exampleSentence: 'Open your mouth.' },
  { english: 'tooth', turkish: 'diş', emoji: '🦷', category: 'body', phonetic: '/tuːθ/', exampleSentence: 'Brush your teeth.' },
  { english: 'hair', turkish: 'saç', emoji: '💇', category: 'body', phonetic: '/hɛr/', exampleSentence: 'She has long hair.' },
  { english: 'arm', turkish: 'kol', emoji: '💪', category: 'body', phonetic: '/ɑːrm/', exampleSentence: 'Stretch your arms.' },
  { english: 'leg', turkish: 'bacak', emoji: '🦵', category: 'body', phonetic: '/lɛɡ/', exampleSentence: 'I run with my legs.' },
  { english: 'finger', turkish: 'parmak', emoji: '☝️', category: 'body', phonetic: '/ˈfɪŋɡər/', exampleSentence: 'I have ten fingers.' },
  { english: 'face', turkish: 'yüz', emoji: '😊', category: 'body', phonetic: '/feɪs/', exampleSentence: 'Wash your face.' },
  { english: 'shoulder', turkish: 'omuz', emoji: '🤷', category: 'body', phonetic: '/ˈʃoʊldər/', exampleSentence: 'Touch your shoulders.' },
  { english: 'knee', turkish: 'diz', emoji: '🦵', category: 'body', phonetic: '/niː/', exampleSentence: 'Bend your knees.' },
  { english: 'stomach', turkish: 'karın', emoji: '🤰', category: 'body', phonetic: '/ˈstʌmək/', exampleSentence: 'My stomach is full.' },
  { english: 'strong', turkish: 'güçlü', emoji: '💪', category: 'health', phonetic: '/strɒŋ/', exampleSentence: 'Exercise makes you strong.' },
  { english: 'healthy', turkish: 'sağlıklı', emoji: '🏃', category: 'health', phonetic: '/ˈhɛlθi/', exampleSentence: 'Eat fruits to stay healthy.' },
  { english: 'sick', turkish: 'hasta', emoji: '🤒', category: 'health', phonetic: '/sɪk/', exampleSentence: 'I feel sick today.' },
  { english: 'clean', turkish: 'temiz', emoji: '🧼', category: 'health', phonetic: '/kliːn/', exampleSentence: 'Wash your hands clean.' },
];

const w6Lessons: Lesson[] = [
  L('world-6', 6, 1, 'Head, Shoulders...', 'Baş, Omuzlar...', 'Learn head and face words', 'vocabulary', 5, [['word-match', 'Face Match', 'Match face parts', 3, 10], ['listening-challenge', 'Touch Your...', 'Listen and touch body part', 2, 15]], ['head', 'eye', 'ear', 'nose', 'mouth'], 30),
  L('world-6', 6, 2, 'Hands & Feet', 'Eller ve Ayaklar', 'Learn limb words', 'vocabulary', 5, [['word-match', 'Limb Match', 'Match hand and foot words', 3, 10], ['phonics-builder', 'Body Builder', 'Build body words', 2, 15]], ['hand', 'foot', 'arm', 'leg'], 30),
  L('world-6', 6, 3, 'My Face', 'Yüzüm', 'Face detail words', 'vocabulary', 5, [['word-match', 'Detail Match', 'Match face details', 3, 10], ['quick-quiz', 'Face Quiz', 'Identify face parts', 2, 15]], ['face', 'hair', 'tooth', 'mouth'], 30),
  L('world-6', 6, 4, 'More Body Parts', 'Daha Fazla', 'Learn more body parts', 'vocabulary', 5, [['word-match', 'Body Match', 'Match body parts', 3, 10], ['listening-challenge', 'Body Listen', 'Listen and identify', 2, 15]], ['finger', 'shoulder', 'knee', 'stomach'], 30),
  L('world-6', 6, 5, 'I Can Move!', 'Hareket Edebilirim!', 'Body actions', 'grammar', 6, [['sentence-scramble', 'Move Sentences', 'Build action sentences', 3, 15], ['quick-quiz', 'Action Quiz', 'What can you do?', 3, 15]], ['arm', 'leg', 'hand', 'foot'], 35),
  L('world-6', 6, 6, 'Stay Healthy', 'Sağlıklı Kal', 'Health vocabulary', 'grammar', 5, [['sentence-scramble', 'Health Sentences', 'Build health sentences', 3, 15], ['word-match', 'Health Match', 'Match health words', 2, 10]], ['strong', 'healthy', 'sick', 'clean'], 30),
  L('world-6', 6, 7, 'Body Phonics', 'Vücut Sesleri', 'Phonics of body words', 'phonics', 5, [['phonics-builder', 'Body Sounds', 'Build body words from sounds', 3, 15], ['spelling-bee', 'Body Bee', 'Spell body words', 2, 15]], ['head', 'hand', 'nose'], 35),
  L('world-6', 6, 8, 'Doctor Story', 'Doktor Hikayesi', 'A visit to the doctor', 'story', 7, [['story-choices', 'Doctor Visit', 'Go to the doctor', 4, 20], ['word-match', 'Story Words', 'Match story words', 3, 10]], ['sick', 'healthy', 'stomach', 'strong', 'clean'], 40),
  L('world-6', 6, 9, 'Body Spelling', 'Vücut Hecelemesi', 'Spelling challenge', 'review', 5, [['spelling-bee', 'Body Spell', 'Spell body words', 3, 15], ['quick-quiz', 'Quick Body Quiz', 'Review body words', 2, 15]], ['shoulder', 'finger', 'stomach', 'healthy'], 35),
  L('world-6', 6, 10, 'My Body Review', 'Vücudum Tekrarı', 'Review all body words', 'review', 8, [['quick-quiz', 'Big Body Quiz', 'Review everything', 4, 20], ['sentence-scramble', 'Body Sentences', 'Build sentences', 4, 20]], ['head', 'hand', 'eye', 'strong', 'clean'], 50),
];

// --- WORLD 7: Nature Explorer ---
const w7Vocab: VocabularyWord[] = [
  { english: 'tree', turkish: 'ağaç', emoji: '🌳', category: 'nature', phonetic: '/triː/', exampleSentence: 'The tree is tall.' },
  { english: 'flower', turkish: 'çiçek', emoji: '🌸', category: 'nature', phonetic: '/ˈflaʊər/', exampleSentence: 'The flower smells nice.' },
  { english: 'sun', turkish: 'güneş', emoji: '☀️', category: 'weather', phonetic: '/sʌn/', exampleSentence: 'The sun is shining.' },
  { english: 'moon', turkish: 'ay', emoji: '🌙', category: 'nature', phonetic: '/muːn/', exampleSentence: 'The moon is bright tonight.' },
  { english: 'rain', turkish: 'yağmur', emoji: '🌧️', category: 'weather', phonetic: '/reɪn/', exampleSentence: 'I love the rain.' },
  { english: 'snow', turkish: 'kar', emoji: '❄️', category: 'weather', phonetic: '/snoʊ/', exampleSentence: 'The snow is white.' },
  { english: 'wind', turkish: 'rüzgar', emoji: '💨', category: 'weather', phonetic: '/wɪnd/', exampleSentence: 'The wind is blowing.' },
  { english: 'cloud', turkish: 'bulut', emoji: '☁️', category: 'weather', phonetic: '/klaʊd/', exampleSentence: 'The cloud is fluffy.' },
  { english: 'river', turkish: 'nehir', emoji: '🏞️', category: 'nature', phonetic: '/ˈrɪvər/', exampleSentence: 'The river flows fast.' },
  { english: 'mountain', turkish: 'dağ', emoji: '⛰️', category: 'nature', phonetic: '/ˈmaʊntən/', exampleSentence: 'The mountain is very high.' },
  { english: 'sea', turkish: 'deniz', emoji: '🌊', category: 'nature', phonetic: '/siː/', exampleSentence: 'I swim in the sea.' },
  { english: 'sky', turkish: 'gökyüzü', emoji: '🌤️', category: 'nature', phonetic: '/skaɪ/', exampleSentence: 'The sky is blue.' },
  { english: 'grass', turkish: 'çimen', emoji: '🌱', category: 'nature', phonetic: '/ɡræs/', exampleSentence: 'The grass is green.' },
  { english: 'leaf', turkish: 'yaprak', emoji: '🍃', category: 'nature', phonetic: '/liːf/', exampleSentence: 'The leaf falls from the tree.' },
  { english: 'rock', turkish: 'kaya', emoji: '🪨', category: 'nature', phonetic: '/rɒk/', exampleSentence: 'I found a big rock.' },
  { english: 'hot', turkish: 'sıcak', emoji: '🥵', category: 'weather', phonetic: '/hɒt/', exampleSentence: 'It is hot today.' },
  { english: 'cold', turkish: 'soğuk', emoji: '🥶', category: 'weather', phonetic: '/koʊld/', exampleSentence: 'It is cold outside.' },
  { english: 'spring', turkish: 'ilkbahar', emoji: '🌷', category: 'weather', phonetic: '/sprɪŋ/', exampleSentence: 'Flowers bloom in spring.' },
  { english: 'summer', turkish: 'yaz', emoji: '🏖️', category: 'weather', phonetic: '/ˈsʌmər/', exampleSentence: 'I love summer holidays.' },
  { english: 'winter', turkish: 'kış', emoji: '⛄', category: 'weather', phonetic: '/ˈwɪntər/', exampleSentence: 'It snows in winter.' },
];

const w7Lessons: Lesson[] = [
  L('world-7', 7, 1, 'Plants & Trees', 'Bitkiler ve Ağaçlar', 'Learn plant words', 'vocabulary', 5, [['word-match', 'Plant Match', 'Match plants', 3, 10], ['listening-challenge', 'Nature Listen', 'Listen and pick the plant', 2, 15]], ['tree', 'flower', 'grass', 'leaf'], 30),
  L('world-7', 7, 2, 'Land & Water', 'Kara ve Su', 'Learn landscape words', 'vocabulary', 5, [['word-match', 'Land Match', 'Match landscapes', 3, 10], ['phonics-builder', 'Nature Builder', 'Build nature words', 2, 15]], ['river', 'mountain', 'sea', 'rock'], 30),
  L('world-7', 7, 3, 'The Sky Above', 'Yukarıdaki Gökyüzü', 'Learn sky words', 'vocabulary', 5, [['word-match', 'Sky Match', 'Match sky words', 3, 10], ['quick-quiz', 'Sky Quiz', 'Identify sky objects', 2, 15]], ['sun', 'moon', 'sky', 'cloud'], 30),
  L('world-7', 7, 4, 'Rainy Days', 'Yağmurlu Günler', 'Learn weather words', 'vocabulary', 5, [['word-match', 'Weather Match', 'Match weather words', 3, 10], ['listening-challenge', 'Weather Listen', 'Listen to weather sounds', 2, 15]], ['rain', 'snow', 'wind', 'cloud'], 30),
  L('world-7', 7, 5, 'Hot or Cold?', 'Sıcak mı Soğuk mu?', 'Temperature words', 'grammar', 6, [['sentence-scramble', 'Weather Sentences', 'Build weather sentences', 3, 15], ['quick-quiz', 'Temperature Quiz', 'Pick hot or cold', 3, 15]], ['hot', 'cold', 'sun', 'snow'], 35),
  L('world-7', 7, 6, 'Four Seasons', 'Dört Mevsim', 'Learn season words', 'grammar', 5, [['sentence-scramble', 'Season Sentences', 'Build season sentences', 3, 15], ['word-match', 'Season Match', 'Match seasons', 2, 10]], ['spring', 'summer', 'winter'], 30),
  L('world-7', 7, 7, 'Nature Phonics', 'Doğa Sesleri', 'Phonics of nature words', 'phonics', 5, [['phonics-builder', 'Nature Sounds', 'Build nature words', 3, 15], ['spelling-bee', 'Nature Bee', 'Spell nature words', 2, 15]], ['tree', 'rain', 'cloud'], 35),
  L('world-7', 7, 8, 'Forest Story', 'Orman Hikayesi', 'A nature adventure', 'story', 7, [['story-choices', 'Forest Walk', 'Explore the forest', 4, 20], ['word-match', 'Story Nature', 'Match story words', 3, 10]], ['tree', 'river', 'flower', 'mountain', 'leaf'], 40),
  L('world-7', 7, 9, 'Weather Spelling', 'Hava Hecelemesi', 'Spelling challenge', 'review', 5, [['spelling-bee', 'Weather Spell', 'Spell weather words', 3, 15], ['quick-quiz', 'Nature Quick Quiz', 'Review nature words', 2, 15]], ['mountain', 'flower', 'winter', 'summer'], 35),
  L('world-7', 7, 10, 'Nature Review', 'Doğa Tekrarı', 'Review all nature words', 'review', 8, [['quick-quiz', 'Big Nature Quiz', 'Review everything', 4, 20], ['sentence-scramble', 'Nature Sentences', 'Build sentences', 4, 20]], ['tree', 'sun', 'rain', 'sea', 'hot'], 50),
];

// --- WORLD 8: Toy Town ---
const w8Vocab: VocabularyWord[] = [
  { english: 'ball', turkish: 'top', emoji: '⚽', category: 'toys', phonetic: '/bɔːl/', exampleSentence: 'I play with my ball.' },
  { english: 'doll', turkish: 'bebek', emoji: '🪆', category: 'toys', phonetic: '/dɒl/', exampleSentence: 'My doll has a pink dress.' },
  { english: 'car', turkish: 'araba', emoji: '🚗', category: 'toys', phonetic: '/kɑːr/', exampleSentence: 'My toy car is fast.' },
  { english: 'teddy bear', turkish: 'oyuncak ayı', emoji: '🧸', category: 'toys', phonetic: '/ˈtɛdi bɛr/', exampleSentence: 'I sleep with my teddy bear.' },
  { english: 'puzzle', turkish: 'yapboz', emoji: '🧩', category: 'toys', phonetic: '/ˈpʌzəl/', exampleSentence: 'I love doing puzzles.' },
  { english: 'robot', turkish: 'robot', emoji: '🤖', category: 'toys', phonetic: '/ˈroʊbɒt/', exampleSentence: 'My robot can walk.' },
  { english: 'kite', turkish: 'uçurtma', emoji: '🪁', category: 'toys', phonetic: '/kaɪt/', exampleSentence: 'I fly my kite in the wind.' },
  { english: 'blocks', turkish: 'bloklar', emoji: '🧱', category: 'toys', phonetic: '/blɒks/', exampleSentence: 'I build towers with blocks.' },
  { english: 'bicycle', turkish: 'bisiklet', emoji: '🚲', category: 'toys', phonetic: '/ˈbaɪsɪkəl/', exampleSentence: 'I ride my bicycle.' },
  { english: 'train', turkish: 'tren', emoji: '🚂', category: 'toys', phonetic: '/treɪn/', exampleSentence: 'The toy train goes around.' },
  { english: 'play', turkish: 'oynamak', emoji: '🎮', category: 'play', phonetic: '/pleɪ/', exampleSentence: 'Let\'s play together!' },
  { english: 'game', turkish: 'oyun', emoji: '🎲', category: 'play', phonetic: '/ɡeɪm/', exampleSentence: 'This is a fun game.' },
  { english: 'jump', turkish: 'zıplamak', emoji: '🤸', category: 'play', phonetic: '/dʒʌmp/', exampleSentence: 'I can jump high.' },
  { english: 'run', turkish: 'koşmak', emoji: '🏃', category: 'play', phonetic: '/rʌn/', exampleSentence: 'I run in the park.' },
  { english: 'catch', turkish: 'yakalamak', emoji: '🫴', category: 'play', phonetic: '/kætʃ/', exampleSentence: 'Catch the ball!' },
  { english: 'throw', turkish: 'atmak', emoji: '🤾', category: 'play', phonetic: '/θroʊ/', exampleSentence: 'Throw the ball to me.' },
  { english: 'draw', turkish: 'çizmek', emoji: '✏️', category: 'play', phonetic: '/drɔː/', exampleSentence: 'I draw a picture.' },
  { english: 'sing', turkish: 'şarkı söylemek', emoji: '🎤', category: 'play', phonetic: '/sɪŋ/', exampleSentence: 'I love to sing.' },
  { english: 'dance', turkish: 'dans etmek', emoji: '💃', category: 'play', phonetic: '/dæns/', exampleSentence: 'Let\'s dance to music!' },
  { english: 'fun', turkish: 'eğlenceli', emoji: '🎉', category: 'play', phonetic: '/fʌn/', exampleSentence: 'Playing is fun!' },
];

const w8Lessons: Lesson[] = [
  L('world-8', 8, 1, 'My Toys', 'Oyuncaklarım', 'Learn toy names', 'vocabulary', 5, [['word-match', 'Toy Match', 'Match toy words', 3, 10], ['listening-challenge', 'Toy Listen', 'Listen and pick the toy', 2, 15]], ['ball', 'doll', 'car', 'teddy bear'], 30),
  L('world-8', 8, 2, 'More Toys', 'Daha Fazla Oyuncak', 'Learn more toy words', 'vocabulary', 5, [['word-match', 'More Toy Match', 'Match more toys', 3, 10], ['phonics-builder', 'Toy Builder', 'Build toy words', 2, 15]], ['puzzle', 'robot', 'kite', 'blocks'], 30),
  L('world-8', 8, 3, 'Wheels & Tracks', 'Tekerlekler ve Raylar', 'Vehicle toys', 'vocabulary', 5, [['word-match', 'Vehicle Match', 'Match vehicle toys', 3, 10], ['quick-quiz', 'Vehicle Quiz', 'Identify vehicles', 2, 15]], ['car', 'bicycle', 'train'], 30),
  L('world-8', 8, 4, 'Let\'s Play!', 'Hadi Oynayalım!', 'Learn play action words', 'vocabulary', 5, [['word-match', 'Action Match', 'Match play actions', 3, 10], ['listening-challenge', 'Action Listen', 'Listen and do', 2, 15]], ['play', 'game', 'jump', 'run'], 30),
  L('world-8', 8, 5, 'Catch & Throw', 'Yakala ve At', 'More play actions', 'grammar', 6, [['sentence-scramble', 'Play Sentences', 'Build play sentences', 3, 15], ['quick-quiz', 'Action Quiz', 'Pick the right action', 3, 15]], ['catch', 'throw', 'draw', 'sing'], 35),
  L('world-8', 8, 6, 'Fun & Games', 'Eğlence ve Oyunlar', 'Express fun', 'grammar', 5, [['sentence-scramble', 'Fun Sentences', 'Build fun sentences', 3, 15], ['word-match', 'Fun Match', 'Match fun words', 2, 10]], ['fun', 'dance', 'game', 'play'], 30),
  L('world-8', 8, 7, 'Toy Phonics', 'Oyuncak Sesleri', 'Phonics of toy words', 'phonics', 5, [['phonics-builder', 'Toy Sounds', 'Build toy words from sounds', 3, 15], ['spelling-bee', 'Toy Bee', 'Spell toy words', 2, 15]], ['ball', 'kite', 'train'], 35),
  L('world-8', 8, 8, 'Toy Story', 'Oyuncak Hikayesi', 'An adventure in toy town', 'story', 7, [['story-choices', 'Toy Adventure', 'Explore toy town', 4, 20], ['word-match', 'Story Toys', 'Match story words', 3, 10]], ['robot', 'teddy bear', 'ball', 'fun', 'dance'], 40),
  L('world-8', 8, 9, 'Play Spelling', 'Oyun Hecelemesi', 'Spelling challenge', 'review', 5, [['spelling-bee', 'Play Spell', 'Spell play words', 3, 15], ['quick-quiz', 'Quick Toy Quiz', 'Review toys', 2, 15]], ['bicycle', 'puzzle', 'robot', 'blocks'], 35),
  L('world-8', 8, 10, 'Toy Town Review', 'Oyuncak Şehri Tekrarı', 'Review all toy words', 'review', 8, [['quick-quiz', 'Big Toy Quiz', 'Review everything', 4, 20], ['sentence-scramble', 'Toy Sentences', 'Build sentences', 4, 20]], ['ball', 'robot', 'play', 'jump', 'fun'], 50),
];

// --- WORLD 9: School Days ---
const w9Vocab: VocabularyWord[] = [
  { english: 'book', turkish: 'kitap', emoji: '📕', category: 'school', phonetic: '/bʊk/', exampleSentence: 'I read a book.' },
  { english: 'pencil', turkish: 'kalem', emoji: '✏️', category: 'school', phonetic: '/ˈpɛnsəl/', exampleSentence: 'I write with a pencil.' },
  { english: 'teacher', turkish: 'öğretmen', emoji: '👩‍🏫', category: 'school', phonetic: '/ˈtiːtʃər/', exampleSentence: 'The teacher is kind.' },
  { english: 'student', turkish: 'öğrenci', emoji: '🧑‍🎓', category: 'school', phonetic: '/ˈstjuːdənt/', exampleSentence: 'I am a student.' },
  { english: 'desk', turkish: 'sıra', emoji: '🪑', category: 'school', phonetic: '/dɛsk/', exampleSentence: 'Sit at your desk.' },
  { english: 'board', turkish: 'tahta', emoji: '📋', category: 'school', phonetic: '/bɔːrd/', exampleSentence: 'Look at the board.' },
  { english: 'eraser', turkish: 'silgi', emoji: '🧹', category: 'school', phonetic: '/ɪˈreɪzər/', exampleSentence: 'Use the eraser.' },
  { english: 'ruler', turkish: 'cetvel', emoji: '📏', category: 'school', phonetic: '/ˈruːlər/', exampleSentence: 'Draw a line with a ruler.' },
  { english: 'school', turkish: 'okul', emoji: '🏫', category: 'school', phonetic: '/skuːl/', exampleSentence: 'I go to school every day.' },
  { english: 'classroom', turkish: 'sınıf', emoji: '🏫', category: 'school', phonetic: '/ˈklæsruːm/', exampleSentence: 'Our classroom is big.' },
  { english: 'read', turkish: 'okumak', emoji: '📖', category: 'school', phonetic: '/riːd/', exampleSentence: 'I read books every day.' },
  { english: 'write', turkish: 'yazmak', emoji: '✍️', category: 'school', phonetic: '/raɪt/', exampleSentence: 'I write my name.' },
  { english: 'count', turkish: 'saymak', emoji: '🔢', category: 'school', phonetic: '/kaʊnt/', exampleSentence: 'Let\'s count to ten.' },
  { english: 'learn', turkish: 'öğrenmek', emoji: '🧠', category: 'school', phonetic: '/lɜːrn/', exampleSentence: 'I love to learn English.' },
  { english: 'homework', turkish: 'ödev', emoji: '📝', category: 'school', phonetic: '/ˈhoʊmwɜːrk/', exampleSentence: 'I do my homework.' },
  { english: 'number', turkish: 'sayı', emoji: '🔢', category: 'school', phonetic: '/ˈnʌmbər/', exampleSentence: 'What number is this?' },
  { english: 'letter', turkish: 'harf', emoji: '🔤', category: 'school', phonetic: '/ˈlɛtər/', exampleSentence: 'A is the first letter.' },
  { english: 'paper', turkish: 'kağıt', emoji: '📄', category: 'school', phonetic: '/ˈpeɪpər/', exampleSentence: 'Write on the paper.' },
  { english: 'bag', turkish: 'çanta', emoji: '🎒', category: 'school', phonetic: '/bæɡ/', exampleSentence: 'Put your books in your bag.' },
  { english: 'color pencil', turkish: 'boya kalemi', emoji: '🖍️', category: 'school', phonetic: '/ˈkʌlər ˈpɛnsəl/', exampleSentence: 'I draw with color pencils.' },
];

const w9Lessons: Lesson[] = [
  L('world-9', 9, 1, 'School Supplies', 'Okul Malzemeleri', 'Learn school item words', 'vocabulary', 5, [['word-match', 'Supply Match', 'Match school supplies', 3, 10], ['listening-challenge', 'Supply Listen', 'Listen and pick the item', 2, 15]], ['book', 'pencil', 'eraser', 'ruler'], 30),
  L('world-9', 9, 2, 'In the Classroom', 'Sınıfta', 'Learn classroom words', 'vocabulary', 5, [['word-match', 'Class Match', 'Match classroom items', 3, 10], ['phonics-builder', 'Class Builder', 'Build classroom words', 2, 15]], ['desk', 'board', 'classroom', 'bag'], 30),
  L('world-9', 9, 3, 'People at School', 'Okuldaki Kişiler', 'Learn school people words', 'vocabulary', 5, [['word-match', 'People Match', 'Match school people', 3, 10], ['quick-quiz', 'Who Is Who?', 'Identify school people', 2, 15]], ['teacher', 'student', 'school'], 30),
  L('world-9', 9, 4, 'Read & Write', 'Oku ve Yaz', 'Learn school action words', 'vocabulary', 5, [['word-match', 'Action Match', 'Match school actions', 3, 10], ['listening-challenge', 'Action Listen', 'Listen and pick the action', 2, 15]], ['read', 'write', 'count', 'learn'], 30),
  L('world-9', 9, 5, 'Numbers & Letters', 'Sayılar ve Harfler', 'Learn number and letter words', 'grammar', 6, [['sentence-scramble', 'School Sentences', 'Build school sentences', 3, 15], ['quick-quiz', 'Number Quiz', 'Answer number questions', 3, 15]], ['number', 'letter', 'count', 'paper'], 35),
  L('world-9', 9, 6, 'Homework Time', 'Ödev Zamanı', 'Express school activities', 'grammar', 5, [['sentence-scramble', 'Homework Sentences', 'Build homework sentences', 3, 15], ['word-match', 'Homework Match', 'Match homework words', 2, 10]], ['homework', 'learn', 'write', 'read'], 30),
  L('world-9', 9, 7, 'School Phonics', 'Okul Sesleri', 'Phonics of school words', 'phonics', 5, [['phonics-builder', 'School Sounds', 'Build school words', 3, 15], ['spelling-bee', 'School Bee', 'Spell school words', 2, 15]], ['book', 'desk', 'read'], 35),
  L('world-9', 9, 8, 'First Day Story', 'İlk Gün Hikayesi', 'First day at school story', 'story', 7, [['story-choices', 'School Day', 'Your first school day', 4, 20], ['word-match', 'Story Words', 'Match story words', 3, 10]], ['school', 'teacher', 'student', 'book', 'bag'], 40),
  L('world-9', 9, 9, 'School Spelling', 'Okul Hecelemesi', 'Spelling challenge', 'review', 5, [['spelling-bee', 'School Spell', 'Spell school words', 3, 15], ['quick-quiz', 'Quick School Quiz', 'Review school words', 2, 15]], ['pencil', 'classroom', 'homework', 'eraser'], 35),
  L('world-9', 9, 10, 'School Review', 'Okul Tekrarı', 'Review all school words', 'review', 8, [['quick-quiz', 'Big School Quiz', 'Review everything', 4, 20], ['sentence-scramble', 'School Sentences', 'Build sentences', 4, 20]], ['book', 'teacher', 'read', 'write', 'learn'], 50),
];

// --- WORLD 10: Around Town ---
const w10Vocab: VocabularyWord[] = [
  { english: 'car', turkish: 'araba', emoji: '🚗', category: 'transport', phonetic: '/kɑːr/', exampleSentence: 'We go by car.' },
  { english: 'bus', turkish: 'otobüs', emoji: '🚌', category: 'transport', phonetic: '/bʌs/', exampleSentence: 'I take the bus to school.' },
  { english: 'train', turkish: 'tren', emoji: '🚆', category: 'transport', phonetic: '/treɪn/', exampleSentence: 'The train is fast.' },
  { english: 'airplane', turkish: 'uçak', emoji: '✈️', category: 'transport', phonetic: '/ˈɛrpleɪn/', exampleSentence: 'The airplane flies high.' },
  { english: 'boat', turkish: 'tekne', emoji: '⛵', category: 'transport', phonetic: '/boʊt/', exampleSentence: 'The boat sails on the sea.' },
  { english: 'park', turkish: 'park', emoji: '🏞️', category: 'places', phonetic: '/pɑːrk/', exampleSentence: 'We play in the park.' },
  { english: 'hospital', turkish: 'hastane', emoji: '🏥', category: 'places', phonetic: '/ˈhɒspɪtəl/', exampleSentence: 'The doctor works at the hospital.' },
  { english: 'library', turkish: 'kütüphane', emoji: '📚', category: 'places', phonetic: '/ˈlaɪbrəri/', exampleSentence: 'I borrow books from the library.' },
  { english: 'shop', turkish: 'dükkan', emoji: '🏪', category: 'places', phonetic: '/ʃɒp/', exampleSentence: 'We buy food at the shop.' },
  { english: 'street', turkish: 'sokak', emoji: '🛣️', category: 'places', phonetic: '/striːt/', exampleSentence: 'Look both ways on the street.' },
  { english: 'market', turkish: 'pazar', emoji: '🏬', category: 'places', phonetic: '/ˈmɑːrkɪt/', exampleSentence: 'We buy fruits at the market.' },
  { english: 'police', turkish: 'polis', emoji: '👮', category: 'places', phonetic: '/pəˈliːs/', exampleSentence: 'The police helps people.' },
  { english: 'fire station', turkish: 'itfaiye', emoji: '🚒', category: 'places', phonetic: '/ˈfaɪər ˈsteɪʃən/', exampleSentence: 'The fire station has a big truck.' },
  { english: 'bridge', turkish: 'köprü', emoji: '🌉', category: 'places', phonetic: '/brɪdʒ/', exampleSentence: 'We cross the bridge.' },
  { english: 'road', turkish: 'yol', emoji: '🛤️', category: 'places', phonetic: '/roʊd/', exampleSentence: 'The road is long.' },
  { english: 'walk', turkish: 'yürümek', emoji: '🚶', category: 'transport', phonetic: '/wɔːk/', exampleSentence: 'I walk to school.' },
  { english: 'stop', turkish: 'durmak', emoji: '🛑', category: 'transport', phonetic: '/stɒp/', exampleSentence: 'Stop at the red light.' },
  { english: 'go', turkish: 'gitmek', emoji: '🟢', category: 'transport', phonetic: '/ɡoʊ/', exampleSentence: 'Go when the light is green.' },
  { english: 'left', turkish: 'sol', emoji: '⬅️', category: 'places', phonetic: '/lɛft/', exampleSentence: 'Turn left at the corner.' },
  { english: 'right', turkish: 'sağ', emoji: '➡️', category: 'places', phonetic: '/raɪt/', exampleSentence: 'Turn right at the shop.' },
];

const w10Lessons: Lesson[] = [
  L('world-10', 10, 1, 'Getting Around', 'Ulaşım', 'Learn transport words', 'vocabulary', 5, [['word-match', 'Transport Match', 'Match transport words', 3, 10], ['listening-challenge', 'Transport Listen', 'Listen and pick transport', 2, 15]], ['car', 'bus', 'train', 'airplane'], 30),
  L('world-10', 10, 2, 'On the Water', 'Suda', 'Water transport', 'vocabulary', 5, [['word-match', 'Water Match', 'Match water transport', 3, 10], ['phonics-builder', 'Boat Builder', 'Build transport words', 2, 15]], ['boat', 'bridge', 'road'], 25),
  L('world-10', 10, 3, 'Places in Town', 'Şehirdeki Yerler', 'Learn place words', 'vocabulary', 5, [['word-match', 'Place Match', 'Match place words', 3, 10], ['quick-quiz', 'Place Quiz', 'Identify places', 2, 15]], ['park', 'hospital', 'library', 'shop'], 30),
  L('world-10', 10, 4, 'More Places', 'Daha Fazla Yer', 'Learn more place words', 'vocabulary', 5, [['word-match', 'More Place Match', 'Match more places', 3, 10], ['listening-challenge', 'Place Listen', 'Listen and identify', 2, 15]], ['market', 'fire station', 'street', 'police'], 30),
  L('world-10', 10, 5, 'Go & Stop', 'Git ve Dur', 'Direction and traffic words', 'grammar', 6, [['sentence-scramble', 'Direction Sentences', 'Build direction sentences', 3, 15], ['quick-quiz', 'Traffic Quiz', 'Answer traffic questions', 3, 15]], ['go', 'stop', 'walk', 'left', 'right'], 35),
  L('world-10', 10, 6, 'Where Is It?', 'Nerede?', 'Ask about locations', 'grammar', 5, [['sentence-scramble', 'Where Sentences', 'Build where sentences', 3, 15], ['word-match', 'Location Match', 'Match locations', 2, 10]], ['park', 'shop', 'street', 'road'], 30),
  L('world-10', 10, 7, 'Town Phonics', 'Şehir Sesleri', 'Phonics of town words', 'phonics', 5, [['phonics-builder', 'Town Sounds', 'Build town words', 3, 15], ['spelling-bee', 'Town Bee', 'Spell town words', 2, 15]], ['bus', 'shop', 'road'], 35),
  L('world-10', 10, 8, 'Town Trip Story', 'Şehir Gezisi', 'A trip around town', 'story', 7, [['story-choices', 'Town Trip', 'Explore the town', 4, 20], ['word-match', 'Story Words', 'Match story words', 3, 10]], ['bus', 'park', 'library', 'shop', 'walk'], 40),
  L('world-10', 10, 9, 'Town Spelling', 'Şehir Hecelemesi', 'Spelling challenge', 'review', 5, [['spelling-bee', 'Town Spell', 'Spell town words', 3, 15], ['quick-quiz', 'Quick Town Quiz', 'Review town words', 2, 15]], ['hospital', 'airplane', 'library', 'bridge'], 35),
  L('world-10', 10, 10, 'Town Review', 'Şehir Tekrarı', 'Review all town words', 'review', 8, [['quick-quiz', 'Big Town Quiz', 'Review everything', 4, 20], ['sentence-scramble', 'Town Sentences', 'Build sentences', 4, 20]], ['car', 'bus', 'park', 'shop', 'go'], 50),
];

// --- WORLD 11: Story Time ---
const w11Vocab: VocabularyWord[] = [
  { english: 'king', turkish: 'kral', emoji: '🤴', category: 'stories', phonetic: '/kɪŋ/', exampleSentence: 'The king lives in a castle.' },
  { english: 'queen', turkish: 'kraliçe', emoji: '👸', category: 'stories', phonetic: '/kwiːn/', exampleSentence: 'The queen is beautiful.' },
  { english: 'princess', turkish: 'prenses', emoji: '👸', category: 'stories', phonetic: '/ˈprɪnsɛs/', exampleSentence: 'The princess has a crown.' },
  { english: 'dragon', turkish: 'ejderha', emoji: '🐉', category: 'stories', phonetic: '/ˈdræɡən/', exampleSentence: 'The dragon breathes fire.' },
  { english: 'castle', turkish: 'kale', emoji: '🏰', category: 'stories', phonetic: '/ˈkæsəl/', exampleSentence: 'The castle is on the hill.' },
  { english: 'magic', turkish: 'sihir', emoji: '✨', category: 'stories', phonetic: '/ˈmædʒɪk/', exampleSentence: 'The wand has magic.' },
  { english: 'fairy', turkish: 'peri', emoji: '🧚', category: 'stories', phonetic: '/ˈfɛri/', exampleSentence: 'The fairy has wings.' },
  { english: 'hero', turkish: 'kahraman', emoji: '🦸', category: 'stories', phonetic: '/ˈhɪroʊ/', exampleSentence: 'The hero saves the day.' },
  { english: 'wizard', turkish: 'büyücü', emoji: '🧙', category: 'stories', phonetic: '/ˈwɪzərd/', exampleSentence: 'The wizard casts spells.' },
  { english: 'treasure', turkish: 'hazine', emoji: '💎', category: 'stories', phonetic: '/ˈtrɛʒər/', exampleSentence: 'They found the treasure.' },
  { english: 'story', turkish: 'hikaye', emoji: '📖', category: 'stories', phonetic: '/ˈstɔːri/', exampleSentence: 'Read me a story.' },
  { english: 'dream', turkish: 'rüya', emoji: '💭', category: 'imagination', phonetic: '/driːm/', exampleSentence: 'I had a good dream.' },
  { english: 'imagine', turkish: 'hayal etmek', emoji: '🌈', category: 'imagination', phonetic: '/ɪˈmædʒɪn/', exampleSentence: 'Close your eyes and imagine.' },
  { english: 'brave', turkish: 'cesur', emoji: '🦁', category: 'stories', phonetic: '/breɪv/', exampleSentence: 'The knight is brave.' },
  { english: 'kind', turkish: 'nazik', emoji: '💕', category: 'stories', phonetic: '/kaɪnd/', exampleSentence: 'Be kind to everyone.' },
  { english: 'forest', turkish: 'orman', emoji: '🌲', category: 'stories', phonetic: '/ˈfɒrɪst/', exampleSentence: 'The story is set in a forest.' },
  { english: 'sword', turkish: 'kılıç', emoji: '⚔️', category: 'stories', phonetic: '/sɔːrd/', exampleSentence: 'The knight has a sword.' },
  { english: 'crown', turkish: 'taç', emoji: '👑', category: 'stories', phonetic: '/kraʊn/', exampleSentence: 'The king wears a crown.' },
  { english: 'monster', turkish: 'canavar', emoji: '👹', category: 'stories', phonetic: '/ˈmɒnstər/', exampleSentence: 'The friendly monster smiles.' },
  { english: 'wish', turkish: 'dilek', emoji: '🌠', category: 'imagination', phonetic: '/wɪʃ/', exampleSentence: 'I wish for a puppy.' },
];

const w11Lessons: Lesson[] = [
  L('world-11', 11, 1, 'Kings & Queens', 'Krallar ve Kraliçeler', 'Learn royalty words', 'vocabulary', 5, [['word-match', 'Royal Match', 'Match royalty words', 3, 10], ['listening-challenge', 'Royal Listen', 'Listen and pick', 2, 15]], ['king', 'queen', 'princess', 'crown'], 30),
  L('world-11', 11, 2, 'Castles & Dragons', 'Kaleler ve Ejderhalar', 'Fantasy place words', 'vocabulary', 5, [['word-match', 'Fantasy Match', 'Match fantasy words', 3, 10], ['phonics-builder', 'Castle Builder', 'Build fantasy words', 2, 15]], ['castle', 'dragon', 'forest', 'sword'], 30),
  L('world-11', 11, 3, 'Magic Characters', 'Sihirli Karakterler', 'Magical beings', 'vocabulary', 5, [['word-match', 'Magic Match', 'Match magic words', 3, 10], ['quick-quiz', 'Magic Quiz', 'Identify characters', 2, 15]], ['fairy', 'wizard', 'hero', 'monster'], 30),
  L('world-11', 11, 4, 'Magical Words', 'Sihirli Kelimeler', 'Learn magic and treasure', 'vocabulary', 5, [['word-match', 'Treasure Match', 'Match magical words', 3, 10], ['listening-challenge', 'Magic Listen', 'Listen for magic words', 2, 15]], ['magic', 'treasure', 'wish', 'dream'], 30),
  L('world-11', 11, 5, 'Once Upon a Time', 'Bir Varmış Bir Yokmuş', 'Story sentence building', 'grammar', 6, [['sentence-scramble', 'Story Start', 'Build story sentences', 3, 15], ['quick-quiz', 'Story Quiz', 'Choose story elements', 3, 15]], ['story', 'imagine', 'brave', 'kind'], 35),
  L('world-11', 11, 6, 'Describe Characters', 'Karakterleri Anlat', 'Use adjectives for characters', 'grammar', 5, [['sentence-scramble', 'Character Sentences', 'Describe characters', 3, 15], ['word-match', 'Trait Match', 'Match character traits', 2, 10]], ['brave', 'kind', 'hero', 'magic'], 30),
  L('world-11', 11, 7, 'Story Phonics', 'Hikaye Sesleri', 'Phonics of story words', 'phonics', 5, [['phonics-builder', 'Story Sounds', 'Build story words', 3, 15], ['spelling-bee', 'Story Bee', 'Spell story words', 2, 15]], ['king', 'wish', 'dream'], 35),
  L('world-11', 11, 8, 'The Dragon Quest', 'Ejderha Macerası', 'An interactive fantasy story', 'story', 7, [['story-choices', 'Dragon Quest', 'Choose your adventure', 4, 20], ['word-match', 'Quest Words', 'Match story words', 3, 10]], ['dragon', 'castle', 'hero', 'treasure', 'sword'], 40),
  L('world-11', 11, 9, 'Fantasy Spelling', 'Fantazi Heceleme', 'Spelling challenge', 'review', 5, [['spelling-bee', 'Fantasy Spell', 'Spell fantasy words', 3, 15], ['quick-quiz', 'Quick Fantasy Quiz', 'Review story words', 2, 15]], ['princess', 'wizard', 'monster', 'treasure'], 35),
  L('world-11', 11, 10, 'Story Time Review', 'Hikaye Zamanı Tekrarı', 'Review all story words', 'review', 8, [['quick-quiz', 'Big Story Quiz', 'Review everything', 4, 20], ['sentence-scramble', 'Story Sentences', 'Build story sentences', 4, 20]], ['king', 'dragon', 'magic', 'brave', 'wish'], 50),
];

// --- WORLD 12: World Traveler ---
const w12Vocab: VocabularyWord[] = [
  { english: 'country', turkish: 'ülke', emoji: '🌍', category: 'culture', phonetic: '/ˈkʌntri/', exampleSentence: 'Turkey is a beautiful country.' },
  { english: 'flag', turkish: 'bayrak', emoji: '🏳️', category: 'culture', phonetic: '/flæɡ/', exampleSentence: 'Every country has a flag.' },
  { english: 'language', turkish: 'dil', emoji: '🗣️', category: 'culture', phonetic: '/ˈlæŋɡwɪdʒ/', exampleSentence: 'English is a language.' },
  { english: 'map', turkish: 'harita', emoji: '🗺️', category: 'culture', phonetic: '/mæp/', exampleSentence: 'Find Turkey on the map.' },
  { english: 'passport', turkish: 'pasaport', emoji: '🛂', category: 'travel', phonetic: '/ˈpæspɔːrt/', exampleSentence: 'I need my passport to travel.' },
  { english: 'suitcase', turkish: 'bavul', emoji: '🧳', category: 'travel', phonetic: '/ˈsuːtkeɪs/', exampleSentence: 'Pack your suitcase.' },
  { english: 'airport', turkish: 'havalimanı', emoji: '🛫', category: 'travel', phonetic: '/ˈɛrpɔːrt/', exampleSentence: 'We go to the airport.' },
  { english: 'beach', turkish: 'plaj', emoji: '🏖️', category: 'places', phonetic: '/biːtʃ/', exampleSentence: 'I swim at the beach.' },
  { english: 'desert', turkish: 'çöl', emoji: '🏜️', category: 'places', phonetic: '/ˈdɛzərt/', exampleSentence: 'The desert is very hot.' },
  { english: 'island', turkish: 'ada', emoji: '🏝️', category: 'places', phonetic: '/ˈaɪlənd/', exampleSentence: 'The island has palm trees.' },
  { english: 'city', turkish: 'şehir', emoji: '🌆', category: 'places', phonetic: '/ˈsɪti/', exampleSentence: 'Istanbul is a big city.' },
  { english: 'village', turkish: 'köy', emoji: '🏘️', category: 'places', phonetic: '/ˈvɪlɪdʒ/', exampleSentence: 'The village is small and quiet.' },
  { english: 'music', turkish: 'müzik', emoji: '🎵', category: 'culture', phonetic: '/ˈmjuːzɪk/', exampleSentence: 'I like Turkish music.' },
  { english: 'dance', turkish: 'dans', emoji: '💃', category: 'culture', phonetic: '/dæns/', exampleSentence: 'Every country has a dance.' },
  { english: 'food', turkish: 'yemek', emoji: '🍽️', category: 'culture', phonetic: '/fuːd/', exampleSentence: 'I try new food when I travel.' },
  { english: 'friend', turkish: 'arkadaş', emoji: '🤝', category: 'culture', phonetic: '/frɛnd/', exampleSentence: 'I make friends everywhere.' },
  { english: 'ocean', turkish: 'okyanus', emoji: '🌊', category: 'places', phonetic: '/ˈoʊʃən/', exampleSentence: 'The ocean is very deep.' },
  { english: 'world', turkish: 'dünya', emoji: '🌎', category: 'culture', phonetic: '/wɜːrld/', exampleSentence: 'I want to see the world.' },
  { english: 'travel', turkish: 'seyahat', emoji: '✈️', category: 'travel', phonetic: '/ˈtrævəl/', exampleSentence: 'I love to travel.' },
  { english: 'hello', turkish: 'merhaba', emoji: '🙋', category: 'culture', phonetic: '/həˈloʊ/', exampleSentence: 'Say hello in every language!' },
];

const w12Lessons: Lesson[] = [
  L('world-12', 12, 1, 'Countries & Flags', 'Ülkeler ve Bayraklar', 'Learn country words', 'vocabulary', 5, [['word-match', 'Country Match', 'Match country words', 3, 10], ['listening-challenge', 'Flag Listen', 'Listen and identify', 2, 15]], ['country', 'flag', 'map', 'world'], 30),
  L('world-12', 12, 2, 'Packing Up!', 'Bavul Hazırlığı!', 'Learn travel words', 'vocabulary', 5, [['word-match', 'Travel Match', 'Match travel items', 3, 10], ['phonics-builder', 'Travel Builder', 'Build travel words', 2, 15]], ['passport', 'suitcase', 'airport', 'travel'], 30),
  L('world-12', 12, 3, 'Amazing Places', 'Harika Yerler', 'Learn place types', 'vocabulary', 5, [['word-match', 'Place Match', 'Match place types', 3, 10], ['quick-quiz', 'Place Quiz', 'Identify places', 2, 15]], ['beach', 'desert', 'island', 'ocean'], 30),
  L('world-12', 12, 4, 'City & Village', 'Şehir ve Köy', 'Urban and rural words', 'vocabulary', 5, [['word-match', 'Urban Match', 'Match city/village words', 3, 10], ['listening-challenge', 'City Listen', 'Listen and identify', 2, 15]], ['city', 'village', 'language'], 25),
  L('world-12', 12, 5, 'Culture & Fun', 'Kültür ve Eğlence', 'Cultural activity words', 'grammar', 6, [['sentence-scramble', 'Culture Sentences', 'Build culture sentences', 3, 15], ['quick-quiz', 'Culture Quiz', 'Answer culture questions', 3, 15]], ['music', 'dance', 'food', 'friend'], 35),
  L('world-12', 12, 6, 'Where Do You Live?', 'Nerede Yaşıyorsun?', 'Describe where you live', 'grammar', 5, [['sentence-scramble', 'Home Sentences', 'Describe your home', 3, 15], ['word-match', 'Home Match', 'Match home descriptions', 2, 10]], ['city', 'village', 'country', 'world'], 30),
  L('world-12', 12, 7, 'Travel Phonics', 'Seyahat Sesleri', 'Phonics of travel words', 'phonics', 5, [['phonics-builder', 'Travel Sounds', 'Build travel words', 3, 15], ['spelling-bee', 'Travel Bee', 'Spell travel words', 2, 15]], ['map', 'flag', 'beach'], 35),
  L('world-12', 12, 8, 'Around the World', 'Dünya Turu', 'A world travel story', 'story', 7, [['story-choices', 'World Tour', 'Travel around the world', 4, 20], ['word-match', 'Tour Words', 'Match story words', 3, 10]], ['travel', 'beach', 'city', 'music', 'hello'], 40),
  L('world-12', 12, 9, 'World Spelling', 'Dünya Hecelemesi', 'Spelling challenge', 'review', 5, [['spelling-bee', 'World Spell', 'Spell world words', 3, 15], ['quick-quiz', 'Quick World Quiz', 'Review world words', 2, 15]], ['passport', 'airport', 'island', 'language'], 35),
  L('world-12', 12, 10, 'World Traveler Review', 'Dünya Gezgini Tekrarı', 'Review all travel words', 'review', 8, [['quick-quiz', 'Big World Quiz', 'Review everything', 4, 20], ['sentence-scramble', 'World Sentences', 'Build sentences', 4, 20]], ['country', 'travel', 'beach', 'world', 'friend'], 50),
];

// --- BUILD WORLDS ---

function buildWorld(
  num: number, id: string, name: string, nameTr: string, theme: string,
  desc: string, descTr: string, icon: string, color: string,
  gFrom: string, gTo: string, grammarFocus: string,
  lessons: Lesson[], vocabulary: VocabularyWord[], ageGroups: string[] = ['4-6', '6-8', '8-10'],
): World {
  const totalXp = lessons.reduce((sum, l) => sum + l.xpReward, 0);
  return {
    id, number: num, name, nameTr, theme, description: desc, descriptionTr: descTr,
    icon, color, gradientFrom: gFrom, gradientTo: gTo, ageGroups,
    lessons, vocabulary, grammarFocus, totalXp,
  };
}

export const WORLDS: World[] = [
  buildWorld(1, 'world-1', 'Hello World', 'Merhaba Dünya', 'Greetings & Introductions',
    'Learn to say hello, goodbye, and introduce yourself in English!',
    'İngilizce merhaba, hoşça kal demeyi ve kendini tanıtmayı öğren!',
    '🌍', '#4CAF50', '#4CAF50', '#81C784', 'Basic greetings and self-introduction',
    w1Lessons, w1Vocab),

  buildWorld(2, 'world-2', 'My Family', 'Benim Ailem', 'Family & Home',
    'Meet the family and explore the house!',
    'Aileyle tanış ve evi keşfet!',
    '🏠', '#E91E63', '#E91E63', '#F48FB1', 'Possessive pronouns (my, your)',
    w2Lessons, w2Vocab),

  buildWorld(3, 'world-3', 'Animal Kingdom', 'Hayvanlar Alemi', 'Animals',
    'Discover animals from pets to wild creatures!',
    'Evcil hayvanlardan vahşi hayvanlara kadar keşfet!',
    '🦁', '#FF9800', '#FF9800', '#FFB74D', 'Can/cannot for abilities',
    w3Lessons, w3Vocab),

  buildWorld(4, 'world-4', 'Rainbow Colors', 'Gökkuşağı Renkleri', 'Colors & Shapes',
    'Paint with all the colors and learn shapes!',
    'Tüm renklerle boya ve şekilleri öğren!',
    '🌈', '#9C27B0', '#9C27B0', '#CE93D8', 'Adjectives before nouns (the red ball)',
    w4Lessons, w4Vocab),

  buildWorld(5, 'world-5', 'Yummy Food', 'Lezzetli Yemekler', 'Food & Drinks',
    'Explore delicious foods and drinks!',
    'Lezzetli yemekleri ve içecekleri keşfet!',
    '🍎', '#F44336', '#F44336', '#EF9A9A', 'I like / I don\'t like',
    w5Lessons, w5Vocab),

  buildWorld(6, 'world-6', 'My Body', 'Vücudum', 'Body & Health',
    'Learn about your body and staying healthy!',
    'Vücudun ve sağlıklı kalma hakkında öğren!',
    '🧒', '#00BCD4', '#00BCD4', '#80DEEA', 'Imperative sentences (touch your nose)',
    w6Lessons, w6Vocab),

  buildWorld(7, 'world-7', 'Nature Explorer', 'Doğa Kaşifi', 'Nature & Weather',
    'Explore nature and learn about weather!',
    'Doğayı keşfet ve hava durumunu öğren!',
    '🌳', '#43A047', '#43A047', '#A5D6A7', 'It is + adjective (it is sunny)',
    w7Lessons, w7Vocab),

  buildWorld(8, 'world-8', 'Toy Town', 'Oyuncak Şehri', 'Toys & Play',
    'Play with toys and learn action words!',
    'Oyuncaklarla oyna ve eylem kelimeleri öğren!',
    '🧸', '#FF5722', '#FF5722', '#FF8A65', 'Let\'s + verb (let\'s play)',
    w8Lessons, w8Vocab),

  buildWorld(9, 'world-9', 'School Days', 'Okul Günleri', 'School',
    'Everything about school and learning!',
    'Okul ve öğrenme hakkında her şey!',
    '📚', '#3F51B5', '#3F51B5', '#9FA8DA', 'I have / I need',
    w9Lessons, w9Vocab),

  buildWorld(10, 'world-10', 'Around Town', 'Şehir Turu', 'Places & Transport',
    'Discover places in town and how to get there!',
    'Şehirdeki yerleri ve ulaşımı keşfet!',
    '🏙️', '#607D8B', '#607D8B', '#B0BEC5', 'Where is / go to + place',
    w10Lessons, w10Vocab),

  buildWorld(11, 'world-11', 'Story Time', 'Hikaye Zamanı', 'Stories & Imagination',
    'Enter a world of fairy tales and adventures!',
    'Masal ve macera dünyasına gir!',
    '📖', '#673AB7', '#673AB7', '#B39DDB', 'Past tense basics (was, had)',
    w11Lessons, w11Vocab),

  buildWorld(12, 'world-12', 'World Traveler', 'Dünya Gezgini', 'Countries & Culture',
    'Travel the world and learn about different cultures!',
    'Dünyayı gez ve farklı kültürleri öğren!',
    '✈️', '#009688', '#009688', '#80CBC4', 'I want to + verb',
    w12Lessons, w12Vocab),
];

// --- HELPER FUNCTIONS ---

export function getWorldById(id: string): World | undefined {
  return WORLDS.find((w) => w.id === id);
}

export function getLessonById(worldId: string, lessonId: string): Lesson | undefined {
  const world = getWorldById(worldId);
  if (!world) return undefined;
  return world.lessons.find((l) => l.id === lessonId);
}

export function getWorldVocabulary(worldId: string): VocabularyWord[] {
  const world = getWorldById(worldId);
  return world ? world.vocabulary : [];
}

export function getAllVocabulary(): VocabularyWord[] {
  return WORLDS.flatMap((w) => w.vocabulary);
}

export default WORLDS;
