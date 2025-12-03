import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DragonMascot from './DragonMascot';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';
import './MimiLearning.css';

type LearningMode = 'menu' | 'vocabulary' | 'challenge' | 'games';
type GameType = 'menu' | 'matching' | 'spelling' | 'memory' | 'speed';

interface VocabularyWord {
  word: string;
  translation: string;
  emoji: string;
  example: string;
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

const vocabularyWords: VocabularyWord[] = [
  { word: 'Apple', translation: 'Elma', emoji: '🍎', example: 'I eat an apple every day.' },
  { word: 'Dog', translation: 'Köpek', emoji: '🐕', example: 'The dog is my best friend.' },
  { word: 'Cat', translation: 'Kedi', emoji: '🐱', example: 'The cat sleeps on the sofa.' },
  { word: 'House', translation: 'Ev', emoji: '🏠', example: 'I live in a big house.' },
  { word: 'Book', translation: 'Kitap', emoji: '📚', example: 'I read a book every night.' },
  { word: 'Sun', translation: 'Güneş', emoji: '☀️', example: 'The sun is bright today.' },
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

const MimiLearning: React.FC<MimiLearningProps> = ({ onClose }) => {
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
  const [dragonState, setDragonState] = useState<'idle' | 'celebrating' | 'thinking' | 'waving'>('waving');
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const { user } = useAuth();
  
  const audioCache = useRef<Map<string, string>>(new Map());
  const currentAudio = useRef<HTMLAudioElement | null>(null);

  const shuffledWords = [...vocabularyWords].sort(() => Math.random() - 0.5).slice(0, 5);
  const [vocabWords] = useState(shuffledWords);
  
  const todaysChallenges = [...dailyChallengeQuestions].sort(() => Math.random() - 0.5).slice(0, 3);
  const [challenges] = useState(todaysChallenges);
  
  const [vocabQuizOptions] = useState<string[][]>(() => {
    return shuffledWords.map(word => {
      const otherWords = vocabularyWords.filter(w => w.word !== word.word);
      const shuffled = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...shuffled.map(w => w.translation), word.translation];
      return options.sort(() => Math.random() - 0.5);
    });
  });

  // Matching Game State
  const [matchingWords] = useState(() => 
    [...vocabularyWords].sort(() => Math.random() - 0.5).slice(0, 6)
  );
  const [matchingLeft] = useState<VocabularyWord[]>(() => 
    [...matchingWords].sort(() => Math.random() - 0.5)
  );
  const [matchingRight] = useState<VocabularyWord[]>(() => 
    [...matchingWords].sort(() => Math.random() - 0.5)
  );
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [matchingScore, setMatchingScore] = useState(0);

  // Spelling Game State
  const [spellingWords] = useState(() => 
    [...vocabularyWords].filter(w => w.word.length <= 7).sort(() => Math.random() - 0.5).slice(0, 5)
  );
  const [spellingIndex, setSpellingIndex] = useState(0);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingScore, setSpellingScore] = useState(0);
  const [spellingHint, setSpellingHint] = useState('');
  const [spellingFeedback, setSpellingFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [spellingComplete, setSpellingComplete] = useState(false);

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

  // OpenAI TTS with caching and fallback
  const speakWord = async (text: string) => {
    if (isLoadingAudio) return;
    
    // Stop any currently playing audio
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current = null;
    }

    // Check cache first
    if (audioCache.current.has(text)) {
      const cachedAudio = audioCache.current.get(text)!;
      const audio = new Audio(cachedAudio);
      currentAudio.current = audio;
      audio.play().catch(console.error);
      return;
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
      
      // Cache the audio
      audioCache.current.set(text, audioUrl);
      
      const audio = new Audio(audioUrl);
      currentAudio.current = audio;
      audio.play().catch(console.error);
      
    } catch (error) {
      console.error('TTS error, falling back to Web Speech:', error);
      // Fallback to Web Speech API
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = 1.2;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setIsLoadingAudio(false);
    }
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

  // Generate Speed Question
  const generateSpeedQuestion = useCallback(() => {
    const word = vocabularyWords[Math.floor(Math.random() * vocabularyWords.length)];
    const otherWords = vocabularyWords.filter(w => w.word !== word.word);
    const shuffled = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...shuffled.map(w => w.translation), word.translation].sort(() => Math.random() - 0.5);
    
    setSpeedQuestion(word);
    setSpeedOptions(options);
  }, []);

