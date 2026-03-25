import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Check } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { speak } from '../../services/ttsService';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';
import { WordIllustration } from '../WordIllustration';
import './WordFamilyGame.css';

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
}

// ── Feedback type ──────────────────────────────────────────────────────────

type TileFeedback = 'none' | 'valid' | 'invalid';

// ── Component ──────────────────────────────────────────────────────────────

export const WordFamilyGame: React.FC<WordFamilyGameProps> = ({
  families,
  onComplete,
  onWrongAnswer,
}) => {
  const { t } = useLanguage();
  const { loseHeart } = useHearts();

  const [familyIndex, setFamilyIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [lastFormedWord, setLastFormedWord] = useState<string | null>(null);
  const [rimeFeedback, setRimeFeedback] = useState<TileFeedback>('none');
  const [invalidOnset, setInvalidOnset] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [completed, setCompleted] = useState(false);
  const [familyDone, setFamilyDone] = useState(false);

  const currentFamily = families[familyIndex];

  const handleNextFamily = useCallback(() => {
    const nextIndex = familyIndex + 1;
    if (nextIndex >= families.length) {
      setCompleted(true);
      onComplete(totalScore, families.length);
      SFX.celebration();
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

        setTimeout(() => {
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

        setTimeout(() => {
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
      <div className="wfg">
        <Card variant="elevated" padding="xl" className="wfg__completion">
          <motion.div
            className="wfg__completion-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <UnifiedMascot state="celebrating" size={120} />

            <span>
              {pct >= 80 ? (
                <Trophy size={48} color="var(--primary, #E8A317)" />
              ) : pct >= 50 ? (
                <Star size={48} fill="var(--primary, #E8A317)" color="var(--primary, #E8A317)" />
              ) : (
                <Check size={48} color="var(--mimi-green, #4caf50)" />
              )}
            </span>

            <h2 className="wfg__completion-title">{t('games.greatJob')}</h2>
            <p className="wfg__completion-score">
              {t('games.wordsFoundCount').replace('{count}', String(totalScore))}
            </p>

            <span className="game-stars">
              {Array.from({ length: 3 }, (_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < stars ? 'var(--primary, #E8A317)' : 'none'}
                  color={i < stars ? 'var(--primary, #E8A317)' : '#ccc'}
                />
              ))}
            </span>

            <Badge variant="success" icon={<Sparkles size={14} />}>
              +{totalScore * 10} XP
            </Badge>

            <div className="wfg__completion-actions">
              <button
                type="button"
                className="wfg__completion-btn wfg__completion-btn--secondary"
                onClick={() => onComplete(totalScore, families.length)}
              >
                {t('games.backToGames')}
              </button>
              <button
                type="button"
                className="wfg__completion-btn wfg__completion-btn--primary"
                onClick={handlePlayAgain}
              >
                {t('games.playAgain')}
              </button>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!currentFamily) return null;

  const progress = families.length > 0 ? (familyIndex / families.length) * 100 : 0;
  const rimeText = currentFamily.rime.replace(/^-/, '');

  // Determine onset to display (from last tapped, if active)
  const displayOnset = lastFormedWord
    ? lastFormedWord.slice(0, lastFormedWord.length - rimeText.length)
    : null;

  return (
    <div className="wfg" role="application" aria-label="Word family builder game">
      {/* Header */}
      <div className="wfg__header">
        <h2 className="wfg__title">{t('games.wordFamilies')}</h2>
        <Badge variant="info">
          {familyIndex + 1} / {families.length}
        </Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      {/* Family info + rime tip */}
      <p className="wfg__progress-text">
        {t('games.xWordsFoundDash').replace('{found}', String(foundWords.length)).replace('{total}', String(currentFamily.validWords.length))} &mdash; {currentFamily.rimeTr}
      </p>

      {/* Feedback banner */}
      <div aria-live="assertive" aria-atomic="true" style={{ minHeight: '2.5rem', width: '100%' }}>
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              key={showFeedback}
              className={`wfg__feedback wfg__feedback--${showFeedback}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {showFeedback === 'correct'
                ? `${lastFormedWord ?? ''} — ${t('games.amazing')}`
                : `${t('games.notAWord')} ${t('games.tryAgainYouGotThis')}`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`family-${familyIndex}`}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-lg)' }}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        >
          {/* Word snap area */}
          <div className="wfg__rime-area">
            <p className="wfg__rime-label">{t('games.wordEndingRime')}</p>

            <div className="wfg__word-snap" aria-live="polite" aria-label="Current word being formed">
              {/* Onset slot */}
              {displayOnset ? (
                <motion.span
                  key={displayOnset}
                  className="wfg__snap-onset"
                  initial={{ scale: 0.4, y: -20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 350 }}
                >
                  {displayOnset}
                </motion.span>
              ) : (
                <span className="wfg__snap-onset--placeholder">_</span>
              )}

              {/* Rime */}
              <motion.span
                className={[
                  'wfg__snap-rime',
                  rimeFeedback === 'invalid' && 'wfg__snap-rime--shake',
                  rimeFeedback === 'valid' && 'wfg__snap-rime--valid',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {rimeText}
              </motion.span>
            </div>

            {/* Illustration for valid word */}
            <div className="wfg__illustration">
              <AnimatePresence>
                {rimeFeedback === 'valid' && lastFormedWord && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  >
                    <WordIllustration word={lastFormedWord} size={72} />
                    <span className="wfg__word-formed">{lastFormedWord}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Onset tiles */}
          <p className="wfg__onsets-label">{t('games.tapLetterToMakeWord')}</p>
          <div className="wfg__onsets" role="group" aria-label="Letter tiles">
            {currentFamily.onsets.map((onset) => {
              const candidate = onset + rimeText;
              const isFound = foundWords.includes(candidate);
              const isInvalid = invalidOnset === onset;
              const isActive = lastFormedWord?.startsWith(onset) && rimeFeedback === 'valid';

              return (
                <motion.button
                  key={onset}
                  type="button"
                  className={[
                    'wfg__onset-tile',
                    isFound && 'wfg__onset-tile--used',
                    isInvalid && 'wfg__onset-tile--invalid',
                    isActive && 'wfg__onset-tile--active',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleOnsetTap(onset)}
                  disabled={isFound || familyDone}
                  aria-label={`Letter ${onset}`}
                  aria-pressed={isFound}
                  whileTap={{ scale: 0.88 }}
                >
                  {onset}
                </motion.button>
              );
            })}
          </div>

          {/* Found words */}
          {foundWords.length > 0 && (
            <>
              <p className="wfg__found-label">{t('games.wordsFoundLabel')}</p>
              <div className="wfg__found-words" aria-label="Found words">
                {foundWords.map((w) => (
                  <motion.span
                    key={w}
                    className="wfg__found-word"
                    initial={{ scale: 0.5, rotate: -6 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {w}
                  </motion.span>
                ))}
              </div>
            </>
          )}

          {/* Family complete — next button */}
          {familyDone && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}
            >
              <UnifiedMascot state="celebrating" size={64} />
              <button
                type="button"
                className="wfg__next-btn"
                onClick={handleNextFamily}
              >
                {familyIndex + 1 < families.length ? t('games.nextFamily') : t('games.finishExcl')}
              </button>
            </motion.div>
          )}

          {!familyDone && (
            <UnifiedMascot
              state={showFeedback === 'correct' ? 'celebrating' : 'idle'}
              size={52}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

WordFamilyGame.displayName = 'WordFamilyGame';
