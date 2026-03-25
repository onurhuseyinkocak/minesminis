/**
 * LESSON COMPLETE SCREEN
 * Full-screen celebration overlay shown when a child finishes a lesson/game.
 *
 * Animation sequence:
 *  0ms   — Overlay fades in
 *  150ms — Central card scales up (0.8 → 1.0) with spring
 *  300ms — Mascot pops in with "celebrating" state
 *  500ms — Stars appear one by one (3 stars, 200ms stagger)
 *  900ms — XP counter counts up 0 → xpEarned (700ms, rAF)
 *  1200ms — Continue button slides up and becomes tappable
 *  1600ms — ConfettiRain starts if xpEarned >= 20
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Flame } from 'lucide-react';
import UnifiedMascot from './UnifiedMascot';
import { ConfettiRain } from './ui/Celebrations';
import { useLanguage } from '../contexts/LanguageContext';
import './LessonCompleteScreen.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LessonCompleteScreenProps {
  xpEarned: number;
  wordsLearned?: string[];
  streakDays?: number;
  onContinue: () => void;
  mascotId?: string;
  newBadge?: { name: string; icon: string };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseLessonCompleteReturn {
  show: boolean;
  screenProps: LessonCompleteScreenProps | null;
  trigger: (screenProps: LessonCompleteScreenProps) => void;
  dismiss: () => void;
}

export function useLessonComplete(): UseLessonCompleteReturn {
  const [show, setShow] = useState(false);
  const [screenProps, setScreenProps] = useState<LessonCompleteScreenProps | null>(null);

  const trigger = useCallback((nextProps: LessonCompleteScreenProps) => {
    setScreenProps(nextProps);
    setShow(true);
  }, []);

  const dismiss = useCallback(() => {
    setShow(false);
    setScreenProps(null);
  }, []);

  return { show, screenProps, trigger, dismiss };
}

// ─── Component ────────────────────────────────────────────────────────────────

const STAR_STAGGER_MS = 200;
const XP_START_MS = 900;
const XP_DURATION_MS = 700;
const BUTTON_SHOW_MS = 1200;
const CONFETTI_START_MS = 1600;
const CONFETTI_MIN_XP = 20;

export function LessonCompleteScreen({
  xpEarned,
  wordsLearned = [],
  streakDays,
  onContinue,
  mascotId = 'mimi_dragon',
  newBadge,
}: LessonCompleteScreenProps) {
  const { lang, t } = useLanguage();
  const [mascotVisible, setMascotVisible] = useState(false);
  const [starsVisible, setStarsVisible] = useState<boolean[]>([false, false, false]);
  const [xpDisplayed, setXpDisplayed] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);
  const [buttonTappable, setButtonTappable] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Kick off the animation sequence
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // 300ms — mascot pop in
    timers.push(setTimeout(() => setMascotVisible(true), 300));

    // 500ms, 700ms, 900ms — stars one by one
    for (let i = 0; i < 3; i++) {
      timers.push(
        setTimeout(() => {
          setStarsVisible((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, 500 + i * STAR_STAGGER_MS)
      );
    }

    // 900ms — XP counter rAF animation
    timers.push(
      setTimeout(() => {
        const startTime = performance.now();
        const animate = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / XP_DURATION_MS, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setXpDisplayed(Math.round(eased * xpEarned));
          if (progress < 1) {
            rafRef.current = requestAnimationFrame(animate);
          }
        };
        rafRef.current = requestAnimationFrame(animate);
      }, XP_START_MS)
    );

    // 1200ms — button slides up
    timers.push(setTimeout(() => setButtonVisible(true), BUTTON_SHOW_MS));
    // small extra delay so user doesn't accidentally tap during animation
    timers.push(setTimeout(() => setButtonTappable(true), BUTTON_SHOW_MS + 200));

    // 1600ms — confetti if xpEarned >= threshold
    if (xpEarned >= CONFETTI_MIN_XP) {
      timers.push(setTimeout(() => setConfettiVisible(true), CONFETTI_START_MS));
    }

    return () => {
      timers.forEach(clearTimeout);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [xpEarned]);

  const handleContinue = () => {
    if (!buttonTappable) return;
    onContinue();
  };

  return (
    <div className="lcs-overlay" role="dialog" aria-modal="true" aria-label={lang === 'tr' ? 'Ders tamamlandı' : 'Lesson complete'}>
      {/* Confetti layer */}
      {confettiVisible && <ConfettiRain duration={3000} />}

      {/* Central card */}
      <motion.div
        className="lcs-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 280, damping: 22 }}
      >
        {/* Mascot */}
        <div className="lcs-mascot-wrap">
          <AnimatePresence>
            {mascotVisible && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                <UnifiedMascot
                  id={mascotId}
                  state="celebrating"
                  size={120}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Heading */}
        <h1 className="lcs-title">{lang === 'tr' ? 'Harika!' : 'Amazing!'}</h1>
        <p className="lcs-subtitle">{t('lesson.complete')}</p>

        {/* Stars */}
        <div className="lcs-stars" aria-label="3 stars earned">
          {starsVisible.map((visible, i) => (
            <motion.span
              key={i}
              className="lcs-star"
              initial={{ scale: 0, rotate: -30 }}
              animate={visible ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -30 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              aria-hidden="true"
            >
              <Star size={28} fill="currentColor" />
            </motion.span>
          ))}
        </div>

        {/* XP counter */}
        <div className="lcs-xp-row">
          <span className="lcs-xp-label">{lang === 'tr' ? 'XP Kazandın' : 'XP Earned'}</span>
          <span className="lcs-xp-value">+{xpDisplayed}</span>
        </div>

        {/* Streak */}
        {streakDays !== undefined && streakDays > 0 && (
          <div className="lcs-streak">
            <span className="lcs-streak-fire"><Flame size={20} /></span>
            <span className="lcs-streak-text">{streakDays} {t('common.dayStreak')}!</span>
          </div>
        )}

        {/* Words learned */}
        {wordsLearned.length > 0 && (
          <div className="lcs-words">
            <p className="lcs-words-label">{lang === 'tr' ? 'Öğrendiğin kelimeler' : 'Words you learned'}</p>
            <div className="lcs-words-list">
              {wordsLearned.slice(0, 8).map((w) => (
                <span key={w} className="lcs-word-chip">{w}</span>
              ))}
            </div>
          </div>
        )}

        {/* New badge */}
        {newBadge && (
          <motion.div
            className="lcs-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 18 }}
          >
            <span className="lcs-badge-icon">{newBadge.icon}</span>
            <span className="lcs-badge-name">{newBadge.name}</span>
          </motion.div>
        )}

        {/* Continue button */}
        <AnimatePresence>
          {buttonVisible && (
            <motion.button
              type="button"
              className="lcs-continue-btn"
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onClick={handleContinue}
              disabled={!buttonTappable}
              aria-label={t('common.continue')}
            >
              {t('common.continue')}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

LessonCompleteScreen.displayName = 'LessonCompleteScreen';

export default LessonCompleteScreen;
