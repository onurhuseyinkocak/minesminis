import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Star, Check, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import { SFX } from '../../data/soundLibrary';
import { speak } from '../../services/ttsService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHearts } from '../../contexts/HeartsContext';
import NoHeartsModal from '../NoHeartsModal';
import { announceToScreenReader } from '../../utils/accessibility';
import AnswerFeedbackPanel from '../AnswerFeedbackPanel';
import { shuffleArray } from '../../utils/arrayUtils';
import { getQuestionsCountForAge } from '../../services/ageGroupService';

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
  ageGroup?: string;
}

interface MatchPair {
  id: number;
  english: string;
  turkish: string;
  emoji: string;
  displayEmoji: string;
  matched: boolean;
}


export const WordMatch: React.FC<GameProps> = ({ words, onComplete, onXpEarned, onWrongAnswer, ageGroup }) => {
  const { t } = useLanguage();
  const { loseHeart, hearts } = useHearts();
  const [showNoHearts, setShowNoHearts] = useState(false);

  const age = ageGroup || '7-9';
  // For age 3-5: 2 pairs per round, 5-7: 3, 7+: 4
  const roundSize = age === '3-5' ? 2 : age === '5-7' ? 3 : 4;
  const totalQuestionsForAge = getQuestionsCountForAge(age);
  const totalWords = Math.min(words.length, totalQuestionsForAge);
  const totalRounds = Math.ceil(totalWords / roundSize);

  const [round, setRound] = useState(0);
  const [leftItems, setLeftItems] = useState<MatchPair[]>([]);
  const [rightItems, setRightItems] = useState<MatchPair[]>([]);

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);

  const [matchState, setMatchState] = useState<'correct' | 'wrong' | null>(null);
  const [wrongPairIds, setWrongPairIds] = useState<{ l: number; r: number } | null>(null);

  const [score, setScore] = useState(0);
  const [_totalAttempted, setTotalAttempted] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Build pairs for a round
  const initRound = useCallback((roundIndex: number) => {
    const start = roundIndex * roundSize;
    const roundWords = words.slice(start, start + roundSize);

    const emojiCount: Record<string, number> = {};
    roundWords.forEach(w => { emojiCount[w.emoji] = (emojiCount[w.emoji] || 0) + 1; });
    const emojiIdx: Record<string, number> = {};
    const labels = ['\u2460', '\u2461', '\u2462', '\u2463', '\u2464'];

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

  // Match attempt
  const tryMatch = useCallback((leftId: number, rightId: number) => {
    setTotalAttempted(n => n + 1);

    if (leftId === rightId) {
      const nextScore = score + 1;
      setScore(nextScore);
      setMatchState('correct');
      onXpEarned?.(10);
      SFX.correct();
      announceToScreenReader(t('games.correct') || 'Correct!', 'polite');

      const markMatched = (items: MatchPair[]) =>
        items.map(p => p.id === leftId ? { ...p, matched: true } : p);
      setLeftItems(prev => markMatched(prev));
      setRightItems(prev => markMatched(prev));

      const matchedItem = leftItems.find(p => p.id === leftId);
      if (matchedItem?.english) {
        speak(matchedItem.english, { lang: 'en-US', rate: 0.8 });
      }

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
          }
        }
      }, 900);

    } else {
      setMatchState('wrong');
      setWrongPairIds({ l: leftId, r: rightId });
      announceToScreenReader(t('games.tryAgain') || 'Try Again', 'assertive');
      SFX.wrong();
      loseHeart();
      onWrongAnswer?.();
      if (hearts - 1 <= 0) setShowNoHearts(true);
    }
  }, [score, leftItems, round, totalRounds, onXpEarned, onWrongAnswer, initRound, loseHeart, hearts, t]);

  // Click handlers
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

  const handlePlayAgain = () => {
    setScore(0);
    setTotalAttempted(0);
    setRound(0);
    setCompleted(false);
    initRound(0);
  };

  // Guard
  if (words.length < roundSize) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400 text-lg font-medium">
        {t('games.noWordsToReview')}
      </div>
    );
  }

  // Results screen
  if (completed) {
    const pct = totalWords > 0 ? Math.round((score / totalWords) * 100) : 0;
    const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
    const isPerfect = pct === 100;

    return (
      <div className="flex flex-col items-center justify-center h-full max-h-full overflow-hidden bg-gradient-to-b from-blue-50 to-orange-50 p-4">
        {isPerfect && <ConfettiRain duration={3000} />}

        <motion.div
          className="flex flex-col items-center gap-6 bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full"
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* Trophy icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.2 }}
          >
            {isPerfect
              ? <Trophy size={64} className="text-amber-400" />
              : pct >= 60
              ? <Star size={64} className="text-amber-400 fill-amber-400" />
              : <Check size={64} className="text-emerald-500" />}
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-2xl font-bold text-slate-800"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            {isPerfect ? t('games.perfectScore') || 'Perfect!' : pct >= 60 ? t('games.greatJob') || 'Great Job!' : t('games.greatJob') || 'Good Try!'}
          </motion.h2>

          {/* Score */}
          <motion.p
            className="text-lg text-slate-500 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            {t('games.youMatched')
              .replace('{score}', String(score))
              .replace('{total}', String(totalWords))}
          </motion.p>

          {/* Stars */}
          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.55 + i * 0.12 }}
              >
                <Star
                  size={36}
                  className={i < stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                />
              </motion.span>
            ))}
          </div>

          {/* XP badge */}
          <motion.div
            className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 font-bold text-sm px-4 py-2 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, delay: 0.9 }}
          >
            <Sparkles size={16} />
            +{score * 10} XP
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="flex gap-3 w-full mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
          >
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors min-h-[48px]"
              onClick={() => onComplete(score, totalWords)}
            >
              <ArrowRight size={16} /> {t('games.backToGames')}
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25 min-h-[48px]"
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

  // Game board
  return (
    <>
      {showNoHearts && <NoHeartsModal onClose={() => setShowNoHearts(false)} />}

      <div
        className="flex flex-col h-full max-h-full overflow-hidden p-4 max-w-lg mx-auto w-full"
        role="application"
        aria-label="Word matching game"
      >
        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100 rounded-full mx-0 mt-1 mb-2 flex-shrink-0">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0 mb-2">
          <h2 className="text-base font-bold text-slate-800">{t('games.matchTheWords')}</h2>
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {t('games.round')} {round + 1}/{totalRounds} &middot; {score}/{totalWords}
          </span>
        </div>

        {/* Two-column board */}
        <div className="grid grid-cols-2 gap-2 flex-1 overflow-hidden">
          {/* LEFT: English words (blue cards) */}
          <div className="flex flex-col gap-2.5" role="list" aria-label="English words">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider text-center mb-1">English</span>
            <AnimatePresence>
              {leftItems.map(item => {
                const isSelected = selectedLeft === item.id;
                const isWrong = wrongPairIds?.l === item.id && matchState === 'wrong';
                const isCorrectFlash = matchState === 'correct' && isSelected;

                return (
                  <motion.button
                    key={`left-${item.id}`}
                    type="button"
                    role="listitem"
                    className={[
                      'relative flex items-center gap-2.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all min-h-[52px] w-full text-left',
                      item.matched
                        ? 'bg-emerald-50 text-emerald-400 border-2 border-emerald-200 opacity-60 cursor-default'
                        : isWrong
                        ? 'bg-red-50 text-red-600 border-2 border-red-300'
                        : isCorrectFlash
                        ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-400'
                        : isSelected
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-400 shadow-lg shadow-blue-500/20 scale-[1.03]'
                        : 'bg-blue-50 text-blue-700 border-2 border-blue-100 hover:border-blue-300 hover:shadow-md cursor-pointer',
                    ].join(' ')}
                    onClick={() => handleLeftClick(item.id)}
                    disabled={item.matched || !!matchState}
                    aria-label={`English: ${item.english}${item.matched ? ' (matched)' : ''}`}
                    aria-pressed={isSelected}
                    layout
                    initial={{ opacity: 0, x: -30 }}
                    animate={isWrong
                      ? { opacity: 1, x: [0, -6, 6, -6, 6, 0] }
                      : isCorrectFlash
                      ? { opacity: 1, x: 0, scale: [1, 1.05, 1] }
                      : { opacity: 1, x: 0 }
                    }
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {item.matched
                      ? <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                      : isWrong
                      ? <XCircle size={20} className="text-red-500 shrink-0" />
                      : <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xs font-bold shrink-0">
                          {item.english.charAt(0).toUpperCase()}
                        </div>
                    }
                    <span className="truncate">{item.english}</span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* RIGHT: Turkish words (orange cards) */}
          <div className="flex flex-col gap-2.5" role="list" aria-label="Turkish translations">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider text-center mb-1">T{'\u00FC'}rk{'\u00E7'}e</span>
            <AnimatePresence>
              {rightItems.map(item => {
                const isSelected = selectedRight === item.id;
                const isWrong = wrongPairIds?.r === item.id && matchState === 'wrong';
                const isCorrectFlash = matchState === 'correct' && isSelected;

                return (
                  <motion.button
                    key={`right-${item.id}`}
                    type="button"
                    role="listitem"
                    className={[
                      'relative flex items-center gap-2.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all min-h-[52px] w-full text-left',
                      item.matched
                        ? 'bg-emerald-50 text-emerald-400 border-2 border-emerald-200 opacity-60 cursor-default'
                        : isWrong
                        ? 'bg-red-50 text-red-600 border-2 border-red-300'
                        : isCorrectFlash
                        ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-400'
                        : isSelected
                        ? 'bg-orange-100 text-orange-700 border-2 border-orange-400 shadow-lg shadow-orange-500/20 scale-[1.03]'
                        : 'bg-orange-50 text-orange-700 border-2 border-orange-100 hover:border-orange-300 hover:shadow-md cursor-pointer',
                    ].join(' ')}
                    onClick={() => handleRightClick(item.id)}
                    disabled={item.matched || !!matchState}
                    aria-label={`Turkish: ${item.turkish}${item.matched ? ' (matched)' : ''}`}
                    aria-pressed={isSelected}
                    layout
                    initial={{ opacity: 0, x: 30 }}
                    animate={isWrong
                      ? { opacity: 1, x: [0, -6, 6, -6, 6, 0] }
                      : isCorrectFlash
                      ? { opacity: 1, x: 0, scale: [1, 1.05, 1] }
                      : { opacity: 1, x: 0 }
                    }
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {item.matched
                      ? <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                      : isWrong
                      ? <XCircle size={20} className="text-red-500 shrink-0" />
                      : <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs font-bold shrink-0">
                          {item.turkish.charAt(0).toUpperCase()}
                        </div>
                    }
                    <span className="truncate">{item.turkish}</span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
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
