/**
 * StreakReminderModal
 * Positive reminder: "Mimi özlüyor seni!" when streak is at risk.
 * Shows after 4pm if user hasn't practiced today.
 * Encouraging tone — never shame or fear.
 */
import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, X, Clock } from 'lucide-react';
import LottieCharacter from './LottieCharacter';
import {
  markStreakShameShown,
  getStreakSafeHours,
} from '../services/psychGamification';
import { SFX } from '../data/soundLibrary';
import './StreakShameModal.css';

interface StreakShameModalProps {
  streakDays: number;
  lang?: 'tr' | 'en';
  onDismiss: () => void;
  mascotId?: string;
}

export function StreakShameModal({ streakDays, lang = 'tr', onDismiss }: StreakShameModalProps) {
  const navigate = useNavigate();
  const hoursLeft = getStreakSafeHours();
  const hasPlayedSound = useRef(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (!hasPlayedSound.current) {
      SFX.correct(); // positive sound instead of wrong
      hasPlayedSound.current = true;
    }
    markStreakShameShown();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleStart = () => {
    onDismiss();
    navigate('/lesson');
  };

  return (
    <AnimatePresence>
      <motion.div
        className="ssm__overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
        role="dialog"
        aria-modal="true"
        aria-label={lang === 'tr' ? 'Hatırlatma' : 'Reminder'}
      >
        <motion.div
          className="ssm__card ssm__card--positive"
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            className="ssm__close"
            onClick={onDismiss}
            aria-label={lang === 'tr' ? 'Kapat' : 'Close'}
          >
            <X size={18} />
          </button>

          {/* Mascot — wave state */}
          <div className="ssm__mascot">
            <LottieCharacter state="wave" size={100} />
          </div>

          {/* Streak badge — positive color */}
          {streakDays > 0 && (
            <div className="ssm__streak-badge ssm__streak-badge--gold">
              <Flame size={18} className="ssm__streak-flame" />
              <span className="ssm__streak-count">
                {streakDays}
              </span>
            </div>
          )}

          {/* Headline — positive */}
          <h2 className="ssm__title">
            {lang === 'tr'
              ? 'Mimi seni bekliyor!'
              : 'Mimi is waiting for you!'}
          </h2>

          {/* Message */}
          <p className="ssm__body">
            {lang === 'tr' ? (
              <>
                Bugün henüz ders yapmadın.{' '}
                {streakDays > 0 && <><strong>{streakDays} günlük</strong> serine devam et!</>}
                {streakDays === 0 && <>Hadi birlikte başlayalım!</>}
              </>
            ) : (
              <>
                You haven't practiced today yet.{' '}
                {streakDays > 0 && <>Keep your <strong>{streakDays}-day</strong> streak going!</>}
                {streakDays === 0 && <>Let's start together!</>}
              </>
            )}
          </p>

          {hoursLeft > 0 && hoursLeft <= 4 && (
            <div className="ssm__urgency">
              <Clock size={14} />
              <span>
                {lang === 'tr'
                  ? `Bugün ${hoursLeft} saat kaldı`
                  : `${hoursLeft} hours left today`}
              </span>
            </div>
          )}

          {/* CTA */}
          <button
            type="button"
            className="ssm__cta"
            onClick={handleStart}
          >
            {lang === 'tr' ? 'Hadi Başlayalım!' : "Let's Go!"}
          </button>

          {/* Dismiss */}
          <button
            type="button"
            className="ssm__dismiss"
            onClick={onDismiss}
          >
            {lang === 'tr' ? 'Sonra hatırlat' : 'Remind me later'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default StreakShameModal;
