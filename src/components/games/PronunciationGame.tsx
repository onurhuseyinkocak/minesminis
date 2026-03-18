import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Sparkles } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../ui';
import { SFX } from '../../data/soundLibrary';
import './PronunciationGame.css';

interface WordItem {
  english: string;
  turkish: string;
  emoji: string;
}

interface GameProps {
  words: WordItem[];
  onComplete: (score: number, totalPossible: number) => void;
  onXpEarned?: (xp: number) => void;
  onWrongAnswer?: () => void;
}

const WORDS_PER_ROUND = 5;

function getSpeechRecognitionConstructor(): (new () => SpeechRecognition) | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export const PronunciationGame: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer }) => {
  const roundWords = words.slice(0, WORDS_PER_ROUND);
  const total = roundWords.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [heardText, setHeardText] = useState('');
  const [completed, setCompleted] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const currentWord = roundWords[currentIndex];
  const SRConstructor = getSpeechRecognitionConstructor();
  const isSupported = SRConstructor !== null;

  const speakWord = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }, []);

  const goToNext = useCallback(() => {
    if (currentIndex + 1 >= total) {
      setCompleted(true);
      onComplete(score, total);
    } else {
      setCurrentIndex((i) => i + 1);
      setFeedback(null);
      setHeardText('');
    }
  }, [currentIndex, total, score, onComplete]);

  const handleResult = useCallback((spoken: string) => {
    if (!currentWord) return;

    const target = currentWord.english.trim().toLowerCase();
    const heard = spoken.trim().toLowerCase();

    if (heard === target) {
      setFeedback('correct');
      setHeardText(spoken);
      SFX.correct();
      const newScore = score + 1;
      setScore(newScore);
      onXpEarned?.(15);

      setTimeout(() => {
        if (currentIndex + 1 >= total) {
          setCompleted(true);
          onComplete(newScore, total);
        } else {
          setCurrentIndex((i) => i + 1);
          setFeedback(null);
          setHeardText('');
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      setHeardText(spoken);
      SFX.wrong();
      onWrongAnswer?.();
    }
  }, [currentWord, score, currentIndex, total, onComplete, onXpEarned, onWrongAnswer]);

  const startListening = useCallback(() => {
    if (!SRConstructor || isListening) return;

    // Stop any previous instance
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
    }

    const recognition = new SRConstructor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setFeedback(null);
      setHeardText('');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0];
      if (result && result[0]) {
        handleResult(result[0].transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [SRConstructor, isListening, handleResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
    setIsListening(false);
  }, []);

  // Unsupported browser
  if (!isSupported) {
    return (
      <div className="pronunciation-game">
        <div className="pronunciation-game__unsupported">
          <h2>Speech Recognition Unavailable</h2>
          <p>Your browser doesn't support speech recognition. Try Chrome!</p>
        </div>
      </div>
    );
  }

  // Completed
  if (completed) {
    return (
      <div className="pronunciation-game">
        <Card variant="elevated" padding="xl" className="pronunciation-game__results">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="pronunciation-game__results-content"
          >
            <span className="pronunciation-game__results-emoji" role="img" aria-label="celebration">
              {score >= total * 0.8 ? '\uD83C\uDF89' : score >= total * 0.5 ? '\uD83D\uDCAA' : '\uD83D\uDE0A'}
            </span>
            <h2 className="pronunciation-game__results-title">
              {score >= total * 0.8 ? 'Amazing Pronunciation!' : score >= total * 0.5 ? 'Good Effort!' : 'Keep Practicing!'}
            </h2>
            <p className="pronunciation-game__results-score">
              You pronounced {score} out of {total} words correctly!
            </p>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 15} XP
            </Badge>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!currentWord) return null;

  const progress = (currentIndex / total) * 100;
  const cardClass = [
    'pronunciation-game__card',
    feedback === 'correct' && 'pronunciation-game__card--correct',
    feedback === 'wrong' && 'pronunciation-game__card--wrong',
  ].filter(Boolean).join(' ');

  return (
    <div className="pronunciation-game" role="application" aria-label="Pronunciation practice game">
      <div className="pronunciation-game__header">
        <h2 className="pronunciation-game__title">Say the Word!</h2>
        <Badge variant="info">Word {currentIndex + 1}/{total}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      <p className="pronunciation-game__counter">
        Score: {score}/{total}
      </p>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cardClass}
      >
        <span className="pronunciation-game__emoji">{currentWord.emoji}</span>
        <div className="pronunciation-game__word">{currentWord.english}</div>
        <div className="pronunciation-game__turkish">{currentWord.turkish}</div>

        <div className="pronunciation-game__buttons">
          <button
            className="pronunciation-game__btn pronunciation-game__btn--listen"
            onClick={() => speakWord(currentWord.english)}
            disabled={isListening}
            aria-label="Listen to pronunciation"
          >
            <Volume2 size={20} /> Listen
          </button>

          {feedback !== 'correct' && (
            <button
              className={`pronunciation-game__btn pronunciation-game__btn--speak ${isListening ? 'listening' : ''}`}
              onClick={isListening ? stopListening : startListening}
              aria-label={isListening ? 'Stop listening' : 'Start speaking'}
            >
              <Mic size={20} /> {isListening ? 'Listening...' : 'Speak'}
            </button>
          )}
        </div>

        {feedback === 'correct' && (
          <motion.div
            className="pronunciation-game__feedback pronunciation-game__feedback--correct"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Perfect! Well done!
          </motion.div>
        )}

        {feedback === 'wrong' && (
          <motion.div
            className="pronunciation-game__feedback pronunciation-game__feedback--wrong"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>Not quite right. Try again!</div>
            {heardText && (
              <div className="pronunciation-game__heard">
                You said: "<strong>{heardText}</strong>" — Expected: "<strong>{currentWord.english}</strong>"
              </div>
            )}
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                className="pronunciation-game__btn pronunciation-game__btn--try-again"
                onClick={startListening}
              >
                <Mic size={18} /> Try Again
              </button>
              <button
                className="pronunciation-game__btn pronunciation-game__btn--listen"
                onClick={goToNext}
                style={{ background: 'var(--text-secondary, #64748b)' }}
              >
                Skip
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

PronunciationGame.displayName = 'PronunciationGame';
