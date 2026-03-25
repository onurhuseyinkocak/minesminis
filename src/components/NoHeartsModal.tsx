import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHearts } from '../contexts/HeartsContext';
import { useLanguage } from '../contexts/LanguageContext';
import './NoHeartsModal.css';

// ── SVG heart icon ────────────────────────────────────────────────────────────

const BrokenHeartSVG = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="no-hearts-icon"
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// ── Timer helper ──────────────────────────────────────────────────────────────

function formatMs(ms: number): string {
  if (ms <= 0) return '0:00';
  const totalSec = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface NoHeartsModalProps {
  onClose: () => void;
  onWatchAd?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NoHeartsModal({ onClose, onWatchAd: _onWatchAd }: NoHeartsModalProps) {
  const { getRegenTimeMs } = useHearts();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [regenMs, setRegenMs] = useState<number>(getRegenTimeMs());

  useEffect(() => {
    setRegenMs(getRegenTimeMs());

    const id = setInterval(() => {
      const remaining = getRegenTimeMs();
      setRegenMs(remaining);
      if (remaining <= 0) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [getRegenTimeMs]);

  const isTR = lang === 'tr';

  const title = isTR ? 'Kalplerin Bitti!' : 'Out of Hearts!';
  const body = isTR
    ? 'Kalplerin bitmeden önce hataları azalt ya da Premium üye ol.'
    : 'Reduce mistakes or go Premium for unlimited hearts.';
  const timerLabel = isTR ? 'Sonraki kalbe kalan süre' : 'Next heart in';
  const premiumBtn = isTR ? 'Devam Et (Premium)' : 'Continue (Premium)';
  const backBtn = isTR ? 'Geri Dön' : 'Go Back';

  return (
    <AnimatePresence>
      <motion.div
        className="no-hearts-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="no-hearts-card"
          initial={{ scale: 0.75, opacity: 0, y: 32 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          <BrokenHeartSVG />

          <h2 className="no-hearts-title">{title}</h2>
          <p className="no-hearts-body">{body}</p>

          {regenMs > 0 && (
            <div className="no-hearts-timer">
              <span className="no-hearts-timer__label">{timerLabel}</span>
              <span className="no-hearts-timer__countdown" aria-live="polite">
                {formatMs(regenMs)}
              </span>
            </div>
          )}

          <div className="no-hearts-actions">
            <button
              type="button"
              className="no-hearts-btn no-hearts-btn--primary"
              onClick={() => navigate('/premium')}
            >
              {premiumBtn}
            </button>
            <button
              type="button"
              className="no-hearts-btn no-hearts-btn--secondary"
              onClick={onClose}
            >
              {backBtn}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

NoHeartsModal.displayName = 'NoHeartsModal';

export default NoHeartsModal;
