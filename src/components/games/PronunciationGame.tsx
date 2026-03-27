import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Sparkles, Trophy, Star, Check, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, Badge, ProgressBar, ConfettiRain } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { speak } from '../../services/ttsService';
import { useLanguage } from '../../contexts/LanguageContext';
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
  const { t } = useLanguage();
  const roundWords = words.slice(0, WORDS_PER_ROUND);
  const total = roundWords.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [heardText, setHeardText] = useState('');
  const [completed, setCompleted] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentWord = roundWords[currentIndex];
  const SRConstructor = getSpeechRecognitionConstructor();
  const isSupported = SRConstructor !== null;

  const speakWord = useCallback((text: string) => {
    setIsPlaying(true);
    try {
      speak(text);
    } catch {
      /* TTS not available */
    }
    // Approximate TTS duration
    setTimeout(() => setIsPlaying(false), 1200);
  }, []);

  if (words.length < 1) { return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>{t('games.noWordsToReview') || 'No words to review.'}</div>; }

  const goToNext = useCallback(() => {
    if (currentIndex + 1 >= total) {
      setCompleted(true);
      autoCompleteTimeoutRef.current = setTimeout(() => onComplete(score, total), 4000);
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

    if (heard === target || heard.includes(target)) {
      setFeedback('correct');
      setHeardText(spoken);
      SFX.correct();
      const newScore = score + 1;
      setScore(newScore);
      onXpEarned?.(15);

      setTimeout(() => {
        if (currentIndex + 1 >= total) {
          setCompleted(true);
          autoCompleteTimeoutRef.current = setTimeout(() => onComplete(newScore, total), 4000);
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

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      const msg =
        event.error === 'no-speech' ? (t('games.noSpeechDetected') || 'No speech detected. Please try again.') :
        event.error === 'not-allowed' ? (t('games.micPermissionDenied') || 'Microphone permission denied. Check your browser settings.') :
        event.error === 'network' ? (t('games.networkError') || 'Network error. Check your internet connection.') :
        (t('games.errorOccurred') || 'An error occurred. Please try again.');
      setHeardText(msg);
      setFeedback('wrong');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [SRConstructor, isListening, handleResult, t]);

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
          <h2>{t('games.speechUnavailable')}</h2>
          <p>{t('games.speechUnavailableMsg')}</p>
        </div>
      </div>
    );
  }

  const handlePlayAgain = () => {
    if (autoCompleteTimeoutRef.current) {
      clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = null;
    }
    setCurrentIndex(0);
    setScore(0);
    setIsListening(false);
    setFeedback(null);
    setHeardText('');
    setCompleted(false);
  };

  // Completed
  if (completed) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
    const isPerfect = pct >= 90;
    return (
      <div className="pronunciation-game" style={{ position: 'relative' }}>
        {isPerfect && <ConfettiRain duration={3000} />}
        <Card variant="elevated" padding="xl" className="pronunciation-game__results">
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="pronunciation-game__results-content"
          >
            <motion.span
              className="pronunciation-game__results-emoji"
              role="img"
              aria-label="celebration"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.3 }}
            >
              {pct >= 90 ? <Trophy size={48} color="#E8A317" /> : pct >= 60 ? <Star size={48} fill="#E8A317" color="#E8A317" /> : <Check size={48} color="#22C55E" />}
            </motion.span>
            <h2 className="pronunciation-game__results-title">
              {pct >= 90 ? t('games.amazingPronunciation') : pct >= 60 ? t('games.goodEffort') : t('games.keepPracticing')}
            </h2>
            <p className="pronunciation-game__results-score">
              {t('games.youPronounced').replace('{score}', String(score)).replace('{total}', String(total))}
            </p>
            <span className="game-stars">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.55 + i * 0.12 }}
                >
                  <Star size={32} fill={i < stars ? '#E8A317' : 'none'} color={i < stars ? '#E8A317' : '#ccc'} />
                </motion.span>
              ))}
            </span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.9 }}
            >
              <Badge variant="success" icon={<Sparkles size={14} />}>
                +{score * 15} XP
              </Badge>
            </motion.div>
            <div className="pronunciation-game__results-actions">
              <button
                type="button"
                className="pronunciation-game__results-btn pronunciation-game__results-btn--secondary"
                onClick={() => {
                  if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
                  onComplete(score, total);
                }}
              >
                <ArrowRight size={16} /> {t('games.backToGames') || 'Back'}
              </button>
              <button
                type="button"
                className="pronunciation-game__results-btn pronunciation-game__results-btn--primary"
                onClick={handlePlayAgain}
              >
                <RotateCcw size={16} /> {t('games.playAgain') || 'Play Again'}
              </button>
            </div>
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
        <h2 className="pronunciation-game__title">{t('games.sayTheWord')}</h2>
        <Badge variant="info">{t('games.word')} {currentIndex + 1}/{total}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      <p className="pronunciation-game__counter">
        {t('games.score')}: {score}/{total}
      </p>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={cardClass}
      >
        <div className={`pronunciation-game__emoji${currentWord.emoji ? '' : ' pronunciation-game__emoji--fallback'}`}>{currentWord.emoji || currentWord.english.charAt(0).toUpperCase()}</div>
        <div className="pronunciation-game__word">{currentWord.english}</div>
        <div className="pronunciation-game__turkish">{currentWord.turkish}</div>

        <div className="pronunciation-game__buttons">
          <button
            type="button"
            className={`pronunciation-game__btn pronunciation-game__btn--listen ${isPlaying ? 'playing' : ''}`}
            onClick={() => speakWord(currentWord.english)}
            disabled={isListening}
            aria-label="Listen to pronunciation"
          >
            <Volume2 size={20} /> {t('games.listen')}
          </button>

          {feedback !== 'correct' && (
            <button
              type="button"
              className={`pronunciation-game__btn pronunciation-game__btn--speak ${isListening ? 'listening' : ''}`}
              onClick={isListening ? stopListening : startListening}
              aria-label={isListening ? 'Stop listening' : 'Start speaking'}
            >
              <Mic size={20} /> {isListening ? t('games.listening') : t('games.speak')}
            </button>
          )}
        </div>

        {feedback === 'correct' && (
          <motion.div
            className="pronunciation-game__feedback pronunciation-game__feedback--correct"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <CheckCircle2 size={20} /> {t('games.perfectWellDone')}
          </motion.div>
        )}

        {feedback === 'wrong' && (
          <motion.div
            className="pronunciation-game__feedback pronunciation-game__feedback--wrong"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>{t('games.notQuiteRight')}</div>
            {heardText && (
              <div className="pronunciation-game__heard">
                {t('games.youSaid')} &quot;<strong>{heardText}</strong>&quot; — {t('games.expected')} &quot;<strong>{currentWord.english}</strong>&quot;
              </div>
            )}
            <div className="pronunciation-game__feedback-actions">
              <button
                type="button"
                className="pronunciation-game__btn pronunciation-game__btn--try-again"
                onClick={startListening}
              >
                <Mic size={18} /> {t('games.tryAgain')}
              </button>
              <button
                type="button"
                className="pronunciation-game__btn pronunciation-game__btn--skip"
                onClick={goToNext}
              >
                {t('games.skip')}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

PronunciationGame.displayName = 'PronunciationGame';
