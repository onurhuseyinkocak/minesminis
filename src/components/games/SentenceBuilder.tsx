import { useState, useEffect, useRef } from 'react';
import type { KidsWord } from '../../data/wordsData';
import { useLanguage } from '../../contexts/LanguageContext';
import './SentenceBuilder.css';

interface SentenceEntry {
  words: string[];
  bank: string[];
  emoji: string;
  hint: string;
}

const SENTENCES: SentenceEntry[] = [
  { words: ['The', 'cat', 'sits'], bank: ['The', 'cat', 'sits', 'runs', 'big', 'a'], emoji: '🐱', hint: 'cat' },
  { words: ['A', 'dog', 'runs'], bank: ['A', 'dog', 'runs', 'sits', 'the', 'cat'], emoji: '🐶', hint: 'dog' },
  { words: ['The', 'sun', 'is', 'hot'], bank: ['The', 'sun', 'is', 'hot', 'cold', 'big', 'a'], emoji: '☀️', hint: 'sun' },
  { words: ['I', 'see', 'a', 'fish'], bank: ['I', 'see', 'a', 'fish', 'big', 'run', 'the'], emoji: '🐟', hint: 'fish' },
  { words: ['She', 'has', 'a', 'hat'], bank: ['She', 'has', 'a', 'hat', 'he', 'big', 'the'], emoji: '🎩', hint: 'hat' },
  { words: ['The', 'hen', 'can', 'run'], bank: ['The', 'hen', 'can', 'run', 'sit', 'a', 'big'], emoji: '🐔', hint: 'hen' },
];

interface SentenceBuilderProps {
  words?: KidsWord[];
  onComplete: (score: number, total: number) => void;
}

export default function SentenceBuilder({ onComplete }: SentenceBuilderProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  // Ordered array of bank indices so undo removes the last-added word correctly
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [completed, setCompleted] = useState(false);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Mirror of currentIndex in a ref so setTimeout closures always read the latest value
  const currentIndexRef = useRef(0);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  currentIndexRef.current = currentIndex;
  const sentence = SENTENCES[currentIndex];
  const total = SENTENCES.length;

  const handleBankTap = (word: string, idx: number) => {
    if (usedIndices.includes(idx)) return;
    if (selected.length >= sentence.words.length) return;
    if (feedback) return;
    setSelected((prev) => [...prev, word]);
    setUsedIndices((prev) => [...prev, idx]);
  };

  const handleUndo = () => {
    if (selected.length === 0 || feedback) return;
    setUsedIndices((prev) => prev.slice(0, -1));
    setSelected((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    if (selected.length !== sentence.words.length) return;
    const isCorrect = selected.every(
      (w, i) => w.toLowerCase() === sentence.words[i].toLowerCase()
    );
    if (isCorrect) {
      setFeedback('correct');
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        feedbackTimerRef.current = setTimeout(() => {
          setFeedback(null);
          setSelected([]);
          setUsedIndices([]);
          if (currentIndexRef.current + 1 >= total) {
            setCompleted(true);
            // Use newScore to avoid stale closure — score state may not have updated yet
            autoCompleteTimeoutRef.current = setTimeout(
              () => onComplete(newScore, total),
              4000
            );
          } else {
            setCurrentIndex((p) => p + 1);
          }
        }, 1000);
        return newScore;
      });
    } else {
      setHearts((prevHearts) => {
        const newHearts = Math.max(0, prevHearts - 1);
        setFeedback('wrong');
        if (newHearts === 0) {
          // Game over — no more hearts; capture score via functional update to avoid stale closure
          setScore((currentScore) => {
            feedbackTimerRef.current = setTimeout(() => {
              setCompleted(true);
              autoCompleteTimeoutRef.current = setTimeout(
                () => onComplete(currentScore, total),
                4000
              );
            }, 1200);
            return currentScore;
          });
        } else {
          feedbackTimerRef.current = setTimeout(() => {
            setFeedback(null);
            setSelected([]);
            setUsedIndices([]);
          }, 800);
        }
        return newHearts;
      });
    }
  }, [selected, sentence.words, total, onComplete]);

  if (completed) {
    const pct = Math.round((score / total) * 100);
    const resultLabel =
      pct >= 80
        ? t('games.sentenceBuilderExcellent')
        : pct >= 60
          ? t('games.sentenceBuilderGoodJob')
          : t('games.sentenceBuilderTryAgain');
    return (
      <div className="sb-results">
        <div className="sb-results__card">
          <h2 className="sb-results__title">{resultLabel}</h2>
          <p className="sb-results__score">
            {t('games.sentenceBuilderCorrectOf')
              .replace('{score}', String(score))
              .replace('{total}', String(total))}
          </p>
          <div className="sb-results__actions">
            <button
              type="button"
              className="sb-results__btn sb-results__btn--primary"
              onClick={() => {
                if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
                onComplete(score, total);
              }}
            >
              {t('games.backToGames')}
            </button>
            <button
              type="button"
              className="sb-results__btn sb-results__btn--secondary"
              onClick={() => {
                if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
                setCompleted(false);
                setCurrentIndex(0);
                setScore(0);
                setHearts(3);
                setSelected([]);
                setUsedIndices([]);
              }}
            >
              {t('games.playAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`sentence-builder${feedback ? ` sentence-builder--${feedback}` : ''}`}>
      {/* Header: progress + hearts */}
      <div className="sb-header">
        <div className="sb-progress">
          <div
            className="sb-progress__bar"
            style={{ width: `${(currentIndex / total) * 100}%` }}
          />
        </div>
        <div className="sb-hearts" aria-label={`Hearts: ${hearts} of 3`}>
          {Array.from({ length: 3 }, (_, i) => (
            <span
              key={i}
              className={i < hearts ? 'sb-heart sb-heart--active' : 'sb-heart sb-heart--lost'}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Sentence image/emoji */}
      <div className="sb-scene">
        <div className="sb-scene__emoji">{sentence.emoji}</div>
        <p className="sb-scene__hint">{t('games.completeSentence')}</p>
      </div>

      {/* Answer slots */}
      <div className="sb-slots">
        {sentence.words.map((_, i) => (
          <div
            key={i}
            className={[
              'sb-slot',
              selected[i] ? 'sb-slot--filled' : '',
              feedback === 'correct' ? 'sb-slot--correct' : '',
              feedback === 'wrong' ? 'sb-slot--wrong' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {selected[i] ?? ''}
          </div>
        ))}
      </div>

      {/* Undo button */}
      {selected.length > 0 && (
        <button className="sb-undo" onClick={handleUndo} type="button">
          {t('games.undoWord')}
        </button>
      )}

      {/* Word bank */}
      <div className="sb-bank">
        {sentence.bank.map((word, idx) => (
          <button
            key={idx}
            type="button"
            className={`sb-bank__word${usedIndices.includes(idx) ? ' sb-bank__word--used' : ''}`}
            onClick={() => handleBankTap(word, idx)}
            disabled={usedIndices.includes(idx) || !!feedback}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}

SentenceBuilder.displayName = 'SentenceBuilder';
