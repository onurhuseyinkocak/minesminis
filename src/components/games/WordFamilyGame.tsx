import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Check, X, Star, Trophy, Sparkles, ArrowLeft, RotateCcw, ArrowRight } from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import { speak } from '../../services/ttsService';
import { SFX } from '../../data/soundLibrary';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';
import { WordIllustration } from '../WordIllustration';
import { getQuestionsCountForAge } from '../../services/ageGroupService';

// ── Types ──────────────────────────────────────────────────────────────────

export interface WordFamily {
  id: string;
  rime: string;
  rimeTr: string;
  onsets: string[];
  validWords: string[];
  invalidOnsets: string[];
  example: string;
}

export interface WordFamilyGameProps {
  families: WordFamily[];
  onComplete: (score: number, total: number) => void;
  onWrongAnswer?: () => void;
  ageGroup?: string;
}

// ── Feedback type ──────────────────────────────────────────────────────────

type TileFeedback = 'none' | 'valid' | 'invalid';

// ── Spring configs ──────────────────────────────────────────────────────────

const springBouncy = { type: 'spring' as const, stiffness: 300, damping: 18 };
const springGentle = { type: 'spring' as const, stiffness: 260, damping: 24 };
const shakeAnimation = {
  x: [0, -8, 8, -6, 6, -3, 3, 0],
  transition: { duration: 0.5 },
};

// ── Component ──────────────────────────────────────────────────────────────

