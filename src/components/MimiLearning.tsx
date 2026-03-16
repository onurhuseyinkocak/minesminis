import { useState, useEffect, useMemo, useRef, useCallback, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UnifiedMascot, { MascotState } from './UnifiedMascot';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import { useGamification } from '../contexts/GamificationContext';
import { GLINTS } from '../config/GlintsConfig';
import {
  getLearnAudio,
  keyForWordEn,
  keyForWordTr,
  playSFXFromDB,
  type SFXType,
} from '../services/learnAudioService';
import toast from 'react-hot-toast';

type LearningMode = 'menu' | 'vocabulary' | 'challenge' | 'games' | 'lesson' | 'chat';
type GameType = 'menu' | 'matching' | 'spelling' | 'memory' | 'speed' | 'listen' | 'sentence' | 'bubble';

interface VocabularyWord {
  word: string;
  translation: string;
  emoji: string;
  example: string;
  exampleTr?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  emoji: string;
}

interface MemoryCard {
  id: number;
  content: string;
  type: 'word' | 'emoji';
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface LetterTile {
  id: number;
  letter: string;
  placed: boolean;
  correct: boolean | null;
}

interface Bubble {
  id: number;
  word: VocabularyWord;
  x: number;
  y: number;
  popped: boolean;
}

interface SentenceWord {
  id: number;
  word: string;
  placed: boolean;
}

const vocabularyWords: VocabularyWord[] = [
  { word: 'Apple', translation: 'Elma', emoji: '🍎', example: 'I eat an apple every day.', exampleTr: 'Her gün bir elma yerim.' },
  { word: 'Dog', translation: 'Köpek', emoji: '🐕', example: 'The dog is my best friend.', exampleTr: 'Köpek benim en iyi arkadaşımdır.' },
  { word: 'Cat', translation: 'Kedi', emoji: '🐱', example: 'The cat sleeps on the sofa.', exampleTr: 'Kedi kanepede uyur.' },
  { word: 'House', translation: 'Ev', emoji: '🏠', example: 'I live in a big house.', exampleTr: 'Büyük bir evde yaşıyorum.' },
  { word: 'Book', translation: 'Kitap', emoji: '📚', example: 'I read a book every night.', exampleTr: 'Her gece bir kitap okurum.' },
  { word: 'Sun', translation: 'Güneş', emoji: '☀️', example: 'The sun is bright today.', exampleTr: 'Bugün güneş çok parlak.' },
  { word: 'Water', translation: 'Su', emoji: '💧', example: 'I drink water every morning.' },
  { word: 'Tree', translation: 'Ağaç', emoji: '🌳', example: 'The tree has green leaves.' },
  { word: 'Bird', translation: 'Kuş', emoji: '🐦', example: 'The bird can fly high.' },
  { word: 'Flower', translation: 'Çiçek', emoji: '🌸', example: 'The flower smells nice.' },
  { word: 'Happy', translation: 'Mutlu', emoji: '😊', example: 'I am happy today.' },
  { word: 'Big', translation: 'Büyük', emoji: '🐘', example: 'The elephant is big.' },
  { word: 'Small', translation: 'Küçük', emoji: '🐁', example: 'The mouse is small.' },
  { word: 'Red', translation: 'Kırmızı', emoji: '🔴', example: 'The apple is red.' },
  { word: 'Blue', translation: 'Mavi', emoji: '🔵', example: 'The sky is blue.' },
  { word: 'School', translation: 'Okul', emoji: '🏫', example: 'I go to school every day.' },
  { word: 'Friend', translation: 'Arkadaş', emoji: '👫', example: 'She is my best friend.' },
  { word: 'Family', translation: 'Aile', emoji: '👨‍👩‍👧', example: 'I love my family.' },
  { word: 'Food', translation: 'Yemek', emoji: '🍕', example: 'Pizza is my favorite food.' },
  { word: 'Play', translation: 'Oynamak', emoji: '⚽', example: 'I play football with friends.' },
  { word: 'Banana', translation: 'Muz', emoji: '🍌', example: 'The banana is yellow.' },
  { word: 'Fish', translation: 'Balık', emoji: '🐟', example: 'Fish live in water.' },
  { word: 'Star', translation: 'Yıldız', emoji: '⭐', example: 'Stars shine at night.' },
  { word: 'Moon', translation: 'Ay', emoji: '🌙', example: 'The moon is beautiful.' },
  { word: 'Rain', translation: 'Yağmur', emoji: '🌧️', example: 'I love the rain.' },
  { word: 'Butterfly', translation: 'Kelebek', emoji: '🦋', example: 'The butterfly is colorful.' },
  { word: 'Lion', translation: 'Aslan', emoji: '🦁', example: 'The lion is the king.' },
  { word: 'Heart', translation: 'Kalp', emoji: '❤️', example: 'I love you with my heart.' },
  { word: 'Cloud', translation: 'Bulut', emoji: '☁️', example: 'Clouds are white and fluffy.' },
  { word: 'Rainbow', translation: 'Gökkuşağı', emoji: '🌈', example: 'The rainbow has many colors.' }
];

const sentenceTemplates = [
  { words: ['I', 'love', 'you'], correct: 'I love you' },
  { words: ['The', 'cat', 'is', 'happy'], correct: 'The cat is happy' },
  { words: ['I', 'like', 'apples'], correct: 'I like apples' },
  { words: ['The', 'dog', 'runs', 'fast'], correct: 'The dog runs fast' },
  { words: ['She', 'is', 'my', 'friend'], correct: 'She is my friend' },
  { words: ['The', 'sun', 'is', 'bright'], correct: 'The sun is bright' },
  { words: ['I', 'read', 'books'], correct: 'I read books' },
  { words: ['Birds', 'can', 'fly'], correct: 'Birds can fly' }
];

const dailyChallengeQuestions: QuizQuestion[] = [
  { question: 'What color is the sky?', options: ['Red', 'Blue', 'Green', 'Yellow'], correctAnswer: 1, emoji: '🌤️' },
  { question: 'How do you say "Köpek" in English?', options: ['Cat', 'Bird', 'Dog', 'Fish'], correctAnswer: 2, emoji: '🐕' },
  { question: 'What do we drink?', options: ['Book', 'Water', 'Chair', 'Pen'], correctAnswer: 1, emoji: '💧' },
  { question: 'What is the opposite of "big"?', options: ['Tall', 'Small', 'Fast', 'Slow'], correctAnswer: 1, emoji: '📏' },
  { question: 'How many legs does a cat have?', options: ['Two', 'Three', 'Four', 'Five'], correctAnswer: 2, emoji: '🐱' },
  { question: 'What color is grass?', options: ['Blue', 'Red', 'Green', 'Yellow'], correctAnswer: 2, emoji: '🌿' },
  { question: 'Where do fish live?', options: ['In trees', 'In water', 'In houses', 'In the sky'], correctAnswer: 1, emoji: '🐟' },
  { question: 'What do we use to write?', options: ['Fork', 'Pen', 'Spoon', 'Cup'], correctAnswer: 1, emoji: '✏️' },
  { question: 'How do you say "Merhaba" in English?', options: ['Goodbye', 'Hello', 'Thank you', 'Please'], correctAnswer: 1, emoji: '👋' },
  { question: 'What animal says "meow"?', options: ['Dog', 'Bird', 'Cat', 'Cow'], correctAnswer: 2, emoji: '🐱' },
  { question: 'What is the color of the sun?', options: ['Blue', 'Green', 'Yellow', 'Purple'], correctAnswer: 2, emoji: '☀️' },
  { question: 'How do you say "Elma" in English?', options: ['Orange', 'Banana', 'Apple', 'Grape'], correctAnswer: 2, emoji: '🍎' },
  { question: 'What do birds do?', options: ['Swim', 'Fly', 'Run', 'Jump'], correctAnswer: 1, emoji: '🐦' },
  { question: 'What shape is the moon?', options: ['Square', 'Triangle', 'Circle', 'Star'], correctAnswer: 2, emoji: '🌙' },
  { question: 'How many days in a week?', options: ['Five', 'Six', 'Seven', 'Eight'], correctAnswer: 2, emoji: '📅' }
];

interface MimiLearningProps {
  onClose: () => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const MimiLearning: FC<MimiLearningProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { isPremium } = usePremium();
  const { addXP, trackActivity, stats } = useGamification();

  const [mode, setMode] = useState<LearningMode>('menu');
  const [gameType, setGameType] = useState<GameType>('menu');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [vocabStep, setVocabStep] = useState<'learn' | 'quiz'>('learn');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeScore, setChallengeScore] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [dragonState, setDragonState] = useState<MascotState>('waving');
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const [lastQuestionTime, setLastQuestionTime] = useState(Date.now());
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingExitAction, setPendingExitAction] = useState<'menu' | 'games' | 'close' | null>(null);

  const settingsMascotId = (userProfile?.settings as Record<string, string> | undefined)?.mascotId;

  const mascotName = useMemo(() => {
    const id = settingsMascotId || 'mimi_dragon';
    return GLINTS[id]?.name || 'Mimi';
  }, [settingsMascotId]);

  const isInActiveGame = () => {
    if (mode === 'vocabulary' && !showCelebration && currentWordIndex > 0) return true;
    if (mode === 'challenge' && !challengeComplete && challengeIndex > 0) return true;
    if (mode === 'games' && gameType !== 'menu') {
      if (gameType === 'matching' && matchedPairs.size > 0) return true;
      if (gameType === 'spelling' && spellingIndex > 0) return true;
      if (gameType === 'memory' && memoryMoves > 0) return true;
      if (gameType === 'speed' && speedActive) return true;
      if (gameType === 'listen' && listenRound > 0) return true;
      if (gameType === 'sentence' && sentenceIndex > 0) return true;
      if (gameType === 'bubble' && bubbleScore > 0) return true;
    }
    return false;
  };

  const requestExit = (action: 'menu' | 'games' | 'close') => {
    if (isInActiveGame()) {
      setShowExitConfirm(true);
      setPendingExitAction(action);
    } else {
      executeExit(action);
    }
  };

  const executeExit = (action: 'menu' | 'games' | 'close') => {
    if (action === 'close') onClose();
    else if (action === 'menu') setMode('menu');
    else if (action === 'games') setGameType('menu');
    setShowExitConfirm(false);
    setPendingExitAction(null);
  };

  // Lesson of the Day Logic
  const todayLesson = useMemo(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return vocabularyWords[dayOfYear % vocabularyWords.length];
  }, []);

  const FREE_DAILY_LIMIT = 10;
  const [dailyUsage, setDailyUsage] = useState(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('mimi_daily_usage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) return parsed.count;
      } catch { /* corrupted localStorage */ }
    }
    return 0;
  });

  const incrementDailyUsage = () => {
    const today = new Date().toDateString();
    const newCount = dailyUsage + 1;
    setDailyUsage(newCount);
    localStorage.setItem('mimi_daily_usage', JSON.stringify({ date: today, count: newCount }));
  };

  const canAccessFeature = (featureType: 'vocabulary' | 'challenge' | 'games') => {
    if (isPremium) return true;
    if (featureType === 'vocabulary' && dailyUsage < FREE_DAILY_LIMIT) return true;
    if (featureType === 'games') return true;
    if (featureType === 'challenge') return true;
    return false;
  };

  const handleFeatureAccess = (featureType: 'vocabulary' | 'challenge' | 'games', callback: () => void) => {
    if (!canAccessFeature(featureType)) {
      setShowPremiumPrompt(true);
      return;
    }
    if (featureType === 'vocabulary' && !isPremium) {
      incrementDailyUsage();
    }
    callback();
  };

  const audioCache = useRef<Map<string, string>>(new Map());
  const currentAudio = useRef<HTMLAudioElement | null>(null);

  const shuffledWords = [...vocabularyWords].sort(() => Math.random() - 0.5).slice(0, 5);
  const [vocabWords, setVocabWords] = useState(shuffledWords);

  const todaysChallenges = [...dailyChallengeQuestions].sort(() => Math.random() - 0.5).slice(0, 3);
  const [challenges, setChallenges] = useState(todaysChallenges);

  const [vocabQuizOptions, setVocabQuizOptions] = useState<string[][]>(() => {
    return shuffledWords.map(word => {
      const otherWords = vocabularyWords.filter(w => w.word !== word.word);
      const shuffled = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...shuffled.map(w => w.translation), word.translation];
      return options.sort(() => Math.random() - 0.5);
    });
  });

  // Matching Game State
  const [matchingWords, setMatchingWords] = useState<VocabularyWord[]>(() =>
    [...vocabularyWords].sort(() => Math.random() - 0.5).slice(0, 6)
  );
  const [matchingLeft, setMatchingLeft] = useState<VocabularyWord[]>(() =>
    [...matchingWords].sort(() => Math.random() - 0.5)
  );
  const [matchingRight, setMatchingRight] = useState<VocabularyWord[]>(() =>
    [...matchingWords].sort(() => Math.random() - 0.5)
  );
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [matchingScore, setMatchingScore] = useState(0);

  // Enhanced Spelling Game State
  const [spellingWords, setSpellingWords] = useState<VocabularyWord[]>(() =>
    [...vocabularyWords].filter(w => w.word.length <= 7).sort(() => Math.random() - 0.5).slice(0, 5)
  );
  const [spellingIndex, setSpellingIndex] = useState(0);
  const [spellingScore, setSpellingScore] = useState(0);
  const [spellingComplete, setSpellingComplete] = useState(false);
  const [letterTiles, setLetterTiles] = useState<LetterTile[]>([]);
  const [placedLetters, setPlacedLetters] = useState<(LetterTile | null)[]>([]);
  const [spellingFeedback, setSpellingFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showSpellingHint, setShowSpellingHint] = useState(false);

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [memoryScore, setMemoryScore] = useState(0);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryComplete, setMemoryComplete] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // Speed Round State
  const [speedTimeLeft, setSpeedTimeLeft] = useState(60);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedQuestion, setSpeedQuestion] = useState<VocabularyWord | null>(null);
  const [speedOptions, setSpeedOptions] = useState<string[]>([]);
  const [speedActive, setSpeedActive] = useState(false);
  const [speedComplete, setSpeedComplete] = useState(false);
  const speedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speedCountdownRef = useRef(60);

  // Listen & Pick Game State
  const [listenWord, setListenWord] = useState<VocabularyWord | null>(null);
  const [listenOptions, setListenOptions] = useState<VocabularyWord[]>([]);
  const [listenScore, setListenScore] = useState(0);
  const [listenRound, setListenRound] = useState(0);
  const [listenComplete, setListenComplete] = useState(false);
  const [listenFeedback, setListenFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Sentence Builder State
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [sentenceWords, setSentenceWords] = useState<SentenceWord[]>([]);
  const [builtSentence, setBuiltSentence] = useState<SentenceWord[]>([]);
  const [sentenceScore, setSentenceScore] = useState(0);
  const [sentenceComplete, setSentenceComplete] = useState(false);
  const [sentenceFeedback, setSentenceFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Bubble Pop State
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [targetWord, setTargetWord] = useState<VocabularyWord | null>(null);
  const [bubbleScore, setBubbleScore] = useState(0);
  const [bubbleTimeLeft, setBubbleTimeLeft] = useState(45);
  const [bubbleActive, setBubbleActive] = useState(false);
  const [bubbleComplete, setBubbleComplete] = useState(false);
  const bubbleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bubbleSpawnRef = useRef<NodeJS.Timeout | null>(null);

  // No prefetch on mount - fetch only when user clicks Dinle to avoid rate limit

  const playSFX = (type: SFXType) => {
    playSFXFromDB(type).catch(() => {});
  };

  // DB-first TTS: pre-generated from learn_audio, fallback to API
  const speakWord = async (text: string, opts?: { lang?: 'en' | 'tr' }) => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0;
      currentAudio.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (isLoadingAudio) return;

    const cacheKey = `${opts?.lang || 'en'}:${text}`;
    if (audioCache.current.has(cacheKey)) {
      const cachedAudio = audioCache.current.get(cacheKey)!;
      const audio = new Audio(cachedAudio);
      currentAudio.current = audio;
      audio.play().catch(console.error);
      return;
    }

    // Try DB first (pre-generated TTS)
    const keysToTry = opts?.lang === 'tr'
      ? [keyForWordTr(text)]
      : [keyForWordEn(text), keyForWordTr(text)];
    for (const key of keysToTry) {
      const base64 = await getLearnAudio(key);
      if (base64) {
        const url = `data:audio/mp3;base64,${base64}`;
        audioCache.current.set(cacheKey, url);
        const audio = new Audio(url);
        currentAudio.current = audio;
        audio.play().catch(console.error);
        return;
      }
    }

    setIsLoadingAudio(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) throw new Error('TTS failed');

      const data = await response.json();
      const audioUrl = `data:audio/mp3;base64,${data.audio}`;

      audioCache.current.set(cacheKey, audioUrl);

      const audio = new Audio(audioUrl);
      currentAudio.current = audio;
      audio.play().catch((e) => {
        console.warn('Audio play failed, trying Web Speech:', e);
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = opts?.lang === 'tr' ? 'tr-TR' : 'en-US';
          u.rate = 0.9;
          window.speechSynthesis.speak(u);
        }
      });

    } catch (error) {
      console.error('TTS error, falling back to Web Speech:', error);
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = opts?.lang === 'tr' ? 'tr-TR' : 'en-US';
          utterance.pitch = 1.2;
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        } catch (fallbackErr) {
          console.error('Web Speech fallback failed:', fallbackErr);
          toast.error('Ses çalınamadı. İnternet bağlantınızı kontrol edin.');
        }
      } else {
        toast.error('Bu tarayıcı ses desteklemiyor.');
      }
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // Initialize Enhanced Spelling Game
  const initializeSpellingGame = useCallback(() => {
    const word = spellingWords[spellingIndex];
    const letters = word.word.toUpperCase().split('');
    const extraLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      .split('')
      .filter(l => !letters.includes(l))
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const allLetters = [...letters, ...extraLetters].sort(() => Math.random() - 0.5);

    setLetterTiles(allLetters.map((letter, i) => ({
      id: i,
      letter,
      placed: false,
      correct: null
    })));
    setPlacedLetters(new Array(word.word.length).fill(null));
    setSpellingFeedback(null);
    setShowSpellingHint(false);
  }, [spellingWords, spellingIndex]);

  // Reset Spelling Game for replay
  const resetSpellingGame = useCallback(() => {
    const newWords = [...vocabularyWords].filter(w => w.word.length <= 7).sort(() => Math.random() - 0.5).slice(0, 5);
    setSpellingWords(newWords);
    setSpellingIndex(0);
    setSpellingScore(0);
    setSpellingComplete(false);
    setHintsUsed(0);
  }, []);

  useEffect(() => {
    if (gameType === 'spelling' && !spellingComplete) {
      initializeSpellingGame();
    }
  }, [gameType, spellingIndex, spellingComplete, initializeSpellingGame]);

  // Handle Letter Tile Click
  const handleLetterTileClick = (tile: LetterTile) => {
    if (tile.placed || spellingFeedback !== null) return;

    const emptySlotIndex = placedLetters.findIndex(slot => slot === null);
    if (emptySlotIndex === -1) return;

    const newPlaced = [...placedLetters];
    newPlaced[emptySlotIndex] = { ...tile, placed: true };
    setPlacedLetters(newPlaced);

    setLetterTiles(prev => prev.map(t =>
      t.id === tile.id ? { ...t, placed: true } : t
    ));
  };

  // Handle Placed Letter Click (remove)
  const handlePlacedLetterClick = (index: number) => {
    if (spellingFeedback !== null) return;

    const tile = placedLetters[index];
    if (!tile) return;

    const newPlaced = [...placedLetters];
    newPlaced[index] = null;
    setPlacedLetters(newPlaced);

    setLetterTiles(prev => prev.map(t =>
      t.id === tile.id ? { ...t, placed: false } : t
    ));
  };

  // Check Spelling Answer
  const checkSpellingAnswer = () => {
    const answer = placedLetters.map(t => t?.letter || '').join('');
    const correct = spellingWords[spellingIndex].word.toUpperCase();

    if (answer === correct) {
      setSpellingFeedback('correct');
      playSFX('win');
      setDragonState('celebrating');

      let points = hintsUsed === 0 ? 25 : hintsUsed === 1 ? 15 : 10;

      // Sparky: Hints cost fewer points (faster hint access)
      if (stats.mascotId === 'sparky_alien' && hintsUsed > 0) {
        if (hintsUsed === 1) points = 20;
        else points = 18;
      }

      setSpellingScore(prev => prev + points);
      trackActivity('word_learned', { word: correct });
      speakWord('Great job!');

      setTimeout(() => {
        if (spellingIndex < spellingWords.length - 1) {
          setSpellingIndex(prev => prev + 1);
          setHintsUsed(0);
        } else {
          setSpellingComplete(true);
        }
        setDragonState('idle');
      }, 1500);
    } else {
      setSpellingFeedback('wrong');
      playSFX('wrong');
      setDragonState('thinking');

      const newPlaced = placedLetters.map((t, i) => {
        if (t && t.letter === correct[i]) {
          return { ...t, correct: true };
        } else if (t) {
          return { ...t, correct: false };
        }
        return null;
      });
      setPlacedLetters(newPlaced);

      setTimeout(() => {
        newPlaced.forEach(t => {
          if (t && t.correct === false) {
            setLetterTiles(prev => prev.map(lt =>
              lt.id === t.id ? { ...lt, placed: false, correct: null } : lt
            ));
          }
        });
        setPlacedLetters(prev => prev.map(t =>
          t && t.correct === false ? null : t
        ));
        setSpellingFeedback(null);
        setDragonState('idle');
      }, 1500);
    }
  };

  // Give Spelling Hint
  const giveSpellingHint = () => {
    if (hintsUsed >= 2) return;

    setShowSpellingHint(true);
    setHintsUsed(prev => prev + 1);
    speakWord(spellingWords[spellingIndex].word);
  };

  // Initialize Memory Game
  const initializeMemoryGame = useCallback(() => {
    const selectedWords = [...vocabularyWords].sort(() => Math.random() - 0.5).slice(0, 6);
    const cards: MemoryCard[] = [];

    selectedWords.forEach((word, index) => {
      cards.push({
        id: index * 2,
        content: word.word,
        type: 'word',
        pairId: index,
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        id: index * 2 + 1,
        content: word.emoji,
        type: 'emoji',
        pairId: index,
        isFlipped: false,
        isMatched: false
      });
    });

    setMemoryCards(cards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMemoryScore(0);
    setMemoryMoves(0);
    setMemoryComplete(false);
  }, []);

  // Reset Matching Game
  const resetMatchingGame = useCallback(() => {
    const newWords = [...vocabularyWords].sort(() => Math.random() - 0.5).slice(0, 6);
    setMatchingWords(newWords);
    setMatchingLeft([...newWords].sort(() => Math.random() - 0.5));
    setMatchingRight([...newWords].sort(() => Math.random() - 0.5));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs(new Set());
    setMatchingScore(0);
  }, []);

  // Handle Memory Card Click
  const handleMemoryCardClick = (cardId: number) => {
    if (isFlipping) return;

    const card = memoryCards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    setMemoryCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlipped.length === 2) {
      setIsFlipping(true);
      setMemoryMoves(prev => prev + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = memoryCards.find(c => c.id === firstId)!;
      const secondCard = memoryCards.find(c => c.id === secondId)!;

      setTimeout(() => {
        if (firstCard.pairId === secondCard.pairId) {
          setMemoryCards(prev => prev.map(c =>
            c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c
          ));
          setMemoryScore(prev => prev + 20);
          setDragonState('celebrating');

          const allMatched = memoryCards.filter(c => c.pairId !== firstCard.pairId).every(c => c.isMatched);
          if (allMatched) {
            setTimeout(() => setMemoryComplete(true), 500);
          }
        } else {
          setMemoryCards(prev => prev.map(c =>
            newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
        }

        setFlippedCards([]);
        setIsFlipping(false);
        setDragonState('idle');
      }, 1000);
    }
  };

  // Initialize Listen & Pick
  const initializeListenGame = useCallback(() => {
    const shuffled = [...vocabularyWords].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const options = shuffled.slice(0, 4);

    setListenWord(target);
    setListenOptions(options.sort(() => Math.random() - 0.5));
    setListenFeedback(null);

    setTimeout(() => speakWord(target.word), 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- speakWord stable, avoid callback churn
  }, []);

  // Reset Listen & Pick
  const resetListenGame = useCallback(() => {
    setListenRound(0);
    setListenScore(0);
    setListenComplete(false);
    initializeListenGame();
  }, [initializeListenGame]);

  // Handle Listen Answer
  const handleListenAnswer = (word: VocabularyWord) => {
    if (listenFeedback !== null) return;
    if (word.word === listenWord?.word) {
      setListenFeedback('correct');
      setListenScore(prev => prev + 20);
      playSFX('win');
      setDragonState('celebrating');
      speakWord('Excellent!');
      setTimeout(() => {
        if (listenRound < 4) {
          setListenRound(prev => prev + 1);
          initializeListenGame();
        } else {
          setListenComplete(true);
        }
        setDragonState('idle');
      }, 1500);
    } else {
      setListenFeedback('wrong');
      playSFX('wrong');
      setDragonState('thinking');
      speakWord('Try again!');
      setTimeout(() => {
        setListenFeedback(null);
        setDragonState('idle');
      }, 1500);
    }
  };

  // Render Lesson of the Day
  const renderLesson = () => {
    return (
      <div className="mimi-lesson">
        <div className="vocab-header">
          <button className="back-btn" onClick={() => requestExit('menu')}>← Geri</button>
          <h2>🌟 Günün Dersi</h2>
        </div>

        <motion.div
          className="lesson-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="lesson-hero">
            <span className="lesson-emoji">{todayLesson.emoji}</span>
            <h3 className="lesson-word">{todayLesson.word}</h3>
            <p className="lesson-translation">{todayLesson.translation}</p>
          </div>

          <div className="lesson-details">
            <div className="detail-section">
              <h4>📖 Nasıl Kullanılır?</h4>
              <p className="lesson-example">"{todayLesson.example}"</p>
              <p className="lesson-example-tr">{todayLesson.exampleTr}</p>
            </div>

            <button
              className="lesson-speak-btn"
              onClick={() => speakWord(todayLesson.word)}
              disabled={isLoadingAudio}
            >
              {isLoadingAudio ? '⏳' : '🔊'} Kelimeyi Dinle
            </button>
          </div>

          <div className="lesson-activity">
            <h4>🎯 Küçük Bir Görev</h4>
            <p>Bu kelimeyi bir cümlede kullanabilir misin? {(GLINTS[((userProfile?.settings as Record<string, string>)?.mascotId) || 'mimi_dragon'] || GLINTS.mimi_dragon).name}'ye fısılda!</p>
            <button className="lesson-complete-btn" onClick={() => {
              setMode('menu');
              addXP(10, 'daily_lesson_complete');
              trackActivity('word_learned', { word: todayLesson.word });
              toast.success(`You learned ${todayLesson.word}! 🌟`);
            }}>
              Dersi Tamamladım! ✨
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  // Initialize Sentence Builder
  const initializeSentenceGame = useCallback(() => {
    const template = sentenceTemplates[sentenceIndex % sentenceTemplates.length];
    const words = template.words.map((word, i) => ({
      id: i,
      word,
      placed: false
    }));
    setSentenceWords(words.sort(() => Math.random() - 0.5));
    setBuiltSentence([]);
    setSentenceFeedback(null);
  }, [sentenceIndex]);

  // Reset Sentence Builder
  const resetSentenceGame = useCallback(() => {
    setSentenceIndex(0);
    setSentenceScore(0);
    setSentenceComplete(false);
    initializeSentenceGame();
  }, [initializeSentenceGame]);

  // Handle Sentence Word Click
  const handleSentenceWordClick = (word: SentenceWord) => {
    if (word.placed || sentenceFeedback !== null) return;

    setSentenceWords(prev => prev.map(w =>
      w.id === word.id ? { ...w, placed: true } : w
    ));
    setBuiltSentence(prev => [...prev, word]);
  };

  // Remove Sentence Word
  const removeSentenceWord = (index: number) => {
    if (sentenceFeedback !== null) return;

    const word = builtSentence[index];
    setSentenceWords(prev => prev.map(w =>
      w.id === word.id ? { ...w, placed: false } : w
    ));
    setBuiltSentence(prev => prev.filter((_, i) => i !== index));
  };

  // Check Sentence
  const checkSentence = () => {
    const built = builtSentence.map(w => w.word).join(' ');
    const correct = sentenceTemplates[sentenceIndex % sentenceTemplates.length].correct;

    if (built === correct) {
      setSentenceFeedback('correct');
      setSentenceScore(prev => prev + 25);
      playSFX('win');
      setDragonState('celebrating');
      speakWord(correct);

      setTimeout(() => {
        if (sentenceIndex < 4) {
          setSentenceIndex(prev => prev + 1);
        } else {
          setSentenceComplete(true);
        }
        setDragonState('idle');
      }, 2000);
    } else {
      setSentenceFeedback('wrong');
      playSFX('wrong');
      setDragonState('thinking');

      setTimeout(() => {
        setSentenceFeedback(null);
        setDragonState('idle');
      }, 1500);
    }
  };

  useEffect(() => {
    if (gameType === 'sentence' && !sentenceComplete) {
      initializeSentenceGame();
    }
  }, [gameType, sentenceIndex, sentenceComplete, initializeSentenceGame]);

  // Initialize Bubble Pop
  const startBubbleGame = useCallback(() => {
    setBubbleActive(true);
    setBubbleTimeLeft(45);
    setBubbleScore(0);
    setBubbles([]);

    const randomWord = vocabularyWords[Math.floor(Math.random() * vocabularyWords.length)];
    setTargetWord(randomWord);
    speakWord(randomWord.translation, { lang: 'tr' });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- speakWord is stable, avoid callback churn
  }, []);

  // Spawn Bubbles
  useEffect(() => {
    if (!bubbleActive || !targetWord) return;

    const spawnBubble = () => {
      const words = [...vocabularyWords].sort(() => Math.random() - 0.5).slice(0, 4);
      if (!words.find(w => w.word === targetWord.word)) {
        words[Math.floor(Math.random() * words.length)] = targetWord;
      }

      const word = words[Math.floor(Math.random() * words.length)];
      const newBubble: Bubble = {
        id: Date.now(),
        word,
        x: Math.random() * 80 + 10,
        y: 100,
        popped: false
      };

      setBubbles(prev => [...prev.filter(b => !b.popped && b.y > 0), newBubble]);
    };

    bubbleSpawnRef.current = setInterval(spawnBubble, 1200);
    return () => {
      if (bubbleSpawnRef.current) clearInterval(bubbleSpawnRef.current);
    };
  }, [bubbleActive, targetWord]);

  // Bubble Timer
  useEffect(() => {
    if (!bubbleActive) return;

    bubbleTimerRef.current = setInterval(() => {
      setBubbleTimeLeft(prev => {
        if (prev <= 1) {
          setBubbleActive(false);
          setBubbleComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (bubbleTimerRef.current) clearInterval(bubbleTimerRef.current);
    };
  }, [bubbleActive]);

  // Animate Bubbles
  useEffect(() => {
    if (!bubbleActive) return;

    const animateBubbles = setInterval(() => {
      setBubbles(prev => prev
        .map(b => ({ ...b, y: b.y - 2 }))
        .filter(b => b.y > -10 && !b.popped)
      );
    }, 50);

    return () => clearInterval(animateBubbles);
  }, [bubbleActive]);

  // Pop Bubble
  const popBubble = (bubble: Bubble) => {
    playSFX('pop');
    if (bubble.word.word === targetWord?.word) {
      setBubbleScore(prev => prev + 15);
      setDragonState('celebrating');

      const newTarget = vocabularyWords[Math.floor(Math.random() * vocabularyWords.length)];
      setTargetWord(newTarget);
      speakWord(newTarget.translation, { lang: 'tr' });

      setTimeout(() => setDragonState('idle'), 500);
    }

    setBubbles(prev => prev.map(b =>
      b.id === bubble.id ? { ...b, popped: true } : b
    ));
  };

  // Reset Bubble Game
  const resetBubbleGame = useCallback(() => {
    setBubbleComplete(false);
    setBubbleScore(0);
    setBubbleTimeLeft(45);
    setBubbles([]);
    setTargetWord(null);
    setBubbleActive(false);
  }, []);

  // Speed Round Logic
  const generateSpeedQuestion = useCallback(() => {
    const word = vocabularyWords[Math.floor(Math.random() * vocabularyWords.length)];
    const otherWords = vocabularyWords.filter(w => w.word !== word.word);
    const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...shuffledOthers.map(w => w.translation), word.translation].sort(() => Math.random() - 0.5);

    setSpeedQuestion(word);
    setSpeedOptions(options);
  }, []);

  const startSpeedRound = useCallback(() => {
    playSFX('countdown');
    setSpeedActive(true);
    setSpeedScore(0);
    speedCountdownRef.current = 60;
    setSpeedTimeLeft(60);
    generateSpeedQuestion();

    if (speedTimerRef.current) clearInterval(speedTimerRef.current);
    speedTimerRef.current = setInterval(() => {
      speedCountdownRef.current -= 1;
      const left = speedCountdownRef.current;
      setSpeedTimeLeft(left);
      if (left <= 0) {
        setSpeedActive(false);
        setSpeedComplete(true);
        if (speedTimerRef.current) {
          clearInterval(speedTimerRef.current);
          speedTimerRef.current = null;
        }
      }
    }, 1000);
  }, [generateSpeedQuestion]);

  const resetSpeedRound = useCallback(() => {
    setSpeedComplete(false);
    setSpeedActive(false);
    setSpeedScore(0);
    speedCountdownRef.current = 60;
    setSpeedTimeLeft(60);
    setSpeedQuestion(null);
    if (speedTimerRef.current) {
      clearInterval(speedTimerRef.current);
      speedTimerRef.current = null;
    }
  }, []);

  const handleSpeedAnswer = (answer: string) => {
    if (answer === speedQuestion?.translation) {
      setSpeedScore(prev => prev + 10);
    }
    generateSpeedQuestion();
  };

  useEffect(() => {
    return () => {
      if (speedTimerRef.current) clearInterval(speedTimerRef.current);
      if (bubbleTimerRef.current) clearInterval(bubbleTimerRef.current);
      if (bubbleSpawnRef.current) clearInterval(bubbleSpawnRef.current);
    };
  }, []);

  // Matching Game Logic
  const handleMatchingSelect = (word: VocabularyWord, side: 'left' | 'right') => {
    if (side === 'left') {
      setSelectedLeft(word.word);
      if (selectedRight) {
        checkMatch(word.word, selectedRight);
      }
    } else {
      setSelectedRight(word.word);
      if (selectedLeft) {
        checkMatch(selectedLeft, word.word);
      }
    }
  };

  const checkMatch = (left: string, right: string) => {
    const leftWord = matchingWords.find(w => w.word === left);
    const rightWord = matchingWords.find(w => w.word === right);

    if (leftWord && rightWord && leftWord.word === rightWord.word) {
      setMatchedPairs(prev => new Set([...prev, left]));
      setMatchingScore(prev => prev + 15);
      playSFX('win');
      setDragonState('celebrating');

      setTimeout(() => setDragonState('idle'), 1000);
    }

    setSelectedLeft(null);
    setSelectedRight(null);
  };

  // Vocabulary Logic
  const handleVocabAnswer = (answerIndex: number) => {
    const currentWord = vocabWords[currentWordIndex];
    const options = vocabQuizOptions[currentWordIndex];
    const isAnswerCorrect = options[answerIndex] === currentWord.translation;

    setSelectedAnswer(answerIndex);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      const bonus = Date.now() - lastQuestionTime < 5000 ? 15 : 10;
      setScore(prev => prev + bonus);
      setDragonState('celebrating');
    } else {
      setDragonState('thinking');
    }

    setTimeout(() => {
      if (currentWordIndex < vocabWords.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setLastQuestionTime(Date.now());
        setVocabStep('learn');
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowCelebration(true);
      }
      setDragonState('idle');
    }, 1500);
  };

  // Challenge Logic
  const handleChallengeAnswer = (answerIndex: number) => {
    const currentQuestion = challenges[challengeIndex];
    const isAnswerCorrect = answerIndex === currentQuestion.correctAnswer;

    setSelectedAnswer(answerIndex);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setChallengeScore(prev => prev + 20);
      setDragonState('celebrating');
    } else {
      setDragonState('thinking');
    }

    setTimeout(() => {
      if (challengeIndex < challenges.length - 1) {
        setChallengeIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setChallengeComplete(true);
      }
      setDragonState('idle');
    }, 1500);
  };

  // Reset Vocabulary
  const resetVocabulary = useCallback(() => {
    const newWords = [...vocabularyWords].sort(() => Math.random() - 0.5).slice(0, 5);
    setVocabWords(newWords);
    setVocabQuizOptions(newWords.map(word => {
      const otherWords = vocabularyWords.filter(w => w.word !== word.word);
      const shuffled = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...shuffled.map(w => w.translation), word.translation];
      return options.sort(() => Math.random() - 0.5);
    }));
    setCurrentWordIndex(0);
    setVocabStep('learn');
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setShowCelebration(false);
  }, []);

  // Reset Challenge
  const resetChallenge = useCallback(() => {
    const newChallenges = [...dailyChallengeQuestions].sort(() => Math.random() - 0.5).slice(0, 3);
    setChallenges(newChallenges);
    setChallengeIndex(0);
    setChallengeScore(0);
    setChallengeComplete(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  // Render Premium Prompt
  const renderPremiumPrompt = () => (
    <motion.div
      className="premium-prompt-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowPremiumPrompt(false)}
    >
      <motion.div
        className="premium-prompt-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="premium-prompt-icon">👑</div>
        <h2>Premium Özellik!</h2>
        <p>Bu özelliğe erişmek için MiniPremium üyesi olmalısın.</p>
        <div className="premium-prompt-features">
          <div className="feature-item">✨ Sınırsız kelime pratik</div>
          <div className="feature-item">🎮 Tüm oyunlara erişim</div>
          <div className="feature-item">⭐ Günlük meydan okumalar</div>
          <div className="feature-item">🔊 Sesli telaffuz</div>
        </div>
        <button
          className="premium-prompt-btn"
          onClick={() => {
            onClose();
            navigate('/premium');
          }}
        >
          Premium'a Geç 🚀
        </button>
        <button
          className="premium-prompt-close"
          onClick={() => setShowPremiumPrompt(false)}
        >
          Belki sonra
        </button>
      </motion.div>
    </motion.div>
  );

  // Render Menu
  const renderMenu = () => (
    <motion.div
      className="mimi-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="menu-dragon">
        <UnifiedMascot id={((userProfile?.settings as Record<string, string>)?.mascotId) || 'mimi_dragon'} state={dragonState} size={90} />
      </div>

      <h2 className="menu-title">{mascotName} ile Öğren! 🎓</h2>
      <p className="menu-subtitle">Ne öğrenmek istersin?</p>

      {!isPremium && (
        <div className="free-usage-info">
          <span className="usage-icon">🎁</span>
          <span>Ücretsiz: {FREE_DAILY_LIMIT - dailyUsage} kelime pratik kaldı</span>
        </div>
      )}

      <div className="learning-options">
        <motion.button
          className="menu-option lesson"
          onClick={() => setMode('lesson')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="option-icon">🌟</span>
          <div className="option-content">
            <h3>Günün Dersi</h3>
            <p>Bugün yeni bir kelime keşfet!</p>
          </div>
          <span className="new-badge">Yeni</span>
        </motion.button>

        <motion.button
          className="menu-option vocabulary"
          onClick={() => handleFeatureAccess('vocabulary', () => setMode('vocabulary'))}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="option-icon">📚</span>
          <div className="option-content">
            <h3>Kelime Öğren</h3>
            <p>Yeni kelimeler öğren ve pratik yap!</p>
          </div>
          {!isPremium && dailyUsage >= FREE_DAILY_LIMIT && <span className="locked-badge">🔒</span>}
        </motion.button>

        <motion.button
          className="menu-option challenge"
          onClick={() => setMode('challenge')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="option-icon">⭐</span>
          <div className="option-content">
            <h3>Günlük Meydan Okuma</h3>
            <p>Bugünün sorularını çöz!</p>
          </div>
        </motion.button>

        <motion.button
          className="menu-option games"
          onClick={() => setMode('games')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="option-icon">🎮</span>
          <div className="option-content">
            <h3>Hızlı Oyunlar</h3>
            <p>Eğlenceli oyunlarla öğren!</p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );

  // Render Vocabulary
  const renderVocabulary = () => {
    const currentWord = vocabWords[currentWordIndex];

    if (showCelebration) {
      return (
        <motion.div
          className="celebration"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2>🎉 Harika İş! 🎉</h2>
          <p>Tüm kelimeleri öğrendin!</p>
          <div className="final-score">Toplam Puan: ⭐ {score}</div>
          <div className="celebration-buttons">
            <button className="replay-btn" onClick={resetVocabulary}>
              🔄 Tekrar Oyna
            </button>
            <button className="menu-btn" onClick={() => { addXP(score, 'vocabulary_complete'); resetVocabulary(); setMode('menu'); }}>
              Ana Menüye Dön
            </button>
          </div>
        </motion.div>
      );
    }

    return (
      <div className="mimi-vocabulary">
        <div className="vocab-header">
          <button className="back-btn" onClick={() => requestExit('menu')}>← Geri</button>
          <div className="vocab-progress">
            {currentWordIndex + 1} / {vocabWords.length}
          </div>
          <div className="vocab-score">⭐ {score}</div>
        </div>

        {vocabStep === 'learn' ? (
          <motion.div
            className="word-card"
            key={currentWord.word}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="word-emoji">{currentWord.emoji}</div>
            <div className="word-english">{currentWord.word}</div>
            <div className="word-turkish">{currentWord.translation}</div>
            <div className="word-example">"{currentWord.example}"</div>

            <button
              className="speak-btn"
              onClick={() => {
                speakWord(currentWord.word);
                setTimeout(() => speakWord(currentWord.example), 1000);
              }}
              disabled={isLoadingAudio}
            >
              {isLoadingAudio ? '⏳' : '🔊'} Dinle
            </button>

            <button className="next-btn" onClick={() => setVocabStep('quiz')}>
              Quiz Zamanı! →
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="quiz-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="quiz-question">
              <span className="quiz-emoji">{currentWord.emoji}</span>
              <h3>"{currentWord.word}" ne demek?</h3>
            </div>

            <div className="quiz-options">
              {vocabQuizOptions[currentWordIndex].map((option, index) => (
                <motion.button
                  key={index}
                  className={`quiz-option ${selectedAnswer === index
                    ? isCorrect
                      ? 'correct'
                      : 'wrong'
                    : ''
                    } ${selectedAnswer !== null && option === currentWord.translation ? 'show-correct' : ''}`}
                  onClick={() => handleVocabAnswer(index)}
                  disabled={selectedAnswer !== null}
                  whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // Render Challenge
  const renderChallenge = () => {
    const currentQuestion = challenges[challengeIndex];

    if (challengeComplete) {
      return (
        <motion.div
          className="celebration"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2>🏆 Günlük Meydan Okuma Tamamlandı! 🏆</h2>
          <div className="challenge-results">
            <div className="result-score">
              <span className="score-label">Toplam Puan</span>
              <span className="score-value">⭐ {challengeScore}</span>
            </div>
            <div className="result-correct">
              <span className="correct-label">Doğru Cevap</span>
              <span className="correct-value">{challengeScore / 20} / 3</span>
            </div>
          </div>
          <p className="encourage-text">
            {challengeScore >= 60 ? 'Muhteşem! Süper bir öğrencisin! 🌟' :
              challengeScore >= 40 ? 'Çok iyi! Yarın daha da iyi olacaksın! 💪' :
                'Pratik yapmaya devam et! Sen başarabilirsin! 🎯'}
          </p>
          <div className="celebration-buttons">
            <button className="replay-btn" onClick={resetChallenge}>
              🔄 Tekrar Oyna
            </button>
            <button className="menu-btn" onClick={() => { addXP(challengeScore, 'challenge_complete'); resetChallenge(); setMode('menu'); }}>
              Ana Menüye Dön
            </button>
          </div>
        </motion.div>
      );
    }

    return (
      <div className="mimi-challenge">
        <div className="challenge-header">
          <button className="back-btn" onClick={() => requestExit('menu')}>← Geri</button>
          <div className="challenge-progress">
            Soru {challengeIndex + 1} / {challenges.length}
          </div>
          <div className="challenge-score">⭐ {challengeScore}</div>
        </div>

        <motion.div
          className="challenge-question"
          key={challengeIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="question-emoji">{currentQuestion.emoji}</div>
          <h3>{currentQuestion.question}</h3>

          <div className="challenge-options">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                className={`challenge-option ${selectedAnswer === index
                  ? isCorrect
                    ? 'correct'
                    : 'wrong'
                  : ''
                  } ${selectedAnswer !== null && index === currentQuestion.correctAnswer ? 'show-correct' : ''}`}
                onClick={() => handleChallengeAnswer(index)}
                disabled={selectedAnswer !== null}
                whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  // Render Matching Game
  const renderMatchingGame = () => {
    const isComplete = matchedPairs.size === matchingWords.length;

    if (isComplete) {
      return (
        <motion.div
          className="game-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2>🎉 Tebrikler! 🎉</h2>
          <p>Tüm eşleştirmeleri tamamladın!</p>
          <div className="final-score">Toplam Puan: ⭐ {matchingScore}</div>
          <div className="game-complete-buttons">
            <button className="replay-btn" onClick={() => { resetMatchingGame(); }}>
              🔄 Tekrar Oyna
            </button>
            <button onClick={() => { addXP(matchingScore, 'matching_complete'); resetMatchingGame(); setGameType('menu'); }}>
              Oyunlara Dön
            </button>
          </div>
        </motion.div>
      );
    }

    return (
      <div className="matching-game">
        <div className="game-header">
          <button className="back-btn" onClick={() => requestExit('games')}>← Geri</button>
          <h3>🔤 Kelime Eşleştirme</h3>
          <div className="game-score">⭐ {matchingScore}</div>
        </div>

        <p className="game-instruction">İngilizce kelimeyi Türkçe karşılığıyla eşleştir!</p>

        <div className="matching-columns">
          <div className="matching-column left">
            {matchingLeft.map(word => (
              <motion.button
                key={word.word}
                className={`matching-card ${selectedLeft === word.word ? 'selected' : ''} ${matchedPairs.has(word.word) ? 'matched' : ''}`}
                onClick={() => handleMatchingSelect(word, 'left')}
                disabled={matchedPairs.has(word.word)}
                whileHover={{ scale: matchedPairs.has(word.word) ? 1 : 1.05 }}
              >
                <span className="card-emoji">{word.emoji}</span>
                <span className="card-text">{word.word}</span>
              </motion.button>
            ))}
          </div>

          <div className="matching-column right">
            {matchingRight.map(word => (
              <motion.button
                key={word.word + '-tr'}
                className={`matching-card ${selectedRight === word.word ? 'selected' : ''} ${matchedPairs.has(word.word) ? 'matched' : ''}`}
                onClick={() => handleMatchingSelect(word, 'right')}
                disabled={matchedPairs.has(word.word)}
                whileHover={{ scale: matchedPairs.has(word.word) ? 1 : 1.05 }}
              >
                <span className="card-text">{word.translation}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render Enhanced Spelling Game
  const renderSpellingGame = () => {
    if (spellingComplete) {
      return (
        <motion.div
          className="game-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2>🎉 Harika İş! 🎉</h2>
          <p>Yazım pratiğini tamamladın!</p>
          <div className="final-score">Toplam Puan: ⭐ {spellingScore}</div>
          <div className="game-complete-buttons">
            <button className="replay-btn" onClick={() => { resetSpellingGame(); }}>
              🔄 Tekrar Oyna
            </button>
            <button onClick={() => { addXP(spellingScore, 'spelling_complete'); resetSpellingGame(); setGameType('menu'); }}>
              Oyunlara Dön
            </button>
          </div>
        </motion.div>
      );
    }

    const currentWord = spellingWords[spellingIndex];

    return (
      <div className="spelling-game enhanced">
        <div className="game-header">
          <button className="back-btn" onClick={() => requestExit('games')}>← Geri</button>
          <h3>🅰️ Harf Dizme</h3>
          <div className="game-score">⭐ {spellingScore}</div>
        </div>

        <div className="spelling-progress">
          {spellingIndex + 1} / {spellingWords.length}
        </div>

        <motion.div
          className="spelling-card-enhanced"
          key={spellingIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="spelling-word-display">
            <div className="spelling-emoji-large">{currentWord.emoji}</div>
            <div className="spelling-turkish-large">
              <strong>{currentWord.translation}</strong>
            </div>
          </div>

          {showSpellingHint && (
            <motion.div
              className="spelling-hint-enhanced"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <span className="hint-icon">💡</span>
              <span>İlk harf: <strong>{currentWord.word[0].toUpperCase()}</strong></span>
              <span className="hint-length">({currentWord.word.length} harf)</span>
            </motion.div>
          )}

          <div className="letter-slots">
            {placedLetters.map((tile, index) => (
              <motion.div
                key={index}
                className={`letter-slot ${tile ? 'filled' : ''} ${tile?.correct === true ? 'correct' : ''} ${tile?.correct === false ? 'wrong' : ''}`}
                onClick={() => handlePlacedLetterClick(index)}
                whileHover={tile ? { scale: 1.1 } : {}}
                whileTap={tile ? { scale: 0.9 } : {}}
              >
                {tile?.letter || ''}
              </motion.div>
            ))}
          </div>

          <div className="letter-tiles">
            {letterTiles.map(tile => (
              <motion.button
                key={tile.id}
                className={`letter-tile ${tile.placed ? 'placed' : ''}`}
                onClick={() => handleLetterTileClick(tile)}
                disabled={tile.placed}
                whileHover={!tile.placed ? { scale: 1.1, y: -5 } : {}}
                whileTap={!tile.placed ? { scale: 0.9 } : {}}
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  opacity: tile.placed ? 0.3 : 1,
                  scale: tile.placed ? 0.8 : 1
                }}
              >
                {tile.letter}
              </motion.button>
            ))}
          </div>

          <div className="spelling-actions-enhanced">
            <button
              className="hint-btn"
              onClick={giveSpellingHint}
              disabled={hintsUsed >= 2}
            >
              💡 İpucu ({2 - hintsUsed})
            </button>
            <button
              className="speak-btn"
              onClick={() => speakWord(currentWord.word)}
              disabled={isLoadingAudio}
            >
              {isLoadingAudio ? '⏳' : '🔊'} Dinle
            </button>
            <button
              className="check-btn"
              onClick={checkSpellingAnswer}
              disabled={placedLetters.some(t => t === null) || spellingFeedback !== null}
            >
              ✓ Kontrol Et
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  // Render Memory Game
  const renderMemoryGame = () => {
    if (memoryComplete) {
      return (
        <motion.div
          className="game-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2>🎉 Hafıza Şampiyonu! 🎉</h2>
          <p>Tüm kartları eşleştirdin!</p>
          <div className="memory-stats">
            <div>Puan: ⭐ {memoryScore}</div>
            <div>Hamle: {memoryMoves}</div>
          </div>
          <div className="game-complete-buttons">
            <button className="replay-btn" onClick={() => { initializeMemoryGame(); }}>
              🔄 Tekrar Oyna
            </button>
            <button onClick={() => { addXP(memoryScore, 'memory_complete'); initializeMemoryGame(); setGameType('menu'); }}>
              Oyunlara Dön
            </button>
          </div>
        </motion.div>
      );
    }

    return (
      <div className="memory-game">
        <div className="game-header">
          <button className="back-btn" onClick={() => requestExit('games')}>← Geri</button>
          <h3>🧠 Hafıza Oyunu</h3>
          <div className="game-stats">
            <span>⭐ {memoryScore}</span>
            <span>🎯 {memoryMoves}</span>
          </div>
        </div>

        <p className="game-instruction">Kelimeyi emojiyle eşleştir!</p>

        <div className="memory-grid">
          {memoryCards.map(card => (
            <motion.div
              key={card.id}
              className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
              onClick={() => handleMemoryCardClick(card.id)}
              whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="card-inner">
                <div className="card-front">❓</div>
                <div className="card-back">
                  {card.type === 'emoji' ? (
                    <span className="card-emoji-large">{card.content}</span>
                  ) : (
                    <span className="card-word">{card.content}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Render Speed Round
  const renderSpeedRound = () => {
    if (speedComplete) {
      return (
        <motion.div
          className="game-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2>⏱️ Süre Doldu! ⏱️</h2>
          <p>Hız turunu tamamladın!</p>
          <div className="speed-results">
            <div className="speed-final-score">Puan: ⭐ {speedScore}</div>
            <div className="speed-correct-count">Doğru: {speedScore / 10} kelime</div>
          </div>
          <p className="speed-message">
            {speedScore >= 100 ? 'İnanılmaz hız! 🚀' :
              speedScore >= 60 ? 'Çok iyi! Süper hızlısın! ⚡' :
                'Pratik yap, daha hızlı ol! 💪'}
          </p>
          <div className="game-complete-buttons">
            <button className="replay-btn" onClick={() => { resetSpeedRound(); startSpeedRound(); }}>
              🔄 Tekrar Oyna
            </button>
            <button onClick={() => { addXP(speedScore, 'speed_complete'); resetSpeedRound(); setGameType('menu'); }}>
              Oyunlara Dön
            </button>
          </div>
        </motion.div>
      );
    }

    if (!speedActive) {
      return (
        <div className="speed-start">
          <div className="game-header">
            <button className="back-btn" onClick={() => requestExit('games')}>← Geri</button>
            <h3>⏱️ Hız Turu</h3>
          </div>

          <div className="speed-intro">
            <h2>60 Saniye Meydan Okuma!</h2>
            <p>Ne kadar hızlı doğru cevap verebilirsin?</p>
            <ul>
              <li>⏱️ 60 saniye süren var</li>
              <li>✨ Her doğru cevap 10 puan</li>
              <li>⚡ Ne kadar çok, o kadar iyi!</li>
            </ul>
            <motion.button
              className="start-speed-btn"
              onClick={startSpeedRound}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 Başla!
            </motion.button>
          </div>
        </div>
      );
    }

    return (
      <div className="speed-game">
        <div className="speed-header">
          <div className={`speed-timer ${speedTimeLeft <= 10 ? 'warning' : ''}`}>
            ⏱️ {speedTimeLeft}s
          </div>
          <div className="speed-score">⭐ {speedScore}</div>
        </div>

        {speedQuestion && (
          <motion.div
            className="speed-question"
            key={speedQuestion.word}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
          >
            <div className="speed-emoji">{speedQuestion.emoji}</div>
            <div className="speed-word">{speedQuestion.word}</div>

            <div className="speed-options">
              {speedOptions.map((option, index) => (
                <motion.button
                  key={index}
                  className="speed-option"
                  onClick={() => handleSpeedAnswer(option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // Render Listen & Pick Game
  const renderListenGame = () => {
    if (listenComplete) {
      return (
        <motion.div
          className="game-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2>🎧 Dinleme Tamamlandı! 🎧</h2>
          <p>Kulakların çok keskin!</p>
          <div className="final-score">Toplam Puan: ⭐ {listenScore}</div>
          <div className="game-complete-buttons">
            <button className="replay-btn" onClick={resetListenGame}>
              🔄 Tekrar Oyna
            </button>
            <button onClick={() => { addXP(listenScore, 'listen_complete'); resetListenGame(); setGameType('menu'); }}>
              Oyunlara Dön
            </button>
          </div>
        </motion.div>
      );
    }

    return (
      <div className="listen-game">
        <div className="game-header">
          <button className="back-btn" onClick={() => requestExit('games')}>← Geri</button>
          <h3>🎧 Dinle ve Seç</h3>
          <div className="game-score">⭐ {listenScore}</div>
        </div>

        <div className="listen-progress">
          {listenRound + 1} / 5
        </div>

        <div className="listen-content">
          <motion.button
            className="listen-play-btn"
            onClick={() => listenWord && speakWord(listenWord.word)}
            disabled={isLoadingAudio}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoadingAudio ? '⏳' : '🔊'}
            <span>Tekrar Dinle</span>
          </motion.button>

          <p className="listen-instruction">Duyduğun kelimeyi seç!</p>

          <div className="listen-options">
            {listenOptions.map(word => (
              <motion.button
                key={word.word}
                className={`listen-option ${listenFeedback !== null && word.word === listenWord?.word ? 'correct' : ''
                  } ${listenFeedback === 'wrong' && word.word !== listenWord?.word ? '' : ''}`}
                onClick={() => handleListenAnswer(word)}
                disabled={listenFeedback !== null}
                whileHover={listenFeedback === null ? { scale: 1.05 } : {}}
                whileTap={listenFeedback === null ? { scale: 0.95 } : {}}
              >
                <span className="listen-emoji">{word.emoji}</span>
                <span className="listen-text">{word.translation}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render Sentence Builder
  const renderSentenceGame = () => {
    if (sentenceComplete) {
      return (
        <motion.div
          className="game-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2>📝 Cümle Ustası! 📝</h2>
          <p>Tüm cümleleri doğru kurdun!</p>
          <div className="final-score">Toplam Puan: ⭐ {sentenceScore}</div>
          <div className="game-complete-buttons">
            <button className="replay-btn" onClick={resetSentenceGame}>
              🔄 Tekrar Oyna
            </button>
            <button onClick={() => { addXP(sentenceScore, 'sentence_complete'); resetSentenceGame(); setGameType('menu'); }}>
              Oyunlara Dön
            </button>
          </div>
        </motion.div>
      );
    }

    const template = sentenceTemplates[sentenceIndex % sentenceTemplates.length];

    return (
      <div className="sentence-game">
        <div className="game-header">
          <button className="back-btn" onClick={() => requestExit('games')}>← Geri</button>
          <h3>📝 Cümle Kur</h3>
          <div className="game-score">⭐ {sentenceScore}</div>
        </div>

        <div className="sentence-progress">
          {sentenceIndex + 1} / 5
        </div>

        <div className="sentence-content">
          <p className="sentence-instruction">Kelimeleri sıraya koy!</p>

          <div className={`sentence-build-area ${sentenceFeedback === 'correct' ? 'correct' : ''} ${sentenceFeedback === 'wrong' ? 'wrong' : ''}`}>
            {builtSentence.length === 0 ? (
              <span className="placeholder">Kelimelere tıkla...</span>
            ) : (
              builtSentence.map((word, index) => (
                <motion.span
                  key={word.id}
                  className="built-word"
                  onClick={() => removeSentenceWord(index)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {word.word}
                </motion.span>
              ))
            )}
          </div>

          <div className="sentence-words">
            {sentenceWords.map(word => (
              <motion.button
                key={word.id}
                className={`sentence-word ${word.placed ? 'placed' : ''}`}
                onClick={() => handleSentenceWordClick(word)}
                disabled={word.placed || sentenceFeedback !== null}
                whileHover={!word.placed ? { scale: 1.1 } : {}}
                whileTap={!word.placed ? { scale: 0.9 } : {}}
              >
                {word.word}
              </motion.button>
            ))}
          </div>

          <div className="sentence-actions">
            <button
              className="speak-btn"
              onClick={() => speakWord(template.correct)}
              disabled={isLoadingAudio}
            >
              {isLoadingAudio ? '⏳' : '🔊'} Dinle
            </button>
            <button
              className="check-btn"
              onClick={checkSentence}
              disabled={builtSentence.length !== template.words.length || sentenceFeedback !== null}
            >
              ✓ Kontrol Et
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Bubble Pop Game
  const renderBubbleGame = () => {
    if (bubbleComplete) {
      return (
        <motion.div
          className="game-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2>🫧 Balon Patlatma Bitti! 🫧</h2>
          <p>Süper eğlenceydi!</p>
          <div className="final-score">Toplam Puan: ⭐ {bubbleScore}</div>
          <div className="game-complete-buttons">
            <button className="replay-btn" onClick={() => { resetBubbleGame(); startBubbleGame(); }}>
              🔄 Tekrar Oyna
            </button>
            <button onClick={() => { addXP(bubbleScore, 'bubble_complete'); resetBubbleGame(); setGameType('menu'); }}>
              Oyunlara Dön
            </button>
          </div>
        </motion.div>
      );
    }

    if (!bubbleActive) {
      return (
        <div className="bubble-start">
          <div className="game-header">
            <button className="back-btn" onClick={() => requestExit('games')}>← Geri</button>
            <h3>🫧 Balon Patlatma</h3>
          </div>

          <div className="bubble-intro">
            <h2>Balonları Patlat!</h2>
            <p>Türkçe kelimeyi duy, doğru İngilizce balonu patlat!</p>
            <ul>
              <li>🫧 Balonlar yukarı çıkıyor</li>
              <li>🎯 Doğru balonu patlat</li>
              <li>⏱️ 45 saniye süren var</li>
            </ul>
            <motion.button
              className="start-bubble-btn"
              onClick={startBubbleGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎈 Başla!
            </motion.button>
          </div>
        </div>
      );
    }

    return (
      <div className="bubble-game">
        <div className="bubble-header">
          <div className={`bubble-timer ${bubbleTimeLeft <= 10 ? 'warning' : ''}`}>
            ⏱️ {bubbleTimeLeft}s
          </div>
          <div className="bubble-target">
            🎯 {targetWord?.translation}
          </div>
          <div className="bubble-score">⭐ {bubbleScore}</div>
        </div>

        <button
          className="bubble-listen-btn"
          onClick={() => targetWord && speakWord(targetWord.translation)}
          disabled={isLoadingAudio}
        >
          {isLoadingAudio ? '⏳' : '🔊'}
        </button>

        <div className="bubble-area">
          {bubbles.filter(b => !b.popped).map(bubble => (
            <motion.div
              key={bubble.id}
              className="bubble"
              style={{ left: `${bubble.x}%`, bottom: `${bubble.y}%` }}
              onClick={() => popBubble(bubble)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <span className="bubble-emoji">{bubble.word.emoji}</span>
              <span className="bubble-word">{bubble.word.word}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Render Games Menu
  const renderGames = () => {
    if (gameType === 'matching') return renderMatchingGame();
    if (gameType === 'spelling') return renderSpellingGame();
    if (gameType === 'memory') {
      if (memoryCards.length === 0) initializeMemoryGame();
      return renderMemoryGame();
    }
    if (gameType === 'speed') return renderSpeedRound();
    if (gameType === 'listen') {
      if (!listenWord) initializeListenGame();
      return renderListenGame();
    }
    if (gameType === 'sentence') return renderSentenceGame();
    if (gameType === 'bubble') return renderBubbleGame();

    const handleGameClick = (game: GameType, initFn: () => void) => {
      initFn();
      setGameType(game);
    };

    return (
      <div className="mimi-games">
        <div className="games-header">
          <button className="back-btn" onClick={() => requestExit('menu')}>← Geri</button>
          <h2>🎮 Hızlı Oyunlar</h2>
        </div>

        <div className="games-list">
          <motion.button
            className="game-card playable"
            onClick={() => handleGameClick('matching', resetMatchingGame)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="game-icon">🔤</span>
            <h3>Kelime Eşleştirme</h3>
            <p>İngilizce-Türkçe eşleştir!</p>
            <span className="free-badge">Ücretsiz</span>
          </motion.button>

          <motion.button
            className="game-card playable"
            onClick={() => handleGameClick('spelling', resetSpellingGame)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="game-icon">🅰️</span>
            <h3>Harf Dizme</h3>
            <p>Harfleri doğru sırala!</p>
            <span className="free-badge">Ücretsiz</span>
          </motion.button>

          <motion.button
            className="game-card playable"
            onClick={() => handleGameClick('memory', initializeMemoryGame)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="game-icon">🧠</span>
            <h3>Hafıza Oyunu</h3>
            <p>Kartları eşleştir!</p>
          </motion.button>

          <motion.button
            className="game-card playable"
            onClick={() => handleGameClick('speed', resetSpeedRound)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="game-icon">⏱️</span>
            <h3>Hız Turu</h3>
            <p>60 saniyede kaç kelime?</p>
          </motion.button>

          <motion.button
            className="game-card playable"
            onClick={() => handleGameClick('listen', resetListenGame)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="game-icon">🎧</span>
            <h3>Dinle ve Seç</h3>
            <p>Duyduğun kelimeyi bul!</p>
          </motion.button>

          <motion.button
            className="game-card playable"
            onClick={() => handleGameClick('sentence', resetSentenceGame)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="game-icon">📝</span>
            <h3>Cümle Kur</h3>
            <p>Kelimeleri sıraya koy!</p>
          </motion.button>

          <motion.button
            className="game-card playable"
            onClick={() => handleGameClick('bubble', resetBubbleGame)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="game-icon">🫧</span>
            <h3>Balon Patlatma</h3>
            <p>Doğru balonu patlat!</p>
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <div className="mimi-learning-overlay" onClick={(e) => e.target === e.currentTarget && requestExit('close')}>
      <motion.div
        className="mimi-learning-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <button className="close-btn learn-close-btn" onClick={() => requestExit('close')} title="Kapat">✖</button>

        <div className="mimi-learning-inner">
          <AnimatePresence mode="wait">
            {mode === 'menu' && renderMenu()}
            {mode === 'vocabulary' && renderVocabulary()}
            {mode === 'challenge' && renderChallenge()}
            {mode === 'games' && renderGames()}
            {mode === 'lesson' && renderLesson()}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showPremiumPrompt && renderPremiumPrompt()}
        </AnimatePresence>

        <AnimatePresence>
          {showExitConfirm && pendingExitAction && (
            <motion.div
              className="learn-exit-confirm-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowExitConfirm(false); setPendingExitAction(null); }}
            >
              <motion.div
                className="learn-exit-confirm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <p>Emin misin? İlerleme kaydedilmez.</p>
                <div className="learn-exit-confirm-btns">
                  <button className="learn-exit-cancel" onClick={() => { setShowExitConfirm(false); setPendingExitAction(null); }}>
                    Hayır
                  </button>
                  <button className="learn-exit-confirm-btn" onClick={() => pendingExitAction && executeExit(pendingExitAction)}>
                    Evet, çık
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MimiLearning;
