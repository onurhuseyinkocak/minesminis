import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DragonMascot from './DragonMascot';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';
import './MimiLearning.css';

type LearningMode = 'menu' | 'vocabulary' | 'challenge' | 'games';

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
  { word: 'Play', translation: 'Oynamak', emoji: '⚽', example: 'I play football with friends.' }
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
  { question: 'What animal says "meow"?', options: ['Dog', 'Bird', 'Cat', 'Cow'], correctAnswer: 2, emoji: '🐱' }
];

interface MimiLearningProps {
  onClose: () => void;
}

const MimiLearning: React.FC<MimiLearningProps> = ({ onClose }) => {
  const [mode, setMode] = useState<LearningMode>('menu');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [vocabStep, setVocabStep] = useState<'learn' | 'quiz'>('learn');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [challengeIndex, setChallengIndex] = useState(0);
  const [challengeScore, setChallengeScore] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [dragonState, setDragonState] = useState<'idle' | 'celebrating' | 'thinking' | 'waving'>('waving');
  const { user } = useAuth();

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

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.pitch = 1.2;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
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
        setChallengIndex(prev => prev + 1);
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
              <button className="speak-btn" onClick={() => speakWord(currentWord.word)}>
                🔊 Dinle
              </button>
              <button className="speak-btn" onClick={() => speakWord(currentWord.example)}>
                🔊 Cümleyi Dinle
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

  const renderGames = () => (
    <div className="mimi-games">
      <div className="games-header">
        <button className="back-btn" onClick={() => setMode('menu')}>← Geri</button>
        <h2>🎮 Hızlı Oyunlar</h2>
      </div>
      
      <div className="games-dragon">
        <DragonMascot state="idle" />
      </div>
      
      <div className="games-list">
        <motion.div 
          className="game-card"
          whileHover={{ scale: 1.03 }}
        >
          <span className="game-icon">🔤</span>
          <h3>Kelime Eşleştirme</h3>
          <p>Resimleri kelimelerle eşleştir!</p>
          <span className="coming-soon">Yakında!</span>
        </motion.div>
        
        <motion.div 
          className="game-card"
          whileHover={{ scale: 1.03 }}
        >
          <span className="game-icon">🅰️</span>
          <h3>Harf Dizme</h3>
          <p>Harfleri sıraya koy, kelimeyi bul!</p>
          <span className="coming-soon">Yakında!</span>
        </motion.div>
        
        <motion.div 
          className="game-card"
          whileHover={{ scale: 1.03 }}
        >
          <span className="game-icon">🧠</span>
          <h3>Hafıza Oyunu</h3>
          <p>Kartları eşleştir, hafızanı güçlendir!</p>
          <span className="coming-soon">Yakında!</span>
        </motion.div>
        
        <motion.div 
          className="game-card"
          whileHover={{ scale: 1.03 }}
        >
          <span className="game-icon">⏱️</span>
          <h3>Hız Turu</h3>
          <p>60 saniyede kaç kelime bilebilirsin?</p>
          <span className="coming-soon">Yakında!</span>
        </motion.div>
      </div>
    </div>
  );

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
