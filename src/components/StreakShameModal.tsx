/**
 * StreakShameModal
 * Loss aversion popup: "Mimi sizi özlüyor" when streak is at risk.
 * Shown in Dashboard when user hasn't practiced today and it's after 4pm.
 * Duolingo's most powerful retention mechanism: fear of losing the streak.
 */
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, X } from 'lucide-react';
import UnifiedMascot from './UnifiedMascot';
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

export function StreakShameModal({ streakDays, lang = 'tr', onDismiss, mascotId = 'mimi_dragon' }: StreakShameModalProps) {
  const navigate = useNavigate();
  const hoursLeft = getStreakSafeHours();
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (!hasPlayedSound.current) {
      SFX.wrong();
      hasPlayedSound.current = true;
    }
    markStreakShameShown();
  }, []);

  const handleStart = () => {
    onDismiss();
    navigate('/lesson');
  };

  const urgencyColor = hoursLeft <= 2 ? 'var(--color-error-500)' : 'var(--color-primary-500)';

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
        aria-label={lang === 'tr' ? 'Seri uyarısı' : 'Streak warning'}
      >
        <motion.div
          className="ssm__card"
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

          {/* Mascot — sad state */}
          <div className="ssm__mascot">
            <UnifiedMascot id={mascotId} state="sleeping" size={100} />
          </div>

          {/* Streak fire badge */}
          <div className="ssm__streak-badge">
            <Flame size={18} style={{ color: urgencyColor }} />
            <span className="ssm__streak-count" style={{ color: urgencyColor }}>
              {streakDays}
            </span>
          </div>

          {/* Headline */}
          <h2 className="ssm__title">
            {lang === 'tr'
              ? 'Serinizi kaybetmek üzeresiniz!'
              : "You're about to lose your streak!"}
          </h2>

          {/* Message */}
          <p className="ssm__body">
            {lang === 'tr' ? (
              <>
                Mimi <strong>{streakDays} günlük</strong> serinizin gitmesini istemiyor.
                Bugün henüz pratik yapmadınız.
              </>
            ) : (
              <>
                Mimi doesn't want your <strong>{streakDays}-day</strong> streak to end.
                You haven't practiced today yet.
              </>
            )}
          </p>

          {/* Urgency countdown */}
          <div className="ssm__urgency" style={{ color: urgencyColor }}>
            <Flame size={14} />
            <span>
              {lang === 'tr'
                ? `${hoursLeft} saat içinde biter`
                : `Ends in ${hoursLeft} hours`}
            </span>
          </div>

          {/* CTA */}
          <button
            type="button"
            className="ssm__cta"
            onClick={handleStart}
          >
            {lang === 'tr' ? 'Hemen Başla' : 'Start Now'}
          </button>

          {/* Dismiss */}
          <button
            type="button"
            className="ssm__dismiss"
            onClick={onDismiss}
          >
            {lang === 'tr' ? 'Serime izin ver' : 'Let my streak end'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default StreakShameModal;
