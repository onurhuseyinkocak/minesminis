import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, PenTool, Zap, Star, Sparkles, Trophy, Check, RotateCcw, CheckCircle2, X } from 'lucide-react';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SFX } from '../../data/soundLibrary';
import { Badge, ConfettiRain } from '../ui';
import UnifiedMascot from '../UnifiedMascot';
import type { PhoneticTrap } from '../../data/turkishPhoneticTraps';
import './PhoneticTrapGame.css';

// ---- Types ----

export interface PhoneticTrapGameProps {
  trap: PhoneticTrap;
  onComplete: (score: number) => void;
  onWrongAnswer?: () => void;
  onBack: () => void;
}

type TabId = 'learn' | 'practice' | 'challenge';

interface ChallengeQuestion {
  word: string;
  meaning: string;
  meaningTr: string;
  options: Array<{ word: string; meaning: string; meaningTr: string; isCorrect: boolean }>;
}

// ---- Mouth SVG diagrams ----

function MouthDiagramTH() {
  return (
    <svg width="90" height="72" viewBox="0 0 90 72" fill="none" aria-label="Mouth position for TH sound">
      <ellipse cx="45" cy="44" rx="38" ry="22" fill="#FBBCB0" stroke="#E57373" strokeWidth="1.5" />
      <path d="M 15 40 Q 30 32 45 36 Q 60 32 75 40" stroke="#C0504D" strokeWidth="1.5" fill="none" />
      <rect x="22" y="38" width="46" height="10" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      <rect x="22" y="50" width="46" height="10" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      <ellipse cx="45" cy="48" rx="20" ry="5" fill="#E57373" opacity="0.9" />
      <path d="M 62 48 L 74 48" stroke="#7C3AED" strokeWidth="2" markerEnd="url(#arr)" />
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#7C3AED" />
        </marker>
      </defs>
      <text x="45" y="14" textAnchor="middle" fontSize="10" fontWeight="700" fill="#7C3AED">tongue out</text>
    </svg>
  );
}

function MouthDiagramW() {
  return (
    <svg width="90" height="72" viewBox="0 0 90 72" fill="none" aria-label="Mouth position for W sound">
      <ellipse cx="45" cy="44" rx="22" ry="18" fill="#FBBCB0" stroke="#E57373" strokeWidth="1.5" />
      <ellipse cx="45" cy="46" rx="10" ry="8" fill="#4A1942" />
      <path d="M 26 38 Q 35 26 45 28 Q 55 26 64 38" stroke="#C0504D" strokeWidth="1.5" fill="none" />
      <text x="45" y="14" textAnchor="middle" fontSize="10" fontWeight="700" fill="#2563EB">round lips</text>
      <path d="M 23 44 L 10 44" stroke="#2563EB" strokeWidth="2" markerEnd="url(#arrW)" />
      <defs>
        <marker id="arrW" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
          <path d="M6,0 L0,3 L6,6 Z" fill="#2563EB" />
        </marker>
      </defs>
    </svg>
  );
}

function MouthDiagramR() {
  return (
    <svg width="90" height="72" viewBox="0 0 90 72" fill="none" aria-label="Mouth position for English R sound">
      <ellipse cx="45" cy="44" rx="34" ry="20" fill="#FBBCB0" stroke="#E57373" strokeWidth="1.5" />
      <rect x="24" y="38" width="42" height="9" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      <rect x="24" y="49" width="42" height="9" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      <path d="M 28 52 Q 40 44 55 50 Q 62 46 65 38" stroke="#E57373" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 60 36 Q 68 30 72 36" stroke="#0891B2" strokeWidth="1.5" fill="none" markerEnd="url(#arrR)" />
      <defs>
        <marker id="arrR" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#0891B2" />
        </marker>
      </defs>
      <text x="45" y="14" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0891B2">curl back</text>
    </svg>
  );
}

