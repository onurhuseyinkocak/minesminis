// Words Data - Sample export for admin panel
// The full 491 word list is kept in Words.tsx component

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
}

// Sample words for admin dashboard stats
// Full list is in the Words.tsx component
export const kidsWords: KidsWord[] = [
    // Beginner level samples
    { word: "cat", level: "beginner", category: "Animals", emoji: "🐱", turkish: "kedi", example: "I have a cute cat." },
    { word: "dog", level: "beginner", category: "Animals", emoji: "🐶", turkish: "köpek", example: "My dog is very friendly." },
    { word: "bird", level: "beginner", category: "Animals", emoji: "🐦", turkish: "kuş", example: "The bird can fly." },
    { word: "fish", level: "beginner", category: "Animals", emoji: "🐟", turkish: "balık", example: "I have a pet fish." },
    { word: "red", level: "beginner", category: "Colors", emoji: "🔴", turkish: "kırmızı", example: "My favorite color is red." },
    { word: "blue", level: "beginner", category: "Colors", emoji: "🔵", turkish: "mavi", example: "The sky is blue." },
    { word: "green", level: "beginner", category: "Colors", emoji: "🟢", turkish: "yeşil", example: "Grass is green." },
    { word: "mother", level: "beginner", category: "Family", emoji: "👩", turkish: "anne", example: "My mother loves me." },
    { word: "father", level: "beginner", category: "Family", emoji: "👨", turkish: "baba", example: "My father is tall." },
    { word: "apple", level: "beginner", category: "Food", emoji: "🍎", turkish: "elma", example: "I eat an apple every day." },

    // Intermediate level samples
    { word: "sunny", level: "intermediate", category: "Weather", emoji: "☀️", turkish: "güneşli", example: "It's a sunny day today." },
    { word: "cloudy", level: "intermediate", category: "Weather", emoji: "☁️", turkish: "bulutlu", example: "The sky is cloudy." },
    { word: "football", level: "intermediate", category: "Sports", emoji: "⚽", turkish: "futbol", example: "I play football after school." },
    { word: "doctor", level: "intermediate", category: "Professions", emoji: "👨‍⚕️", turkish: "doktor", example: "Doctors help sick people." },
    { word: "bus", level: "intermediate", category: "Transportation", emoji: "🚌", turkish: "otobüs", example: "I go to school by bus." },

    // Advanced level samples
    { word: "magnificent", level: "advanced", category: "Adjectives", emoji: "🌟", turkish: "muhteşem", example: "The view was magnificent!" },
    { word: "discover", level: "advanced", category: "Verbs", emoji: "🔍", turkish: "keşfetmek", example: "Scientists discover new things every day." },
    { word: "planet", level: "advanced", category: "Science", emoji: "🪐", turkish: "gezegen", example: "Earth is our planet." },
    { word: "computer", level: "advanced", category: "Technology", emoji: "💻", turkish: "bilgisayar", example: "I use a computer for homework." },
    { word: "dragon", level: "advanced", category: "Fantasy", emoji: "🐉", turkish: "ejderha", example: "The dragon breathes fire." },

    // More beginner
    { word: "sun", level: "beginner", category: "Nature", emoji: "☀️", turkish: "güneş", example: "The sun is bright." },
    { word: "moon", level: "beginner", category: "Nature", emoji: "🌙", turkish: "ay", example: "The moon shines at night." },
    { word: "book", level: "beginner", category: "School", emoji: "📖", turkish: "kitap", example: "I read a book." },
    { word: "ball", level: "beginner", category: "Sports", emoji: "⚽", turkish: "top", example: "Let's play ball!" },
    { word: "water", level: "beginner", category: "Nature", emoji: "💧", turkish: "su", example: "I drink water." },
    { word: "house", level: "beginner", category: "Places", emoji: "🏠", turkish: "ev", example: "I live in a house." },
    { word: "friend", level: "beginner", category: "People", emoji: "👫", turkish: "arkadaş", example: "She is my friend." },
    { word: "happy", level: "beginner", category: "Feelings", emoji: "😊", turkish: "mutlu", example: "I am happy today." },
    { word: "run", level: "beginner", category: "Actions", emoji: "🏃", turkish: "koşmak", example: "I run in the park." },
    { word: "sleep", level: "beginner", category: "Actions", emoji: "😴", turkish: "uyumak", example: "I sleep at night." },

    // More intermediate
    { word: "restaurant", level: "intermediate", category: "Places", emoji: "🍽️", turkish: "restoran", example: "We eat at a restaurant." },
    { word: "beautiful", level: "intermediate", category: "Adjectives", emoji: "🌸", turkish: "güzel", example: "The flower is beautiful." },
    { word: "surprise", level: "intermediate", category: "Feelings", emoji: "🎉", turkish: "sürpriz", example: "It was a big surprise!" },
];

// Total count for display
export const TOTAL_WORDS_COUNT = kidsWords.length;
