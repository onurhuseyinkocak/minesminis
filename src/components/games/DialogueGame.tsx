import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Check, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';
import { ConfettiRain } from '../ui/Celebrations';
import UnifiedMascot from '../UnifiedMascot';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SFX } from '../../data/soundLibrary';

export interface DialogueLine {
  speaker: 'mimi' | 'child';
  text: string;
  textTr?: string;
  options?: DialogueOption[];
}

export interface DialogueOption {
  id: string;
  text: string;
  textTr?: string;
  correct: boolean;
  feedback?: string;
}

export interface DialogueGameProps {
  lines: DialogueLine[];
  onComplete: (score: number, totalQuestions: number) => void;
  onWrongAnswer?: () => void;
  ageGroup?: string;
}

type OptionState = 'idle' | 'correct' | 'wrong';

interface AnsweredOption {
  lineIndex: number;
  optionId: string;
  correct: boolean;
}

const springBounce = { type: 'spring' as const, stiffness: 400, damping: 15 };
const springGentle = { type: 'spring' as const, stiffness: 300, damping: 25 };

export function DialogueGame({ lines: rawLines, onComplete, onWrongAnswer, ageGroup }: DialogueGameProps) {
  const age = ageGroup || '7-9';
  // For age 3-5: only 2 dialogue options instead of 3
  const lines = age === '3-5'
    ? rawLines.map(line => ({
        ...line,
        options: line.options ? line.options.slice(0, 2) : line.options,
      }))
    : rawLines;
  const { lang, t } = useLanguage();
  const { loseHeart } = useHearts();

  const [visibleCount, setVisibleCount] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [optionState, setOptionState] = useState<Record<string, OptionState>>({});
  const [answered, setAnswered] = useState<AnsweredOption[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [mascotState, setMascotState] = useState<'idle' | 'talk' | 'celebrating' | 'waving'>('waving');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
    };
  }, []);

  const questionLines = lines.filter((l) => l.speaker === 'child' && l.options && l.options.length > 0);
  const totalQuestions = questionLines.length;

  useEffect(() => {
    if (completed) return;
    if (visibleCount >= lines.length) {
      const correctCount = answered.filter((a) => a.correct).length;
      setCompleted(true);
      setMascotState('celebrating');
      autoCompleteTimeoutRef.current = setTimeout(() => onComplete(correctCount, totalQuestions), 4000);
      return;
    }
    const nextLine = lines[visibleCount];
    if (nextLine.speaker === 'child' && nextLine.options && nextLine.options.length > 0) {
      setCurrentQuestionIndex(visibleCount);
      setMascotState('idle');
      return;
    }
    setMascotState('talk');
    advanceTimerRef.current = setTimeout(() => {
      setVisibleCount((c) => c + 1);
      setMascotState('idle');
    }, 300);
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, [visibleCount, completed, lines, answered, totalQuestions, onComplete]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleCount, currentQuestionIndex]);

  const handleOptionSelect = useCallback(
    (lineIndex: number, option: DialogueOption) => {
      if (isAdvancing) return;

      if (option.correct) {
        setOptionState((prev) => ({ ...prev, [option.id]: 'correct' }));
        SFX.correct();
        setMascotState('celebrating');
        setAnswered((prev) => [...prev, { lineIndex, optionId: option.id, correct: true }]);

        setIsAdvancing(true);
        advanceTimerRef.current = setTimeout(() => {
          setCurrentQuestionIndex(null);
          setOptionState({});
          setVisibleCount(lineIndex + 1);
          setIsAdvancing(false);
          setMascotState('talk');
        }, 900);
      } else {
        const currentLine = lines[lineIndex];
        const correctOption = currentLine?.options?.find((o) => o.correct);
        setOptionState((prev) => ({
          ...prev,
          [option.id]: 'wrong',
          ...(correctOption ? { [correctOption.id]: 'correct' } : {}),
        }));
        SFX.wrong();
        setMascotState('idle');
        onWrongAnswer?.();
        loseHeart();

        advanceTimerRef.current = setTimeout(() => {
          setOptionState({});
        }, 1200);
      }
    },
    [isAdvancing, lines, onWrongAnswer, loseHeart],
  );

  const correctCount = answered.filter((a) => a.correct).length;

  const handlePlayAgain = () => {
    if (autoCompleteTimeoutRef.current) {
      clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = null;
    }
    setVisibleCount(0);
    setCurrentQuestionIndex(null);
    setOptionState({});
    setAnswered([]);
    setCompleted(false);
    setIsAdvancing(false);
    setMascotState('waving');
  };

  // Completion screen
  if (completed) {
    const pct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="relative flex flex-col items-center px-4 py-6">
        {pct >= 90 && <ConfettiRain duration={3000} />}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={springBounce}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center gap-5"
        >
          <UnifiedMascot id="mimi_dragon" state="celebrating" size={120} />

          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...springBounce, delay: 0.2 }}>
            {pct >= 90 ? <Trophy size={48} className="text-indigo-500" /> : pct >= 60 ? <Star size={48} className="text-indigo-500 fill-indigo-500" /> : <Check size={48} className="text-emerald-500" />}
          </motion.span>

          <h2 className="text-2xl font-bold text-gray-800">{t('games.dialogueAwesome')}</h2>
          <p className="text-3xl font-black text-gray-700">{correctCount} / {totalQuestions}</p>
          <p className="text-sm text-gray-400">{t('games.dialogueCorrectAnswers')}</p>

          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...springBounce, delay: 0.4 + i * 0.15 }}>
                <Star size={32} className={i < stars ? 'text-indigo-500 fill-indigo-500' : 'text-gray-200'} />
              </motion.span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-full">
            <Sparkles size={14} /> +{correctCount * 10} XP
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button type="button" onClick={() => { if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current); onComplete(correctCount, totalQuestions); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
              <ArrowRight size={16} /> {t('games.dialogueBack')}
            </button>
            <button type="button" onClick={handlePlayAgain} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors">
              <RotateCcw size={16} /> {t('games.dialoguePlayAgain')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentLine = currentQuestionIndex !== null ? lines[currentQuestionIndex] : null;
  const celebratingMascot = mascotState === 'celebrating';
  const dialogueProgress = totalQuestions > 0 ? (answered.filter((a) => a.correct).length / totalQuestions) * 100 : 0;

  return (
    <div className="flex flex-col gap-2 px-4 py-3 max-w-lg mx-auto h-full max-h-full overflow-hidden">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div className="h-full bg-emerald-400 rounded-full" animate={{ width: `${dialogueProgress}%` }} transition={springGentle} />
      </div>

      {/* Chat feed */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 py-2 min-h-[200px] max-h-[400px]">
        <AnimatePresence initial={false}>
          {lines.slice(0, visibleCount).map((line, idx) => {
            if (line.speaker === 'mimi') {
              return (
                <motion.div
                  key={`mimi-${idx}`}
                  className="flex items-end gap-2"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="shrink-0">
                    <UnifiedMascot id="mimi_dragon" state="idle" size={40} />
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]">
                    <p className="text-sm font-medium text-gray-800">{line.text}</p>
                    {line.textTr && lang === 'tr' && (
                      <p className="text-xs text-gray-400 mt-1">{line.textTr}</p>
                    )}
                  </div>
                </motion.div>
              );
            }

            const answer = answered.find((a) => a.lineIndex === idx);
            if (!answer) return null;
            const chosenOption = line.options?.find((o) => o.id === answer.optionId);
            if (!chosenOption) return null;

            return (
              <motion.div
                key={`child-${idx}`}
                className="flex justify-end"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                  <p className="text-sm font-medium text-gray-800">{chosenOption.text}</p>
                  {chosenOption.textTr && lang === 'tr' && (
                    <p className="text-xs text-gray-400 mt-1">{chosenOption.textTr}</p>
                  )}
                  {chosenOption.feedback && (
                    <p className="text-xs text-emerald-600 mt-1 italic">{chosenOption.feedback}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Mimi thinking indicator */}
        {currentQuestionIndex !== null && (
          <motion.div
            className="flex items-end gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div className="shrink-0">
              <UnifiedMascot
                id="mimi_dragon"
                state={celebratingMascot ? 'celebrating' : 'idle'}
                size={40}
              />
            </div>
            <div className="flex gap-1.5 bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
              <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} />
              <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} />
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Options */}
      <AnimatePresence>
        {currentLine && currentLine.options && (
          <motion.div
            className="flex flex-col gap-2 pt-3 border-t border-gray-100"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs font-medium text-gray-400 text-center mb-1">
              {t('games.dialogueWhatDoYouSay')}
            </p>
            {currentLine.options.map((option, idx) => {
              const state = optionState[option.id] ?? 'idle';
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionSelect(currentQuestionIndex!, option)}
                  disabled={isAdvancing}
                  className={`
                    flex items-center gap-2 px-4 py-3 min-h-[48px] rounded-xl font-medium text-left transition-all
                    ${state === 'correct' ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-700' : ''}
                    ${state === 'wrong' ? 'bg-red-50 border-2 border-red-300 text-red-600' : ''}
                    ${state === 'idle' ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50' : ''}
                    disabled:opacity-50
                  `}
                  initial={{ opacity: 0, y: 12 }}
                  animate={
                    state === 'wrong'
                      ? { opacity: 1, y: 0, x: [-6, 6, -5, 5, -3, 3, 0] }
                      : { opacity: 1, y: 0, x: 0 }
                  }
                  transition={{ ...springGentle, delay: idx * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {state === 'correct' && <CheckCircle size={18} className="shrink-0 text-emerald-500" />}
                  <span>
                    {lang === 'tr' && option.textTr ? option.textTr : option.text}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex gap-1.5 justify-center py-2">
        {questionLines.map((qLine, i) => {
          const lineIdx = lines.indexOf(qLine);
          const isDone = answered.some((a) => a.lineIndex === lineIdx && a.correct);
          const isCurrent = currentQuestionIndex === lineIdx;
          return (
            <span
              key={i}
              className={`
                w-2.5 h-2.5 rounded-full transition-all
                ${isDone ? 'bg-emerald-400 scale-110' : isCurrent ? 'bg-indigo-400 animate-pulse' : 'bg-gray-200'}
              `}
            />
          );
        })}
      </div>
    </div>
  );
}

DialogueGame.displayName = 'DialogueGame';
