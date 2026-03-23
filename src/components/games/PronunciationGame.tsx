import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Sparkles } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../ui';
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
  if (words.length < 1) { return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Gözden geçirilecek kelime yok.</div>; }
  const { t } = useLanguage();
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
    speak(text, 0.85).catch(() => {/* fallback handled inside speak() */});
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

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      const msg =
        event.error === 'no-speech' ? 'Ses algılanamadı. Lütfen tekrar deneyin.' :
        event.error === 'not-allowed' ? 'Mikrofon izni verilmedi. Lütfen tarayıcı ayarlarını kontrol edin.' :
        event.error === 'network' ? 'Ağ hatası oluştu. Lütfen internet bağlantınızı kontrol edin.' :
        'Bir hata oluştu. Lütfen tekrar deneyin.';
      setHeardText(msg);
      setFeedback('wrong');
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
          <h2>{t('games.speechUnavailable')}</h2>
          <p>{t('games.speechUnavailableMsg')}</p>
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
              {score >= total * 0.8 ? t('games.amazingPronunciation') : score >= total * 0.5 ? t('games.goodEffort') : t('games.keepPracticing')}
            </h2>
            <p className="pronunciation-game__results-score">
              {t('games.youPronounced').replace('{score}', String(score)).replace('{total}', String(total))}
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
            <Volume2 size={20} /> {t('games.listen')}
          </button>

          {feedback !== 'correct' && (
            <button
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t('games.perfectWellDone')}
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
                {t('games.youSaid')} "<strong>{heardText}</strong>" — {t('games.expected')} "<strong>{currentWord.english}</strong>"
              </div>
            )}
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                className="pronunciation-game__btn pronunciation-game__btn--try-again"
                onClick={startListening}
              >
                <Mic size={18} /> {t('games.tryAgain')}
              </button>
              <button
                className="pronunciation-game__btn pronunciation-game__btn--listen"
                onClick={goToNext}
                style={{ background: 'var(--text-secondary, #64748b)' }}
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
