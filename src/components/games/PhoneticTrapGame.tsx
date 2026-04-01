import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, PenTool, Zap, Star, Sparkles, Trophy, Check, RotateCcw, CheckCircle2, X } from 'lucide-react';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SFX } from '../../data/soundLibrary';
import { ConfettiRain } from '../ui/Celebrations';
import UnifiedMascot from '../UnifiedMascot';
import type { PhoneticTrap } from '../../data/turkishPhoneticTraps';

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
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  const selected = pairs.slice(0, Math.min(5, pairs.length));

  return selected.map((pair) => {
    const correctOpt = { word: pair.english, meaning: pair.meaning, meaningTr: pair.meaningTr, isCorrect: true };
    const wrongOpt = { word: pair.errorVersion, meaning: `"${pair.errorVersion}" — Turkish error`, meaningTr: `"${pair.errorVersion}" — Turkce hata`, isCorrect: false };
    const options = Math.random() > 0.5 ? [correctOpt, wrongOpt] : [wrongOpt, correctOpt];
    return { word: pair.meaning, meaning: pair.meaning, meaningTr: pair.meaningTr, options };
  });
}

const springBounce = { type: 'spring' as const, stiffness: 400, damping: 15 };
const springGentle = { type: 'spring' as const, stiffness: 300, damping: 25 };

