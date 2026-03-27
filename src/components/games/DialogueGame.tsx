import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Check, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../ui';
import UnifiedMascot from '../UnifiedMascot';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SFX } from '../../data/soundLibrary';
import './DialogueGame.css';

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
}

type OptionState = 'idle' | 'correct' | 'wrong';

interface AnsweredOption {
  lineIndex: number;
  optionId: string;
  correct: boolean;
}

export function DialogueGame({ lines, onComplete, onWrongAnswer }: DialogueGameProps) {
  const { lang } = useLanguage();
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

  const questionLines = lines.filter((l) => l.speaker === 'child' && l.options && l.options.length > 0);
  const totalQuestions = questionLines.length;

  // Advance visible lines one by one with 300ms delay
  useEffect(() => {
    if (completed) return;

    if (visibleCount >= lines.length) {
      const correctCount = answered.filter((a) => a.correct).length;
      setCompleted(true);
      setMascotState('celebrating');
      onComplete(correctCount, totalQuestions);
      return;
    }

    const nextLine = lines[visibleCount];

    // Pause at child question lines and wait for user input
    if (nextLine.speaker === 'child' && nextLine.options && nextLine.options.length > 0) {
      setCurrentQuestionIndex(visibleCount);
      setMascotState('idle');
      return;
    }

    // Animate in the next mimi line after 300ms
    setMascotState('talk');
    advanceTimerRef.current = setTimeout(() => {
      setVisibleCount((c) => c + 1);
      setMascotState('idle');
    }, 300);

    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, [visibleCount, completed, lines, answered, totalQuestions, onComplete]);

  // Scroll to bottom when new messages appear
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
        setOptionState((prev) => ({ ...prev, [option.id]: 'wrong' }));
        SFX.wrong();
        setMascotState('idle');
        onWrongAnswer?.();
        loseHeart();

        advanceTimerRef.current = setTimeout(() => {
          setOptionState({});
        }, 700);
      }
    },
    [isAdvancing, onWrongAnswer, loseHeart],
  );

  const correctCount = answered.filter((a) => a.correct).length;

  const getOptionClass = (optionId: string): string => {
    const state = optionState[optionId] ?? 'idle';
    return `dialogue-game__option dialogue-game__option--${state}`;
  };

  const handlePlayAgain = () => {
    setVisibleCount(0);
    setCurrentQuestionIndex(null);
    setOptionState({});
    setAnswered([]);
    setCompleted(false);
    setIsAdvancing(false);
    setMascotState('waving');
  };

  if (completed) {
    const pct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="dialogue-game">
        <Card variant="elevated" padding="xl" className="dialogue-game__summary">
          <motion.div
            className="dialogue-game__summary-content"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <UnifiedMascot id="mimi_dragon" state="celebrating" size={120} />

            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            >
              {pct >= 90 ? (
                <Trophy size={48} color="var(--primary, #E8A317)" />
              ) : pct >= 60 ? (
                <Star size={48} fill="var(--primary, #E8A317)" color="var(--primary, #E8A317)" />
              ) : (
                <Check size={48} color="var(--mimi-green, #4caf50)" />
              )}
            </motion.span>

            <h2 className="dialogue-game__summary-title">
              {lang === 'tr' ? 'Harika!' : 'Awesome!'}
            </h2>
            <p className="dialogue-game__summary-score">
              {correctCount} / {totalQuestions}
            </p>
            <p className="dialogue-game__summary-label">
              {lang === 'tr' ? 'Doğru cevap' : 'Correct answers'}
            </p>

            <span className="game-stars">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.4 + i * 0.15 }}
                >
                  <Star
                    size={32}
                    fill={i < stars ? 'var(--primary, #E8A317)' : 'none'}
                    color={i < stars ? 'var(--primary, #E8A317)' : '#ccc'}
                  />
                </motion.span>
              ))}
            </span>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.9 }}
            >
              <Badge variant="success" icon={<Sparkles size={14} />}>
                +{correctCount * 10} XP
              </Badge>
            </motion.div>

            <div className="dialogue-game__summary-actions">
              <button
                type="button"
                className="dialogue-game__summary-btn dialogue-game__summary-btn--secondary"
                onClick={() => onComplete(correctCount, totalQuestions)}
              >
                <ArrowRight size={16} />
                {lang === 'tr' ? 'Geri Don' : 'Back'}
              </button>
              <button
                type="button"
                className="dialogue-game__summary-btn dialogue-game__summary-btn--primary"
                onClick={handlePlayAgain}
              >
                <RotateCcw size={16} />
                {lang === 'tr' ? 'Tekrar Oyna' : 'Play Again'}
              </button>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  const currentLine = currentQuestionIndex !== null ? lines[currentQuestionIndex] : null;
  const celebratingMascot = mascotState === 'celebrating';

  const dialogueProgress = totalQuestions > 0 ? (answered.filter((a) => a.correct).length / totalQuestions) * 100 : 0;

  return (
    <div className="dialogue-game">
      <ProgressBar value={dialogueProgress} variant="success" size="sm" animated />
      {/* Chat feed */}
      <div className="dialogue-game__feed">
        <AnimatePresence initial={false}>
          {lines.slice(0, visibleCount).map((line, idx) => {
            if (line.speaker === 'mimi') {
              return (
                <motion.div
                  key={`mimi-${idx}`}
                  className="dialogue-game__row dialogue-game__row--mimi"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="dialogue-game__avatar">
                    <UnifiedMascot id="mimi_dragon" state="idle" size={48} />
                  </div>
                  <div className="dialogue-game__bubble dialogue-game__bubble--mimi">
                    <p className="dialogue-game__bubble-text">{line.text}</p>
                    {line.textTr && lang === 'tr' && (
                      <p className="dialogue-game__bubble-translation">{line.textTr}</p>
                    )}
                  </div>
                </motion.div>
              );
            }

            // Answered child line
            const answer = answered.find((a) => a.lineIndex === idx);
            if (!answer) return null;
            const chosenOption = line.options?.find((o) => o.id === answer.optionId);
            if (!chosenOption) return null;

            return (
              <motion.div
                key={`child-${idx}`}
                className="dialogue-game__row dialogue-game__row--child"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="dialogue-game__bubble dialogue-game__bubble--child">
                  <p className="dialogue-game__bubble-text">{chosenOption.text}</p>
                  {chosenOption.textTr && lang === 'tr' && (
                    <p className="dialogue-game__bubble-translation">{chosenOption.textTr}</p>
                  )}
                  {chosenOption.feedback && (
                    <p className="dialogue-game__bubble-feedback">{chosenOption.feedback}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Mimi thinking indicator while waiting for child response */}
        {currentQuestionIndex !== null && (
          <motion.div
            className="dialogue-game__row dialogue-game__row--mimi"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div className="dialogue-game__avatar">
              <UnifiedMascot
                id="mimi_dragon"
                state={celebratingMascot ? 'celebrating' : 'idle'}
                size={48}
              />
            </div>
            <div className="dialogue-game__thinking">
              <span />
              <span />
              <span />
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Options */}
      <AnimatePresence>
        {currentLine && currentLine.options && (
          <motion.div
            className="dialogue-game__options"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
          >
            <p className="dialogue-game__options-label">
              {lang === 'tr' ? 'Sen ne dersin?' : 'What do you say?'}
            </p>
            {currentLine.options.map((option, idx) => {
              const state = optionState[option.id] ?? 'idle';
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  className={getOptionClass(option.id)}
                  onClick={() => handleOptionSelect(currentQuestionIndex!, option)}
                  disabled={isAdvancing}
                  initial={{ opacity: 0, y: 12 }}
                  animate={
                    state === 'wrong'
                      ? { opacity: 1, y: 0, x: [-6, 6, -5, 5, -3, 3, 0] }
                      : { opacity: 1, y: 0, x: 0 }
                  }
                  transition={{ type: 'spring', stiffness: 300, damping: 22, delay: idx * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {state === 'correct' && <CheckCircle size={18} style={{ flexShrink: 0 }} />}
                  <span className="dialogue-game__option-text">
                    {lang === 'tr' && option.textTr ? option.textTr : option.text}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="dialogue-game__progress">
        {questionLines.map((qLine, i) => {
          const lineIdx = lines.indexOf(qLine);
          const isDone = answered.some((a) => a.lineIndex === lineIdx && a.correct);
          const isCurrent = currentQuestionIndex === lineIdx;
          return (
            <span
              key={i}
              className={[
                'dialogue-game__dot',
                isDone ? 'dialogue-game__dot--done' : '',
                isCurrent ? 'dialogue-game__dot--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          );
        })}
      </div>
    </div>
  );
}

DialogueGame.displayName = 'DialogueGame';
