// Words Data - Sample export for admin panel
// The full 491 word list is kept in Words.tsx component

export interface KidsWord {
    word: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    emoji: string;
    turkish: string;
    example?: string;
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
];

// Total count for display (actual count from Words.tsx is 491)
export const TOTAL_WORDS_COUNT = 491;