export const WordFamilyGame: React.FC<WordFamilyGameProps> = ({
  families: rawFamilies,
  onComplete,
  onWrongAnswer,
  ageGroup,
}) => {
  const { t } = useLanguage();
  const { loseHeart } = useHearts();
  const age = ageGroup || '7-9';
  const questionsCount = getQuestionsCountForAge(age);
  // For age 3-5: show only 3 onset tiles at a time
  const maxOnsetsPerFamily = age === '3-5' ? 3 : undefined;
  const families = rawFamilies.slice(0, questionsCount).map(f =>
    maxOnsetsPerFamily ? { ...f, onsets: f.onsets.slice(0, maxOnsetsPerFamily) } : f
  );

  const [familyIndex, setFamilyIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [lastFormedWord, setLastFormedWord] = useState<string | null>(null);
  const [rimeFeedback, setRimeFeedback] = useState<TileFeedback>('none');
  const [invalidOnset, setInvalidOnset] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [completed, setCompleted] = useState(false);
  const [familyDone, setFamilyDone] = useState(false);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  const currentFamily = families[familyIndex];

  const handleNextFamily = useCallback(() => {
    const nextIndex = familyIndex + 1;
    if (nextIndex >= families.length) {
      setCompleted(true);
      SFX.celebration();
      autoCompleteTimeoutRef.current = setTimeout(() => onComplete(totalScore, families.length), 4000);
    } else {
      setFamilyIndex(nextIndex);
      setFoundWords([]);
      setLastFormedWord(null);
      setRimeFeedback('none');
      setInvalidOnset(null);
      setShowFeedback(null);
      setFamilyDone(false);
    }
  }, [familyIndex, families.length, onComplete, totalScore]);

  const handleOnsetTap = useCallback(
    (onset: string) => {
      if (!currentFamily || familyDone) return;

      const candidate = onset + currentFamily.rime.replace(/^-/, '');
      const isValid = currentFamily.validWords.includes(candidate);
      const alreadyFound = foundWords.includes(candidate);

      if (alreadyFound) return;

      setLastFormedWord(candidate);

      if (isValid) {
        setRimeFeedback('valid');
        setShowFeedback('correct');
        SFX.correct();
        speak(candidate, { lang: 'en-US', rate: 0.8, pitch: 1.1 });

        const nextFound = [...foundWords, candidate];
        setFoundWords(nextFound);
        setTotalScore((prev) => prev + 1);

        const allFound = nextFound.length >= currentFamily.validWords.length;

        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = setTimeout(() => {
          setRimeFeedback('none');
          setShowFeedback(null);
          setLastFormedWord(null);
          if (allFound) {
            setFamilyDone(true);
            SFX.levelUp();
          }
        }, 900);
      } else {
        setRimeFeedback('invalid');
        setInvalidOnset(onset);
        setShowFeedback('wrong');
        SFX.wrong();
        loseHeart();
        onWrongAnswer?.();

        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = setTimeout(() => {
          setRimeFeedback('none');
          setInvalidOnset(null);
          setShowFeedback(null);
          setLastFormedWord(null);
        }, 800);
      }
    },
    [currentFamily, foundWords, familyDone, loseHeart, onWrongAnswer],
  );

  const handlePlayAgain = useCallback(() => {
    if (autoCompleteTimeoutRef.current) {
      clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = null;
    }
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
    setFamilyIndex(0);
    setTotalScore(0);
    setFoundWords([]);
    setLastFormedWord(null);
    setRimeFeedback('none');
    setInvalidOnset(null);
    setShowFeedback(null);
    setCompleted(false);
    setFamilyDone(false);
  }, []);

  // ── Completion screen ─────────────────────────────────────────────────

  if (completed) {
    const pct = families.length > 0 ? Math.round((totalScore / families.length) * 100) : 0;
    const stars = pct >= 80 ? 3 : pct >= 50 ? 2 : 1;

    return (
      <div className="flex flex-col items-center justify-center gap-6 p-6 w-full max-w-lg mx-auto relative">
        <ConfettiRain duration={3500} />

        <motion.div
          className="flex flex-col items-center gap-5 p-8 rounded-3xl bg-white border-2 border-slate-100 shadow-xl w-full"
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <UnifiedMascot state="celebrating" size={120} />

          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
          >
            {pct >= 80 ? (
              <Trophy size={48} className="text-amber-500" />
            ) : pct >= 50 ? (
              <Star size={48} fill="#f59e0b" className="text-amber-500" />
            ) : (
              <Check size={48} className="text-emerald-500" />
            )}
          </motion.span>

          <h2 className="text-2xl font-extrabold text-slate-800">{t('games.greatJob')}</h2>
          <p className="text-lg font-bold text-violet-600">
            {t('games.wordsFoundCount').replace('{count}', String(totalScore))}
          </p>

          {/* Stars */}
          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.4 + i * 0.15 }}
              >
                <Star
                  size={36}
                  fill={i < stars ? '#f59e0b' : 'none'}
                  className={i < stars ? 'text-amber-500' : 'text-slate-300'}
                />
              </motion.span>
            ))}
          </div>

          {/* XP Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.9 }}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-100 rounded-full"
          >
            <Sparkles size={16} className="text-emerald-600" />
            <span className="font-bold text-emerald-700 text-sm">+{totalScore * 10} XP</span>
          </motion.div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => {
                if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
                onComplete(totalScore, families.length);
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200
                text-slate-700 font-bold text-sm transition-colors min-h-[48px]"
            >
              <ArrowLeft size={16} />
              {t('games.backToGames')}
            </button>
            <button
              type="button"
              onClick={handlePlayAgain}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl
                bg-gradient-to-b from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700
                text-white font-bold text-sm shadow-lg shadow-violet-200 transition-all min-h-[48px]"
            >
              <RotateCcw size={16} />
              {t('games.playAgain')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentFamily) return null;

  const progress = families.length > 0 ? (familyIndex / families.length) * 100 : 0;
  const rimeText = currentFamily.rime.replace(/^-/, '');

  const displayOnset = lastFormedWord
    ? lastFormedWord.slice(0, lastFormedWord.length - rimeText.length)
    : null;

  return (
    <div className="flex flex-col items-center gap-3 h-full max-h-full overflow-y-auto p-4 w-full max-w-xl mx-auto" role="application" aria-label="Word family builder game">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-extrabold text-slate-800">{t('games.wordFamilies')}</h2>
        <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-bold">
          {familyIndex + 1} / {families.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={springGentle}
        />
      </div>

      {/* Words found counter */}
      <p className="text-sm font-bold text-slate-500 text-center">
        {t('games.xWordsFoundDash').replace('{found}', String(foundWords.length)).replace('{total}', String(currentFamily.validWords.length))} &mdash; {currentFamily.rimeTr}
      </p>

      {/* Feedback banner */}
      <div aria-live="assertive" aria-atomic="true" className="min-h-[40px] w-full">
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              key={showFeedback}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                ${showFeedback === 'correct'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
                }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {showFeedback === 'correct' ? (
                <><Check size={16} /> {lastFormedWord ?? ''} &mdash; {t('games.amazing')}</>
              ) : (
                <><X size={16} /> {t('games.notAWord')} {t('games.tryAgainYouGotThis')}</>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`family-${familyIndex}`}
          className="w-full flex flex-col items-center gap-5"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={springGentle}
        >
          {/* Rime display card */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {t('games.wordEndingRime')}
            </p>

            {/* Word formation area */}
            <div className="flex items-center gap-1" aria-live="polite" aria-label="Current word being formed">
              {/* Onset slot */}
              {displayOnset ? (
                <motion.span
                  key={displayOnset}
                  className="text-3xl sm:text-4xl font-black text-blue-600"
                  initial={{ scale: 0.4, y: -20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={springBouncy}
                >
                  {displayOnset}
                </motion.span>
              ) : (
                <span className="text-3xl sm:text-4xl font-black text-slate-300">_</span>
              )}

              {/* Rime card */}
              <motion.div
                className={`px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-3xl sm:text-4xl font-black shadow-lg border-2 transition-all
                  ${rimeFeedback === 'valid'
                    ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-emerald-300 shadow-emerald-200'
                    : rimeFeedback === 'invalid'
                      ? 'bg-gradient-to-b from-red-400 to-red-600 text-white border-red-300 shadow-red-200'
                      : 'bg-gradient-to-b from-violet-500 to-purple-700 text-white border-violet-300 shadow-violet-200'
                  }`}
                animate={rimeFeedback === 'invalid' ? shakeAnimation : {}}
              >
                {rimeText}
              </motion.div>
            </div>

            {/* Illustration for valid word */}
            <div className="min-h-[80px] flex items-center justify-center">
              <AnimatePresence>
                {rimeFeedback === 'valid' && lastFormedWord && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={springBouncy}
                    className="flex flex-col items-center gap-1"
                  >
                    <WordIllustration word={lastFormedWord} size={72} />
                    <span className="text-sm font-bold text-emerald-600">{lastFormedWord}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Speaker button */}
            {lastFormedWord && rimeFeedback === 'valid' && (
              <button
                type="button"
                onClick={() => speak(lastFormedWord, { lang: 'en-US', rate: 0.85 })}
                className="w-10 h-10 rounded-full bg-violet-100 hover:bg-violet-200 flex items-center justify-center transition-colors"
                aria-label={`Listen to ${lastFormedWord}`}
              >
                <Volume2 size={20} className="text-violet-600" />
              </button>
            )}
          </div>

          {/* Onset tiles */}
          <div className="flex flex-col items-center gap-2 w-full">
            <p className="text-sm font-bold text-slate-500">{t('games.tapLetterToMakeWord')}</p>
            <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label="Letter tiles">
              {currentFamily.onsets.map((onset, idx) => {
                const candidate = onset + rimeText;
                const isFound = foundWords.includes(candidate);
                const isInvalid = invalidOnset === onset;
                const isActive = lastFormedWord?.startsWith(onset) && rimeFeedback === 'valid';

                const bgClass = isFound
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-600'
                  : isInvalid
                    ? 'bg-red-100 border-red-400 text-red-600'
                    : isActive
                      ? 'bg-blue-100 border-blue-400 text-blue-700 ring-2 ring-blue-300'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-violet-300 hover:bg-violet-50';

                return (
                  <motion.button
                    key={onset}
                    type="button"
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 shadow-sm flex items-center justify-center
                      text-lg sm:text-xl font-extrabold disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${bgClass}`}
                    onClick={() => handleOnsetTap(onset)}
                    disabled={isFound || familyDone}
                    aria-label={`Letter ${onset}`}
                    aria-pressed={isFound}
                    initial={{ opacity: 0, y: 20, scale: 0.7 }}
                    animate={isInvalid ? shakeAnimation : { opacity: 1, y: 0, scale: 1 }}
                    transition={{ ...springBouncy, delay: idx * 0.06 }}
                    whileTap={{ scale: 0.88 }}
                  >
                    {onset}
                    {isFound && (
                      <motion.div
                        className="absolute"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={springBouncy}
                      >
                        <Check size={14} className="text-emerald-500" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Found words */}
          {foundWords.length > 0 && (
            <div className="flex flex-col items-center gap-2 w-full">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t('games.wordsFoundLabel')}
              </p>
              <div className="flex flex-wrap gap-2 justify-center" aria-label="Found words">
                {foundWords.map((w) => (
                  <motion.span
                    key={w}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-emerald-50 to-emerald-100
                      border border-emerald-200 text-emerald-700 font-bold text-sm shadow-sm
                      flex items-center gap-1.5"
                    initial={{ scale: 0.5, rotate: -6 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={springBouncy}
                  >
                    <Check size={12} className="text-emerald-500" />
                    {w}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Family complete — next button */}
          {familyDone && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <UnifiedMascot state="celebrating" size={64} />
              <button
                type="button"
                onClick={handleNextFamily}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl
                  bg-gradient-to-b from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700
                  text-white font-bold text-sm shadow-lg shadow-violet-200 transition-all min-h-[48px]"
              >
                {familyIndex + 1 < families.length ? t('games.nextFamily') : t('games.finishExcl')}
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {!familyDone && (
            <UnifiedMascot
              state={showFeedback === 'correct' ? 'celebrating' : 'idle'}
              size={56}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

WordFamilyGame.displayName = 'WordFamilyGame';
