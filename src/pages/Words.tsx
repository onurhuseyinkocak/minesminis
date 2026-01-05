import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { BookOpen, Volume2, Star, Trophy, Sparkles } from "lucide-react";
import './Words.css';

interface WordDefinition {
  word: string;
  phonetic?: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
}

interface KidsWord {
  word: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  emoji: string;
  turkish: string;
  example?: string;
}

// Türkiye İlkokul Müfredatı - 2., 3., 4., 5. Sınıf Kelime Listesi
const kidsWords: KidsWord[] = [
  // ============ 2. SINIF SEVİYESİ (BEGINNER) ============

  // Hayvanlar - Animals (2. Sınıf)
  { word: "cat", level: "beginner", category: "Animals", emoji: "🐱", turkish: "kedi", example: "I have a cute cat." },
  { word: "dog", level: "beginner", category: "Animals", emoji: "🐶", turkish: "köpek", example: "My dog is very friendly." },
  { word: "bird", level: "beginner", category: "Animals", emoji: "🐦", turkish: "kuş", example: "The bird can fly." },
  { word: "fish", level: "beginner", category: "Animals", emoji: "🐟", turkish: "balık", example: "I have a pet fish." },
  { word: "cow", level: "beginner", category: "Animals", emoji: "🐄", turkish: "inek", example: "The cow gives us milk." },
  { word: "hen", level: "beginner", category: "Animals", emoji: "🐔", turkish: "tavuk", example: "The hen lays eggs." },
  { word: "duck", level: "beginner", category: "Animals", emoji: "🦆", turkish: "ördek", example: "The duck swims in the pond." },
  { word: "sheep", level: "beginner", category: "Animals", emoji: "🐑", turkish: "koyun", example: "The sheep has white wool." },
  { word: "horse", level: "beginner", category: "Animals", emoji: "🐴", turkish: "at", example: "The horse runs fast." },
  { word: "pig", level: "beginner", category: "Animals", emoji: "🐷", turkish: "domuz", example: "The pig is pink." },
  { word: "rabbit", level: "beginner", category: "Animals", emoji: "🐰", turkish: "tavşan", example: "The rabbit has long ears." },
  { word: "mouse", level: "beginner", category: "Animals", emoji: "🐭", turkish: "fare", example: "The mouse is small." },
  { word: "frog", level: "beginner", category: "Animals", emoji: "🐸", turkish: "kurbağa", example: "The frog jumps high." },
  { word: "bee", level: "beginner", category: "Animals", emoji: "🐝", turkish: "arı", example: "The bee makes honey." },
  { word: "ant", level: "beginner", category: "Animals", emoji: "🐜", turkish: "karınca", example: "The ant is very small." },

  // Renkler - Colors (2. Sınıf)
  { word: "red", level: "beginner", category: "Colors", emoji: "🔴", turkish: "kırmızı", example: "My favorite color is red." },
  { word: "blue", level: "beginner", category: "Colors", emoji: "🔵", turkish: "mavi", example: "The sky is blue." },
  { word: "green", level: "beginner", category: "Colors", emoji: "🟢", turkish: "yeşil", example: "Grass is green." },
  { word: "yellow", level: "beginner", category: "Colors", emoji: "🟡", turkish: "sarı", example: "The sun is yellow." },
  { word: "orange", level: "beginner", category: "Colors", emoji: "🟠", turkish: "turuncu", example: "I like orange juice." },
  { word: "pink", level: "beginner", category: "Colors", emoji: "🩷", turkish: "pembe", example: "Her dress is pink." },
  { word: "white", level: "beginner", category: "Colors", emoji: "⚪", turkish: "beyaz", example: "Snow is white." },
  { word: "black", level: "beginner", category: "Colors", emoji: "⚫", turkish: "siyah", example: "My cat is black." },
  { word: "brown", level: "beginner", category: "Colors", emoji: "🟤", turkish: "kahverengi", example: "The bear is brown." },
  { word: "purple", level: "beginner", category: "Colors", emoji: "🟣", turkish: "mor", example: "Grapes are purple." },

  // Sayılar - Numbers (2. Sınıf)
  { word: "one", level: "beginner", category: "Numbers", emoji: "1️⃣", turkish: "bir", example: "I have one book." },
  { word: "two", level: "beginner", category: "Numbers", emoji: "2️⃣", turkish: "iki", example: "I have two hands." },
  { word: "three", level: "beginner", category: "Numbers", emoji: "3️⃣", turkish: "üç", example: "There are three apples." },
  { word: "four", level: "beginner", category: "Numbers", emoji: "4️⃣", turkish: "dört", example: "A dog has four legs." },
  { word: "five", level: "beginner", category: "Numbers", emoji: "5️⃣", turkish: "beş", example: "I have five fingers." },
  { word: "six", level: "beginner", category: "Numbers", emoji: "6️⃣", turkish: "altı", example: "There are six eggs." },
  { word: "seven", level: "beginner", category: "Numbers", emoji: "7️⃣", turkish: "yedi", example: "A week has seven days." },
  { word: "eight", level: "beginner", category: "Numbers", emoji: "8️⃣", turkish: "sekiz", example: "An octopus has eight legs." },
  { word: "nine", level: "beginner", category: "Numbers", emoji: "9️⃣", turkish: "dokuz", example: "I am nine years old." },
  { word: "ten", level: "beginner", category: "Numbers", emoji: "🔟", turkish: "on", example: "I have ten toes." },

  // Aile - Family (2. Sınıf)
  { word: "mother", level: "beginner", category: "Family", emoji: "👩", turkish: "anne", example: "My mother loves me." },
  { word: "father", level: "beginner", category: "Family", emoji: "👨", turkish: "baba", example: "My father is tall." },
  { word: "sister", level: "beginner", category: "Family", emoji: "👧", turkish: "kız kardeş", example: "My sister is young." },
  { word: "brother", level: "beginner", category: "Family", emoji: "👦", turkish: "erkek kardeş", example: "My brother plays football." },
  { word: "baby", level: "beginner", category: "Family", emoji: "👶", turkish: "bebek", example: "The baby is sleeping." },
  { word: "grandma", level: "beginner", category: "Family", emoji: "👵", turkish: "büyükanne", example: "Grandma tells stories." },
  { word: "grandpa", level: "beginner", category: "Family", emoji: "👴", turkish: "büyükbaba", example: "Grandpa has a garden." },

  // Yiyecekler - Food (2. Sınıf)
  { word: "apple", level: "beginner", category: "Food", emoji: "🍎", turkish: "elma", example: "I eat an apple every day." },
  { word: "banana", level: "beginner", category: "Food", emoji: "🍌", turkish: "muz", example: "Monkeys like bananas." },
  { word: "orange", level: "beginner", category: "Food", emoji: "🍊", turkish: "portakal", example: "Oranges are sweet." },
  { word: "bread", level: "beginner", category: "Food", emoji: "🍞", turkish: "ekmek", example: "I eat bread for breakfast." },
  { word: "milk", level: "beginner", category: "Food", emoji: "🥛", turkish: "süt", example: "I drink milk every day." },
  { word: "water", level: "beginner", category: "Food", emoji: "💧", turkish: "su", example: "I drink water when I'm thirsty." },
  { word: "egg", level: "beginner", category: "Food", emoji: "🥚", turkish: "yumurta", example: "I eat eggs for breakfast." },
  { word: "cheese", level: "beginner", category: "Food", emoji: "🧀", turkish: "peynir", example: "Cheese is delicious." },
  { word: "rice", level: "beginner", category: "Food", emoji: "🍚", turkish: "pirinç", example: "I like rice with chicken." },
  { word: "cake", level: "beginner", category: "Food", emoji: "🎂", turkish: "pasta", example: "Birthday cake is yummy!" },
  { word: "candy", level: "beginner", category: "Food", emoji: "🍬", turkish: "şeker", example: "I love candy!" },
  { word: "ice cream", level: "beginner", category: "Food", emoji: "🍦", turkish: "dondurma", example: "I like chocolate ice cream." },

  // Vücut - Body (2. Sınıf)
  { word: "head", level: "beginner", category: "Body", emoji: "👤", turkish: "baş", example: "I wear a hat on my head." },
  { word: "eye", level: "beginner", category: "Body", emoji: "👁️", turkish: "göz", example: "I have two eyes." },
  { word: "ear", level: "beginner", category: "Body", emoji: "👂", turkish: "kulak", example: "I hear with my ears." },
  { word: "nose", level: "beginner", category: "Body", emoji: "👃", turkish: "burun", example: "I smell with my nose." },
  { word: "mouth", level: "beginner", category: "Body", emoji: "👄", turkish: "ağız", example: "I eat with my mouth." },
  { word: "hand", level: "beginner", category: "Body", emoji: "✋", turkish: "el", example: "I write with my hand." },
  { word: "foot", level: "beginner", category: "Body", emoji: "🦶", turkish: "ayak", example: "I walk with my feet." },
  { word: "leg", level: "beginner", category: "Body", emoji: "🦵", turkish: "bacak", example: "I have two legs." },
  { word: "arm", level: "beginner", category: "Body", emoji: "💪", turkish: "kol", example: "I have two arms." },
  { word: "hair", level: "beginner", category: "Body", emoji: "💇", turkish: "saç", example: "My hair is brown." },

  // Okul - School (2. Sınıf)
  { word: "book", level: "beginner", category: "School", emoji: "📚", turkish: "kitap", example: "I read a book every night." },
  { word: "pen", level: "beginner", category: "School", emoji: "🖊️", turkish: "kalem", example: "I write with a pen." },
  { word: "pencil", level: "beginner", category: "School", emoji: "✏️", turkish: "kurşun kalem", example: "I draw with a pencil." },
  { word: "bag", level: "beginner", category: "School", emoji: "🎒", turkish: "çanta", example: "My bag is heavy." },
  { word: "desk", level: "beginner", category: "School", emoji: "🪑", turkish: "sıra", example: "I sit at my desk." },
  { word: "teacher", level: "beginner", category: "School", emoji: "👩‍🏫", turkish: "öğretmen", example: "My teacher is kind." },
  { word: "school", level: "beginner", category: "School", emoji: "🏫", turkish: "okul", example: "I go to school every day." },
  { word: "class", level: "beginner", category: "School", emoji: "🏛️", turkish: "sınıf", example: "My class has 25 students." },

  // Doğa - Nature (2. Sınıf)
  { word: "sun", level: "beginner", category: "Nature", emoji: "☀️", turkish: "güneş", example: "The sun is bright today." },
  { word: "moon", level: "beginner", category: "Nature", emoji: "🌙", turkish: "ay", example: "The moon shines at night." },
  { word: "star", level: "beginner", category: "Nature", emoji: "⭐", turkish: "yıldız", example: "Stars are beautiful at night." },
  { word: "tree", level: "beginner", category: "Nature", emoji: "🌳", turkish: "ağaç", example: "The tree is very tall." },
  { word: "flower", level: "beginner", category: "Nature", emoji: "🌸", turkish: "çiçek", example: "Flowers are colorful." },
  { word: "rain", level: "beginner", category: "Nature", emoji: "🌧️", turkish: "yağmur", example: "I like playing in the rain." },
  { word: "cloud", level: "beginner", category: "Nature", emoji: "☁️", turkish: "bulut", example: "Clouds are white and fluffy." },
  { word: "sky", level: "beginner", category: "Nature", emoji: "🌤️", turkish: "gökyüzü", example: "The sky is blue today." },

  // Yerler - Places (2. Sınıf)
  { word: "house", level: "beginner", category: "Places", emoji: "🏠", turkish: "ev", example: "I live in a big house." },
  { word: "park", level: "beginner", category: "Places", emoji: "🏞️", turkish: "park", example: "I play in the park." },
  { word: "garden", level: "beginner", category: "Places", emoji: "🌻", turkish: "bahçe", example: "We have a beautiful garden." },
  { word: "shop", level: "beginner", category: "Places", emoji: "🏪", turkish: "dükkan", example: "I buy toys at the shop." },
  { word: "street", level: "beginner", category: "Places", emoji: "🛣️", turkish: "sokak", example: "I walk on the street." },

  // Duygular - Feelings (2. Sınıf)
  { word: "happy", level: "beginner", category: "Feelings", emoji: "😊", turkish: "mutlu", example: "I am happy today!" },
  { word: "sad", level: "beginner", category: "Feelings", emoji: "😢", turkish: "üzgün", example: "He is sad because it's raining." },
  { word: "hungry", level: "beginner", category: "Feelings", emoji: "😋", turkish: "aç", example: "I am hungry. Let's eat!" },
  { word: "tired", level: "beginner", category: "Feelings", emoji: "😴", turkish: "yorgun", example: "I am tired. I want to sleep." },
  { word: "hot", level: "beginner", category: "Feelings", emoji: "🥵", turkish: "sıcak", example: "It is hot in summer." },
  { word: "cold", level: "beginner", category: "Feelings", emoji: "🥶", turkish: "soğuk", example: "It is cold in winter." },

  // Oyuncaklar - Toys (2. Sınıf)
  { word: "ball", level: "beginner", category: "Toys", emoji: "⚽", turkish: "top", example: "I play with a ball." },
  { word: "doll", level: "beginner", category: "Toys", emoji: "🎎", turkish: "bebek", example: "She has a pretty doll." },
  { word: "car", level: "beginner", category: "Toys", emoji: "🚗", turkish: "araba", example: "He has a toy car." },
  { word: "kite", level: "beginner", category: "Toys", emoji: "🪁", turkish: "uçurtma", example: "I fly my kite in the park." },
  { word: "puzzle", level: "beginner", category: "Toys", emoji: "🧩", turkish: "yapboz", example: "I love doing puzzles." },

  // ============ 3. SINIF SEVİYESİ (BEGINNER+) ============

  // Daha Fazla Hayvan - More Animals (3. Sınıf)
  { word: "elephant", level: "beginner", category: "Animals", emoji: "🐘", turkish: "fil", example: "Elephants are very smart." },
  { word: "lion", level: "beginner", category: "Animals", emoji: "🦁", turkish: "aslan", example: "The lion is the king of animals." },
  { word: "tiger", level: "beginner", category: "Animals", emoji: "🐯", turkish: "kaplan", example: "Tigers have stripes." },
  { word: "monkey", level: "beginner", category: "Animals", emoji: "🐵", turkish: "maymun", example: "Monkeys climb trees." },
  { word: "snake", level: "beginner", category: "Animals", emoji: "🐍", turkish: "yılan", example: "Some snakes are dangerous." },
  { word: "butterfly", level: "beginner", category: "Animals", emoji: "🦋", turkish: "kelebek", example: "The butterfly has beautiful wings." },
  { word: "turtle", level: "beginner", category: "Animals", emoji: "🐢", turkish: "kaplumbağa", example: "The turtle walks slowly." },
  { word: "bear", level: "beginner", category: "Animals", emoji: "🐻", turkish: "ayı", example: "Bears sleep in winter." },
  { word: "wolf", level: "beginner", category: "Animals", emoji: "🐺", turkish: "kurt", example: "Wolves live in groups." },
  { word: "fox", level: "beginner", category: "Animals", emoji: "🦊", turkish: "tilki", example: "The fox is very clever." },
  { word: "deer", level: "beginner", category: "Animals", emoji: "🦌", turkish: "geyik", example: "Deer run very fast." },
  { word: "owl", level: "beginner", category: "Animals", emoji: "🦉", turkish: "baykuş", example: "Owls can see at night." },
  { word: "parrot", level: "beginner", category: "Animals", emoji: "🦜", turkish: "papağan", example: "Parrots can talk." },
  { word: "dolphin", level: "beginner", category: "Animals", emoji: "🐬", turkish: "yunus", example: "Dolphins are friendly." },
  { word: "whale", level: "beginner", category: "Animals", emoji: "🐋", turkish: "balina", example: "Whales are very big." },

  // Günler - Days (3. Sınıf)
  { word: "Monday", level: "beginner", category: "Days", emoji: "📅", turkish: "Pazartesi", example: "Monday is the first day of school." },
  { word: "Tuesday", level: "beginner", category: "Days", emoji: "📅", turkish: "Salı", example: "I have art class on Tuesday." },
  { word: "Wednesday", level: "beginner", category: "Days", emoji: "📅", turkish: "Çarşamba", example: "Wednesday is in the middle of the week." },
  { word: "Thursday", level: "beginner", category: "Days", emoji: "📅", turkish: "Perşembe", example: "We have music on Thursday." },
  { word: "Friday", level: "beginner", category: "Days", emoji: "📅", turkish: "Cuma", example: "I love Fridays!" },
  { word: "Saturday", level: "beginner", category: "Days", emoji: "📅", turkish: "Cumartesi", example: "I play games on Saturday." },
  { word: "Sunday", level: "beginner", category: "Days", emoji: "📅", turkish: "Pazar", example: "Sunday is a rest day." },

  // Aylar - Months (3. Sınıf)
  { word: "January", level: "beginner", category: "Months", emoji: "❄️", turkish: "Ocak", example: "January is very cold." },
  { word: "February", level: "beginner", category: "Months", emoji: "💝", turkish: "Şubat", example: "February has Valentine's Day." },
  { word: "March", level: "beginner", category: "Months", emoji: "🌱", turkish: "Mart", example: "Spring starts in March." },
  { word: "April", level: "beginner", category: "Months", emoji: "🌷", turkish: "Nisan", example: "April has many flowers." },
  { word: "May", level: "beginner", category: "Months", emoji: "🌺", turkish: "Mayıs", example: "May is a beautiful month." },
  { word: "June", level: "beginner", category: "Months", emoji: "☀️", turkish: "Haziran", example: "School ends in June." },
  { word: "July", level: "beginner", category: "Months", emoji: "🏖️", turkish: "Temmuz", example: "July is very hot." },
  { word: "August", level: "beginner", category: "Months", emoji: "🌊", turkish: "Ağustos", example: "We go to the beach in August." },
  { word: "September", level: "beginner", category: "Months", emoji: "🍂", turkish: "Eylül", example: "School starts in September." },
  { word: "October", level: "beginner", category: "Months", emoji: "🎃", turkish: "Ekim", example: "October has Halloween." },
  { word: "November", level: "beginner", category: "Months", emoji: "🍁", turkish: "Kasım", example: "November is in autumn." },
  { word: "December", level: "beginner", category: "Months", emoji: "🎄", turkish: "Aralık", example: "December has New Year." },

  // Mevsimler - Seasons (3. Sınıf)
  { word: "spring", level: "beginner", category: "Seasons", emoji: "🌸", turkish: "ilkbahar", example: "Flowers bloom in spring." },
  { word: "summer", level: "beginner", category: "Seasons", emoji: "☀️", turkish: "yaz", example: "We swim in summer." },
  { word: "autumn", level: "beginner", category: "Seasons", emoji: "🍂", turkish: "sonbahar", example: "Leaves fall in autumn." },
  { word: "winter", level: "beginner", category: "Seasons", emoji: "❄️", turkish: "kış", example: "We make snowmen in winter." },

  // Giysiler - Clothes (3. Sınıf)
  { word: "shirt", level: "beginner", category: "Clothes", emoji: "👕", turkish: "gömlek", example: "I wear a white shirt." },
  { word: "pants", level: "beginner", category: "Clothes", emoji: "👖", turkish: "pantolon", example: "My pants are blue." },
  { word: "dress", level: "beginner", category: "Clothes", emoji: "👗", turkish: "elbise", example: "She has a pretty dress." },
  { word: "shoes", level: "beginner", category: "Clothes", emoji: "👟", turkish: "ayakkabı", example: "I need new shoes." },
  { word: "hat", level: "beginner", category: "Clothes", emoji: "🧢", turkish: "şapka", example: "I wear a hat when it's sunny." },
  { word: "coat", level: "beginner", category: "Clothes", emoji: "🧥", turkish: "mont", example: "I wear a coat in winter." },
  { word: "socks", level: "beginner", category: "Clothes", emoji: "🧦", turkish: "çorap", example: "My socks are colorful." },
  { word: "gloves", level: "beginner", category: "Clothes", emoji: "🧤", turkish: "eldiven", example: "I wear gloves when it's cold." },
  { word: "scarf", level: "beginner", category: "Clothes", emoji: "🧣", turkish: "atkı", example: "This scarf is warm." },

  // Fiiller - Verbs (3. Sınıf)
  { word: "run", level: "beginner", category: "Verbs", emoji: "🏃", turkish: "koşmak", example: "I run every morning." },
  { word: "walk", level: "beginner", category: "Verbs", emoji: "🚶", turkish: "yürümek", example: "I walk to school." },
  { word: "jump", level: "beginner", category: "Verbs", emoji: "🦘", turkish: "zıplamak", example: "Rabbits can jump high." },
  { word: "swim", level: "beginner", category: "Verbs", emoji: "🏊", turkish: "yüzmek", example: "Fish can swim." },
  { word: "eat", level: "beginner", category: "Verbs", emoji: "🍽️", turkish: "yemek", example: "I eat breakfast at 8." },
  { word: "drink", level: "beginner", category: "Verbs", emoji: "🥤", turkish: "içmek", example: "I drink water every day." },
  { word: "sleep", level: "beginner", category: "Verbs", emoji: "😴", turkish: "uyumak", example: "I sleep at 9 o'clock." },
  { word: "read", level: "beginner", category: "Verbs", emoji: "📖", turkish: "okumak", example: "I read books every night." },
  { word: "write", level: "beginner", category: "Verbs", emoji: "✍️", turkish: "yazmak", example: "I write my homework." },
  { word: "play", level: "beginner", category: "Verbs", emoji: "🎮", turkish: "oynamak", example: "I play with my friends." },
  { word: "sing", level: "beginner", category: "Verbs", emoji: "🎤", turkish: "şarkı söylemek", example: "I like to sing songs." },
  { word: "dance", level: "beginner", category: "Verbs", emoji: "💃", turkish: "dans etmek", example: "She loves to dance." },
  { word: "draw", level: "beginner", category: "Verbs", emoji: "🎨", turkish: "çizmek", example: "I draw pictures." },
  { word: "cook", level: "beginner", category: "Verbs", emoji: "👨‍🍳", turkish: "yemek pişirmek", example: "My mom can cook well." },
  { word: "clean", level: "beginner", category: "Verbs", emoji: "🧹", turkish: "temizlemek", example: "I clean my room." },

  // ============ 4. SINIF SEVİYESİ (INTERMEDIATE) ============

  // Hava Durumu - Weather (4. Sınıf)
  { word: "sunny", level: "intermediate", category: "Weather", emoji: "☀️", turkish: "güneşli", example: "It's a sunny day today." },
  { word: "cloudy", level: "intermediate", category: "Weather", emoji: "☁️", turkish: "bulutlu", example: "The sky is cloudy." },
  { word: "rainy", level: "intermediate", category: "Weather", emoji: "🌧️", turkish: "yağmurlu", example: "It's rainy outside." },
  { word: "snowy", level: "intermediate", category: "Weather", emoji: "🌨️", turkish: "karlı", example: "It's snowy in winter." },
  { word: "windy", level: "intermediate", category: "Weather", emoji: "💨", turkish: "rüzgarlı", example: "It's very windy today." },
  { word: "stormy", level: "intermediate", category: "Weather", emoji: "⛈️", turkish: "fırtınalı", example: "It's stormy tonight." },
  { word: "foggy", level: "intermediate", category: "Weather", emoji: "🌫️", turkish: "sisli", example: "It's foggy this morning." },
  { word: "temperature", level: "intermediate", category: "Weather", emoji: "🌡️", turkish: "sıcaklık", example: "The temperature is 25 degrees." },

  // Hobiler - Hobbies (4. Sınıf)
  { word: "reading", level: "intermediate", category: "Hobbies", emoji: "📚", turkish: "okuma", example: "Reading is my favorite hobby." },
  { word: "painting", level: "intermediate", category: "Hobbies", emoji: "🎨", turkish: "resim yapma", example: "I love painting pictures." },
  { word: "swimming", level: "intermediate", category: "Hobbies", emoji: "🏊", turkish: "yüzme", example: "Swimming is fun!" },
  { word: "cycling", level: "intermediate", category: "Hobbies", emoji: "🚴", turkish: "bisiklet sürme", example: "I go cycling on weekends." },
  { word: "gardening", level: "intermediate", category: "Hobbies", emoji: "🌱", turkish: "bahçıvanlık", example: "Gardening is relaxing." },
  { word: "cooking", level: "intermediate", category: "Hobbies", emoji: "👨‍🍳", turkish: "yemek yapma", example: "I enjoy cooking with my mom." },
  { word: "photography", level: "intermediate", category: "Hobbies", emoji: "📷", turkish: "fotoğrafçılık", example: "Photography is my new hobby." },
  { word: "collecting", level: "intermediate", category: "Hobbies", emoji: "📦", turkish: "koleksiyon yapma", example: "I like collecting stamps." },

  // Sporlar - Sports (4. Sınıf)
  { word: "football", level: "intermediate", category: "Sports", emoji: "⚽", turkish: "futbol", example: "I play football after school." },
  { word: "basketball", level: "intermediate", category: "Sports", emoji: "🏀", turkish: "basketbol", example: "Basketball is exciting." },
  { word: "volleyball", level: "intermediate", category: "Sports", emoji: "🏐", turkish: "voleybol", example: "We play volleyball at school." },
  { word: "tennis", level: "intermediate", category: "Sports", emoji: "🎾", turkish: "tenis", example: "Tennis is a fun sport." },
  { word: "baseball", level: "intermediate", category: "Sports", emoji: "⚾", turkish: "beyzbol", example: "Baseball is popular in America." },
  { word: "skiing", level: "intermediate", category: "Sports", emoji: "⛷️", turkish: "kayak", example: "I go skiing in winter." },
  { word: "skating", level: "intermediate", category: "Sports", emoji: "⛸️", turkish: "paten", example: "Ice skating is fun!" },
  { word: "running", level: "intermediate", category: "Sports", emoji: "🏃", turkish: "koşu", example: "Running is good for health." },
  { word: "gymnastics", level: "intermediate", category: "Sports", emoji: "🤸", turkish: "jimnastik", example: "She does gymnastics." },
  { word: "karate", level: "intermediate", category: "Sports", emoji: "🥋", turkish: "karate", example: "I practice karate." },

  // Taşıtlar - Transportation (4. Sınıf)
  { word: "bus", level: "intermediate", category: "Transportation", emoji: "🚌", turkish: "otobüs", example: "I go to school by bus." },
  { word: "train", level: "intermediate", category: "Transportation", emoji: "🚆", turkish: "tren", example: "The train is very fast." },
  { word: "airplane", level: "intermediate", category: "Transportation", emoji: "✈️", turkish: "uçak", example: "We travel by airplane." },
  { word: "bicycle", level: "intermediate", category: "Transportation", emoji: "🚲", turkish: "bisiklet", example: "I ride my bicycle to school." },
  { word: "motorcycle", level: "intermediate", category: "Transportation", emoji: "🏍️", turkish: "motosiklet", example: "My dad has a motorcycle." },
  { word: "ship", level: "intermediate", category: "Transportation", emoji: "🚢", turkish: "gemi", example: "We traveled by ship." },
  { word: "helicopter", level: "intermediate", category: "Transportation", emoji: "🚁", turkish: "helikopter", example: "Helicopters can fly anywhere." },
  { word: "subway", level: "intermediate", category: "Transportation", emoji: "🚇", turkish: "metro", example: "The subway is underground." },
  { word: "taxi", level: "intermediate", category: "Transportation", emoji: "🚕", turkish: "taksi", example: "We took a taxi to the airport." },

  // Meslekler - Professions (4. Sınıf)
  { word: "doctor", level: "intermediate", category: "Professions", emoji: "👨‍⚕️", turkish: "doktor", example: "Doctors help sick people." },
  { word: "nurse", level: "intermediate", category: "Professions", emoji: "👩‍⚕️", turkish: "hemşire", example: "Nurses work in hospitals." },
  { word: "police", level: "intermediate", category: "Professions", emoji: "👮", turkish: "polis", example: "Police officers keep us safe." },
  { word: "firefighter", level: "intermediate", category: "Professions", emoji: "👨‍🚒", turkish: "itfaiyeci", example: "Firefighters are brave." },
  { word: "pilot", level: "intermediate", category: "Professions", emoji: "👨‍✈️", turkish: "pilot", example: "Pilots fly airplanes." },
  { word: "chef", level: "intermediate", category: "Professions", emoji: "👨‍🍳", turkish: "aşçı", example: "The chef makes delicious food." },
  { word: "farmer", level: "intermediate", category: "Professions", emoji: "👨‍🌾", turkish: "çiftçi", example: "Farmers grow vegetables." },
  { word: "engineer", level: "intermediate", category: "Professions", emoji: "👷", turkish: "mühendis", example: "Engineers build bridges." },
  { word: "artist", level: "intermediate", category: "Professions", emoji: "👨‍🎨", turkish: "sanatçı", example: "Artists create beautiful things." },
  { word: "scientist", level: "intermediate", category: "Professions", emoji: "👨‍🔬", turkish: "bilim insanı", example: "Scientists discover new things." },
  { word: "dentist", level: "intermediate", category: "Professions", emoji: "🦷", turkish: "diş doktoru", example: "I go to the dentist twice a year." },
  { word: "vet", level: "intermediate", category: "Professions", emoji: "🐾", turkish: "veteriner", example: "The vet helps sick animals." },

  // Daha Fazla Yerler - More Places (4. Sınıf)
  { word: "hospital", level: "intermediate", category: "Places", emoji: "🏥", turkish: "hastane", example: "Doctors work in hospitals." },
  { word: "library", level: "intermediate", category: "Places", emoji: "📚", turkish: "kütüphane", example: "I borrow books from the library." },
  { word: "museum", level: "intermediate", category: "Places", emoji: "🏛️", turkish: "müze", example: "We visited the museum yesterday." },
  { word: "cinema", level: "intermediate", category: "Places", emoji: "🎬", turkish: "sinema", example: "Let's go to the cinema!" },
  { word: "restaurant", level: "intermediate", category: "Places", emoji: "🍽️", turkish: "restoran", example: "We eat at a restaurant on Sundays." },
  { word: "supermarket", level: "intermediate", category: "Places", emoji: "🛒", turkish: "süpermarket", example: "We buy food at the supermarket." },
  { word: "beach", level: "intermediate", category: "Places", emoji: "🏖️", turkish: "plaj", example: "We go to the beach in summer." },
  { word: "mountain", level: "intermediate", category: "Places", emoji: "⛰️", turkish: "dağ", example: "We climbed the mountain together." },
  { word: "forest", level: "intermediate", category: "Places", emoji: "🌲", turkish: "orman", example: "Many animals live in the forest." },
  { word: "river", level: "intermediate", category: "Places", emoji: "🏞️", turkish: "nehir", example: "The river flows to the sea." },
  { word: "lake", level: "intermediate", category: "Places", emoji: "🌊", turkish: "göl", example: "We swim in the lake." },
  { word: "zoo", level: "intermediate", category: "Places", emoji: "🦁", turkish: "hayvanat bahçesi", example: "We see animals at the zoo." },
  { word: "airport", level: "intermediate", category: "Places", emoji: "🛫", turkish: "havalimanı", example: "We go to the airport to travel." },
  { word: "station", level: "intermediate", category: "Places", emoji: "🚉", turkish: "istasyon", example: "We wait for the train at the station." },

  // Sıfatlar - Adjectives (4. Sınıf)
  { word: "big", level: "intermediate", category: "Adjectives", emoji: "🐘", turkish: "büyük", example: "Elephants are big animals." },
  { word: "small", level: "intermediate", category: "Adjectives", emoji: "🐜", turkish: "küçük", example: "Ants are very small." },
  { word: "tall", level: "intermediate", category: "Adjectives", emoji: "🦒", turkish: "uzun", example: "Giraffes are very tall." },
  { word: "short", level: "intermediate", category: "Adjectives", emoji: "🐁", turkish: "kısa", example: "Mice are short." },
  { word: "fast", level: "intermediate", category: "Adjectives", emoji: "🏎️", turkish: "hızlı", example: "Cheetahs are very fast." },
  { word: "slow", level: "intermediate", category: "Adjectives", emoji: "🐢", turkish: "yavaş", example: "Turtles are slow." },
  { word: "beautiful", level: "intermediate", category: "Adjectives", emoji: "🌹", turkish: "güzel", example: "Roses are beautiful flowers." },
  { word: "ugly", level: "intermediate", category: "Adjectives", emoji: "👹", turkish: "çirkin", example: "The monster was ugly." },
  { word: "strong", level: "intermediate", category: "Adjectives", emoji: "💪", turkish: "güçlü", example: "Lions are very strong." },
  { word: "weak", level: "intermediate", category: "Adjectives", emoji: "😓", turkish: "zayıf", example: "I feel weak when I'm sick." },
  { word: "old", level: "intermediate", category: "Adjectives", emoji: "👴", turkish: "yaşlı", example: "My grandpa is old." },
  { word: "young", level: "intermediate", category: "Adjectives", emoji: "👶", turkish: "genç", example: "My brother is very young." },
  { word: "new", level: "intermediate", category: "Adjectives", emoji: "✨", turkish: "yeni", example: "I have a new backpack." },
  { word: "clean", level: "intermediate", category: "Adjectives", emoji: "✅", turkish: "temiz", example: "My room is clean." },
  { word: "dirty", level: "intermediate", category: "Adjectives", emoji: "💩", turkish: "kirli", example: "My shoes are dirty." },
  { word: "delicious", level: "intermediate", category: "Adjectives", emoji: "😋", turkish: "lezzetli", example: "This pizza is delicious!" },
  { word: "brave", level: "intermediate", category: "Adjectives", emoji: "🦸", turkish: "cesur", example: "The brave knight saved the princess." },
  { word: "kind", level: "intermediate", category: "Adjectives", emoji: "💖", turkish: "nazik", example: "She is a kind person." },
  { word: "smart", level: "intermediate", category: "Adjectives", emoji: "🧠", turkish: "akıllı", example: "She is very smart." },
  { word: "funny", level: "intermediate", category: "Adjectives", emoji: "😂", turkish: "komik", example: "The clown is very funny." },

  // Daha Fazla Duygular - More Feelings (4. Sınıf)
  { word: "angry", level: "intermediate", category: "Feelings", emoji: "😠", turkish: "kızgın", example: "He is angry because he lost the game." },
  { word: "scared", level: "intermediate", category: "Feelings", emoji: "😨", turkish: "korkmuş", example: "I am scared of spiders." },
  { word: "excited", level: "intermediate", category: "Feelings", emoji: "🤩", turkish: "heyecanlı", example: "I am excited about my birthday!" },
  { word: "surprised", level: "intermediate", category: "Feelings", emoji: "😲", turkish: "şaşırmış", example: "She was surprised by the gift." },
  { word: "nervous", level: "intermediate", category: "Feelings", emoji: "😰", turkish: "gergin", example: "I am nervous before exams." },
  { word: "proud", level: "intermediate", category: "Feelings", emoji: "😊", turkish: "gururlu", example: "My parents are proud of me." },
  { word: "bored", level: "intermediate", category: "Feelings", emoji: "😐", turkish: "sıkılmış", example: "I am bored. Let's play!" },
  { word: "worried", level: "intermediate", category: "Feelings", emoji: "😟", turkish: "endişeli", example: "Mom is worried about the weather." },

  // Doğa - Nature (4. Sınıf)
  { word: "rainbow", level: "intermediate", category: "Nature", emoji: "🌈", turkish: "gökkuşağı", example: "I saw a rainbow after the rain." },
  { word: "ocean", level: "intermediate", category: "Nature", emoji: "🌊", turkish: "okyanus", example: "The ocean is very deep." },
  { word: "island", level: "intermediate", category: "Nature", emoji: "🏝️", turkish: "ada", example: "We visited a small island." },
  { word: "volcano", level: "intermediate", category: "Nature", emoji: "🌋", turkish: "yanardağ", example: "The volcano is dangerous." },
  { word: "desert", level: "intermediate", category: "Nature", emoji: "🏜️", turkish: "çöl", example: "Deserts are very hot and dry." },
  { word: "waterfall", level: "intermediate", category: "Nature", emoji: "💦", turkish: "şelale", example: "The waterfall is beautiful." },
  { word: "cave", level: "intermediate", category: "Nature", emoji: "🕳️", turkish: "mağara", example: "Bats live in caves." },
  { word: "jungle", level: "intermediate", category: "Nature", emoji: "🌴", turkish: "orman", example: "Many animals live in the jungle." },

  // Yiyecekler - More Food (4. Sınıf)
  { word: "pizza", level: "intermediate", category: "Food", emoji: "🍕", turkish: "pizza", example: "Pizza is my favorite food." },
  { word: "hamburger", level: "intermediate", category: "Food", emoji: "🍔", turkish: "hamburger", example: "I eat hamburgers on weekends." },
  { word: "sandwich", level: "intermediate", category: "Food", emoji: "🥪", turkish: "sandviç", example: "I bring a sandwich to school." },
  { word: "salad", level: "intermediate", category: "Food", emoji: "🥗", turkish: "salata", example: "Salad is healthy." },
  { word: "soup", level: "intermediate", category: "Food", emoji: "🍲", turkish: "çorba", example: "Hot soup is good when you're sick." },
  { word: "chicken", level: "intermediate", category: "Food", emoji: "🍗", turkish: "tavuk", example: "I love fried chicken." },
  { word: "meat", level: "intermediate", category: "Food", emoji: "🥩", turkish: "et", example: "Meat has protein." },
  { word: "vegetable", level: "intermediate", category: "Food", emoji: "🥬", turkish: "sebze", example: "Vegetables are good for you." },
  { word: "fruit", level: "intermediate", category: "Food", emoji: "🍇", turkish: "meyve", example: "I eat fruit every day." },
  { word: "chocolate", level: "intermediate", category: "Food", emoji: "🍫", turkish: "çikolata", example: "Chocolate is sweet." },
  { word: "cookie", level: "intermediate", category: "Food", emoji: "🍪", turkish: "kurabiye", example: "My grandma makes delicious cookies." },
  { word: "juice", level: "intermediate", category: "Food", emoji: "🧃", turkish: "meyve suyu", example: "I drink orange juice." },

  // ============ 5. SINIF SEVİYESİ (ADVANCED) ============

  // Gelişmiş Sıfatlar - Advanced Adjectives (5. Sınıf)
  { word: "magnificent", level: "advanced", category: "Adjectives", emoji: "🌟", turkish: "muhteşem", example: "The view was magnificent!" },
  { word: "mysterious", level: "advanced", category: "Adjectives", emoji: "🔮", turkish: "gizemli", example: "The mysterious box was locked." },
  { word: "courageous", level: "advanced", category: "Adjectives", emoji: "🛡️", turkish: "yürekli", example: "She was courageous in the face of danger." },
  { word: "extraordinary", level: "advanced", category: "Adjectives", emoji: "⭐", turkish: "olağanüstü", example: "She has extraordinary talent." },
  { word: "enormous", level: "advanced", category: "Adjectives", emoji: "🏔️", turkish: "devasa", example: "The dinosaur was enormous." },
  { word: "ancient", level: "advanced", category: "Adjectives", emoji: "🏛️", turkish: "antik", example: "We visited ancient ruins." },
  { word: "fascinating", level: "advanced", category: "Adjectives", emoji: "✨", turkish: "büyüleyici", example: "Science is fascinating." },
  { word: "incredible", level: "advanced", category: "Adjectives", emoji: "😲", turkish: "inanılmaz", example: "The magic trick was incredible!" },
  { word: "brilliant", level: "advanced", category: "Adjectives", emoji: "💡", turkish: "parlak", example: "She is a brilliant student." },
  { word: "curious", level: "advanced", category: "Adjectives", emoji: "🤔", turkish: "meraklı", example: "Cats are very curious animals." },
  { word: "generous", level: "advanced", category: "Adjectives", emoji: "🎁", turkish: "cömert", example: "He is a generous person." },
  { word: "patient", level: "advanced", category: "Adjectives", emoji: "⏰", turkish: "sabırlı", example: "Teachers need to be patient." },
  { word: "creative", level: "advanced", category: "Adjectives", emoji: "🎨", turkish: "yaratıcı", example: "She is a creative artist." },
  { word: "honest", level: "advanced", category: "Adjectives", emoji: "💯", turkish: "dürüst", example: "Always be honest." },
  { word: "responsible", level: "advanced", category: "Adjectives", emoji: "✅", turkish: "sorumlu", example: "He is a responsible student." },

  // Gelişmiş Fiiller - Advanced Verbs (5. Sınıf)
  { word: "accomplish", level: "advanced", category: "Verbs", emoji: "🎯", turkish: "başarmak", example: "You can accomplish anything you try." },
  { word: "discover", level: "advanced", category: "Verbs", emoji: "🔍", turkish: "keşfetmek", example: "Scientists discover new things every day." },
  { word: "appreciate", level: "advanced", category: "Verbs", emoji: "🙏", turkish: "takdir etmek", example: "I appreciate your help." },
  { word: "communicate", level: "advanced", category: "Verbs", emoji: "💬", turkish: "iletişim kurmak", example: "We communicate by phone." },
  { word: "investigate", level: "advanced", category: "Verbs", emoji: "🔎", turkish: "araştırmak", example: "Detectives investigate crimes." },
  { word: "create", level: "advanced", category: "Verbs", emoji: "🎨", turkish: "yaratmak", example: "Artists create beautiful things." },
  { word: "improve", level: "advanced", category: "Verbs", emoji: "📈", turkish: "geliştirmek", example: "Practice helps you improve." },
  { word: "organize", level: "advanced", category: "Verbs", emoji: "📋", turkish: "organize etmek", example: "Let's organize a party." },
  { word: "protect", level: "advanced", category: "Verbs", emoji: "🛡️", turkish: "korumak", example: "We must protect nature." },
  { word: "celebrate", level: "advanced", category: "Verbs", emoji: "🎉", turkish: "kutlamak", example: "We celebrate birthdays." },
  { word: "imagine", level: "advanced", category: "Verbs", emoji: "💭", turkish: "hayal etmek", example: "Imagine you can fly!" },
  { word: "explore", level: "advanced", category: "Verbs", emoji: "🧭", turkish: "keşfetmek", example: "Let's explore the forest." },
  { word: "compete", level: "advanced", category: "Verbs", emoji: "🏆", turkish: "yarışmak", example: "Athletes compete in the Olympics." },
  { word: "survive", level: "advanced", category: "Verbs", emoji: "💪", turkish: "hayatta kalmak", example: "Plants need water to survive." },
  { word: "observe", level: "advanced", category: "Verbs", emoji: "👀", turkish: "gözlemlemek", example: "Scientists observe nature." },

  // Kavramlar - Concepts (5. Sınıf)
  { word: "imagination", level: "advanced", category: "Concepts", emoji: "💭", turkish: "hayal gücü", example: "Use your imagination to create stories." },
  { word: "perseverance", level: "advanced", category: "Concepts", emoji: "💪", turkish: "azim", example: "Success requires perseverance." },
  { word: "confidence", level: "advanced", category: "Concepts", emoji: "😎", turkish: "özgüven", example: "Confidence helps you succeed." },
  { word: "knowledge", level: "advanced", category: "Concepts", emoji: "📚", turkish: "bilgi", example: "Knowledge is power." },
  { word: "freedom", level: "advanced", category: "Concepts", emoji: "🕊️", turkish: "özgürlük", example: "Freedom is important for everyone." },
  { word: "justice", level: "advanced", category: "Concepts", emoji: "⚖️", turkish: "adalet", example: "Justice means fairness for all." },
  { word: "environment", level: "advanced", category: "Concepts", emoji: "🌍", turkish: "çevre", example: "We must protect the environment." },
  { word: "opportunity", level: "advanced", category: "Concepts", emoji: "🚪", turkish: "fırsat", example: "Every day is a new opportunity." },
  { word: "adventure", level: "advanced", category: "Concepts", emoji: "🗺️", turkish: "macera", example: "We had a great adventure in the forest." },
  { word: "friendship", level: "advanced", category: "Concepts", emoji: "🤝", turkish: "arkadaşlık", example: "Friendship is very important." },
  { word: "success", level: "advanced", category: "Concepts", emoji: "🏆", turkish: "başarı", example: "Hard work leads to success." },
  { word: "respect", level: "advanced", category: "Concepts", emoji: "🙏", turkish: "saygı", example: "We should show respect to others." },
  { word: "teamwork", level: "advanced", category: "Concepts", emoji: "👥", turkish: "takım çalışması", example: "Teamwork makes work easier." },
  { word: "responsibility", level: "advanced", category: "Concepts", emoji: "✅", turkish: "sorumluluk", example: "Taking care of pets is a responsibility." },
  { word: "happiness", level: "advanced", category: "Concepts", emoji: "😊", turkish: "mutluluk", example: "Happiness comes from within." },

  // Bilim - Science (5. Sınıf)
  { word: "planet", level: "advanced", category: "Science", emoji: "🪐", turkish: "gezegen", example: "Earth is our planet." },
  { word: "galaxy", level: "advanced", category: "Science", emoji: "🌌", turkish: "galaksi", example: "There are many galaxies in space." },
  { word: "astronaut", level: "advanced", category: "Science", emoji: "👨‍🚀", turkish: "astronot", example: "Astronauts travel to space." },
  { word: "experiment", level: "advanced", category: "Science", emoji: "🧪", turkish: "deney", example: "We do experiments in science class." },
  { word: "telescope", level: "advanced", category: "Science", emoji: "🔭", turkish: "teleskop", example: "We use a telescope to see stars." },
  { word: "microscope", level: "advanced", category: "Science", emoji: "🔬", turkish: "mikroskop", example: "We see tiny things with a microscope." },
  { word: "electricity", level: "advanced", category: "Science", emoji: "⚡", turkish: "elektrik", example: "We use electricity every day." },
  { word: "gravity", level: "advanced", category: "Science", emoji: "🍎", turkish: "yerçekimi", example: "Gravity keeps us on the ground." },
  { word: "oxygen", level: "advanced", category: "Science", emoji: "💨", turkish: "oksijen", example: "We breathe oxygen." },
  { word: "dinosaur", level: "advanced", category: "Science", emoji: "🦕", turkish: "dinozor", example: "Dinosaurs lived millions of years ago." },
  { word: "fossil", level: "advanced", category: "Science", emoji: "🦴", turkish: "fosil", example: "Scientists study fossils." },
  { word: "energy", level: "advanced", category: "Science", emoji: "⚡", turkish: "enerji", example: "The sun gives us energy." },
  { word: "robot", level: "advanced", category: "Science", emoji: "🤖", turkish: "robot", example: "Robots can do many things." },
  { word: "satellite", level: "advanced", category: "Science", emoji: "🛰️", turkish: "uydu", example: "Satellites orbit the Earth." },

  // Teknoloji - Technology (5. Sınıf)
  { word: "computer", level: "advanced", category: "Technology", emoji: "💻", turkish: "bilgisayar", example: "I use a computer for homework." },
  { word: "internet", level: "advanced", category: "Technology", emoji: "🌐", turkish: "internet", example: "The internet connects the world." },
  { word: "keyboard", level: "advanced", category: "Technology", emoji: "⌨️", turkish: "klavye", example: "I type on the keyboard." },
  { word: "software", level: "advanced", category: "Technology", emoji: "💿", turkish: "yazılım", example: "Games are software." },
  { word: "password", level: "advanced", category: "Technology", emoji: "🔐", turkish: "şifre", example: "Keep your password secret." },
  { word: "download", level: "advanced", category: "Technology", emoji: "⬇️", turkish: "indirmek", example: "I download music from the internet." },
  { word: "website", level: "advanced", category: "Technology", emoji: "🌐", turkish: "web sitesi", example: "This is an educational website." },
  { word: "smartphone", level: "advanced", category: "Technology", emoji: "📱", turkish: "akıllı telefon", example: "Smartphones are very useful." },
  { word: "video", level: "advanced", category: "Technology", emoji: "🎥", turkish: "video", example: "I watch educational videos." },
  { word: "tablet", level: "advanced", category: "Technology", emoji: "📱", turkish: "tablet", example: "I read books on my tablet." },

  // Daha Fazla Meslekler - More Professions (5. Sınıf)
  { word: "architect", level: "advanced", category: "Professions", emoji: "👷", turkish: "mimar", example: "Architects design buildings." },
  { word: "lawyer", level: "advanced", category: "Professions", emoji: "⚖️", turkish: "avukat", example: "Lawyers help people with laws." },
  { word: "journalist", level: "advanced", category: "Professions", emoji: "📰", turkish: "gazeteci", example: "Journalists write news stories." },
  { word: "musician", level: "advanced", category: "Professions", emoji: "🎵", turkish: "müzisyen", example: "Musicians play instruments." },
  { word: "photographer", level: "advanced", category: "Professions", emoji: "📷", turkish: "fotoğrafçı", example: "Photographers take pictures." },
  { word: "programmer", level: "advanced", category: "Professions", emoji: "💻", turkish: "programcı", example: "Programmers write computer code." },
  { word: "astronomer", level: "advanced", category: "Professions", emoji: "🔭", turkish: "gökbilimci", example: "Astronomers study stars." },
  { word: "detective", level: "advanced", category: "Professions", emoji: "🔍", turkish: "dedektif", example: "Detectives solve mysteries." },
  { word: "author", level: "advanced", category: "Professions", emoji: "✍️", turkish: "yazar", example: "Authors write books." },
  { word: "athlete", level: "advanced", category: "Professions", emoji: "🏃", turkish: "atlet", example: "Athletes train every day." },

  // Fantezi - Fantasy (5. Sınıf)
  { word: "magic", level: "advanced", category: "Fantasy", emoji: "✨", turkish: "sihir", example: "The wizard used magic to help us." },
  { word: "treasure", level: "advanced", category: "Fantasy", emoji: "💎", turkish: "hazine", example: "Pirates search for treasure." },
  { word: "castle", level: "advanced", category: "Fantasy", emoji: "🏰", turkish: "kale", example: "The princess lives in a castle." },
  { word: "dragon", level: "advanced", category: "Fantasy", emoji: "🐉", turkish: "ejderha", example: "The dragon breathes fire." },
  { word: "wizard", level: "advanced", category: "Fantasy", emoji: "🧙", turkish: "büyücü", example: "The wizard has a magic wand." },
  { word: "fairy", level: "advanced", category: "Fantasy", emoji: "🧚", turkish: "peri", example: "Fairies have magical powers." },
  { word: "unicorn", level: "advanced", category: "Fantasy", emoji: "🦄", turkish: "tek boynuzlu at", example: "Unicorns are magical creatures." },
  { word: "knight", level: "advanced", category: "Fantasy", emoji: "⚔️", turkish: "şövalye", example: "Knights wear armor." },
  { word: "princess", level: "advanced", category: "Fantasy", emoji: "👸", turkish: "prenses", example: "The princess is kind." },
  { word: "prince", level: "advanced", category: "Fantasy", emoji: "🤴", turkish: "prens", example: "The prince saved the kingdom." },
  { word: "kingdom", level: "advanced", category: "Fantasy", emoji: "👑", turkish: "krallık", example: "The kingdom was peaceful." },
  { word: "legend", level: "advanced", category: "Fantasy", emoji: "📜", turkish: "efsane", example: "This is an old legend." },

  // Müzik ve Sanat - Music and Art (5. Sınıf)
  { word: "melody", level: "advanced", category: "Music", emoji: "🎵", turkish: "melodi", example: "This song has a beautiful melody." },
  { word: "rhythm", level: "advanced", category: "Music", emoji: "🥁", turkish: "ritim", example: "Dance to the rhythm!" },
  { word: "concert", level: "advanced", category: "Music", emoji: "🎤", turkish: "konser", example: "We went to a concert." },
  { word: "instrument", level: "advanced", category: "Music", emoji: "🎸", turkish: "müzik aleti", example: "Guitar is a musical instrument." },
  { word: "orchestra", level: "advanced", category: "Music", emoji: "🎻", turkish: "orkestra", example: "The orchestra played beautifully." },
  { word: "sculpture", level: "advanced", category: "Art", emoji: "🗿", turkish: "heykel", example: "The sculpture is made of stone." },
  { word: "gallery", level: "advanced", category: "Art", emoji: "🖼️", turkish: "galeri", example: "We saw paintings at the gallery." },
  { word: "portrait", level: "advanced", category: "Art", emoji: "🖼️", turkish: "portre", example: "The artist painted a portrait." },

  // Ülkeler ve Milliyetler - Countries (5. Sınıf)
  { word: "Turkey", level: "advanced", category: "Countries", emoji: "🇹🇷", turkish: "Türkiye", example: "Turkey is a beautiful country." },
  { word: "England", level: "advanced", category: "Countries", emoji: "🇬🇧", turkish: "İngiltere", example: "English comes from England." },
  { word: "America", level: "advanced", category: "Countries", emoji: "🇺🇸", turkish: "Amerika", example: "America is a large country." },
  { word: "Germany", level: "advanced", category: "Countries", emoji: "🇩🇪", turkish: "Almanya", example: "Germany is in Europe." },
  { word: "France", level: "advanced", category: "Countries", emoji: "🇫🇷", turkish: "Fransa", example: "The Eiffel Tower is in France." },
  { word: "Japan", level: "advanced", category: "Countries", emoji: "🇯🇵", turkish: "Japonya", example: "Japan has beautiful temples." },
  { word: "China", level: "advanced", category: "Countries", emoji: "🇨🇳", turkish: "Çin", example: "The Great Wall is in China." },
  { word: "Italy", level: "advanced", category: "Countries", emoji: "🇮🇹", turkish: "İtalya", example: "Pizza comes from Italy." },
  { word: "Spain", level: "advanced", category: "Countries", emoji: "🇪🇸", turkish: "İspanya", example: "Spain has beautiful beaches." },
  { word: "Egypt", level: "advanced", category: "Countries", emoji: "🇪🇬", turkish: "Mısır", example: "The pyramids are in Egypt." },
];