// ---- Results Screen ----

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
    <div className="relative flex flex-col items-center py-6">
      {isPerfect && <ConfettiRain duration={3000} />}
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center gap-4"
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={springBounce}
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...springBounce, delay: 0.2 }}>
          <UnifiedMascot state={pct >= 60 ? 'celebrating' : 'waving'} size={100} />
        </motion.div>

        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...springBounce, delay: 0.3 }}>
          {pct >= 90 ? <Trophy size={48} className="text-amber-500" /> : pct >= 60 ? <Star size={48} className="text-amber-500 fill-amber-500" /> : <Check size={48} className="text-emerald-500" />}
        </motion.span>

        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-lg text-gray-500">{correctCount}/{totalCount} ({pct}%)</p>

        <div className="flex gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <motion.span key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...springBounce, delay: 0.55 + i * 0.12 }}>
              <Star size={32} className={i < stars ? 'text-indigo-500 fill-indigo-500' : 'text-gray-200'} />
            </motion.span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-full">
          <Sparkles size={14} /> +{correctCount * xpPerCorrect} XP
        </div>

        <div className="flex gap-3 w-full mt-2">
          <button type="button" onClick={onBack} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
            <ArrowLeft size={16} /> {t('games.dialogueBack')}
          </button>
          <button type="button" onClick={onPlayAgain} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors">
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
    <div className="flex flex-col gap-5">
      {/* Error description */}
      <div className="rounded-2xl border-2 p-5" style={{ borderColor: trap.color, backgroundColor: `${trap.color}08` }}>
        <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: trap.color }}>{t('games.phoneticCommonMistake')}</p>
        <p className="text-sm text-gray-700 font-medium">{trap.commonError}</p>
        <p className="text-xs text-gray-400 mt-1">{trap.commonErrorTr}</p>
      </div>

      {/* Mouth position diagram */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-gray-700">{t('games.phoneticHowToMake')}</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start bg-white rounded-2xl border border-gray-100 p-4">
          <div className="shrink-0">
            <MouthDiagram trapId={trap.id} color={trap.color} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-700">{trap.mouthPosition}</p>
            {isTr && <p className="text-xs text-gray-400">{trap.mouthPositionTr}</p>}
          </div>
        </div>
      </div>

      {/* Minimal pairs */}
      <div>
        <p className="text-sm font-bold text-gray-700 mb-3">{t('games.phoneticCorrectVsError')}</p>
        <div className="flex flex-col gap-2">
          {trap.minimalPairs.map((pair) => (
            <div key={pair.english} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 bg-white rounded-xl border border-gray-100 p-3">
              <div className="flex-1">
                <span className="font-bold text-sm" style={{ color: trap.color }}>{pair.english}</span>
                <span className="text-xs text-gray-400 ml-2">{pair.meaning}</span>
                {isTr && <span className="text-xs text-gray-300 ml-1">({pair.meaningTr})</span>}
              </div>
              <span className="text-xs text-gray-300 font-medium hidden sm:inline">vs</span>
              <div className="flex-1 sm:text-right">
                <span className="text-xs text-gray-300 font-medium sm:hidden mr-1">vs</span>
                <span className="font-medium text-sm text-red-400 line-through">{pair.errorVersion}</span>
                <span className="text-xs text-red-300 ml-2">{t('games.phoneticCommonError')}</span>
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
    <div className="flex flex-col gap-4">
      {/* Counter */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400">
          {t('games.phoneticQuestionOf').replace('{current}', String(exerciseIndex + 1)).replace('{total}', String(trap.exercises.length))}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: trap.color }} animate={{ width: `${progress}%` }} transition={springGentle} />
      </div>

      {/* Prompt card */}
      <motion.div
        key={exerciseIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springGentle}
        className="bg-white rounded-2xl border border-gray-100 p-5"
      >
        <p className="text-base font-medium text-gray-800">{exercise.prompt}</p>
        {isTr && <p className="text-sm text-gray-400 mt-1">{exercise.promptTr}</p>}
      </motion.div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {(exercise.options ?? []).map((option, idx) => {
          const isCorrectOption = selected !== null && option === exercise.correctOption;
          const isWrongSelection = selected !== null && option === selected && option !== exercise.correctOption;

          return (
            <motion.button
              type="button"
              key={option}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
              className={`
                flex items-center justify-between px-5 py-4 min-h-[56px] rounded-xl font-semibold text-base transition-all
                ${isCorrectOption ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-700' : ''}
                ${isWrongSelection ? 'bg-red-50 border-2 border-red-300 text-red-600' : ''}
                ${!isCorrectOption && !isWrongSelection ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50' : ''}
                disabled:cursor-not-allowed
              `}
              initial={{ opacity: 0, x: -15 }}
              animate={
                isCorrectOption
                  ? { opacity: 1, x: 0, scale: [1, 1.05, 1] }
                  : isWrongSelection
                    ? { opacity: 1, x: [0, -4, 4, -4, 0] }
                    : { opacity: 1, x: 0 }
              }
              transition={{ ...springGentle, delay: idx * 0.06 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>{option}</span>
              {isCorrectOption && <CheckCircle2 size={18} strokeWidth={2.5} className="text-emerald-500" />}
              {isWrongSelection && <X size={18} strokeWidth={2.5} className="text-red-500" />}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback + Next button */}
      {selected !== null && (
        <>
          <motion.div
            className={`text-center py-2 px-4 rounded-xl font-medium text-sm ${selected === exercise.correctOption ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springGentle}
          >
            {selected === exercise.correctOption
              ? t('games.phoneticCorrectRecognised').replace('{word}', exercise.correctOption ?? '')
              : t('games.phoneticDontConfuse').replace('{word}', String(exercise.correctOption ?? '')).replace('{sound}', trap.turkishEquivalent ?? '')}
          </motion.div>
          <motion.button
            type="button"
            onClick={handleNext}
            className="w-full py-3 min-h-[48px] rounded-xl text-white font-bold text-base transition-colors"
            style={{ backgroundColor: trap.color }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
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
        setTimeout(() => advance(newCount), 900);
      } else {
        SFX.wrong();
        setLastWasWrong(true);
        loseHeart();
        onWrongAnswer?.();
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
  const correctWord = question.options.find((o) => o.isCorrect)?.word ?? '';

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-base font-bold text-gray-800">{t('games.phoneticChallenge')}</h3>
        <p className="text-xs text-gray-400">{t('games.phoneticWhichSpelled')}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: trap.color }} animate={{ width: `${progress}%` }} transition={springGentle} />
      </div>

      <span className="text-xs text-gray-400 text-center">{questionIndex + 1} / {questions.length}</span>

      {/* Prompt: meaning */}
      <motion.div
        key={`prompt-${questionIndex}`}
        className="text-center py-4"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springBounce}
      >
        <span className="text-3xl font-black" style={{ color: trap.color }}>{question.meaning}</span>
      </motion.div>

      <p className="text-xs text-gray-400 text-center">{t('games.phoneticSelectSpelling')}</p>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {question.options.map((opt, idx) => {
          const isCorrectOption = selected !== null && opt.isCorrect;
          const isWrongSelection = selected !== null && selected === opt.word && !opt.isCorrect;

          return (
            <motion.button
              type="button"
              key={opt.word}
              onClick={() => handleSelect(opt.word, opt.isCorrect)}
              disabled={selected !== null}
              className={`
                flex items-center justify-center px-5 py-4 min-h-[56px] rounded-xl font-bold text-lg transition-all
                ${isCorrectOption ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-700' : ''}
                ${isWrongSelection ? 'bg-red-50 border-2 border-red-300 text-red-600' : ''}
                ${!isCorrectOption && !isWrongSelection ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50' : ''}
                disabled:cursor-not-allowed
              `}
              initial={{ opacity: 0, y: 15 }}
              animate={
                isCorrectOption
                  ? { opacity: 1, y: 0, scale: [1, 1.05, 1] }
                  : isWrongSelection
                    ? { opacity: 1, y: 0, x: [0, -4, 4, -4, 0] }
                    : { opacity: 1, y: 0 }
              }
              transition={{ ...springGentle, delay: idx * 0.06 }}
              whileTap={{ scale: 0.97 }}
            >
              {opt.word}
            </motion.button>
          );
        })}
      </div>

      {/* Pedagogical feedback */}
      {selected !== null && (
        <motion.div
          className={`text-center py-2 px-4 rounded-xl font-medium text-sm ${lastWasWrong ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springGentle}
        >
          {lastWasWrong
            ? t('games.phoneticCorrectSpelling').replace('{word}', correctWord)
            : t('games.phoneticCorrectAwareness').replace('{word}', correctWord)}
        </motion.div>
      )}
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

  const tabs: { id: TabId; icon: React.ReactNode; label: string; score: number | null }[] = [
    { id: 'learn', icon: <BookOpen size={16} />, label: t('games.phoneticLearn'), score: null },
    { id: 'practice', icon: <PenTool size={16} />, label: t('games.phoneticPractice'), score: practiceScore },
    { id: 'challenge', icon: <Zap size={16} />, label: t('games.phoneticChallenge'), score: challengeScore },
  ];

  return (
    <div className="flex flex-col gap-4 px-4 py-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          aria-label="Back to trap list"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black" style={{ color: trap.color }}>{trap.targetSoundIPA}</span>
          <span className="text-sm font-medium text-gray-500">{trap.targetSound}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-lg font-semibold text-sm transition-all
              ${activeTab === tab.id
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
              }
            `}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.score !== null && (
              <span className="text-xs text-emerald-500 font-bold">{tab.score}%</span>
            )}
          </button>
        ))}
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