  // Start Speed Round
  const startSpeedRound = useCallback(() => {
    setSpeedTimeLeft(60);
    setSpeedScore(0);
    setSpeedActive(true);
    setSpeedComplete(false);
    generateSpeedQuestion();
  }, [generateSpeedQuestion]);

  // Speed Round Timer
  useEffect(() => {
    if (speedActive && speedTimeLeft > 0) {
      speedTimerRef.current = setTimeout(() => {
        setSpeedTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (speedActive && speedTimeLeft === 0) {
      setSpeedActive(false);
      setSpeedComplete(true);
      setDragonState('celebrating');
      if (user) {
        userService.awardPoints(user.id, speedScore);
      }
    }
    
    return () => {
      if (speedTimerRef.current) {
        clearTimeout(speedTimerRef.current);
      }
    };
  }, [speedActive, speedTimeLeft, speedScore, user]);

  // Handle Speed Answer
  const handleSpeedAnswer = (answer: string) => {
    if (!speedQuestion || !speedActive) return;
    
    if (answer === speedQuestion.translation) {
      setSpeedScore(prev => prev + 10);
      setDragonState('celebrating');
      setTimeout(() => setDragonState('idle'), 300);
    }
    generateSpeedQuestion();
  };

  // Handle Memory Card Click
  const handleMemoryCardClick = (cardId: number) => {
    if (isFlipping) return;
    
    const card = memoryCards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    
    // Update card state
    setMemoryCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    
    if (newFlipped.length === 2) {
      setIsFlipping(true);
      setMemoryMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlipped;
      const firstCard = memoryCards.find(c => c.id === firstId)!;
      const secondCard = memoryCards.find(c => c.id === secondId)!;
      
      if (firstCard.pairId === secondCard.pairId) {
        // Match!
        setMemoryScore(prev => prev + 20);
        setDragonState('celebrating');
        
        setTimeout(() => {
          setMemoryCards(prev => prev.map(c => 
            c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c
          ));
          setFlippedCards([]);
          setIsFlipping(false);
          setDragonState('idle');
          
          // Check if all matched
          const allMatched = memoryCards.filter(c => !c.isMatched).length === 2;
          if (allMatched) {
            setMemoryComplete(true);
            if (user) {
              userService.awardPoints(user.id, memoryScore + 20);
            }
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setMemoryCards(prev => prev.map(c => 
            newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
          setIsFlipping(false);
        }, 1000);
      }
    }
  };

  // Handle Matching Selection
  const handleMatchingSelect = (word: VocabularyWord, side: 'left' | 'right') => {
    if (matchedPairs.has(word.word)) return;
    
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
    if (left === right) {
      setMatchedPairs(prev => new Set([...prev, left]));
      setMatchingScore(prev => prev + 15);
      setDragonState('celebrating');
      toast.success('Eşleşti! +15 puan! 🎉');
      
      setTimeout(() => setDragonState('idle'), 1000);
      
      if (matchedPairs.size + 1 === matchingWords.length) {
        if (user) {
          userService.awardPoints(user.id, matchingScore + 15);
        }
      }
    } else {
      setDragonState('thinking');
      toast.error('Tekrar dene! 💪');
      setTimeout(() => setDragonState('idle'), 500);
    }
    
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  // Handle Spelling Check
  const handleSpellingCheck = () => {
    const currentWord = spellingWords[spellingIndex];
    const isCorrectSpelling = spellingInput.toLowerCase().trim() === currentWord.word.toLowerCase();
    
    setSpellingFeedback(isCorrectSpelling ? 'correct' : 'wrong');
    
    if (isCorrectSpelling) {
      setSpellingScore(prev => prev + 20);
      setDragonState('celebrating');
      toast.success('Doğru yazım! +20 puan! ✨');
    } else {
      setDragonState('thinking');
      toast.error(`Doğru yazım: ${currentWord.word}`);
    }
    
    setTimeout(() => {
      setDragonState('idle');
      setSpellingFeedback(null);
      setSpellingInput('');
      setSpellingHint('');
      
      if (spellingIndex < spellingWords.length - 1) {
        setSpellingIndex(prev => prev + 1);
      } else {
        setSpellingComplete(true);
        if (user) {
          userService.awardPoints(user.id, spellingScore + (isCorrectSpelling ? 20 : 0));
        }
      }
    }, 1500);
  };

  const showSpellingHint = () => {
    const word = spellingWords[spellingIndex].word;
    const hintLength = Math.ceil(word.length / 2);
    setSpellingHint(word.substring(0, hintLength) + '_'.repeat(word.length - hintLength));
  };

  const handleVocabQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const currentWord = vocabWords[currentWordIndex];
    const options = vocabQuizOptions[currentWordIndex];
    const correct = options[answerIndex] === currentWord.translation;
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 10);
      setDragonState('celebrating');
      toast.success('Harika! +10 puan! 🌟');
    } else {
      setDragonState('thinking');
      toast.error('Tekrar dene! 💪');
    }
    
    setTimeout(() => {
      setDragonState('idle');
      if (currentWordIndex < vocabWords.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setVocabStep('learn');
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowCelebration(true);
        if (user) {
          userService.awardPoints(user.id, score + (correct ? 10 : 0));
        }
      }
    }, 1500);
  };

  const handleChallengeAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = challenges[challengeIndex];
    const correct = answerIndex === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct) {
      setChallengeScore(prev => prev + 20);
      setDragonState('celebrating');
      toast.success('Doğru! +20 puan! ⭐');
    } else {
      setDragonState('thinking');
    }
    
    setTimeout(() => {
      setDragonState('idle');
      if (challengeIndex < challenges.length - 1) {
        setChallengeIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setChallengeComplete(true);
        if (user) {
          userService.awardPoints(user.id, challengeScore + (correct ? 20 : 0));
        }
      }
    }, 1500);
  };

  const renderMenu = () => (
    <div className="mimi-menu">
      <div className="menu-dragon">
        <DragonMascot state={dragonState} />
      </div>
      <h2>Mimi ile Öğren! 🐲</h2>
      <p>Bugün ne öğrenmek istersin?</p>
      
      <div className="menu-options">
        <motion.button
          className="menu-option vocabulary"
          onClick={() => setMode('vocabulary')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="option-emoji">📚</span>
          <span className="option-title">Kelime Öğren</span>
          <span className="option-desc">Yeni kelimeler öğren!</span>
        </motion.button>
        
        <motion.button
          className="menu-option challenge"
          onClick={() => setMode('challenge')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="option-emoji">🎯</span>
          <span className="option-title">Günlük Meydan Okuma</span>
          <span className="option-desc">3 soru, çok puan!</span>
        </motion.button>
        
        <motion.button
          className="menu-option games"
          onClick={() => setMode('games')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="option-emoji">🎮</span>
          <span className="option-title">Hızlı Oyunlar</span>
          <span className="option-desc">Eğlenerek öğren!</span>
        </motion.button>
      </div>
    </div>
  );

  const renderVocabulary = () => {
    const currentWord = vocabWords[currentWordIndex];
    const options = vocabQuizOptions[currentWordIndex];
    
    return (
      <div className="mimi-vocabulary">
        <div className="vocab-header">
          <button className="back-btn" onClick={() => setMode('menu')}>← Geri</button>
          <div className="vocab-progress">
            {currentWordIndex + 1} / {vocabWords.length}
          </div>
          <div className="vocab-score">⭐ {score}</div>
        </div>
        
        <div className="vocab-dragon">
          <DragonMascot state={dragonState} />
        </div>
        
        {vocabStep === 'learn' ? (
          <motion.div 
            className="vocab-learn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="word-emoji">{currentWord.emoji}</div>
            <div className="word-english">{currentWord.word}</div>
            <div className="word-turkish">{currentWord.translation}</div>
            <div className="word-example">"{currentWord.example}"</div>
            
            <div className="learn-actions">
              <button 
                className={`speak-btn ${isLoadingAudio ? 'loading' : ''}`} 
                onClick={() => speakWord(currentWord.word)}
                disabled={isLoadingAudio}
              >
                {isLoadingAudio ? '⏳' : '🔊'} Dinle
              </button>
              <button 
                className={`speak-btn ${isLoadingAudio ? 'loading' : ''}`} 
                onClick={() => speakWord(currentWord.example)}
                disabled={isLoadingAudio}
              >
                {isLoadingAudio ? '⏳' : '🔊'} Cümleyi Dinle
              </button>
            </div>
            
            <button 
              className="next-btn"
              onClick={() => setVocabStep('quiz')}
            >
              Hazırım! Quiz Zamanı! 🎯
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className="vocab-quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="quiz-question">
              <span className="question-emoji">{currentWord.emoji}</span>
              <span>"{currentWord.word}" Türkçe'de ne demek?</span>
            </div>
            
            <div className="quiz-options">
              {options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`quiz-option ${
                    selectedAnswer === index 
                      ? isCorrect 
                        ? 'correct' 
                        : 'wrong'
                      : ''
                  } ${selectedAnswer !== null && option === currentWord.translation ? 'show-correct' : ''}`}
                  onClick={() => handleVocabQuizAnswer(index)}
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
        
        {showCelebration && (
          <motion.div 
            className="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="celebration-content">
              <DragonMascot state="celebrating" />
              <h2>🎉 Tebrikler! 🎉</h2>
              <p>Tüm kelimeleri tamamladın!</p>
              <div className="final-score">Toplam Puan: ⭐ {score}</div>
              <button onClick={() => setMode('menu')}>Ana Menüye Dön</button>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const renderChallenge = () => {
    const currentQuestion = challenges[challengeIndex];
    
    if (challengeComplete) {
      return (
        <motion.div 
          className="challenge-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="complete-dragon">
            <DragonMascot state="celebrating" />
          </div>
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
          <button className="menu-btn" onClick={() => setMode('menu')}>
            Ana Menüye Dön
          </button>
        </motion.div>
      );
    }
    
    return (
      <div className="mimi-challenge">
        <div className="challenge-header">
          <button className="back-btn" onClick={() => setMode('menu')}>← Geri</button>
          <div className="challenge-progress">
            Soru {challengeIndex + 1} / {challenges.length}
          </div>
          <div className="challenge-score">⭐ {challengeScore}</div>
        </div>
        
        <div className="challenge-dragon">
          <DragonMascot state={dragonState} />
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
                className={`challenge-option ${
                  selectedAnswer === index 
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

  const renderMatchingGame = () => {
    const isComplete = matchedPairs.size === matchingWords.length;
    
    if (isComplete) {
      return (
        <motion.div 
          className="game-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <DragonMascot state="celebrating" />
          <h2>🎉 Tebrikler! 🎉</h2>
          <p>Tüm eşleştirmeleri tamamladın!</p>
          <div className="final-score">Toplam Puan: ⭐ {matchingScore}</div>
          <button onClick={() => setGameType('menu')}>Oyunlara Dön</button>
        </motion.div>
      );
    }
    
    return (
      <div className="matching-game">
        <div className="game-header">
          <button className="back-btn" onClick={() => setGameType('menu')}>← Geri</button>
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

  const renderSpellingGame = () => {
    if (spellingComplete) {
      return (
        <motion.div 
          className="game-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <DragonMascot state="celebrating" />
          <h2>🎉 Harika İş! 🎉</h2>
          <p>Yazım pratiğini tamamladın!</p>
          <div className="final-score">Toplam Puan: ⭐ {spellingScore}</div>
          <button onClick={() => setGameType('menu')}>Oyunlara Dön</button>
        </motion.div>
      );
    }
    
    const currentWord = spellingWords[spellingIndex];
    
    return (
      <div className="spelling-game">
        <div className="game-header">
          <button className="back-btn" onClick={() => setGameType('menu')}>← Geri</button>
          <h3>🅰️ Harf Dizme</h3>
          <div className="game-score">⭐ {spellingScore}</div>
        </div>
        
        <div className="spelling-progress">
          {spellingIndex + 1} / {spellingWords.length}
        </div>
        
        <div className="spelling-dragon">
          <DragonMascot state={dragonState} />
        </div>
        
        <motion.div 
          className="spelling-card"
          key={spellingIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="spelling-emoji">{currentWord.emoji}</div>
          <div className="spelling-turkish">
            <strong>Türkçe:</strong> {currentWord.translation}
          </div>
          
          {spellingHint && (
            <div className="spelling-hint">
              💡 İpucu: {spellingHint}
            </div>
          )}
          
          <input
            type="text"
            className={`spelling-input ${spellingFeedback === 'correct' ? 'correct' : ''} ${spellingFeedback === 'wrong' ? 'wrong' : ''}`}
            placeholder="İngilizce yaz..."
            value={spellingInput}
            onChange={(e) => setSpellingInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSpellingCheck()}
            disabled={spellingFeedback !== null}
          />
          
          <div className="spelling-actions">
            <button className="hint-btn" onClick={showSpellingHint} disabled={spellingHint !== ''}>
              💡 İpucu
            </button>
            <button 
              className="speak-btn" 
              onClick={() => speakWord(currentWord.word)}
              disabled={isLoadingAudio}
            >
              🔊 Dinle
            </button>
            <button 
              className="check-btn" 
              onClick={handleSpellingCheck}
              disabled={!spellingInput.trim() || spellingFeedback !== null}
            >
              ✓ Kontrol
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderMemoryGame = () => {
    if (memoryComplete) {
      return (
        <motion.div 
          className="game-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <DragonMascot state="celebrating" />
          <h2>🎉 Hafıza Şampiyonu! 🎉</h2>
          <p>Tüm kartları eşleştirdin!</p>
          <div className="memory-stats">
            <div>Puan: ⭐ {memoryScore}</div>
            <div>Hamle: {memoryMoves}</div>
          </div>
          <button onClick={() => setGameType('menu')}>Oyunlara Dön</button>
        </motion.div>
      );
    }
    
    return (
      <div className="memory-game">
        <div className="game-header">
          <button className="back-btn" onClick={() => setGameType('menu')}>← Geri</button>
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

  const renderSpeedRound = () => {
    if (speedComplete) {
      return (
        <motion.div 
          className="game-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <DragonMascot state="celebrating" />
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
          <button onClick={() => { setSpeedComplete(false); setGameType('menu'); }}>
            Oyunlara Dön
          </button>
        </motion.div>
      );
    }
    
    if (!speedActive) {
      return (
        <div className="speed-start">
          <div className="game-header">
            <button className="back-btn" onClick={() => setGameType('menu')}>← Geri</button>
            <h3>⏱️ Hız Turu</h3>
          </div>
          
          <div className="speed-intro">
            <DragonMascot state="waving" />
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

  const renderGames = () => {
    if (gameType === 'matching') return renderMatchingGame();
    if (gameType === 'spelling') return renderSpellingGame();
    if (gameType === 'memory') {
      if (memoryCards.length === 0) initializeMemoryGame();
      return renderMemoryGame();
    }
    if (gameType === 'speed') return renderSpeedRound();
    
    return (
      <div className="mimi-games">
        <div className="games-header">
          <button className="back-btn" onClick={() => setMode('menu')}>← Geri</button>
          <h2>🎮 Hızlı Oyunlar</h2>
        </div>
        
        <div className="games-dragon">
          <DragonMascot state="idle" />
        </div>
        
        <div className="games-list">
          <motion.button
            className="game-card playable"
            onClick={() => setGameType('matching')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="game-icon">🔤</span>
            <h3>Kelime Eşleştirme</h3>
            <p>İngilizce-Türkçe eşleştir!</p>
          </motion.button>
          
          <motion.button
            className="game-card playable"
            onClick={() => setGameType('spelling')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="game-icon">🅰️</span>
            <h3>Harf Dizme</h3>
            <p>Kelimeleri doğru yaz!</p>
          </motion.button>
          
          <motion.button
            className="game-card playable"
            onClick={() => { initializeMemoryGame(); setGameType('memory'); }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="game-icon">🧠</span>
            <h3>Hafıza Oyunu</h3>
            <p>Kartları eşleştir!</p>
          </motion.button>
          
          <motion.button
            className="game-card playable"
            onClick={() => setGameType('speed')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="game-icon">⏱️</span>
            <h3>Hız Turu</h3>
            <p>60 saniyede kaç kelime?</p>
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <div className="mimi-learning-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div 
        className="mimi-learning-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <button className="close-btn" onClick={onClose}>✖</button>
        
        <AnimatePresence mode="wait">
          {mode === 'menu' && renderMenu()}
          {mode === 'vocabulary' && renderVocabulary()}
          {mode === 'challenge' && renderChallenge()}
          {mode === 'games' && renderGames()}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MimiLearning;