function MouthDiagramNG() {
  return (
    <svg width="90" height="72" viewBox="0 0 90 72" fill="none" aria-label="Mouth position for NG sound">
      <ellipse cx="45" cy="44" rx="36" ry="20" fill="#FBBCB0" stroke="#E57373" strokeWidth="1.5" />
      <rect x="22" y="38" width="46" height="8" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      <rect x="22" y="48" width="46" height="8" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      <path d="M 22 56 Q 36 52 55 46 Q 65 42 68 40" stroke="#E57373" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 28 36 Q 45 28 62 36" stroke="#FBBCB0" strokeWidth="8" fill="none" />
      <path d="M 28 36 Q 45 28 62 36" stroke="#E57373" strokeWidth="1.5" fill="none" />
      <circle cx="58" cy="38" r="4" fill="#BE185D" opacity="0.85" />
      <text x="45" y="14" textAnchor="middle" fontSize="10" fontWeight="700" fill="#BE185D">back tongue up</text>
    </svg>
  );
}

function MouthDiagramDefault({ color }: { color: string }) {
  return (
    <svg width="90" height="72" viewBox="0 0 90 72" fill="none" aria-label="Mouth diagram">
      <ellipse cx="45" cy="44" rx="36" ry="20" fill="#FBBCB0" stroke="#E57373" strokeWidth="1.5" />
      <rect x="22" y="38" width="46" height="8" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      <rect x="22" y="49" width="46" height="8" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      <ellipse cx="45" cy="56" rx="18" ry="6" fill="#E57373" opacity="0.8" />
      <text x="45" y="14" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>mouth position</text>
    </svg>
  );
}

function MouthDiagram({ trapId, color }: { trapId: string; color: string }) {
  if (trapId === 'th-voiceless' || trapId === 'th-voiced') return <MouthDiagramTH />;
  if (trapId === 'w-vs-v') return <MouthDiagramW />;
  if (trapId === 'english-r') return <MouthDiagramR />;
  if (trapId === 'ng-sound') return <MouthDiagramNG />;
  return <MouthDiagramDefault color={color} />;
}

// ---- Build challenge questions from minimal pairs ----

function buildChallengeQuestions(trap: PhoneticTrap): ChallengeQuestion[] {
  const pairs = [...trap.minimalPairs];
  // Shuffle so question order varies on replay
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  const selected = pairs.slice(0, Math.min(5, pairs.length));

  return selected.map((pair) => {
    // Correct option: the properly-spelled English word
    const correctOpt = {
      word: pair.english,
      meaning: pair.meaning,
      meaningTr: pair.meaningTr,
      isCorrect: true,
    };
    // Wrong option: the Turkish-interference error version with explicit label
    const wrongOpt = {
      word: pair.errorVersion,
      meaning: `"${pair.errorVersion}" — Turkish error`,
      meaningTr: `"${pair.errorVersion}" — Türkçe hata`,
      isCorrect: false,
    };

    // Randomise position so correct answer isn't always on the same side
    const options = Math.random() > 0.5
      ? [correctOpt, wrongOpt]
      : [wrongOpt, correctOpt];

    return {
      // Show the MEANING as prompt — student must pick the correctly-spelled word
      // This forces phonetic awareness instead of surface-level matching
      word: pair.meaning,
      meaning: pair.meaning,
      meaningTr: pair.meaningTr,
      options,
    };
  });
}

// ---- Results Screen (shared between Practice and Challenge tabs) ----

