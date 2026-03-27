import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Star, Check, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Badge, ProgressBar, FloatingEmoji } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { speak } from '../../services/ttsService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import NoHeartsModal from '../NoHeartsModal';
import { announceToScreenReader } from '../../utils/accessibility';
import AnswerFeedbackPanel from '../AnswerFeedbackPanel';
import { shuffleArray } from '../../utils/arrayUtils';
import './WordMatch.css';

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

interface MatchPair {
  id: number;
  english: string;
  turkish: string;
  emoji: string;
  displayEmoji: string;
  matched: boolean;
}


export const WordMatch: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer }) => {
  const { t } = useLanguage();
  const { loseHeart, hearts } = useHearts();
  const [showNoHearts, setShowNoHearts] = useState(false);

  const roundSize = 3;
  const totalWords = Math.min(words.length, 6);
  const totalRounds = Math.ceil(totalWords / roundSize);

  const [round, setRound] = useState(0);
  // leftItems / rightItems are the source of truth for cards — kept in sync with matched state
  const [leftItems, setLeftItems] = useState<MatchPair[]>([]);
  const [rightItems, setRightItems] = useState<MatchPair[]>([]);

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);

  // null = no feedback, 'correct', 'wrong'
  const [matchState, setMatchState] = useState<'correct' | 'wrong' | null>(null);
  // which pair IDs were involved in the last wrong attempt
  const [wrongPairIds, setWrongPairIds] = useState<{ l: number; r: number } | null>(null);

  const [score, setScore] = useState(0);
  const [_totalAttempted, setTotalAttempted] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [floatingEmoji, setFloatingEmoji] = useState<string | null>(null);

  // ── Build pairs for a round ──────────────────────────────────────────────
  const initRound = useCallback((roundIndex: number) => {
    const start = roundIndex * roundSize;
    const roundWords = words.slice(start, start + roundSize);

    const emojiCount: Record<string, number> = {};
    roundWords.forEach(w => { emojiCount[w.emoji] = (emojiCount[w.emoji] || 0) + 1; });
    const emojiIdx: Record<string, number> = {};
    const labels = ['①', '②', '③', '④', '⑤'];

    const newPairs: MatchPair[] = roundWords.map((w, i) => {
      let displayEmoji = w.emoji;
      if (emojiCount[w.emoji] > 1) {
        emojiIdx[w.emoji] = emojiIdx[w.emoji] ?? 0;
        displayEmoji = w.emoji + (labels[emojiIdx[w.emoji]] ?? String(emojiIdx[w.emoji] + 1));
        emojiIdx[w.emoji] += 1;
      }
      return { id: i, english: w.english, turkish: w.turkish, emoji: w.emoji, displayEmoji, matched: false };
    });

    setLeftItems(shuffleArray(newPairs));
    setRightItems(shuffleArray(newPairs));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchState(null);
    setWrongPairIds(null);
  }, [words]);

  useEffect(() => { initRound(0); }, [initRound]);

  // ── Match attempt ────────────────────────────────────────────────────────
  const tryMatch = useCallback((leftId: number, rightId: number) => {
    setTotalAttempted(n => n + 1);

    if (leftId === rightId) {
      // ── CORRECT ──
      const nextScore = score + 1;
      setScore(nextScore);
      setMatchState('correct');
      onXpEarned?.(10);
      SFX.correct();
      announceToScreenReader(t('games.correct') || 'Doğru!', 'polite');

      // Mark matched in both columns immediately — this is the key fix
      const markMatched = (items: MatchPair[]) =>
        items.map(p => p.id === leftId ? { ...p, matched: true } : p);
      setLeftItems(prev => markMatched(prev));
      setRightItems(prev => markMatched(prev));

      // Floating emoji
      const matchedItem = leftItems.find(p => p.id === leftId);
      if (matchedItem?.emoji) {
        setFloatingEmoji(matchedItem.emoji);
        setTimeout(() => setFloatingEmoji(null), 2200);
      }

      // Speak the English word
      if (matchedItem?.english) {
        speak(matchedItem.english, { lang: 'en-US', rate: 0.8 });
      }

      // Check if all matched (derive from updated state)
      const allMatched = leftItems.every(p => p.id === leftId ? true : p.matched);

      setTimeout(() => {
        setMatchState(null);
        setSelectedLeft(null);
        setSelectedRight(null);

        if (allMatched) {
          const nextRound = round + 1;
          if (nextRound < totalRounds) {
            setRound(nextRound);
            initRound(nextRound);
          } else {
            setCompleted(true);
            // Do NOT call onComplete here — let the results screen handle it
          }
        }
      }, 900);

    } else {
      // ── WRONG ──
      setMatchState('wrong');
      setWrongPairIds({ l: leftId, r: rightId });
      announceToScreenReader(t('games.tryAgain') || 'Tekrar Dene', 'assertive');
      SFX.wrong();
      loseHeart();
      onWrongAnswer?.();
      if (hearts - 1 <= 0) setShowNoHearts(true);
    }
  }, [score, leftItems, round, totalRounds, onXpEarned, onWrongAnswer, initRound, loseHeart, hearts, t]);

  // ── Click handlers ───────────────────────────────────────────────────────
  const handleLeftClick = (id: number) => {
    const item = leftItems.find(p => p.id === id);
    if (!item || item.matched || matchState) return;
    setSelectedLeft(id);
    if (selectedRight !== null) tryMatch(id, selectedRight);
  };

  const handleRightClick = (id: number) => {
    const item = rightItems.find(p => p.id === id);
    if (!item || item.matched || matchState) return;
    setSelectedRight(id);
    if (selectedLeft !== null) tryMatch(selectedLeft, id);
  };

  const handleContinueAfterWrong = () => {
    setMatchState(null);
    setWrongPairIds(null);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const progress = (score / totalWords) * 100;

  // ── Play again ───────────────────────────────────────────────────────────
  const handlePlayAgain = () => {
    setScore(0);
    setTotalAttempted(0);
    setRound(0);
    setCompleted(false);
    initRound(0);
  };

  // ── Guard ────────────────────────────────────────────────────────────────
  // Need at least roundSize words for a meaningful matching round
  if (words.length < roundSize) {
    return <div className="word-match__empty">{t('games.noWordsToReview')}</div>;
  }

  // ── Results screen ───────────────────────────────────────────────────────
  if (completed) {
    // pct is based on correct matches out of total possible — not attempts
    // Stars: 3 = all correct (100%), 2 = ≥60%, 1 = anything else
    // Using totalWords as denominator (not totalAttempted) — score measures correct pairs
    const pct = totalWords > 0 ? Math.round((score / totalWords) * 100) : 0;
    const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
    const isPerfect = pct === 100;

    return (
      <div className="word-match word-match--results">
        {/* Confetti burst */}
        <AnimatePresence>
          {isPerfect && (
            <motion.div
              className="wm-confetti-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {['🎉','⭐','🌟','✨','🎊','💫'].map((e, i) => (
                <motion.span
                  key={i}
                  className="wm-confetti-piece"
                  initial={{ y: 0, x: 0, opacity: 1, scale: 0 }}
                  animate={{
                    y: [0, -80 - i * 30, 200],
                    x: [(i % 2 === 0 ? -1 : 1) * (20 + i * 25), (i % 2 === 0 ? 1 : -1) * (40 + i * 15)],
                    opacity: [0, 1, 0],
                    scale: [0, 1.4, 0.8],
                  }}
                  transition={{ duration: 1.4, delay: i * 0.1, ease: 'easeOut' }}
                  style={{ left: `${10 + i * 14}%` }}
                >
                  {e}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="word-match__results-content"
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* Trophy / icon */}
          <motion.div
            className="word-match__results-icon"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.2 }}
          >
            {isPerfect
              ? <Trophy size={64} color="var(--warning)" />
              : pct >= 60
              ? <Star size={64} fill="var(--warning)" color="var(--warning)" />
              : <Check size={64} color="var(--success)" />}
          </motion.div>

          {/* Title */}
          <motion.h2
            className="word-match__results-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            {isPerfect ? '🏆 Mükemmel!' : pct >= 60 ? '⭐ Harika!' : t('games.greatJob')}
          </motion.h2>

          {/* Score line */}
          <motion.p
            className="word-match__results-score"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            {t('games.youMatched')
              .replace('{score}', String(score))
              .replace('{total}', String(totalWords))}
          </motion.p>

          {/* Stars — staggered pop-in */}
          <div className="word-match__results-stars">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.55 + i * 0.12 }}
              >
                <Star
                  size={32}
                  fill={i < stars ? '#E8A317' : 'none'}
                  color={i < stars ? '#E8A317' : '#ddd'}
                />
              </motion.span>
            ))}
          </div>

          {/* XP badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, delay: 0.9 }}
          >
            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{score * 10} XP
            </Badge>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="word-match__results-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
          >
            <button
              type="button"
              className="word-match__results-btn word-match__results-btn--secondary"
              onClick={() => onComplete(score, totalWords)}
            >
              <ArrowRight size={16} /> {t('games.backToGames')}
            </button>
            <button
              type="button"
              className="word-match__results-btn word-match__results-btn--primary"
              onClick={handlePlayAgain}
              autoFocus
            >
              <RotateCcw size={16} /> {t('games.playAgain')}
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ── Game board ───────────────────────────────────────────────────────────
  return (
    <>
      {showNoHearts && <NoHeartsModal onClose={() => setShowNoHearts(false)} />}

      <div className="word-match" role="application" aria-label="Word matching game">
        {floatingEmoji && <FloatingEmoji emoji={floatingEmoji} count={5} />}

        <div className="word-match__header">
          <h2 className="word-match__title">{t('games.matchTheWords')}</h2>
          <Badge variant="info">{t('games.round')} {round + 1}/{totalRounds}</Badge>
        </div>

        <ProgressBar value={progress} variant="success" size="md" animated />

        <div className="word-match__board">
          {/* ── LEFT: English — letter avatar only, no emoji ── */}
          <div className="word-match__column" role="list" aria-label="English words">
            {leftItems.map(item => {
              const isSelected = selectedLeft === item.id;
              const isWrong = wrongPairIds?.l === item.id && matchState === 'wrong';
              const isFlashing = matchState === 'correct' && isSelected;
              return (
                <motion.button
                  key={`left-${item.id}`}
                  type="button"
                  role="listitem"
                  className={[
                    'word-match__card',
                    'word-match__card--left',
                    item.matched && 'word-match__card--matched',
                    isSelected && !item.matched && 'word-match__card--selected',
                    isWrong && 'word-match__card--wrong',
                    isFlashing && 'word-match__card--flash',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleLeftClick(item.id)}
                  disabled={item.matched || !!matchState}
                  aria-label={`English: ${item.english}${item.matched ? ' (matched)' : ''}${isWrong ? ' (wrong match)' : ''}`}
                  aria-pressed={isSelected}
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {/* Icon indicates state — not color alone (color-blind accessibility) */}
                  {item.matched
                    ? <div className="word-match__card-check"><CheckCircle2 size={22} /></div>
                    : isWrong
                    ? <div className="word-match__card-check"><XCircle size={22} /></div>
                    : <div className="word-match__card-avatar">{item.english.charAt(0).toUpperCase()}</div>
                  }
                  <span className="word-match__card-text">{item.english}</span>
                </motion.button>
              );
            })}
          </div>

          {/* ── RIGHT: Turkish — emoji shown ── */}
          <div className="word-match__column" role="list" aria-label="Turkish translations">
            {rightItems.map(item => {
              const isSelected = selectedRight === item.id;
              const isWrong = wrongPairIds?.r === item.id && matchState === 'wrong';
              const isFlashing = matchState === 'correct' && isSelected;
              return (
                <motion.button
                  key={`right-${item.id}`}
                  type="button"
                  role="listitem"
                  className={[
                    'word-match__card',
                    'word-match__card--right',
                    item.matched && 'word-match__card--matched',
                    isSelected && !item.matched && 'word-match__card--selected',
                    isWrong && 'word-match__card--wrong',
                    isFlashing && 'word-match__card--flash',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleRightClick(item.id)}
                  disabled={item.matched || !!matchState}
                  aria-label={`Turkish: ${item.turkish}${item.matched ? ' (matched)' : ''}${isWrong ? ' (wrong match)' : ''}`}
                  aria-pressed={isSelected}
                  layout
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {/* Icon indicates state — not color alone (color-blind accessibility) */}
                  {item.matched
                    ? <div className="word-match__card-check"><CheckCircle2 size={22} /></div>
                    : isWrong
                    ? <div className="word-match__card-check"><XCircle size={22} /></div>
                    : <div className="word-match__card-emoji">{item.displayEmoji || item.turkish.charAt(0)}</div>
                  }
                  <span className="word-match__card-text">{item.turkish}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <AnswerFeedbackPanel
        feedback={matchState}
        onContinue={handleContinueAfterWrong}
        xpEarned={10}
      />
    </>
  );
};

WordMatch.displayName = 'WordMatch';
