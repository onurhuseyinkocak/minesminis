import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { useLanguage } from '../../contexts/LanguageContext';
import './SegmentingBoard.css';

interface WordItem {
  english: string;
  turkish: string;
  emoji: string;
}

interface SegmentingBoardProps {
  words: WordItem[];
  onComplete: (score: number, total: number) => void;
  onWrongAnswer?: () => void;
}

const WORD_EMOJIS: Record<string, string> = {
  cat: '🐱', dog: '🐶', hat: '🎩', sun: '☀️', pig: '🐷',
  hen: '🐔', bug: '🐛', cup: '☕', red: '🔴', map: '🗺️',
  fish: '🐟', ship: '🚢', shop: '🏪', chip: '🍟', ring: '💍',
  tree: '🌳', rain: '🌧️', moon: '🌙', book: '📖', feet: '🦶',
};

function splitToSounds(word: string): string[] {
  const digraphs = ['sh', 'ch', 'th', 'ng', 'ck', 'qu', 'ai', 'ee', 'oo', 'or', 'ar', 'er', 'ou', 'oi', 'ue', 'ie', 'oa'];
  const sounds: string[] = [];
  let i = 0;
  while (i < word.length) {
    const pair = word.slice(i, i + 2).toLowerCase();
    if (i + 1 < word.length && digraphs.includes(pair)) {
      sounds.push(word.slice(i, i + 2));
      i += 2;
    } else {
      sounds.push(word[i]);
      i += 1;
    }
  }
  return sounds;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const SegmentingBoard: React.FC<SegmentingBoardProps> = ({ words, onComplete, onWrongAnswer }) => {
  const { t } = useLanguage();

  if (!words || words.length < 1) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Parçalama için kelime gerekiyor.</div>;
  }

  const gameWords = useMemo(() => words.slice(0, 5).map(w => typeof w === 'string' ? w : w.english), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sounds, setSounds] = useState<string[]>([]);
  const [options, setOptions] = useState<{ id: number; sound: string; used: boolean }[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'explode' | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentWord = gameWords[currentIndex] || '';
  const emoji = WORD_EMOJIS[currentWord.toLowerCase()] || '📝';

  const speak = useCallback((text: string, rate = 0.7) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = rate;
      window.speechSynthesis.speak(utter);
    }
  }, []);

  const initWord = useCallback((index: number) => {
    const word = gameWords[index];
    if (!word) return;
    const wordSounds = splitToSounds(word);
    setSounds(wordSounds);

    // Create options: correct sounds + a few decoys
    const decoys = ['p', 'b', 'k', 'z', 'w', 'f', 'l', 'r', 'n', 'm']
      .filter((d) => !wordSounds.includes(d))
      .slice(0, 2);
    const allOptions = [...wordSounds, ...decoys].map((s, i) => ({ id: i, sound: s, used: false }));
    setOptions(shuffleArray(allOptions));
    setSelected([]);
    setFeedback(null);
  }, [gameWords]);

  useEffect(() => {
    initWord(0);
  }, [initWord]);

  const handleOptionTap = (opt: { id: number; sound: string; used: boolean }) => {
    if (opt.used || feedback) return;

    const nextSlotIndex = selected.length;
    const expectedSound = sounds[nextSlotIndex];

    if (opt.sound.toLowerCase() !== expectedSound.toLowerCase()) {
      setFeedback('wrong');
      onWrongAnswer?.();
      setTimeout(() => setFeedback(null), 600);
      return;
    }

    const newSelected = [...selected, opt.sound];
    setSelected(newSelected);
    setOptions((prev) => prev.map((o) => (o.id === opt.id ? { ...o, used: true } : o)));

    speak(opt.sound, 0.6);

    // All sounds placed
    if (newSelected.length === sounds.length) {
      setTimeout(() => {
        setFeedback('explode');
      }, 400);

      setTimeout(() => {
        setScore((prev) => prev + 1);
        setFeedback('correct');
        SFX.correct();
      }, 1500);

      setTimeout(() => {
        if (currentIndex + 1 < gameWords.length) {
          setCurrentIndex((prev) => prev + 1);
          initWord(currentIndex + 1);
        } else {
          setCompleted(true);
          onComplete(score + 1, gameWords.length);
        }
      }, 2500);
    }
  };

  const progress = (currentIndex / gameWords.length) * 100;

  if (completed) {
    return (
      <div className="segmenting-board__complete">
        <Card variant="elevated" padding="xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="segmenting-board__complete-content"
          >
            <span className="segmenting-board__complete-emoji" role="img" aria-label="celebration">🎊</span>
            <h2 className="segmenting-board__complete-title">{t('games.soundSmasher')}</h2>
            <p className="segmenting-board__complete-score">
              {t('games.wordsSegmented').replace('{score}', String(score)).replace('{total}', String(gameWords.length))}
            </p>
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 15} XP
            </Badge>
          </motion.div>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="segmenting-board"
      role="application"
      aria-label="Sound segmenting game"
    >
      <div className="segmenting-board__header">
        <h2 className="segmenting-board__title">{t('games.breakTheWord')}</h2>
        <Badge variant="info">{currentIndex + 1}/{gameWords.length}</Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      {/* Word display */}
      <Card variant="elevated" padding="lg">
        <div className="segmenting-board__word-display">
          <motion.span
            key={currentWord}
            initial={{ scale: 0 }}
            animate={feedback === 'explode' ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] } : { scale: 1 }}
            transition={feedback === 'explode' ? { duration: 0.6 } : { type: 'spring', stiffness: 300 }}
            className="segmenting-board__emoji"
          >
            {emoji}
          </motion.span>

          {feedback !== 'explode' && (
            <motion.p className="segmenting-board__word-text">
              {currentWord}
            </motion.p>
          )}

          <Button
            variant="ghost"
            size="md"
            onClick={() => speak(currentWord, 0.8)}
            style={{ marginTop: '0.25rem' }}
          >
            🔊 {t('games.listen')}
          </Button>
        </div>
      </Card>

      {/* Sound hint */}
      <p className="segmenting-board__hint">
        {t('games.thisWordHasSounds').replace('{count}', String(sounds.length))}{' '}
        {sounds.map((_, i) => (
          <span key={i} className="segmenting-board__hint-slot">
            {selected[i] ? (
              <span className="segmenting-board__hint-slot--filled">{selected[i]}</span>
            ) : (
              '_'
            )}
          </span>
        ))}
      </p>

      {/* Explode animation */}
      <AnimatePresence>
        {feedback === 'explode' && (
          <motion.div
            className="segmenting-board__explode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {sounds.map((s, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0, y: [0, -20, 0] }}
                transition={{ delay: i * 0.15, type: 'spring' }}
                className="segmenting-board__explode-piece"
              >
                {s}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {feedback === 'wrong' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -8, 8, -8, 0] }}
            exit={{ opacity: 0 }}
            className="segmenting-board__feedback--wrong"
          >
            {t('games.tryAnotherSound')} 💪
          </motion.div>
        )}
        {feedback === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="segmenting-board__feedback--correct"
          >
            {t('games.youBrokeIt')} 🌟
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sound options */}
      <div
        className="segmenting-board__options"
        role="group"
        aria-label="Sound options"
      >
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            onClick={() => handleOptionTap(opt)}
            disabled={opt.used || !!feedback}
            whileTap={{ scale: 0.9 }}
            animate={{
              opacity: opt.used ? 0.3 : 1,
              scale: opt.used ? 0.8 : 1,
            }}
            className={`segmenting-board__option${opt.used ? ' segmenting-board__option--used' : ''}`}
            aria-label={`Sound: ${opt.sound}`}
          >
            {opt.sound}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

SegmentingBoard.displayName = 'SegmentingBoard';