function TabResultsScreen({
  correctCount,
  totalCount,
  title,
  onPlayAgain,
  onBack,
  xpPerCorrect,
}: {
  correctCount: number;
  totalCount: number;
  title: string;
  onPlayAgain: () => void;
  onBack: () => void;
  xpPerCorrect: number;
}) {
  const { t } = useLanguage();
  const pct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
  const isPerfect = pct >= 90;

  return (
    <div className="ptg__panel" style={{ position: 'relative' }}>
      {isPerfect && <ConfettiRain duration={3000} />}
      <motion.div
        className="ptg__results"
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.div
          className="ptg__complete-mascot"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
        >
          <UnifiedMascot state={pct >= 60 ? 'celebrating' : 'waving'} size={100} />
        </motion.div>

        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.3 }}
        >
          {pct >= 90
            ? <Trophy size={48} color="var(--warning)" />
            : pct >= 60
              ? <Star size={48} fill="var(--warning)" color="var(--warning)" />
              : <Check size={48} color="var(--success)" />}
        </motion.span>

        <h3 className="ptg__results-title">{title}</h3>
        <p className="ptg__results-score">
          {correctCount}/{totalCount} ({pct}%)
        </p>

        <span className="game-stars">
          {Array.from({ length: 3 }, (_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.55 + i * 0.12 }}
            >
              <Star size={32} fill={i < stars ? 'var(--primary)' : 'none'} color={i < stars ? 'var(--primary)' : 'var(--border-strong, #ccc)'} />
            </motion.span>
          ))}
        </span>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.9 }}
        >
          <Badge variant="success" icon={<Sparkles size={14} />}>
            +{correctCount * xpPerCorrect} XP
          </Badge>
        </motion.div>

        <div className="ptg__results-actions">
          <button type="button" className="ptg__results-btn ptg__results-btn--secondary" onClick={onBack}>
            <ArrowLeft size={16} /> {t('games.dialogueBack')}
          </button>
          <button type="button" className="ptg__results-btn ptg__results-btn--primary" onClick={onPlayAgain}>
            <RotateCcw size={16} /> {t('games.dialoguePlayAgain')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ---- Learn Tab ----

function LearnTab({ trap }: { trap: PhoneticTrap }) {
  const { lang: language, t } = useLanguage();
  const isTr = language === 'tr';

  return (
    <div className="ptg__panel">
      {/* Error description */}
      <div className="ptg__error-card" style={{ '--trap-color': trap.color } as React.CSSProperties}>
        <p className="ptg__error-label">{t('games.phoneticCommonMistake')}</p>
        <p className="ptg__error-text">{trap.commonError}</p>
        <p className="ptg__error-text--tr">{trap.commonErrorTr}</p>
      </div>

      {/* Mouth position diagram */}
      <div className="ptg__mouth-section">
        <p className="ptg__mouth-title">{t('games.phoneticHowToMake')}</p>
        <div className="ptg__mouth-diagram">
          <div className="ptg__mouth-svg-wrap">
            <MouthDiagram trapId={trap.id} color={trap.color} />
          </div>
          <div className="ptg__mouth-instructions">
            <p className="ptg__mouth-en">{trap.mouthPosition}</p>
            {isTr && <p className="ptg__mouth-tr">{trap.mouthPositionTr}</p>}
          </div>
        </div>
      </div>

      {/* Minimal pairs */}
      <div>
        <p className="ptg__pairs-title">{t('games.phoneticCorrectVsError')}</p>
        <div className="ptg__pairs-list">
          {trap.minimalPairs.map((pair) => (
            <div key={pair.english} className="ptg__pair">
              <div className="ptg__pair-correct">
                <span className="ptg__pair-word" style={{ color: trap.color }}>{pair.english}</span>
                <span className="ptg__pair-meaning">{pair.meaning}</span>
                {isTr && <span className="ptg__pair-meaning">{pair.meaningTr}</span>}
              </div>
              <span className="ptg__pair-divider">vs</span>
              <div className="ptg__pair-wrong">
                <span className="ptg__pair-word--wrong">{pair.errorVersion}</span>
                <span className="ptg__pair-label">{t('games.phoneticCommonError')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Practice Tab ----

function PracticeTab({
  trap,
  onComplete,
  onWrongAnswer,
  loseHeart,
  onBack,
}: {
  trap: PhoneticTrap;
  onComplete: (score: number) => void;
  onWrongAnswer?: () => void;
  loseHeart: () => void;
  onBack: () => void;
}) {
  const { lang: language, t } = useLanguage();
  const isTr = language === 'tr';
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const exercise = trap.exercises[exerciseIndex];

  const handleSelect = useCallback(
    (option: string) => {
      if (selected !== null) return;
      setSelected(option);
      const isCorrect = option === exercise.correctOption;
      if (isCorrect) {
        SFX.correct();
        setCorrectCount((c) => c + 1);
      } else {
        SFX.wrong();
        loseHeart();
        onWrongAnswer?.();
      }
    },
    [selected, exercise.correctOption, onWrongAnswer, loseHeart],
  );

  const handleNext = useCallback(() => {
    if (exerciseIndex + 1 >= trap.exercises.length) {
      const score = Math.round((correctCount / trap.exercises.length) * 100);
      setDone(true);
      onComplete(score);
    } else {
      setExerciseIndex((i) => i + 1);
      setSelected(null);
    }
  }, [exerciseIndex, trap.exercises.length, correctCount, onComplete]);

  const handlePlayAgain = () => {
    setExerciseIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setDone(false);
  };

  if (done) {
    return (
      <TabResultsScreen
        correctCount={correctCount}
        totalCount={trap.exercises.length}
        title={t('games.phoneticPracticeDone')}
        onPlayAgain={handlePlayAgain}
        onBack={onBack}
        xpPerCorrect={10}
      />
    );
  }

  const progress = ((exerciseIndex) / trap.exercises.length) * 100;

  return (
    <div className="ptg__panel">
      <div className="ptg__exercise-counter">
        <span className="ptg__exercise-label">
          {t('games.phoneticQuestionOf').replace('{current}', String(exerciseIndex + 1)).replace('{total}', String(trap.exercises.length))}
        </span>
      </div>

      <div className="ptg__progress-bar-track">
        <div className="ptg__progress-bar-fill" style={{ width: `${progress}%`, ['--trap-color' as string]: trap.color }} />
      </div>

      <motion.div
        className="ptg__prompt-card"
        key={exerciseIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <p className="ptg__prompt-en">{exercise.prompt}</p>
        {isTr && <p className="ptg__prompt-tr">{exercise.promptTr}</p>}
      </motion.div>

      <div className="ptg__options">
        {(exercise.options ?? []).map((option, idx) => {
          let optClass = 'ptg__option';
          if (selected !== null) {
            if (option === exercise.correctOption) optClass += ' ptg__option--correct';
            else if (option === selected) optClass += ' ptg__option--wrong';
          }
          return (
            <motion.button
              type="button"
              key={option}
              className={optClass}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22, delay: idx * 0.06 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97, y: 1 }}
            >
              <span className="ptg__option-text">{option}</span>
              {selected !== null && option === exercise.correctOption && <CheckCircle2 size={18} strokeWidth={2.5} />}
              {selected !== null && option === selected && option !== exercise.correctOption && <X size={18} strokeWidth={2.5} />}
            </motion.button>
          );
        })}
      </div>

      {selected !== null && (
        <>
          <motion.div
            className={`ptg__feedback ${selected === exercise.correctOption ? 'ptg__feedback--correct' : 'ptg__feedback--wrong'}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {selected === exercise.correctOption
              ? t('games.phoneticCorrectRecognised').replace('{word}', exercise.correctOption ?? '')
              : t('games.phoneticDontConfuse').replace('{word}', String(exercise.correctOption ?? '')).replace('{sound}', trap.turkishEquivalent ?? '')}
          </motion.div>
          <motion.button
            type="button"
            className="ptg__next-btn"
            style={{ '--trap-color': trap.color } as React.CSSProperties}
            onClick={handleNext}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            {exerciseIndex + 1 >= trap.exercises.length
              ? t('games.phoneticFinishPractice')
              : t('games.phoneticNextQuestion')}
          </motion.button>
        </>
      )}
    </div>
  );
}

// ---- Challenge Tab ----

function ChallengeTab({
  trap,
  onComplete,
  onWrongAnswer,
  loseHeart,
  onBack,
}: {
  trap: PhoneticTrap;
  onComplete: (score: number) => void;
  onWrongAnswer?: () => void;
  loseHeart: () => void;
  onBack: () => void;
}) {
  const { t } = useLanguage();
  // isTr removed — replaced by t()
  const [questions] = useState<ChallengeQuestion[]>(() => buildChallengeQuestions(trap));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [lastWasWrong, setLastWasWrong] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const question = questions[questionIndex];

  const advance = useCallback(
    (newCount: number) => {
      if (questionIndex + 1 >= questions.length) {
        const score = Math.round((newCount / questions.length) * 100);
        setDone(true);
        onComplete(score);
      } else {
        setQuestionIndex((i) => i + 1);
        setSelected(null);
        setLastWasWrong(false);
      }
    },
    [questionIndex, questions.length, onComplete],
  );

  const handleSelect = useCallback(
    (word: string, isCorrect: boolean) => {
      if (selected !== null) return;
      setSelected(word);
      if (isCorrect) {
        SFX.correct();
        setLastWasWrong(false);
        const newCount = correctCount + 1;
        setCorrectCount(newCount);
        // Brief positive pause, then advance
        setTimeout(() => advance(newCount), 900);
      } else {
        SFX.wrong();
        setLastWasWrong(true);
        loseHeart();
        onWrongAnswer?.();
        // Keep feedback visible longer so learner reads the explanation
        setTimeout(() => advance(correctCount), 2200);
      }
    },
    [selected, correctCount, advance, loseHeart, onWrongAnswer],
  );

  const handlePlayAgain = () => {
    setQuestionIndex(0);
    setSelected(null);
    setLastWasWrong(false);
    setCorrectCount(0);
    setDone(false);
  };

  if (done) {
    return (
      <TabResultsScreen
        correctCount={correctCount}
        totalCount={questions.length}
        title={t('games.phoneticChallengeDone')}
        onPlayAgain={handlePlayAgain}
        onBack={onBack}
        xpPerCorrect={15}
      />
    );
  }

  const progress = (questionIndex / questions.length) * 100;
  // Find the correct option word to show in the error explanation
  const correctWord = question.options.find((o) => o.isCorrect)?.word ?? '';

  return (
    <div className="ptg__panel">
      <div className="ptg__challenge">
        <div className="ptg__challenge-header">
          <h3 className="ptg__challenge-title">{t('games.phoneticChallenge')}</h3>
          <p className="ptg__challenge-subtitle">{t('games.phoneticWhichSpelled')}</p>
        </div>

        <div className="ptg__progress-bar-track" style={{ width: '100%' }}>
          <div className="ptg__progress-bar-fill" style={{ width: `${progress}%`, ['--trap-color' as string]: trap.color }} />
        </div>

        <span className="ptg__challenge-score">
          {questionIndex + 1} / {questions.length}
        </span>

        {/* Prompt: meaning shown as cue — student picks the correctly-spelled word */}
        <motion.div
          key={`prompt-${questionIndex}`}
          className="ptg__challenge-word"
          style={{ color: trap.color }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {question.meaning}
        </motion.div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
          {t('games.phoneticSelectSpelling')}
        </p>

        <div className="ptg__challenge-options">
          {question.options.map((opt, idx) => {
            let cls = 'ptg__challenge-option';
            if (selected !== null) {
              if (opt.isCorrect) cls += ' ptg__challenge-option--correct';
              else if (selected === opt.word) cls += ' ptg__challenge-option--wrong';
            }
            return (
              <motion.button
                type="button"
                key={opt.word}
                className={cls}
                onClick={() => handleSelect(opt.word, opt.isCorrect)}
                disabled={selected !== null}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22, delay: idx * 0.06 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="ptg__challenge-option-word">{opt.word}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Pedagogical feedback — shown after answer */}
        {selected !== null && (
          <motion.div
            className={`ptg__feedback ${lastWasWrong ? 'ptg__feedback--wrong' : 'ptg__feedback--correct'}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {lastWasWrong
              ? t('games.phoneticCorrectSpelling').replace('{word}', correctWord)
              : t('games.phoneticCorrectAwareness').replace('{word}', correctWord)}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ---- Main Component ----

export default function PhoneticTrapGame({
  trap,
  onComplete,
  onWrongAnswer,
  onBack,
}: PhoneticTrapGameProps) {
  const { loseHeart } = useHearts();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>('learn');
  const [practiceScore, setPracticeScore] = useState<number | null>(null);
  const [challengeScore, setChallengeScore] = useState<number | null>(null);

  const handlePracticeComplete = useCallback(
    (score: number) => {
      setPracticeScore(score);
      if (challengeScore !== null) {
        onComplete(Math.round((score + challengeScore) / 2));
      }
    },
    [challengeScore, onComplete],
  );

  const handleChallengeComplete = useCallback(
    (score: number) => {
      setChallengeScore(score);
      const combined = practiceScore !== null
        ? Math.round((practiceScore + score) / 2)
        : score;
      onComplete(combined);
    },
    [practiceScore, onComplete],
  );

  const cssVars = { '--trap-color': trap.color } as React.CSSProperties;

  return (
    <div className="ptg" style={cssVars}>
      {/* Header */}
      <div className="ptg__header">
        <button type="button" className="ptg__back-btn" onClick={onBack} aria-label="Back to trap list">
          <ArrowLeft size={20} />
        </button>
        <div className="ptg__sound-badge">
          <span className="ptg__ipa" style={{ color: trap.color }}>{trap.targetSoundIPA}</span>
          <span className="ptg__sound-name">{trap.targetSound}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="ptg__tabs">
        <button
          type="button"
          className={`ptg__tab${activeTab === 'learn' ? ' ptg__tab--active' : ''}`}
          onClick={() => setActiveTab('learn')}
        >
          <span className="ptg__tab-icon"><BookOpen size={16} /></span>
          <span className="ptg__tab-label">{t('games.phoneticLearn')}</span>
        </button>
        <button
          type="button"
          className={`ptg__tab${activeTab === 'practice' ? ' ptg__tab--active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <span className="ptg__tab-icon"><PenTool size={16} /></span>
          <span className="ptg__tab-label">{t('games.phoneticPractice')}</span>
          {practiceScore !== null && <span style={{ fontSize: '0.65rem', color: 'var(--success, #10B981)' }}>{practiceScore}%</span>}
        </button>
        <button
          type="button"
          className={`ptg__tab${activeTab === 'challenge' ? ' ptg__tab--active' : ''}`}
          onClick={() => setActiveTab('challenge')}
        >
          <span className="ptg__tab-icon"><Zap size={16} /></span>
          <span className="ptg__tab-label">{t('games.phoneticChallenge')}</span>
          {challengeScore !== null && <span style={{ fontSize: '0.65rem', color: 'var(--success, #10B981)' }}>{challengeScore}%</span>}
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'learn' && <LearnTab trap={trap} />}
      {activeTab === 'practice' && (
        <PracticeTab
          trap={trap}
          onComplete={handlePracticeComplete}
          onWrongAnswer={onWrongAnswer}
          loseHeart={loseHeart}
          onBack={onBack}
        />
      )}
      {activeTab === 'challenge' && (
        <ChallengeTab
          trap={trap}
          onComplete={handleChallengeComplete}
          onWrongAnswer={onWrongAnswer}
          loseHeart={loseHeart}
          onBack={onBack}
        />
      )}
    </div>
  );
}
