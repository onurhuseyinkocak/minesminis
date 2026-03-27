/**
 * GameMascot — Mimi wanders in the right rail of the game canvas.
 * Always visible when a game is active.
 * Wanders up/down, occasionally waves.
 * Reacts to correct/wrong answers via 'mm:feedback' custom events.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LottieCharacter from '../LottieCharacter';
import type { CharacterState } from '../LottieCharacter';
import './GameMascot.css';

export interface MascotFeedbackDetail {
  feedback: 'correct' | 'wrong' | 'timeout' | null;
  onContinue?: () => void;
  xpEarned?: number;
  correctAnswer?: string;
  answerWasLabel?: string;
  continueLabel?: string;
}

const CORRECT_MSGS = [
  'Harika! ⭐',
  'Mükemmel!',
  'Süpersin! 🎉',
  'Tam isabet!',
  'Bravo!',
  'İşte bu!',
  'Aferin sana!',
  'Devam et böyle!',
];

const WRONG_MSGS = [
  'Neredeyse!',
  'Tekrar dene!',
  'Sen yapabilirsin!',
  'Yaklaşıyorsun!',
  'Az kaldı!',
  'Bir daha dene!',
  'Devam et!',
];

function pick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function GameMascot() {
  const [mascotState, setMascotState] = useState<CharacterState>('idle');
  const [topPct, setTopPct] = useState(30);
  const [activeFeedback, setActiveFeedback] = useState<MascotFeedbackDetail | null>(null);
  const [bubbleMsg, setBubbleMsg] = useState('');
  const continueCallbackRef = useRef<(() => void) | null>(null);

  // Listen for feedback events dispatched by AnswerFeedbackPanel
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<MascotFeedbackDetail>).detail;
      if (detail.feedback) {
        setActiveFeedback(detail);
        continueCallbackRef.current = detail.onContinue ?? null;
        setMascotState(detail.feedback === 'correct' ? 'happy' : 'idle');
        setBubbleMsg(
          detail.feedback === 'correct' ? pick(CORRECT_MSGS) : pick(WRONG_MSGS)
        );
      } else {
        setActiveFeedback(null);
        setMascotState('idle');
      }
    };
    window.addEventListener('mm:feedback', handler);
    return () => window.removeEventListener('mm:feedback', handler);
  }, []);

  // Idle wandering: random Y + occasional wave
  useEffect(() => {
    if (activeFeedback) return;

    const wander = () => {
      setTopPct(10 + Math.random() * 58);
      const roll = Math.random();
      setMascotState(roll < 0.28 ? 'wave' : 'idle');
    };

    wander();
    const id = setInterval(wander, 2600);
    return () => clearInterval(id);
  }, [activeFeedback]);

  // Auto-return from wave to idle
  useEffect(() => {
    if (mascotState !== 'wave') return;
    const t = setTimeout(() => setMascotState('idle'), 2400);
    return () => clearTimeout(t);
  }, [mascotState]);

  const handleContinue = () => {
    continueCallbackRef.current?.();
    setActiveFeedback(null);
    setMascotState('idle');
  };

  const isCorrect = activeFeedback?.feedback === 'correct';

  return (
    <>
      {/* Full-screen green flash on correct */}
      <AnimatePresence>
        {isCorrect && (
          <motion.div
            className="gm-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, times: [0, 0.25, 1], ease: 'easeOut' }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Wandering mascot */}
      <motion.div
        className="gm-char"
        animate={{ top: `${topPct}%` }}
        transition={{ type: 'spring', stiffness: 55, damping: 16 }}
      >
        {/* Speech bubble — appears to the LEFT of the mascot */}
        <AnimatePresence>
          {activeFeedback && (
            <motion.div
              className={`gm-bubble gm-bubble--${isCorrect ? 'correct' : 'wrong'}`}
              initial={{ opacity: 0, scale: 0.75, x: 12 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.75, x: 12 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            >
              <p className="gm-bubble__msg">{bubbleMsg}</p>

              {isCorrect && (activeFeedback.xpEarned ?? 0) > 0 && (
                <motion.span
                  className="gm-bubble__xp"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.18, type: 'spring', stiffness: 320 }}
                >
                  +{activeFeedback.xpEarned} XP
                </motion.span>
              )}

              {!isCorrect && activeFeedback.correctAnswer && (
                <span className="gm-bubble__answer">
                  {activeFeedback.answerWasLabel ?? 'Doğru:'}{' '}
                  <strong>{activeFeedback.correctAnswer}</strong>
                </span>
              )}

              <button
                type="button"
                className="gm-bubble__btn"
                onClick={handleContinue}
                autoFocus
              >
                {activeFeedback.continueLabel ?? 'Devam'}
              </button>

              {/* Bubble tail pointing right toward mascot */}
              <span className="gm-bubble__tail" aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>

        <LottieCharacter state={mascotState} size={88} />
      </motion.div>
    </>
  );
}
