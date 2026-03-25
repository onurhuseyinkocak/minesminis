import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  if (completed) {
    return (
      <motion.div
        className="dialogue-game__summary"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <UnifiedMascot id="mimi_dragon" state="celebrating" size={96} />
        <h2 className="dialogue-game__summary-title">
          {lang === 'tr' ? 'Harika!' : 'Awesome!'}
        </h2>
        <p className="dialogue-game__summary-score">
          {correctCount} / {totalQuestions}
        </p>
        <p className="dialogue-game__summary-label">
          {lang === 'tr' ? 'Doğru cevap' : 'Correct answers'}
        </p>
      </motion.div>
    );
  }

  const currentLine = currentQuestionIndex !== null ? lines[currentQuestionIndex] : null;
  const celebratingMascot = mascotState === 'celebrating';

  return (
    <div className="dialogue-game">
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
            {currentLine.options.map((option) => (
              <motion.button
                key={option.id}
                type="button"
                className={getOptionClass(option.id)}
                onClick={() => handleOptionSelect(currentQuestionIndex!, option)}
                disabled={isAdvancing}
                whileTap={{ scale: 0.97 }}
                animate={
                  optionState[option.id] === 'wrong'
                    ? { x: [-6, 6, -5, 5, -3, 3, 0] }
                    : { x: 0 }
                }
                transition={{ duration: 0.4 }}
              >
                <span className="dialogue-game__option-text">
                  {lang === 'tr' && option.textTr ? option.textTr : option.text}
                </span>
              </motion.button>
            ))}
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
