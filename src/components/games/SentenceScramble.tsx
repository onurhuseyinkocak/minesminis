import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw, Lightbulb, Sparkles, Star, Trophy, Check, ArrowRight } from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '../ui';
import { ConfettiRain } from '../ui/Celebrations';
import { SFX } from '../../data/soundLibrary';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import NoHeartsModal from '../NoHeartsModal';
import './SentenceScramble.css';

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

interface SentenceData {
  sentence: string;
  words: string[];
}

function shuffleArray<T>(arr: T[]): T[] {
  if (arr.length <= 1) return [...arr];
  let shuffled: T[];
  let attempts = 0;
  // Guard against returning original order (anti-pattern for scramble games)
  do {
    shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    attempts++;
  } while (
    attempts < 10 &&
    arr.length > 1 &&
    shuffled.every((v, i) => v === arr[i])
  );
  return shuffled;
}

/** Returns "a" or "an" based on the first letter of the word (English article rule). */
function articleFor(word: string): string {
  return /^[aeiou]/i.test(word) ? 'an' : 'a';
}

function generateSentences(wordItems: WordItem[]): SentenceData[] {
  // Templates that use correct "a/an" articles and avoid single-word sentences
  const templates = [
    (w: string) => `I like the ${w}`,
    (w: string) => `This is ${articleFor(w)} ${w}`,
    (w: string) => `I see ${articleFor(w)} ${w}`,
    (w: string) => `Look at the ${w}`,
    (w: string) => `I have ${articleFor(w)} ${w}`,
    (w: string) => `We can see the ${w}`,
  ];

  return wordItems.slice(0, 5).map((item, i) => {
    const template = templates[i % templates.length];
    const sentence = template(item.english.toLowerCase());
    return {
      sentence,
      words: sentence.split(' '),
    };
  });
}