const Words: React.FC = () => {
  const [searchWord, setSearchWord] = useState<string>("");
  const [wordData, setWordData] = useState<WordDefinition | null>(null);
  const [turkishTranslation, setTurkishTranslation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());
  const [favoriteWords, setFavoriteWords] = useState<Set<string>>(new Set());

  const categories = ['all', ...Array.from(new Set(kidsWords.map(w => w.category)))];

  const filteredWords = kidsWords.filter(word => {
    const levelMatch = selectedLevel === 'all' || word.level === selectedLevel;
    const categoryMatch = selectedCategory === 'all' || word.category === selectedCategory;
    return levelMatch && categoryMatch;
  });

  const fetchWordData = async (word: string) => {
    if (!word.trim()) {
      toast.error('Please enter a word! 📝');
      return;
    }

    setLoading(true);

    try {
      const kidsWord = kidsWords.find(w => w.word.toLowerCase() === word.toLowerCase());
      if (kidsWord) {
        setTurkishTranslation(kidsWord.turkish);
      }

      const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);

      if (!dictResponse.ok) {
        toast.error('Word not found! Try another one. 🔍');
        setLoading(false);
        return;
      }

      const dictData = await dictResponse.json();
      setWordData(dictData[0]);

      if (!kidsWord) {
        const transResponse = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|tr`
        );
        const transData = await transResponse.json();

        if (transData.responseData.translatedText) {
          setTurkishTranslation(transData.responseData.translatedText);
        }
      }

      toast.success('Word found! Great job! 🎉');
    } catch (error) {
      console.error('Error fetching word:', error);
      toast.error('Oops! Something went wrong. Try again! 😅');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchWordData(searchWord);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(() => toast.error('Audio not available 🔇'));
  };

  const toggleLearned = (word: string) => {
    const newLearned = new Set(learnedWords);
    if (newLearned.has(word)) {
      newLearned.delete(word);
      toast.success('Removed from learned! 📚');
    } else {
      newLearned.add(word);
      toast.success('Awesome! Word learned! 🌟');
    }
    setLearnedWords(newLearned);
  };

  const toggleFavorite = (word: string) => {
    const newFavorites = new Set(favoriteWords);
    if (newFavorites.has(word)) {
      newFavorites.delete(word);
      toast.success('Removed from favorites! ⭐');
    } else {
      newFavorites.add(word);
      toast.success('Added to favorites! ❤️');
    }
    setFavoriteWords(newFavorites);
  };

  const getPartOfSpeechEmoji = (pos: string) => {
    const emojiMap: { [key: string]: string } = {
      'noun': '📦',
      'verb': '⚡',
      'adjective': '🎨',
      'adverb': '🔄',
      'pronoun': '👤',
      'preposition': '🔗',
      'conjunction': '🔀',
      'interjection': '❗'
    };
    return emojiMap[pos.toLowerCase()] || '📖';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'beginner';
      case 'intermediate': return 'intermediate';
      case 'advanced': return 'advanced';
      default: return 'beginner';
    }
  };

  return (
    <div className="words-page">
      <div className="words-header">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="header-content"
        >
          <BookOpen size={48} className="header-icon" />
          <h1 className="words-title">
            <span className="gradient-text">Smart Dictionary</span> 📚
          </h1>
          <p className="words-subtitle">
            Learn English words made just for kids! 🌟
          </p>
        </motion.div>

        <div className="stats-row">
          <div className="stat-box">
            <Trophy className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{learnedWords.size}</div>
              <div className="stat-label">Words Learned</div>
            </div>
          </div>
          <div className="stat-box">
            <Star className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{favoriteWords.size}</div>
              <div className="stat-label">Favorites</div>
            </div>
          </div>
          <div className="stat-box">
            <Sparkles className="stat-icon" />
            <div className="stat-info">
              <div className="stat-value">{kidsWords.length}</div>
              <div className="stat-label">Total Words</div>
            </div>
          </div>
        </div>
      </div>

      <div className="search-section">
        <div className="search-wrapper">
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for any English word... 🔍"
            className="search-input"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            className="search-button"
            disabled={loading}
          >
            {loading ? <div className="spinner" /> : '🔍 Search'}
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label className="filter-label">Level:</label>
          <div className="filter-buttons">
            {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level as any)}
                className={`filter-btn ${selectedLevel === level ? 'active' : ''} ${level !== 'all' ? getLevelColor(level) : ''}`}
              >
                {level === 'all' ? '🌟 All' :
                  level === 'beginner' ? '🟢 2-3. Sınıf' :
                    level === 'intermediate' ? '🟡 4. Sınıf' : '🔴 5. Sınıf'}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Category:</label>
          <div className="filter-buttons category-scroll">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-btn category ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat === 'all' ? '📚 All' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading-state"
          >
            <div className="spinner-large" />
            <p>Searching the magical dictionary... ✨</p>
          </motion.div>
        )}

        {!loading && wordData && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="word-result"
          >
            <div className="word-card">
              <div className="word-header">
                <div className="word-title-section">
                  <h2 className="word-text">{wordData.word}</h2>
                  {wordData.phonetic && (
                    <span className="phonetic">{wordData.phonetic}</span>
                  )}
                </div>
                <div className="word-actions">
                  {wordData.phonetics.find(p => p.audio) && (
                    <button
                      className="action-btn audio"
                      onClick={() => playAudio(wordData.phonetics.find(p => p.audio)!.audio!)}
                    >
                      <Volume2 size={20} /> Listen
                    </button>
                  )}
                </div>
              </div>

              {turkishTranslation && (
                <div className="translation-quick">
                  <span className="translation-label">🇹🇷 Turkish:</span>
                  <span className="translation-value">{turkishTranslation}</span>
                </div>
              )}

              <div className="meanings-section">
                {wordData.meanings.map((meaning, idx) => (
                  <div key={idx} className="meaning-block">
                    <div className="pos-badge">
                      <span className="pos-emoji">{getPartOfSpeechEmoji(meaning.partOfSpeech)}</span>
                      <span>{meaning.partOfSpeech}</span>
                    </div>

                    <div className="definitions">
                      {meaning.definitions.slice(0, 2).map((def, defIdx) => (
                        <div key={defIdx} className="definition">
                          <div className="def-number">{defIdx + 1}</div>
                          <div className="def-content">
                            <p className="def-text">{def.definition}</p>
                            {def.example && (
                              <p className="example">
                                <span className="example-label">💡 Example:</span>
                                <span className="example-text">"{def.example}"</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !wordData && (
          <motion.div
            key="words-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="words-grid"
          >
            <h2 className="section-title">
              <Sparkles className="section-icon" />
              Learn These Amazing Words! ({filteredWords.length} words)
            </h2>

            <div className="word-cards">
              {filteredWords.map((word, idx) => (
                <motion.div
                  key={`${word.word}-${idx}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                  className={`word-card-mini ${getLevelColor(word.level)}`}
                  onClick={() => {
                    setSearchWord(word.word);
                    fetchWordData(word.word);
                  }}
                >
                  <div className="card-header">
                    <span className="word-emoji">{word.emoji}</span>
                    <span className={`level-badge ${word.level}`}>
                      {word.level === 'beginner' ? '2-3' : word.level === 'intermediate' ? '4' : '5'}
                    </span>
                  </div>

                  <div className="card-body">
                    <h3 className="word-mini">{word.word}</h3>
                    <p className="turkish-mini">🇹🇷 {word.turkish}</p>
                    <span className="category-tag">{word.category}</span>
                  </div>

                  <div className="card-actions">
                    <button
                      className={`icon-btn ${learnedWords.has(word.word) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLearned(word.word);
                      }}
                    >
                      ✓
                    </button>
                    <button
                      className={`icon-btn ${favoriteWords.has(word.word) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(word.word);
                      }}
                    >
                      ★
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredWords.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No words found!</h3>
                <p>Try selecting different filters</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Words;