export const SentenceScramble: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer }) => {
  const { t } = useLanguage();
  const { loseHeart, hearts } = useHearts();
  const [showNoHearts, setShowNoHearts] = useState(false);
  const sentences = useMemo(() => generateSentences(words), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>(() =>
    shuffleArray(sentences[0]?.words || [])
  );
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSentence = sentences[currentIndex];

  // Cleanup timers and TTS on unmount
  useEffect(() => {
    return () => {
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const initSentence = useCallback((index: number) => {
    const s = sentences[index];
    if (!s) return;
    setPlaced([]);
    setAvailable(shuffleArray(s.words));
    setFeedback(null);
    setShowHint(false);
    setFailedAttempts(0);
  }, [sentences]);

  const handleWordTap = (word: string, fromIndex: number) => {
    if (feedback) return;
    setPlaced((prev) => [...prev, word]);
    setAvailable((prev) => prev.filter((_, i) => i !== fromIndex));
  };

  const handleRemoveWord = (word: string, fromIndex: number) => {
    if (feedback) return;
    setAvailable((prev) => [...prev, word]);
    setPlaced((prev) => prev.filter((_, i) => i !== fromIndex));
  };

  // Keyboard reorder: ArrowLeft/ArrowRight moves a placed chip, Backspace removes it
  const handlePlacedKeyDown = (e: React.KeyboardEvent, word: string, index: number) => {
    if (feedback) return;
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      setPlaced((prev) => {
        const next = [...prev];
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
        return next;
      });
    } else if (e.key === 'ArrowRight' && index < placed.length - 1) {
      e.preventDefault();
      setPlaced((prev) => {
        const next = [...prev];
        [next[index], next[index + 1]] = [next[index + 1], next[index]];
        return next;
      });
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      handleRemoveWord(word, index);
    }
  };

  const normalizeForCheck = (s: string) =>
    s.trim().toLowerCase().replace(/[.,!?;:'"]+$/g, '');

  const handleCheck = () => {
    if (feedback) return;
    // Case-insensitive, punctuation-tolerant comparison
    const attempt = normalizeForCheck(placed.join(' '));
    const correct = normalizeForCheck(currentSentence.sentence);

    if (attempt === correct) {
      setFeedback('correct');
      setScore((prev) => {
        const newScore = prev + 1;

        if (window.speechSynthesis) {
          const utter = new SpeechSynthesisUtterance(currentSentence.sentence);
          utter.lang = 'en-US';
          utter.rate = 0.8;
          window.speechSynthesis.speak(utter);
        }

        setTimeout(() => {
          if (currentIndex + 1 < sentences.length) {
            setCurrentIndex((ci) => ci + 1);
            initSentence(currentIndex + 1);
          } else {
            setCompleted(true);
            // Use newScore here to avoid stale closure bug
            autoCompleteTimeoutRef.current = setTimeout(
              () => onComplete(newScore, sentences.length),
              4000
            );
          }
        }, 2000);

        return newScore;
      });
      onXpEarned?.(15);
      SFX.correct();
    } else {
      setFeedback('wrong');
      SFX.wrong();
      loseHeart();
      onWrongAnswer?.();
      if (hearts - 1 <= 0) {
        setShowNoHearts(true);
      }
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 1) setShowHint(true);

      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  const handleReset = () => {
    if (feedback) return;
    setAvailable(shuffleArray(currentSentence.words));
    setPlaced([]);
  };

  const progress = sentences.length > 0 ? (currentIndex / sentences.length) * 100 : 0;

  // Guard: no words provided
  if (words.length < 1) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
        {t('games.noWordsToReview')}
      </div>
    );
  }

  // Guard: no sentences could be generated (e.g., all words filtered out)
  if (sentences.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
        {t('games.noWordsToReview')}
      </div>
    );
  }

  if (completed) {
    const pct = sentences.length > 0 ? Math.round((score / sentences.length) * 100) : 0;
    const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
    return (
      <div className="sentence-scramble">
        {pct >= 90 && <ConfettiRain duration={3000} />}
        <Card variant="elevated" padding="xl" className="sentence-scramble__results">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="sentence-scramble__results-content"
          >
            <motion.span
              className="sentence-scramble__big-emoji"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            >
              {pct >= 90 ? <Trophy size={48} color="var(--warning)" /> : pct >= 60 ? <Star size={48} fill="var(--warning)" color="var(--warning)" /> : <Check size={48} color="var(--success)" />}
            </motion.span>
            <h2 className="sentence-scramble__results-title">{t('games.sentenceMaster')}</h2>
            <p className="sentence-scramble__results-score">
              {t('games.outOfSentences').replace('{score}', String(score)).replace('{total}', String(sentences.length))}
            </p>
            <span className="game-stars">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10, delay: 0.5 + i * 0.15 }}
                >
                  <Star size={32} fill={i < stars ? 'var(--primary)' : 'none'} color={i < stars ? 'var(--primary)' : 'var(--border-strong, #ccc)'} />
                </motion.span>
              ))}
            </span>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 15} XP
            </Badge>
            <div className="sentence-scramble__results-actions">
              <button type="button" className="sentence-scramble__results-btn sentence-scramble__results-btn--secondary" onClick={() => { if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current); onComplete(score, sentences.length); }}>
                <ArrowRight size={16} /> {t('games.backToGames')}
              </button>
              <button type="button" className="sentence-scramble__results-btn sentence-scramble__results-btn--primary" onClick={() => { if (autoCompleteTimeoutRef.current) { clearTimeout(autoCompleteTimeoutRef.current); autoCompleteTimeoutRef.current = null; } setCurrentIndex(0); setScore(0); setCompleted(false); initSentence(0); }}>
                <RotateCcw size={16} /> {t('games.playAgain')}
              </button>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!currentSentence) return null;

  return (
    <>
    {showNoHearts && (
      <NoHeartsModal onClose={() => setShowNoHearts(false)} />
    )}
    <div className="sentence-scramble" role="application" aria-label="Sentence scramble game">
      <div className="sentence-scramble__header">
        <h2 className="sentence-scramble__title">{t('games.buildTheSentence')}</h2>
        <Badge variant="info">{currentIndex + 1}/{sentences.length}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      {showHint && (
        <motion.div
          className="sentence-scramble__hint"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Lightbulb size={18} />
          {t('games.hintSentenceStartsWith').replace('{word}', currentSentence.words[0])}
        </motion.div>
      )}

      <Card variant="outlined" padding="lg" className="sentence-scramble__dropzone">
        <p id="ss-dropzone-label" className="sentence-scramble__dropzone-label">
          {placed.length === 0 ? t('games.tapWordsBelow') : t('games.yourSentence')}
        </p>
        <div
          className="sentence-scramble__placed"
          role="list"
          aria-label="Build your sentence"
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence>
            {placed.map((word, index) => (
              <motion.button
                type="button"
                key={`placed-${index}-${word}`}
                role="listitem"
                className="sentence-scramble__chip sentence-scramble__chip--placed"
                onClick={() => handleRemoveWord(word, index)}
                onKeyDown={(e) => handlePlacedKeyDown(e, word, index)}
                aria-label={`${word}, position ${index + 1} of ${placed.length}. Press Backspace to remove, Arrow keys to reorder.`}
                aria-pressed={true}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileTap={{ scale: 0.9 }}
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      <div aria-live="polite" aria-atomic="true">
        {feedback === 'correct' && (
          <motion.div
            className="sentence-scramble__feedback sentence-scramble__feedback--correct"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle size={22} /> {t('games.perfectSentence')}
          </motion.div>
        )}

        {feedback === 'wrong' && (
          <motion.div
            className="sentence-scramble__feedback sentence-scramble__feedback--wrong"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -6, 6, -6, 0] }}
          >
            {t('games.notQuiteKeepTrying')}
          </motion.div>
        )}
      </div>

      <div className="sentence-scramble__available" role="list" aria-label="Available words">
        <AnimatePresence>
          {available.map((word, index) => (
            <motion.button
              type="button"
              key={`avail-${index}-${word}`}
              role="listitem"
              className="sentence-scramble__chip sentence-scramble__chip--available"
              onClick={() => handleWordTap(word, index)}
              disabled={!!feedback}
              aria-label={`Add word: ${word}`}
              aria-pressed={false}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.9 }}
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="sentence-scramble__actions">
        <Button
          variant="ghost"
          size="lg"
          icon={<RotateCcw size={20} />}
          onClick={handleReset}
          disabled={placed.length === 0 || !!feedback}
        >
          {t('games.reset')}
        </Button>
        <Button
          variant="primary"
          size="xl"
          onClick={handleCheck}
          disabled={placed.length !== currentSentence.words.length || !!feedback}
        >
          {t('games.checkExcl')}
        </Button>
      </div>
    </div>
    </>
  );
};

SentenceScramble.displayName = 'SentenceScramble';
